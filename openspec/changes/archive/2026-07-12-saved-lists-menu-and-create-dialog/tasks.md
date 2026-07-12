## 1. Saved list row: click-to-open + three-dot menu

- [x] 1.1 In `src/views/ListsView.vue`, add a click handler on each saved-list `<li>` row that emits `open` with the list's id.
- [x] 1.2 Replace the always-visible Duplicate/Export/Delete buttons with a single three-dot (⋮) button per row that toggles a dropdown menu; give it `@click.stop` so it doesn't trigger the row's open handler.
- [x] 1.3 Add a "Rename" item to the menu that reveals an inline editable name field (or equivalent) and calls `store.renameList(id, newName)` on confirm.
- [x] 1.4 Wire the menu's Duplicate, Export, Delete items to the existing `store.duplicateList`, `store.downloadList`, and `confirmDelete`/`store.deleteList` calls, each with `@click.stop` and closing the menu after acting.
- [x] 1.5 Close the open menu on outside click and on `Escape` (single shared "open menu id" ref + one document-level listener, not per-row listeners).
- [x] 1.6 Verify keyboard/focus behavior: menu button is a real `<button>`, focus stays sane after closing the menu.

## 2. Create Army List dialog

- [x] 2.1 Create `src/components/CreateListDialog.vue`: a `<Teleport to="body">` modal with backdrop, containing inputs for list name (text), faction (`<select>` from `store.rulesDatabase.factions`), and points limit (`<select>` populated from `composition.heroLimitTable.map(t => t.points)`).
- [x] 2.2 Default the points-limit selection to `composition.defaultPointsCap`.
- [x] 2.3 Emit a `create` event with `{ name, factionId, pointsCap }` on submit; emit `cancel`/close on Cancel button, backdrop click, or `Escape`.
- [x] 2.4 Set initial focus to the name input when the dialog opens; return focus to the trigger button on close.
- [x] 2.5 Disable/validate submit when name is empty or no faction is selected, matching current `create()` guard behavior in `ListsView.vue`.

## 3. Wire dialog into ListsView

- [x] 3.1 In `src/views/ListsView.vue`, replace the inline "New list" form (name input, faction select, "Create" button) with a "Create Army List" button that opens `CreateListDialog`.
- [x] 3.2 Handle the dialog's `create` event by calling `store.createList(name, factionId, pointsCap)` then `emit('open', list.id)`, mirroring today's `create()` behavior.
- [x] 3.3 Keep the "Import JSON" button and its file input outside the dialog, unchanged.
- [x] 3.4 Remove now-unused local state/refs (`newName`, `newFactionId`, old `create()`) from `ListsView.vue` once superseded by the dialog flow.

## 4. Styling and verification

- [x] 4.1 Style the row, three-dot menu, and dialog with Tailwind classes consistent with existing dark-mode conventions (`dark:bg-gray-800`, `dark:border-gray-700`, etc.).
- [x] 4.2 Manually verify on a narrow/mobile viewport: tapping a row opens the list, tapping the three-dot menu does not open the list, each menu action works, and the Create Army List dialog opens/closes/creates correctly with each points-limit step.
- [x] 4.3 Run existing lint/build/tests to confirm no regressions (e.g. `npm run build` / project's test command).
