<script setup lang="ts">
import type { Faction, UnitProfile } from '../domain/types'
import EquipmentList from './EquipmentList.vue'
import RuleChips from './RuleChips.vue'
import EntryUpgradeControls from './EntryUpgradeControls.vue'

defineProps<{
  profile: UnitProfile
  faction: Faction
}>()
</script>

<template>
  <div class="mt-1 border-t border-stone-300 pt-1 dark:border-slate-700">
    <span class="text-stone-600 dark:text-slate-400 text-sm">Equipment:</span>
    <EquipmentList :equipment="profile.equipment" :unit-size="profile.size" :faction="faction" />
    <div v-if="profile.specialRules.length" class="mt-1 text-sm">
      <span class="text-stone-600 dark:text-slate-400">Special:</span> <RuleChips :rules="profile.specialRules" :faction="faction" />
    </div>
    <EntryUpgradeControls :profile="profile" :faction="faction" />
  </div>
</template>
