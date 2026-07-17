<script setup lang="ts">
defineProps<{
  variant: 'hero' | 'psyker' | 'group' | 'combined' | 'attached'
}>()

const variantClasses: Record<string, string> = {
  hero: 'bg-green-700 dark:bg-green-500',
  attached: 'bg-yellow-700 dark:bg-yellow-500',
  psyker: 'bg-purple-700 dark:bg-purple-500',
  group: 'bg-teal-700 dark:bg-teal-500',
  combined: 'bg-blue-700 dark:bg-blue-500',
}
</script>

<template>
  <span
      class="inline-block align-middle rounded px-1 pb-0.5 text-[9px] first-letter:text-[11px] text-black text-opacity-75 font-bold uppercase"
      :class="variantClasses[variant]"
  >
    <slot />
  </span>
</template>
