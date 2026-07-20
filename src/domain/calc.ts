// Pure domain logic: applying upgrades, computing costs, counting heroes, and
// validating a list against the army-composition rules. No Vue/DOM imports so
// this is unit-testable and reused by the UI and print view.

import { maxHeroes } from '../data/composition'
import { weapons } from '../data/weapons'
import type { ArmyList } from './list'
import type {
  EquipmentEntry,
  Faction,
  RuleRef,
  UnitProfile,
  UpgradeGroup,
  UpgradeOption,
  UpgradeSection,
  UpgradeSelection,
} from './types'

/** Per the rulebook: "Units without a melee weapon count as using Light CCWs/Claws." */
const lightCcw = weapons.find((w) => w.id === 'light')!

export interface EffectiveUnit {
  profile: UnitProfile
  equipment: EquipmentEntry[]
  specialRules: RuleRef[]
  /** Selected option labels, for display. */
  upgradeLabels: string[]
  /** Selected option ids that resolved to a real option, in selection order — mirrors `upgradeLabels` but as ids. */
  selectedUpgradeIds: string[]
  cost: number
}

/**
 * Special rules that disqualify a unit from being Infantry-eligible (per the
 * rulebook's "Unit Types" section). `wizard` is Age of Fantasy's own caster
 * rule, mechanically parallel to (but distinct from) Grimdark Future's `psyker`.
 */
const NON_INFANTRY_RULES = new Set(['hero', 'psyker', 'wizard', 'monster', 'vehicle'])

/**
 * A unit is Infantry-eligible ("Any non-Vehicle unit") when it carries none of
 * Hero, Psyker/Wizard, Monster, or Vehicle — derived from its special rules
 * rather than tagged per-unit, since the rulebook never prints "Infantry" as an
 * explicit per-unit special rule (see design.md decision 2).
 */
export function isInfantry(profile: UnitProfile): boolean {
  return !profile.specialRules.some((r) => NON_INFANTRY_RULES.has(r.ruleId))
}

/** A unit carries the Vehicle special rule. */
export function isVehicle(profile: UnitProfile): boolean {
  return profile.specialRules.some((r) => r.ruleId === 'vehicle')
}

/** A unit carries the Hero special rule (equivalent to `UnitProfile.isHero`, exposed as a predicate for symmetry with `isInfantry`/`isVehicle`). */
export function isHero(profile: UnitProfile): boolean {
  return profile.specialRules.some((r) => r.ruleId === 'hero')
}

/**
 * Rule ids (and their stated model cap) for army rules matching the
 * rulebook's "deploy up to N models with this rule together as one unit"
 * wording (e.g. Conclave, Warband, Beastmaster, Court) — derived from the
 * rule's own text rather than a hardcoded id list, mirroring
 * isInfantry/affectsAllModels (see design.md of
 * builder-roster-preview-and-army-rules decision 5).
 */
const GROUP_DEPLOY_PATTERN = /deploy up to (\d+) models .*(?:single|one) unit/i

export function groupDeployRuleIds(faction: Faction): Map<string, number> {
  const map = new Map<string, number>()
  for (const rule of faction.armyRules) {
    const m = rule.text.match(GROUP_DEPLOY_PATTERN)
    if (m) map.set(rule.id, Number(m[1]))
  }
  return map
}

/**
 * The group-deployment rule id shared by two unit profiles, if any — a
 * Warband model can't group with a Conclave model even though both match
 * `groupDeployRuleIds`, since the rulebook ties the "up to N models" cap to
 * one specific rule, not the pattern in general.
 */
export function sharedGroupDeployRuleId(
  a: UnitProfile,
  b: UnitProfile,
  faction: Faction,
): string | undefined {
  const ids = groupDeployRuleIds(faction)
  return a.specialRules
    .map((r) => r.ruleId)
    .filter((id) => ids.has(id))
    .find((id) => b.specialRules.some((r) => r.ruleId === id))
}

/**
 * An upgrade section affects all models when its own title says so — the
 * rulebook consistently phrases a whole-unit section as "Replace all…" /
 * "Upgrade all models…" / "Equip all models…"; every other section (a
 * single-model swap, an "any"/"up to N" section, or an unqualified
 * single-item section like "Replace Autocannon") scopes to one model or a
 * bounded subset, regardless of whether its options carry an
 * equipment-replacement effect of their own (see design.md decision 1 of
 * fix-combined-unit-whole-upgrade-scope) — or when the section is explicitly
 * marked `oncePerUnit`, for the rare case where a section's options are
 * capped at one grant per unit even though its printed title doesn't say
 * "all" (see design.md decision 1 of sergeant-musician-standard-whole-unit).
 */
export function affectsAllModels(section: UpgradeSection): boolean {
  return section.oncePerUnit === true || /\ball\b/i.test(section.title)
}

/** All option ids across a faction's upgrade groups that affect all models. */
export function wholeUnitOptionIds(faction: Faction): Set<string> {
  return new Set(
    faction.upgradeGroups
      .flatMap((g) => g.sections)
      .filter(affectsAllModels)
      .filter((s) => !s.oncePerUnit)
      .flatMap((s) => s.options.map((o) => o.id)),
  )
}

/**
 * All option ids belonging to a section explicitly marked `oncePerUnit` —
 * used by `combinedEffectiveUnit` to charge such an option's cost exactly
 * once for a combined pair, even though (per `wholeUnitOptionIds`) it's
 * still mirrored onto both linked entries' `selectedUpgrades`.
 */
export function oncePerUnitOptionIds(faction: Faction): Set<string> {
  return new Set(
    faction.upgradeGroups
      .flatMap((g) => g.sections)
      .filter((s) => s.oncePerUnit === true)
      .flatMap((s) => s.options.map((o) => o.id)),
  )
}

/**
 * Grouping key for merging equipment entries for display: entries with the
 * same `key` but different attached rules (e.g. a plain weapon vs. its
 * "Limited" variant) must NOT collapse into one summed-count entry, since
 * that would silently drop whichever side's rules aren't kept — `key` alone
 * is deliberately rule-independent (it's used for add/remove/replace
 * matching in `applyUpgrades`), so display-merge needs a finer key (see
 * design.md decision 2 of roster-info-panel-and-equipment-merge-fix).
 */
function equipmentMergeKey(e: EquipmentEntry): string {
  const rules = e.weapon?.rules ?? e.rules ?? []
  const sig = [...rules]
    .map((r) => r.ruleId)
    .sort()
    .join(',')
  return `${e.key}|${sig}`
}

export interface CombinedUnit {
  profile: UnitProfile
  /** Combined model count across both linked entries. */
  size: number
  equipment: EquipmentEntry[]
  specialRules: RuleRef[]
  upgradeLabels: string[]
  cost: number
}

/**
 * Aggregate two linked EffectiveUnits (same unitId) into one display unit:
 * doubled size, summed cost, equipment merged by key (unitCount summed,
 * defaulting each side to its own full unit size), and special
 * rules/upgrade labels deduplicated. Does not touch `applyUpgrades` or
 * per-entry cost math beyond one exception: an option belonging to a
 * `oncePerUnit` section (see `oncePerUnitOptionIds`) is mirrored onto both
 * entries' `selectedUpgrades` (so the pair's selection state stays
 * consistent), but its cost — and any equipment it adds — is only ever
 * counted once for the pair, not once per entry — see design.md decisions
 * 3 and 4 of sergeant-musician-standard-whole-unit.
 */
export function combinedEffectiveUnit(a: EffectiveUnit, b: EffectiveUnit, faction: Faction): CombinedUnit {
  const options = optionIndex(faction)
  const onceIds = oncePerUnitOptionIds(faction)
  const doubleCounted = a.selectedUpgradeIds.filter((id) => onceIds.has(id) && b.selectedUpgradeIds.includes(id))
  const overcharge = doubleCounted.reduce((sum, id) => sum + (options.get(id)?.costDelta ?? 0), 0)
  // A double-selected oncePerUnit option's own granted equipment (e.g. the Sergeant gear
  // entry) is mirrored onto both entries too — merge it at the single-entry count, not summed.
  const onceEquipmentKeys = new Set(
    doubleCounted.flatMap((id) => options.get(id)?.effects?.addEquipment?.map(equipmentMergeKey) ?? []),
  )

  const equipment: EquipmentEntry[] = []
  const seenKeys = new Set<string>()
  for (const e of [...a.equipment, ...b.equipment]) {
    const mergeKey = equipmentMergeKey(e)
    if (seenKeys.has(mergeKey)) continue
    seenKeys.add(mergeKey)
    const fromA = a.equipment.find((x) => equipmentMergeKey(x) === mergeKey)
    const fromB = b.equipment.find((x) => equipmentMergeKey(x) === mergeKey)
    const countA = fromA ? (fromA.unitCount ?? a.profile.size) : 0
    const countB = fromB ? (fromB.unitCount ?? b.profile.size) : 0
    const unitCount = onceEquipmentKeys.has(mergeKey) ? Math.max(countA, countB) : countA + countB
    equipment.push({ ...e, unitCount })
  }

  const specialRules: RuleRef[] = []
  for (const r of [...a.specialRules, ...b.specialRules]) {
    if (!specialRules.some((x) => x.ruleId === r.ruleId)) specialRules.push(r)
  }

  return {
    profile: a.profile,
    size: a.profile.size + b.profile.size,
    equipment,
    specialRules,
    upgradeLabels: [...new Set([...a.upgradeLabels, ...b.upgradeLabels])],
    cost: a.cost + b.cost - overcharge,
  }
}

export interface GroupUnit {
  /** Each distinct member unit profile and how many entries of it are in the group. */
  members: { profile: UnitProfile; count: number }[]
  /** Combined model count across every member entry. */
  size: number
  equipment: EquipmentEntry[]
  specialRules: RuleRef[]
  upgradeLabels: string[]
  cost: number
}

/**
 * Aggregate a group-deployment combine (Conclave/Warband/Beastmaster/Court —
 * possibly-different unit types, up to the rule's model cap) into one
 * display unit: a per-distinct-member roster instead of a single shared
 * profile (unlike `combinedEffectiveUnit`, whose two entries always share the
 * same profile), summed size/cost, and equipment/special rules merged by key
 * the same way. Not a reuse of `combinedEffectiveUnit` — see design.md
 * decision 6.
 */
export function groupEffectiveUnit(members: { profile: UnitProfile; eff: EffectiveUnit }[]): GroupUnit {
  const roster: { profile: UnitProfile; count: number }[] = []
  for (const m of members) {
    const existing = roster.find((r) => r.profile.id === m.profile.id)
    if (existing) existing.count += 1
    else roster.push({ profile: m.profile, count: 1 })
  }

  const effs = members.map((m) => m.eff)
  const equipment: EquipmentEntry[] = []
  const seenKeys = new Set<string>()
  for (const e of effs.flatMap((eff) => eff.equipment)) {
    const mergeKey = equipmentMergeKey(e)
    if (seenKeys.has(mergeKey)) continue
    seenKeys.add(mergeKey)
    let total = 0
    for (const eff of effs) {
      const match = eff.equipment.find((x) => equipmentMergeKey(x) === mergeKey)
      if (match) total += match.unitCount ?? eff.profile.size
    }
    equipment.push({ ...e, unitCount: total })
  }

  const specialRules: RuleRef[] = []
  for (const r of effs.flatMap((eff) => eff.specialRules)) {
    if (!specialRules.some((x) => x.ruleId === r.ruleId)) specialRules.push(r)
  }

  return {
    members: roster,
    size: effs.reduce((sum, eff) => sum + eff.profile.size, 0),
    equipment,
    specialRules,
    upgradeLabels: [...new Set(effs.flatMap((eff) => eff.upgradeLabels))],
    cost: effs.reduce((sum, eff) => sum + eff.cost, 0),
  }
}

/** Index a faction's upgrade options by id for quick lookup. */
function optionIndex(faction: Faction) {
  const map = new Map<string, Faction['upgradeGroups'][number]['sections'][number]['options'][number]>()
  for (const group of faction.upgradeGroups) {
    for (const section of group.sections) {
      for (const option of section.options) map.set(option.id, option)
    }
  }
  return map
}

/** The maximum number of options selectable within a section for a given selection rule. */
export function maxPicks(selection: UpgradeSelection): number {
  switch (selection) {
    case 'one':
      return 1
    case 'upToTwo':
      return 2
    case 'upToThree':
      return 3
    case 'upToFour':
      return 4
    case 'any':
      return Infinity
  }
}

/** Find the group/section that owns a given upgrade option id, if any. */
export function findSection(
  faction: Faction,
  optionId: string,
): { group: UpgradeGroup; section: UpgradeSection } | undefined {
  for (const group of faction.upgradeGroups) {
    for (const section of group.sections) {
      if (section.options.some((o) => o.id === optionId)) return { group, section }
    }
  }
  return undefined
}

/** Whether a section's cross-section prerequisite (if any) is currently satisfied for this unit. */
export function isSectionAvailable(
  unit: UnitProfile,
  section: UpgradeSection,
  selectedUpgradeIds: string[],
): boolean {
  const prereq = section.prerequisite
  if (!prereq) return true
  const selected = new Set(selectedUpgradeIds)

  if (prereq.blockedBySelecting?.some((id) => selected.has(id))) return false
  if (unit.size === 1 && prereq.blockedBySelectingOnSingleModel?.some((id) => selected.has(id))) {
    return false
  }
  if (prereq.requiresOneOfSelected?.length) {
    const metBySelection = prereq.requiresOneOfSelected.some((id) => selected.has(id))
    const metByEquipment = prereq.satisfiedByEquipment?.some((key) =>
      unit.equipment.some((e) => e.key === key),
    )
    if (!metBySelection && !metByEquipment) return false
  }
  if (prereq.requiresBaselineRule?.length) {
    const hasBaselineRule = prereq.requiresBaselineRule.some((req) =>
      unit.specialRules.some((r) => r.ruleId === req.ruleId && r.param === req.param),
    )
    if (!hasBaselineRule) return false
  }
  return true
}

/**
 * Whether a specific option is currently selectable: its section's
 * cross-section prerequisite (if any) must be satisfied, and — independent of
 * whatever other options share its section — its own
 * {@link UpgradeOption.requiresOneOfSelected} (if any) must also be satisfied.
 * No `faction` parameter is needed since `requiresOneOfSelected` is resolved
 * to concrete option ids at data-load time.
 */
export function isOptionAvailable(
  unit: UnitProfile,
  section: UpgradeSection,
  option: UpgradeOption,
  selectedUpgradeIds: string[],
): boolean {
  if (!isSectionAvailable(unit, section, selectedUpgradeIds)) return false
  if (option.requiresOneOfSelected?.length) {
    const selected = new Set(selectedUpgradeIds)
    if (!option.requiresOneOfSelected.some((id) => selected.has(id))) return false
  }
  return true
}

/**
 * Drop any selected upgrade ids whose owning section or option is no longer
 * available given the rest of the selection, repeating until a pass removes
 * nothing. Used to auto-clear selections invalidated by a change elsewhere on
 * the unit (e.g. deselecting the option that produced a prerequisite for
 * another pick, or deselecting a mount that a "(Mounted Only)" option depends on).
 */
export function pruneInvalidSelections(
  faction: Faction,
  unit: UnitProfile,
  selectedUpgradeIds: string[],
): string[] {
  let current = selectedUpgradeIds
  for (;;) {
    const next = current.filter((id) => {
      const owning = findSection(faction, id)
      if (!owning) return true
      const option = owning.section.options.find((o) => o.id === id)
      return option ? isOptionAvailable(unit, owning.section, option, current) : isSectionAvailable(unit, owning.section, current)
    })
    if (next.length === current.length) return next
    current = next
  }
}

/**
 * Resolve one same-`ruleId` group of duplicate special rules into a single
 * entry, per `RuleRef.param`'s own convention: a value written `+X` is an
 * additive bonus, anything else is a base value (a plain number is a tier
 * level — keep the highest; a dice expression such as `D3`/`2D6` is kept
 * verbatim, since it can't be reduced to a number).
 *
 * Merging is base ⊕ additives. When every value involved is a plain number
 * the result is arithmetic (`Tough(3)` + `Tough(+3)` → `Tough(6)`). When any
 * value is a dice expression the result is symbolic — the parts are joined
 * with `+`, preserving each contributor exactly as printed (`Impact(D3)` +
 * `Impact(+1)` → `Impact(D3+1)`; `Impact(2D6)` + `Impact(+D6)` →
 * `Impact(2D6+D6)`). Dice are never normalized (`2D6+D6` does not become
 * `3D6`): die sizes often differ, so concatenation is the one rule that
 * covers every combination and always reads as what the player rolls.
 *
 * Every contributing value is represented in the result — see
 * `parameterized-rule-merge-audit.test.ts`, which enforces that across all
 * faction data. An earlier version bailed out on any group containing a
 * dice expression and returned just its first entry, silently dropping the
 * rest; that shape was assumed unreachable but was already present in the
 * data (see design.md of merge-dice-parameterized-rules).
 */
function mergeRuleGroup(group: RuleRef[]): RuleRef {
  if (group.length === 1) return group[0]

  const isAdditiveParam = (p: RuleRef['param']): p is string => typeof p === 'string' && p.startsWith('+')
  const additive = group.filter((r): r is RuleRef & { param: string } => isAdditiveParam(r.param))
  const base = group.filter((r) => !isAdditiveParam(r.param))

  // `note`-only entries (no param at all) carry nothing to combine.
  if (base.some((r) => r.param === undefined)) return group[0]

  const allNumeric =
    base.every((r) => typeof r.param === 'number') && additive.every((r) => /^\+\d+$/.test(r.param))

  if (allNumeric) {
    const highest = base.length ? Math.max(...base.map((r) => r.param as number)) : 0
    if (!additive.length) return { ruleId: group[0].ruleId, param: highest }
    const bonus = additive.reduce((sum, r) => sum + Number(r.param.slice(1)), 0)
    return { ruleId: group[0].ruleId, param: highest + bonus }
  }

  // Symbolic: bases joined in first-occurrence order, then each additive
  // appended verbatim — its own leading `+` acts as the joiner.
  const baseText = base.map((r) => String(r.param)).join('+')
  const param = baseText + additive.map((r) => r.param).join('')
  return { ruleId: group[0].ruleId, param }
}

/** Collapse duplicate same-`ruleId` parameterized rules (see `mergeRuleGroup`), keeping first-occurrence order. */
function mergeParameterizedRules(rules: RuleRef[]): RuleRef[] {
  const byId = new Map<string, RuleRef[]>()
  for (const r of rules) {
    if (!byId.has(r.ruleId)) byId.set(r.ruleId, [])
    byId.get(r.ruleId)!.push(r)
  }

  const result: RuleRef[] = []
  for (const r of rules) {
    const group = byId.get(r.ruleId)!
    if (group[0] !== r) continue
    result.push(mergeRuleGroup(group))
  }
  return result
}

/**
 * Apply the selected upgrade options to a unit profile, producing its effective
 * equipment, special rules, and cost.
 */
export function applyUpgrades(
  unit: UnitProfile,
  selectedUpgradeIds: string[],
  faction: Faction,
): EffectiveUnit {
  const options = optionIndex(faction)
  let equipment: EquipmentEntry[] = [...unit.equipment]
  let specialRules: RuleRef[] = [...unit.specialRules]
  const upgradeLabels: string[] = []
  const appliedUpgradeIds: string[] = []
  let cost = unit.cost

  for (const id of selectedUpgradeIds) {
    const option = options.get(id)
    if (!option) continue
    upgradeLabels.push(option.label)
    appliedUpgradeIds.push(id)
    cost += option.costDelta
    const effects = option.effects
    if (!effects) continue

    const isWholeUnitSwap = !!effects.removeEquipment
    if (effects.removeEquipment) {
      const remove = new Set(effects.removeEquipment)
      equipment = equipment.filter((e) => !remove.has(e.key))
    }
    if (effects.removeOneEquipment) {
      const targets = new Set(effects.removeOneEquipment)
      equipment = equipment.flatMap((e) => {
        if (!targets.has(e.key)) return [e]
        const remaining = (e.unitCount ?? unit.size) - 1
        return remaining > 0 ? [{ ...e, unitCount: remaining }] : []
      })
    }
    if (effects.addEquipment) {
      const added = isWholeUnitSwap
        ? effects.addEquipment
        : effects.addEquipment.map((e) => ({ ...e, unitCount: e.unitCount ?? 1 }))
      equipment = [...equipment, ...added]
    }
    if (effects.removeRules) {
      const remove = new Set(effects.removeRules)
      specialRules = specialRules.filter((r) => !remove.has(r.ruleId))
    }
    if (effects.addRules) specialRules = [...specialRules, ...effects.addRules]
  }

  if (!equipment.some((e) => e.weapon?.range === null)) {
    equipment = [...equipment, { key: lightCcw.id, label: 'Light CCW', count: 1, weapon: lightCcw }]
  }

  // Age of Fantasy "Mounts" rule: a selected mount's own special rules become the
  // unit's own, with Tough specifically summed rather than kept-at-max (see
  // fantasy-mount-inheritance's design.md Decisions section).
  const mountRules = equipment.filter((e) => e.isMount).flatMap((e) => e.rules ?? [])
  if (mountRules.length) {
    const isAbsoluteTough = (r: RuleRef) => r.ruleId === 'tough' && typeof r.param === 'number'
    const toughFromMounts = mountRules.filter(isAbsoluteTough)
    specialRules = [...specialRules, ...mountRules.filter((r) => !isAbsoluteTough(r))]
    if (toughFromMounts.length) {
      const mountSum = toughFromMounts.reduce((sum, r) => sum + (r.param as number), 0)
      const base = specialRules.filter(isAbsoluteTough).reduce((max, r) => Math.max(max, r.param as number), 0)
      specialRules = [...specialRules.filter((r) => !isAbsoluteTough(r)), { ruleId: 'tough', param: base + mountSum }]
    }
  }

  return {
    profile: unit,
    equipment,
    specialRules: mergeParameterizedRules(specialRules),
    upgradeLabels,
    selectedUpgradeIds: appliedUpgradeIds,
    cost,
  }
}

function findUnit(faction: Faction, unitId: string): UnitProfile | undefined {
  return faction.units.find((u) => u.id === unitId)
}

/** Effective cost of a single list unit (base + selected upgrade deltas). */
export function unitCost(faction: Faction, unitId: string, selectedUpgrades: string[]): number {
  const unit = findUnit(faction, unitId)
  if (!unit) return 0
  return applyUpgrades(unit, selectedUpgrades, faction).cost
}

/** Total points of a list. */
export function totalPoints(list: ArmyList, faction: Faction): number {
  return list.units.reduce(
    (sum, lu) => sum + unitCost(faction, lu.unitId, lu.selectedUpgrades),
    0,
  )
}

/** Number of Hero units in a list. */
export function heroCount(list: ArmyList, faction: Faction): number {
  return list.units.reduce((count, lu) => {
    const unit = findUnit(faction, lu.unitId)
    return count + (unit?.isHero ? 1 : 0)
  }, 0)
}

export type ValidationIssueKind = 'over-cap' | 'hero-limit' | 'combined-mismatch'

export interface ValidationIssue {
  kind: ValidationIssueKind
  message: string
}

/** Validate a list against the points cap and hero limit (informational). */
export function validate(list: ArmyList, faction: Faction): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const total = totalPoints(list, faction)
  if (total > list.pointsCap) {
    issues.push({
      kind: 'over-cap',
      message: `List is ${total - list.pointsCap}pts over its ${list.pointsCap}pt cap (${total}pts).`,
    })
  }
  const heroes = heroCount(list, faction)
  const allowed = maxHeroes(list.pointsCap)
  if (heroes > allowed) {
    issues.push({
      kind: 'hero-limit',
      message: `List has ${heroes} Heroes but the limit for a ${list.pointsCap}pt army is ${allowed}.`,
    })
  }

  // Defensive fallback (design.md decision 6): the UI keeps a combined pair's
  // whole-unit selections in sync by construction, but a hand-edited/imported
  // list could still reach a mismatched state.
  const wholeUnitIds = wholeUnitOptionIds(faction)
  const checkedPairs = new Set<string>()
  for (const lu of list.units) {
    if (!lu.combinedWith) continue
    const partner = list.units.find((u) => u.instanceId === lu.combinedWith)
    if (!partner || partner.combinedWith !== lu.instanceId) continue
    const pairKey = [lu.instanceId, partner.instanceId].sort().join('|')
    if (checkedPairs.has(pairKey)) continue
    checkedPairs.add(pairKey)

    const aWhole = new Set(lu.selectedUpgrades.filter((id) => wholeUnitIds.has(id)))
    const bWhole = new Set(partner.selectedUpgrades.filter((id) => wholeUnitIds.has(id)))
    const mismatch = aWhole.size !== bWhole.size || [...aWhole].some((id) => !bWhole.has(id))
    if (mismatch) {
      const unit = findUnit(faction, lu.unitId)
      issues.push({
        kind: 'combined-mismatch',
        message: `Combined ${unit?.name ?? lu.unitId} units have mismatched whole-unit upgrade selections.`,
      })
    }
  }

  return issues
}
