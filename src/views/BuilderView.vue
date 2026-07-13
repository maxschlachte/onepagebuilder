<script setup lang="ts">
import { computed, ref } from 'vue'
import { useListsStore } from '../stores/lists'
import { getEffectiveFaction } from '../data/chapters'
import {
  applyUpgrades,
  combinedEffectiveUnit,
  groupDeployRuleIds,
  groupEffectiveUnit,
  heroCount,
  isInfantry,
  sharedGroupDeployRuleId,
  totalPoints,
  validate,
} from '../domain/calc'
import type { CombinedUnit, EffectiveUnit, GroupUnit } from '../domain/calc'
import RuleChips from '../components/RuleChips.vue'
import EquipmentList from '../components/EquipmentList.vue'
import RuleTooltip from '../components/RuleTooltip.vue'
import EntryUpgradeControls from '../components/EntryUpgradeControls.vue'
import RosterUnitPreview from '../components/RosterUnitPreview.vue'
import { maxHeroes } from '../data/composition'
import type { ListUnit } from '../domain/list'
import type { UnitProfile } from '../domain/types'

const props = defineProps<{ listId: string }>()
const emit = defineEmits<{ back: []; print: [] }>()
const store = useListsStore()

const list = computed(() => store.find(props.listId))
const faction = computed(() =>
  list.value ? getEffectiveFaction(list.value.factionId, list.value.chapterId) : undefined,
)

const listSubtitle = computed(() => {
  if (!faction.value) return ''
  const chapterName = list.value?.chapterId
    ? store.chapters.find((c) => c.id === list.value!.chapterId)?.name
    : undefined
  return chapterName ? `${faction.value.name} (${chapterName})` : faction.value.name
})

const total = computed(() =>
  list.value && faction.value ? totalPoints(list.value, faction.value) : 0,
)
const heroes = computed(() =>
  list.value && faction.value ? heroCount(list.value, faction.value) : 0,
)
const issues = computed(() =>
  list.value && faction.value ? validate(list.value, faction.value) : [],
)
const heroLimit = computed(() => (list.value ? maxHeroes(list.value.pointsCap) : 1))
const overCap = computed(() => list.value !== undefined && total.value > list.value.pointsCap)

/** Which panel is shown below the `md` breakpoint; both panels stay visible at `md`+ regardless. */
const activeTab = ref<'roster' | 'selected'>('roster')

function profileFor(unitId: string): UnitProfile | undefined {
  return faction.value?.units.find((u) => u.id === unitId)
}

/** Roster unit ids whose info panel is currently expanded. */
const expandedRosterIds = ref(new Set<string>())

function toggleRosterInfo(unitId: string) {
  const next = new Set(expandedRosterIds.value)
  if (next.has(unitId)) next.delete(unitId)
  else next.add(unitId)
  expandedRosterIds.value = next
}

/** Every list entry's effective (post-upgrade) stats, keyed by instanceId. */
const effective = computed(() => {
  const map = new Map<string, EffectiveUnit>()
  if (!list.value || !faction.value) return map
  for (const lu of list.value.units) {
    const profile = profileFor(lu.unitId)
    if (profile) map.set(lu.instanceId, applyUpgrades(profile, lu.selectedUpgrades, faction.value))
  }
  return map
})

interface AttachedEntry {
  listUnit: ListUnit
  eff: EffectiveUnit
}
interface GroupMemberEntry {
  listUnit: ListUnit
  eff: EffectiveUnit
}
type DisplayRow =
  | { kind: 'single'; listUnit: ListUnit; eff: EffectiveUnit; attached: AttachedEntry[] }
  | {
      kind: 'combined'
      a: ListUnit
      b: ListUnit
      effA: EffectiveUnit
      effB: EffectiveUnit
      combined: CombinedUnit
      attached: AttachedEntry[]
    }
  | { kind: 'group'; groupId: string; members: GroupMemberEntry[]; group: GroupUnit; attached: AttachedEntry[] }

/**
 * Group list entries into display rows: a combined pair renders as one row,
 * a group-deployment combine (Conclave/Warband/Beastmaster/Court) renders as
 * one row, and an attached Hero/Psyker is nested under its host's row rather
 * than shown top-level. A group takes priority over an Infantry combined
 * pair if an entry somehow carries both links (not reachable through the UI,
 * since the two "Combine…" controls each exclude entries already linked the
 * other way — see design.md).
 */
const displayRows = computed<DisplayRow[]>(() => {
  if (!list.value) return []
  const units = list.value.units
  const byId = new Map(units.map((u) => [u.instanceId, u]))
  const rendered = new Set<string>()
  const rows: DisplayRow[] = []

  function attachedTo(hostId: string): AttachedEntry[] {
    return units
      .filter((u) => u.joinedInfantryUnit === hostId)
      .map((u) => ({ listUnit: u, eff: effective.value.get(u.instanceId) }))
      .filter((a): a is AttachedEntry => !!a.eff)
  }

  for (const lu of units) {
    if (rendered.has(lu.instanceId)) continue
    if (lu.joinedInfantryUnit && byId.has(lu.joinedInfantryUnit)) continue // rendered nested under its host

    if (lu.groupId) {
      const members = units.filter((u) => u.groupId === lu.groupId)
      const memberEntries = members
        .map((m) => ({ listUnit: m, eff: effective.value.get(m.instanceId) }))
        .filter((m): m is GroupMemberEntry => !!m.eff)
      if (members.length >= 2 && memberEntries.length === members.length) {
        for (const m of members) rendered.add(m.instanceId)
        rows.push({
          kind: 'group',
          groupId: lu.groupId,
          members: memberEntries,
          group: groupEffectiveUnit(memberEntries.map((m) => ({ profile: m.eff.profile, eff: m.eff }))),
          attached: memberEntries.flatMap((m) => attachedTo(m.listUnit.instanceId)),
        })
        continue
      }
    }

    const partner = lu.combinedWith ? byId.get(lu.combinedWith) : undefined
    if (partner && partner.combinedWith === lu.instanceId) {
      const effA = effective.value.get(lu.instanceId)
      const effB = effective.value.get(partner.instanceId)
      if (effA && effB) {
        rendered.add(lu.instanceId)
        rendered.add(partner.instanceId)
        rows.push({
          kind: 'combined',
          a: lu,
          b: partner,
          effA,
          effB,
          combined: combinedEffectiveUnit(effA, effB),
          attached: [...attachedTo(lu.instanceId), ...attachedTo(partner.instanceId)],
        })
        continue
      }
    }

    const eff = effective.value.get(lu.instanceId)
    rendered.add(lu.instanceId)
    if (eff) rows.push({ kind: 'single', listUnit: lu, eff, attached: attachedTo(lu.instanceId) })
  }
  return rows
})

/** Other uncombined list entries of the same Infantry-eligible unit, valid combine targets for `lu`. */
function combineCandidates(lu: ListUnit): ListUnit[] {
  if (!list.value || lu.groupId) return []
  const profile = profileFor(lu.unitId)
  if (!profile || !isInfantry(profile)) return []
  return list.value.units.filter(
    (u) => u.instanceId !== lu.instanceId && u.unitId === lu.unitId && !u.combinedWith && !u.groupId,
  )
}

/**
 * Other list entries `lu` can join into a group-deployment combine
 * (Conclave/Warband/Beastmaster/Court): entries not already in `lu`'s group,
 * sharing a common group-deploy rule with it, whose combined model count
 * (existing group members' size + the candidate's) wouldn't exceed that
 * rule's cap. Mutually exclusive with the Infantry `combinedWith` link.
 */
function groupJoinCandidates(lu: ListUnit): ListUnit[] {
  if (!list.value || !faction.value || lu.combinedWith) return []
  const profile = profileFor(lu.unitId)
  if (!profile) return []

  const currentMembers = lu.groupId ? list.value.units.filter((u) => u.groupId === lu.groupId) : [lu]
  const currentSize = currentMembers.reduce((sum, m) => sum + (profileFor(m.unitId)?.size ?? 0), 0)

  return list.value.units.filter((u) => {
    if (u.instanceId === lu.instanceId || u.combinedWith || u.groupId) return false
    if (lu.groupId && u.groupId === lu.groupId) return false
    const otherProfile = profileFor(u.unitId)
    if (!otherProfile) return false
    const ruleId = sharedGroupDeployRuleId(profile, otherProfile, faction.value!)
    if (!ruleId) return false
    const cap = groupDeployRuleIds(faction.value!).get(ruleId)
    return cap !== undefined && currentSize + otherProfile.size <= cap
  })
}

function isHeroOrPsyker(profile: UnitProfile): boolean {
  return profile.isHero || profile.specialRules.some((r) => r.ruleId === 'psyker')
}

/** Same-Quality Infantry-eligible list entries `lu` (a Hero/Psyker) may attach to. */
function attachCandidates(lu: ListUnit): ListUnit[] {
  if (!list.value) return []
  const profile = profileFor(lu.unitId)
  if (!profile) return []
  return list.value.units.filter((u) => {
    if (u.instanceId === lu.instanceId) return false
    const hostProfile = profileFor(u.unitId)
    return !!hostProfile && isInfantry(hostProfile) && hostProfile.quality === profile.quality
  })
}

function candidateLabel(u: ListUnit): string {
  return profileFor(u.unitId)?.name ?? u.unitId
}

function onCombineSelect(lu: ListUnit, event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value && list.value) store.combineUnits(list.value.id, lu.instanceId, select.value)
  select.value = ''
}

function onAttachSelect(lu: ListUnit, event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value && list.value) store.attachToUnit(list.value.id, lu.instanceId, select.value)
  select.value = ''
}

function onGroupSelect(lu: ListUnit, event: Event) {
  const select = event.target as HTMLSelectElement
  if (select.value && list.value) store.joinGroup(list.value.id, lu.instanceId, select.value)
  select.value = ''
}
</script>

<template>
  <div v-if="list && faction" class="mx-auto max-w-6xl p-4">
    <!-- Header -->
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button class="rounded border border-gray-300 px-4 py-2 text-base hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800" @click="emit('back')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20">
          <title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
        </svg>
      </button>
      <div class="flex flex-1 flex-col">
        <input
            :value="list.name"
            class="w-full rounded border border-transparent px-1 text-xl font-bold hover:border-gray-300 focus:border-gray-300 dark:bg-transparent dark:hover:border-gray-600"
            @change="store.renameList(list.id, ($event.target as HTMLInputElement).value)"
        />
        <div class="px-1 text-sm text-gray-500 dark:text-gray-400">{{ listSubtitle }}</div>
      </div>
      <input
          type="number"
          :value="list.pointsCap"
          min="0"
          step="50"
          class="w-24 rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
          @change="store.setPointsCap(list.id, Number(($event.target as HTMLInputElement).value))"
      />
      <button class="rounded bg-gray-700 px-4 py-2 text-base text-white hover:bg-gray-800" @click="emit('print')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20"><title>printer</title><path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" /></svg>
      </button>
    </div>

    <!-- Live summary -->
    <div
      class="mb-4 flex flex-wrap items-center gap-4 rounded border p-3"
      :class="overCap || issues.length ? 'border-red-400 bg-red-50 dark:bg-red-950/40' : 'border-gray-300 dark:border-gray-700'"
    >
      <div class="text-lg font-semibold" :class="overCap ? 'text-red-700 dark:text-red-400' : ''">
        {{ total }} / {{ list.pointsCap }} pts
      </div>
      <div class="text-sm">Heroes: {{ heroes }} / {{ heroLimit }}</div>
      <ul class="text-sm text-red-700 dark:text-red-400">
        <li v-for="(issue, i) in issues" :key="i">⚠ {{ issue.message }}</li>
      </ul>
    </div>

    <!-- Mobile tab switcher: Roster vs Selected Units (both panels always shown side by side at md+) -->
    <div class="mb-3 flex gap-2 md:hidden">
      <button
        type="button"
        class="flex-1 rounded px-4 py-2 text-base font-medium"
        :class="activeTab === 'roster' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'"
        @click="activeTab = 'roster'"
      >
        Roster
      </button>
      <button
        type="button"
        class="flex-1 rounded px-4 py-2 text-base font-medium"
        :class="activeTab === 'selected' ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'"
        @click="activeTab = 'selected'"
      >
        Selected Units ({{ list.units.length }})
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Roster -->
      <section class="md:block" :class="{ hidden: activeTab !== 'roster' }">
        <h2 class="mb-2 font-semibold">{{ faction.name }} — Roster</h2>
        <ul class="space-y-1">
          <li
            v-for="unit in faction.units"
            :key="unit.id"
            class="rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-700"
          >
            <div class="flex items-center justify-between">
              <span>
                <span class="font-medium">{{ unit.name }}</span>
                <span class="text-gray-500"> [{{ unit.size }}] · Q{{ unit.quality }} · {{ unit.cost }}pts</span>
                <span v-if="unit.isHero" class="ml-1 rounded bg-amber-200 px-1 text-xs text-amber-900">Hero</span>
                <span
                  v-else-if="unit.specialRules.some((r) => r.ruleId === 'psyker')"
                  class="ml-1 rounded bg-purple-200 px-1 text-xs text-purple-900 dark:bg-purple-900 dark:text-purple-200"
                  >Psyker</span
                >
              </span>
              <span class="flex items-center gap-1">
                <button
                  type="button"
                  class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  :aria-expanded="expandedRosterIds.has(unit.id)"
                  @click="toggleRosterInfo(unit.id)"
                >
                  {{ expandedRosterIds.has(unit.id) ? 'Hide' : 'Details' }}
                </button>
                <button class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" @click="store.addUnit(list.id, unit.id)">Add</button>
              </span>
            </div>
            <RosterUnitPreview v-if="expandedRosterIds.has(unit.id)" :profile="unit" :faction="faction" />
          </li>
        </ul>
      </section>

      <!-- Selected units -->
      <section class="md:block" :class="{ hidden: activeTab !== 'selected' }">
        <h2 class="mb-2 font-semibold">Selected units ({{ list.units.length }})</h2>
        <p v-if="!displayRows.length" class="text-sm text-gray-500">Add units from the roster.</p>
        <ul class="space-y-3">
          <li
            v-for="row in displayRows"
            :key="row.kind === 'combined' ? row.a.instanceId : row.kind === 'group' ? row.groupId : row.listUnit.instanceId"
            class="rounded border border-gray-300 p-3 dark:border-gray-700"
          >
            <!-- Group-deployment combine (Conclave/Warband/Beastmaster/Court) -->
            <template v-if="row.kind === 'group'">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-medium">
                  <span class="rounded bg-teal-100 px-1 text-xs text-teal-800 dark:bg-teal-900 dark:text-teal-200">Group</span>
                  <span class="text-gray-500"> [{{ row.group.size }}]</span>
                </span>
                <span class="flex items-center gap-2">
                  <span class="font-semibold">{{ row.group.cost }}pts</span>
                  <select
                    v-if="groupJoinCandidates(row.members[0].listUnit).length"
                    class="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                    @change="onGroupSelect(row.members[0].listUnit, $event)"
                  >
                    <option value="">Add to group…</option>
                    <option v-for="c in groupJoinCandidates(row.members[0].listUnit)" :key="c.instanceId" :value="c.instanceId">
                      {{ candidateLabel(c) }}
                    </option>
                  </select>
                </span>
              </div>

              <ul class="mb-2 text-sm text-gray-500">
                <li v-for="m in row.group.members" :key="m.profile.id">{{ m.count }}x {{ m.profile.name }}</li>
              </ul>

              <div class="mb-1 text-sm">
                <span class="text-gray-500">Equipment:</span>
                <EquipmentList :equipment="row.group.equipment" :unit-size="row.group.size" :faction="faction" />
              </div>
              <div class="mb-2 text-sm">
                <span class="text-gray-500">Special: </span>
                <RuleChips :rules="row.group.specialRules" :faction="faction" />
              </div>

              <div class="grid gap-3 border-t border-gray-100 pt-2 dark:border-gray-800 sm:grid-cols-2">
                <div v-for="entry in row.members" :key="entry.listUnit.instanceId">
                  <div class="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span>{{ entry.eff.profile.name }} — {{ entry.eff.cost }}pts</span>
                    <button
                      class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                      @click="store.leaveGroup(list.id, entry.listUnit.instanceId)"
                    >
                      Leave group
                    </button>
                  </div>
                  <EntryUpgradeControls :list-id="list.id" :profile="entry.eff.profile" :list-unit="entry.listUnit" :faction="faction" />
                </div>
              </div>
            </template>

            <!-- Combined pair -->
            <template v-else-if="row.kind === 'combined'">
              <div class="mb-1 flex items-center justify-between">
                <span class="font-medium">
                  {{ row.combined.profile.name }}
                  <span class="rounded bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">Combined</span>
                  <span class="text-gray-500"> [{{ row.combined.size }}] · Q{{ row.combined.profile.quality }}</span>
                </span>
                <span class="flex items-center gap-2">
                  <span class="font-semibold">{{ row.combined.cost }}pts</span>
                  <button
                    class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                    @click="store.splitUnits(list.id, row.a.instanceId)"
                  >
                    Split
                  </button>
                </span>
              </div>

              <div class="mb-1 text-sm">
                <span class="text-gray-500">Equipment:</span>
                <EquipmentList :equipment="row.combined.equipment" :unit-size="row.combined.size" :faction="faction" />
              </div>
              <div class="mb-2 text-sm">
                <span class="text-gray-500">Special: </span>
                <RuleChips :rules="row.combined.specialRules" :faction="faction" />
              </div>

              <div class="text-xs font-semibold text-gray-500">Whole-unit upgrades (applies to both)</div>
              <EntryUpgradeControls :list-id="list.id" :profile="row.effA.profile" :list-unit="row.a" :faction="faction" filter="whole" />

              <div class="mt-2 grid gap-3 border-t border-gray-100 pt-2 dark:border-gray-800 sm:grid-cols-2">
                <div v-for="entry in [{ lu: row.a, eff: row.effA }, { lu: row.b, eff: row.effB }]" :key="entry.lu.instanceId">
                  <div class="text-xs text-gray-500">Copy — {{ entry.eff.cost }}pts</div>
                  <EntryUpgradeControls :list-id="list.id" :profile="entry.eff.profile" :list-unit="entry.lu" :faction="faction" filter="perModel" />
                </div>
              </div>
            </template>

            <!-- Standalone unit -->
            <template v-else>
              <div class="mb-1 flex items-center justify-between">
                <span class="font-medium">
                  {{ row.eff.profile.name }} <span class="text-gray-500">[{{ row.eff.profile.size }}] · Q{{ row.eff.profile.quality }}</span>
                </span>
                <span class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold">{{ row.eff.cost }}pts</span>
                  <select
                    v-if="combineCandidates(row.listUnit).length"
                    class="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                    @change="onCombineSelect(row.listUnit, $event)"
                  >
                    <option value="">Combine…</option>
                    <option v-for="c in combineCandidates(row.listUnit)" :key="c.instanceId" :value="c.instanceId">{{ candidateLabel(c) }}</option>
                  </select>
                  <select
                    v-if="groupJoinCandidates(row.listUnit).length"
                    class="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                    @change="onGroupSelect(row.listUnit, $event)"
                  >
                    <option value="">Group…</option>
                    <option v-for="c in groupJoinCandidates(row.listUnit)" :key="c.instanceId" :value="c.instanceId">{{ candidateLabel(c) }}</option>
                  </select>
                  <select
                    v-if="isHeroOrPsyker(row.eff.profile) && attachCandidates(row.listUnit).length"
                    class="rounded border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                    @change="onAttachSelect(row.listUnit, $event)"
                  >
                    <option value="">Attach to…</option>
                    <option v-for="c in attachCandidates(row.listUnit)" :key="c.instanceId" :value="c.instanceId">{{ candidateLabel(c) }}</option>
                  </select>
                  <button class="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950" @click="store.removeUnit(list.id, row.listUnit.instanceId)">Remove</button>
                </span>
              </div>

              <div class="mb-1 text-sm">
                <span class="text-gray-500">Equipment:</span>
                <EquipmentList :equipment="row.eff.equipment" :unit-size="row.eff.profile.size" :faction="faction" />
              </div>
              <div class="mb-2 text-sm">
                <span class="text-gray-500">Special: </span>
                <RuleChips :rules="row.eff.specialRules" :faction="faction" />
              </div>

              <EntryUpgradeControls :list-id="list.id" :profile="row.eff.profile" :list-unit="row.listUnit" :faction="faction" />

              <details v-if="faction.psychicPowers.length && row.eff.specialRules.some((r) => r.ruleId === 'psyker')" class="mt-2 text-sm">
                <summary class="cursor-pointer text-gray-500">Psychic powers</summary>
                <ul class="ml-4 list-disc">
                  <li v-for="p in faction.psychicPowers" :key="p.id">
                    <RuleTooltip :ref-data="{ ruleId: p.id }" :faction="faction" /> ({{ p.castValue }}+)
                  </li>
                </ul>
              </details>
            </template>

            <!-- Attached Hero/Psyker entries, nested under this row's host -->
            <div v-if="row.attached.length" class="mt-2 space-y-2 border-t border-dashed border-gray-300 pt-2 dark:border-gray-700">
              <div v-for="a in row.attached" :key="a.listUnit.instanceId" class="rounded border border-amber-300 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-950/30">
                <div class="mb-1 flex items-center justify-between">
                  <span class="font-medium">
                    {{ a.eff.profile.name }}
                    <span class="rounded bg-amber-200 px-1 text-xs text-amber-900">Attached</span>
                    <span class="text-gray-500"> Q{{ a.eff.profile.quality }}</span>
                  </span>
                  <span class="flex items-center gap-2">
                    <span class="font-semibold">{{ a.eff.cost }}pts</span>
                    <button
                      class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                      @click="store.detachFromUnit(list.id, a.listUnit.instanceId)"
                    >
                      Detach
                    </button>
                  </span>
                </div>
                <div class="mb-1 text-sm">
                  <span class="text-gray-500">Equipment:</span>
                  <EquipmentList :equipment="a.eff.equipment" :unit-size="a.eff.profile.size" :faction="faction" />
                </div>
                <div class="text-sm">
                  <span class="text-gray-500">Special: </span>
                  <RuleChips :rules="a.eff.specialRules" :faction="faction" />
                </div>
                <EntryUpgradeControls :list-id="list.id" :profile="a.eff.profile" :list-unit="a.listUnit" :faction="faction" />
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
  <div v-else class="p-4">
    <p>List not found.</p>
    <button class="mt-2 rounded border px-4 py-2 text-base" @click="emit('back')">← Lists</button>
  </div>
</template>
