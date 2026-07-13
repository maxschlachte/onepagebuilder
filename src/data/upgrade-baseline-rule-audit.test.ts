// Regression coverage for the "Upgrade Psyker(N)" bug (see design.md of
// upgrade-baseline-rule-prerequisites): a section titled "Upgrade Psyker(N)" is
// meant to bump an existing baseline Psyker(N) up a level, so it must declare a
// `requiresBaselineRule` prerequisite matching its own title's level. Without this
// guard, a newly authored faction/unit sharing one of these groups could silently
// reintroduce the bug this change fixed.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'

const UPGRADE_PSYKER_TITLE = /^Upgrade Psyker\((\d+)\)$/

describe('"Upgrade Psyker(N)" section prerequisite audit', () => {
  it('every "Upgrade Psyker(N)" section requires baseline Psyker(N)', () => {
    const problems: string[] = []
    let matched = 0
    for (const faction of rulesDatabase.factions) {
      for (const group of faction.upgradeGroups) {
        for (const section of group.sections) {
          const m = section.title.match(UPGRADE_PSYKER_TITLE)
          if (!m) continue
          matched++
          const level = Number(m[1])
          const required = section.prerequisite?.requiresBaselineRule
          const hasMatch = required?.some((r) => r.ruleId === 'psyker' && r.param === level)
          if (!hasMatch) {
            problems.push(
              `${faction.id}/${group.id}/${section.title}: missing requiresBaselineRule matching Psyker(${level})`,
            )
          }
        }
      }
    }
    expect(problems).toEqual([])
    // Sanity check that this test actually exercised something (the seven known sections).
    expect(matched).toBeGreaterThan(0)
  })
})
