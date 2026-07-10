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
  <span class="group relative inline-block cursor-help border-b border-dotted border-gray-400" tabindex="0">
    <span class="whitespace-nowrap">{{ resolved.name }}</span>
    <span
      class="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden w-64 rounded border border-gray-300 bg-white p-2 text-left text-xs font-normal leading-snug text-gray-800 shadow-lg group-hover:block group-focus:block dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    >
      <strong class="block">{{ resolved.name }}</strong>
      {{ resolved.text }}
    </span>
  </span>
</template>
