// Warhammer Fantasy ranged-weapon table, transcribed from `one-page-fantasy-rules.md`'s
// "Weapons" section. The 5 melee attack tiers are identical to Warhammer 40k's and are
// shared via `weapons.ts` (see `meleeWeapon()`/`meleeTypeRules` in `helpers.ts`) — only
// the ranged weapons that differ or are Fantasy-only live here.
// Footnotes: p = Piercing; x = Piercing AND all wounds must be assigned to a single model.

import type { RuleRef, Weapon } from '../domain/types'

/** Helper rule refs for the `p` and `x` weapon notations. */
const P: RuleRef[] = [{ ruleId: 'piercing' }]
const X: RuleRef[] = [{ ruleId: 'piercing' }, { ruleId: 'single-target' }]

export const weaponsFantasy = [
  { id: 'throwing-weapon', name: 'Throwing Weapon', range: 12, attacks: '1', rules: [] },
  { id: 'pistol', name: 'Pistol', range: 12, attacks: '1', rules: P },
  { id: 'shortbow', name: 'Shortbow', range: 18, attacks: '1', rules: [] },
  { id: 'fire-thrower', name: 'Fire Thrower', range: 18, attacks: '6', rules: [] },
  { id: 'bow', name: 'Bow', range: 24, attacks: '1', rules: [] },
  { id: 'rifle', name: 'Rifle', range: 24, attacks: '1', rules: P },
  { id: 'longbow', name: 'Longbow', range: 30, attacks: '1', rules: [] },
  { id: 'crossbow', name: 'Crossbow', range: 30, attacks: '1', rules: P },
  { id: 'stone-thrower', name: 'Stone Thrower', range: 48, attacks: '3', rules: P },
  { id: 'cannon', name: 'Cannon', range: 48, attacks: 'D3+3', rules: P },
  { id: 'bolt-thrower', name: 'Bolt Thrower', range: 48, attacks: '3', rules: X },
] as const satisfies Weapon[]

export type FantasyWeaponId = (typeof weaponsFantasy)[number]['id']
