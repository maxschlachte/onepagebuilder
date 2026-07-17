// Regression coverage for the "no hand-typed weapon stats in option labels" convention (see
// design.md of fix-upgrade-effect-gaps): a weapon-adding option's range/attacks/rules are
// inferred from its own `addEquipment` at render time (EntryUpgradeControls.vue), so a label
// that also embeds the profile as text (e.g. `Dark Lance (36”, A6x)`) is stale by construction —
// nothing keeps the two in sync. Reuses the same "does this parenthetical look like a weapon
// profile" heuristic `equipmentKeyOf`'s `looksLikeProfile` already applies in helpers.ts.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import type { UpgradeOption } from '../domain/types'

const PROFILE_PATTERN = /(\d+\s*["“”]|(?:^|,\s*)A[\dD])/

function parenGroups(label: string): string[] {
  return [...label.matchAll(/\(([^()]*)\)/g)].map((m) => m[1])
}

/** Number of comma- or " and "-separated segments in `label`, ignoring separators nested inside parentheses. */
function topLevelSegmentCount(label: string): number {
  let depth = 0
  let count = 1
  for (let i = 0; i < label.length; i++) {
    const ch = label[i]
    if (ch === '(') depth++
    else if (ch === ')') depth--
    else if (depth === 0 && (ch === ',' || (ch === ' ' && label.slice(i, i + 5) === ' and '))) count++
  }
  return count
}

function weaponCount(option: UpgradeOption): number {
  return (option.effects?.addEquipment ?? []).filter((e) => e.weapon).length
}

describe('upgrade option label audit: no embedded weapon stats', () => {
  it('no option label embeds a weapon profile — stats are inferred from addEquipment', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          for (const option of section.options) {
            for (const inner of parenGroups(option.label)) {
              if (PROFILE_PATTERN.test(inner)) {
                problems.push(`${faction.id}/${group.id}/${section.title} → "${option.label}"`)
                break
              }
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('a multi-weapon option never adds more weapons than its label names parts', () => {
    const problems: string[] = []
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          // A "Mount on:" option's label is always the mount's own printed name (e.g.
          // "Seeker Chariot"), not a compound listing of its constituent weapons — it
          // legitimately grants a standalone mount's full multi-weapon equipment line
          // under that single name, the same way a unit's own name doesn't enumerate
          // each of its equipment entries either.
          if (/^Mount on/.test(section.title)) continue
          for (const option of section.options) {
            const weapons = weaponCount(option)
            if (weapons < 2) continue
            const segments = topLevelSegmentCount(option.label)
            if (weapons > segments) {
              problems.push(
                `${faction.id}/${group.id}/${section.title} → "${option.label}": adds ${weapons} weapons but label names ${segments} part(s)`,
              )
            }
          }
        }
      }
    }
    expect(problems).toEqual([])
  })
})
