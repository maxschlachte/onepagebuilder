// Reactive lists store backed by localStorage, plus JSON export/import.
// A small composable-based store (per design.md) keeps the bundle lean.

import { computed, ref, watch } from 'vue'
import { rulesDatabase } from '../data/index'
import { composition } from '../data/composition'
import { chapters, getEffectiveFaction, type ChapterId } from '../data/chapters'
import { remapLegacyChapterList } from '../data/legacy-chapter-migration'
import {
  affectsAllModels,
  findSection,
  groupDeployRuleIds,
  isInfantry,
  isSectionAvailable,
  maxPicks,
  pruneInvalidSelections,
  sharedGroupDeployRuleId,
  wholeUnitOptionIds,
} from '../domain/calc'
import { LIST_SCHEMA_VERSION, type ArmyList, type ListUnit } from '../domain/list'
import type { Faction, UnitProfile } from '../domain/types'

const STORAGE_KEY = 'opr40k.lists.v1'

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function now(): string {
  return new Date().toISOString()
}

/**
 * Drop any `combinedWith`/`joinedInfantryUnit` reference that doesn't resolve
 * to a valid, still-eligible partner (missing target, `unitId`/Quality
 * mismatch, or target no longer Infantry-eligible) — matches the app's
 * "reject only structurally invalid imports, otherwise degrade gracefully"
 * posture (design.md decision 6). Mutates and returns `list`.
 */
function sanitizeLinks(list: ArmyList): ArmyList {
  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  const byId = new Map(list.units.map((u) => [u.instanceId, u]))

  for (const lu of list.units) {
    if (lu.combinedWith) {
      const partner = byId.get(lu.combinedWith)
      const profile = faction && findUnitInFaction(faction, lu.unitId)
      const partnerProfile = faction && partner && findUnitInFaction(faction, partner.unitId)
      const valid =
        !!partner &&
        partner.combinedWith === lu.instanceId &&
        partner.unitId === lu.unitId &&
        !!profile &&
        isInfantry(profile) &&
        !!partnerProfile &&
        isInfantry(partnerProfile)
      if (!valid) lu.combinedWith = undefined
    }
    if (lu.joinedInfantryUnit) {
      const host = byId.get(lu.joinedInfantryUnit)
      const profile = faction && findUnitInFaction(faction, lu.unitId)
      const hostProfile = faction && host && findUnitInFaction(faction, host.unitId)
      const valid = !!host && !!hostProfile && isInfantry(hostProfile) && !!profile && hostProfile.quality === profile.quality
      if (!valid) lu.joinedInfantryUnit = undefined
    }
  }

  // Group-deployment combine (Conclave/Warband/Beastmaster/Court): a group is
  // only valid while it has at least 2 members whose profiles still resolve
  // and still share a common group-deploy rule within that rule's model cap.
  const groups = new Map<string, ListUnit[]>()
  for (const lu of list.units) {
    if (!lu.groupId) continue
    const arr = groups.get(lu.groupId) ?? []
    arr.push(lu)
    groups.set(lu.groupId, arr)
  }
  for (const [, members] of groups) {
    if (!groupIsValid(faction, members)) {
      for (const m of members) m.groupId = undefined
    }
  }

  return list
}

/** Find a unit profile by id within an already-resolved (possibly chapter-assembled) faction. */
function findUnitInFaction(faction: Faction | undefined, unitId: string): UnitProfile | undefined {
  return faction?.units.find((u) => u.id === unitId)
}

/** Whether a group's members still resolve to valid profiles sharing a common group-deploy rule within its cap. */
function groupIsValid(faction: Faction | undefined, members: ListUnit[]): boolean {
  if (!faction || members.length < 2) return false
  const profiles = members.map((m) => findUnitInFaction(faction, m.unitId)).filter((p): p is UnitProfile => !!p)
  if (profiles.length !== members.length) return false

  const eligibleIds = groupDeployRuleIds(faction)
  for (const [ruleId, cap] of eligibleIds) {
    if (!profiles.every((p) => p.specialRules.some((r) => r.ruleId === ruleId))) continue
    const totalSize = profiles.reduce((sum, p) => sum + p.size, 0)
    return totalSize <= cap
  }
  return false
}

function load(): ArmyList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return (parsed as ArmyList[]).map(remapLegacyChapterList).map(sanitizeLinks)
  } catch {
    return []
  }
}

const lists = ref<ArmyList[]>(load())

// Persist on any change (versioned key) so lists survive reloads.
watch(
  lists,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* storage may be unavailable (private mode); ignore */
    }
  },
  { deep: true },
)

function find(id: string): ArmyList | undefined {
  return lists.value.find((l) => l.id === id)
}

function touch(list: ArmyList) {
  list.updatedAt = now()
}

function createList(
  name: string,
  factionId: string,
  pointsCap = composition.defaultPointsCap,
  chapterId?: ChapterId,
): ArmyList {
  const list: ArmyList = {
    schemaVersion: LIST_SCHEMA_VERSION,
    id: uid(),
    name: name.trim() || 'Untitled List',
    factionId,
    chapterId: factionId === 'space-marines' ? chapterId : undefined,
    pointsCap,
    units: [],
    createdAt: now(),
    updatedAt: now(),
  }
  lists.value.push(list)
  return list
}

function duplicateList(id: string): ArmyList | undefined {
  const src = find(id)
  if (!src) return undefined
  const cloned = structuredCloneSafe(src)
  // Remap instance ids so the copy's units are distinct from the source's,
  // carrying `combinedWith`/`joinedInfantryUnit`/`groupId` references along
  // with them so combined/attached/grouped relationships survive duplication.
  const idMap = new Map(cloned.units.map((u) => [u.instanceId, uid()]))
  const groupIdMap = new Map<string, string>()
  for (const u of cloned.units) {
    if (u.groupId && !groupIdMap.has(u.groupId)) groupIdMap.set(u.groupId, uid())
  }
  const units = cloned.units.map((u) => ({
    ...u,
    instanceId: idMap.get(u.instanceId)!,
    combinedWith: u.combinedWith ? idMap.get(u.combinedWith) : undefined,
    joinedInfantryUnit: u.joinedInfantryUnit ? idMap.get(u.joinedInfantryUnit) : undefined,
    groupId: u.groupId ? groupIdMap.get(u.groupId) : undefined,
  }))
  const copy: ArmyList = {
    ...cloned,
    id: uid(),
    name: `${src.name} (Copy)`,
    units,
    createdAt: now(),
    updatedAt: now(),
  }
  lists.value.push(copy)
  return copy
}

function deleteList(id: string) {
  lists.value = lists.value.filter((l) => l.id !== id)
}

function renameList(id: string, name: string) {
  const list = find(id)
  if (!list) return
  list.name = name.trim() || 'Untitled List'
  touch(list)
}

function setPointsCap(id: string, cap: number) {
  const list = find(id)
  if (!list) return
  list.pointsCap = Math.max(0, Math.round(cap) || 0)
  touch(list)
}

function addUnit(listId: string, unitId: string) {
  const list = find(listId)
  if (!list) return
  const unit: ListUnit = { instanceId: uid(), unitId, selectedUpgrades: [] }
  list.units.push(unit)
  touch(list)
}

function removeUnit(listId: string, instanceId: string) {
  const list = find(listId)
  if (!list) return
  list.units = list.units.filter((u) => u.instanceId !== instanceId)
  for (const u of list.units) {
    if (u.combinedWith === instanceId) u.combinedWith = undefined
    if (u.joinedInfantryUnit === instanceId) u.joinedInfantryUnit = undefined
    // groupId is a shared token, not a pointer to this instance, so removing
    // one member needs no cleanup on the rest — they stay linked to each other.
  }
  touch(list)
}

/**
 * Combine two list entries of the same Infantry-eligible unit into one
 * linked, symmetric pair: any whole-unit (`affectsAllModels`) option already
 * selected on either entry is unioned onto both, so "must be bought for
 * both" holds from the moment they're combined (design.md open question,
 * resolved: auto-union).
 */
function combineUnits(listId: string, instanceIdA: string, instanceIdB: string) {
  const list = find(listId)
  if (!list || instanceIdA === instanceIdB) return
  const a = list.units.find((u) => u.instanceId === instanceIdA)
  const b = list.units.find((u) => u.instanceId === instanceIdB)
  if (!a || !b || a.unitId !== b.unitId) return

  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  const profile = faction && findUnitInFaction(faction, a.unitId)
  if (!faction || !profile || !isInfantry(profile)) return

  const wholeIds = wholeUnitOptionIds(faction)
  const unionWholeUnit = [
    ...new Set([...a.selectedUpgrades, ...b.selectedUpgrades].filter((id) => wholeIds.has(id))),
  ]
  const perModel = (u: ListUnit) => u.selectedUpgrades.filter((id) => !wholeIds.has(id))
  a.selectedUpgrades = [...perModel(a), ...unionWholeUnit]
  b.selectedUpgrades = [...perModel(b), ...unionWholeUnit]
  a.combinedWith = b.instanceId
  b.combinedWith = a.instanceId
  touch(list)
}

/** Split a combined pair back into two independent entries. */
function splitUnits(listId: string, instanceId: string) {
  const list = find(listId)
  const unit = list?.units.find((u) => u.instanceId === instanceId)
  if (!list || !unit || !unit.combinedWith) return
  const partner = list.units.find((u) => u.instanceId === unit.combinedWith)
  unit.combinedWith = undefined
  if (partner) partner.combinedWith = undefined
  touch(list)
}

/**
 * Attach a Hero/Psyker list entry to an Infantry-eligible list entry of the
 * same Quality, for organizational display only — no effect on cost or
 * hero-limit validation (design.md decision 5).
 */
function attachToUnit(listId: string, instanceId: string, hostInstanceId: string) {
  const list = find(listId)
  if (!list || instanceId === hostInstanceId) return
  const unit = list.units.find((u) => u.instanceId === instanceId)
  const host = list.units.find((u) => u.instanceId === hostInstanceId)
  if (!unit || !host) return

  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  const unitProfile = faction && findUnitInFaction(faction, unit.unitId)
  const hostProfile = faction && findUnitInFaction(faction, host.unitId)
  if (!unitProfile || !hostProfile || !isInfantry(hostProfile)) return
  if (hostProfile.quality !== unitProfile.quality) return

  unit.joinedInfantryUnit = host.instanceId
  touch(list)
}

/** Detach a previously attached Hero/Psyker. */
function detachFromUnit(listId: string, instanceId: string) {
  const list = find(listId)
  const unit = list?.units.find((u) => u.instanceId === instanceId)
  if (!list || !unit) return
  unit.joinedInfantryUnit = undefined
  touch(list)
}

/**
 * Combine two list entries that share a group-deployment army rule
 * (Conclave/Warband/Beastmaster/Court) into one linked group, or add one
 * entry to an existing group. Unlike `combineUnits`, members may be
 * different unit types and a group may hold more than 2 entries, up to the
 * rule's stated model cap (design.md decision 5). Rejects joining two
 * already-distinct groups together.
 */
function joinGroup(listId: string, instanceId: string, otherInstanceId: string) {
  const list = find(listId)
  if (!list || instanceId === otherInstanceId) return
  const a = list.units.find((u) => u.instanceId === instanceId)
  const b = list.units.find((u) => u.instanceId === otherInstanceId)
  if (!a || !b) return
  if (a.groupId && b.groupId && a.groupId !== b.groupId) return

  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  const profileA = faction && findUnitInFaction(faction, a.unitId)
  const profileB = faction && findUnitInFaction(faction, b.unitId)
  if (!faction || !profileA || !profileB) return

  const ruleId = sharedGroupDeployRuleId(profileA, profileB, faction)
  if (!ruleId) return
  const cap = groupDeployRuleIds(faction).get(ruleId)
  if (cap === undefined) return

  const groupId = a.groupId ?? b.groupId ?? uid()
  const resultMemberIds = new Set(
    list.units
      .filter((u) => u.groupId === groupId || u.instanceId === a.instanceId || u.instanceId === b.instanceId)
      .map((u) => u.instanceId),
  )
  let totalSize = 0
  for (const id of resultMemberIds) {
    const member = list.units.find((u) => u.instanceId === id)!
    const profile = findUnitInFaction(faction, member.unitId)
    totalSize += profile?.size ?? 0
  }
  if (totalSize > cap) return

  a.groupId = groupId
  b.groupId = groupId
  touch(list)
}

/**
 * Remove a single entry from its group, leaving the remaining members linked.
 * If only one member would remain, its `groupId` is cleared too — a "group"
 * of one is meaningless, so it renders as a normal standalone entry rather
 * than a stale single-member group.
 */
function leaveGroup(listId: string, instanceId: string) {
  const list = find(listId)
  const unit = list?.units.find((u) => u.instanceId === instanceId)
  if (!list || !unit || !unit.groupId) return
  const groupId = unit.groupId
  unit.groupId = undefined
  const remaining = list.units.filter((u) => u.groupId === groupId)
  if (remaining.length === 1) remaining[0].groupId = undefined
  touch(list)
}

/**
 * Toggle `optionId` on a single entry, enforcing its section's selection
 * limit and any cross-section prerequisite: selecting in a "one" section
 * deselects any other selected sibling first (radio behavior); selecting in
 * a capped section is rejected once the section is already at its limit;
 * selecting in a section whose prerequisite isn't met is rejected outright.
 * Deselecting is always allowed. After any change, selections invalidated
 * elsewhere on the unit by that change are auto-cleared (cascading
 * prerequisite check). Mutates `unit.selectedUpgrades`.
 */
function applyToggle(
  faction: Faction | undefined,
  profile: UnitProfile | undefined,
  unit: ListUnit,
  optionId: string,
) {
  if (unit.selectedUpgrades.includes(optionId)) {
    unit.selectedUpgrades = unit.selectedUpgrades.filter((o) => o !== optionId)
    if (faction && profile) {
      unit.selectedUpgrades = pruneInvalidSelections(faction, profile, unit.selectedUpgrades)
    }
    return
  }

  const owning = faction && findSection(faction, optionId)
  if (owning) {
    if (profile && !isSectionAvailable(profile, owning.section, unit.selectedUpgrades)) return // prerequisite not met: reject

    const siblingIds = new Set(owning.section.options.map((o) => o.id))
    const selectedSiblings = unit.selectedUpgrades.filter((o) => siblingIds.has(o))
    const cap = maxPicks(owning.section.selection)
    if (selectedSiblings.length >= cap) {
      if (owning.section.selection !== 'one') return // capped section: reject
      // "one" section: replace the previously-selected sibling
      unit.selectedUpgrades = unit.selectedUpgrades.filter((o) => !siblingIds.has(o))
    }
  }

  unit.selectedUpgrades = [...unit.selectedUpgrades, optionId]
  if (faction && profile) {
    unit.selectedUpgrades = pruneInvalidSelections(faction, profile, unit.selectedUpgrades)
  }
}

/**
 * Toggle an upgrade option on a list entry. If the entry is part of a
 * combined pair and the option affects all models, the toggle is applied to
 * both linked entries in one atomic store update (design.md decision 4); a
 * per-model (`removeOneEquipment`-bearing) option continues to affect only
 * the entry it was toggled on.
 */
function toggleUpgrade(listId: string, instanceId: string, optionId: string) {
  const list = find(listId)
  const unit = list?.units.find((u) => u.instanceId === instanceId)
  if (!list || !unit) return

  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  const profile = faction && findUnitInFaction(faction, unit.unitId)
  const owning = faction && findSection(faction, optionId)
  const partner = unit.combinedWith ? list.units.find((u) => u.instanceId === unit.combinedWith) : undefined

  applyToggle(faction, profile, unit, optionId)
  if (partner && owning && affectsAllModels(owning.section)) {
    applyToggle(faction, profile, partner, optionId)
  }
  touch(list)
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

// --- JSON export / import ---------------------------------------------------

export function exportListToJson(list: ArmyList): string {
  return JSON.stringify(list, null, 2)
}

export function downloadList(list: ArmyList) {
  const blob = new Blob([exportListToJson(list)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${list.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'army-list'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Validate a parsed object against the schema and rules DB. Throws an Error with
 * a clear message on any problem; returns a clean ArmyList on success.
 */
export function validateImported(raw: unknown): ArmyList {
  if (typeof raw !== 'object' || raw === null) throw new Error('File is not a valid army list.')
  const obj = raw as Record<string, unknown>
  if (typeof obj.name !== 'string') throw new Error('List is missing a name.')
  if (typeof obj.factionId !== 'string') throw new Error('List is missing a faction.')
  if (obj.chapterId !== undefined) {
    if (typeof obj.chapterId !== 'string' || !chapters.some((c) => c.id === obj.chapterId)) {
      throw new Error(`Unknown chapter: "${String(obj.chapterId)}".`)
    }
    if (obj.factionId !== 'space-marines') {
      throw new Error(`Chapter "${obj.chapterId}" is only valid for the Space Marines faction.`)
    }
  }
  const chapterId = obj.chapterId as ChapterId | undefined
  const faction = getEffectiveFaction(obj.factionId, chapterId)
  if (!faction) throw new Error(`Unknown faction: "${obj.factionId}".`)
  if (!Array.isArray(obj.units)) throw new Error('List is missing its units array.')

  const optionIds = new Set(
    faction.upgradeGroups.flatMap((g) => g.sections.flatMap((s) => s.options.map((o) => o.id))),
  )
  const unitIds = new Set(faction.units.map((u) => u.id))

  const units: ListUnit[] = obj.units.map((u, i) => {
    if (typeof u !== 'object' || u === null) throw new Error(`Unit #${i + 1} is malformed.`)
    const lu = u as Record<string, unknown>
    if (typeof lu.unitId !== 'string' || !unitIds.has(lu.unitId)) {
      throw new Error(`Unknown unit id "${String(lu.unitId)}" for ${faction.name}.`)
    }
    const selected = Array.isArray(lu.selectedUpgrades) ? lu.selectedUpgrades : []
    for (const opt of selected) {
      if (typeof opt !== 'string' || !optionIds.has(opt)) {
        throw new Error(`Unknown upgrade id "${String(opt)}" for ${faction.name}.`)
      }
    }
    const profile = faction.units.find((u) => u.id === lu.unitId)
    const pickCounts = new Map<string, number>()
    for (const opt of selected as string[]) {
      const owning = findSection(faction, opt)
      if (!owning) continue
      const key = `${owning.group.id}:${owning.section.title}`
      const count = (pickCounts.get(key) ?? 0) + 1
      pickCounts.set(key, count)
      const cap = maxPicks(owning.section.selection)
      if (count > cap) {
        throw new Error(
          `Unit "${String(lu.unitId)}" selects too many options in group ${owning.group.id} ("${owning.section.title}") — limit is ${cap}.`,
        )
      }
      if (profile && !isSectionAvailable(profile, owning.section, selected as string[])) {
        throw new Error(
          `Unit "${String(lu.unitId)}" selects an option in group ${owning.group.id} ("${owning.section.title}") whose prerequisite isn't met.`,
        )
      }
    }
    return {
      instanceId: typeof lu.instanceId === 'string' ? lu.instanceId : uid(),
      unitId: lu.unitId,
      selectedUpgrades: selected as string[],
      combinedWith: typeof lu.combinedWith === 'string' ? lu.combinedWith : undefined,
      joinedInfantryUnit: typeof lu.joinedInfantryUnit === 'string' ? lu.joinedInfantryUnit : undefined,
      groupId: typeof lu.groupId === 'string' ? lu.groupId : undefined,
    }
  })

  const cap =
    typeof obj.pointsCap === 'number' ? obj.pointsCap : composition.defaultPointsCap
  return sanitizeLinks({
    schemaVersion: LIST_SCHEMA_VERSION,
    id: uid(),
    name: obj.name,
    factionId: obj.factionId,
    chapterId,
    pointsCap: cap,
    units,
    createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : now(),
    updatedAt: now(),
  })
}

/** Parse + validate JSON text and add the resulting list to the store. */
export function importListFromJson(text: string): ArmyList {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('File is not valid JSON.')
  }
  const list = validateImported(parsed)
  lists.value.push(list)
  return list
}

export function useListsStore() {
  return {
    lists: computed(() => lists.value),
    rulesDatabase,
    chapters,
    getEffectiveFaction,
    find,
    createList,
    duplicateList,
    deleteList,
    renameList,
    setPointsCap,
    addUnit,
    removeUnit,
    toggleUpgrade,
    combineUnits,
    splitUnits,
    attachToUnit,
    detachFromUnit,
    joinGroup,
    leaveGroup,
    downloadList,
    importListFromJson,
  }
}
