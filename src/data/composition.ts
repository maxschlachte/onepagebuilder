// Army-composition limits, from `1p40k - Main Rulebook v3.3.1.pdf`.
// Core rules: 750pts, one Hero. Advanced "Playing Bigger Games" table scales the
// hero limit with points (750→0-1, 1500→0-2, … 6000→0-8).

import type { CompositionRules } from '../domain/types'

export const composition: CompositionRules = {
  defaultPointsCap: 750,
  heroLimitTable: [
    { points: 750, maxHeroes: 1 },
    { points: 1500, maxHeroes: 2 },
    { points: 2250, maxHeroes: 3 },
    { points: 3000, maxHeroes: 4 },
    { points: 3750, maxHeroes: 5 },
    { points: 4500, maxHeroes: 6 },
    { points: 5250, maxHeroes: 7 },
    { points: 6000, maxHeroes: 8 },
  ],
}

/**
 * Maximum number of Hero units allowed for a given points cap.
 * Returns the limit for the highest table threshold at or below `cap`,
 * defaulting to 1 for any cap below the first threshold (small games still
 * allow the single core-rules Hero).
 */
export function maxHeroes(cap: number): number {
  let limit = 1
  for (const row of composition.heroLimitTable) {
    if (cap >= row.points) limit = row.maxHeroes
  }
  return limit
}
