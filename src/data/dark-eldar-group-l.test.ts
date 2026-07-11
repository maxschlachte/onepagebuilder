// Regression coverage for the Group L "Replace any Disintegrator Cannon" fix: the option is
// shared by the Raider (1 copy) and the Ravager (3 copies on one model, keyed distinctly so
// removeOneEquipment can't collapse them all at once — see dark-eldar.ts).
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import { applyUpgrades } from '../domain/calc'

const faction = rulesDatabase.factions.find((f) => f.id === 'dark-eldar')!
const groupL = faction.upgradeGroups.find((g) => g.id === 'L')!
const darkLanceOption = groupL.sections[0].options[0]

describe('Dark Eldar group L: Replace any Disintegrator Cannon', () => {
  it('fully swaps the Raider\'s single Disintegrator Cannon for a Dark Lance', () => {
    const raider = faction.units.find((u) => u.name === 'Raider')!
    const before = applyUpgrades(raider, [], faction)
    const after = applyUpgrades(raider, [darkLanceOption.id], faction)

    expect(before.equipment.some((e) => e.key === 'disintegrator-cannon')).toBe(true)
    expect(after.equipment.some((e) => e.key === 'disintegrator-cannon')).toBe(false)
    expect(after.equipment.filter((e) => e.key === 'dark-lance')).toHaveLength(1)
  })

  it('leaves all 3 of the Ravager\'s Disintegrator Cannons intact and adds one Dark Lance', () => {
    const ravager = faction.units.find((u) => u.name === 'Ravager')!
    const before = applyUpgrades(ravager, [], faction)
    const after = applyUpgrades(ravager, [darkLanceOption.id], faction)

    const beforeCannons = before.equipment.find((e) => e.key === 'disintegrator-cannons-x3')
    const afterCannons = after.equipment.find((e) => e.key === 'disintegrator-cannons-x3')
    expect(beforeCannons?.count).toBe(3)
    expect(afterCannons).toEqual(beforeCannons)
    expect(after.equipment.filter((e) => e.key === 'dark-lance')).toHaveLength(1)
  })
})
