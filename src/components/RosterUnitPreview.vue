<script setup lang="ts">
import type { Faction, UnitProfile } from '../domain/types'
import UnitLoadout from './UnitLoadout.vue'
import EntryUpgradeControls from './EntryUpgradeControls.vue'

defineProps<{
  profile: UnitProfile
  faction: Faction
}>()
</script>

<template>
  <div class="mt-1 border-t border-stone-300 pt-1 dark:border-slate-700">
    <UnitLoadout :equipment="profile.equipment" :unit-size="profile.size" :faction="faction" :special-rules="profile.specialRules" />
    <EntryUpgradeControls :profile="profile" :faction="faction" />
  </div>
</template>
