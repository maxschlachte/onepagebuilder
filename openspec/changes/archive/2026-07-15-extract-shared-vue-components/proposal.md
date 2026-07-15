## Why

`BuilderView.vue` (578 lines) renders the same visual patterns — a unit's headline (name, size, quality, cost, badge), the equipment/special-rules block, action buttons, and candidate-picker `<select>`s — independently for five near-identical contexts: the Roster row, and the standalone/combined/group/attached cards in Selected Units. `ListsView.vue`, `CreateListDialog.vue`, and `App.vue` each redefine the same primary/secondary/danger button classes inline. A single styling tweak (e.g. button corner radius, headline separator) currently requires editing 3-5 near-duplicate spots and risks the copies drifting apart; `design.md` of `align-selected-units-list-style` already flagged this and deferred it to "a future change."

## What Changes

- Extract a shared `AppButton` component (variant: `primary` | `secondary` | `danger`; size: `base` | `sm`) and replace every inline button in `BuilderView.vue`, `ListsView.vue`, `CreateListDialog.vue`, and `App.vue` with it.
- Extract a shared unit-headline component (name, size, quality, cost, badge, optional right-hand controls slot) and use it for the Roster row and all four Selected Units card shapes (standalone, combined, group, attached).
- Extract a shared equipment/special-rules block component (wraps `EquipmentList` + `RuleChips`) and use it for `RosterUnitPreview` and the four Selected Units card shapes.
- Extract a shared candidate-picker `<select>` component (used for Merge/Group/Attach/"Add to group…") to remove the four near-identical `<select>` blocks and their reset-after-select handlers.
- No visual or behavioral change: every extracted component must render markup/classes equivalent to what it replaces, verified via the existing test suite and a manual pass through each context.
- Reduce `BuilderView.vue`'s size substantially by moving repeated template/script logic into the new components.

## Capabilities

### New Capabilities
(none — this is an internal refactor, no new user-facing capability)

### Modified Capabilities
- `army-builder-ui`: adds a consistency requirement — shared visual primitives (buttons, unit headlines, equipment/special-rules blocks) SHALL render identically wherever they're used, so a single component change propagates everywhere instead of requiring edits in multiple places.

## Impact

- `src/views/BuilderView.vue` — primary target; headline/equipment/select/button duplication removed across roster row + 4 card shapes.
- `src/views/ListsView.vue`, `src/components/CreateListDialog.vue`, `src/App.vue` — inline buttons replaced with `AppButton`.
- `src/components/RosterUnitPreview.vue` — equipment/special-rules block replaced with the shared component.
- New files under `src/components/`: `AppButton.vue`, a unit-headline component, an equipment/special-rules block component, a candidate-picker select component (exact names finalized in design.md).
- Existing tests (`integration.test.ts`, `PrintView.test.ts`, `EquipmentList.test.ts`, `EntryUpgradeControls.test.ts`) assert on rendered text/DOM structure and must keep passing — no test behavior changes expected, but selectors relying on exact DOM nesting should be checked.
