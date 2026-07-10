<script setup lang="ts">
import { rulesDatabase } from '../data/index'
import { createResolver } from '../domain/resolve'
import type { EquipmentEntry, Faction, RuleRef } from '../domain/types'
import type { GroupUnit } from '../domain/calc'

const props = defineProps<{
  group: GroupUnit
  faction: Faction
}>()

function ruleNames(rules: RuleRef[], r = createResolver(rulesDatabase, props.faction)): string {
  return rules.map((x) => r.resolve(x).name).join(', ')
}

interface WeaponRow {
  label: string
  qty: number
  range: string
  attacks: string
  rules: string
}

/** Rows for the group's Ranged or Melee weapons table. */
function weaponRows(kind: 'ranged' | 'melee'): WeaponRow[] {
  return props.group.equipment
    .filter((e) => e.weapon && (kind === 'ranged' ? e.weapon.range !== null : e.weapon.range === null))
    .map((e) => ({
      label: e.label,
      qty: e.unitCount ?? props.group.size,
      range: e.weapon!.range === null ? '' : `${e.weapon!.range}"`,
      attacks: `A${e.weapon!.attacks}`,
      rules: ruleNames(e.weapon!.rules),
    }))
}

/** Equipment entries with no resolvable weapon profile (e.g. Markerlight, Zephyrglaive). */
function otherEquipment(): EquipmentEntry[] {
  return props.group.equipment.filter((e) => !e.weapon)
}
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between">
      <h2 class="font-semibold">
        Group <span class="font-normal text-gray-600">[{{ group.size }}]</span>
      </h2>
      <span class="text-sm">{{ group.cost }}pts</span>
    </div>

    <p class="mt-1 text-sm text-gray-600">
      <template v-for="(m, i) in group.members" :key="m.profile.id"
        >{{ m.count }}x {{ m.profile.name }}<span v-if="i < group.members.length - 1">, </span></template
      >
    </p>

    <table v-if="weaponRows('ranged').length" class="mt-1 w-full text-sm">
      <caption class="sr-only">Ranged Weapons</caption>
      <thead>
        <tr class="border-b border-gray-300 text-left text-xs text-gray-600">
          <th v-if="group.size > 1" class="pr-2 font-normal">Qty</th>
          <th class="pr-2 font-normal">Ranged Weapon</th>
          <th class="pr-2 font-normal">Range</th>
          <th class="pr-2 font-normal">Attacks</th>
          <th class="font-normal">Rules</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="(row, j) in weaponRows('ranged')" :key="j">
          <td v-if="group.size > 1" class="pr-2">{{ row.qty }}x</td>
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
        <tr class="border-b border-gray-300 text-left text-xs text-gray-600">
          <th v-if="group.size > 1" class="pr-2 font-normal">Qty</th>
          <th class="pr-2 font-normal">Melee Weapon</th>
          <th class="pr-2 font-normal">Attacks</th>
          <th class="font-normal">Rules</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="(row, j) in weaponRows('melee')" :key="j">
          <td v-if="group.size > 1" class="pr-2">{{ row.qty }}x</td>
          <td class="pr-2">{{ row.label }}</td>
          <td class="pr-2">{{ row.attacks }}</td>
          <td>{{ row.rules }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="otherEquipment().length" class="mt-1 text-sm">
      <span class="text-gray-600">Other:</span>
      <span v-for="(e, j) in otherEquipment()" :key="j">
        {{ e.label }}<span v-if="e.rules && e.rules.length"> [{{ ruleNames(e.rules) }}]</span><span v-if="j < otherEquipment().length - 1">; </span>
      </span>
    </p>

    <p v-if="!group.equipment.length" class="mt-1 text-sm text-gray-400">—</p>

    <p class="mt-1 text-sm"><span class="text-gray-600">Special Rules:</span> {{ ruleNames(group.specialRules) || '—' }}</p>
  </div>
</template>
