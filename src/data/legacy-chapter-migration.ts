// One-time migration for lists saved before Space Marine Chapters was folded
// into the Space Marines faction (schema v1 → v2): rewrites a
// `factionId: 'space-marine-chapters'` list to `'space-marines'` with an
// inferred `chapterId`, remapping unit and upgrade-option ids to the new
// namespaced scheme. This table only needs to exist for this one-time
// migration — the live `chapters.ts` data no longer uses these old ids.
// See design.md decision 3/Risks of space-marine-chapter-specialization.

import type { ArmyList, ListUnit } from '../domain/list'
import { chapters, type ChapterId } from './chapters'

/** Old `space-marine-chapters.<slug>` unit slug → the chapter it now belongs to. */
const LEGACY_UNIT_TO_CHAPTER: Record<string, ChapterId> = {
  'sanguinary-priest': 'blood-angels',
  'death-company': 'blood-angels',
  'sanguinary-guard': 'blood-angels',
  'furioso-dreadnought': 'blood-angels',
  'baal-predator': 'blood-angels',
  'jetbike-captain': 'dark-angels',
  'deathwing-knights': 'dark-angels',
  'black-knights': 'dark-angels',
  darkshroud: 'dark-angels',
  vengeance: 'dark-angels',
  'brother-champion': 'grey-knights',
  'strike-squad': 'grey-knights',
  'grey-knights-terminators': 'grey-knights',
  dreadknight: 'grey-knights',
  'sled-captain': 'space-wolves',
  wulfen: 'space-wolves',
  'thunderwolf-cavalry': 'space-wolves',
  'fenrisian-wolves': 'space-wolves',
  wolf: 'space-wolves',
}

/** Old (flat, single-faction) upgrade-group letter → new chapter-namespaced group id. */
const LEGACY_GROUP_ID_REMAP: Record<string, string> = {
  A: 'ba-a',
  B: 'ba-b',
  C: 'ba-c',
  D: 'ba-d',
  G: 'ba-g',
  E: 'da-e',
  F: 'da-f',
  H: 'gk-h',
  I: 'gk-i',
  J: 'gk-j',
  K: 'sw-k',
  L: 'sw-l',
}

function unitSlug(unitId: string): string {
  return unitId.split('.').pop() ?? unitId
}

function remapUnitId(unitId: string): string {
  return unitId.replace(/^space-marine-chapters\./, 'space-marines.')
}

function remapOptionId(optionId: string): string {
  const m = optionId.match(/^([A-Za-z]+)\.(.+)$/)
  if (!m) return optionId
  const [, letter, rest] = m
  const newGroupId = LEGACY_GROUP_ID_REMAP[letter]
  return newGroupId ? `${newGroupId}.${rest}` : optionId
}

/** Majority chapter among a legacy list's units, breaking ties by `chapters` order. */
function inferChapter(units: ListUnit[]): ChapterId {
  const counts = new Map<ChapterId, number>()
  for (const lu of units) {
    const chapter = LEGACY_UNIT_TO_CHAPTER[unitSlug(lu.unitId)]
    if (chapter) counts.set(chapter, (counts.get(chapter) ?? 0) + 1)
  }
  let inferred: ChapterId = chapters[0].id
  let best = -1
  for (const meta of chapters) {
    const count = counts.get(meta.id) ?? 0
    if (count > best) {
      best = count
      inferred = meta.id
    }
  }
  return inferred
}

/**
 * Migrate a legacy `space-marine-chapters` list in place: reassigns it to
 * `factionId: 'space-marines'` with an inferred `chapterId`, remapping every
 * surviving unit's id and selected-upgrade ids. Units belonging to a
 * different chapter than the inferred majority are dropped (best-effort —
 * see design.md Risks). Any list that isn't `factionId === 'space-marine-chapters'`
 * is returned unchanged.
 */
export function remapLegacyChapterList(list: ArmyList): ArmyList {
  if (list.factionId !== 'space-marine-chapters') return list

  const inferred = inferChapter(list.units)
  const units: ListUnit[] = []
  for (const lu of list.units) {
    const chapter = LEGACY_UNIT_TO_CHAPTER[unitSlug(lu.unitId)]
    if (chapter !== inferred) {
      console.warn(
        `Space Marine Chapters migration: dropping list unit "${lu.unitId}" from list "${list.name}" — it belongs to a different chapter than the inferred "${inferred}".`,
      )
      continue
    }
    units.push({
      ...lu,
      unitId: remapUnitId(lu.unitId),
      selectedUpgrades: lu.selectedUpgrades.map(remapOptionId),
    })
  }

  return {
    ...list,
    factionId: 'space-marines',
    chapterId: inferred,
    units,
  }
}
