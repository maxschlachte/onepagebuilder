// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import EntryUpgradeControls from './EntryUpgradeControls.vue'
import RuleTooltip from './RuleTooltip.vue'
import { getFaction } from '../data/index'
import { getEffectiveFaction } from '../data/chapters'
import type { ListUnit } from '../domain/list'

const sm = getFaction('space-marines')!
const tacticals = sm.units.find((u) => u.name === 'Tactical Marines')!
const empire = getFaction('empire')!
const general = empire.units.find((u) => u.name === 'General')!
const greatswords = empire.units.find((u) => u.name === 'Greatswords')!
const harlequins = getFaction('harlequins')!
const skyweavers = harlequins.units.find((u) => u.name === 'Skyweavers')!
const tau = getFaction('tau')!
const cadreFireblade = tau.units.find((u) => u.name === 'Cadre Fireblade')!

function headingTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('div.text-xs.font-display.font-semibold').map((d) => d.text())
}

function badgeTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('span.rounded-full').map((s) => s.text())
}

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

  it('renders a bare multi-rule-granting label like "Jump Pack" as plain text with its rules as separate chips', () => {
    const wrapper = mountControls()
    const label = wrapper.findAll('label').find((l) => l.text().includes('Jump Pack'))!
    const tooltips = wrapper.findAllComponents(RuleTooltip).filter((t) => label.element.contains(t.element))
    // "Jump Pack" itself isn't a rule name, so it must not be swallowed into the
    // single-rule-name tooltip path — no tooltip's resolved name is "Jump Pack".
    expect(tooltips.some((t) => t.text().startsWith('Jump Pack'))).toBe(false)
    // Its two granted rules each render as their own hoverable chip, not duplicated.
    expect(tooltips).toHaveLength(2)
    expect(tooltips.map((t) => t.props('refData').ruleId)).toEqual(
      expect.arrayContaining(['deep-strike', 'flying']),
    )
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

describe('EntryUpgradeControls section headings', () => {
  it('a real lettered group shows its id once as a badge, not as a text prefix on the heading', () => {
    const wrapper = mount(EntryUpgradeControls, { props: { profile: tacticals, faction: sm } })
    // Section headline shows only the title — no "A. " prefix.
    expect(headingTexts(wrapper)).toContain('Replace one Assault Rifle')
    expect(headingTexts(wrapper).some((h) => h.startsWith('A.'))).toBe(false)
    // The id renders exactly once, as the group's badge.
    expect(badgeTexts(wrapper).filter((t) => t === 'A')).toHaveLength(1)
  })

  it('the Chapter Tactics group omits its internal id prefix and renders no badge', () => {
    const chapterFaction = getEffectiveFaction('space-marines', 'blood-angels')!
    const chapterTacticals = chapterFaction.units.find((u) => u.name === 'Tactical Marines')!
    const wrapper = mount(EntryUpgradeControls, { props: { profile: chapterTacticals, faction: chapterFaction } })
    const headings = headingTexts(wrapper)
    expect(headings).toContain('Chapter Tactics')
    expect(headings.some((h) => h.includes('blood-angels-tactics'))).toBe(false)
    expect(badgeTexts(wrapper).some((t) => t.includes('blood-angels-tactics'))).toBe(false)
  })

  it("a chapter unit's own group shows its continuing display letter as a badge, not its internal id", () => {
    const chapterFaction = getEffectiveFaction('space-marines', 'blood-angels')!
    // Death Company's own group is Blood Angels' second bundle group (ba-b),
    // so it continues the base faction's A-O sequence at 'Q' (Sanguinary
    // Priest's ba-a takes 'P').
    const deathCompany = chapterFaction.units.find((u) => u.name === 'Death Company')!
    const wrapper = mount(EntryUpgradeControls, { props: { profile: deathCompany, faction: chapterFaction } })
    const headings = headingTexts(wrapper)
    expect(headings).toContain('Replace any Pistol')
    expect(headings.some((h) => h.startsWith('Q.') || h.startsWith('ba-b'))).toBe(false)
    expect(badgeTexts(wrapper).filter((t) => t === 'Q')).toHaveLength(1)
    expect(badgeTexts(wrapper).some((t) => t.startsWith('ba-b'))).toBe(false)
  })
})

describe('EntryUpgradeControls option-level prerequisite ("Mounted Only")', () => {
  function mountGeneral(selectedUpgrades: string[] = []) {
    const listUnit: ListUnit = { instanceId: 'u1', unitId: general.id, selectedUpgrades }
    return mount(EntryUpgradeControls, {
      props: { listId: 'l1', profile: general, listUnit, faction: empire },
    })
  }

  it('disables the "Heavy Lance (Mounted Only)" checkbox on a foot General', () => {
    const wrapper = mountGeneral()
    const label = wrapper.findAll('label').find((l) => l.text().includes('Heavy Lance'))!
    const checkbox = label.find('input[type=checkbox]')
    expect(checkbox.attributes('disabled')).toBeDefined()

    // Its unrestricted section-mate stays enabled.
    const swordLabel = wrapper.findAll('label').find((l) => l.text().includes('Master Sword'))!
    expect(swordLabel.find('input[type=checkbox]').attributes('disabled')).toBeUndefined()
  })

  it('enables it once a mount is selected', () => {
    const empireA = empire.upgradeGroups.find((g) => g.id === 'A')!
    const warhorse = empireA.sections.find((s) => s.title === 'Mount on:')!.options.find((o) => o.label === 'Warhorse')!

    const wrapper = mountGeneral([warhorse.id])
    const label = wrapper.findAll('label').find((l) => l.text().includes('Heavy Lance'))!
    expect(label.find('input[type=checkbox]').attributes('disabled')).toBeUndefined()
  })
})

describe('EntryUpgradeControls gear-granted rule display', () => {
  it('renders a bare gear-rule-name label like "Sergeant" as a hover tooltip, not a separate chip', () => {
    const listUnit: ListUnit = { instanceId: 'u1', unitId: greatswords.id, selectedUpgrades: [] }
    const wrapper = mount(EntryUpgradeControls, {
      props: { listId: 'l1', profile: greatswords, listUnit, faction: empire },
    })
    const label = wrapper.findAll('label').find((l) => l.text().includes('Sergeant'))!
    expect(label.find('.border-dotted').exists()).toBe(true)
    // Exactly one tooltip on this label — the rule isn't also duplicated as a separate chip.
    const tooltips = wrapper.findAllComponents(RuleTooltip).filter((t) => label.element.contains(t.element))
    expect(tooltips).toHaveLength(1)
    expect(tooltips[0].props('refData').ruleId).toBe('sergeant')
  })

  it('renders a distinct gear-name label like "Zephyrglaive" as plain text with its granted rule as a separate chip', () => {
    const listUnit: ListUnit = { instanceId: 'u1', unitId: skyweavers.id, selectedUpgrades: [] }
    const wrapper = mount(EntryUpgradeControls, {
      props: { listId: 'l1', profile: skyweavers, listUnit, faction: harlequins },
    })
    const label = wrapper.findAll('label').find((l) => l.text().includes('Zephyrglaive'))!
    const tooltips = wrapper.findAllComponents(RuleTooltip).filter((t) => label.element.contains(t.element))
    // "Zephyrglaive" itself isn't a rule name, so it must not be swallowed into the tooltip path
    // (a RuleTooltip's own visible name span, not its hidden hover-popup duplicate, is what counts).
    expect(tooltips.some((t) => t.find('.whitespace-nowrap').text() === 'Zephyrglaive')).toBe(false)
    // Exactly one rule chip for this option — not duplicated from a leftover hardcoded parenthetical.
    expect(tooltips).toHaveLength(1)
    expect(tooltips[0].props('refData').ruleId).toBe('impact')
    expect(tooltips[0].find('.whitespace-nowrap').text()).toBe('Impact(1)')
  })

  it('renders a multi-rule gear label like "Drone (Markerlight)" without dropping either rule’s visible text', () => {
    const listUnit: ListUnit = { instanceId: 'u1', unitId: cadreFireblade.id, selectedUpgrades: [] }
    const wrapper = mount(EntryUpgradeControls, {
      props: { listId: 'l1', profile: cadreFireblade, listUnit, faction: tau },
    })
    // The label's static text still ends in the printed "(Markerlight)" suffix (unchanged by this
    // change — Tau's "Drone" options are deliberately left untouched, see design.md Risks).
    const label = wrapper.findAll('label').find((l) => l.text().includes('(Markerlight)'))!
    // "Drone" becomes an interactive tooltip (name collision with Tau's own "Drone" army rule)...
    const tooltips = wrapper.findAllComponents(RuleTooltip).filter((t) => label.element.contains(t.element))
    expect(tooltips.some((t) => t.find('.whitespace-nowrap').text() === 'Drone')).toBe(true)
    // ...and "Markerlight" stays visible as static suffix text either way — a known, accepted
    // limitation (design.md), not a regression: nothing that was visible before is now hidden.
    expect(label.text()).toContain('Markerlight')
  })
})

describe('EntryUpgradeControls mount options grant real equipment (fantasy-upgrade-equipment-fixes)', () => {
  it('renders the "Warhorse" mount option\'s granted rules as chips, not a bare cosmetic pick', () => {
    const listUnit: ListUnit = { instanceId: 'u1', unitId: general.id, selectedUpgrades: [] }
    const wrapper = mount(EntryUpgradeControls, {
      props: { listId: 'l1', profile: general, listUnit, faction: empire },
    })
    const label = wrapper.findAll('label').find((l) => l.text().includes('Warhorse'))!
    const tooltips = wrapper.findAllComponents(RuleTooltip).filter((t) => label.element.contains(t.element))
    expect(tooltips.map((t) => t.props('refData').ruleId)).toEqual(
      expect.arrayContaining(['fast', 'nimble']),
    )
  })
})
