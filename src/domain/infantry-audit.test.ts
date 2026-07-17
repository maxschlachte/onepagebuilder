// Regression coverage for `isInfantry`/`affectsAllModels` (see the
// `melee-weapon-audit`/`weapon-count-audit` tests for the same pattern): both
// are derived heuristics rather than authored flags (design.md decisions 2/3
// of infantry-combine-and-attach; decision 1 of
// fix-combined-unit-whole-upgrade-scope for affectsAllModels specifically),
// so this audits every unit and upgrade option currently in the rules
// database against the exclusion they're meant to implement.
import { describe, expect, it } from 'vitest'
import { getFaction, rulesDatabase } from '../data/index'
import { affectsAllModels, isInfantry } from './calc'

describe('isInfantry database audit', () => {
  it('excludes every current Hero/Psyker/Wizard/Monster/Vehicle unit', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const unit of faction.units) {
        const excludingRule = unit.specialRules.find((r) =>
          ['hero', 'psyker', 'wizard', 'monster', 'vehicle'].includes(r.ruleId),
        )
        if (excludingRule && isInfantry(unit)) {
          problems.push(`${faction.id}/${unit.name}: has "${excludingRule.ruleId}" but isInfantry() returned true`)
        }
      }
    }
    expect(problems).toEqual([])
  })
})

describe('affectsAllModels database audit', () => {
  it('never classifies a "removeOneEquipment" section as whole-unit', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          const hasPerModelSwap = section.options.some((o) => o.effects?.removeOneEquipment?.length)
          if (hasPerModelSwap && affectsAllModels(section)) {
            problems.push(
              `${faction.id}/${group.id}/${section.title}: contains a removeOneEquipment option but affectsAllModels() returned true`,
            )
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('never classifies an "all"-titled section as per-model', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (/\ball\b/i.test(section.title) && !affectsAllModels(section)) {
            problems.push(`${faction.id}/${group.id}/${section.title}: title says "all" but affectsAllModels() returned false`)
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('classifies previously-miscategorized single-model options as per-model', () => {
    const sm = getFaction('space-marines')!
    const orks = getFaction('orks')!

    // (faction, containing section title, option label) — the section title
    // disambiguates options whose label is reused across multiple sections.
    const checks: { faction: NonNullable<ReturnType<typeof getFaction>>; sectionTitle: string; label: string }[] = [
      { faction: sm, sectionTitle: 'Upgrade one model with one', label: 'Narthecium' },
      { faction: sm, sectionTitle: 'Upgrade one model with one', label: 'Battle Standard' },
      { faction: orks, sectionTitle: 'Replace Pistol', label: 'Kustom Force Field' },
      { faction: orks, sectionTitle: 'Replace Pistol', label: 'Shokk Attack Gun' },
      { faction: sm, sectionTitle: 'Replace Machinegun', label: 'Multi-Melta' },
    ]

    for (const { faction, sectionTitle, label } of checks) {
      const section = faction.upgradeGroups
        .flatMap((g) => g.sections)
        .find((s) => s.title === sectionTitle && s.options.some((o) => o.label === label))
      expect(section, `expected to find "${label}" in a "${sectionTitle}" section for ${faction.id}`).toBeDefined()
      expect(affectsAllModels(section!), `expected "${label}" (section "${sectionTitle}") to be per-model`).toBe(
        false,
      )
    }
  })
})

describe('oncePerUnit database audit (sergeant-musician-standard-whole-unit)', () => {
  const SERGEANT_MUSICIAN_STANDARD = new Set(['Sergeant', 'Musician', 'Standard'])

  function isSergeantMusicianStandardSection(section: { options: { label: string }[] }): boolean {
    const labels = new Set(section.options.map((o) => o.label))
    return labels.size === SERGEANT_MUSICIAN_STANDARD.size && [...labels].every((l) => SERGEANT_MUSICIAN_STANDARD.has(l))
  }

  it('every faction\'s Sergeant/Musician/Standard section is marked oncePerUnit and classified whole-unit', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (!isSergeantMusicianStandardSection(section)) continue
          if (!section.oncePerUnit) {
            problems.push(`${faction.id}/${group.id}/"${section.title}": Sergeant/Musician/Standard section is missing oncePerUnit`)
          }
          if (!affectsAllModels(section)) {
            problems.push(`${faction.id}/${group.id}/"${section.title}": affectsAllModels() returned false`)
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('no non-Sergeant/Musician/Standard section is marked oncePerUnit', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          if (section.oncePerUnit && !isSergeantMusicianStandardSection(section)) {
            problems.push(`${faction.id}/${group.id}/"${section.title}": marked oncePerUnit but isn't the Sergeant/Musician/Standard section`)
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('exactly 16 Sergeant/Musician/Standard sections exist, one per Warhammer Fantasy faction', () => {
    const fantasyFactions = rulesDatabase.factions.filter((f) => f.system === 'system-fantasy')
    expect(fantasyFactions).toHaveLength(16)
    for (const faction of fantasyFactions) {
      const matches = faction.upgradeGroups.flatMap((g) => g.sections).filter(isSergeantMusicianStandardSection)
      expect(matches, `expected exactly one Sergeant/Musician/Standard section for ${faction.id}`).toHaveLength(1)
    }
  })
})
