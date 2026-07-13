<script setup lang="ts">
defineProps<{
  variant: 'hero' | 'psyker' | 'group' | 'combined' | 'attached'
}>()

const variantClasses: Record<string, string> = {
  hero: 'bg-amber-300 text-amber-700',
  attached: 'bg-amber-300 text-amber-700',
  psyker: 'bg-purple-800 text-purple-200 dark:bg-purple-900 dark:text-purple-300',
  group: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  combined: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}
</script>

<template>
  <span class="rounded px-1 text-xs" :class="variantClasses[variant]"><slot /></span>
</template>
