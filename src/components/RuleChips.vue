<script setup lang="ts">
import type { Faction, RuleRef } from '../domain/types'
import RuleTooltip from './RuleTooltip.vue'

defineProps<{
  rules: RuleRef[]
  faction?: Faction
}>()
</script>

<template>
  <span v-if="rules.length" class="inline">
    <template v-for="(r, i) in rules" :key="i">
      <RuleTooltip :ref-data="r" :faction="faction" /><span v-if="i < rules.length - 1">, </span>
    </template>
  </span>
  <span v-else class="text-stone-600 dark:text-slate-400">—</span>
</template>
