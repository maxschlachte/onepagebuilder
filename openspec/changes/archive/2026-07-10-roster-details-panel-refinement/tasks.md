## 1. `EntryUpgradeControls`: read-only mode

- [x] 1.1 Make `listId`/`listUnit` optional in `EntryUpgradeControls.vue`'s props; add `readonly = computed(() => !props.listUnit)`
- [x] 1.2 `isSectionUnavailable`/`isOptionDisabled` return `false` unconditionally when `readonly` is true
- [x] 1.3 Template: omit the `<input type="checkbox">`, its disabled/cursor styling, and the unavailable-reason hint line when `readonly` is true; every group/section header and option label+cost still renders
- [x] 1.4 Unit/component tests: a read-only invocation (no `listId`/`listUnit`) renders every section/option with cost and tooltips but no checkboxes; an interactive invocation (existing callers, `listId`+`listUnit` passed) is unaffected

## 2. Roster details panel content

- [x] 2.1 In `RosterUnitPreview.vue`, remove the repeated `<strong>{{ profile.name }}</strong>` line
- [x] 2.2 Replace the panel's `rounded border ... bg-white p-2` wrapper with a plain `border-t ... pt-1` divider (no background, no rounded box, no explicit font-size override)
- [x] 2.3 Add a read-only `EntryUpgradeControls` (no `list-id`/`list-unit`) after the equipment/special-rules content, showing every upgrade section/option available to the unit

## 3. Roster toggle button label

- [x] 3.1 In `BuilderView.vue`, change the roster row's toggle button text from "ⓘ" to "Details" (expanded state: "Hide"), relying on the button's own text as its accessible name instead of a separate `aria-label`

## 4. Tests & verification

- [x] 4.1 Update the existing roster-info-toggle integration test for the new button text/label and assert the expanded panel includes at least one upgrade section/option (not just equipment/special rules)
- [x] 4.2 Manually run the app: expand a roster unit's "Details" panel and confirm it shows equipment, special rules, and the full upgrade catalog with costs and tooltips but no checkboxes, no repeated unit name, and no nested box; confirm "Add" and "Details" remain independent — verified via Playwright against the running dev server; all confirmed (full A/D/E/F group catalog shown, 0 checkboxes, name appears once, "Hide" toggle text updates correctly)
- [x] 4.3 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions — 173/173 tests pass, `vue-tsc --noEmit` clean, `npm run build` succeeds
