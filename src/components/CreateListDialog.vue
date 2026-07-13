<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { composition } from '../data/composition'
import type { Faction } from '../domain/types'
import type { ChapterId } from '../data/chapters'

const props = defineProps<{ factions: Faction[]; chapters: { id: ChapterId; name: string }[] }>()
const emit = defineEmits<{
  create: [payload: { name: string; factionId: string; pointsCap: number; chapterId?: ChapterId }]
  cancel: []
}>()

const name = ref('')
const factionId = ref(props.factions[0]?.id ?? '')
const pointsCap = ref(composition.defaultPointsCap)
const pointsSteps = composition.heroLimitTable.map((t) => t.points)
const chapterId = ref<ChapterId | ''>('')

watch(factionId, (value) => {
  if (value !== 'space-marines') chapterId.value = ''
})

const nameInput = ref<HTMLInputElement | null>(null)

function submit() {
  if (!name.value.trim() || !factionId.value) return
  emit('create', {
    name: name.value.trim(),
    factionId: factionId.value,
    pointsCap: pointsCap.value,
    chapterId: factionId.value === 'space-marines' && chapterId.value ? chapterId.value : undefined,
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('cancel')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  nameInput.value?.focus()
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="emit('cancel')">
      <div
        class="w-full max-w-sm rounded border border-stone-300 bg-stone-50 p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-list-dialog-title"
      >
        <h2 id="create-list-dialog-title" class="mb-3 font-display font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-500">Create Army List</h2>
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="flex flex-col text-sm">
            <span class="text-stone-600 dark:text-slate-400">Name</span>
            <input
              ref="nameInput"
              v-model="name"
              type="text"
              placeholder="My army"
              class="rounded border border-stone-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="flex flex-col text-sm">
            <span class="text-stone-600 dark:text-slate-400">Faction</span>
            <select v-model="factionId" class="rounded border border-stone-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="f in factions" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </label>
          <label v-if="factionId === 'space-marines'" class="flex flex-col text-sm">
            <span class="text-stone-600 dark:text-slate-400">Chapter</span>
            <select v-model="chapterId" class="rounded border border-stone-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950">
              <option value="">None</option>
              <option v-for="c in chapters" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <label class="flex flex-col text-sm">
            <span class="text-stone-600 dark:text-slate-400">Points limit</span>
            <select v-model.number="pointsCap" class="rounded border border-stone-300 px-2 py-1 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="p in pointsSteps" :key="p" :value="p">{{ p }} pts</option>
            </select>
          </label>
          <div class="mt-2 flex justify-end gap-2">
            <button
              type="button"
              class="rounded border border-stone-300 px-4 py-2 font-display text-sm uppercase tracking-wide hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded bg-yellow-700 px-4 py-2 font-display text-sm uppercase tracking-wide text-stone-50 hover:bg-yellow-500 disabled:opacity-50 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700"
              :disabled="!name.trim() || !factionId"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
