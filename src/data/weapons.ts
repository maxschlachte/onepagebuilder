// Global weapon table, transcribed from `1p40k - Main Rulebook v3.3.1.pdf`
// (Rules page, "Weapons" table). Footnotes:
//   p = weapon counts as having Piercing.
//   x = weapon counts as Piercing AND all wounds must be assigned to a single model.

import type { RuleRef, Weapon } from '../domain/types'

/** Helper rule refs for the `p` and `x` weapon notations. */
const P: RuleRef[] = [{ ruleId: 'piercing' }]
const X: RuleRef[] = [{ ruleId: 'piercing' }, { ruleId: 'single-target' }]

export const weapons = [
  // Melee attack tiers (CCW/Claws have no special rules).
  { id: 'light', name: 'Light', range: null, attacks: '1', rules: [] },
  { id: 'medium', name: 'Medium', range: null, attacks: '2', rules: [] },
  { id: 'heavy', name: 'Heavy', range: null, attacks: '3', rules: [] },
  { id: 'master', name: 'Master', range: null, attacks: '4', rules: [] },
  { id: 'force', name: 'Force', range: null, attacks: '5', rules: [] },

  // Ranged weapons.
  { id: 'pistol', name: 'Pistol', range: 12, attacks: '1', rules: [] },
  { id: 'shotgun', name: 'Shotgun', range: 12, attacks: '2', rules: [] },
  { id: 'flamer', name: 'Flamer', range: 12, attacks: '6', rules: [] },
  { id: 'heavy-flamer', name: 'Heavy Flamer', range: 12, attacks: '6', rules: P },
  { id: 'plasma-pistol', name: 'Plasma Pistol', range: 12, attacks: '3', rules: X },
  { id: 'meltagun', name: 'Meltagun', range: 12, attacks: '6', rules: X },
  { id: 'carbine', name: 'Carbine', range: 18, attacks: '1', rules: [] },
  { id: 'assault-rifle', name: 'Assault Rifle', range: 24, attacks: '1', rules: [] },
  { id: 'minigun', name: 'Minigun', range: 24, attacks: '3', rules: [] },
  { id: 'grenade-launcher', name: 'Grenade Launcher', range: 24, attacks: 'D3', rules: P },
  { id: 'plasmagun', name: 'Plasmagun', range: 24, attacks: '3', rules: X },
  { id: 'multi-melta', name: 'Multi-Melta', range: 24, attacks: '6', rules: X },
  { id: 'rifle', name: 'Rifle', range: 30, attacks: '1', rules: [] },
  { id: 'machinegun', name: 'Machinegun', range: 36, attacks: '3', rules: [] },
  { id: 'plasma-cannon', name: 'Plasma Cannon', range: 36, attacks: '3', rules: P },
  { id: 'autocannon', name: 'Autocannon', range: 48, attacks: '2', rules: P },
  { id: 'missile-launcher', name: 'Missile Launcher', range: 48, attacks: 'D3', rules: P },
  { id: 'battle-cannon', name: 'Battle Cannon', range: 48, attacks: '9', rules: P },
  { id: 'lascannon', name: 'Lascannon', range: 48, attacks: '6', rules: X }
] as const satisfies Weapon[]

export type WeaponId = (typeof weapons)[number]['id']
