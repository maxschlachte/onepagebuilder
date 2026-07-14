// Regression coverage for the class of bug found when the Age of Fantasy faction
// data was first wired into the app: `armyRules`/`psychicPowers` text reconstructed
// from a multi-column PDF extraction can silently jam unrelated column fragments
// together (leftover point costs, other units' names), and a rule-granting `adds`
// token can silently degrade to a bare numeral (e.g. a `Wizard(2)` option authored
// as `adds: ["2"]` instead of `adds: ["Wizard(2)"]`). Neither is caught by the
// generic "resolves every special-rule reference" audit in index.test.ts, since
// that only walks baseline `unit.specialRules`, not upgrade-option effects.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import type { EquipmentEntry } from '../domain/types'

const FANTASY_FACTIONS = rulesDatabase.factions.filter((f) => f.system === 'system-fantasy')

/** Per one-page-fantasy-rules.md's Weapons section. */
const TIER_ATTACKS: Record<string, string> = {
  light: '1',
  medium: '2',
  heavy: '3',
  master: '4',
  force: '5',
}

/** Per one-page-fantasy-rules.md's Weapons section: the type word's innate rule, if any. */
const TYPE_RULE_IDS: Record<string, string[]> = {
  halberd: ['piercing'],
  mace: ['piercing', 'poison'],
  lance: ['impact'],
}

describe('Age of Fantasy data-quality audit', () => {
  it('every faction has a non-empty armyRules array', () => {
    const empty = FANTASY_FACTIONS.filter((f) => f.armyRules.length === 0).map((f) => f.id)
    expect(empty).toEqual([])
  })

  it('no armyRules/psychicPowers text contains a stray point-cost fragment (contamination smell test)', () => {
    const problems: string[] = []
    const costPattern = /\+\d+pts/
    for (const faction of FANTASY_FACTIONS) {
      for (const rule of faction.armyRules) {
        if (costPattern.test(rule.text)) problems.push(`${faction.id} armyRule "${rule.name}"`)
      }
      for (const power of faction.psychicPowers) {
        if (costPattern.test(power.text)) problems.push(`${faction.id} psychicPower "${power.name}"`)
      }
    }
    expect(problems).toEqual([])
  })

  it('no upgrade option adds a bare-numeral rule id (the `Wizard(N)` → `adds: ["N"]` bug class)', () => {
    const problems: string[] = []
    for (const faction of FANTASY_FACTIONS) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const ref of option.effects?.addRules ?? []) {
              if (/^\d+$/.test(ref.ruleId)) {
                problems.push(`${faction.id}/${group.id} opt "${option.label}": adds bare-numeral rule id "${ref.ruleId}"`)
              }
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('every melee weapon\'s attacks match its tier, and Halberd/Mace/Lance carry their innate rule', () => {
    const problems: string[] = []

    function check(factionId: string, context: string, e: EquipmentEntry) {
      if (!e.weapon || e.weapon.range !== null) return
      const words = e.weapon.name.toLowerCase().split(/\s+/)
      const tier = words[0]
      const expectedAttacks = TIER_ATTACKS[tier]
      if (!expectedAttacks) return // not a tier-prefixed name (e.g. a bespoke ability)

      if (e.weapon.attacks !== expectedAttacks) {
        problems.push(`${factionId}/${context} "${e.weapon.name}": expected ${expectedAttacks} attacks (${tier} tier), got ${e.weapon.attacks}`)
      }

      const typeWord = words.slice(1).join('-').replace(/s$/, '')
      const expectedRuleIds = TYPE_RULE_IDS[typeWord]
      if (expectedRuleIds) {
        const ruleIds = new Set(e.weapon.rules.map((r) => r.ruleId))
        for (const ruleId of expectedRuleIds) {
          if (!ruleIds.has(ruleId)) {
            problems.push(`${factionId}/${context} "${e.weapon.name}": missing innate rule "${ruleId}" for type "${typeWord}"`)
          }
        }
      }
    }

    for (const faction of FANTASY_FACTIONS) {
      for (const unit of faction.units) {
        for (const e of unit.equipment) check(faction.id, `unit ${unit.name}`, e)
      }
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const e of option.effects?.addEquipment ?? []) {
              check(faction.id, `group ${group.id} opt "${option.label}"`, e)
            }
          }
        }
      }
    }

    expect(problems).toEqual([])
  })
})
