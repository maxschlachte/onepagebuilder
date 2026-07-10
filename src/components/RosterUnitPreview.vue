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
  <div class="mt-1 border-t border-gray-100 pt-1 dark:border-gray-800">
    <EquipmentList :equipment="profile.equipment" :unit-size="profile.size" :faction="faction" />
    <div v-if="profile.specialRules.length" class="mt-1 text-sm">
      <span class="text-gray-500">Special:</span> <RuleChips :rules="profile.specialRules" :faction="faction" />
    </div>
    <EntryUpgradeControls :profile="profile" :faction="faction" />
  </div>
</template>
