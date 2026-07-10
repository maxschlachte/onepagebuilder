// Compact builders for transcribing faction data from the PDF into typed objects.
// These let each faction module stay close to the rulebook's printed layout while
// still producing fully-typed UnitProfile / UpgradeGroup objects.

import type {
  EquipmentEntry,
  Faction,
  PsychicPower,
  RuleRef,
  SectionPrerequisite,
  SpecialRule,
  UnitProfile,
  UpgradeGroup,
  UpgradeOption,
  UpgradeSection,
  UpgradeSelection,
  Weapon,
} from '../../domain/types'
import { weapons, type WeaponId } from '../weapons'

const weaponByName = new Map(weapons.map((w) => [w.name.toLowerCase(), w]))
const weaponById = new Map(weapons.map((w) => [w.id, w]))

/** Ids of the melee attack tiers (`Light`/`Medium`/`Heavy`/`Master`/`Force`), keyed by lowercase name. */
const meleeTierNames = new Set(weapons.filter((w) => w.range === null).map((w) => w.name.toLowerCase()))

/**
 * Innate rules for a close-combat weapon *type* word, per the rulebook's general
 * weapons table: `CCW`/`Claws` carry no special rules (and so are absent here —
 * any type word not listed defaults to no innate rules), `Powersword` counts as
 * Piercing, and `Powerfist` counts as Piercing and Rending.
 */
const meleeTypeRules: Record<string, RuleRef[]> = {
  powersword: [{ ruleId: 'piercing' }],
  powerfist: [{ ruleId: 'piercing' }, { ruleId: 'rending' }],
}

/** Clone `tier` with its type's innate rules (if any) attached. */
function withMeleeTypeRules(tier: Weapon, typeWord: string): Weapon {
  const typeRules = meleeTypeRules[typeWord]
  return typeRules?.length ? { ...tier, rules: [...typeRules] } : tier
}

/**
 * Resolve a bare equipment name against the global weapon table: first by an
 * exact (de-pluralized) match, then — for close-combat weapons, which faction
 * data always writes as `"<Tier> <Type>"` (e.g. `Medium CCW`, `Heavy Claws`,
 * `Light Powerfist`) rather than the bare tier word alone — by checking
 * whether the leading word is one of the melee attack tiers, and if so
 * whether the remaining type word carries its own innate rules (e.g.
 * `Powersword` → Piercing). A bare type word with no tier prefix at all
 * (seen only for a single "Powersword" upgrade option, printed directly
 * below a "Pistol and Medium CCW" option in the same list) defaults to the
 * Medium tier.
 */
function resolveGlobalWeapon(lookupName: string): Weapon | undefined {
  const exact = weaponByName.get(lookupName.toLowerCase().replace(/s$/, ''))
  if (exact) return exact

  const words = lookupName.toLowerCase().split(/\s+/)
  if (meleeTierNames.has(words[0])) {
    const tier = weaponByName.get(words[0])!
    const typeWord = words.slice(1).join(' ').replace(/s$/, '')
    return withMeleeTypeRules(tier, typeWord)
  }
  const typeWord = words.join(' ').replace(/s$/, '')
  if (typeWord in meleeTypeRules) {
    return withMeleeTypeRules(weaponByName.get('medium')!, typeWord)
  }
  return undefined
}

/** Convert a rule name to its id (kebab-case), matching glossary/army-rule ids. */
export function nameToId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Parse a single special-rule token such as `Fearless`, `Tough(3)`, `Impact(D3)`,
 * `Transport(11)`, or `Rending (in Melee)` into a RuleRef.
 */
export function parseRule(token: string): RuleRef {
  const m = token.trim().match(/^([^()]+?)\s*(?:\((.+)\))?$/)
  if (!m) return { ruleId: nameToId(token) }
  const name = m[1].trim()
  const inner = m[2]?.trim()
  const ref: RuleRef = { ruleId: nameToId(name) }
  if (inner !== undefined) {
    // Plain integer → numeric param; signed (+3) or dice (D3) → keep verbatim string.
    if (/^\d+$/.test(inner)) ref.param = Number(inner)
    else if (/\d/.test(inner)) ref.param = inner
    else ref.note = inner
  }
  return ref
}

/** Parse a comma-separated special-rules list (respecting parentheses). */
export function rules(list: string): RuleRef[] {
  if (!list || list === '-') return []
  return splitTopLevel(list, ',').map(parseRule)
}

/** Split on a delimiter while respecting parenthesis depth. */
export function splitTopLevel(str: string, delim: string): string[] {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of str) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === delim && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

/** Push `ref` onto `list` unless a rule with the same id is already present. */
function addUniqueRule(list: RuleRef[], ref: RuleRef): void {
  if (!list.some((r) => r.ruleId === ref.ruleId)) list.push(ref)
}

/**
 * Compute the stable {@link EquipmentEntry.key} for a printed-name equipment
 * token — used to key `removeEquipment`/`removeOneEquipment`/`satisfiedByEquipment`
 * targets so a target string (e.g. `Assault Rifle`, `Pistol (Ignores Cover)`)
 * keys identically to whatever `weapon`/`meleeWeapon`/`customWeapon`/`gear`/`linked`
 * call built the entry it's meant to match, regardless of an inline profile or a
 * `Linked ` prefix on either side.
 */
function equipmentKeyOf(token: string): string {
  let label = token.trim()
  const countM = label.match(/^(\d+)x\s+/)
  if (countM) label = label.slice(countM[0].length)

  const parenM = label.match(/^(.+?)\s*\((.+)\)\s*$/)
  const baseName = (parenM ? parenM[1] : label).trim()
  const inner = parenM?.[2]?.trim()

  const linkedM = baseName.match(/^linked\s+/i)
  const lookupName = (linkedM ? baseName.slice(linkedM[0].length) : baseName).trim()

  const looksLikeProfile = !!inner && /(\d+\s*["“”]|(?:^|,\s*)A[\dD])/.test(inner)
  const known = !looksLikeProfile ? resolveGlobalWeapon(lookupName) : undefined
  // A bare name (or one with an inline profile) is uniquely identified by the
  // name alone; a name with a non-profile parenthetical (e.g. a rule-granting
  // compound like `Drone (Markerlight)`) needs the parenthetical folded in too,
  // since several such compounds can share the same bare name on one unit.
  const keyBasis = looksLikeProfile || known || !inner ? lookupName : `${lookupName} ${inner}`
  const baseKey = nameToId(keyBasis.replace(/s$/, ''))
  return linkedM ? `linked-${baseKey}` : baseKey
}

/** Pluralize a bare word/phrase (append `s`, unless it already ends with one). */
function pluralize(name: string): string {
  return name.endsWith('s') ? name : `${name}s`
}

/**
 * Prefix `name` with the printed `Nx ` count notation when `count` is more than
 * one, pluralizing the base name (e.g. `Heavy Flamer` → `2x Heavy Flamers`).
 * A trailing parenthetical (e.g. `Drone (Stealth)`) is pluralized before the
 * parens, which stay as printed: `Drone (Stealth)` → `2x Drones (Stealth)`.
 */
function withCountPrefix(name: string, count?: number): string {
  if (!count || count <= 1) return name
  const parenM = name.match(/^(.+?)\s*(\(.+\))\s*$/)
  return parenM ? `${count}x ${pluralize(parenM[1])} ${parenM[2]}` : `${count}x ${pluralize(name)}`
}

/** Options shared by every structured equipment builder below. */
export interface EquipmentOpts {
  /** Number of identical copies (default 1); also prefixes the auto-derived label (e.g. `2x Hurricane Bolters`). */
  count?: number
  /** Number of models in the unit carrying this entry. Defaults to the unit's full size when omitted. */
  unitCount?: number
  /** Extra rules merged alongside the weapon's/type's own innate rules. */
  rules?: RuleRef[]
  /** Override the auto-derived display label (rare — e.g. to match a compound label printed in the PDF). */
  label?: string
  /** Override the auto-derived key, for the rare case where two distinct entries on one unit would otherwise collide. */
  key?: string
}

/** Reference a global weapon-table entry by id — the id is checked at compile time against {@link WeaponId}. */
export function weapon(id: WeaponId, opts: EquipmentOpts = {}): EquipmentEntry {
  const base = weaponById.get(id)!
  const weaponRules = [...base.rules]
  for (const r of opts.rules ?? []) addUniqueRule(weaponRules, r)
  return {
    key: opts.key ?? id,
    label: opts.label ?? withCountPrefix(base.name, opts.count),
    count: opts.count ?? 1,
    unitCount: opts.unitCount,
    weapon: { ...base, rules: weaponRules },
  }
}

/**
 * A close-combat weapon named as `"<Tier> <Type>"` (e.g. `Medium Powersword`,
 * `Heavy Claws`) per the rulebook's general weapons table: `tier` supplies the
 * range/attacks (from the global table), `type` supplies any innate rules
 * (`Powersword` → Piercing; `Powerfist` → Piercing and Rending; anything else,
 * e.g. `CCW`/`Claws`, → none). For a bare tier with no type word, use
 * {@link weapon} with the tier's own id (e.g. `weapon('medium')`) instead.
 */
export function meleeWeapon(
  tier: 'Light' | 'Medium' | 'Heavy' | 'Master' | 'Force',
  type: string,
  opts: EquipmentOpts = {},
): EquipmentEntry {
  const tierWeapon = weaponById.get(nameToId(tier) as WeaponId)!
  const typeRules = meleeTypeRules[type.toLowerCase()] ?? []
  const weaponRules = [...typeRules]
  for (const r of opts.rules ?? []) addUniqueRule(weaponRules, r)
  const name = `${tier} ${type}`
  return {
    key: opts.key ?? nameToId(name),
    label: opts.label ?? withCountPrefix(name, opts.count),
    count: opts.count ?? 1,
    unitCount: opts.unitCount,
    weapon: { ...tierWeapon, rules: weaponRules },
  }
}

/** A weapon with a profile not present in the global weapon table. */
export function customWeapon(
  name: string,
  profile: { range: number | string | null; attacks: string; rules?: RuleRef[] },
  opts: EquipmentOpts = {},
): EquipmentEntry {
  return {
    // Depluralized, matching equipmentKeyOf's convention — a plural baseline
    // name (e.g. "Disintegrator Cannons") must key identically to a singular
    // remove/prerequisite target (e.g. "Disintegrator Cannon").
    key: opts.key ?? nameToId(name.replace(/s$/, '')),
    label: opts.label ?? withCountPrefix(name, opts.count),
    count: opts.count ?? 1,
    unitCount: opts.unitCount,
    weapon: { id: nameToId(name), name, range: profile.range, attacks: profile.attacks, rules: profile.rules ?? [] },
  }
}

/** Non-weapon equipment (e.g. `Servo Arm`, `Markerlight`) that only grants rules, if any. */
export function gear(name: string, opts: EquipmentOpts = {}): EquipmentEntry {
  return {
    key: opts.key ?? nameToId(name.replace(/s$/, '')),
    label: opts.label ?? withCountPrefix(name, opts.count),
    count: opts.count ?? 1,
    unitCount: opts.unitCount,
    rules: opts.rules ?? [],
  }
}

/**
 * Wrap any equipment entry to add a resolvable `Linked` rule reference and a
 * `Linked ` label prefix, replacing the old `Linked <name>` name-prefix
 * convention. The key is prefixed too, so `linked(weapon('assault-rifle'))`
 * never collides with a separate unlinked `weapon('assault-rifle')` entry on
 * the same unit (the `Linked Assault Rifles, Assault Rifles` pattern seen on
 * several units). Pass `count`/`unitCount` here rather than to the wrapped
 * builder call, so the `Nx ` prefix/pluralization is computed on the full
 * `Linked <name>` phrase (e.g. `2x Linked Lascannons`, not `Linked 2x Lascannons`).
 * `label` overrides the auto-derived label entirely (e.g. to pluralize for a
 * multi-model unit's baseline: `Linked Assault Rifles`).
 */
export function linked(
  entry: EquipmentEntry,
  opts: { count?: number; unitCount?: number; label?: string } = {},
): EquipmentEntry {
  const count = opts.count ?? entry.count
  const label = opts.label ?? withCountPrefix(`Linked ${entry.label}`, count)
  const unitCount = opts.unitCount ?? entry.unitCount
  if (entry.weapon) {
    const weaponRules = [...entry.weapon.rules]
    addUniqueRule(weaponRules, { ruleId: 'linked' })
    return { ...entry, key: `linked-${entry.key}`, label, count, unitCount, weapon: { ...entry.weapon, rules: weaponRules } }
  }
  const entryRules = [...(entry.rules ?? [])]
  addUniqueRule(entryRules, { ruleId: 'linked' })
  return { ...entry, key: `linked-${entry.key}`, label, count, unitCount, rules: entryRules }
}

/** Throw if two entries in the same list share a key (see `EquipmentOpts.key` to disambiguate). */
function assertUniqueKeys(context: string, entries: EquipmentEntry[]): void {
  const seen = new Set<string>()
  for (const e of entries) {
    if (seen.has(e.key)) {
      throw new Error(
        `${context}: duplicate equipment key "${e.key}" (${e.label}) — pass an explicit { key } override to disambiguate`,
      )
    }
    seen.add(e.key)
  }
}

export interface UnitInput {
  name: string
  size: number
  quality: string
  /** Structured equipment entries built via `weapon`/`meleeWeapon`/`customWeapon`/`gear`/`linked`. */
  equipment: EquipmentEntry[]
  special: string
  upgrades: string // e.g. "A, H" or "-"
  cost: number
}

/** Build a UnitProfile, deriving isHero from the special-rules list. */
export function unit(factionId: string, u: UnitInput): UnitProfile {
  const specialRefs = rules(u.special)
  assertUniqueKeys(`unit "${u.name}"`, u.equipment)
  return {
    id: `${factionId}.${nameToId(u.name)}`,
    factionId,
    name: u.name,
    size: u.size,
    quality: u.quality,
    equipment: u.equipment,
    specialRules: specialRefs,
    upgradeGroups:
      u.upgrades === '-' ? [] : u.upgrades.split(',').map((s) => s.trim()).filter(Boolean),
    cost: u.cost,
    isHero: specialRefs.some((r) => r.ruleId === 'hero'),
  }
}

export interface OptionInput {
  label: string
  cost: number
  /** Rule tokens this option adds (parsed); e.g. ["Deep Strike", "Flying"]. */
  adds?: string[]
  removeRules?: string[]
  /** Structured equipment entries this option adds, built via `weapon`/`meleeWeapon`/`customWeapon`/`gear`/`linked`. */
  addEquipment?: EquipmentEntry[]
  /**
   * Equipment this option removes/replaces, referenced by the printed name as
   * it would appear on the baseline/added entry (e.g. `Assault Rifle`,
   * `Medium Powersword`, `Pistol (Ignores Cover)`) — resolved to the matching
   * entry's stable key via `equipmentKeyOf`, so the two always agree regardless
   * of which side carries an inline profile or a `Linked ` prefix.
   */
  removeEquipment?: string[]
  /** Same as removeEquipment, but reduces the target's model-count by one instead of removing it outright. */
  removeOneEquipment?: string[]
}

export function option(groupId: string, idx: number, o: OptionInput): UpgradeOption {
  const opt: UpgradeOption = {
    id: `${groupId}.${idx}`,
    label: o.label,
    costDelta: o.cost,
  }
  const effects: NonNullable<UpgradeOption['effects']> = {}
  if (o.adds?.length) effects.addRules = o.adds.map(parseRule)
  if (o.removeRules?.length) effects.removeRules = o.removeRules.map(nameToId)
  if (o.addEquipment?.length) {
    assertUniqueKeys(`option "${o.label}"`, o.addEquipment)
    effects.addEquipment = o.addEquipment
  }
  if (o.removeEquipment?.length) effects.removeEquipment = o.removeEquipment.map(equipmentKeyOf)
  if (o.removeOneEquipment?.length) {
    effects.removeOneEquipment = o.removeOneEquipment.map(equipmentKeyOf)
  }
  if (Object.keys(effects).length) opt.effects = effects
  return opt
}

/**
 * A section's prerequisite, authored in terms of option *labels* (as printed)
 * rather than ids — ids don't exist yet at authoring time since they're a
 * running index assigned once per group, and a prerequisite may reference an
 * option in a *different* group that happens to share units with this one
 * (e.g. a separate "Replace all Assault Rifles" group). `faction()` resolves
 * each label to its option id across the whole faction's upgrade groups,
 * throwing on an unknown label so a typo fails at data-load time instead of
 * silently no-oping.
 */
export interface SectionPrerequisiteInput {
  blockedBySelecting?: string[]
  blockedBySelectingOnSingleModel?: string[]
  requiresOneOfSelected?: string[]
  /**
   * Alternative to `requiresOneOfSelected`: also satisfied if the unit's
   * baseline equipment already includes any of these equipment tokens (parsed
   * to a key via `equipmentKeyOf`, then matched against `EquipmentEntry.key`).
   * Unlike the other fields, these aren't option labels, so `faction()` keys
   * them rather than resolving them to an option id.
   */
  satisfiedByEquipment?: string[]
}

export interface SectionInput {
  /** Sub-heading as printed, e.g. "Replace one Assault Rifle", "Take up to two". */
  title: string
  selection: UpgradeSelection
  options: OptionInput[]
  prerequisite?: SectionPrerequisiteInput
}

/** Sections with a not-yet-resolved (label-based) prerequisite, keyed by the built section object. */
const pendingPrerequisites = new WeakMap<UpgradeSection, SectionPrerequisiteInput>()

/** Build one independently-constrained sub-choice within a lettered group. */
export function section(
  title: string,
  selection: UpgradeSelection,
  options: OptionInput[],
  prerequisite?: SectionPrerequisiteInput,
): SectionInput {
  return { title, selection, options, prerequisite }
}

/**
 * Build a lettered upgrade group from one or more sections. Option ids are a
 * running index flattened across all sections in authoring order (e.g. the
 * 3rd option of the 2nd section still gets `${id}.2` if the first section had
 * two options), matching the pre-existing `${groupId}.${index}` id scheme.
 * Any section prerequisite is resolved later, in `faction()`, once every
 * group's options (and their ids) are known.
 */
export function group(id: string, sections: SectionInput[]): UpgradeGroup {
  let idx = 0
  const built: UpgradeSection[] = sections.map((s) => {
    const sec: UpgradeSection = {
      title: s.title,
      selection: s.selection,
      options: s.options.map((o) => option(id, idx++, o)),
    }
    if (s.prerequisite) pendingPrerequisites.set(sec, s.prerequisite)
    return sec
  })
  return { id, sections: built }
}

export function armyRule(name: string, text: string): SpecialRule {
  return { id: nameToId(name), name, text }
}

export function power(name: string, castValue: number, text: string): PsychicPower {
  return { id: nameToId(name), name, castValue, text }
}

export interface FactionInput {
  id: string
  name: string
  units: UnitInput[]
  upgradeGroups: UpgradeGroup[]
  armyRules: SpecialRule[]
  psychicPowers: PsychicPower[]
}

export function faction(input: FactionInput): Faction {
  const labelToId = new Map<string, string>()
  for (const group of input.upgradeGroups) {
    for (const sec of group.sections) {
      for (const opt of sec.options) {
        if (!labelToId.has(opt.label)) labelToId.set(opt.label, opt.id)
      }
    }
  }

  function resolveLabels(labels: string[] | undefined): string[] | undefined {
    if (!labels?.length) return undefined
    return labels.map((label) => {
      const optId = labelToId.get(label)
      if (!optId) {
        throw new Error(`faction "${input.id}": prerequisite references unknown option label "${label}"`)
      }
      return optId
    })
  }

  for (const group of input.upgradeGroups) {
    for (const sec of group.sections) {
      const raw = pendingPrerequisites.get(sec)
      if (!raw) continue
      const prerequisite: SectionPrerequisite = {
        blockedBySelecting: resolveLabels(raw.blockedBySelecting),
        blockedBySelectingOnSingleModel: resolveLabels(raw.blockedBySelectingOnSingleModel),
        requiresOneOfSelected: resolveLabels(raw.requiresOneOfSelected),
        satisfiedByEquipment: raw.satisfiedByEquipment?.map(equipmentKeyOf),
      }
      sec.prerequisite = prerequisite
    }
  }

  return {
    id: input.id,
    name: input.name,
    units: input.units.map((u) => unit(input.id, u)),
    upgradeGroups: input.upgradeGroups,
    armyRules: input.armyRules,
    psychicPowers: input.psychicPowers,
  }
}
