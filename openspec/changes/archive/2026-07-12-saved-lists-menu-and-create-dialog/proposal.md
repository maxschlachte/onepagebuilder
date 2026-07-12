## Why

The saved-lists view currently shows every list action (Open, Duplicate, Export, Delete) as always-visible inline buttons on each row, which doesn't work well on the mobile UI — the buttons are cramped and easy to mis-tap. Separately, creating a new list uses an inline form that only asks for name and faction, always defaulting the points cap to 750 with no way to pick a different starting limit.

## What Changes

- Replace the always-visible action buttons on each saved-list row with a single "⋮" (three dots) menu that reveals Duplicate, Export, Delete (and Rename, now exposed in the UI for the first time).
- Tapping/clicking anywhere on a saved-list row (outside the three-dots menu) triggers the Open action, matching mobile list UI conventions.
- Tapping the three-dots menu itself does **not** trigger Open (event does not propagate to the row).
- Rename the inline "Create" button/section to "Create Army List" and change it from an inline form into a modal dialog.
- The Create Army List dialog collects: list name, faction (dropdown), and points limit, offered as discrete steps (750, 1500, 2250, 3000, 3750, 4500, 5250, 6000 — reusing the existing `composition.heroLimitTable` steps) instead of always defaulting to 750.
- Submitting the dialog creates the list with the chosen name, faction, and points cap, then opens it (same behavior as today, just after the extra points-cap input).

## Capabilities

### Modified Capabilities
- `army-list-management`: "Create, edit, duplicate, and delete lists" requirement changes — list creation now includes an explicit points-cap selection step (via dialog) instead of always using the default cap, and per-list actions (rename, duplicate, export, delete) move behind a three-dot menu while the row itself becomes the Open trigger.

## Impact

- `src/views/ListsView.vue`: replace inline action buttons with a three-dot menu component/state, make the row clickable for Open, replace the inline "New list" form with a "Create Army List" button that opens a new dialog component.
- New dialog component (e.g. `src/components/CreateListDialog.vue`) for the create-list form (name, faction, points-cap stepper).
- `src/stores/lists.ts`: no new store methods required — `createList(name, factionId, pointsCap)` and `renameList` already exist and are reused; `renameList` becomes reachable from the UI for the first time via the three-dot menu.
- `src/data/composition.ts`: reuse `composition.heroLimitTable` point steps as the source for the points-cap stepper (no changes needed, read-only reuse).