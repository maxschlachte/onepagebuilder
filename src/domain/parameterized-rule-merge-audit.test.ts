// Regression coverage: when a unit's baseline and its upgrades both supply a value for the
// same parameterized rule, the merged entry must account for every contributing value.
//
// `mergeRuleGroup` (calc.ts) once bailed out on any same-`ruleId` group containing a shape it
// didn't recognize — returning just the group's first entry and silently discarding the rest.
// That branch was documented as unreachable ("verified by grep across src/data/factions/"),
// but the Ork `Impact(D3)` + `Wreckin' Ball Impact(+D6)` pairing already existed in the data
// when the claim was written. A prose assertion about reachability can go stale the moment
// faction data lands; this test derives the collisions from the data instead, so a newly
// authored shape that the merge can't handle fails here rather than quietly losing a value.
//
// The assertion is an invariant (no contributor is dropped) rather than a table of expected
// strings: exact-value cases for the known pairings live in calc.test.ts, while this covers
// combinations nobody has authored yet.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from '../data/index'
import { applyUpgrades } from './calc'
import type { Faction, RuleRef, UnitProfile, UpgradeOption } from './types'

/** Rule refs an option contributes directly, plus any carried by mount equipment it grants. */
function optionRuleRefs(option: UpgradeOption): RuleRef[] {
  const fromMounts = (option.effects?.addEquipment ?? [])
    .filter((e) => e.isMount)
    .flatMap((e) => e.rules ?? [])
  return [...(option.effects?.addRules ?? []), ...fromMounts]
}

function isAdditive(param: RuleRef['param']): param is string {
  return typeof param === 'string' && param.startsWith('+')
}

/**
 * Assert the merged value accounts for `contributors` — i.e. that none was dropped.
 *
 * A string result must contain each contributor's own printed text. A numeric result must be
 * at least the keep-highest-plus-bonuses floor those contributors imply; deliberately *more*
 * than the floor is allowed, because a mount's Tough is summed onto the rider's rather than
 * kept-at-max (calc.ts's mount branch, per the "Mounts" rule), so `Tough(3)` + a `Tough(3)`
 * mount correctly yields `Tough(6)`. Dropping a contributor always lands the result *below*
 * the floor, which is the failure this guards.
 */
function describeViolation(merged: RuleRef | undefined, contributors: RuleRef[]): string | null {
  if (!merged) return 'no merged entry at all'

  if (typeof merged.param === 'number') {
    const bases = contributors.filter((c) => typeof c.param === 'number').map((c) => c.param as number)
    const bonuses = contributors.filter((c) => isAdditive(c.param)).map((c) => Number((c.param as string).slice(1)))
    if (bases.length + bonuses.length !== contributors.length) {
      return `merged to a number ${merged.param} but not every contributor was numeric`
    }
    const floor = (bases.length ? Math.max(...bases) : 0) + bonuses.reduce((s, n) => s + n, 0)
    return merged.param >= floor ? null : `merged to ${merged.param}, below the floor of ${floor}`
  }

  const text = String(merged.param ?? '')
  const missing = contributors.filter((c) => !text.includes(String(c.param)))
  return missing.length ? `merged to "${text}" but dropped ${missing.map((m) => `"${m.param}"`).join(', ')}` : null
}

/** Every (unit, option) pairing where the option contributes a rule the unit's baseline already carries. */
function collisions(faction: Faction): { unit: UnitProfile; option: UpgradeOption; ruleId: string }[] {
  const optionsByGroup = new Map(
    faction.upgradeGroups.map((g) => [g.id, g.sections.flatMap((s) => s.options)] as const),
  )
  const found: { unit: UnitProfile; option: UpgradeOption; ruleId: string }[] = []
  for (const unit of faction.units) {
    const baselineIds = new Set(unit.specialRules.filter((r) => r.param !== undefined).map((r) => r.ruleId))
    for (const groupId of unit.upgradeGroups) {
      for (const option of optionsByGroup.get(groupId) ?? []) {
        for (const ref of optionRuleRefs(option)) {
          if (ref.param !== undefined && baselineIds.has(ref.ruleId)) {
            found.push({ unit, option, ruleId: ref.ruleId })
          }
        }
      }
    }
  }
  return found
}

describe('parameterized rule merge audit', () => {
  it('no contributing value is dropped when a unit and its upgrade collide on one rule', () => {
    const problems: string[] = []
    let checked = 0

    for (const faction of rulesDatabase.factions) {
      for (const { unit, option, ruleId } of collisions(faction)) {
        const contributors = [
          ...unit.specialRules.filter((r) => r.ruleId === ruleId),
          ...optionRuleRefs(option).filter((r) => r.ruleId === ruleId),
        ]
        if (contributors.length < 2) continue
        checked++

        const merged = applyUpgrades(unit, [option.id], faction).specialRules.filter((r) => r.ruleId === ruleId)
        if (merged.length !== 1) {
          problems.push(`${faction.id}/${unit.name} + "${option.label}": ${ruleId} left ${merged.length} entries, expected 1`)
          continue
        }
        const violation = describeViolation(merged[0], contributors)
        if (violation) problems.push(`${faction.id}/${unit.name} + "${option.label}": ${ruleId} ${violation}`)
      }
    }

    // Guards against the audit silently passing because the traversal stopped finding anything.
    expect(checked).toBeGreaterThan(0)
    expect(problems).toEqual([])
  })
})
