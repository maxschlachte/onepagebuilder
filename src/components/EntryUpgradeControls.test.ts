// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EntryUpgradeControls from './EntryUpgradeControls.vue'
import { getFaction } from '../data/index'
import type { ListUnit } from '../domain/list'

const sm = getFaction('space-marines')!
const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!

function mountControls() {
  const listUnit: ListUnit = { instanceId: 'u1', unitId: tacticals.id, selectedUpgrades: [] }
  return mount(EntryUpgradeControls, {
    props: { listId: 'l1', profile: tacticals, listUnit, faction: sm },
  })
}

describe('EntryUpgradeControls option label tooltips', () => {
  it('renders a hover tooltip on a bare rule-name label like "Battle Standard"', () => {
    const wrapper = mountControls()
    const label = wrapper.findAll('label').find((l) => l.text().includes('Battle Standard'))!
    // RuleTooltip renders the rule name inside its own dotted-underline span, distinct
    // from a plain <span>{{ opt.label }}</span> — its presence confirms the tooltip path.
    expect(label.find('.border-dotted').exists()).toBe(true)
    expect(label.text()).toContain('Battle Standard')
  })

  it('does not duplicate rule text for a compound label like "Jump Pack (Deep Strike, Flying)"', () => {
    const wrapper = mountControls()
    const label = wrapper.findAll('label').find((l) => l.text().includes('Jump Pack'))!
    expect(label.text()).toContain('Jump Pack (Deep Strike, Flying)')
    // No tooltip wrapper — "Jump Pack" itself isn't a rule name, so the label renders
    // as plain text exactly as before this change.
    expect(label.find('.border-dotted').exists()).toBe(false)
  })
})

describe('EntryUpgradeControls read-only mode', () => {
  it('renders every section/option with cost and tooltips but no checkboxes when listId/listUnit are omitted', () => {
    const wrapper = mount(EntryUpgradeControls, { props: { profile: tacticals, faction: sm } })

    expect(wrapper.find('input[type=checkbox]').exists()).toBe(false)
    // Options from multiple groups (A, D, E, F for Tactical Marines) all show up.
    expect(wrapper.text()).toContain('Replace all Assault Rifles')
    expect(wrapper.text()).toContain('Battle Standard')
    expect(wrapper.text()).toContain('+90pts')
    // Tooltip logic still applies in read-only mode.
    const battleStandardLabel = wrapper.findAll('label').find((l) => l.text().includes('Battle Standard'))!
    expect(battleStandardLabel.find('.border-dotted').exists()).toBe(true)
  })

  it('never shows an unavailable-reason hint in read-only mode, even for a prerequisite-gated section', () => {
    const wrapper = mount(EntryUpgradeControls, { props: { profile: tacticals, faction: sm } })
    // "Replace one Medium CCW" requires a Pistol/Medium CCW combo to already be selected —
    // in read-only mode nothing is ever "selected", so this must not render as unavailable.
    expect(wrapper.text()).not.toContain('Requires:')
  })

  it('an interactive invocation (listId + listUnit passed) is unaffected', () => {
    const wrapper = mountControls()
    expect(wrapper.find('input[type=checkbox]').exists()).toBe(true)
  })
})
