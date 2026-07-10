// Regression coverage: an upgrade option whose label names a rule it's meant
// to grant (the whole label, or the text before a trailing parenthetical)
// must actually reference that rule somewhere in its effects — either as a
// unit-level `addRules` effect (for a pure ability with no equipment, e.g.
// "Battle Standard"), or attached to the equipment/weapon it adds (for a
// piece of wargear named after its own ability, e.g. "Drone (Markerlight)"
// carries the "Drone" army rule on the added item itself). Otherwise
// selecting it never surfaces that rule's text anywhere in the app (see
// design.md of builder-roster-preview-and-army-rules).
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import type { SpecialRule, UpgradeOption } from '../domain/types'

function labelMatchesRule(label: string, rule: SpecialRule): boolean {
  return label === rule.name || label.startsWith(`${rule.name} (`)
}

function optionReferencesRule(option: UpgradeOption, ruleId: string): boolean {
  if (option.effects?.addRules?.some((r) => r.ruleId === ruleId)) return true
  return !!option.effects?.addEquipment?.some(
    (e) => e.rules?.some((r) => r.ruleId === ruleId) || e.weapon?.rules.some((r) => r.ruleId === ruleId),
  )
}

/** Every option across every faction whose label names one of `rules` but doesn't reference it. */
function findUnreferenced(rules: (faction: (typeof rulesDatabase.factions)[number]) => SpecialRule[], sourceLabel: string): string[] {
  const problems: string[] = []
  for (const faction of rulesDatabase.factions) {
    for (const group of faction.upgradeGroups) {
      for (const section of group.sections) {
        for (const option of section.options) {
          for (const rule of rules(faction)) {
            if (!labelMatchesRule(option.label, rule)) continue
            if (!optionReferencesRule(option, rule.id)) {
              problems.push(
                `${faction.id}/${group.id}/${section.title} → "${option.label}": names ${sourceLabel} "${rule.name}" but references it nowhere in its effects`,
              )
            }
          }
        }
      }
    }
  }
  return problems
}

describe('rule-granting option audit', () => {
  it('every option whose label names an army rule references it in its effects', () => {
    expect(findUnreferenced((f) => f.armyRules, 'army rule')).toEqual([])
  })

  it('every option whose label names a glossary rule references it in its effects', () => {
    expect(findUnreferenced(() => rulesDatabase.glossary, 'glossary rule')).toEqual([])
  })
})
