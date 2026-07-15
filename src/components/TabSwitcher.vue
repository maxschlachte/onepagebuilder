<script setup lang="ts" generic="T extends string">
withDefaults(
  defineProps<{
    options: { id: T; label: string }[]
    active: T
    ariaLabel: string
    fullWidth?: boolean
  }>(),
  { fullWidth: false },
)
defineEmits<{ select: [id: T] }>()
</script>

<template>
  <div class="flex gap-1 rounded border border-stone-300 p-1 dark:border-slate-700" :class="{ 'w-full': fullWidth }" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="opt in options"
      :key="opt.id"
      type="button"
      role="tab"
      :aria-selected="active === opt.id"
      class="rounded px-3 py-1.5 font-display text-sm uppercase tracking-wide"
      :class="[
        active === opt.id ? 'bg-yellow-700 text-stone-50 dark:bg-yellow-500 dark:text-slate-950' : 'hover:bg-stone-100 dark:hover:bg-slate-800',
        fullWidth ? 'flex-1 text-center' : '',
      ]"
      @click="$emit('select', opt.id)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
