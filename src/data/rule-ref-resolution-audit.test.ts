// Regression coverage: every RuleRef in the shipped dataset must resolve to a real rule.
//
// `createResolver` degrades unknown ids gracefully (resolve.ts) — a miss returns
// `formatRuleName(ref.ruleId, …)` with text "Rule text not found." rather than throwing,
// so a mistyped or unregistered rule never breaks the app. The cost is that it's silent:
// the UI just prints the raw kebab-case id where a rule name belongs.
//
// Rule ids come from `nameToId` (factions/helpers.ts), which lowercases unconditionally,
// so the fallback name is always all-lowercase. Every real rule name — glossary entry,
// army rule, psychic power — is Title Case, because the UI prints names verbatim as
// capitalized labels. That makes "resolved name contains no uppercase letter" a complete
// separator between the two populations, with no allowlist to maintain.
//
// The assertion deliberately runs on the resolved *name* (the string the UI renders)
// rather than on `resolver.index.has(id)`: a rule that resolves but whose name is
// malformed is the same user-visible bug, and an index check would miss it.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import { createResolver } from '../domain/resolve'
import type { EquipmentEntry, RuleRef } from '../domain/types'

/** A resolved name that carries no uppercase letter is the resolver's raw-id fallback. */
function isUnresolved(name: string): boolean {
  return !/[A-Z]/.test(name)
}

describe('rule reference resolution audit', () => {
  it('every rule reference resolves to a named rule, not its raw id', () => {
    const problems: string[] = []

    for (const faction of rulesDatabase.factions) {
      // Per-faction, not shared: `armyRules` are faction-scoped, so the same id can
      // legitimately resolve in one faction and not another.
      const resolver = createResolver(rulesDatabase, faction)

      const check = (refs: RuleRef[] | undefined, where: string) => {
        for (const ref of refs ?? []) {
          const { name } = resolver.resolve(ref)
          if (isUnresolved(name)) problems.push(`${faction.id}/${where} → "${name}"`)
        }
      }

      const checkEquipment = (entries: EquipmentEntry[] | undefined, where: string) => {
        for (const entry of entries ?? []) {
          check(entry.rules, `${where}/equipment:${entry.key}`)
          check(entry.weapon?.rules, `${where}/weapon:${entry.key}`)
        }
      }

      for (const unit of faction.units) {
        check(unit.specialRules, `unit:${unit.id}`)
        checkEquipment(unit.equipment, `unit:${unit.id}`)
      }

      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            const where = `group:${group.id}/option:${option.id}`
            check(option.effects?.addRules, where)
            checkEquipment(option.effects?.addEquipment, where)
          }
        }
      }
    }

    expect(problems).toEqual([])
  })
})
