## Context

`applyUpgrades` accumulates `specialRules` by concatenation, then collapses same-`ruleId` duplicates once via `mergeParameterizedRules` → `mergeRuleGroup` (`src/domain/calc.ts:405-420`). `mergeRuleGroup` partitions a group into two recognized shapes:

```ts
const additive = group.filter(r => typeof r.param === 'string' && /^\+\d+$/.test(r.param))
const absolute = group.filter(r => typeof r.param === 'number')
if (additive.length + absolute.length !== group.length) return group[0]   // ← the bug
```

`RuleRef.param` is typed `number | string` precisely to carry three authored shapes, per `parseRule`: a bare integer becomes a number (`Tough(3)`), and anything else containing a digit is kept as a verbatim string — covering both additives (`+1`, `+D6`) and dice expressions (`D3`, `2D6`). The partition above recognizes numbers and `+<digits>` but not dice, and not `+<dice>`. Any group mixing in a dice param therefore fails the length check and collapses to its first element, discarding every other contributor.

The guard was introduced deliberately, with its unreachability asserted in prose rather than in a test. It was wrong on arrival: the Ork `Impact(D3)` + `Wreckin' Ball Impact(+D6)` pairing existed at commit `6ae1397` (2026-07-13), two days before. A probe over the current data finds 8 reachable pairings across both systems, in four distinct shapes (dice+numeric-additive, dice+dice-additive, and the `+D6` additive form itself, which the `/^\+\d+$/` pattern also rejects).

## Goals / Non-Goals

**Goals:**
- Every contributing entry in a same-`ruleId` group is represented in the merged result; nothing is silently dropped.
- A dice base plus additive bonuses renders as one readable expression the player can roll directly (`Impact(D3+1)`).
- The all-numeric behavior is bit-for-bit unchanged.
- Replace the prose unreachability claim with a test that actually walks the data.

**Non-Goals:**
- No change to `parseRule`/`rules()`, to which options exist, to their costs, or to prerequisite gating.
- No arithmetic simplification of dice (`2D6+D6` stays as written, not `3D6`) — see Decision 2.
- `combinedEffectiveUnit`/`groupEffectiveUnit` stay untouched, for the reason the prior change already documented: they aggregate genuinely distinct unit entries, where collapsing differing tiers has no game-rule basis.
- The mount-`Tough` summing branch (`calc.ts:499-505`) is unchanged. It handles numeric Tough only, and a probe confirms no mount grants a dice `Tough`.

## Decisions

### 1. Classify param shape explicitly, then merge base ⊕ additives

Replace the two-way partition with an explicit classifier over the three authored shapes:

| Shape | Test | Example |
|---|---|---|
| numeric | `typeof param === 'number'` | `Tough(3)` |
| additive | string matching `/^\+/` | `+1`, `+D6` |
| dice/other | any other string | `D3`, `2D6` |

Merge proceeds as: take the **base** from the non-additive entries, then append each additive's text.

- All-numeric base and all-numeric additives → arithmetic, result stays a `number`. This is the existing path, preserved exactly: base = `Math.max(...numerics)` (or `0`), plus the sum of the additives.
- Any dice involved → symbolic. Base is the non-additive entries joined by `+` in first-occurrence order (normally exactly one); each additive is appended verbatim, its leading `+` acting as the joiner. Result is a `string`.

A group with no additives and a single entry returns that entry unchanged, so the overwhelmingly common single-entry case short-circuits as it does today.

*Why base-then-additives rather than a general expression builder:* the authored data only ever has one non-additive baseline per rule per unit, with any number of `+N` upgrades layered on. Keeping the base/additive split mirrors how the rulebook prints it and how `parseRule` already tokenizes it, and it makes the numeric fast path fall out as a special case rather than a separate branch.

*Alternative considered:* keep the bail-out but widen the additive pattern to `/^\+/`. Rejected — it fixes `+D6` being unrecognized but leaves the dice **base** unrecognized, so `Impact(D3)+Impact(+1)` would still bail. It addresses a symptom of the partition, not the partition.

### 2. Symbolic concatenation, no dice normalization

`Impact(2D6)` + `Impact(+D6)` becomes `Impact(2D6+D6)`, not `Impact(3D6)`.

Normalizing same-size dice would read more cleanly in that one case, but it only applies when die sizes match — `Impact(D3)+Impact(+D6)` must stay `D3+D6` regardless. That means carrying a dice-algebra path that handles a minority of cases while the concatenation path still has to exist for the rest. Concatenation is one rule, is exactly what the player rolls, and never has to be re-derived when a new die size appears in the data.

*Trade-off accepted:* a unit taking two additive upgrades on the same rule would read `Impact(D3+1+1)` rather than `Impact(D3+2)`. No current data reaches this (no rule has two additive options selectable together on one unit), and folding constants is a strictly local addition if it ever does.

### 3. Delete `isAdditive` rather than wire it up

`SpecialRule.isAdditive` is declared in `types.ts` and set on three 40k glossary entries (`impact`, `tough`, `transport`). Nothing reads it. The fantasy glossary sets it nowhere, yet fantasy `Impact`/`Tough` merging works correctly — because the real contract is the **param shape at the reference site** (`+N` is additive), not a property of the rule definition.

Keeping the flag invites a future reader to treat it as authoritative and gate merging on it, which would immediately break every fantasy rule. Wiring it up instead would mean auditing every parameterized rule across both glossaries to set it correctly, for no behavioral gain over the shape convention that already works. Delete it.

### 4. A data-driven collision audit, replacing the prose claim

Add a test that walks every faction, and for each unit crosses its baseline `specialRules` against every rule-granting option in the upgrade groups that unit can take (plus mount-granted rules), collecting same-`ruleId` collisions. For each, it asserts the merged result **accounts for every contributor** — the merged param's text contains each contributing entry's own param text, or the group merged arithmetically to a number.

This is the check that would have caught the original error. It is intentionally an invariant over the merge, not a snapshot of the 8 known pairings, so new faction data that introduces a novel shape fails on arrival rather than silently taking the lossy branch.

## Risks / Trade-offs

- **[Risk] The result type of a merged param changes from `number` to `string` when dice are involved, and some consumer does arithmetic on it.** → Mitigated: `param` is already `number | string` and dice params already flow through as strings today; a grep shows the only arithmetic on `param` is inside `mergeRuleGroup` and the mount-`Tough` branch, both of which guard on `typeof === 'number'`. `formatRuleName` interpolates directly.
- **[Risk] `requiresBaselineRule` gating matches on `ruleId` + exact `param` (`calc.ts:341`), so a merged `Impact(D3+1)` no longer equals a gate expecting `Impact(D3)`.** → That check reads `unit.specialRules`, the untouched static baseline profile, never the merged result — verified at the call site. No gate is affected.
- **[Trade-off] `Impact(D3+1)` is a less tidy label than a single number.** Accepted, and it is what the user asked for: it is unambiguous about what to roll, and any collapsing would either lose information or need per-die-size algebra.
- **[Risk] The audit's "every contributor is represented" invariant is weaker than asserting exact expected strings.** → Deliberate. Exact-string assertions over 8 pairings would need updating whenever data changes and would not generalize; the invariant catches the actual failure mode (dropped contributors). A handful of explicit expected-value cases cover the headline pairings on top of it.
