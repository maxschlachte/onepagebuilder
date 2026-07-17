## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change. (Found and fixed one pre-existing, unrelated failing test in `src/domain/calc.test.ts`, left over from the prior `sergeant-musician-standard-whole-unit` session's Decision 5 rewrite of `wholeUnitOptionIds` — a stale assertion expected `oncePerUnit` options to still be included in `wholeUnitOptionIds`, which Decision 5 deliberately changed. Updated the assertion to match the documented, intentional behavior.)

## 2. Persist and restore the active view

- [x] 2.1 In `src/App.vue`, add a `VIEW_STORAGE_KEY = 'opr40k.activeView.v1'` constant and a `loadStoredView()` function that reads and JSON-parses it from `localStorage`, returning `{ view: 'builder' | 'print'; listId: string } | null` — `null` on missing/malformed data or a caught storage error (mirroring `lists.ts`'s existing `load()`/`loadSystem()` try/catch pattern).
- [x] 2.2 In `src/App.vue`, call `useListsStore()` and, at module-level `<script setup>` time (not inside a lifecycle hook), check whether `loadStoredView()`'s `listId` (if any) exists in `store.lists.value`; initialize `view`/`currentListId` refs from the stored value only if it does, otherwise default to `'lists'`/`null` exactly as today.
- [x] 2.3 In `src/App.vue`, add a `watch([view, currentListId], ...)` that writes `{ view, listId }` to `localStorage` under `VIEW_STORAGE_KEY` when `view` is `'builder'` or `'print'` with a non-null `currentListId`, and removes the key otherwise (i.e. when `view === 'lists'`) — wrapped in try/catch, ignoring storage errors.

## 3. Test coverage

- [x] 3.1 Create `src/App.test.ts` (none existed today). Added a test: with a list created via the store and `localStorage` pre-seeded to `{ view: 'builder', listId: <that list's id> }` before mounting, mounting `App` renders `BuilderView` (not `ListsView`).
- [x] 3.2 Added a test: same as 3.1 but with `view: 'print'`, mounting `App` renders `PrintView`.
- [x] 3.3 Added a test: with `localStorage` pre-seeded to reference a `listId` that doesn't exist in the store's lists, mounting `App` renders `ListsView` (the fallback), not a broken builder/print view.
- [x] 3.4 Added a test: with no `localStorage` entry at all, mounting `App` renders `ListsView` (today's unchanged default).
- [x] 3.5 Added a test: simulate opening a list (via `ListsView`'s emitted `open` event) and confirm `localStorage.getItem(VIEW_STORAGE_KEY)` reflects the new screen/list; then simulate navigating back to the saved-lists screen (via `BuilderView`'s emitted `back` event) and confirm the key is removed. All 5 tests pass.

## 4. Final verification

- [x] 4.1 Run the full test suite; fix any failures. (270/270 pass)
- [x] 4.2 Run `vue-tsc --noEmit` and `vite build`; fix any type errors. (both clean)
- [x] 4.3 Functional spot-check via a real headless-Chromium browser session against the Vite dev server (using `playwright`, installed ad hoc for this check — no project verifier/run skill existed, so this became the cold-start path): created a list (auto-opens the builder), refreshed — confirmed the builder reopened for the same list (list-name input and Roster/Selected Units panels intact, `localStorage` correctly holding `{"view":"builder","listId":...}`). Navigated to the print view, refreshed — confirmed the print view reopened for the same list ("Print / Save as PDF" header, list name, correct `localStorage` entry). Simulated the open list being deleted from another tab (removed it from `opr40k.lists.v1` directly) while `activeView` still pointed at it, then refreshed — confirmed it fell back cleanly to the saved-lists screen ("Create Army List" visible, no trace of the deleted list), not an error or broken view. One minor, non-functional observation: the stale `activeView` `localStorage` entry isn't proactively cleared on this fallback path (the initial `ref()` assignment doesn't trigger the `watch`, which only fires on subsequent changes) — harmless in practice, since the same `listExists` check keeps correctly falling back to the saved-lists screen on every future load too, so there's no user-visible effect; noted here rather than treated as a blocking bug.
