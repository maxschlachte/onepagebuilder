<script setup lang="ts">
import EquipmentList from './EquipmentList.vue'
import RuleChips from './RuleChips.vue'
import type { EquipmentEntry, Faction, RuleRef } from '../domain/types'

defineProps<{
  equipment: EquipmentEntry[]
  unitSize: number
  faction: Faction
  specialRules: RuleRef[]
}>()
</script>

<template>
  <div class="mb-1 text-sm">
    <span class="text-stone-600 dark:text-slate-400">Equipment:</span>
    <EquipmentList :equipment="equipment" :unit-size="unitSize" :faction="faction" />
  </div>
  <div class="mb-2 text-sm">
    <span class="text-stone-600 dark:text-slate-400">Special: </span>
    <RuleChips :rules="specialRules" :faction="faction" />
  </div>
</template>
