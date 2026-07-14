<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useListsStore } from '../stores/lists'
import { getFaction } from '../data/index'
import { getEffectiveFaction } from '../data/chapters'
import { totalPoints } from '../domain/calc'
import CreateListDialog from '../components/CreateListDialog.vue'
import type { ArmyList } from '../domain/list'
import type { ChapterId } from '../data/chapters'
import DotsVerticalIcon from "../components/icons/DotsVerticalIcon.vue";

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

const systemOptions: { id: 'system-40k' | 'system-fantasy'; name: string }[] = [
  { id: 'system-40k', name: 'Warhammer 40k' },
  { id: 'system-fantasy', name: 'Warhammer Fantasy' },
]

/** Saved lists belonging to the active game system — a list's system is derived from its faction, never stored separately. */
const visibleLists = computed(() =>
  store.lists.value.filter((list) => (getFaction(list.factionId)?.system ?? 'system-40k') === store.activeSystem.value),
)

/** Factions offered by the Create Army List dialog, scoped to the active game system. */
const systemFactions = computed(() =>
  store.rulesDatabase.factions.filter((f) => f.system === store.activeSystem.value),
)

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
    <div
      class="relative mb-[38px] overflow-hidden rounded border border-stone-300 bg-gradient-to-b from-stone-50 to-stone-100 px-[34px] py-[30px] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[repeating-linear-gradient(45deg,transparent,transparent_22px,rgba(234,179,8,.04)_22px,rgba(234,179,8,.04)_23px)] dark:border-slate-700 dark:from-slate-900 dark:to-slate-950"
    >
      <div class="relative">
        <div class="text-[0.7rem] uppercase tracking-[.35em] text-yellow-700 dark:text-yellow-500">One Page Rules · Army List Builder</div>
        <h1 class="mb-[4px] mt-[6px] font-display text-[2.9rem] font-bold uppercase leading-[.95] tracking-[.02em] text-stone-900 dark:text-slate-200">
          One Page <span class="text-yellow-700 dark:text-yellow-500">{{ systemOptions.find(s => s.id === store.activeSystem.value)?.name?.split(' ')[1] }}</span>
        </h1>
        <p class="mt-2.5 max-w-[70ch] text-stone-600 dark:text-slate-400">Build, upgrade, and print army lists for every faction and chapter.</p>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div class="flex gap-1 rounded border border-stone-300 p-1 dark:border-slate-700" role="tablist" aria-label="Game system">
            <button
              v-for="sys in systemOptions"
              :key="sys.id"
              type="button"
              role="tab"
              :aria-selected="store.activeSystem.value === sys.id"
              class="rounded px-3 py-1.5 font-display text-sm uppercase tracking-wide"
              :class="store.activeSystem.value === sys.id ? 'bg-yellow-700 text-stone-50 dark:bg-yellow-500 dark:text-slate-950' : 'hover:bg-stone-100 dark:hover:bg-slate-800'"
              @click="store.setActiveSystem(sys.id)"
            >
              {{ sys.name }}
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              ref="createButtonRef"
              type="button"
              class="rounded bg-yellow-700 px-4 py-2 font-display text-base uppercase tracking-wide text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700"
              @click="showCreateDialog = true"
            >
              Create Army List
            </button>
            <button
              type="button"
              class="rounded border border-stone-300 px-4 py-2 font-display text-base uppercase tracking-wide hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800"
              @click="fileInput?.click()"
            >
              Import JSON
            </button>
            <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="onImportFile" />
          </div>
        </div>
        <p v-if="importError" class="mt-2 text-right text-sm text-red-800">{{ importError }}</p>
      </div>
    </div>

    <section>
      <h2 class="mb-2 font-display font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-500">Saved lists ({{ visibleLists.length }})</h2>
      <p v-if="!visibleLists.length" class="text-stone-600 dark:text-slate-400">No lists yet. Create one above.</p>
      <ul class="space-y-2">
        <li
          v-for="list in visibleLists"
          :key="list.id"
          class="relative flex cursor-pointer items-center justify-between gap-3 rounded border border-stone-300 bg-stone-50 p-3 hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          @click="emit('open', list.id)"
        >
          <div class="min-w-0 flex-1">
            <div v-if="renamingId === list.id" class="flex items-center gap-2" @click.stop>
              <input
                v-model="renameValue"
                type="text"
                class="rounded border border-stone-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                @keydown.enter="confirmRename(list)"
                @keydown.escape="cancelRename"
              />
              <button type="button" class="rounded bg-yellow-700 px-2 py-1 font-display text-xs uppercase text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950" @click="confirmRename(list)">
                Save
              </button>
              <button
                type="button"
                class="rounded border border-stone-300 px-2 py-1 font-display text-xs uppercase hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800"
                @click="cancelRename"
              >
                Cancel
              </button>
            </div>
            <template v-else>
              <div class="truncate font-medium">{{ list.name }}</div>
              <div class="text-sm text-stone-600 dark:text-slate-400">
                {{ factionName(list.factionId) }}<template v-if="chapterName(list.chapterId)"> ({{ chapterName(list.chapterId) }})</template>
                · {{ listTotal(list) }} / {{ list.pointsCap }}pts · {{ list.units.length }} units
              </div>
            </template>
          </div>

          <div class="list-menu relative shrink-0">
            <button
              type="button"
              class="rounded-full px-2 py-2 text-lg leading-none hover:bg-stone-100 dark:hover:bg-slate-800"
              aria-label="List actions"
              :aria-expanded="openMenuId === list.id"
              @click.stop="toggleMenu(list.id)"
            >
              <DotsVerticalIcon />
            </button>
            <div
              v-if="openMenuId === list.id"
              class="absolute right-0 top-full z-10 mt-1 w-36 rounded border border-stone-300 bg-stone-50 py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
              @click.stop
            >
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-slate-800" @click="startRename(list)">
                Rename
              </button>
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-slate-800" @click="doDuplicate(list)">
                Duplicate
              </button>
              <button type="button" class="block w-full px-3 py-1.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-slate-800" @click="doExport(list)">
                Export
              </button>
              <button
                type="button"
                class="block w-full px-3 py-1.5 text-left text-sm text-red-800 hover:bg-blood/10"
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
      :factions="systemFactions"
      :chapters="store.chapters"
      @create="onCreate"
      @cancel="onCancelCreate"
    />
  </div>
</template>
