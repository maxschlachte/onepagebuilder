## 1. `AppButton`

- [x] 1.1 Create `src/components/AppButton.vue` per design.md Decision 1 (`variant`/`size` props, native attrs passthrough, no custom `click` emit).
- [x] 1.2 ~~Replace inline buttons in `src/App.vue`'s "List not found" back button.~~ Correction: `App.vue` only routes between views and has no buttons of its own — the "List not found" back button actually lives in `BuilderView.vue`'s `v-else` branch; folded into task 1.5.
- [x] 1.3 Replace inline buttons in `src/components/CreateListDialog.vue` (Cancel, Create — keep `disabled:opacity-50` as an extra class on the Create instance).
- [x] 1.4 Replace the main-action inline buttons in `src/views/ListsView.vue` (Create Army List, Import JSON). Correction: the game-system tab buttons use a segmented-control treatment (shared container border, no per-button border, distinct from both `primary` and `secondary`) — not the same pattern as `AppButton`, left untouched alongside the list-menu items and `text-xs` rename Save/Cancel pair per design.md's Non-Goals.
- [x] 1.5 Replace all inline buttons in `src/views/BuilderView.vue` (back, print, mobile tab switcher, roster Details/Add, standalone Remove, combined Split, group Leave-group, attached Detach, "List not found" back button) with `AppButton`, choosing `variant`/`size` per design.md's class table.
- [x] 1.6 Run the test suite; fix any selector breakage from the `secondary/sm` normalization (Details/Leave group/Split/Detach gaining `font-display uppercase tracking-wide`). 221/222 passing — the one failure (`integration.test.ts` expecting `'Combine…'` text where the app actually renders `'Merge…'`) pre-exists on `main` (confirmed via `git stash`), unrelated to this change; left as-is.

## 2. `UnitLoadout`

- [x] 2.1 Create `src/components/UnitLoadout.vue` per design.md Decision 3 (`equipment`, `unitSize`, `faction`, `specialRules` props).
- [x] 2.2 Use it in `src/components/RosterUnitPreview.vue`, keeping that component's own `border-t pt-1` wrapper and `EntryUpgradeControls` call around it.
- [x] 2.3 Use it in `src/views/BuilderView.vue`'s four Selected Units card shapes (standalone, combined, group, attached), replacing each shape's own `Equipment:`/`Special:` block.
- [x] 2.4 Run the test suite. 221/222 passing, same pre-existing failure as 1.6.

## 3. `UnitHeadline`

- [x] 3.1 Create `src/components/UnitHeadline.vue` per design.md Decision 2 (`name`/`cost`/`size?`/`quality?`/`divider?` props, `badge`/`controls` named slots).
- [x] 3.2 Use it for the Roster row in `src/views/BuilderView.vue` (`:divider="false"`, `badge` slot holding the conditional Hero/caster `<Badge>`, `controls` slot holding Details/Add).
- [x] 3.3 Use it for the standalone unit card (badge slot empty, controls slot holding the Merge/Group/Attach selects and Remove).
- [x] 3.4 Use it for the combined pair card (`Combined` badge, Split control).
- [x] 3.5 Use it for the group-deployment card (no `quality` prop, `Group` badge, "Add to group…" control).
- [x] 3.6 Use it for the attached sub-card (`Attached` badge, Detach control).
- [x] 3.7 Delete the now-dead inline headline markup from each of the five branches.
- [x] 3.8 Run the test suite; check for structural-selector breakage per design.md's Risks section. 221/222 passing, same pre-existing failure, no new breakage.

## 4. `CandidatePicker`

- [x] 4.1 Create `src/components/CandidatePicker.vue` per design.md Decision 4 (`candidates`/`placeholder`/`label` props, `pick` emit, self-resetting internal `ref`).
- [x] 4.2 Replace the Merge `<select>` (standalone card) with `CandidatePicker`, wiring `@pick` to `store.combineUnits`; delete `onCombineSelect`.
- [x] 4.3 Replace the Group `<select>` (standalone card) and the "Add to group…" `<select>` (group card) with `CandidatePicker`, wiring `@pick` to `store.joinGroup`; delete `onGroupSelect`.
- [x] 4.4 Replace the Attach `<select>` (standalone card) with `CandidatePicker`, wiring `@pick` to `store.attachToUnit`; delete `onAttachSelect`.
- [x] 4.5 Run the test suite. 221/222 passing, same pre-existing failure; the attach/group `setValue()`-based flow tests (unaffected by the pre-existing bug) pass, confirming `CandidatePicker`'s real `<select>` wiring works.

## 5. Verification

- [x] 5.1 Full suite green (`npm test`). 221/222 — 1 pre-existing failure unrelated to this change (documented in 1.6).
- [x] 5.2 Typecheck clean (`npm run build` or `vue-tsc --noEmit`). Caught and fixed a real bug: `UnitHeadline`'s `quality` prop was typed `number`, but `UnitProfile.quality` is a string (e.g. `"3+"`) — corrected to `quality?: string` (design.md updated).
- [x] 5.3 Manual browser pass (Playwright against the Vite dev server, 15 screenshots) covering: Lists screen (Create/Import/game-system tabs, light+dark), Create Army List dialog (Cancel/Create), Roster row with expanded Details panel and Hero/Psyker badges, adding+combining two Tactical Marines (Merge select, Split button), attaching/detaching a Captain to/from a unit (Attach select, Detach button, post-detach standalone state), builder in dark mode, and the mobile tab switcher (both tabs, correct active/inactive `AppButton` variants). Zero console errors across the run.
- [x] 5.4 Confirm re-picking the same candidate twice in a row in a `CandidatePicker` still dispatches the store action both times (design.md Risk 2). Verified structurally: `CandidatePicker` binds `v-model="selected"` (reset to `''` after each pick) directly to the native `<select>`, so a repeat pick of the same option is a `'' → id` transition each time, which fires `change` identically to the original `event.target.value` pattern — confirmed in the manual pass (combine, then split, then attach again all fired correctly in sequence).
- [x] 5.5 Record `src/views/BuilderView.vue`'s line count before/after to confirm a meaningful reduction, noting it in the PR/commit description. 578 → 465 lines (-113, ~20%).
