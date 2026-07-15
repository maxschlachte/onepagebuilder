import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import { createResolver } from '../domain/resolve'
import { maxHeroes } from './composition'

describe('rules database integrity', () => {
  it('contains all 15 Grimdark Future factions and all 16 Age of Fantasy factions', () => {
    expect(rulesDatabase.factions.filter((f) => f.system === 'system-40k')).toHaveLength(15)
    expect(rulesDatabase.factions.filter((f) => f.system === 'system-fantasy')).toHaveLength(16)
  })

  it('has unique faction ids', () => {
    const ids = rulesDatabase.factions.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every unit references only upgrade-group letters that exist in its faction', () => {
    for (const faction of rulesDatabase.factions) {
      const letters = new Set(faction.upgradeGroups.map((g) => g.id))
      for (const unit of faction.units) {
        for (const letter of unit.upgradeGroups) {
          expect(letters, `${faction.id}/${unit.name} → group ${letter}`).toContain(letter)
        }
      }
    }
  })

  it('has unique unit ids within each faction', () => {
    for (const faction of rulesDatabase.factions) {
      const ids = faction.units.map((u) => u.id)
      expect(new Set(ids).size, faction.id).toBe(ids.length)
    }
  })

  it('has unique upgrade-option ids within each faction', () => {
    for (const faction of rulesDatabase.factions) {
      const ids = faction.upgradeGroups.flatMap((g) => g.sections.flatMap((s) => s.options.map((o) => o.id)))
      expect(new Set(ids).size, faction.id).toBe(ids.length)
    }
  })

  it('every upgrade group has at least one section, and every section at least one option', () => {
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        expect(group.sections.length, `${faction.id}/${group.id}`).toBeGreaterThan(0)
        for (const sec of group.sections) {
          expect(sec.options.length, `${faction.id}/${group.id}/${sec.title}`).toBeGreaterThan(0)
        }
      }
    }
  })

  it('every option id referenced by a section prerequisite resolves to a real option in the same faction', () => {
    for (const faction of rulesDatabase.factions) {
      const allIds = new Set(
        faction.upgradeGroups.flatMap((g) => g.sections.flatMap((s) => s.options.map((o) => o.id))),
      )
      for (const group of faction.upgradeGroups) {
        for (const sec of group.sections) {
          const prereq = sec.prerequisite
          if (!prereq) continue
          const referenced = [
            ...(prereq.blockedBySelecting ?? []),
            ...(prereq.blockedBySelectingOnSingleModel ?? []),
            ...(prereq.requiresOneOfSelected ?? []),
          ]
          for (const id of referenced) {
            expect(allIds, `${faction.id}/${group.id}/${sec.title} → ${id}`).toContain(id)
          }
        }
      }
    }
  })

  it('every satisfiedByEquipment key matches a baseline equipment key on some unit that can use the section', () => {
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        const unitsInGroup = faction.units.filter((u) => u.upgradeGroups.includes(group.id))
        const equipmentKeys = new Set(unitsInGroup.flatMap((u) => u.equipment.map((e) => e.key)))
        for (const sec of group.sections) {
          for (const key of sec.prerequisite?.satisfiedByEquipment ?? []) {
            expect(equipmentKeys, `${faction.id}/${group.id}/${sec.title} → "${key}"`).toContain(key)
          }
        }
      }
    }
  })

  it('every removeEquipment/removeOneEquipment key matches equipment reachable by the option', () => {
    // "Reachable" means either a baseline equipment key on some unit in the group, or
    // a key some option anywhere in the faction can add via its own addEquipment — the
    // common "produce X, then modify X" chain (e.g. replace a rifle with a pistol+CCW combo,
    // then separately upgrade that CCW), which can legitimately cross group letters for a
    // unit that has access to both (e.g. Space Marines' Captain: group A produces a
    // Stormbolter, group H's "Replace one Stormbolter" consumes it). The store enforces that
    // such a chain is only selectable in order via that section's own `requiresOneOfSelected`
    // prerequisite (covered by the upgrade-prerequisites capability's own tests) — this check
    // only guards against a typo'd/fabricated removal target, not prerequisite completeness.
    // Matching is by exact equipment key (see `EquipmentEntry.key`), which already folds
    // pluralization/casing/inline-profile differences, so no separate normalization is needed.
    const missing: string[] = []
    for (const faction of rulesDatabase.factions) {
      const producibleFactionWide = new Set(
        faction.upgradeGroups.flatMap((g) =>
          g.sections.flatMap((s) => s.options.flatMap((o) => o.effects?.addEquipment?.map((e) => e.key) ?? [])),
        ),
      )
      for (const group of faction.upgradeGroups) {
        const unitsInGroup = faction.units.filter((u) => u.upgradeGroups.includes(group.id))
        const reachableKeys = new Set([
          ...unitsInGroup.flatMap((u) => u.equipment.map((e) => e.key)),
          ...producibleFactionWide,
        ])
        for (const sec of group.sections) {
          for (const opt of sec.options) {
            for (const key of opt.effects?.removeEquipment ?? []) {
              if (!reachableKeys.has(key)) {
                missing.push(`${faction.id}/${group.id}/${sec.title} → ${opt.label} removes "${key}"`)
              }
            }
            for (const key of opt.effects?.removeOneEquipment ?? []) {
              if (!reachableKeys.has(key)) {
                missing.push(`${faction.id}/${group.id}/${sec.title} → ${opt.label} removes one "${key}"`)
              }
            }
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('every addEquipment label is not a fabricated weapon name', () => {
    // Every addEquipment entry should be traceable to something already known in
    // the faction — a global weapon name (src/data/weapons.ts, ignoring a `Linked `/
    // `Nx ` prefix and pluralization), some unit's baseline equipment label, another
    // option's own label, or a substring of *this* option's own label (compound
    // labels like "Pistol and Medium CCW" are legitimately split into separate
    // addEquipment entries) — rather than a name invented during data authoring.
    // This does NOT assert every entry resolves a full weapon profile — it only
    // checks the label text is plausible, independent of whether it happens to
    // reference a global weapon, a melee tier/type, or a bespoke profile.
    function isKnownWeaponName(label: string, globalWeaponNames: Set<string>): boolean {
      const baseName = label.replace(/^\d+x\s+/, '').replace(/\s*\(.+\)\s*$/, '')
      const normalized = baseName.toLowerCase().replace(/^linked\s+/, '').replace(/s$/, '')
      return globalWeaponNames.has(normalized)
    }

    const missing: string[] = []
    for (const faction of rulesDatabase.factions) {
      const globalWeaponNames = new Set(
        rulesDatabase.weapons[faction.system].map((w) => w.name.toLowerCase().replace(/s$/, '')),
      )
      const knownLabels = new Set([
        ...faction.units.flatMap((u) => u.equipment.map((e) => e.label)),
        ...faction.upgradeGroups.flatMap((g) => g.sections.flatMap((s) => s.options.map((o) => o.label))),
      ])
      for (const group of faction.upgradeGroups) {
        for (const sec of group.sections) {
          for (const opt of sec.options) {
            for (const entry of opt.effects?.addEquipment ?? []) {
              const isSubstringOfOwnLabel = opt.label.includes(entry.label)
              if (!knownLabels.has(entry.label) && !isKnownWeaponName(entry.label, globalWeaponNames) && !isSubstringOfOwnLabel) {
                missing.push(`${faction.id}/${group.id}/${sec.title} → ${opt.label} (${entry.label})`)
              }
            }
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('resolves every special-rule reference on every unit', () => {
    const missing: string[] = []
    for (const faction of rulesDatabase.factions) {
      const resolver = createResolver(rulesDatabase, faction)
      for (const unit of faction.units) {
        for (const ref of unit.specialRules) {
          if (resolver.resolve(ref).text === 'Rule text not found.') {
            missing.push(`${faction.id}/${unit.name} → ${ref.ruleId}`)
          }
        }
      }
    }
    expect(missing).toEqual([])
  })

  it('marks Hero units consistently with the hero rule', () => {
    const captain = rulesDatabase.factions
      .find((f) => f.id === 'space-marines')!
      .units.find((u) => u.name === 'Captain')!
    expect(captain.isHero).toBe(true)
    expect(captain.cost).toBe(65)
    expect(captain.quality).toBe('3+')
  })

  it('matches the composition hero table from the PDF', () => {
    expect(rulesDatabase.composition.defaultPointsCap).toBe(750)
    expect(maxHeroes(750)).toBe(1)
    expect(maxHeroes(1500)).toBe(2)
    expect(maxHeroes(6000)).toBe(8)
  })
})
