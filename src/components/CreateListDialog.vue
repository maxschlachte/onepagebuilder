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
        class="w-full max-w-sm rounded bg-white p-4 shadow-lg dark:bg-gray-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-list-dialog-title"
      >
        <h2 id="create-list-dialog-title" class="mb-3 font-semibold">Create Army List</h2>
        <form class="flex flex-col gap-3" @submit.prevent="submit">
          <label class="flex flex-col text-sm">
            <span class="text-gray-500">Name</span>
            <input
              ref="nameInput"
              v-model="name"
              type="text"
              placeholder="My army"
              class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900"
            />
          </label>
          <label class="flex flex-col text-sm">
            <span class="text-gray-500">Faction</span>
            <select v-model="factionId" class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900">
              <option v-for="f in factions" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </label>
          <label v-if="factionId === 'space-marines'" class="flex flex-col text-sm">
            <span class="text-gray-500">Chapter</span>
            <select v-model="chapterId" class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900">
              <option value="">None</option>
              <option v-for="c in chapters" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </label>
          <label class="flex flex-col text-sm">
            <span class="text-gray-500">Points limit</span>
            <select v-model.number="pointsCap" class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-900">
              <option v-for="p in pointsSteps" :key="p" :value="p">{{ p }} pts</option>
            </select>
          </label>
          <div class="mt-2 flex justify-end gap-2">
            <button
              type="button"
              class="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
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
