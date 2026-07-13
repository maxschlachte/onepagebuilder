## Why

The builder view's header currently shows only the editable list name, points cap, and a print button — nothing tells the user which faction (and, for Space Marines, which chapter) the open list is for. The saved-lists screen already shows this next to each list's name (`Faction Name (Chapter Name)`); the builder, where the user spends most of their time, is missing it entirely, which is disorienting when a user has multiple lists for different factions open across sessions.

## What Changes

- Show the list's faction name below the editable list-name field in the builder header, and, if the list has a chapter selected, the chapter name alongside it — reusing the same "Faction Name (Chapter Name)" format already used on the saved-lists screen.
- No change for a non-Space-Marines list or a Space Marines list with no chapter: only the faction name is shown.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: adds a requirement that the builder header displays the open list's faction (and chapter, if any) below its name.

## Impact

- `src/views/BuilderView.vue`: header markup gains a subtitle line; needs the same `chapters` lookup already used by `src/views/ListsView.vue` (via `useListsStore().chapters` or `getFaction`/`chapters` from `src/data/chapters.ts`) to resolve display names from `list.factionId`/`list.chapterId`.
