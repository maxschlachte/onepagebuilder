import type { Weapon } from './types'

/** Render a weapon's range/attacks as printed, e.g. `36", A6` or `Melee, A2`. */
export function formatWeaponProfile(weapon: Weapon): string {
  const rng = weapon.range === null ? 'Melee' : `${weapon.range}"`
  return `${rng}, A${weapon.attacks}`
}
