<script setup lang="ts">
import type { EquipmentEntry, Faction } from '../domain/types'
import { formatWeaponProfile } from '../domain/format'
import RuleChips from './RuleChips.vue'

const props = defineProps<{
  equipment: EquipmentEntry[]
  unitSize: number
  faction?: Faction
}>()

function profile(e: EquipmentEntry): string {
  if (!e.weapon) return ''
  return formatWeaponProfile(e.weapon)
}

/** Number of models carrying `e`, for multi-model units (see `unitSize`). */
function modelCount(e: EquipmentEntry): number {
  return e.unitCount ?? props.unitSize
}
</script>

<template>
  <ul class="space-y-0.5">
    <li v-for="(e, i) in equipment" :key="i" class="text-sm">
      <span v-if="unitSize > 1" class="font-medium">{{ modelCount(e) }}x </span><span class="font-medium">{{ e.label }}</span>
      <span v-if="e.weapon" class="ml-1 text-xs text-stone-600 dark:text-slate-400">({{ profile(e) }})</span>
      <span v-if="e.weapon && e.weapon.rules.length" class="ml-1 text-xs">
        — <RuleChips :rules="e.weapon.rules" :faction="faction" />
      </span>
      <span v-else-if="e.rules && e.rules.length" class="ml-1 text-xs">
        — <RuleChips :rules="e.rules" :faction="faction" />
      </span>
    </li>
    <li v-if="!equipment.length" class="text-sm text-stone-600 dark:text-slate-400">—</li>
  </ul>
</template>
