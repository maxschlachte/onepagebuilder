<script setup lang="ts">
import { ref } from 'vue'
import { useListsStore } from '../stores/lists'
import { getFaction } from '../data/index'
import { totalPoints } from '../domain/calc'
import type { ArmyList } from '../domain/list'

const emit = defineEmits<{ open: [id: string] }>()
const store = useListsStore()

const newName = ref('')
const newFactionId = ref(store.rulesDatabase.factions[0].id)
const importError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

function create() {
  const list = store.createList(newName.value, newFactionId.value)
  newName.value = ''
  emit('open', list.id)
}

function confirmDelete(list: ArmyList) {
  if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
    store.deleteList(list.id)
  }
}

function listTotal(list: ArmyList): number {
  const faction = getFaction(list.factionId)
  return faction ? totalPoints(list, faction) : 0
}

function factionName(id: string): string {
  return getFaction(id)?.name ?? id
}

async function onImportFile(e: Event) {
  importError.value = ''
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const list = store.importListFromJson(text)
    emit('open', list.id)
  } catch (err) {
    importError.value = err instanceof Error ? err.message : 'Import failed.'
  } finally {
    input.value = ''
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-4">
    <h1 class="mb-4 text-2xl font-bold">One Page 40k — Army Lists</h1>

    <section class="mb-6 rounded border border-gray-300 p-4 dark:border-gray-700">
      <h2 class="mb-2 font-semibold">New list</h2>
      <form class="flex flex-wrap items-end gap-2" @submit.prevent="create">
        <label class="flex flex-col text-sm">
          <span class="text-gray-500">Name</span>
          <input v-model="newName" type="text" placeholder="My army" class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800" />
        </label>
        <label class="flex flex-col text-sm">
          <span class="text-gray-500">Faction</span>
          <select v-model="newFactionId" class="rounded border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800">
            <option v-for="f in store.rulesDatabase.factions" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700">Create</button>
        <button type="button" class="rounded border border-gray-300 px-4 py-2 text-base hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800" @click="fileInput?.click()">Import JSON</button>
        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="onImportFile" />
      </form>
      <p v-if="importError" class="mt-2 text-sm text-red-600">{{ importError }}</p>
    </section>

    <section>
      <h2 class="mb-2 font-semibold">Saved lists ({{ store.lists.value.length }})</h2>
      <p v-if="!store.lists.value.length" class="text-gray-500">No lists yet. Create one above.</p>
      <ul class="space-y-2">
        <li v-for="list in store.lists.value" :key="list.id" class="flex items-center justify-between rounded border border-gray-300 p-3 dark:border-gray-700">
          <div>
            <div class="font-medium">{{ list.name }}</div>
            <div class="text-sm text-gray-500">{{ factionName(list.factionId) }} · {{ listTotal(list) }}/{{ list.pointsCap }}pts · {{ list.units.length }} units</div>
          </div>
          <div class="flex gap-2">
            <button class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700" @click="emit('open', list.id)">Open</button>
            <button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800" @click="store.duplicateList(list.id)">Duplicate</button>
            <button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800" @click="store.downloadList(list)">Export</button>
            <button class="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950" @click="confirmDelete(list)">Delete</button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
