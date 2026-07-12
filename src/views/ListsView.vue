<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useListsStore } from '../stores/lists'
import { getFaction } from '../data/index'
import { getEffectiveFaction } from '../data/chapters'
import { totalPoints } from '../domain/calc'
import CreateListDialog from '../components/CreateListDialog.vue'
import type { ArmyList } from '../domain/list'
import type { ChapterId } from '../data/chapters'

const emit = defineEmits<{ open: [id: string] }>()
const store = useListsStore()

const importError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const showCreateDialog = ref(false)
const createButtonRef = ref<HTMLButtonElement | null>(null)

const openMenuId = ref<string | null>(null)
const renamingId = ref<string | null>(null)
const renameValue = ref('')

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.list-menu')) {
    openMenuId.value = null
  }
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') openMenuId.value = null
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function startRename(list: ArmyList) {
  renamingId.value = list.id
  renameValue.value = list.name
  openMenuId.value = null
}

function confirmRename(list: ArmyList) {
  store.renameList(list.id, renameValue.value)
  renamingId.value = null
}

function cancelRename() {
  renamingId.value = null
}

function doDuplicate(list: ArmyList) {
  openMenuId.value = null
  store.duplicateList(list.id)
}

function doExport(list: ArmyList) {
  openMenuId.value = null
  store.downloadList(list)
}

function doDelete(list: ArmyList) {
  openMenuId.value = null
  confirmDelete(list)
}

function confirmDelete(list: ArmyList) {
  if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
    store.deleteList(list.id)
  }
}

function onCreate(payload: { name: string; factionId: string; pointsCap: number; chapterId?: ChapterId }) {
  const list = store.createList(payload.name, payload.factionId, payload.pointsCap, payload.chapterId)
  showCreateDialog.value = false
  emit('open', list.id)
}

function onCancelCreate() {
  showCreateDialog.value = false
  createButtonRef.value?.focus()
}

function listTotal(list: ArmyList): number {
  const faction = getEffectiveFaction(list.factionId, list.chapterId)
  return faction ? totalPoints(list, faction) : 0
}

function factionName(id: string): string {
  return getFaction(id)?.name ?? id
}

function chapterName(id: string | undefined): string | undefined {
  return id ? store.chapters.find((c) => c.id === id)?.name : undefined
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
      <div class="flex flex-wrap items-center gap-2">
        <button
          ref="createButtonRef"
          type="button"
          class="rounded bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700"
          @click="showCreateDialog = true"
        >
          Create Army List
        </button>
        <button
          type="button"
          class="rounded border border-gray-300 px-4 py-2 text-base hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          @click="fileInput?.click()"
        >
          Import JSON
        </button>
        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="onImportFile" />
      </div>
      <p v-if="importError" class="mt-2 text-sm text-red-600">{{ importError }}</p>
    </section>

    <section>
      <h2 class="mb-2 font-semibold">Saved lists ({{ store.lists.value.length }})</h2>
      <p v-if="!store.lists.value.length" class="text-gray-500">No lists yet. Create one above.</p>
      <ul class="space-y-2">
        <li
          v-for="list in store.lists.value"
          :key="list.id"
          class="relative flex cursor-pointer items-center justify-between gap-3 rounded border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
          @click="emit('open', list.id)"
        >
          <div class="min-w-0 flex-1">
            <div v-if="renamingId === list.id" class="flex items-center gap-2" @click.stop>
              <input
                v-model="renameValue"
                type="text"
                class="rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-900"
                @keydown.enter="confirmRename(list)"
                @keydown.escape="cancelRename"
              />
              <button type="button" class="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700" @click="confirmRename(list)">
                Save
              </button>
              <button
                type="button"
                class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                @click="cancelRename"
              >
                Cancel
              </button>
            </div>
            <template v-else>
              <div class="truncate font-medium">{{ list.name }}</div>
              <div class="text-sm text-gray-500">
                {{ factionName(list.factionId) }}<template v-if="chapterName(list.chapterId)"> ({{ chapterName(list.chapterId) }})</template>
                · {{ listTotal(list) }}/{{ list.pointsCap }}pts · {{ list.units.length }} units
              </div>
            </template>
          </div>

          <div class="list-menu relative shrink-0">
            <button
              type="button"
              class="rounded-full w-10 h-10 px-2 py-1 text-lg leading-none hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="List actions"
              :aria-expanded="openMenuId === list.id"
              @click.stop="toggleMenu(list.id)"
            >
              ⋮
            </button>
            <div
              v-if="openMenuId === list.id"
              class="absolute right-0 top-full z-10 mt-1 w-36 rounded border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
              @click.stop
            >
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700" @click="startRename(list)">
                Rename
              </button>
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700" @click="doDuplicate(list)">
                Duplicate
              </button>
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700" @click="doExport(list)">
                Export
              </button>
              <button
                type="button"
                class="block w-full px-3 py-1.5 text-left text-sm text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                @click="doDelete(list)"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <CreateListDialog
      v-if="showCreateDialog"
      :factions="store.rulesDatabase.factions"
      :chapters="store.chapters"
      @create="onCreate"
      @cancel="onCancelCreate"
    />
  </div>
</template>
