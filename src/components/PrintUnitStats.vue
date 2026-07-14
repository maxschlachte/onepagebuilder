<script setup lang="ts">
import { rulesDatabase } from '../data/index'
import { createResolver } from '../domain/resolve'
import type { EquipmentEntry, Faction, RuleRef, UnitProfile } from '../domain/types'

const props = defineProps<{
  profile: UnitProfile
  /** Model count — the unit's own size, or a combined pair's doubled size. */
  size: number
  equipment: EquipmentEntry[]
  specialRules: RuleRef[]
  cost: number
  faction: Faction
  /** Short tag shown next to the name (e.g. "Combined", "Attached"). */
  tag?: string
  /** Renders with a smaller heading, for a box nested under another unit's. */
  nested?: boolean
}>()

function ruleNames(rules: { ruleId: string; param?: number | string }[], r = createResolver(rulesDatabase, props.faction)): string {
  return rules.map((x) => r.resolve(x).name).join(', ')
}

interface WeaponRow {
  label: string
  qty: number
  range: string
  attacks: string
  rules: string
}

/** Rows for the unit's Ranged or Melee weapons table. */
function weaponRows(kind: 'ranged' | 'melee'): WeaponRow[] {
  return props.equipment
    .filter((e) => e.weapon && (kind === 'ranged' ? e.weapon.range !== null : e.weapon.range === null))
    .map((e) => ({
      label: e.label,
      qty: e.unitCount ?? props.size,
      range: e.weapon!.range === null ? '' : `${e.weapon!.range}"`,
      attacks: `A${e.weapon!.attacks}`,
      rules: ruleNames(e.weapon!.rules),
    }))
}

/** Equipment entries with no resolvable weapon profile (e.g. Markerlight, Zephyrglaive). */
function otherEquipment(): EquipmentEntry[] {
  return props.equipment.filter((e) => !e.weapon)
}
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between">
      <component :is="nested ? 'h3' : 'h2'" class="font-display uppercase tracking-wide" :class="nested ? 'text-sm font-semibold' : 'font-semibold'">
        {{ profile.name }} <span class="font-normal normal-case text-stone-600 dark:text-slate-400">[{{ size }}]</span>
        <span v-if="tag" class="ml-1 text-xs font-normal normal-case text-stone-600 dark:text-slate-400">({{ tag }})</span>
      </component>
      <span class="text-sm"><span class="text-slate-500">Quality {{ profile.quality }}</span> · <span class="text-yellow-700">{{ cost }}pts</span></span>
    </div>

    <table v-if="weaponRows('ranged').length" class="mt-1 w-full text-sm">
      <caption class="sr-only">Ranged Weapons</caption>
      <thead>
        <tr class="border-b border-yellow-700 text-left font-display text-xs uppercase tracking-wide text-yellow-700">
          <th v-if="size > 1" class="pr-2 font-normal">Qty</th>
          <th class="pr-2 font-normal">Ranged Weapon</th>
          <th class="pr-2 font-normal">Range</th>
          <th class="pr-2 font-normal">Attacks</th>
          <th class="font-normal">Rules</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-300 dark:divide-slate-700">
        <tr v-for="(row, j) in weaponRows('ranged')" :key="j">
          <td v-if="size > 1" class="pr-2">{{ row.qty }}x</td>
          <td class="pr-2">{{ row.label }}</td>
          <td class="pr-2">{{ row.range }}</td>
          <td class="pr-2">{{ row.attacks }}</td>
          <td>{{ row.rules }}</td>
        </tr>
      </tbody>
    </table>

    <table v-if="weaponRows('melee').length" class="mt-1 w-full text-sm">
      <caption class="sr-only">Melee Weapons</caption>
      <thead>
        <tr class="border-b border-yellow-700 text-left font-display text-xs uppercase tracking-wide text-yellow-700">
          <th v-if="size > 1" class="pr-2 font-normal">Qty</th>
          <th class="pr-2 font-normal">Melee Weapon</th>
          <th class="pr-2 font-normal">Attacks</th>
          <th class="font-normal">Rules</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-stone-300 dark:divide-slate-700">
        <tr v-for="(row, j) in weaponRows('melee')" :key="j">
          <td v-if="size > 1" class="pr-2">{{ row.qty }}x</td>
          <td class="pr-2">{{ row.label }}</td>
          <td class="pr-2">{{ row.attacks }}</td>
          <td>{{ row.rules }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="otherEquipment().length" class="mt-1 text-sm">
      <span class="text-stone-600 dark:text-slate-400">Other:</span>
      <span v-for="(e, j) in otherEquipment()" :key="j">
        {{ e.label }}<span v-if="e.rules && e.rules.length"> [{{ ruleNames(e.rules) }}]</span><span v-if="j < otherEquipment().length - 1">; </span>
      </span>
    </p>

    <p v-if="!equipment.length" class="mt-1 text-sm text-stone-600 dark:text-slate-400">—</p>

    <p class="mt-1 text-sm"><span class="text-stone-600 dark:text-slate-400">Special Rules:</span> {{ ruleNames(specialRules) || '—' }}</p>
  </div>
</template>
