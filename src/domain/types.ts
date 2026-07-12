// Typed schema for the One Page 40k ruleset (v3.3.1).
// All values populated under src/data/** are sourced exclusively from
// `1p40k - Main Rulebook v3.3.1.pdf`.

/**
 * A glossary special-rule definition. Parameterized rules (e.g. `Tough(X)`)
 * set `hasParameter: true`; units/weapons reference them with a concrete value
 * via {@link RuleRef.param}.
 */
export interface SpecialRule {
  id: string
  name: string
  text: string
  hasParameter?: boolean
}

/**
 * A reference to a {@link SpecialRule} as carried by a unit or weapon.
 * `param` holds the numeric value for parameterized rules (e.g. Tough(3) → 3).
 * `note` carries any short inline qualifier printed in the PDF (e.g. "in Melee").
 */
export interface RuleRef {
  ruleId: string
  /** Numeric value (e.g. Tough(3)) or dice/qualified expression (e.g. Impact(D3), Tough(+3)). */
  param?: number | string
  note?: string
}

/**
 * A weapon profile. `range` is `null` for melee weapons (printed as `-`).
 * `attacks` is the printed attacks string (e.g. `1`, `D3`, `2D6`) kept verbatim
 * because many are dice expressions; `rules` normalizes `p`/`x`/named rules.
 */
export interface Weapon {
  id: string
  name: string
  /** Range in inches (may be a dice expression such as "3D6"), or null for melee weapons. */
  range: number | string | null
  /** Attacks value as printed (may be a dice expression such as "D3" or "2D6"). */
  attacks: string
  rules: RuleRef[]
}

/**
 * A piece of equipment a unit carries: either an inline weapon profile or a
 * reference to a global weapon, optionally with a count and a display label.
 */
export interface EquipmentEntry {
  /**
   * Stable identity for upgrade matching (add/remove/replace), independent of
   * the display label — e.g. a global weapon's table id, or a kebab-case id
   * derived from a custom/gear name. Never derived from `label`, since `label`
   * carries size-dependent pluralization/count text that isn't a stable key.
   */
  key: string
  /** Display label as printed (e.g. "Linked Assault Rifle", "2x Hurricane Bolters"). */
  label: string
  /** Number of identical copies (default 1). */
  count?: number
  /** Number of models in the unit carrying this entry. Defaults to the unit's full size when omitted. */
  unitCount?: number
  /** The weapon profile, if this entry is a weapon. */
  weapon?: Weapon
  /** Rules attached to this equipment entry (e.g. Linked, Rending) when not a full weapon. */
  rules?: RuleRef[]
}

export interface UnitProfile {
  id: string
  factionId: string
  name: string
  /** Unit size (number of models in the base profile). */
  size: number
  /** Quality value as printed (e.g. "3+"). Vehicles/platforms may be "-". */
  quality: string
  equipment: EquipmentEntry[]
  specialRules: RuleRef[]
  /** Upgrade-group letters available to this unit (e.g. ["A", "H"]). */
  upgradeGroups: string[]
  cost: number
  /** True when the unit carries the Hero special rule (counts against hero limit). */
  isHero: boolean
}

/** How options within an upgrade section may be selected. */
export type UpgradeSelection =
  | 'one' // pick at most one option
  | 'any' // pick any number of options
  | 'upToTwo' // pick up to two options
  | 'upToThree' // pick up to three options
  | 'upToFour' // pick up to four options

/** An effect an upgrade option applies to a unit. */
export interface UpgradeEffect {
  /** Special-rule references this option adds. */
  addRules?: RuleRef[]
  /** Special-rule ids this option removes. */
  removeRules?: string[]
  /** Equipment entries this option adds. */
  addEquipment?: EquipmentEntry[]
  /** Equipment keys ({@link EquipmentEntry.key}) this option removes/replaces, regardless of unit size. */
  removeEquipment?: string[]
  /**
   * Equipment keys ({@link EquipmentEntry.key}) this option replaces one model's
   * worth of, regardless of unit size: the matching entry's model-count is
   * reduced by one (removed entirely once it reaches zero) rather than removed
   * outright — a partial "replace one/up to N" swap where other models may
   * still carry the replaced item. Matching is by exact key, so it is
   * independent of the target entry's size-dependent pluralized label.
   */
  removeOneEquipment?: string[]
}

export interface UpgradeOption {
  id: string
  label: string
  /** Point delta as printed (0 for "Free"). */
  costDelta: number
  effects?: UpgradeEffect
}

/**
 * Cross-section availability rule for an {@link UpgradeSection}. Every id
 * referenced here is an {@link UpgradeOption.id} elsewhere in the same unit's
 * upgrade groups.
 */
export interface SectionPrerequisite {
  /** This section is unavailable while any of these options are selected. */
  blockedBySelecting?: string[]
  /** Same as `blockedBySelecting`, but only enforced when the unit has exactly one model. */
  blockedBySelectingOnSingleModel?: string[]
  /** This section is only available while at least one of these options is selected. */
  requiresOneOfSelected?: string[]
  /**
   * Alternative to `requiresOneOfSelected`: also satisfied if the unit's baseline
   * equipment already includes any of these equipment keys ({@link EquipmentEntry.key})
   * (e.g. a unit that starts with the relevant gear needs no prior selection to
   * unlock the section).
   */
  satisfiedByEquipment?: string[]
}

/**
 * One independently-constrained sub-choice within a lettered upgrade group
 * (e.g. "Replace one Assault Rifle", "Take up to two"). A single letter in
 * the rulebook is usually a stack of several of these, each with its own cap.
 */
export interface UpgradeSection {
  title: string
  selection: UpgradeSelection
  options: UpgradeOption[]
  /** Cross-section dependency on other options elsewhere in the unit, if any. */
  prerequisite?: SectionPrerequisite
}

export interface UpgradeGroup {
  /** Group letter as printed (e.g. "A"). */
  id: string
  sections: UpgradeSection[]
  /** When true, the UI omits the `id` prefix from section headings (for synthesized groups whose id isn't player-facing, e.g. Chapter Tactics). */
  hideId?: boolean
  /** Display letter shown instead of `id` in section headings, when `id` itself isn't player-facing (e.g. a chapter's own re-namespaced groups) but a real letter should still be shown. */
  displayId?: string
}

export interface Faction {
  id: string
  name: string
  units: UnitProfile[]
  upgradeGroups: UpgradeGroup[]
  armyRules: SpecialRule[]
  psychicPowers: PsychicPower[]
}

/** A psychic power: `castValue` is the number in brackets (e.g. "5+" → 5). */
export interface PsychicPower {
  id: string
  name: string
  castValue: number
  text: string
}

/** Army-composition limits from the advanced rules. */
export interface CompositionRules {
  defaultPointsCap: number
  /** Ascending points→maxHeroes thresholds. */
  heroLimitTable: Array<{ points: number; maxHeroes: number }>
}

export interface RulesDatabase {
  factions: Faction[]
  glossary: SpecialRule[]
  weapons: Weapon[]
  composition: CompositionRules
}
