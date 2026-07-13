<script setup lang="ts">
import { computed } from 'vue'
import type { Faction, RuleRef } from '../domain/types'
import { createResolver } from '../domain/resolve'
import { rulesDatabase } from '../data/index'

const props = defineProps<{
  refData: RuleRef
  faction?: Faction
}>()

const resolved = computed(() =>
  createResolver(rulesDatabase, props.faction).resolve(props.refData),
)
</script>

<template>
  <span class="group relative inline-block cursor-help border-b border-dotted border-yellow-700 dark:border-yellow-500" tabindex="0">
    <span class="whitespace-nowrap">{{ resolved.name }}</span>
    <span
      class="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-64 rounded border border-stone-300 bg-stone-50 p-2 text-left text-xs font-normal leading-snug text-stone-900 shadow-lg group-hover:block group-focus:block dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <strong class="block text-yellow-700 dark:text-yellow-500">{{ resolved.name }}</strong>
      {{ resolved.text }}
    </span>
  </span>
</template>
