## Context

`EntryUpgradeControls.vue` already implements two independent tooltip paths for an upgrade option's label (see `labelTooltip()` and the template's `v-if="labelTooltip(opt).tooltip"` branch vs. its `v-else` branch):

1. **Single-rule-name label** (`labelTooltip()`): if the label's text up to a trailing `" ("` exactly matches the resolved name of one of the option's `addRules`, that whole prefix renders wrapped in a single `RuleTooltip`, and only the parenthetical suffix (if any) renders as plain text after it. This is the `'Battle Standard'`-style case, unaffected by this change.
2. **Bare label + separate rule-chip list** (the `v-else` branch): otherwise, the label renders as plain text, and if the option has any `addRules` at all, they render as a parenthetical, comma-joined list of `RuleTooltip`s via `RuleChips` immediately after the label.

Before the faction-data cleanup that dropped rule names from labels (e.g. `'Jump Pack (Deep Strike, Flying)'` → `'Jump Pack'`), options with more than one granted rule had no chip-list rendering at all — the rule names were just baked into the label string as inert parenthetical text, and `EntryUpgradeControls.test.ts`'s "does not duplicate rule text for a compound label" test existed to confirm that inert text wasn't *also* being run through the single-rule tooltip path (which would have duplicated the rule's glossary text next to itself). That inert-text case no longer exists in the data — every option's rules now come from structured `addRules`, and multi-rule options render via the chip-list path, which the test doesn't cover at all today.

## Goals / Non-Goals

**Goals:**
- Get `calc.test.ts`, `lists.test.ts`, and `EntryUpgradeControls.test.ts` passing again against the current (already-shipped) data/UI behavior.
- Replace the obsolete "compound label" test with one that actually exercises the current chip-list rendering path, so the boundary between the two tooltip paths (single-rule-name vs. bare-label-plus-chip-list) stays under test.
- Bring the `army-builder-ui` spec's "Hover tooltips for rules" requirement back in sync with what's implemented.

**Non-Goals:**
- No changes to `EntryUpgradeControls.vue`, faction data, or any other production code — the behavior under test is already correct and shipped; only the tests (and the spec describing them) were left behind.
- No attempt to migrate the remaining faction-data labels that still embed rule text in parentheses (e.g. `'Jump Packs (Deep Strike, Flying)'` in group D) — out of scope; those labels' own tests (e.g. `integration.test.ts`'s whole-unit-panel assertions) already pass as-is and aren't touched.

## Decisions

### 1. `calc.test.ts` / `lists.test.ts`: mechanical string updates only

Both files look up a real `space-marines` option by its exact (or prefix) label text. `calc.test.ts:339` (`optionId(sm, 'A', 'Flamer (Limited)')`) and `calc.test.ts:536` (`optionId(sm, 'A', 'Meltagun (Limited)')`) become `'Flamer'` / `'Meltagun'`; `lists.test.ts:306` (`o.label === 'Jump Pack (Deep Strike, Flying)'`) becomes `o.label === 'Jump Pack'`. No other change needed — `optionId`'s `.startsWith()` and the exact-equality check both still resolve to exactly one option in their respective groups.

*Note*: `calc.test.ts:178-188` also contains the literal string `'Flamer (Limited)'`, but as a hand-authored key/label on a synthetic `UpgradeOption` fixture constructed inline in that test — it has nothing to do with the real `space-marines` data and is left untouched.

### 2. `EntryUpgradeControls.test.ts`: rewrite the compound-label test to cover the chip-list path

Replace "does not duplicate rule text for a compound label like 'Jump Pack (Deep Strike, Flying)'" with a test against the same real option (still reachable via its current bare label, `'Jump Pack'`, which grants `Deep Strike` and `Flying`) that asserts, using `findAllComponents(RuleTooltip)` scoped to that option's `<label>` row:

- No `RuleTooltip` renders the label text itself (`'Jump Pack'`) — confirming it did *not* fall into the single-rule-name path (it can't: no `addRules` entry resolves to the name "Jump Pack").
- Exactly two `RuleTooltip`s render, one per granted rule (`Deep Strike`, `Flying`), identified by resolved `ruleId` rather than brittle substring matching on concatenated tooltip text.

This directly replaces the old test's intent (verify the two rendering paths don't collide/duplicate) with an assertion suited to the current architecture, rather than asserting on the no-longer-producible compound-label string.

*Alternative considered*: keep asserting on flattened `.text()` output (as the old test did). Rejected — `.text()` concatenates a `RuleTooltip`'s visible name and its hidden hover-panel text with no separator (as seen in the current failure's `'Deep StrikeDeep Strike You may...'` output), making substring assertions fragile and hard to reason about; walking the rendered `RuleTooltip` components directly is both more precise and mirrors how the "Battle Standard" test already inspects tooltip presence structurally rather than textually.

### 3. Spec update: extend "Hover tooltips for rules" rather than add a new requirement

The existing requirement already establishes the single-rule-name-matches-label case; the multi-rule-chip-list case is the same feature area (rule tooltips on options before selection), just a second sub-case. Extending the requirement's body and adding one scenario keeps the two related behaviors together instead of splitting them across two requirements for what is, from the user's perspective, one feature ("upgrade options show tooltips for the rules they grant").

## Risks / Trade-offs

- **[Risk] Asserting on `RuleTooltip`'s `refData` prop couples the test to that component's internal prop shape.** → Accepted: `RuleTooltip` is a small, stable internal component already used the same way by the passing "Battle Standard" test's sibling assertions elsewhere in this file; this is consistent with existing test style, not a new pattern.
