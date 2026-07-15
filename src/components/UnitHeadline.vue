<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    cost: number
    size?: number
    quality?: string
    divider?: boolean
  }>(),
  { divider: true },
)
</script>

<template>
  <div class="flex items-center justify-between" :class="{ 'mb-1 border-b border-stone-300 pb-1 dark:border-slate-700': divider }">
    <span class="text-md">
      <span class="font-medium">{{ name }}</span>
      <span class="text-stone-600 dark:text-slate-400">
        <template v-if="size !== undefined"> [{{ size }}] · </template>
        <template v-if="quality !== undefined"><span class="text-slate-600 dark:text-slate-400">Q{{ quality }}</span> · </template>
        <span class="text-yellow-700 dark:text-yellow-500">{{ cost }}pts</span>
      </span>
      <slot name="badge" />
    </span>
    <span class="flex flex-wrap items-center gap-2"><slot name="controls" /></span>
  </div>
</template>
