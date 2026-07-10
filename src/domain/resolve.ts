// Rule-resolution service: turns a RuleRef into its full display name and text,
// looking through the global glossary, the active faction's army rules, and any
// extra rule sources. The same resolver feeds tooltips and the print view.

import type { Faction, RuleRef, RulesDatabase, SpecialRule } from './types'

export interface ResolvedRule {
  id: string
  /** Display name including any parameter, e.g. "Tough(3)". */
  name: string
  /** Full explanatory text from the rulebook. */
  text: string
  param?: number | string
  note?: string
}

/** Format a rule name with its parameter, e.g. ("Tough", 3) → "Tough(3)". */
export function formatRuleName(
  baseName: string,
  param?: number | string,
  note?: string,
): string {
  let name = baseName
  if (param !== undefined) name = `${baseName}(${param})`
  if (note) name = `${name} (${note})`
  return name
}

/**
 * Build a resolver bound to a database and (optionally) a faction so army-rule
 * and psychic-power references resolve alongside the global glossary.
 */
export function createResolver(db: RulesDatabase, faction?: Faction) {
  const index = new Map<string, SpecialRule>()
  for (const rule of db.glossary) index.set(rule.id, rule)
  if (faction) {
    for (const rule of faction.armyRules) index.set(rule.id, rule)
    // Psychic powers are resolvable too (for tooltips and the print reference).
    for (const power of faction.psychicPowers) {
      index.set(power.id, { id: power.id, name: power.name, text: power.text })
    }
  }

  function resolve(ref: RuleRef): ResolvedRule {
    const rule = index.get(ref.ruleId)
    if (!rule) {
      // Unknown ids degrade gracefully to a readable label rather than throwing.
      return {
        id: ref.ruleId,
        name: formatRuleName(ref.ruleId, ref.param, ref.note),
        text: 'Rule text not found.',
        param: ref.param,
        note: ref.note,
      }
    }
    return {
      id: rule.id,
      name: formatRuleName(rule.name, ref.param, ref.note),
      text: rule.text,
      param: ref.param,
      note: ref.note,
    }
  }

  return { resolve, index }
}

export type RuleResolver = ReturnType<typeof createResolver>
