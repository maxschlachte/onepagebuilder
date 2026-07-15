// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import BuilderView from './BuilderView.vue'
import PrintView from './PrintView.vue'
import EntryUpgradeControls from '../components/EntryUpgradeControls.vue'
import { useListsStore } from '../stores/lists'
import { getFaction } from '../data/index'

const sm = getFaction('space-marines')!
const captain = sm.units.find((u) => u.name === 'Captain')!
const chaplain = sm.units.find((u) => u.name === 'Chaplain')!
const stormbolter = sm.upgradeGroups
  .find((g) => g.id === 'A')!
  .sections.flatMap((s) => s.options)
  .find((o) => o.label.startsWith('Stormbolter'))!

describe('full build flow (9.1)', () => {
  it('builds a list through the real views: add units, upgrade, validate, print', async () => {
    const store = useListsStore()
    const list = store.createList('Strike Force', 'space-marines', 750)

    // --- Builder: add a unit, see live total ---
    const builder = mount(BuilderView, { props: { listId: list.id } })
    store.addUnit(list.id, captain.id)
    await nextTick()
    expect(builder.text()).toContain('Captain')
    expect(builder.text()).toContain('65 / 750 pts')

    // --- Apply an upgrade, total updates live ---
    store.toggleUpgrade(list.id, list.units[0].instanceId, stormbolter.id)
    await nextTick()
    expect(builder.text()).toContain('75 / 750 pts')

    // --- Exceed the hero limit, validation message shows ---
    store.addUnit(list.id, chaplain.id)
    await nextTick()
    expect(builder.text()).toMatch(/hero limit|Heroes/i)
    expect(builder.text()).toContain('⚠')

    // --- Export / import JSON roundtrip preserves the list ---
    const json = store.lists.value.find((l) => l.id === list.id)!
    const reimported = store.importListFromJson(JSON.stringify(json))
    expect(reimported.units).toHaveLength(2)
    expect(reimported.factionId).toBe('space-marines')

    // --- Print view: stats + deduplicated rule reference ---
    const print = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = print.text()
    expect(text).toContain('Strike Force')
    expect(text).toContain('Rule Reference')
    expect(text).toContain('Quality 3+')
    // Every special rule on a unit is explained in the reference section.
    expect(text).toContain('When taking morale tests roll one extra die') // Fearless text
  })
})

describe('roster info toggle', () => {
  it('expands and collapses a roster unit info panel via its info button, independent of Add', async () => {
    const store = useListsStore()
    const list = store.createList('Roster Info Test', 'space-marines', 750)

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()

    const tacticalsRow = builder.findAll('li').find((li) => li.text().includes('Tactical Marines'))!
    const detailsButton = tacticalsRow.findAll('button').find((b) => b.text() === 'Details')!
    expect(tacticalsRow.text()).not.toContain('5x Assault Rifles')

    await detailsButton.trigger('click')
    await nextTick()
    expect(tacticalsRow.text()).toContain('5x Assault Rifles')
    expect(tacticalsRow.text()).toContain('Special:')
    // The full upgrade catalog is shown too — sections from multiple groups, no checkboxes.
    expect(tacticalsRow.text()).toContain('Replace all Assault Rifles')
    expect(tacticalsRow.text()).toContain('Battle Standard')
    expect(tacticalsRow.find('input[type=checkbox]').exists()).toBe(false)
    // The unit's own name isn't repeated inside the expanded panel.
    expect(tacticalsRow.text().match(/Tactical Marines/g)).toHaveLength(1)
    expect(tacticalsRow.text()).toContain('Hide')

    // Clicking Add does not toggle the panel.
    const addButton = tacticalsRow.findAll('button').find((b) => b.text() === 'Add')!
    await addButton.trigger('click')
    await nextTick()
    expect(tacticalsRow.text()).toContain('5x Assault Rifles') // still expanded
    expect(list.units).toHaveLength(1) // and the unit was actually added

    await detailsButton.trigger('click')
    await nextTick()
    expect(tacticalsRow.text()).not.toContain('5x Assault Rifles')
    expect(tacticalsRow.text()).toContain('Details')
  })
})

describe('mobile tab switcher', () => {
  it('defaults to the Roster tab; switching toggles which panel is hidden', async () => {
    const store = useListsStore()
    const list = store.createList('Tab Switcher Test', 'space-marines', 750)
    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()

    const sections = builder.findAll('section')
    const rosterSection = sections.find((s) => s.text().includes('Roster'))!
    const selectedSection = sections.find((s) => s.text().includes('Selected units'))!

    // jsdom doesn't evaluate the md: media query itself — this asserts the
    // class-toggle logic the CSS then acts on (see design.md decision 3).
    expect(rosterSection.classes()).not.toContain('hidden')
    expect(selectedSection.classes()).toContain('hidden')

    const tabButtons = builder.findAll('button')
    const selectedTab = tabButtons.find((b) => b.text().startsWith('Selected Units'))!
    await selectedTab.trigger('click')
    await nextTick()
    expect(rosterSection.classes()).toContain('hidden')
    expect(selectedSection.classes()).not.toContain('hidden')

    const rosterTab = tabButtons.find((b) => b.text() === 'Roster')!
    await rosterTab.trigger('click')
    await nextTick()
    expect(rosterSection.classes()).not.toContain('hidden')
    expect(selectedSection.classes()).toContain('hidden')
  })
})

describe('combine/split and attach/detach UI flows', () => {
  it('combines two Tactical Marines squads, shares whole-unit upgrades, and splits back apart', async () => {
    const store = useListsStore()
    const list = store.createList('Combine UI Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).toContain('Merge…')

    // Combine via the "Merge…" select control.
    await builder.find('select').setValue(b.instanceId)
    await nextTick()
    expect(a.combinedWith).toBe(b.instanceId)
    expect(builder.text()).toContain('Combined')
    expect(builder.text()).toContain(`[${tacticals.size * 2}]`) // combined model count
    expect(builder.text()).toContain(`${tacticals.cost * 2}pts`) // combined cost

    // Split back apart via the "Split" button.
    const splitButton = builder.findAll('button').find((btn) => btn.text() === 'Split')!
    await splitButton.trigger('click')
    await nextTick()
    expect(a.combinedWith).toBeUndefined()
    expect(b.combinedWith).toBeUndefined()
    expect(builder.text()).not.toContain('Combined')
  })

  it("a combined pair's whole-unit panel shows only whole-unit sections, with no empty group dividers", async () => {
    const store = useListsStore()
    const list = store.createList('Whole Unit Panel Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    const [a, b] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()

    const wholePanel = builder
      .findAllComponents(EntryUpgradeControls)
      .find((c) => c.props('filter') === 'whole')!

    // Tactical Marines use groups A, D, E, F. Only D ("Upgrade all models with
    // any") and F ("Replace all Assault Rifles") contain an "all"-scoped
    // section — A and E are entirely single-model sections and must render
    // nothing at all in the whole-unit panel (no heading, no divider).
    expect(wholePanel.text()).toContain('Upgrade all models with any')
    expect(wholePanel.text()).toContain('Replace all Assault Rifles')
    expect(wholePanel.text()).not.toContain('Upgrade one model with one')
    expect(wholePanel.text()).not.toContain('Upgrade Psyker(1)')
    // The per-model "Jump Pack" (singular, group A) must not leak into the
    // whole-unit panel even though the genuinely whole-unit "Jump Packs"
    // (plural, group D) does.
    expect(wholePanel.text()).not.toContain('Jump Pack (Deep Strike, Flying)')
    expect(wholePanel.text()).toContain('Jump Packs (Deep Strike, Flying)')

    // Exactly the two qualifying groups render a divider wrapper — A and E
    // render nothing.
    expect(wholePanel.findAll('div.border-l-4')).toHaveLength(2)
  })

  it('attaches a Librarian to a same-Quality Tactical Marines unit and renders it nested, then detaches', async () => {
    const store = useListsStore()
    const list = store.createList('Attach UI Test', 'space-marines', 750)
    const librarian = sm.units.find((u) => u.name === 'Librarian')!
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    expect(librarian.quality).toBe(tacticals.quality)
    store.addUnit(list.id, librarian.id)
    store.addUnit(list.id, tacticals.id)
    const [hero, host] = list.units

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).toContain('Attach to…')

    const attachSelect = builder.findAll('select').find((s) => s.text().includes('Attach to…'))!
    await attachSelect.setValue(host.instanceId)
    await nextTick()
    expect(hero.joinedInfantryUnit).toBe(host.instanceId)
    expect(builder.text()).toContain('Attached')
    expect(builder.text()).toContain('Detach')

    const detachButton = builder.findAll('button').find((btn) => btn.text() === 'Detach')!
    await detachButton.trigger('click')
    await nextTick()
    expect(hero.joinedInfantryUnit).toBeUndefined()
  })

  it('rejects attaching to a mismatched-Quality unit: no "Attach to…" target is offered', async () => {
    const store = useListsStore()
    const list = store.createList('Attach Mismatch UI Test', 'space-marines', 750)
    const librarian = sm.units.find((u) => u.name === 'Librarian')!
    const mismatched = sm.units.find((u) => u.quality !== librarian.quality && !u.isHero)!
    store.addUnit(list.id, librarian.id)
    store.addUnit(list.id, mismatched.id)

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).not.toContain('Attach to…')
  })

  it('print view renders a combined pair as one box and an attached Hero nested under its host', async () => {
    const store = useListsStore()
    const list = store.createList('Print Combine/Attach Test', 'space-marines', 750)
    const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
    const librarian = sm.units.find((u) => u.name === 'Librarian')!
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, tacticals.id)
    store.addUnit(list.id, librarian.id)
    const [a, b, hero] = list.units
    store.combineUnits(list.id, a.instanceId, b.instanceId)
    store.attachToUnit(list.id, hero.instanceId, a.instanceId)

    const print = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = print.text()
    expect(text).toContain(`[${tacticals.size * 2}]`)
    expect(text).toContain('Combined')
    expect(text).toContain('Librarian')
    expect(text).toContain('Attached')
  })
})

describe('group-deployment combine UI flows', () => {
  it('combines two different Warband units in the builder, then removes one member', async () => {
    const store = useListsStore()
    const list = store.createList('Group UI Test', 'inquisition', 750)
    const inquisition = getFaction('inquisition')!
    const acolyte = inquisition.units.find((u) => u.name === 'Acolyte')!
    const psyker = inquisition.units.find((u) => u.name === 'Psyker')!
    store.addUnit(list.id, acolyte.id)
    store.addUnit(list.id, psyker.id)
    const [a, b] = list.units

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).toContain('Group…')

    const groupSelect = builder.findAll('select').find((s) => s.text().includes('Group…'))!
    await groupSelect.setValue(b.instanceId)
    await nextTick()
    expect(a.groupId).toBeDefined()
    expect(a.groupId).toBe(b.groupId)
    expect(builder.text()).toContain('[2]')
    expect(builder.text()).toContain(`${acolyte.cost + psyker.cost}pts`)
    expect(builder.text()).toContain('Acolyte')
    expect(builder.text()).toContain('Psyker')

    const leaveButton = builder.findAll('button').find((btn) => btn.text() === 'Leave group')!
    await leaveButton.trigger('click')
    await nextTick()
    expect(a.groupId).toBeUndefined()
    expect(b.groupId).toBeUndefined() // 2-member group dissolves entirely once one leaves
  })

  it('print view renders a Warband group as one box with a member roster line', async () => {
    const store = useListsStore()
    const list = store.createList('Print Group Test', 'inquisition', 750)
    const inquisition = getFaction('inquisition')!
    const acolyte = inquisition.units.find((u) => u.name === 'Acolyte')!
    const psyker = inquisition.units.find((u) => u.name === 'Psyker')!
    store.addUnit(list.id, acolyte.id)
    store.addUnit(list.id, psyker.id)
    const [a, b] = list.units
    store.joinGroup(list.id, a.instanceId, b.instanceId)

    const print = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = print.text()
    expect(text).toContain(`[${acolyte.size + psyker.size}]`)
    expect(text).toContain(`${acolyte.cost + psyker.cost}pts`)
    expect(text).toContain('1x Acolyte')
    expect(text).toContain('1x Psyker')
  })
})

describe('Psychic Powers print section', () => {
  it('renders Psychic Powers as a section separate from Rule Reference, only when the list has a Psyker', async () => {
    const store = useListsStore()
    const withPsyker = store.createList('Psyker List', 'space-marines', 750)
    const librarian = sm.units.find((u) => u.name === 'Librarian')!
    store.addUnit(withPsyker.id, librarian.id)

    const printWithPsyker = mount(PrintView, { props: { listId: withPsyker.id } })
    await nextTick()
    const textWithPsyker = printWithPsyker.text()
    expect(textWithPsyker).toContain('Rule Reference')
    expect(textWithPsyker).toContain('Psychic Powers')
    // The two sections are distinct DOM sections, not one merged section.
    const sections = printWithPsyker.findAll('section').filter((s) => /Rule Reference|Psychic Powers/.test(s.text()))
    expect(sections.length).toBeGreaterThanOrEqual(2)

    const withoutPsyker = store.createList('No Psyker List', 'space-marines', 750)
    store.addUnit(withoutPsyker.id, captain.id)
    const printWithoutPsyker = mount(PrintView, { props: { listId: withoutPsyker.id } })
    await nextTick()
    expect(printWithoutPsyker.text()).not.toContain('Psychic Powers')
  })
})

describe('Space Marine chapter specialization', () => {
  it('shows chapter units in the roster and lets the user add and build with one', async () => {
    const store = useListsStore()
    const list = store.createList('Blood Angels Test', 'space-marines', 750, 'blood-angels')

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).toContain('Sanguinary Priest')
    expect(builder.text()).toContain('Captain') // base Space Marines units still present

    const priest = store.getEffectiveFaction('space-marines', 'blood-angels')!.units.find(
      (u) => u.name === 'Sanguinary Priest',
    )!
    store.addUnit(list.id, priest.id)
    await nextTick()
    expect(builder.text()).toContain(`${priest.cost} / 750 pts`)
  })

  it('a Chapter Tactics option appears on an eligible unit and updates cost/rules when selected', async () => {
    const store = useListsStore()
    const list = store.createList('BA Tactics Test', 'space-marines', 750, 'blood-angels')
    const tacticalMarines = sm.units.find((u) => u.name === 'Tactical Marines')!
    store.addUnit(list.id, tacticalMarines.id)
    const instanceId = list.units[0].instanceId

    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).toContain('Furious')

    const faction = store.getEffectiveFaction('space-marines', 'blood-angels')!
    const tacticalProfile = faction.units.find((u) => u.name === 'Tactical Marines')!
    const tacticsGroupId = tacticalProfile.upgradeGroups.find((id) => id.startsWith('blood-angels-tactics-'))!
    const furiousOption = faction.upgradeGroups
      .find((g) => g.id === tacticsGroupId)!
      .sections.flatMap((s) => s.options)
      .find((o) => o.label === 'Furious')!

    store.toggleUpgrade(list.id, instanceId, furiousOption.id)
    await nextTick()
    expect(builder.text()).toContain(`${tacticalMarines.cost + 10} / 750 pts`)
  })

  it('a chapter-less Space Marines list shows no chapter units or Chapter Tactics options', async () => {
    const store = useListsStore()
    const list = store.createList('Plain SM Test', 'space-marines', 750)
    const builder = mount(BuilderView, { props: { listId: list.id } })
    await nextTick()
    expect(builder.text()).not.toContain('Sanguinary Priest')
    expect(builder.text()).not.toContain('Furious')
  })
})

describe('print output spot-checks vs PDF (9.2)', () => {
  it('renders correct PDF stats and full rule text for sampled units', async () => {
    const store = useListsStore()
    const list = store.createList('Spot Check', 'imperial-guard', 2000)
    const ig = getFaction('imperial-guard')!
    const lemanRuss = ig.units.find((u) => u.name === 'Leman Russ')!
    store.addUnit(list.id, lemanRuss.id)

    const print = mount(PrintView, { props: { listId: list.id } })
    await nextTick()
    const text = print.text()
    // Leman Russ: Quality 4+, 205pts, Vanquisher Cannon 48" A6, Tough(9), Vehicle.
    expect(text).toContain('Leman Russ')
    expect(text).toContain('Quality 4+')
    expect(text).toContain('205pts')
    expect(text).toContain('Vanquisher Cannon')
    // Range is now a computed table column (straight quote), not the raw curly-quote label text.
    expect(text).toContain('48"')
    // Tough rule text from the glossary appears in the reference.
    expect(text).toContain('must accumulate X wounds')
  })
})
