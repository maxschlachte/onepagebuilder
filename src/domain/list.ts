// Army list model and storage schema version.

/** Bump when the persisted ArmyList shape changes in a non-backward-compatible way. */
export const LIST_SCHEMA_VERSION = 2

/** A unit added to a list, with the upgrade-option ids the user selected. */
export interface ListUnit {
  /** Stable instance id (distinct from the unit profile id; a list may hold duplicates). */
  instanceId: string
  /** References UnitProfile.id in the rules database. */
  unitId: string
  /** Selected UpgradeOption ids, keyed/stored as a flat list. */
  selectedUpgrades: string[]
  /** Instance id of the other list entry this one is combined with, if any (symmetric). */
  combinedWith?: string
  /** Instance id of the Infantry-eligible list entry this Hero/Psyker is attached to, if any. */
  joinedInfantryUnit?: string
  /**
   * Id shared by every entry in this unit's group-deployment combine (e.g.
   * Conclave/Warband/Beastmaster/Court), if any. Distinct from `combinedWith`:
   * a group can have more than 2 members of possibly-different unit types.
   */
  groupId?: string
}

export interface ArmyList {
  schemaVersion: number
  id: string
  name: string
  factionId: string
  /** Optional Space Marine chapter specialization (only meaningful when `factionId === 'space-marines'`). */
  chapterId?: string
  pointsCap: number
  units: ListUnit[]
  /** ISO timestamps. */
  createdAt: string
  updatedAt: string
}
