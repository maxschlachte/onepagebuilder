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

describe('PrintView — Age of Fantasy mount rule inheritance', () => {
  function optionFor(factionId: string, groupId: string, label: string) {
    const faction = getFaction(factionId)!
    return faction.upgradeGroups
      .find((g) => g.id === groupId)!
      .sections.flatMap((s) => s.options)
      .find((o) => o.label === label)!
  }

  it("a unit's special-rules summary includes its selected mount's non-Tough rules", async () => {
    const store = useListsStore()
    const list = store.createList('Test', 'empire', 2000)
    const faction = getFaction('empire')!
    const general = faction.units.find((u) => u.name === 'General')!
    store.addUnit(list.id, general.id)
    const instanceId = list.units[0].instanceId
    store.toggleUpgrade(list.id, instanceId, optionFor('empire', 'A', 'Warhorse').id)
    const wrapper = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = wrapper.text()
    expect(text).toContain('Fast')
    expect(text).toContain('Nimble')
  })

  it("a unit's baseline Tough sums with its mount's Tough into one combined value", async () => {
    const store = useListsStore()
    const list = store.createList('Test', 'empire', 2000)
    const faction = getFaction('empire')!
    const general = faction.units.find((u) => u.name === 'General')! // baseline Tough(3)
    store.addUnit(list.id, general.id)
    const instanceId = list.units[0].instanceId
    store.toggleUpgrade(list.id, instanceId, optionFor('empire', 'A', 'Imperial Pegasus').id) // grants Tough(3)
    const wrapper = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = wrapper.text()
    // The unit's own Special Rules line shows the combined value; the mount's equipment
    // line still shows its own Tough(3) inline — an accepted display redundancy (design.md).
    expect(text).toContain('Special Rules: Hero, Hold the Line!, Flying, Nimble, Impact(1), Tough(6)')
  })
})

describe('PrintView — combined-pair oncePerUnit cost (sergeant-musician-standard-whole-unit)', () => {
  function optionFor(factionId: string, groupId: string, label: string) {
    const faction = getFaction(factionId)!
    return faction.upgradeGroups
      .find((g) => g.id === groupId)!
      .sections.flatMap((s) => s.options)
      .find((o) => o.label === label)!
  }

  it('a combined pair where each entry independently selected Sergeant is charged for it once', async () => {
    const store = useListsStore()
    const list = store.createList('Test', 'empire', 2000)
    const faction = getFaction('empire')!
    const stateTroops = faction.units.find((u) => u.name === 'State Troops')! // size 10, upgrades E, F; baseline 60pts
    store.addUnit(list.id, stateTroops.id)
    store.addUnit(list.id, stateTroops.id)
    const [a, b] = list.units
    const sergeant = optionFor('empire', 'F', 'Sergeant')
    store.toggleUpgrade(list.id, a.instanceId, sergeant.id)
    store.toggleUpgrade(list.id, b.instanceId, sergeant.id)
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    const wrapper = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = wrapper.text()
    // 60 + 60 (baseline) + 5 (Sergeant charged once, not twice) = 125.
    expect(text).toContain('125pts')
    expect(text).not.toContain('130pts')
  })
})
