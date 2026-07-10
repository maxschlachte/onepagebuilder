## 1. Domain: fix equipment merge-by-key

- [x] 1.1 Add `equipmentMergeKey(e: EquipmentEntry): string` in `src/domain/calc.ts`, composed of `e.key` plus a sorted, comma-joined signature of `e.weapon?.rules ?? e.rules ?? []` by `ruleId`
- [x] 1.2 Update `combinedEffectiveUnit`'s equipment-merge loop to group/dedupe by `equipmentMergeKey(e)` instead of `e.key`, so a plain weapon and a rule-bearing variant (e.g. Limited) of the same weapon produce two separate output entries, each with its own summed `unitCount`
- [x] 1.3 Apply the same fix to `groupEffectiveUnit`'s equipment-merge loop
- [x] 1.4 Unit tests: `combinedEffectiveUnit` and `groupEffectiveUnit` each get a test where one side has a plain Meltagun and the other has "Meltagun (Limited)" — assert the result has two separate equipment entries (not one summed to `unitCount: 2`), the plain one with no Limited rule and the Limited one with it; also keep/add a test confirming two genuinely identical entries (same key, same rules) still merge into one with a summed count

## 2. Builder UI: roster info button + expandable panel

- [x] 2.1 Rework `RosterUnitPreview.vue` into a plain presentational component (`profile`, `faction` props, no slot, no hover/focus CSS) rendering the equipment/special-rules block directly
- [x] 2.2 In `BuilderView.vue`, add `expandedRosterIds` state and a `toggleRosterInfo(unitId)` action
- [x] 2.3 Add an "ⓘ" info button to each roster row, before the "Add" button, that calls `toggleRosterInfo`; render `RosterUnitPreview` in a conditional block below the row when that unit's id is in `expandedRosterIds`
- [x] 2.4 Confirm activating "Add" never toggles the info panel and activating the info button never adds the unit (no shared click handler/event bubbling between the two controls) — separate buttons, separate `@click` handlers, neither nested inside the other

## 3. Tests & verification

- [x] 3.1 Update/replace any existing test coverage that relied on the old hover-popover behavior of `RosterUnitPreview.vue` (none currently exists as a dedicated test, but check `BuilderView`-level integration tests don't assert hover-specific markup) — confirmed: no existing test referenced hover markup, full suite passes unchanged (169/169)
- [x] 3.2 Component/integration test: clicking a roster unit's info button expands a panel showing its equipment and special rules; clicking again collapses it; clicking "Add" does not expand it
- [x] 3.3 Manually run the app: click the info button on a roster unit and confirm the panel expands with equipment/rules and tooltips, click again to collapse, confirm touch/keyboard (Enter/Space on the focused button) also works; combine two Tactical Marines entries where one has a plain Meltagun and the other has the "Meltagun (Limited)" attachment and confirm both the builder and print view show two distinct Meltagun entries with the Limited one's rule visible — verified via Playwright against the running dev server: info button expands/collapses correctly and is independent of Add; combined-pair equipment list and print view both show two separate "1x Meltagun" rows, only one tagged "Limited", no "2x Meltagun" merge
- [x] 3.4 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions — 170/170 tests pass, `vue-tsc --noEmit` clean, `npm run build` succeeds
