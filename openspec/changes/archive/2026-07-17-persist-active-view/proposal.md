## Why

The app is a single-page conditional-render shell (`App.vue` holds a plain `view: 'lists' | 'builder' | 'print'` ref and a `currentListId` ref, with no client-side routing) that always boots to the saved-lists screen. A user editing a list in the builder, or looking at a print preview, who refreshes the page — or reopens the app later — loses that place entirely and has to re-navigate from the saved-lists screen every time, even though the list itself (and its selected upgrades) already survives via the existing lists-array persistence.

## What Changes

- Persist which screen is open (`lists`/`builder`/`print`) and which list id, across reloads, using the same `ref` + `watch` + `localStorage` idiom already established for `activeSystem` in `src/stores/lists.ts`.
- On boot, restore the builder or print screen for the previously-open list — but only if that list still exists (it may have been deleted, or belong to a game system no longer active); otherwise fall back to the saved-lists screen, the same as today's unconditional default.
- No change to what's shown once a screen is restored — the builder/print views already render correctly from just a `listId` prop.

## Capabilities

### New Capabilities

- `view-persistence`: which top-level screen (saved-lists / builder / print) and list is currently open persists across a reload, restoring the user to where they left off rather than always resetting to the saved-lists screen.

### Modified Capabilities

(none)

## Impact

- **Affected code**: `src/App.vue` (persist `view`/`currentListId`, restore on boot with a still-exists check against the lists store), `src/stores/lists.ts` (no functional change needed — `lists` is already exposed as a computed the boot-time check can read).
- **Affected tests**: a new component test for `App.vue` (none exists today) covering restore-on-boot and the stale-list fallback.
- **Not affected**: `src/views/ListsView.vue`, `BuilderView.vue`, `PrintView.vue` — all three already accept exactly the props (`listId`) needed to render correctly once restored; no view-level changes. The mobile roster/selected-units tab (`BuilderView.vue`'s `activeTab`) is explicitly out of scope — see design.md's Non-Goals.
