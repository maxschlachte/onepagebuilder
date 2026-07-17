<script setup lang="ts">
import { ref, watch } from 'vue'
import ListsView from './views/ListsView.vue'
import BuilderView from './views/BuilderView.vue'
import PrintView from './views/PrintView.vue'
import { useListsStore } from './stores/lists'

type View = 'lists' | 'builder' | 'print'

const VIEW_STORAGE_KEY = 'opr40k.activeView.v1'

interface StoredView {
  view: 'builder' | 'print'
  listId: string
}

function loadStoredView(): StoredView | null {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.view !== 'builder' && parsed?.view !== 'print') return null
    if (typeof parsed.listId !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

const store = useListsStore()
const stored = loadStoredView()
const listExists = stored ? store.lists.value.some((l) => l.id === stored.listId) : false

const view = ref<View>(listExists ? stored!.view : 'lists')
const currentListId = ref<string | null>(listExists ? stored!.listId : null)

watch([view, currentListId], ([v, id]) => {
  try {
    if ((v === 'builder' || v === 'print') && id) {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ view: v, listId: id }))
    } else {
      localStorage.removeItem(VIEW_STORAGE_KEY)
    }
  } catch {
    /* storage may be unavailable (private mode); ignore */
  }
})

function openList(id: string) {
  currentListId.value = id
  view.value = 'builder'
}
</script>

<template>
  <div class="min-h-full bg-stone-100 text-stone-900 dark:bg-slate-950 dark:text-slate-200">
    <ListsView v-if="view === 'lists'" @open="openList" />
    <BuilderView
      v-else-if="view === 'builder' && currentListId"
      :list-id="currentListId"
      @back="view = 'lists'"
      @print="view = 'print'"
    />
    <PrintView
      v-else-if="view === 'print' && currentListId"
      :list-id="currentListId"
      @back="view = 'builder'"
    />
  </div>
</template>
