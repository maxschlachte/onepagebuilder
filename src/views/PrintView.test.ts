// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import PrintView from './PrintView.vue'
import { useListsStore } from '../stores/lists'
import { getFaction } from '../data/index'

async function printTextFor(factionId: string, unitName: string) {
  const store = useListsStore()
  const list = store.createList('Test', factionId, 2000)
  const faction = getFaction(factionId)!
  const unit = faction.units.find((u) => u.name === unitName)!
  store.addUnit(list.id, unit.id)
  const wrapper = mount(PrintView, { props: { listId: list.id } })
  await nextTick()
  return wrapper.text()
}

describe('PrintView weapon tables', () => {
  it('renders separate Ranged and Melee tables for a unit with both', async () => {
    const text = await printTextFor('space-marines', 'Terminators')
    expect(text).toContain('Ranged Weapon')
    expect(text).toContain('Melee Weapon')
    expect(text).toContain('Stormbolters')
    expect(text).toContain('Medium Powerfists')
  })

  it('shows a quantity column for a multi-model unit', async () => {
    const text = await printTextFor('space-marines', 'Terminators')
    expect(text).toContain('5x')
  })

  it('omits the quantity column for a single-model unit', async () => {
    const text = await printTextFor('space-marines', 'Captain')
    expect(text).not.toMatch(/\dx\s/)
  })

  it('omits the Ranged table for a unit with no ranged weapon', async () => {
    const text = await printTextFor('sisters-of-battle', 'Sisters Repentia')
    expect(text).not.toContain('Ranged Weapon')
    expect(text).toContain('Melee Weapon')
    expect(text).toContain('Heavy CCWs')
  })

  it('lists a non-weapon equipment entry on the Other line, not silently dropped', async () => {
    const text = await printTextFor('tau', 'Pathfinders')
    expect(text).toContain('Other:')
    expect(text).toContain('Markerlights')
  })
})
