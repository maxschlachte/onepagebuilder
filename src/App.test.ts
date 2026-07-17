// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.vue'
import BuilderView from './views/BuilderView.vue'
import PrintView from './views/PrintView.vue'
import ListsView from './views/ListsView.vue'
import { useListsStore } from './stores/lists'

const VIEW_STORAGE_KEY = 'opr40k.activeView.v1'

beforeEach(() => {
  localStorage.removeItem(VIEW_STORAGE_KEY)
})

describe('App — active view persistence', () => {
  it('restores the builder for a previously-open, still-existing list', async () => {
    const store = useListsStore()
    const list = store.createList('Persist Builder Test', 'space-marines', 750)
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ view: 'builder', listId: list.id }))

    const wrapper = mount(App)
    expect(wrapper.findComponent(BuilderView).exists()).toBe(true)
    expect(wrapper.findComponent(ListsView).exists()).toBe(false)
  })

  it('restores the print view for a previously-open, still-existing list', async () => {
    const store = useListsStore()
    const list = store.createList('Persist Print Test', 'space-marines', 750)
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ view: 'print', listId: list.id }))

    const wrapper = mount(App)
    expect(wrapper.findComponent(PrintView).exists()).toBe(true)
    expect(wrapper.findComponent(ListsView).exists()).toBe(false)
  })

  it('falls back to the saved-lists screen when the stored list no longer exists', async () => {
    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ view: 'builder', listId: 'nonexistent-id' }))

    const wrapper = mount(App)
    expect(wrapper.findComponent(ListsView).exists()).toBe(true)
    expect(wrapper.findComponent(BuilderView).exists()).toBe(false)
  })

  it('shows the saved-lists screen when no view was ever persisted', async () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(ListsView).exists()).toBe(true)
  })

  it('persists the view on navigating in, and clears it on navigating back to the saved-lists screen', async () => {
    const store = useListsStore()
    const list = store.createList('Persist Navigate Test', 'space-marines', 750)

    const wrapper = mount(App)
    await wrapper.findComponent(ListsView).vm.$emit('open', list.id)
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(BuilderView).exists()).toBe(true)
    expect(JSON.parse(localStorage.getItem(VIEW_STORAGE_KEY)!)).toEqual({ view: 'builder', listId: list.id })

    await wrapper.findComponent(BuilderView).vm.$emit('back')
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(ListsView).exists()).toBe(true)
    expect(localStorage.getItem(VIEW_STORAGE_KEY)).toBeNull()
  })
})
