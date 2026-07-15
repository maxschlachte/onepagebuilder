<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'base' | 'sm'
    type?: 'button' | 'submit'
  }>(),
  { variant: 'secondary', size: 'base', type: 'button' },
)

const variantClasses: Record<string, string> = {
  primary: 'bg-yellow-700 text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700',
  secondary: 'border border-stone-300 hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800',
  danger: 'bg-red-800 text-stone-50 hover:bg-red-600 dark:bg-red-600 dark:text-slate-950 dark:hover:bg-red-800',
}

const sizeClasses: Record<string, string> = {
  base: 'px-4 py-2 text-base',
  sm: 'px-3 py-1.5 text-sm',
}
</script>

<template>
  <button :type="type" class="rounded font-display uppercase tracking-wide" :class="[variantClasses[variant], sizeClasses[size]]">
    <slot />
  </button>
</template>
