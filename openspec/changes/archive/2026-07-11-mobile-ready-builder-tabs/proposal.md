## Why

The builder's Roster and Selected Units panels render as a two-column grid (`grid md:grid-cols-2`) that already stacks to one column below the `md` breakpoint — but stacking still means scrolling through the *entire* roster (18+ units per faction) before ever reaching Selected Units, or vice versa, which is unusable on a phone-sized screen. Separately, most controls across the app (roster row buttons, upgrade selects, list-management buttons) are sized for a mouse (`text-xs`, `py-0.5`/`py-1` padding) rather than a touch target, making them error-prone to tap accurately on a phone.

## What Changes

- **Builder: Roster and Selected Units become switchable tabs below the `md` breakpoint.** A tab switcher (visible only below `md`) lets the user show one panel at a time; at `md` and above, both panels keep rendering side-by-side exactly as today — desktop users lose nothing.
- **Larger, touch-friendlier controls throughout the app.** Buttons and `<select>` dropdowns across the builder (roster row, selected-unit cards, combine/attach/group controls), the lists screen, and the print view's on-screen (non-printed) controls move to a consistently larger size — bumping the smallest tier (`text-xs`, `py-0.5`) up to `text-sm`/`py-1.5` and the header/primary tier up to `text-base`/`py-2`. This is a sizing-only change; no control is added, removed, or relabeled.
- **BREAKING**: none — purely presentational; no data shape, route, or behavior change beyond the new mobile tab switcher and larger hit targets.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: gains a requirement for the mobile tab switcher between Roster and Selected Units, and a requirement establishing a minimum touch-friendly size for the builder's interactive controls.

## Impact

- `src/views/BuilderView.vue`: new `activeTab` state (`'roster' | 'selected'`) and a tab-switcher UI shown only below `md`; the Roster/Selected-units `<section>`s become conditionally hidden on mobile based on the active tab, unconditionally visible at `md`+ (unchanged from today); every button/select in this file bumped to the larger sizing tier.
- `src/views/ListsView.vue`, `src/views/PrintView.vue`: on-screen buttons bumped to the larger sizing tier for consistency (no layout/structural change).
- `src/components/RosterUnitPreview.vue`, `src/components/EntryUpgradeControls.vue`: any buttons/checkboxes they render get the same sizing bump.
- Tests: component/integration coverage for the mobile tab switcher (shown below `md`, hidden at `md`+, switching shows/hides the right panel); no test relies on the specific pixel sizing of a button, so the sizing bump itself needs no new assertions beyond confirming existing interactions (click handlers) still work with the new classes.
