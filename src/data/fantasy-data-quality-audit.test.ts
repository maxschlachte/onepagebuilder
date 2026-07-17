// Regression coverage for the class of bug found when the Age of Fantasy faction
// data was first wired into the app: `armyRules`/`psychicPowers` text reconstructed
// from a multi-column PDF extraction can silently jam unrelated column fragments
// together (leftover point costs, other units' names), and a rule-granting `adds`
// token can silently degrade to a bare numeral (e.g. a `Wizard(2)` option authored
// as `adds: ["2"]` instead of `adds: ["Wizard(2)"]`). Neither is caught by the
// generic "resolves every special-rule reference" audit in index.test.ts, since
// that only walks baseline `unit.specialRules`, not upgrade-option effects.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import { weaponsFantasy } from './weapons-fantasy'
import type { EquipmentEntry } from '../domain/types'

const FANTASY_FACTIONS = rulesDatabase.factions.filter((f) => f.system === 'system-fantasy')

/** Canonical ranged-weapon stats from `weapons-fantasy.ts`, keyed by lowercase name. */
const RANGED_TABLE = new Map(
  weaponsFantasy.map((w) => [w.name.toLowerCase(), { range: w.range, attacks: w.attacks, ruleIds: w.rules.map((r) => r.ruleId) }]),
)

/** Normalize a weapon/equipment name the same way `index.test.ts`'s `isKnownWeaponName` does. */
function normalizeWeaponName(name: string): string {
  const baseName = name.replace(/^\d+x\s+/, '').replace(/\s*\(.+\)\s*$/, '')
  return baseName.toLowerCase().replace(/^linked\s+/, '').replace(/s$/, '')
}

/** Per one-page-fantasy-rules.md's Weapons section. */
const TIER_ATTACKS: Record<string, string> = {
  light: '1',
  medium: '2',
  heavy: '3',
  master: '4',
  force: '5',
}

/** Per one-page-fantasy-rules.md's Weapons section: the type word's innate rule, if any. */
const TYPE_RULE_IDS: Record<string, string[]> = {
  halberd: ['piercing'],
  mace: ['piercing', 'poison'],
  lance: ['impact'],
}

describe('Age of Fantasy data-quality audit', () => {
  it('every faction has a non-empty armyRules array', () => {
    const empty = FANTASY_FACTIONS.filter((f) => f.armyRules.length === 0).map((f) => f.id)
    expect(empty).toEqual([])
  })

  it('no armyRules/psychicPowers text contains a stray point-cost fragment (contamination smell test)', () => {
    const problems: string[] = []
    const costPattern = /\+\d+pts/
    for (const faction of FANTASY_FACTIONS) {
      for (const rule of faction.armyRules) {
        if (costPattern.test(rule.text)) problems.push(`${faction.id} armyRule "${rule.name}"`)
      }
      for (const power of faction.psychicPowers) {
        if (costPattern.test(power.text)) problems.push(`${faction.id} psychicPower "${power.name}"`)
      }
    }
    expect(problems).toEqual([])
  })

  it('no upgrade option adds a bare-numeral rule id (the `Wizard(N)` → `adds: ["N"]` bug class)', () => {
    const problems: string[] = []
    for (const faction of FANTASY_FACTIONS) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const ref of option.effects?.addRules ?? []) {
              if (/^\d+$/.test(ref.ruleId)) {
                problems.push(`${faction.id}/${group.id} opt "${option.label}": adds bare-numeral rule id "${ref.ruleId}"`)
              }
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  // Regression guard, not the primary safety net: after the fantasy-default-weapons
  // consolidation, virtually every melee entry is built via `meleeWeapon()`, which
  // derives attacks/innate-rules from `weapons.ts`/`meleeTypeRules` by construction
  // and so can't drift. This only still fires for a `customWeapon()` call whose name
  // happens to look like a tier-prefixed weapon (`"<Tier> <Type>"`) — i.e. it catches
  // a reintroduction of the hand-typed-duplicate pattern this change eliminated.
  it('every melee weapon\'s attacks match its tier, and Halberd/Mace/Lance carry their innate rule', () => {
    const problems: string[] = []

    function check(factionId: string, context: string, e: EquipmentEntry) {
      if (!e.weapon || e.weapon.range !== null) return
      const words = e.weapon.name.toLowerCase().split(/\s+/)
      const tier = words[0]
      const expectedAttacks = TIER_ATTACKS[tier]
      if (!expectedAttacks) return // not a tier-prefixed name (e.g. a bespoke ability)

      if (e.weapon.attacks !== expectedAttacks) {
        problems.push(`${factionId}/${context} "${e.weapon.name}": expected ${expectedAttacks} attacks (${tier} tier), got ${e.weapon.attacks}`)
      }

      const typeWord = words.slice(1).join('-').replace(/s$/, '')
      const expectedRuleIds = TYPE_RULE_IDS[typeWord]
      if (expectedRuleIds) {
        const ruleIds = new Set(e.weapon.rules.map((r) => r.ruleId))
        for (const ruleId of expectedRuleIds) {
          if (!ruleIds.has(ruleId)) {
            problems.push(`${factionId}/${context} "${e.weapon.name}": missing innate rule "${ruleId}" for type "${typeWord}"`)
          }
        }
      }
    }

    for (const faction of FANTASY_FACTIONS) {
      for (const unit of faction.units) {
        for (const e of unit.equipment) check(faction.id, `unit ${unit.name}`, e)
      }
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const e of option.effects?.addEquipment ?? []) {
              check(faction.id, `group ${group.id} opt "${option.label}"`, e)
            }
          }
        }
      }
    }

    expect(problems).toEqual([])
  })

  // Regression guard, not the primary safety net: after the fantasy-default-weapons
  // consolidation, ranged entries whose stats match a `weaponsFantasy` table entry are
  // built via `weaponFantasy()`, which resolves range/attacks/rules from that table by
  // construction. This only still fires for a `customWeapon()` call whose name happens
  // to match a canonical table entry's name — i.e. it catches a reintroduction of the
  // hand-typed-duplicate pattern this change eliminated.
  it('every standard-named custom weapon matches the Fantasy Weapons table', () => {
    const problems: string[] = []

    function check(factionId: string, context: string, e: EquipmentEntry) {
      if (!e.weapon) return
      const canonical = RANGED_TABLE.get(normalizeWeaponName(e.weapon.name))
      if (!canonical) return

      if (e.weapon.range !== canonical.range || e.weapon.attacks !== canonical.attacks) {
        problems.push(
          `${factionId}/${context} "${e.weapon.name}": expected range ${canonical.range} / attacks ${canonical.attacks}, got range ${e.weapon.range} / attacks ${e.weapon.attacks}`,
        )
      }

      const ruleIds = new Set(e.weapon.rules.map((r) => r.ruleId))
      for (const ruleId of canonical.ruleIds) {
        if (!ruleIds.has(ruleId)) {
          problems.push(`${factionId}/${context} "${e.weapon.name}": missing baseline rule "${ruleId}"`)
        }
      }
    }

    for (const faction of FANTASY_FACTIONS) {
      for (const unit of faction.units) {
        for (const e of unit.equipment) check(faction.id, `unit ${unit.name}`, e)
      }
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const e of option.effects?.addEquipment ?? []) {
              check(faction.id, `group ${group.id} opt "${option.label}"`, e)
            }
          }
        }
      }
    }

    expect(problems).toEqual([])
  })

  // Regression guard for fantasy-upgrade-equipment-fixes: a "Mount on:"-style option
  // (or an equivalent single-mount "Take one:"/"Replace <item>:" option that grants a
  // named vehicle/beast) must grant that mount's own weapon and special rules, per its
  // standalone-unit row in one-page-fantasy-army-lists.md — not a bare named equipment
  // entry that carries neither, which silently makes taking the mount cost points for
  // zero mechanical effect.
  it('every mount-granting option grants a weapon or rules, not a bare placeholder', () => {
    const problems: string[] = []
    for (const faction of FANTASY_FACTIONS) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (!/^Mount on/.test(section.title)) continue
          for (const option of section.options) {
            const entries = option.effects?.addEquipment ?? []
            const grantsSomething = entries.some((e) => e.weapon || (e.rules?.length ?? 0) > 0)
              || (option.effects?.addRules?.length ?? 0) > 0
            if (!grantsSomething) {
              problems.push(`${faction.id}/${group.id}/"${section.title}" → "${option.label}"`)
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  // Regression guard for fantasy-mount-inheritance: every "Mount on:"-style option must
  // mark its mount's gear() entry with isMount, or applyUpgrades' mount-rule-inheritance
  // fold (calc.ts) silently skips it — the mount's rules would then only ever show inline
  // on the equipment line, never merged into the unit's own special-rules summary.
  it('every option under a "Mount on:" section marks its mount equipment isMount', () => {
    const problems: string[] = []
    for (const faction of FANTASY_FACTIONS) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (!/^Mount on/.test(section.title)) continue
          for (const option of section.options) {
            const entries = option.effects?.addEquipment ?? []
            if (!entries.some((e) => e.isMount)) {
              problems.push(`${faction.id}/${group.id}/"${section.title}" → "${option.label}"`)
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  // Regression guard for fantasy-upgrade-equipment-fixes: a section whose printed
  // heading says it replaces existing equipment must actually remove it — otherwise a
  // model ends up dual-wielding its starting weapon plus the "replacement".
  it('every "Replace" section removes the equipment it claims to replace', () => {
    const problems: string[] = []
    for (const faction of FANTASY_FACTIONS) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (!/^Replace\b/.test(section.title)) continue
          for (const option of section.options) {
            const removes = (option.effects?.removeEquipment?.length ?? 0) > 0
              || (option.effects?.removeOneEquipment?.length ?? 0) > 0
            if (!removes) {
              problems.push(`${faction.id}/${group.id}/"${section.title}" → "${option.label}"`)
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })
})
