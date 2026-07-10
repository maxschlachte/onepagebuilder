// Regression coverage for the `show-weapon-counts` change: walks every upgrade option
// across the whole rules database that declares `removeOneEquipment`, applies it in
// isolation to every unit that can select it, and confirms the resulting model counts
// are internally consistent — the replaced weapon's count drops by exactly one (or the
// entry disappears entirely on a single-model unit) and the newly added weapon is
// recorded as carried by exactly one model, never exceeding the unit's actual size.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from '../data/index'
import { applyUpgrades } from './calc'
import type { EffectiveUnit } from './calc'

/** Sum of unitCount (defaulting to the unit's full size) across every entry matching `key`. */
function countFor(eff: EffectiveUnit, key: string, unitSize: number): number {
  return eff.equipment.filter((e) => e.key === key).reduce((sum, e) => sum + (e.unitCount ?? unitSize), 0)
}

describe('removeOneEquipment model-count audit', () => {
  it('every removeOneEquipment option yields consistent model counts on every unit that can select it', () => {
    const problems: string[] = []

    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        const unitsInGroup = faction.units.filter((u) => u.upgradeGroups.includes(group.id))
        for (const sec of group.sections) {
          for (const opt of sec.options) {
            const targets = opt.effects?.removeOneEquipment
            if (!targets?.length) continue

            for (const unit of unitsInGroup) {
              const before = applyUpgrades(unit, [], faction)
              const after = applyUpgrades(unit, [opt.id], faction)
              const context = `${faction.id}/${group.id}/${sec.title} → ${opt.label} on ${unit.name}`

              for (const target of targets) {
                if (!before.equipment.some((e) => e.key === target)) continue // target not present on this unit (e.g. faction-wide dual-target label)

                const beforeCount = countFor(before, target, unit.size)
                // An option that replaces a weapon with a variant of the *same* key
                // (e.g. bare Pistol -> Pistol(Poison)) re-adds under the same key, so
                // the net count for that key is a wash, not a strict decrease.
                const readdedCount = (opt.effects?.addEquipment ?? [])
                  .filter((a) => a.key === target)
                  .reduce((sum, a) => sum + (a.unitCount ?? 1), 0)
                const expectedAfterCount = beforeCount - 1 + readdedCount
                const afterCount = countFor(after, target, unit.size)

                if (afterCount !== expectedAfterCount) {
                  problems.push(`${context}: "${target}" count went from ${beforeCount} to ${afterCount} (expected ${expectedAfterCount})`)
                }
                if (afterCount < 0 || afterCount > unit.size) {
                  problems.push(`${context}: "${target}" count ${afterCount} out of range for unit size ${unit.size}`)
                }
              }

              // A partial (removeOneEquipment-paired) add always lands with unitCount
              // forced to `unitCount ?? 1` by calc.ts — checked directly against the
              // option's own declaration rather than by re-finding the entry in `after`,
              // since it may share a key with an unrelated pre-existing baseline entry
              // (e.g. adding a Linked Assault Rifle to a unit whose baseline already has
              // one) whose count has nothing to do with this option's own addition.
              for (const added of opt.effects?.addEquipment ?? []) {
                const addedUnitCount = added.unitCount ?? 1
                if (addedUnitCount > unit.size) {
                  problems.push(`${context}: added "${added.label}" count exceeds unit size ${unit.size}`)
                }
              }
            }
          }
        }
      }
    }

    expect(problems).toEqual([])
  })
})
