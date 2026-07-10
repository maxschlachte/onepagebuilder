## 1. Domain classification fix

- [x] 1.1 Change `affectsAllModels` in `src/domain/calc.ts` from `(option: UpgradeOption) => boolean` to `(section: UpgradeSection) => boolean`, implemented as a whole-word match for "all" in `section.title` (`/\ball\b/i`)
- [x] 1.2 Update `wholeUnitOptionIds(faction)` to flat-map `(group, section)` pairs, filter by `affectsAllModels(section)`, and collect option ids from only the matching sections
- [x] 1.3 Add a `findSectionForOption(faction, optionId)` (or equivalent) helper in `src/domain/calc.ts` for callers that only have an option id and need its containing section — covered by the existing `findSection(faction, optionId)` helper, already used by `toggleUpgrade`

## 2. Store updates

- [x] 2.1 Update `src/stores/lists.ts`'s combined-pair whole-unit sync (`combineUnits`'s union step and `toggleUpgrade`'s dual-write) to resolve the option's containing section via the task 1.3 helper and call `affectsAllModels(section)` instead of `affectsAllModels(option)`
- [x] 2.2 Update `validate()`'s combined-pair whole-unit mismatch check (from `infantry-combine-and-attach` task 4.9) to use the corrected classification — no direct call site, it already goes through `wholeUnitOptionIds` which is fixed by 1.2

## 3. Builder UI

- [x] 3.1 In `src/components/EntryUpgradeControls.vue`, update `optionsFor(section)` to filter using `affectsAllModels(section)` (section-level) instead of per-option
- [x] 3.2 Add a `hasVisibleContent(group)` check (`group.sections.some(s => optionsFor(s).length > 0)`) and gate the group's outer `<div class="mt-2 border-t … pt-2">` wrapper on it, so a group with nothing to show under the current `filter` renders nothing

## 4. Tests

- [x] 4.1 Update `src/domain/calc.test.ts`'s `affectsAllModels` tests to the new section-based signature, covering: an "all"-titled section (true), a "one"-titled section with an equipment-swap option (false), and a "one"-titled section with a pure rule-grant option and no equipment effect (false — the previously-mismatched case)
- [x] 4.2 Rewrite `src/domain/infantry-audit.test.ts`'s database-wide audit to assert, across all 16 faction files: no `/\ball\b/i`-titled section contains a `removeOneEquipment`-bearing option, no `/\ball\b/i`-titled section is misclassified as per-model, and spot-check the specific previously-miscategorized options identified during investigation (Space Marines' Narthecium/Battle Standard, Orks' Kustom Force Field/Shokk Attack Gun, Space Marines' unqualified `Replace Machinegun`) are now classified per-model
- [x] 4.3 Update `src/stores/lists.test.ts`'s combine/toggle tests to cover a combined pair where a single-model rule-grant option (no equipment effect, non-"all" section) is selected on only one entry and stays independent, alongside the existing whole-unit-sync coverage
- [x] 4.4 Add/update a component test for `EntryUpgradeControls.vue` (or the relevant `src/views/integration.test.ts` case) asserting a combined pair's whole-unit panel renders no divider/heading for a group with zero whole-unit options
- [x] 4.5 Manually run the app: combine two Tactical Marines squads, confirm "Replace all Assault Rifles" is a single shared toggle while "Upgrade one model with one" (Narthecium/Battle Standard) is independently selectable per entry, and confirm the whole-unit upgrade panel no longer shows a stack of empty divider rows — verified via Playwright against the running dev server; whole-unit panel shows exactly "D. Upgrade all models with any" and "F. Replace all Assault Rifles" with clean spacing, no console errors
- [x] 4.6 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions — 140/140 tests pass, `tsc --noEmit` clean, `npm run build` succeeds
