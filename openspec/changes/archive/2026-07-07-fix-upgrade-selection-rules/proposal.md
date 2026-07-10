## Why

The builder's upgrade data collapses every unit's upgrade options into one flat, letter-lettered list with a single "how many can I take" rule per letter. In reality almost every lettered upgrade group in the rulebook bundles several independent choices with different limits — e.g. group A on Tactical Marines is actually "Replace one Assault Rifle" (pick at most one) + "Replace one Medium CCW" (pick at most one) + "Take one Assault Rifle attachment" (pick at most one) + "Upgrade one model with one" (pick at most one), but today it's stored and rendered as a single `any`-selection list, so the UI lets the user check every option in the group at once with no cap. Of the 204 upgrade groups across all 16 factions, 196 are tagged `'any'` and none are tagged `'one'`, even though the rulebook text ("Take one:", "Replace one X:") is unambiguous — this is a systemic transcription gap, not an isolated bug. The user has also produced `./one-page-40k-army-lists.html`, a structured per-faction transcription of the rulebook (mirroring its layout with explicit "Take one/any/up to two/up to three/up to four" and "Replace one/any/all X" sub-headings) that gives a much more reliable source to re-derive the correct constraint per sub-group than re-parsing the PDF.

## What Changes

- **BREAKING**: Restructure `UpgradeGroup` so a lettered group holds one or more independently-constrained **sections** (each with its own title and `selection` rule) instead of one flat option list with a single selection rule for the whole letter.
- Extend `UpgradeSelection` to cover the limits actually printed in the rulebook: `one`, `any`, `upToTwo`, `upToThree`, `upToFour` (drop the unused `replace`/`all` variants, whose intent is already covered by `one`/`any` plus the option's own equipment effects).
- Re-transcribe every faction's `upgradeGroups` (16 faction files, ~204 groups) into the new section shape, using `one-page-40k-army-lists.html` as the source of truth for each section's title and selection limit, cross-checked against the PDF for costs/effects.
- Enforce the selection limit in the list store: picking an option in a `one` section deselects any other option already selected in that same section (radio behavior); sections with a numeric cap (`upToTwo`/`upToThree`/`upToFour`) reject a new selection once the cap is reached.
- Update the builder UI to render each section separately with its own sub-heading, render `one` sections as mutually-exclusive radio controls, and disable additional checkboxes in capped sections once the limit is reached.
- Update `applyUpgrades`/cost calculation, JSON import validation, and existing tests for the new option-id shape and enforcement behavior.

## Capabilities

### New Capabilities
- `upgrade-selection-rules`: Section-level upgrade constraints (one / any / up to N) with enforced, correctly-limited selection in the builder UI, replacing the flat single-selection-per-letter model.

### Modified Capabilities
(none formally archived yet under `openspec/specs/` — this supersedes the not-yet-archived `army-builder-1p40k` change's `rules-data` and `army-builder-ui` specs, which will need their upgrade-related requirements/scenarios updated to match when that change is archived.)

## Impact

- `src/domain/types.ts`: `UpgradeGroup`/`UpgradeSelection` shape.
- `src/data/factions/helpers.ts`: `group()`/`option()` builders (new `section()` helper, new option-id scheme).
- `src/data/factions/*.ts` (all 16 faction files): every `group(...)` call site re-transcribed.
- `src/domain/calc.ts`: option indexing (flatten sections) and any new enforcement helpers.
- `src/stores/lists.ts`: `toggleUpgrade` enforcement logic; `validateImported` option-id lookup.
- `src/views/BuilderView.vue`: per-section rendering, radio/checkbox-cap behavior.
- `src/domain/calc.test.ts`, `src/stores/lists.test.ts`: updated fixtures/assertions for new ids and enforcement.
- Existing saved lists in `localStorage` reference the old flat option ids; those ids will no longer resolve after this change (selections silently drop, per current `applyUpgrades` behavior). No migration is planned — flagged as a known, accepted limitation given this is pre-1.0 hobby data.
