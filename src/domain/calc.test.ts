import { describe, expect, it } from 'vitest'
import { getFaction } from '../data/index'
import {
  affectsAllModels,
  applyUpgrades,
  combinedEffectiveUnit,
  findSection,
  groupDeployRuleIds,
  groupEffectiveUnit,
  heroCount,
  isInfantry,
  isSectionAvailable,
  pruneInvalidSelections,
  sharedGroupDeployRuleId,
  totalPoints,
  unitCost,
  validate,
} from './calc'
import { LIST_SCHEMA_VERSION, type ArmyList } from './list'
import type { Faction, UnitProfile, UpgradeOption, UpgradeSection } from './types'

const sm = getFaction('space-marines')!
const captain = sm.units.find((u) => u.name === 'Captain')!
const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
const librarian = sm.units.find((u) => u.name === 'Librarian')! // baseline Psyker(1)
const tyranids = getFaction('tyranids')!
const carnifex = tyranids.units.find((u) => u.name === 'Carnifex')! // Monster
const hiveTyrant = tyranids.units.find((u) => u.name === 'Hive Tyrant')! // Hero, Monster, Psyker
const lemanRuss = getFaction('imperial-guard')!.units.find((u) => u.name === 'Leman Russ')! // Vehicle

function optionId(faction: Faction, groupId: string, labelStartsWith: string): string {
  const group = faction.upgradeGroups.find((g) => g.id === groupId)!
  const options = group.sections.flatMap((s) => s.options)
  return options.find((o) => o.label.startsWith(labelStartsWith))!.id
}

function makeList(units: ArmyList['units'], pointsCap = 750): ArmyList {
  return {
    schemaVersion: LIST_SCHEMA_VERSION,
    id: 'test',
    name: 'Test',
    factionId: 'space-marines',
    pointsCap,
    units,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

describe('applyUpgrades', () => {
  it('returns base cost and rules with no upgrades', () => {
    const eff = applyUpgrades(captain, [], sm)
    expect(eff.cost).toBe(65)
    expect(eff.specialRules.map((r) => r.ruleId)).toContain('fearless')
  })

  it('adds an upgrade cost delta', () => {
    const sb = optionId(sm, 'A', 'Stormbolter')
    expect(applyUpgrades(captain, [sb], sm).cost).toBe(75)
  })

  it('applies an upgrade option’s added special rules', () => {
    const jump = optionId(sm, 'A', 'Jump Pack')
    const eff = applyUpgrades(captain, [jump], sm)
    expect(eff.cost).toBe(75) // 65 + 10
    const ids = eff.specialRules.map((r) => r.ruleId)
    expect(ids).toContain('deep-strike')
    expect(ids).toContain('flying')
  })

  it('ignores unknown upgrade ids', () => {
    expect(applyUpgrades(captain, ['nope'], sm).cost).toBe(65)
  })
})

describe('applyUpgrades — size-aware equipment effects', () => {
  const replaceOneOption: UpgradeOption = {
    id: 'A.0',
    label: 'Carbine',
    costDelta: 5,
    effects: {
      addEquipment: [{ key: 'carbine', label: 'Carbine' }],
      removeOneEquipment: ['pistol'],
    },
  }
  const replaceAllOption: UpgradeOption = {
    id: 'A.0',
    label: 'Carbines',
    costDelta: 10,
    effects: {
      addEquipment: [{ key: 'carbine', label: 'Carbine' }],
      removeEquipment: ['pistol'],
    },
  }

  function makeUnit(size: number): UnitProfile {
    return {
      id: 'test.unit',
      factionId: 'test',
      name: 'Test Unit',
      size,
      quality: '4+',
      equipment: [{ key: 'pistol', label: 'Pistol' }],
      specialRules: [],
      upgradeGroups: ['A'],
      cost: 10,
      isHero: false,
    }
  }

  function makeFaction(opt: UpgradeOption): Faction {
    return {
      id: 'test',
      name: 'Test',
      units: [],
      upgradeGroups: [{ id: 'A', sections: [{ title: 'x', selection: 'one', options: [opt] }] }],
      armyRules: [],
      psychicPowers: [],
    }
  }

  it('a "replace one X" option removes X and adds the new weapon on a single-model unit', () => {
    const eff = applyUpgrades(makeUnit(1), ['A.0'], makeFaction(replaceOneOption))
    expect(eff.equipment.map((e) => e.label)).toEqual(['Carbine', 'Light CCW'])
  })

  it('the same option reduces X\'s count by one and adds the new weapon with count 1, on a multi-model unit', () => {
    const eff = applyUpgrades(makeUnit(5), ['A.0'], makeFaction(replaceOneOption))
    expect(eff.equipment.map((e) => e.label)).toEqual(['Pistol', 'Carbine', 'Light CCW'])
    const pistol = eff.equipment.find((e) => e.label === 'Pistol')!
    const carbine = eff.equipment.find((e) => e.label === 'Carbine')!
    expect(pistol.unitCount).toBe(4)
    expect(carbine.unitCount).toBe(1)
  })

  it('a "replace all X" option removes X regardless of unit size and adds the new weapon at full unit size', () => {
    const eff = applyUpgrades(makeUnit(5), ['A.0'], makeFaction(replaceAllOption))
    expect(eff.equipment.map((e) => e.label)).toEqual(['Carbine', 'Light CCW'])
    const carbine = eff.equipment.find((e) => e.label === 'Carbine')!
    expect(carbine.unitCount).toBeUndefined() // defaults to the full unit size (5) at render time
  })

  it('a bare attachment option (no remove field) adds its weapon with count 1, leaving the original untouched', () => {
    const attachOption: UpgradeOption = {
      id: 'A.0',
      label: 'Flamer (Limited)',
      costDelta: 5,
      effects: { addEquipment: [{ key: 'flamer-limited', label: 'Flamer (Limited)' }] },
    }
    const eff = applyUpgrades(makeUnit(5), ['A.0'], makeFaction(attachOption))
    const pistol = eff.equipment.find((e) => e.label === 'Pistol')!
    const flamer = eff.equipment.find((e) => e.label === 'Flamer (Limited)')!
    expect(pistol.unitCount).toBeUndefined() // untouched, still defaults to the full unit size
    expect(flamer.unitCount).toBe(1)
  })

  it('a singular-authored replacement target matches a pluralized baseline label', () => {
    const singularTargetOption: UpgradeOption = {
      id: 'A.0',
      label: 'Shotgun',
      costDelta: 5,
      effects: { addEquipment: [{ key: 'shotgun', label: 'Shotgun' }], removeOneEquipment: ['rifle'] },
    }
    const unit: UnitProfile = {
      id: 'test.unit',
      factionId: 'test',
      name: 'Test Unit',
      size: 5,
      quality: '4+',
      equipment: [{ key: 'rifle', label: 'Rifles' }],
      specialRules: [],
      upgradeGroups: ['A'],
      cost: 10,
      isHero: false,
    }
    const eff = applyUpgrades(unit, ['A.0'], makeFaction(singularTargetOption))
    const rifles = eff.equipment.find((e) => e.label === 'Rifles')!
    expect(rifles.unitCount).toBe(4)
  })
})

describe('applyUpgrades — default melee weapon', () => {
  function makeUnit(equipment: UnitProfile['equipment'], upgradeGroups: string[] = []): UnitProfile {
    return {
      id: 'test.unit',
      factionId: 'test',
      name: 'Test Unit',
      size: 1,
      quality: '4+',
      equipment,
      specialRules: [],
      upgradeGroups,
      cost: 10,
      isHero: false,
    }
  }

  const noOpFaction: Faction = {
    id: 'test',
    name: 'Test',
    units: [],
    upgradeGroups: [],
    armyRules: [],
    psychicPowers: [],
  }

  it('appends a default Light CCW when the unit has no melee weapon', () => {
    const unit = makeUnit([{ key: 'assault-rifle', label: 'Assault Rifle', weapon: { id: 'assault-rifle', name: 'Assault Rifle', range: 24, attacks: '1', rules: [] } }])
    const eff = applyUpgrades(unit, [], noOpFaction)
    const ccw = eff.equipment.find((e) => e.label === 'Light CCW')
    expect(ccw?.weapon).toEqual({ id: 'light', name: 'Light', range: null, attacks: '1', rules: [] })
  })

  it('does not append a default when the unit already has a baseline melee weapon', () => {
    const unit = makeUnit([{ key: 'medium-ccw', label: 'Medium CCW', weapon: { id: 'medium', name: 'Medium', range: null, attacks: '2', rules: [] } }])
    const eff = applyUpgrades(unit, [], noOpFaction)
    expect(eff.equipment.some((e) => e.label === 'Light CCW')).toBe(false)
  })

  it('does not append a default once an upgrade adds a real melee weapon', () => {
    const unit = makeUnit([{ key: 'assault-rifle', label: 'Assault Rifle', weapon: { id: 'assault-rifle', name: 'Assault Rifle', range: 24, attacks: '1', rules: [] } }], ['A'])
    const faction: Faction = {
      ...noOpFaction,
      upgradeGroups: [
        {
          id: 'A',
          sections: [
            {
              title: 'x',
              selection: 'one',
              options: [
                {
                  id: 'A.0',
                  label: 'Medium Powersword',
                  costDelta: 5,
                  effects: {
                    addEquipment: [
                      { key: 'medium-powersword', label: 'Medium Powersword', weapon: { id: 'medium', name: 'Medium', range: null, attacks: '2', rules: [{ ruleId: 'piercing' }] } },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    }
    const eff = applyUpgrades(unit, ['A.0'], faction)
    expect(eff.equipment.some((e) => e.label === 'Light CCW')).toBe(false)
    expect(eff.equipment.some((e) => e.label === 'Medium Powersword')).toBe(true)
  })
})

describe('unitCost / totalPoints', () => {
  it('sums base costs plus upgrade deltas across the list', () => {
    const sb = optionId(sm, 'A', 'Stormbolter')
    const list = makeList([
      { instanceId: '1', unitId: captain.id, selectedUpgrades: [sb] }, // 75
      { instanceId: '2', unitId: tacticals.id, selectedUpgrades: [] }, // 120
    ])
    expect(unitCost(sm, captain.id, [sb])).toBe(75)
    expect(totalPoints(list, sm)).toBe(195)
  })
})

describe('heroCount', () => {
  it('counts only Hero units', () => {
    const list = makeList([
      { instanceId: '1', unitId: captain.id, selectedUpgrades: [] }, // Hero
      { instanceId: '2', unitId: tacticals.id, selectedUpgrades: [] }, // not Hero
    ])
    expect(heroCount(list, sm)).toBe(1)
  })
})

describe('validate', () => {
  it('flags over-cap lists', () => {
    const list = makeList(
      [{ instanceId: '1', unitId: tacticals.id, selectedUpgrades: [] }],
      100,
    )
    const issues = validate(list, sm)
    expect(issues.map((i) => i.kind)).toContain('over-cap')
  })

  it('flags exceeding the hero limit', () => {
    const chaplain = sm.units.find((u) => u.name === 'Chaplain')!
    const list = makeList([
      { instanceId: '1', unitId: captain.id, selectedUpgrades: [] },
      { instanceId: '2', unitId: chaplain.id, selectedUpgrades: [] },
    ]) // 2 heroes, cap 750 → limit 1
    expect(validate(list, sm).map((i) => i.kind)).toContain('hero-limit')
  })

  it('returns no issues for a legal list', () => {
    const list = makeList([{ instanceId: '1', unitId: captain.id, selectedUpgrades: [] }])
    expect(validate(list, sm)).toEqual([])
  })
})

describe('isSectionAvailable', () => {
  const attachmentSection = findSection(sm, optionId(sm, 'A', 'Flamer (Limited)'))!.section
  const stormbolter = optionId(sm, 'A', 'Stormbolter')

  it('blocks a single-model unit’s attachment section once its Assault Rifle is replaced', () => {
    expect(isSectionAvailable(captain, attachmentSection, [])).toBe(true)
    expect(isSectionAvailable(captain, attachmentSection, [stormbolter])).toBe(false)
  })

  it('leaves a multi-model unit’s attachment section available after replacing one rifle', () => {
    expect(isSectionAvailable(tacticals, attachmentSection, [stormbolter])).toBe(true)
  })

  it('blocks any unit, regardless of size, once all Assault Rifles are replaced', () => {
    const replaceAll = optionId(sm, 'F', 'Pistols and Medium CCWs')
    expect(isSectionAvailable(tacticals, attachmentSection, [replaceAll])).toBe(false)
  })

  it('requires one of a set of options to be selected (produced-item case)', () => {
    const sob = getFaction('sisters-of-battle')!
    const canoness = sob.units.find((u) => u.name === 'Canoness')!
    const replacePistolSection = findSection(sob, optionId(sob, 'A', 'Inferno Pistol'))!.section
    const pistolCombo = optionId(sob, 'A', 'Pistol and Medium CCW')
    const shotgun = optionId(sob, 'A', 'Shotgun')

    expect(isSectionAvailable(canoness, replacePistolSection, [])).toBe(false)
    expect(isSectionAvailable(canoness, replacePistolSection, [shotgun])).toBe(false)
    expect(isSectionAvailable(canoness, replacePistolSection, [pistolCombo])).toBe(true)
  })

  describe('satisfiedByEquipment (Orks Carbine attachment)', () => {
    const orks = getFaction('orks')!
    const boyz = orks.units.find((u) => u.name === 'Boyz')!
    const meganobz = orks.units.find((u) => u.name === 'Meganobz')!
    const warbikers = orks.units.find((u) => u.name === 'Warbikers')!
    const carbineAttachmentSection = findSection(orks, optionId(orks, 'A', 'Heavy Flamer (Limited)'))!
      .section
    const carbine = optionId(orks, 'A', 'Carbine')

    it('blocks a unit with no baseline Carbine until one is selected', () => {
      expect(isSectionAvailable(boyz, carbineAttachmentSection, [])).toBe(false)
      expect(isSectionAvailable(boyz, carbineAttachmentSection, [carbine])).toBe(true)
    })

    it('is available with no selections for units with a baseline Carbine', () => {
      expect(isSectionAvailable(meganobz, carbineAttachmentSection, [])).toBe(true)
      expect(isSectionAvailable(warbikers, carbineAttachmentSection, [])).toBe(true)
    })

    it('a selected option still satisfies the requirement even when satisfiedByEquipment is also declared', () => {
      expect(isSectionAvailable(boyz, carbineAttachmentSection, [carbine])).toBe(true)
    })
  })

  describe('requiresBaselineRule (Psyker level-up sections)', () => {
    const psykerSection = findSection(sm, optionId(sm, 'A', 'Psyker(2)'))!.section

    it('blocks a unit without the required baseline rule, regardless of selections', () => {
      expect(isSectionAvailable(captain, psykerSection, [])).toBe(false)
      expect(isSectionAvailable(tacticals, psykerSection, [])).toBe(false)
    })

    it('is available to a unit with the exact matching baseline rule', () => {
      expect(isSectionAvailable(librarian, psykerSection, [])).toBe(true)
    })

    it('is not satisfied by the unit having the same rule at a different level', () => {
      const daemons = getFaction('chaos-daemons')!
      const lordOfChange = daemons.units.find((u) => u.name === 'Lord of Change')! // baseline Psyker(2)
      const greatUncleanOne = daemons.units.find((u) => u.name === 'Great Unclean One')! // baseline Psyker(1)
      const upgradeFromOneSection = findSection(daemons, optionId(daemons, 'A', 'Psyker(2)'))!.section
      const upgradeFromTwoSection = daemons.upgradeGroups
        .find((g) => g.id === 'A')!
        .sections.find((s) => s.title === 'Upgrade Psyker(2)')!

      // Lord of Change (Psyker(2)) doesn't qualify for the Psyker(1)-gated section...
      expect(isSectionAvailable(lordOfChange, upgradeFromOneSection, [])).toBe(false)
      // ...and Great Unclean One (Psyker(1)) doesn't qualify for the Psyker(2)-gated section.
      expect(isSectionAvailable(greatUncleanOne, upgradeFromTwoSection, [])).toBe(false)
      expect(isSectionAvailable(lordOfChange, upgradeFromTwoSection, [])).toBe(true)
    })

    it('cannot be satisfied by a selection, only by the unit’s baseline specialRules', () => {
      expect(isSectionAvailable(tacticals, psykerSection, [optionId(sm, 'A', 'Stormbolter')])).toBe(false)
    })
  })
})

describe('pruneInvalidSelections', () => {
  it('drops a selection whose prerequisite is no longer met once its producer is removed', () => {
    const sob = getFaction('sisters-of-battle')!
    const canoness = sob.units.find((u) => u.name === 'Canoness')!
    const pistolCombo = optionId(sob, 'A', 'Pistol and Medium CCW')
    const infernoPistol = optionId(sob, 'A', 'Inferno Pistol')

    const pruned = pruneInvalidSelections(sob, canoness, [pistolCombo, infernoPistol])
    expect(pruned).toEqual([pistolCombo, infernoPistol])

    const afterRemovingProducer = pruneInvalidSelections(sob, canoness, [infernoPistol])
    expect(afterRemovingProducer).toEqual([])
  })

  it('leaves unrelated selections untouched', () => {
    const sb = optionId(sm, 'A', 'Stormbolter')
    expect(pruneInvalidSelections(sm, captain, [sb])).toEqual([sb])
  })
})

describe('isInfantry', () => {
  it('excludes a Hero unit', () => {
    expect(isInfantry(captain)).toBe(false)
  })

  it('excludes a Monster unit', () => {
    expect(isInfantry(carnifex)).toBe(false)
  })

  it('excludes a unit that is Hero, Monster, and Psyker at once', () => {
    expect(isInfantry(hiveTyrant)).toBe(false)
  })

  it('excludes a Vehicle unit', () => {
    expect(isInfantry(lemanRuss)).toBe(false)
  })

  it('includes an ordinary non-Vehicle unit', () => {
    expect(isInfantry(tacticals)).toBe(true)
  })
})

describe('affectsAllModels', () => {
  const section = (title: string, options: UpgradeOption[] = []): UpgradeSection => ({
    title,
    selection: 'one',
    options,
  })

  it('is true for a section titled "Replace all X"', () => {
    expect(affectsAllModels(section('Replace all Assault Rifles'))).toBe(true)
  })

  it('is true for a section titled "Upgrade all models with one"', () => {
    expect(affectsAllModels(section('Upgrade all models with one'))).toBe(true)
  })

  it('is false for a "one model" section with an equipment-swap option', () => {
    const opt: UpgradeOption = { id: 'x', label: 'x', costDelta: 0, effects: { removeOneEquipment: ['pistol'] } }
    expect(affectsAllModels(section('Replace one Pistol', [opt]))).toBe(false)
  })

  it('is false for a "one model" section with a pure rule-grant option and no equipment effect', () => {
    const opt: UpgradeOption = { id: 'x', label: 'Narthecium', costDelta: 25 }
    expect(affectsAllModels(section('Upgrade one model with one', [opt]))).toBe(false)
  })

  it('is false for an unqualified single-item section (e.g. "Replace Autocannon")', () => {
    const opt: UpgradeOption = { id: 'x', label: 'x', costDelta: 0, effects: { removeEquipment: ['Autocannon'] } }
    expect(affectsAllModels(section('Replace Autocannon', [opt]))).toBe(false)
  })
})

describe('combinedEffectiveUnit', () => {
  it('doubles size and sums cost for two plain copies', () => {
    const effA = applyUpgrades(tacticals, [], sm)
    const effB = applyUpgrades(tacticals, [], sm)
    const combined = combinedEffectiveUnit(effA, effB)
    expect(combined.size).toBe(tacticals.size * 2)
    expect(combined.cost).toBe(effA.cost + effB.cost)
  })

  it('merges equipment counts by key, preserving a per-model swap made on only one side', () => {
    const stormbolter = optionId(sm, 'A', 'Stormbolter') // a removeOneEquipment ("replace one") option
    const effA = applyUpgrades(tacticals, [stormbolter], sm)
    const effB = applyUpgrades(tacticals, [], sm)
    const combined = combinedEffectiveUnit(effA, effB)

    const stormbolterEntry = combined.equipment.find((e) => e.label.includes('Stormbolter'))
    expect(stormbolterEntry?.unitCount).toBe(1) // only swapped on one model of side A

    // Each key's combined count is whatever it contributed on side A plus side B.
    for (const e of combined.equipment) {
      const onA = effA.equipment.find((x) => x.key === e.key)
      const onB = effB.equipment.find((x) => x.key === e.key)
      const expectedCount = (onA ? (onA.unitCount ?? tacticals.size) : 0) + (onB ? (onB.unitCount ?? tacticals.size) : 0)
      expect(e.unitCount).toBe(expectedCount)
    }
  })

  it('dedupes special rules shared by both sides', () => {
    const effA = applyUpgrades(captain, [], sm)
    const effB = applyUpgrades(captain, [], sm)
    const combined = combinedEffectiveUnit(effA, effB)
    const fearlessCount = combined.specialRules.filter((r) => r.ruleId === 'fearless').length
    expect(fearlessCount).toBe(1)
  })

  it('keeps a plain weapon and a rule-bearing variant of the same weapon as separate entries', () => {
    const plainMeltagun = optionId(sm, 'D', 'Meltagun') // Replace one Assault Rifle -> Meltagun
    const limitedMeltagun = optionId(sm, 'A', 'Meltagun (Limited)') // Take one Assault Rifle attachment
    const effA = applyUpgrades(tacticals, [plainMeltagun], sm)
    const effB = applyUpgrades(tacticals, [limitedMeltagun], sm)
    const combined = combinedEffectiveUnit(effA, effB)

    const meltagunEntries = combined.equipment.filter((e) => e.key === 'meltagun')
    expect(meltagunEntries).toHaveLength(2)

    const plainEntry = meltagunEntries.find((e) => !e.weapon?.rules.some((r) => r.ruleId === 'limited'))
    const limitedEntry = meltagunEntries.find((e) => e.weapon?.rules.some((r) => r.ruleId === 'limited'))
    expect(plainEntry?.unitCount).toBe(1)
    expect(limitedEntry?.unitCount).toBe(1)
  })

  it('still merges two genuinely identical equipment entries (same key, same rules) into one summed count', () => {
    const plainMeltagun = optionId(sm, 'D', 'Meltagun')
    const effA = applyUpgrades(tacticals, [plainMeltagun], sm)
    const effB = applyUpgrades(tacticals, [plainMeltagun], sm)
    const combined = combinedEffectiveUnit(effA, effB)

    const meltagunEntries = combined.equipment.filter((e) => e.key === 'meltagun')
    expect(meltagunEntries).toHaveLength(1)
    expect(meltagunEntries[0].unitCount).toBe(2)
  })
})

describe('groupDeployRuleIds', () => {
  it('detects Conclave (Sisters of Battle), Warband (Inquisition), and Beastmaster/Court (Dark Eldar), each capped at 10', () => {
    const sob = getFaction('sisters-of-battle')!
    const inquisition = getFaction('inquisition')!
    const darkEldar = getFaction('dark-eldar')!

    expect(groupDeployRuleIds(sob).get('conclave')).toBe(10)
    expect(groupDeployRuleIds(inquisition).get('warband')).toBe(10)
    expect(groupDeployRuleIds(darkEldar).get('beastmaster')).toBe(10)
    expect(groupDeployRuleIds(darkEldar).get('court')).toBe(10)
  })

  it('does not flag an unrelated army rule', () => {
    expect(groupDeployRuleIds(sm).has('battle-standard')).toBe(false)
  })
})

describe('sharedGroupDeployRuleId', () => {
  const sob = getFaction('sisters-of-battle')!
  const crusader = sob.units.find((u) => u.name === 'Crusader')!
  const cultAssassin = sob.units.find((u) => u.name === 'Cult Assassin')!

  it('finds the shared rule id between two different units carrying the same group-deploy rule', () => {
    expect(sharedGroupDeployRuleId(crusader, cultAssassin, sob)).toBe('conclave')
  })

  it('returns undefined for units with no shared group-deploy rule', () => {
    expect(sharedGroupDeployRuleId(crusader, captain, sob)).toBeUndefined()
  })

  it('returns undefined across different factions\' otherwise-matching rules', () => {
    const inquisition = getFaction('inquisition')!
    const acolyte = inquisition.units.find((u) => u.name === 'Acolyte')!
    expect(sharedGroupDeployRuleId(crusader, acolyte, sob)).toBeUndefined()
  })
})

describe('groupEffectiveUnit', () => {
  const sob = getFaction('sisters-of-battle')!
  const crusader = sob.units.find((u) => u.name === 'Crusader')!
  const cultAssassin = sob.units.find((u) => u.name === 'Cult Assassin')!
  const arcoFlagellant = sob.units.find((u) => u.name === 'Arco Flagellant')!

  it('builds a per-distinct-member roster and sums size/cost across different unit types', () => {
    const members = [
      { profile: crusader, eff: applyUpgrades(crusader, [], sob) },
      { profile: cultAssassin, eff: applyUpgrades(cultAssassin, [], sob) },
      { profile: crusader, eff: applyUpgrades(crusader, [], sob) },
    ]
    const group = groupEffectiveUnit(members)

    expect(group.size).toBe(crusader.size * 2 + cultAssassin.size)
    expect(group.cost).toBe(crusader.cost * 2 + cultAssassin.cost)
    expect(group.members).toEqual(
      expect.arrayContaining([
        { profile: crusader, count: 2 },
        { profile: cultAssassin, count: 1 },
      ]),
    )
    expect(group.members).toHaveLength(2)
  })

  it('dedupes special rules shared across members', () => {
    const members = [
      { profile: crusader, eff: applyUpgrades(crusader, [], sob) },
      { profile: arcoFlagellant, eff: applyUpgrades(arcoFlagellant, [], sob) },
    ]
    const group = groupEffectiveUnit(members)
    expect(group.specialRules.filter((r) => r.ruleId === 'conclave')).toHaveLength(1)
  })

  it('sums model count correctly for a synthetic multi-model member (current data is all size-1)', () => {
    const multiModelProfile: UnitProfile = { ...crusader, id: 'synthetic-multi', size: 4 }
    const members = [
      { profile: crusader, eff: applyUpgrades(crusader, [], sob) },
      { profile: multiModelProfile, eff: { ...applyUpgrades(crusader, [], sob), profile: multiModelProfile } },
    ]
    const group = groupEffectiveUnit(members)
    expect(group.size).toBe(1 + 4)
  })

  it('keeps a plain weapon and a rule-bearing variant of the same weapon as separate entries', () => {
    const plainEff = applyUpgrades(crusader, [], sob)
    const limitedEff = applyUpgrades(cultAssassin, [], sob)
    const meltagun = { key: 'meltagun', label: 'Meltagun', unitCount: 1, weapon: { id: 'meltagun', name: 'Meltagun', range: 12, attacks: '6', rules: [] } }
    const limitedMeltagun = {
      key: 'meltagun',
      label: 'Meltagun',
      unitCount: 1,
      weapon: { ...meltagun.weapon, rules: [{ ruleId: 'limited' }] },
    }
    const members = [
      { profile: crusader, eff: { ...plainEff, equipment: [...plainEff.equipment, meltagun] } },
      { profile: cultAssassin, eff: { ...limitedEff, equipment: [...limitedEff.equipment, limitedMeltagun] } },
    ]
    const group = groupEffectiveUnit(members)

    const meltagunEntries = group.equipment.filter((e) => e.key === 'meltagun')
    expect(meltagunEntries).toHaveLength(2)
    const plainEntry = meltagunEntries.find((e) => !e.weapon?.rules.some((r) => r.ruleId === 'limited'))
    const limitedEntry = meltagunEntries.find((e) => e.weapon?.rules.some((r) => r.ruleId === 'limited'))
    expect(plainEntry?.unitCount).toBe(1)
    expect(limitedEntry?.unitCount).toBe(1)
  })
})
