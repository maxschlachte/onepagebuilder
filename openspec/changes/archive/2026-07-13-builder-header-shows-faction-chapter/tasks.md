## 1. Builder header subtitle

- [x] 1.1 In `src/views/BuilderView.vue`, add a computed `listSubtitle` that returns `faction.value.name`, plus ` (` + the matching `store.chapters` entry's name + `)` when `list.value.chapterId` is set, mirroring `ListsView.vue`'s `factionName`/`chapterName` helpers.
- [x] 1.2 Restructure the header's outer container so the existing back-button/name-input/cap/print row is followed by a new row showing `listSubtitle`, indented to align under the name input, styled as small/muted text consistent with other secondary text in the builder.

## 2. Verify

- [x] 2.1 Run the dev server and visually check: a Space Marines list with a chapter selected shows "Space Marines (Blood Angels)" (or the relevant chapter) below the name; a Space Marines list with no chapter and a non-Space-Marines list show only the faction name; check both light/dark mode and the mobile breakpoint for layout/overlap issues.
- [x] 2.2 Run the full test suite (`npm run test`) and `vue-tsc --noEmit`.
