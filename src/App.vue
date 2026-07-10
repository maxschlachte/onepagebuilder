<script setup lang="ts">
import { ref } from 'vue'
import ListsView from './views/ListsView.vue'
import BuilderView from './views/BuilderView.vue'
import PrintView from './views/PrintView.vue'

type View = 'lists' | 'builder' | 'print'

const view = ref<View>('lists')
const currentListId = ref<string | null>(null)

function openList(id: string) {
  currentListId.value = id
  view.value = 'builder'
}
</script>

<template>
  <div class="min-h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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
