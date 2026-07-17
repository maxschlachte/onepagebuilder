<script setup lang="ts">
import { computed } from 'vue'
import { useListsStore } from '../stores/lists'
import { rulesDatabase } from '../data/index'
import { getEffectiveFaction } from '../data/chapters'
import { applyUpgrades, combinedEffectiveUnit, groupEffectiveUnit, totalPoints } from '../domain/calc'
import { createResolver } from '../domain/resolve'
import PrintUnitStats from '../components/PrintUnitStats.vue'
import PrintGroupStats from '../components/PrintGroupStats.vue'
import type { CombinedUnit, EffectiveUnit, GroupUnit } from '../domain/calc'
import type { UnitProfile } from '../domain/types'
import BackIcon from "../components/icons/BackIcon.vue";

const props = defineProps<{ listId: string }>()
const emit = defineEmits<{ back: [] }>()
const store = useListsStore()

const list = computed(() => store.find(props.listId))
const faction = computed(() =>
  list.value ? getEffectiveFaction(list.value.factionId, list.value.chapterId) : undefined,
)
const total = computed(() =>
  list.value && faction.value ? totalPoints(list.value, faction.value) : 0,
)

/** Every list entry's effective (post-upgrade) stats, in list order — used for the rule reference. */
const units = computed<EffectiveUnit[]>(() => {
  if (!list.value || !faction.value) return []
  return list.value.units.map((lu) => {
    const profile = faction.value!.units.find((u) => u.id === lu.unitId)!
    return applyUpgrades(profile, lu.selectedUpgrades, faction.value!)
  })
})

interface PrintableUnit {
  profile: UnitProfile
  size: number
  equipment: EffectiveUnit['equipment']
  specialRules: EffectiveUnit['specialRules']
  cost: number
}

function toPrintable(u: EffectiveUnit | CombinedUnit): PrintableUnit {
  const size = 'size' in u ? u.size : u.profile.size
  return { profile: u.profile, size, equipment: u.equipment, specialRules: u.specialRules, cost: u.cost }
}

type PrintRow =
  | { kind: 'unit'; pu: PrintableUnit; combined: boolean; attached: PrintableUnit[] }
  | { kind: 'group'; group: GroupUnit; attached: PrintableUnit[] }

/**
 * Group list entries into printed boxes: a combined pair renders as one box
 * (doubled size, summed cost), a group-deployment combine (Conclave/Warband/
 * Beastmaster/Court) renders as one box with a member roster, and an
 * attached Hero/Psyker is nested under its host's box instead of printed as
 * its own top-level box.
 */
const printRows = computed<PrintRow[]>(() => {
  if (!list.value || !faction.value) return []
  const lus = list.value.units
  const effByInstance = new Map(lus.map((lu, i) => [lu.instanceId, units.value[i]]))
  const byId = new Map(lus.map((u) => [u.instanceId, u]))
  const rendered = new Set<string>()
  const rows: PrintRow[] = []

  function attachedTo(hostId: string): PrintableUnit[] {
    return lus
      .filter((u) => u.joinedInfantryUnit === hostId)
      .map((u) => effByInstance.get(u.instanceId))
      .filter((e): e is EffectiveUnit => !!e)
      .map(toPrintable)
  }

  for (const lu of lus) {
    if (rendered.has(lu.instanceId)) continue
    if (lu.joinedInfantryUnit && byId.has(lu.joinedInfantryUnit)) continue

    if (lu.groupId) {
      const members = lus.filter((u) => u.groupId === lu.groupId)
      const memberEffs = members.map((m) => effByInstance.get(m.instanceId)).filter((e): e is EffectiveUnit => !!e)
      if (members.length >= 2 && memberEffs.length === members.length) {
        for (const m of members) rendered.add(m.instanceId)
        rows.push({
          kind: 'group',
          group: groupEffectiveUnit(memberEffs.map((eff) => ({ profile: eff.profile, eff }))),
          attached: members.flatMap((m) => attachedTo(m.instanceId)),
        })
        continue
      }
    }

    const partner = lu.combinedWith ? byId.get(lu.combinedWith) : undefined
    if (partner && partner.combinedWith === lu.instanceId) {
      const effA = effByInstance.get(lu.instanceId)
      const effB = effByInstance.get(partner.instanceId)
      if (effA && effB) {
        rendered.add(lu.instanceId)
        rendered.add(partner.instanceId)
        rows.push({
          kind: 'unit',
          pu: toPrintable(combinedEffectiveUnit(effA, effB, faction.value!)),
          combined: true,
          attached: [...attachedTo(lu.instanceId), ...attachedTo(partner.instanceId)],
        })
        continue
      }
    }

    rendered.add(lu.instanceId)
    const eff = effByInstance.get(lu.instanceId)
    if (eff) rows.push({ kind: 'unit', pu: toPrintable(eff), combined: false, attached: attachedTo(lu.instanceId) })
  }
  return rows
})

/** Deduplicated, resolved reference for every special/army/weapon rule referenced by the list. */
const reference = computed(() => {
  if (!faction.value) return []
  const resolver = createResolver(rulesDatabase, faction.value)
  const ids = new Set<string>()
  for (const eff of units.value) {
    for (const r of eff.specialRules) ids.add(r.ruleId)
    for (const e of eff.equipment) {
      for (const r of e.weapon?.rules ?? []) ids.add(r.ruleId)
      for (const r of e.rules ?? []) ids.add(r.ruleId)
    }
  }
  return [...ids]
    .map((id) => resolver.resolve({ ruleId: id }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

/**
 * Deduplicated, resolved reference for the faction's psychic powers — its own
 * section, separate from `reference`, shown whenever the list contains a
 * Psyker (see design.md decision 4 of builder-roster-preview-and-army-rules).
 */
const psychicPowersReference = computed(() => {
  if (!faction.value) return []
  const hasPsyker = units.value.some((eff) => eff.specialRules.some((r) => r.ruleId === 'psyker' || r.ruleId === 'wizard'))
  if (!hasPsyker) return []
  const resolver = createResolver(rulesDatabase, faction.value)
  return faction.value.psychicPowers
    .map((p) => resolver.resolve({ ruleId: p.id }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

function printPage() {
  window.print()
}
</script>

<template>
  <div v-if="list && faction" class="print-page mx-auto max-w-4xl p-4">
    <div class="no-print mb-4 flex gap-2">
      <button class="rounded border border-stone-300 px-4 py-2 font-display text-base uppercase tracking-wide hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="emit('back')">
        <BackIcon />
      </button>
      <button class="rounded bg-yellow-700 px-4 py-2 font-display text-base uppercase tracking-wide text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700" @click="printPage">Print / Save as PDF</button>
    </div>

    <header class="mb-4 border-b border-yellow-700 pb-2">
      <h1 class="font-display text-2xl font-bold uppercase tracking-wide text-stone-900 dark:text-slate-200">{{ list.name }}</h1>
      <p class="text-sm text-stone-600 dark:text-slate-400">{{ faction.name }} · {{ total }} / {{ list.pointsCap }} pts · {{ units.length }} units</p>
    </header>

    <!-- Units -->
    <section class="columns-2 gap-3">
      <div v-for="(row, i) in printRows" :key="i" class="print-unit mb-3 break-inside-avoid rounded border border-stone-300 dark:border-slate-700 p-2">
        <PrintGroupStats v-if="row.kind === 'group'" :group="row.group" :faction="faction" />
        <PrintUnitStats
          v-else
          :profile="row.pu.profile"
          :size="row.pu.size"
          :equipment="row.pu.equipment"
          :special-rules="row.pu.specialRules"
          :cost="row.pu.cost"
          :faction="faction"
          :tag="row.combined ? 'Combined' : undefined"
        />

        <div v-if="row.attached.length" class="mt-2 space-y-2 border-t border-dashed border-stone-300 dark:border-slate-700 pt-2">
          <PrintUnitStats
            v-for="(apu, j) in row.attached"
            :key="j"
            :profile="apu.profile"
            :size="apu.size"
            :equipment="apu.equipment"
            :special-rules="apu.specialRules"
            :cost="apu.cost"
            :faction="faction"
            tag="Attached"
            nested
          />
        </div>
      </div>
    </section>

    <!-- Deduplicated rule reference -->
    <section class="mt-6">
      <h2 class="mb-2 border-b border-yellow-700 pb-1 font-display text-lg font-bold uppercase tracking-wide text-stone-900 dark:text-slate-200">Rule Reference</h2>
      <dl class="columns-2 gap-x-6 text-sm">
        <div v-for="r in reference" :key="r.id" class="print-unit mb-1 break-inside-avoid-column">
          <dt class="inline font-semibold text-yellow-700">{{ r.name }}:</dt>
          <dd class="inline"> {{ r.text }}</dd>
        </div>
      </dl>
      <p v-if="!reference.length" class="text-sm text-stone-600 dark:text-slate-400">No rules referenced.</p>
    </section>

    <!-- Deduplicated psychic powers/spells, shown only when the list contains a Psyker/Wizard -->
    <section v-if="psychicPowersReference.length" class="mt-6">
      <h2 class="mb-2 border-b border-yellow-700 pb-1 font-display text-lg font-bold uppercase tracking-wide text-stone-900 dark:text-slate-200">{{ faction?.system === 'system-fantasy' ? 'Magic Spells' : 'Psychic Powers' }}</h2>
      <dl class="columns-2 gap-x-6 text-sm">
        <div v-for="r in psychicPowersReference" :key="r.id" class="print-unit mb-1 break-inside-avoid-column">
          <dt class="inline font-semibold text-yellow-700">{{ r.name }}:</dt>
          <dd class="inline"> {{ r.text }}</dd>
        </div>
      </dl>
    </section>
  </div>
  <div v-else class="p-4">
    <p>List not found.</p>
    <button class="mt-2 rounded border border-stone-300 px-4 py-2 font-display text-base uppercase tracking-wide hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="emit('back')">← Back</button>
  </div>
</template>
