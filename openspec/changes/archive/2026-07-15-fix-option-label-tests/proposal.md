## Why

Faction data across most 40k/Fantasy files was recently reworked to stop embedding a granted rule's name inside an upgrade option's `label` string (e.g. `'Jump Pack (Deep Strike, Flying)'` → `'Jump Pack'`), and `EntryUpgradeControls.vue` was updated to render an option's `addRules` as a separate list of tooltip-bearing rule chips next to the bare label instead. That data/UI change already landed, but three tests still assert the old compound-label text verbatim, so they now fail: `src/domain/calc.test.ts`, `src/stores/lists.test.ts`, and `src/components/EntryUpgradeControls.test.ts`. The `army-builder-ui` spec's "Hover tooltips for rules" requirement is also stale — it only documents the single-rule-name-matches-the-whole-label case, not an option that grants several rules alongside a label that no longer names any of them.

## What Changes

- Update `src/domain/calc.test.ts`'s two real-data option lookups (`optionId(sm, 'A', 'Flamer (Limited)')` and `optionId(sm, 'A', 'Meltagun (Limited)')`) to the current bare labels (`'Flamer'`, `'Meltagun'`). (A third, unrelated `'Flamer (Limited)'` string in the same file is a self-contained synthetic fixture with its own hand-authored label/key, not real faction data — left untouched.)
- Update `src/stores/lists.test.ts`'s option lookup (`o.label === 'Jump Pack (Deep Strike, Flying)'`) to `o.label === 'Jump Pack'`.
- Rewrite `src/components/EntryUpgradeControls.test.ts`'s "does not duplicate rule text for a compound label" test, whose premise (a label with rule names embedded as trailing parenthetical text) no longer exists in the data, to instead cover the current behavior: a multi-rule-granting option's bare label renders as plain text (not swallowed into the single-rule-name tooltip path), and its granted rules render as a separate parenthetical list of tooltip-bearing chips.
- Update the `army-builder-ui` spec's "Hover tooltips for rules" requirement to document the multi-rule-chip-list behavior alongside the existing single-rule-name-matches-label case.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `army-builder-ui`: the "Hover tooltips for rules" requirement is extended to describe an upgrade option that grants multiple rules via a bare label (one that names none of them) — its granted rules render as a separate list of tooltip-bearing chips beside the label, each independently hoverable.

## Impact

- `src/domain/calc.test.ts` — 2 option-lookup strings corrected.
- `src/stores/lists.test.ts` — 1 option-lookup string corrected.
- `src/components/EntryUpgradeControls.test.ts` — 1 test rewritten to match current rendering.
- `openspec/specs/army-builder-ui/spec.md` — "Hover tooltips for rules" requirement extended with a new scenario.
- No production code changes — the underlying data/UI rework already landed; this only brings the test suite (and its spec) back in sync with it.
