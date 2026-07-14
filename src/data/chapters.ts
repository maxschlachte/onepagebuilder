// Assembles the effective Space Marines faction for an optional chapter
// specialization: base Space Marines units/groups/army-rules plus the chosen
// chapter's extra units/groups/army-rules, plus that chapter's point-cost rule
// modifiers synthesized as per-unit "Chapter Tactics" upgrade options (see
// design.md decisions 2-4 of space-marine-chapter-specialization). Everything
// downstream (`domain/calc.ts`, `domain/resolve.ts`) stays chapter-agnostic —
// it only ever sees one flat `Faction`.

import { isHero, isInfantry, isVehicle } from '../domain/calc'
import type { Faction, UnitProfile, UpgradeGroup } from '../domain/types'
import { getFaction } from './index'
import { group, section } from './factions/helpers'
import {
  bloodAngelsBundle,
  darkAngelsBundle,
  greyKnightsBundle,
  spaceWolvesBundle,
  type ChapterBundle,
} from './factions/40k/space-marine-chapters.ts'

export type ChapterId = 'blood-angels' | 'dark-angels' | 'grey-knights' | 'space-wolves'

export const chapters: { id: ChapterId; name: string }[] = [
  { id: 'blood-angels', name: 'Blood Angels' },
  { id: 'dark-angels', name: 'Dark Angels' },
  { id: 'grey-knights', name: 'Grey Knights' },
  { id: 'space-wolves', name: 'Space Wolves' },
]

const bundles: Record<ChapterId, ChapterBundle> = {
  'blood-angels': bloodAngelsBundle,
  'dark-angels': darkAngelsBundle,
  'grey-knights': greyKnightsBundle,
  'space-wolves': spaceWolvesBundle,
}

interface ChapterTacticRow {
  appliesTo: (unit: UnitProfile) => boolean
  label: string
  cost: number
  rule: string
}

const byName = (name: string) => (u: UnitProfile) => u.name === name

/** Each chapter's printed point-cost rule modifiers, as purchasable per-unit options. */
const tacticsTables: Record<ChapterId, ChapterTacticRow[]> = {
  'blood-angels': [
    { appliesTo: isInfantry, label: 'Furious', cost: 10, rule: 'Furious' },
    { appliesTo: isVehicle, label: 'Fast', cost: 5, rule: 'Fast' },
  ],
  'dark-angels': [
    { appliesTo: byName('Terminators'), label: 'Deathwing', cost: 20, rule: 'Deathwing' },
    { appliesTo: byName('Bike Squad'), label: 'Scout', cost: 10, rule: 'Scout' },
    // "Assault Bikes" in the printed rule maps to this app's "Attack Bike" unit (confirmed).
    { appliesTo: byName('Attack Bike'), label: 'Scout', cost: 5, rule: 'Scout' },
  ],
  'grey-knights': [
    { appliesTo: isInfantry, label: 'Aegis', cost: 5, rule: 'Aegis' },
    { appliesTo: isVehicle, label: 'Aegis', cost: 5, rule: 'Aegis' },
  ],
  'space-wolves': [
    { appliesTo: isHero, label: 'Wolf', cost: 30, rule: 'Wolf' },
    { appliesTo: isInfantry, label: 'Counter-Attack', cost: 10, rule: 'Counter-Attack' },
  ],
}

/** Last dot-segment of a unit id (e.g. `space-marines.terminators` → `terminators`), for building a unique per-unit group id. */
function unitSlug(unitId: string): string {
  return unitId.split('.').pop()!
}

/** Letter for a 0-based index (`0 → 'A'`, `15 → 'P'`). */
function letterFor(index: number): string {
  return String.fromCharCode(65 + index)
}

/**
 * Roster category rank for a chapter-assembled faction's stable sort: Heroes
 * and Psykers first, then Infantry, then Vehicles, then anything else (no
 * such unit exists in Space Marines/chapter data today, but the catch-all
 * keeps this forward-compatible — see design.md decision 2).
 */
function categoryRank(unit: UnitProfile): number {
  if (isHero(unit) || unit.specialRules.some((r) => r.ruleId === 'psyker')) return 0
  if (isInfantry(unit)) return 1
  if (isVehicle(unit)) return 2
  return 3
}

/**
 * Return the effective faction for `factionId`/`chapterId`: a plain passthrough
 * to `getFaction` for any non-Space-Marines faction or an absent/unknown
 * chapter (so a chapter-less Space Marines list is byte-for-byte identical to
 * today's data), or an assembled Space Marines-plus-chapter `Faction` when a
 * known chapter is given.
 */
export function getEffectiveFaction(factionId: string, chapterId?: string): Faction | undefined {
  const base = getFaction(factionId)
  if (factionId !== 'space-marines' || !chapterId) return base

  const bundle = bundles[chapterId as ChapterId]
  if (!bundle || !base) return base

  const tacticsRows = tacticsTables[chapterId as ChapterId]
  const chapterTacticsGroups: UpgradeGroup[] = []

  // The chapter's own upgrade groups keep their internal (namespaced) id for
  // lookup, but display a letter continuing the base faction's own lettering
  // sequence — computed here, not hardcoded, so it stays correct if the base
  // roster's group count ever changes (see design.md decision 1).
  const bundleGroups = bundle.upgradeGroups.map((g, i) => ({
    ...g,
    displayId: letterFor(base.upgradeGroups.length + i),
  }))

  const applyTactics = (unit: UnitProfile): UnitProfile => {
    const matching = tacticsRows.filter((row) => row.appliesTo(unit))
    if (!matching.length) return unit
    const groupId = `${chapterId}-tactics-${unitSlug(unit.id)}`
    chapterTacticsGroups.push(
      group(
        groupId,
        [
          section(
            'Chapter Tactics',
            'any',
            matching.map((row) => ({ label: row.label, cost: row.cost, adds: [row.rule] })),
          ),
        ],
        { hideId: true },
      ),
    )
    return { ...unit, upgradeGroups: [...unit.upgradeGroups, groupId] }
  }

  // Chapter Tactics only apply to base Space Marines units — a chapter's own
  // units already carry that chapter's signature ability directly in their
  // baseline special rules, so offering the option again would be redundant.
  const units = [...base.units.map(applyTactics), ...bundle.units].sort(
    (a, b) => categoryRank(a) - categoryRank(b),
  )

  const armyRules = [...base.armyRules]
  const seenRuleIds = new Set(armyRules.map((r) => r.id))
  for (const rule of bundle.armyRules) {
    if (seenRuleIds.has(rule.id)) continue
    seenRuleIds.add(rule.id)
    armyRules.push(rule)
  }

  return {
    id: base.id,
    name: base.name,
    system: base.system,
    units,
    upgradeGroups: [...base.upgradeGroups, ...bundleGroups, ...chapterTacticsGroups],
    armyRules,
    psychicPowers: base.psychicPowers,
  }
}
