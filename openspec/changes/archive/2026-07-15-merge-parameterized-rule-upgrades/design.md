## Context

`applyUpgrades` (`src/domain/calc.ts:337-387`) computes a unit's effective special rules as:

```ts
let specialRules: RuleRef[] = [...unit.specialRules]
for (const id of selectedUpgradeIds) {
  ...
  if (effects.removeRules) { /* filter out by ruleId */ }
  if (effects.addRules) specialRules = [...specialRules, ...effects.addRules]
}
```

— a plain concatenation, with no awareness that some rules are parameterized tiers of the same underlying rule. `RuleRef.param` (`src/domain/types.ts:22-27`) is already typed `number | string` specifically to distinguish two shapes, per its own doc comment: *"Numeric value (e.g. `Tough(3)`) or dice/qualified expression (e.g. `Impact(D3)`, `Tough(+3)`)"* — and `parseRule` (`src/data/factions/helpers.ts:93-107`) already parses a bare integer into a numeric `param` and a signed/dice expression (anything with a `+` or a letter alongside a digit) into a string `param`, verbatim. Faction data already uses this `+N` convention for real upgrade options — `Tough(+3)` (`eldar.ts`, `sisters-of-battle.ts`, `tau.ts`, `dwarfs.ts`, `dark-elves.ts`, `ogre-kingdoms.ts`) and `Impact(+1)` (`ogre-kingdoms.ts`, and the `adeptus-mechanicus.ts` `Joust` army rule) — always applied on top of a unit that already carries a plain-numeric baseline of the same rule (`Tough(3)`/`Tough(6)`, or no baseline `Impact` at all). Separately, `Psyker(N)`/`Wizard(N)` upgrade options (`adds: ["Wizard(2)"]`, etc.) are always plain numeric, and are always gated by `isSectionAvailable`'s `requiresBaselineRule` check against the unit's *static* `unit.specialRules` (`calc.ts:302-306`) requiring an exact `ruleId`+`param` match — so a unit only ever gets offered a *next*-tier option matching its own current baseline tier, never two at once from a single `applyUpgrades` call chaining through intermediate tiers.

So the bug is narrow and well-scoped: `applyUpgrades`'s final concatenation never collapses same-`ruleId` duplicates at all, regardless of whether the game means them to override (tier) or combine (additive).

## Goals / Non-Goals

**Goals:**
- `applyUpgrades`'s computed `specialRules` has at most one entry per `ruleId` whenever the duplicates involved are plain-numeric and/or `+N`-additive — covering every real case in the current faction data (`Psyker`, `Wizard`, `Tough`, `Impact`).
- The merge rule is driven by the `param` shape itself (numeric vs. `+N` string), not by hardcoding `ruleId === 'psyker' | 'wizard' | 'tough'` — so it automatically covers `Impact(+1)` today and any future rule that follows the same already-established convention, without another change.
- Merged-entry position in the output list is stable (sits where the first occurrence of that `ruleId` was), so the rest of the unit's special-rules ordering doesn't visibly reshuffle when an upgrade is toggled.

**Non-Goals:**
- `combinedEffectiveUnit`/`groupEffectiveUnit` (`calc.ts:154-181`, `203-239`) are untouched. Their rule merge is a *display roster* aggregation across two or more genuinely different unit entries (a combined Infantry pair, or a Conclave/Warband/Beastmaster/Court's distinct member types) — two different Hero/Psyker units shown together in one card legitimately might carry different-tier versions of the same rule (e.g. a Psyker(1) unit grouped with a Psyker(2) unit), and there's no game-rule basis for silently collapsing that to "whichever is higher" the way a single unit's own upgrade stacking does. Out of scope; flagged as a separate concern if it ever comes up.
- No change to which upgrade options exist, their costs, their `requiresBaselineRule` gating, or `parseRule`/`rules()` parsing.
- No merge logic for dice-expression params (`Impact(D3)`) or `note`-only rules — nothing in the current data duplicates those, and there's no defined combination rule for them; a group containing any such entry is left exactly as-is (all entries kept, current behavior).
- No merge across *multiple* `+N` additive entries plus *multiple* plain-numeric entries for the same ruleId within one group — not reachable from current data (at most one baseline numeric value per unit, plus any number of `+N` upgrades), but the design below still defines a sane result if it ever happened (see Decision 1).

## Decisions

### 1. A general `mergeParameterizedRules` step, run once after the accumulation loop

Add a pure helper in `src/domain/calc.ts`:

```ts
function mergeParameterizedRules(rules: RuleRef[]): RuleRef[] {
  const byId = new Map<string, RuleRef[]>()
  for (const r of rules) {
    if (!byId.has(r.ruleId)) byId.set(r.ruleId, [])
    byId.get(r.ruleId)!.push(r)
  }

  const result: RuleRef[] = []
  for (const r of rules) {
    const group = byId.get(r.ruleId)!
    if (group[0] !== r) continue // already emitted via this ruleId's first occurrence
    result.push(mergeGroup(group))
  }
  return result
}

function mergeGroup(group: RuleRef[]): RuleRef {
  if (group.length === 1) return group[0]

  const additive = group.filter((r) => typeof r.param === 'string' && /^\+\d+$/.test(r.param))
  const absolute = group.filter((r) => typeof r.param === 'number')
  const other = group.filter((r) => !additive.includes(r) && !absolute.includes(r))

  if (other.length) return group[0] // unmergeable shape present — leave duplicates alone (caller keeps them all; see note below)

  if (additive.length) {
    const base = absolute.length ? Math.max(...absolute.map((r) => r.param as number)) : 0
    const bonus = additive.reduce((sum, r) => sum + Number((r.param as string).slice(1)), 0)
    return { ruleId: group[0].ruleId, param: base + bonus }
  }

  // All plain-numeric: keep only the highest tier.
  return absolute.reduce((max, r) => ((r.param as number) > (max.param as number) ? r : max))
}
```

then in `applyUpgrades`, replace the return's `specialRules` with `mergeParameterizedRules(specialRules)` (computed once, after the loop, not per-iteration — merging every iteration would be wasted work and isn't needed since prerequisite checks read `unit.specialRules`, the untouched static profile, not the accumulating local).

*Wrinkle*: `other.length` (an unmergeable shape mixed into a same-`ruleId` group) can't happen for any ruleId in the current data (a given rule name is consistently either always-dice, always-`+N`, or always-plain-numeric across the whole dataset), so `mergeGroup`'s `other.length` branch collapsing to just `group[0]` (dropping the rest) is dead code in practice — but the alternative of returning the full group unmerged there needs `mergeParameterizedRules`'s caller to splice multiple entries back in at that ruleId's position, adding real complexity for a branch that never executes. Chose the simpler (if slightly lossy-in-theory) form and documented the assumption; a future data addition that violates it would surface immediately as a visibly wrong single rule in the builder, not a silent miscalculation elsewhere.

*Alternative considered*: hardcode `ruleId === 'psyker' || ruleId === 'wizard'` → keep-max, and `ruleId === 'tough'` → sum. Rejected — misses `Impact(+1)`, which already exists in the data today and would silently keep the same bug for a rule the fix was supposed to cover; the param-shape-driven version handles it for free.

### 2. Merge only inside `applyUpgrades`, not in a shared spot with the combined/group display merges

Even though `combinedEffectiveUnit`/`groupEffectiveUnit` also build a `specialRules` list from multiple sources, they aggregate *distinct unit entries*, not one unit's own upgrade stack — per the Non-Goals above, keep-highest/sum-additive isn't obviously the right call there (a roster of different Hero/Psyker types legitimately differing in tier), so `mergeParameterizedRules` stays private to `calc.ts`'s `applyUpgrades` rather than becoming a shared utility applied everywhere `specialRules` lists get combined.

## Risks / Trade-offs

- **[Risk] A future faction adds a rule using both a plain-numeric baseline and a dice-expression upgrade for the same ruleId (the `other.length` dead branch above), and the fix silently drops one entry instead of showing both duplicated (today's existing, if wrong, behavior).** → Mitigation: this exact shape doesn't exist anywhere in current data (verified by grep across `src/data/factions/`), and any regression would be immediately visible in the builder's special-rules display during normal data-authoring review — not a silent point-cost or rules-legality bug.
- **[Trade-off] `mergeGroup`'s "keep max" tie-break for two identical plain-numeric duplicates (e.g. two different upgrade options both granting `Tough(3)` on a unit with no baseline `Tough`) collapses them to one `Tough(3)`, discarding the fact two sources granted it.** Accepted — this is strictly better than today's literal double-display of `Tough(3), Tough(3)`, and no upgrade option cost accounts for "already have this rule" today either way (each option's `costDelta` is added regardless), so this doesn't change point costs, only the rules list's readability.
