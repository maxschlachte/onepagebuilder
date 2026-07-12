import { describe, expect, it } from 'vitest'
import { exportListToJson, useListsStore, validateImported } from './lists'
import { getFaction } from '../data/index'
import { LIST_SCHEMA_VERSION, type ArmyList } from '../domain/list'

const sm = getFaction('space-marines')!
const captain = sm.units.find((u) => u.name === 'Captain')!

function optionsIn(factionId: string, groupId: string, sectionTitle: string) {
  const group = getFaction(factionId)!.upgradeGroups.find((g) => g.id === groupId)!
  return group.sections.find((s) => s.title === sectionTitle)!.options
}

const sample: ArmyList = {
  schemaVersion: LIST_SCHEMA_VERSION,
  id: 'x',
  name: 'My List',
  factionId: 'space-marines',
  pointsCap: 750,
  units: [{ instanceId: 'u1', unitId: captain.id, selectedUpgrades: [] }],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('export/import roundtrip', () => {
  it('re-imports an exported list', () => {
    const json = exportListToJson(sample)
    const imported = validateImported(JSON.parse(json))
    expect(imported.name).toBe('My List')
    expect(imported.factionId).toBe('space-marines')
    expect(imported.units[0].unitId).toBe(captain.id)
  })
})

describe('import validation', () => {
  it('rejects an unknown faction', () => {
    expect(() => validateImported({ name: 'x', factionId: 'nope', units: [] })).toThrow(
      /Unknown faction/,
    )
  })

  it('rejects an unknown unit id', () => {
    expect(() =>
      validateImported({
        name: 'x',
        factionId: 'space-marines',
        units: [{ unitId: 'space-marines.does-not-exist', selectedUpgrades: [] }],
      }),
    ).toThrow(/Unknown unit id/)
  })

  it('rejects an unknown upgrade id', () => {
    expect(() =>
      validateImported({
        name: 'x',
        factionId: 'space-marines',
        units: [{ unitId: captain.id, selectedUpgrades: ['Z.99'] }],
      }),
    ).toThrow(/Unknown upgrade id/)
  })

  it('rejects a non-object', () => {
    expect(() => validateImported(42)).toThrow(/not a valid army list/)
  })

  it('rejects a "one" section with more than one option selected', () => {
    const [a, b] = optionsIn('space-marines', 'A', 'Replace one Assault Rifle')
    expect(() =>
      validateImported({
        name: 'x',
        factionId: 'space-marines',
        units: [{ unitId: captain.id, selectedUpgrades: [a.id, b.id] }],
      }),
    ).toThrow(/too many options/)
  })

  it('rejects a selection whose prerequisite is not met', () => {
    const sob = getFaction('sisters-of-battle')!
    const canoness = sob.units.find((u) => u.name === 'Canoness')!
    const infernoPistol = optionsIn('sisters-of-battle', 'A', 'Replace Pistol')[0]
    expect(() =>
      validateImported({
        name: 'x',
        factionId: 'sisters-of-battle',
        units: [{ unitId: canoness.id, selectedUpgrades: [infernoPistol.id] }],
      }),
    ).toThrow(/prerequisite/)
  })
})

describe('Space Marine chapter selection', () => {
  it('createList persists and round-trips a chapter', () => {
    const store = useListsStore()
    const list = store.createList('Blood Angels Test', 'space-marines', 750, 'blood-angels')
    expect(list.chapterId).toBe('blood-angels')
    expect(store.find(list.id)?.chapterId).toBe('blood-angels')
  })

  it('createList ignores a chapter for a non-Space-Marines faction', () => {
    const store = useListsStore()
    const list = store.createList('Necrons Test', 'necrons', 750, 'blood-angels' as never)
    expect(list.chapterId).toBeUndefined()
  })

  it('addUnit can add a chapter-specific unit once a chapter is selected', () => {
    const store = useListsStore()
    const list = store.createList('BA Roster Test', 'space-marines', 750, 'blood-angels')
    const sanguinaryPriest = store.getEffectiveFaction('space-marines', 'blood-angels')!.units.find(
      (u) => u.name === 'Sanguinary Priest',
    )!
    store.addUnit(list.id, sanguinaryPriest.id)
    expect(list.units[0].unitId).toBe(sanguinaryPriest.id)
  })

  it('validateImported accepts a valid chapter export and round-trips it', () => {
    const chapterSample: ArmyList = { ...sample, chapterId: 'blood-angels' }
    const json = exportListToJson(chapterSample)
    const imported = validateImported(JSON.parse(json))
    expect(imported.factionId).toBe('space-marines')
    expect(imported.chapterId).toBe('blood-angels')
  })

  it('validateImported rejects an unknown chapter', () => {
    expect(() =>
      validateImported({ name: 'x', factionId: 'space-marines', chapterId: 'not-a-chapter', units: [] }),
    ).toThrow(/Unknown chapter/)
  })

  it('validateImported rejects a chapter on a non-Space-Marines faction', () => {
    expect(() =>
      validateImported({ name: 'x', factionId: 'necrons', chapterId: 'blood-angels', units: [] }),
    ).toThrow(/only valid for the Space Marines faction/)
  })
})

describe('toggleUpgrade selection enforcement', () => {
  it('radio behavior: selecting a second option in a "one" section deselects the first', () => {
    const store = useListsStore()
    const list = store.createList('Radio Test', 'space-marines', 750)
    store.addUnit(list.id, captain.id)
    const instanceId = list.units[0].instanceId
    const [a, b] = optionsIn('space-marines', 'A', 'Replace one Assault Rifle')

    store.toggleUpgrade(list.id, instanceId, a.id)
    expect(list.units[0].selectedUpgrades).toEqual([a.id])

    store.toggleUpgrade(list.id, instanceId, b.id)
    expect(list.units[0].selectedUpgrades).toEqual([b.id])
  })

  it('rejects selecting beyond a capped section’s limit', () => {
    const store = useListsStore()
    const list = store.createList('Cap Test', 'necrons', 750)
    const necrons = getFaction('necrons')!
    const lord = necrons.units.find((u) => u.name === 'Necron Lord')!
    store.addUnit(list.id, lord.id)
    const instanceId = list.units[0].instanceId
    const options = optionsIn('necrons', 'A', 'Take up to two')

    store.toggleUpgrade(list.id, instanceId, options[0].id)
    store.toggleUpgrade(list.id, instanceId, options[1].id)
    expect(list.units[0].selectedUpgrades).toHaveLength(2)

    store.toggleUpgrade(list.id, instanceId, options[2].id)
    expect(list.units[0].selectedUpgrades).toHaveLength(2)
    expect(list.units[0].selectedUpgrades).not.toContain(options[2].id)
  })

  it('leaves an "any" section unconstrained', () => {
    const store = useListsStore()
    const list = store.createList('Any Test', 'space-marines', 750)
    store.addUnit(list.id, captain.id)
    const instanceId = list.units[0].instanceId
    const options = optionsIn('space-marines', 'B', 'Upgrade with any')

    for (const opt of options) store.toggleUpgrade(list.id, instanceId, opt.id)
    expect(list.units[0].selectedUpgrades).toHaveLength(options.length)
  })
})

describe('combineUnits / splitUnits', () => {
  it('links two entries of the same Infantry-eligible unit symmetrically', () => {
    const store = useListsStore()
    const list = store.createList('Combine Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units

    store.combineUnits(list.id, a.instanceId, b.instanceId)
    expect(a.combinedWith).toBe(b.instanceId)
    expect(b.combinedWith).toBe(a.instanceId)

    store.splitUnits(list.id, a.instanceId)
    expect(a.combinedWith).toBeUndefined()
    expect(b.combinedWith).toBeUndefined()
  })

  it('refuses to combine a Hero (not Infantry-eligible)', () => {
    const store = useListsStore()
    const list = store.createList('Combine Hero Test', 'space-marines', 750)
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, captain.id)
    const [a, b] = list.units

    store.combineUnits(list.id, a.instanceId, b.instanceId)
    expect(a.combinedWith).toBeUndefined()
    expect(b.combinedWith).toBeUndefined()
  })

  it('refuses to combine two different units', () => {
    const store = useListsStore()
    const list = store.createList('Combine Mismatch Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    const other = sm.units.find((u) => u.name !== 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, other.id)
    const [a, b] = list.units

    store.combineUnits(list.id, a.instanceId, b.instanceId)
    expect(a.combinedWith).toBeUndefined()
    expect(b.combinedWith).toBeUndefined()
  })

  it('auto-unions already-selected whole-unit options onto both entries, leaving per-model selections independent', () => {
    const store = useListsStore()
    const list = store.createList('Combine Union Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units

    const wholeUnitOption = optionsIn('space-marines', 'F', 'Replace all Assault Rifles')[0]
    const perModelOption = optionsIn('space-marines', 'A', 'Replace one Assault Rifle')[0]
    store.toggleUpgrade(list.id, a.instanceId, wholeUnitOption.id)
    store.toggleUpgrade(list.id, a.instanceId, perModelOption.id)

    store.combineUnits(list.id, a.instanceId, b.instanceId)
    expect(a.selectedUpgrades).toContain(wholeUnitOption.id)
    expect(b.selectedUpgrades).toContain(wholeUnitOption.id)
    expect(a.selectedUpgrades).toContain(perModelOption.id)
    expect(b.selectedUpgrades).not.toContain(perModelOption.id)
  })
})

describe('toggleUpgrade on a combined pair', () => {
  it('applies a whole-unit option to both linked entries', () => {
    const store = useListsStore()
    const list = store.createList('Combined Toggle Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    const wholeUnitOption = optionsIn('space-marines', 'F', 'Replace all Assault Rifles')[0]
    store.toggleUpgrade(list.id, a.instanceId, wholeUnitOption.id)
    expect(a.selectedUpgrades).toContain(wholeUnitOption.id)
    expect(b.selectedUpgrades).toContain(wholeUnitOption.id)

    store.toggleUpgrade(list.id, a.instanceId, wholeUnitOption.id) // deselect syncs too
    expect(a.selectedUpgrades).not.toContain(wholeUnitOption.id)
    expect(b.selectedUpgrades).not.toContain(wholeUnitOption.id)
  })

  it('keeps a per-model option independent per linked entry', () => {
    const store = useListsStore()
    const list = store.createList('Combined Per-Model Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    const perModelOption = optionsIn('space-marines', 'A', 'Replace one Assault Rifle')[0]
    store.toggleUpgrade(list.id, a.instanceId, perModelOption.id)
    expect(a.selectedUpgrades).toContain(perModelOption.id)
    expect(b.selectedUpgrades).not.toContain(perModelOption.id)
  })

  it('keeps a single-model rule-grant option (no equipment effect) independent per linked entry', () => {
    const store = useListsStore()
    const list = store.createList('Combined Leader Upgrade Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    // "Upgrade one model with one" (group A) options carry no removeOneEquipment
    // (some carry no equipment effect at all) but only ever apply to one model —
    // the case that was previously miscategorized as whole-unit.
    const leaderOption = optionsIn('space-marines', 'A', 'Upgrade one model with one').find(
      (o) => o.label === 'Jump Pack (Deep Strike, Flying)',
    )!
    store.toggleUpgrade(list.id, a.instanceId, leaderOption.id)
    expect(a.selectedUpgrades).toContain(leaderOption.id)
    expect(b.selectedUpgrades).not.toContain(leaderOption.id)
  })
})

describe('attachToUnit / detachFromUnit', () => {
  it('attaches a Hero to a same-Quality Infantry-eligible unit', () => {
    const store = useListsStore()
    const list = store.createList('Attach Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    expect(captain.quality).toBe(tacticals.quality)
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, tacticals.id)
    const [hero, host] = list.units

    store.attachToUnit(list.id, hero.instanceId, host.instanceId)
    expect(hero.joinedInfantryUnit).toBe(host.instanceId)

    store.detachFromUnit(list.id, hero.instanceId)
    expect(hero.joinedInfantryUnit).toBeUndefined()
  })

  it('rejects attaching to a mismatched-Quality unit', () => {
    const store = useListsStore()
    const list = store.createList('Attach Mismatch Test', 'space-marines', 750)
    const mismatched = sm.units.find((u) => u.quality !== captain.quality && !u.isHero)!
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, mismatched.id)
    const [hero, host] = list.units

    store.attachToUnit(list.id, hero.instanceId, host.instanceId)
    expect(hero.joinedInfantryUnit).toBeUndefined()
  })

  it('rejects attaching to a non-Infantry-eligible unit', () => {
    const store = useListsStore()
    const list = store.createList('Attach Non-Infantry Test', 'space-marines', 750)
    const chaplain = sm.units.find((u) => u.name === 'Chaplain')!
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, chaplain.id) // another Hero, not Infantry-eligible
    const [hero, host] = list.units

    store.attachToUnit(list.id, hero.instanceId, host.instanceId)
    expect(hero.joinedInfantryUnit).toBeUndefined()
  })
})

describe('removeUnit cleans up combine/attach links', () => {
  it('splits a combined pair when one entry is removed', () => {
    const store = useListsStore()
    const list = store.createList('Remove Combined Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    store.removeUnit(list.id, a.instanceId)
    expect(b.combinedWith).toBeUndefined()
  })

  it('detaches an attached Hero when its host is removed', () => {
    const store = useListsStore()
    const list = store.createList('Remove Host Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, tacticals.id)
    const [hero, host] = list.units
    store.attachToUnit(list.id, hero.instanceId, host.instanceId)

    store.removeUnit(list.id, host.instanceId)
    expect(hero.joinedInfantryUnit).toBeUndefined()
  })
})

describe('duplicateList remaps combine/attach links', () => {
  it('preserves a combined pair with new, distinct instance ids', () => {
    const store = useListsStore()
    const list = store.createList('Duplicate Combined Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    const copy = store.duplicateList(list.id)!
    expect(copy.units).toHaveLength(2)
    const [ca, cb] = copy.units
    expect(ca.instanceId).not.toBe(a.instanceId)
    expect(cb.instanceId).not.toBe(b.instanceId)
    expect(ca.combinedWith).toBe(cb.instanceId)
    expect(cb.combinedWith).toBe(ca.instanceId)
  })

  it('preserves an attach link across the remap', () => {
    const store = useListsStore()
    const list = store.createList('Duplicate Attach Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, captain.id)
    store.addUnit(list.id, tacticals.id)
    const [hero, host] = list.units
    store.attachToUnit(list.id, hero.instanceId, host.instanceId)

    const copy = store.duplicateList(list.id)!
    const [cHero, cHost] = copy.units
    expect(cHero.joinedInfantryUnit).toBe(cHost.instanceId)
  })
})

describe('joinGroup / leaveGroup', () => {
  const sob = getFaction('sisters-of-battle')!
  const crusader = sob.units.find((u) => u.name === 'Crusader')!
  const cultAssassin = sob.units.find((u) => u.name === 'Cult Assassin')!
  const arcoFlagellant = sob.units.find((u) => u.name === 'Arco Flagellant')!

  it('links two different Conclave-eligible units into a group with a shared groupId', () => {
    const store = useListsStore()
    const list = store.createList('Group Join Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    const [a, b] = list.units

    store.joinGroup(list.id, a.instanceId, b.instanceId)
    expect(a.groupId).toBeDefined()
    expect(a.groupId).toBe(b.groupId)
  })

  it('adds a third different unit to an existing group, keeping the same groupId', () => {
    const store = useListsStore()
    const list = store.createList('Group Join Third Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    store.addUnit(list.id, arcoFlagellant.id)
    const [a, b, c] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)
    const groupId = a.groupId

    store.joinGroup(list.id, c.instanceId, a.instanceId)
    expect(c.groupId).toBe(groupId)
    expect(b.groupId).toBe(groupId)
  })

  it('rejects joining units that share no common group-deploy rule', () => {
    const store = useListsStore()
    const list = store.createList('Group Cross-Rule Test', 'dark-eldar', 750)
    const darkEldar = getFaction('dark-eldar')!
    const urGhul = darkEldar.units.find((u) => u.name === 'Ur-Ghul')! // Court
    const beastmaster = darkEldar.units.find((u) => u.name === 'Beastmaster')! // Beastmaster
    store.addUnit(list.id, urGhul.id)
    store.addUnit(list.id, beastmaster.id)
    const [a, b] = list.units

    store.joinGroup(list.id, a.instanceId, b.instanceId)
    expect(a.groupId).toBeUndefined()
    expect(b.groupId).toBeUndefined()
  })

  it('rejects joining once the rule\'s model cap (10) would be exceeded', () => {
    const store = useListsStore()
    const list = store.createList('Group Cap Test', 'sisters-of-battle', 750)
    for (let i = 0; i < 10; i++) store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id) // the 11th member
    const [first, ...rest] = list.units
    const tenUnits = [first, ...rest.slice(0, 9)]
    const eleventh = rest[9]

    for (const u of tenUnits.slice(1)) store.joinGroup(list.id, first.instanceId, u.instanceId)
    expect(tenUnits.every((u) => u.groupId === first.groupId)).toBe(true)

    store.joinGroup(list.id, first.instanceId, eleventh.instanceId)
    expect(eleventh.groupId).toBeUndefined()
  })

  it('leaveGroup removes just one member, leaving the rest linked', () => {
    const store = useListsStore()
    const list = store.createList('Group Leave Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    store.addUnit(list.id, arcoFlagellant.id)
    const [a, b, c] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)
    store.joinGroup(list.id, c.instanceId, a.instanceId)

    store.leaveGroup(list.id, b.instanceId)
    expect(b.groupId).toBeUndefined()
    expect(a.groupId).toBe(c.groupId)
    expect(a.groupId).toBeDefined()
  })

  it('leaveGroup on a 2-member group dissolves it entirely, clearing the last member too', () => {
    const store = useListsStore()
    const list = store.createList('Group Leave Dissolve Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    const [a, b] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)
    expect(a.groupId).toBeDefined()

    store.leaveGroup(list.id, a.instanceId)
    expect(a.groupId).toBeUndefined()
    expect(b.groupId).toBeUndefined()
  })
})

describe('removeUnit and duplicateList handle groups', () => {
  const sob = getFaction('sisters-of-battle')!
  const crusader = sob.units.find((u) => u.name === 'Crusader')!
  const cultAssassin = sob.units.find((u) => u.name === 'Cult Assassin')!

  it('removing one group member leaves the others linked to each other', () => {
    const store = useListsStore()
    const list = store.createList('Remove Group Member Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    const [a, b] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)
    const groupId = a.groupId

    store.addUnit(list.id, crusader.id)
    const c = list.units[2]
    store.joinGroup(list.id, c.instanceId, a.instanceId)

    store.removeUnit(list.id, a.instanceId)
    expect(b.groupId).toBe(groupId)
    expect(c.groupId).toBe(groupId)
  })

  it('duplicateList remaps a group to a fresh, shared groupId', () => {
    const store = useListsStore()
    const list = store.createList('Duplicate Group Test', 'sisters-of-battle', 750)
    store.addUnit(list.id, crusader.id)
    store.addUnit(list.id, cultAssassin.id)
    const [a, b] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)

    const copy = store.duplicateList(list.id)!
    const [ca, cb] = copy.units
    expect(ca.groupId).toBeDefined()
    expect(ca.groupId).toBe(cb.groupId)
    expect(ca.groupId).not.toBe(a.groupId)
  })
})

describe('drop-invalid links on load / import', () => {
  it('drops a combinedWith reference to a mismatched unitId on import', () => {
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    const scouts = sm.units.find((u) => u.name !== 'Tactical Marines' && !u.isHero)!
    const raw = {
      name: 'Bad Combine',
      factionId: 'space-marines',
      units: [
        { instanceId: 'u1', unitId: tacticals.id, selectedUpgrades: [], combinedWith: 'u2' },
        { instanceId: 'u2', unitId: scouts.id, selectedUpgrades: [], combinedWith: 'u1' },
      ],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].combinedWith).toBeUndefined()
    expect(imported.units[1].combinedWith).toBeUndefined()
  })

  it('drops a joinedInfantryUnit reference to a mismatched-Quality unit on import', () => {
    const mismatched = sm.units.find((u) => u.quality !== captain.quality && !u.isHero)!
    const raw = {
      name: 'Bad Attach',
      factionId: 'space-marines',
      units: [
        { instanceId: 'u1', unitId: captain.id, selectedUpgrades: [], joinedInfantryUnit: 'u2' },
        { instanceId: 'u2', unitId: mismatched.id, selectedUpgrades: [] },
      ],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].joinedInfantryUnit).toBeUndefined()
  })

  it('keeps a valid combinedWith/joinedInfantryUnit reference on import', () => {
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    const raw = {
      name: 'Good Links',
      factionId: 'space-marines',
      units: [
        { instanceId: 'u1', unitId: tacticals.id, selectedUpgrades: [], combinedWith: 'u2' },
        { instanceId: 'u2', unitId: tacticals.id, selectedUpgrades: [], combinedWith: 'u1' },
        { instanceId: 'u3', unitId: captain.id, selectedUpgrades: [], joinedInfantryUnit: 'u1' },
      ],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].combinedWith).toBe('u2')
    expect(imported.units[1].combinedWith).toBe('u1')
    expect(imported.units[2].joinedInfantryUnit).toBe('u1')
  })

  it('drops a groupId shared by units with no common group-deploy rule on import', () => {
    const sob = getFaction('sisters-of-battle')!
    const crusader = sob.units.find((u) => u.name === 'Crusader')! // Conclave
    const veteran = sob.units.find((u) => !u.specialRules.some((r) => r.ruleId === 'conclave'))!
    const raw = {
      name: 'Bad Group',
      factionId: 'sisters-of-battle',
      units: [
        { instanceId: 'u1', unitId: crusader.id, selectedUpgrades: [], groupId: 'g1' },
        { instanceId: 'u2', unitId: veteran.id, selectedUpgrades: [], groupId: 'g1' },
      ],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].groupId).toBeUndefined()
    expect(imported.units[1].groupId).toBeUndefined()
  })

  it('drops a lone groupId (only one member resolves) on import', () => {
    const sob = getFaction('sisters-of-battle')!
    const crusader = sob.units.find((u) => u.name === 'Crusader')!
    const raw = {
      name: 'Lone Group Member',
      factionId: 'sisters-of-battle',
      units: [{ instanceId: 'u1', unitId: crusader.id, selectedUpgrades: [], groupId: 'g1' }],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].groupId).toBeUndefined()
  })

  it('keeps a valid groupId shared by units with a common group-deploy rule on import', () => {
    const sob = getFaction('sisters-of-battle')!
    const crusader = sob.units.find((u) => u.name === 'Crusader')!
    const cultAssassin = sob.units.find((u) => u.name === 'Cult Assassin')!
    const raw = {
      name: 'Good Group',
      factionId: 'sisters-of-battle',
      units: [
        { instanceId: 'u1', unitId: crusader.id, selectedUpgrades: [], groupId: 'g1' },
        { instanceId: 'u2', unitId: cultAssassin.id, selectedUpgrades: [], groupId: 'g1' },
      ],
    }
    const imported = validateImported(raw)
    expect(imported.units[0].groupId).toBe('g1')
    expect(imported.units[1].groupId).toBe('g1')
  })
})

describe('toggleUpgrade prerequisite enforcement', () => {
  it('rejects selecting into a section unavailable per its prerequisite', () => {
    const store = useListsStore()
    const list = store.createList('Prereq Test', 'space-marines', 750)
    store.addUnit(list.id, captain.id) // size 1
    const instanceId = list.units[0].instanceId
    const [rifleOption] = optionsIn('space-marines', 'A', 'Replace one Assault Rifle')
    const [attachment] = optionsIn('space-marines', 'A', 'Take one Assault Rifle attachment')

    store.toggleUpgrade(list.id, instanceId, rifleOption.id) // consumes the Captain's only Assault Rifle
    store.toggleUpgrade(list.id, instanceId, attachment.id) // should be rejected
    expect(list.units[0].selectedUpgrades).toEqual([rifleOption.id])
  })

  it('cascades: removing a produced-item’s source auto-clears the dependent selection', () => {
    const store = useListsStore()
    const list = store.createList('Cascade Test', 'sisters-of-battle', 750)
    const sob = getFaction('sisters-of-battle')!
    const canoness = sob.units.find((u) => u.name === 'Canoness')!
    store.addUnit(list.id, canoness.id)
    const instanceId = list.units[0].instanceId
    const pistolCombo = optionsIn('sisters-of-battle', 'A', 'Replace one Assault Rifle').find((o) =>
      o.label.startsWith('Pistol and Medium CCW'),
    )!
    const infernoPistol = optionsIn('sisters-of-battle', 'A', 'Replace Pistol')[0]

    store.toggleUpgrade(list.id, instanceId, pistolCombo.id)
    store.toggleUpgrade(list.id, instanceId, infernoPistol.id)
    expect(list.units[0].selectedUpgrades).toEqual(
      expect.arrayContaining([pistolCombo.id, infernoPistol.id]),
    )

    store.toggleUpgrade(list.id, instanceId, pistolCombo.id) // deselect the pistol-producing option
    expect(list.units[0].selectedUpgrades).toEqual([])
  })
})
