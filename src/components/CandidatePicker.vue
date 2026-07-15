<script setup lang="ts">
import { ref } from 'vue'
import type { ListUnit } from '../domain/list'

const props = defineProps<{
  candidates: ListUnit[]
  placeholder: string
  label: (u: ListUnit) => string
}>()
const emit = defineEmits<{ pick: [instanceId: string] }>()

const selected = ref('')

function onChange() {
  if (selected.value) emit('pick', selected.value)
  selected.value = ''
}
</script>

<template>
  <select v-model="selected" class="rounded border border-stone-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" @change="onChange">
    <option value="">{{ placeholder }}</option>
    <option v-for="c in props.candidates" :key="c.instanceId" :value="c.instanceId">{{ label(c) }}</option>
  </select>
</template>
