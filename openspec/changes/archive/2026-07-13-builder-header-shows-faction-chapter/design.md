## Context

`BuilderView.vue` already computes `faction` (the effective, chapter-merged `Faction`) via `getEffectiveFaction(list.value.factionId, list.value.chapterId)` (`src/views/BuilderView.vue:31-32`); `faction.value.name` is simply the base faction's name (`getEffectiveFaction` sets `name: base.name` in `src/data/chapters.ts:154`), so it's already the correct display string with no extra lookup. There's no equivalent chapter-name lookup in `BuilderView.vue` yet. `ListsView.vue` already solves the same display problem for the saved-lists row via a local `chapterName(id)` helper that reads `store.chapters` (`src/views/ListsView.vue:100-106`), rendering `{{ factionName }} ({{ chapterName }})` when a chapter is set (`ListsView.vue:184`).

The header itself is a single flex row (`BuilderView.vue:247-266`): back button, the editable name `<input>`, points-cap input, print button. There's no existing subtitle row to extend.

## Goals / Non-Goals

**Goals:**
- Show "Faction Name" (or "Faction Name (Chapter Name)") directly below the list-name input in the builder header, matching the exact format already used on the saved-lists screen.
- Reuse `store.chapters` for the chapter lookup, the same source `ListsView.vue` already uses — no new data source.

**Non-Goals:**
- No change to `ListsView.vue`'s existing display (already correct) or to the print view.
- No change to the editable name `<input>` itself — the new text is a separate, read-only line below it.

## Decisions

**Where the input lives**: change the header's outer container from a single flex row to a small flex column wrapping two rows — the existing button/input/cap/print row unchanged, plus a new row directly below containing the subtitle text, indented to align under the name input rather than the back button. Chosen over cramming the subtitle into the same row (no room at narrow/mobile widths, and the request specifically asks for it "below" the name) or into the live-summary panel below (that panel is about points/heroes/validation, not list identity — keeping this next to the name matches where the user's eye already is when checking which list they're editing).

**Deriving the text**: a small computed `listSubtitle` in `BuilderView.vue` — `faction.value.name` plus, if `list.value.chapterId` is set, ` (` + the matching entry in `store.chapters` + `)`, mirroring `ListsView.vue`'s `factionName`/`chapterName` helpers exactly (same lookup, same parenthetical format) rather than inventing a new format.

## Risks / Trade-offs

- [Header grows taller, could crowd the mobile layout] → mitigation: the subtitle is one short line of small/muted text (e.g. `text-sm text-gray-500`), consistent with other secondary text already in the builder (e.g. the roster's Hero/Psyker badges' sizing conventions); verify at the mobile breakpoint alongside desktop per the project's UI-change testing norm.
