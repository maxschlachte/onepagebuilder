import { describe, expect, it } from 'vitest'
import { isInfantry, isVehicle } from '../domain/calc'
import { getFaction } from './index'
import { getEffectiveFaction } from './chapters'
import { bloodAngelsBundle } from './factions/space-marine-chapters'
import type { Faction, UnitProfile } from '../domain/types'

function optionsOf(unit: UnitProfile, faction: Faction) {
  return unit.upgradeGroups
    .map((id) => faction.upgradeGroups.find((g) => g.id === id))
    .flatMap((g) => g?.sections.flatMap((s) => s.options) ?? [])
}

describe('getEffectiveFaction', () => {
  it('passes through unchanged for a non-Space-Marines faction', () => {
    expect(getEffectiveFaction('orks')).toBe(getFaction('orks'))
    expect(getEffectiveFaction('orks', 'blood-angels')).toBe(getFaction('orks'))
  })

  it('passes through the base faction for Space Marines with no chapter', () => {
    expect(getEffectiveFaction('space-marines')).toBe(getFaction('space-marines'))
  })

  it('passes through the base faction for an unknown chapter id', () => {
    expect(getEffectiveFaction('space-marines', 'not-a-chapter')).toBe(getFaction('space-marines'))
  })

  it('includes the chapter extra units', () => {
    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const baseUnitCount = getFaction('space-marines')!.units.length
    expect(faction.units.length).toBe(baseUnitCount + 5)
    expect(faction.units.some((u) => u.name === 'Sanguinary Priest')).toBe(true)
    expect(faction.units.every((u) => u.factionId === 'space-marines')).toBe(true)
  })

  it('does not leak one chapter into another', () => {
    const faction = getEffectiveFaction('space-marines', 'dark-angels')!
    expect(faction.units.some((u) => u.name === 'Sanguinary Priest')).toBe(false)
    expect(faction.units.some((u) => u.name === 'Deathwing Knights')).toBe(true)
  })

  it('adds a category-wide Chapter Tactics option to every base Infantry-eligible unit, but not to the chapter\'s own units', () => {
    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const baseUnitIds = new Set(getFaction('space-marines')!.units.map((u) => u.id))
    const baseInfantryUnits = faction.units.filter((u) => baseUnitIds.has(u.id) && isInfantry(u))
    expect(baseInfantryUnits.length).toBeGreaterThan(0)
    for (const unit of baseInfantryUnits) {
      expect(optionsOf(unit, faction).some((o) => o.label === 'Furious' && o.costDelta === 10)).toBe(true)
    }
    // A base Vehicle unit should get Fast, not Furious.
    const baseVehicle = faction.units.find((u) => baseUnitIds.has(u.id) && isVehicle(u))!
    const vehicleOptions = optionsOf(baseVehicle, faction)
    expect(vehicleOptions.some((o) => o.label === 'Fast' && o.costDelta === 5)).toBe(true)
    expect(vehicleOptions.some((o) => o.label === 'Furious')).toBe(false)

    // Blood Angels' own Infantry unit (Death Company) already carries Rage
    // (implying Furious) — it must not also show the purchasable option.
    const deathCompany = faction.units.find((u) => u.name === 'Death Company')!
    expect(isInfantry(deathCompany)).toBe(true)
    expect(optionsOf(deathCompany, faction).some((o) => o.label === 'Furious')).toBe(false)

    // Blood Angels' own Vehicle unit (Baal Predator) likewise gets no Fast option.
    const baalPredator = faction.units.find((u) => u.name === 'Baal Predator')!
    expect(isVehicle(baalPredator)).toBe(true)
    expect(optionsOf(baalPredator, faction).some((o) => o.label === 'Fast')).toBe(false)
  })

  it('adds a named-unit Chapter Tactics option only to that (base) unit', () => {
    const faction = getEffectiveFaction('space-marines', 'dark-angels')!
    const terminators = faction.units.find((u) => u.name === 'Terminators')!
    expect(optionsOf(terminators, faction).some((o) => o.label === 'Deathwing' && o.costDelta === 20)).toBe(true)

    const otherInfantry = faction.units.find((u) => u.name === 'Tactical Marines')!
    expect(optionsOf(otherInfantry, faction).some((o) => o.label === 'Deathwing')).toBe(false)
  })

  it('resolves both category-wide Space Wolves options (Hero and Infantry) on base units only', () => {
    const faction = getEffectiveFaction('space-marines', 'space-wolves')!
    const captain = faction.units.find((u) => u.name === 'Captain')!
    expect(optionsOf(captain, faction).some((o) => o.label === 'Wolf' && o.costDelta === 30)).toBe(true)

    const tacticalMarines = faction.units.find((u) => u.name === 'Tactical Marines')!
    expect(optionsOf(tacticalMarines, faction).some((o) => o.label === 'Counter-Attack' && o.costDelta === 10)).toBe(
      true,
    )

    // Space Wolves' own Infantry unit (Wulfen) already carries Counter-Attack directly.
    const wulfen = faction.units.find((u) => u.name === 'Wulfen')!
    expect(isInfantry(wulfen)).toBe(true)
    expect(optionsOf(wulfen, faction).some((o) => o.label === 'Counter-Attack')).toBe(false)
    // Space Wolves' own Hero unit (Sled Captain) gets no Wolf option either — the
    // exclusion is blanket, not limited to options that are literally redundant.
    const sledCaptain = faction.units.find((u) => u.name === 'Sled Captain')!
    expect(optionsOf(sledCaptain, faction).some((o) => o.label === 'Wolf')).toBe(false)
  })

  it("excludes Grey Knights' own units from the Grey Knights Aegis option", () => {
    const faction = getEffectiveFaction('space-marines', 'grey-knights')!
    const baseUnitIds = new Set(getFaction('space-marines')!.units.map((u) => u.id))
    const baseInfantry = faction.units.find((u) => baseUnitIds.has(u.id) && isInfantry(u))!
    expect(optionsOf(baseInfantry, faction).some((o) => o.label === 'Aegis' && o.costDelta === 5)).toBe(true)

    const strikeSquad = faction.units.find((u) => u.name === 'Strike Squad')!
    expect(isInfantry(strikeSquad)).toBe(true)
    expect(optionsOf(strikeSquad, faction).some((o) => o.label === 'Aegis')).toBe(false)
  })

  it('orders a chapter roster by category: Heroes/Psykers, then Infantry, then Vehicles', () => {
    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const isHeroOrPsyker = (u: (typeof faction.units)[number]) =>
      u.isHero || u.specialRules.some((r) => r.ruleId === 'psyker')

    const ranks = faction.units.map((u) => {
      if (isHeroOrPsyker(u)) return 0
      if (isInfantry(u)) return 1
      if (isVehicle(u)) return 2
      return 3
    })
    // Non-decreasing: once we've moved past a category, we never see an earlier one again.
    for (let i = 1; i < ranks.length; i++) {
      expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1])
    }

    // Sanity: at least one unit landed in each of the three real categories.
    expect(ranks.some((r) => r === 0)).toBe(true)
    expect(ranks.some((r) => r === 1)).toBe(true)
    expect(ranks.some((r) => r === 2)).toBe(true)
  })

  it('within a category, base units keep their order and precede that chapter\'s units', () => {
    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const names = faction.units.map((u) => u.name)
    // Captain is the first base Hero; Sanguinary Priest is Blood Angels' Hero.
    expect(names.indexOf('Captain')).toBeLessThan(names.indexOf('Sanguinary Priest'))
    // Base Heroes keep their original relative order (Captain before Chaplain before Librarian).
    expect(names.indexOf('Captain')).toBeLessThan(names.indexOf('Chaplain'))
    expect(names.indexOf('Chaplain')).toBeLessThan(names.indexOf('Librarian'))
    // Base Infantry (Tactical Marines) precedes chapter Infantry (Death Company).
    expect(names.indexOf('Tactical Marines')).toBeLessThan(names.indexOf('Death Company'))
    // Base Vehicle (Rhino) precedes chapter Vehicle (Baal Predator).
    expect(names.indexOf('Rhino')).toBeLessThan(names.indexOf('Baal Predator'))
  })

  it('leaves a chapter-less faction\'s unit order byte-for-byte unchanged', () => {
    const base = getFaction('space-marines')!
    const noChapter = getEffectiveFaction('space-marines')!
    expect(noChapter.units.map((u) => u.id)).toEqual(base.units.map((u) => u.id))
  })

  it('marks the Chapter Tactics group hideId, leaving real groups unaffected', () => {
    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const tacticsGroup = faction.upgradeGroups.find((g) => g.id.startsWith('blood-angels-tactics-'))!
    expect(tacticsGroup.hideId).toBe(true)

    const realGroup = faction.upgradeGroups.find((g) => g.id === 'A')!
    expect(realGroup.hideId).toBeFalsy()
  })

  it("gives a chapter's own upgrade groups a display letter continuing the base sequence", () => {
    const baseGroupCount = getFaction('space-marines')!.upgradeGroups.length
    expect(baseGroupCount).toBe(15) // A-O

    const faction = getEffectiveFaction('space-marines', 'blood-angels')!
    const baGroupIds = ['ba-a', 'ba-b', 'ba-c', 'ba-d', 'ba-g']
    const displayIds = baGroupIds.map((id) => faction.upgradeGroups.find((g) => g.id === id)!.displayId)
    expect(displayIds).toEqual(['P', 'Q', 'R', 'S', 'T'])

    // Base groups never get a displayId.
    const baseGroup = faction.upgradeGroups.find((g) => g.id === 'A')!
    expect(baseGroup.displayId).toBeUndefined()
  })

  it("each chapter's own letters independently restart at the same continuation point", () => {
    const blood = getEffectiveFaction('space-marines', 'blood-angels')!
    const dark = getEffectiveFaction('space-marines', 'dark-angels')!
    expect(blood.upgradeGroups.find((g) => g.id === 'ba-a')!.displayId).toBe('P')
    expect(dark.upgradeGroups.find((g) => g.id === 'da-e')!.displayId).toBe('P')
  })

  it('does not mutate the chapter bundle module-level constants', () => {
    expect(bloodAngelsBundle.upgradeGroups.every((g) => g.displayId === undefined)).toBe(true)
    getEffectiveFaction('space-marines', 'blood-angels')
    expect(bloodAngelsBundle.upgradeGroups.every((g) => g.displayId === undefined)).toBe(true)
  })

  it('does not mutate the base Space Marines faction singleton', () => {
    const before = getFaction('space-marines')!.upgradeGroups.length
    getEffectiveFaction('space-marines', 'grey-knights')
    expect(getFaction('space-marines')!.upgradeGroups.length).toBe(before)
    expect(getFaction('space-marines')!.units.every((u) => !u.upgradeGroups.some((g) => g.includes('tactics')))).toBe(
      true,
    )
  })
})
