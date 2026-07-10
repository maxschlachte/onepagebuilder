## Why

The roster info panel shipped in `roster-info-panel-and-equipment-merge-fix` (implemented, not yet archived) only shows a unit's baseline equipment and special rules — not its available upgrade options, which is the information a player actually needs to decide whether a unit is worth adding. The panel also repeats the unit's name (already visible in the row above it) and renders as a bordered box nested inside the roster row's own bordered box, and its toggle is an unlabeled "ⓘ" icon rather than a clear label.

## What Changes

- **Roster details panel shows the full upgrade catalog.** Reuse the same upgrade-groups listing already shown for a selected unit (`EntryUpgradeControls`), but read-only — every available section/option with its cost and rule tooltips, no checkboxes, no selection state. This requires `EntryUpgradeControls` to support a read-only mode (no `listId`/`listUnit`) alongside its existing interactive one, rather than a separate parallel component.
- **Drop the repeated unit name.** The panel no longer repeats the unit's name — it's already shown in the row header directly above.
- **Flatten the nesting.** The panel no longer renders its own bordered/backgrounded box inside the roster row's box — it's a plain content block separated from the row header by a divider, matching how the "selected units" panel already separates its own sections.
- **Rename the toggle control.** The roster row's info toggle button shows the text "Details" instead of the "ⓘ" icon.
- **BREAKING**: none — UI-only change, no data shape change.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: the roster info panel requirement is refined — full upgrade catalog instead of just equipment/rules, no repeated name, no nested box, and the toggle control is labeled "Details".

## Impact

- `src/components/EntryUpgradeControls.vue`: `listId`/`listUnit` become optional; when omitted, the component renders every section/option as plain read-only rows (no checkbox, no disabled/prerequisite state, since there's no real selection to evaluate).
- `src/components/RosterUnitPreview.vue`: drops the repeated name and its own bordered/backgrounded wrapper; adds a read-only `EntryUpgradeControls` invocation after the equipment/special-rules content.
- `src/views/BuilderView.vue`: the roster row's toggle button text changes from "ⓘ" to "Details" (aria attributes updated to match).
- Tests: update/extend coverage for `EntryUpgradeControls`' read-only mode and the roster panel's new content/toggle label.
