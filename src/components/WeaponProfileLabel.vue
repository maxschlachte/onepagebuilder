<script setup lang="ts">
import { formatWeaponProfile } from '../domain/format'
import RuleChips from './RuleChips.vue'
import type { Faction, Weapon } from '../domain/types'

defineProps<{
  weapon: Weapon
  faction?: Faction
}>()
</script>

<template>
  <span>
    ({{ formatWeaponProfile(weapon) }}<template v-if="weapon.rules.length">, <RuleChips :rules="weapon.rules" :faction="faction" /></template>)
  </span>
</template>
