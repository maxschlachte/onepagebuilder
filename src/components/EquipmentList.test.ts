// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EquipmentList from './EquipmentList.vue'
import type { EquipmentEntry } from '../domain/types'

const rifle: EquipmentEntry = {
  key: 'assault-rifle',
  label: 'Assault Rifle',
  unitCount: 4,
  weapon: { id: 'assault-rifle', name: 'Assault Rifle', range: 24, attacks: '1', rules: [] },
}
const meltagun: EquipmentEntry = {
  key: 'meltagun',
  label: 'Meltagun',
  unitCount: 1,
  weapon: { id: 'meltagun', name: 'Meltagun', range: 12, attacks: '6', rules: [{ ruleId: 'piercing' }, { ruleId: 'single-target' }] },
}

describe('EquipmentList', () => {
  it('shows a model-count prefix for a multi-model unit', () => {
    const wrapper = mount(EquipmentList, { props: { equipment: [rifle, meltagun], unitSize: 5 } })
    expect(wrapper.text()).toContain('4x Assault Rifle')
    expect(wrapper.text()).toContain('1x Meltagun')
  })

  it('shows no count prefix for a single-model unit', () => {
    const soloRifle: EquipmentEntry = {
      key: 'assault-rifle',
      label: 'Assault Rifle',
      weapon: { id: 'assault-rifle', name: 'Assault Rifle', range: 24, attacks: '1', rules: [] },
    }
    const wrapper = mount(EquipmentList, { props: { equipment: [soloRifle], unitSize: 1 } })
    expect(wrapper.text()).not.toMatch(/\dx\s+Assault Rifle/)
    expect(wrapper.text()).toContain('Assault Rifle')
  })
})
