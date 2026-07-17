## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change.

## 2. Domain type and authoring helper

- [x] 2.1 In `src/domain/types.ts`, add `oncePerUnit?: boolean` to `UpgradeSection`, documented as: true when this section's options are capped at one grant per unit regardless of model count, even though the section's own printed title doesn't say "all" (e.g. Warhammer Fantasy's Sergeant/Musician/Standard "Upgrade with:" sections).
- [x] 2.2 In `src/domain/calc.ts` (where `EffectiveUnit` actually lives, not `types.ts`), add `selectedUpgradeIds: string[]` to `EffectiveUnit`, documented as: the selected option ids that resolved to a real option, in `applyUpgrades`'s iteration order — mirrors `upgradeLabels` but as ids, for callers (`combinedEffectiveUnit`) that need to look up an option's own cost/section rather than just its display label.
- [x] 2.3 In `src/data/factions/helpers.ts`, add `oncePerUnit?: boolean` to `SectionInput`.
- [x] 2.4 In `src/data/factions/helpers.ts`, change `section()`'s 4th parameter from a bare `prerequisite?: SectionPrerequisiteInput` to an options bag `opts?: { prerequisite?: SectionPrerequisiteInput; oncePerUnit?: boolean }`, returning `{ title, selection, options, prerequisite: opts?.prerequisite, oncePerUnit: opts?.oncePerUnit }`.
- [x] 2.5 Update every existing call site that passes a bare `SectionPrerequisiteInput` as `section()`'s 4th argument to wrap it in `{ prerequisite: {...} }`. The actual footprint was much larger than originally scoped (23 call sites across 12 files, not 6 across 5) — the original survey's grep pattern only matched the fantasy files' single-line formatting style and missed the 40k faction files' multi-line/single-quote style. Fixed in both: `src/data/factions/fantasy/{ogre-kingdoms,tomb-kings,dark-elves,vampire-counts (×2),warriors-of-chaos}.ts` and `src/data/factions/40k/{chaos-daemons (×2),chaos-space-marines (×4),dark-eldar,eldar,harlequins,imperial-guard (×2),inquisition,orks (×2),sisters-of-battle (×2),space-marine-chapters,space-marines (×5),tau}.ts`.
- [x] 2.6 In `src/data/factions/helpers.ts`, in `group()`'s section-building loop, copy `s.oncePerUnit` onto the built `UpgradeSection` alongside the existing `title`/`selection`/`options` copy (omit when falsy, matching the codebase's existing convention for optional fields).
- [x] 2.7 Run `vue-tsc --noEmit` to confirm the `section()` signature change compiles cleanly across every call site (no call site left passing the old bare-prerequisite shape).

## 3. Domain logic (`calc.ts`)

- [x] 3.1 Extend `affectsAllModels(section)` to `return section.oncePerUnit === true || /\ball\b/i.test(section.title)`.
- [x] 3.2 Add `oncePerUnitOptionIds(faction): Set<string>`, parallel in shape to `wholeUnitOptionIds`, filtered to sections where `section.oncePerUnit === true`, collecting their options' ids.
- [x] 3.3 In `applyUpgrades`, populate `selectedUpgradeIds` by pushing `id` in the same loop that already pushes `option.label` onto `upgradeLabels`, and include it in the returned `EffectiveUnit`.
- [x] 3.4 Change `combinedEffectiveUnit`'s signature to `combinedEffectiveUnit(a: EffectiveUnit, b: EffectiveUnit, faction: Faction): CombinedUnit`. Compute `onceIds = oncePerUnitOptionIds(faction)`, find option ids present in both `a.selectedUpgradeIds` and `b.selectedUpgradeIds` that are in `onceIds`, sum their `costDelta` via a lookup through the same `optionIndex(faction)` map `applyUpgrades` already builds, and subtract that sum from `a.cost + b.cost` when computing the returned `cost`.
- [x] 3.5 Update `src/views/PrintView.vue`'s `combinedEffectiveUnit(effA, effB)` call to pass the in-scope `faction.value!` as a third argument.
- [x] 3.6 Update `src/views/BuilderView.vue`'s `combinedEffectiveUnit(effA, effB)` call to pass the in-scope `faction.value!` as a third argument.

## 4. Test coverage for the domain logic

- [x] 4.1 In `src/domain/calc.test.ts`, update `combinedEffectiveUnit`'s existing 5 tests to pass the relevant faction (`sm`) as a third argument.
- [x] 4.2 Add a `combinedEffectiveUnit` test: given a synthetic faction with a `oncePerUnit: true` section containing one option, when both `a` and `b` independently select that option, the combined cost includes the option's `costDelta` exactly once (not twice), while `upgradeLabels` still shows it once (already covered by existing dedup logic) — asserting the fix's exact bug scenario.
- [x] 4.3 Add a `combinedEffectiveUnit` test: when only `a` selects a `oncePerUnit`-flagged option (not `b`), the combined cost still includes the option's `costDelta` exactly once (the asymmetric case is unaffected by the new subtraction).
- [x] 4.4 Add an `affectsAllModels`/`wholeUnitOptionIds` test in `src/domain/calc.test.ts` confirming a `oncePerUnit: true` section's options are included in both `wholeUnitOptionIds` and `oncePerUnitOptionIds`.

## 5. Mark the Sergeant/Musician/Standard section (`oncePerUnit: true`)

For each of the 16 Warhammer Fantasy faction files, add `{ oncePerUnit: true }` as `section()`'s 4th argument on its Sergeant/Musician/Standard `"Upgrade with:"` section.

- [x] 5.1 `src/data/factions/fantasy/empire.ts` (group F)
- [x] 5.2 `src/data/factions/fantasy/orcs.ts` (group C)
- [x] 5.3 `src/data/factions/fantasy/goblins.ts` (group C)
- [x] 5.4 `src/data/factions/fantasy/high-elves.ts` (group C)
- [x] 5.5 `src/data/factions/fantasy/warriors-of-chaos.ts` (group C)
- [x] 5.6 `src/data/factions/fantasy/dwarfs.ts` (group B)
- [x] 5.7 `src/data/factions/fantasy/skaven.ts` (group D)
- [x] 5.8 `src/data/factions/fantasy/lizardmen.ts` (group C)
- [x] 5.9 `src/data/factions/fantasy/ogre-kingdoms.ts` (group E)
- [x] 5.10 `src/data/factions/fantasy/dark-elves.ts` (group C)
- [x] 5.11 `src/data/factions/fantasy/tomb-kings.ts` (group C)
- [x] 5.12 `src/data/factions/fantasy/vampire-counts.ts` (group D)
- [x] 5.13 `src/data/factions/fantasy/bretonnia.ts` (group E)
- [x] 5.14 `src/data/factions/fantasy/beastmen.ts` (group D)
- [x] 5.15 `src/data/factions/fantasy/wood-elves.ts` (group E)
- [x] 5.16 `src/data/factions/fantasy/daemons-of-chaos.ts` (group C)

## 6. Regression audit

- [x] 6.1 In `src/domain/infantry-audit.test.ts`, add a check that every faction's Sergeant/Musician/Standard-granting section (identified structurally, by its options being exactly {Sergeant, Musician, Standard}) reports `oncePerUnit: true` and that `affectsAllModels()` returns `true` for it. Also added a count check (exactly 16, one per Warhammer Fantasy faction).
- [x] 6.2 In the same file, add a check that no *other* section (regardless of title) is accidentally marked `oncePerUnit: true` — guarding against the flag leaking onto an unrelated per-model section.

## 7. Final verification

- [x] 7.1 Run the full test suite; fix any failures. (260/260 pass)
- [x] 7.2 Run `vue-tsc --noEmit` and `vite build`; fix any type errors. (both clean)
- [x] 7.3 Spot-check via a component test: mounted `PrintView` for two Empire "State Troops" entries, each with Sergeant independently selected, combined them via `store.combineUnits`, and confirmed the combined pair's displayed cost is 125pts (60+60+5, Sergeant charged once) rather than 130pts (the pre-fix double-charge).

## 8. Follow-up: equipment count was still doubled (found after 7.3)

Post-implementation review found that while task 3.4's cost fix was correct, `combinedEffectiveUnit`'s equipment-merge step had the identical double-counting bug independently: it sums `unitCount` from both linked entries unconditionally, so a mirrored `oncePerUnit` option's granted equipment (e.g. the Sergeant `gear()` entry) still displayed as `unitCount: 2` ("2x Sergeant") even after cost was fixed, since equipment merging and cost computation are separate code paths in the same function.

- [x] 8.1 Update the `specs/army-list-management/spec.md` delta: extend the "Combine Infantry units..." requirement text to also cover equipment count, and add a new scenario "A once-per-unit upgrade's equipment is shown once for a combined pair".
- [x] 8.2 Add design.md Decision 4 documenting the equipment-merge fix and why `Math.max(countA, countB)` (not a hardcoded 1) is correct.
- [x] 8.3 In `combinedEffectiveUnit`, compute `onceEquipmentKeys` — the `equipmentMergeKey`s of every `addEquipment` entry belonging to a double-counted `oncePerUnit` option (reusing the `doubleCounted` list from the cost fix) — and use `Math.max(countA, countB)` instead of `countA + countB` when merging an equipment entry whose merge key is in that set.
- [x] 8.4 Add regression coverage in `src/domain/calc.test.ts`: a `oncePerUnit` option's granted equipment merges to `unitCount: 1` (not 2) when both entries independently selected it, and stays `unitCount: 1` in the asymmetric (only one entry selected it) case too.
- [x] 8.5 Re-run the full test suite, `vue-tsc --noEmit`, and `vite build`; confirm all pass. (261/261 tests, both clean)

## 9. Follow-up: splitting a combined pair duplicated the upgrade onto both halves (found by user testing)

User-reported bug: combine two Empire Greatswords entries, select Sergeant (+5pts), then split the pair — both resulting independent units kept Sergeant, each now charged individually, when only one should. Root cause: Decisions 1/3/4 mirrored a `oncePerUnit` option's selection onto *both* linked entries and corrected the combined pair's display (cost, equipment count) after the fact — but a genuine whole-unit option like "Replace all Assault Rifles" is correctly duplicated on split (each half really did get its own replaced rifles), and a `oncePerUnit` option is not: it's a single grant to the whole unit with nothing to duplicate. This was a real gap in Decisions 3/4's test coverage, which only checked the *combined* pair, never the post-split state.

- [x] 9.1 Update the `specs/army-list-management/spec.md` delta: rewrite the requirement text's "selected identically on both entries" clause to carve out `oncePerUnit` options (recorded on at most one entry, never both), and rewrite/add scenarios: "A once-per-unit upgrade is charged only once" (now framed around single-entry storage, not mirror-then-correct), "Combining two entries that each already independently selected the same once-per-unit option collapses to one", and a new "Splitting a combined pair leaves a once-per-unit upgrade on only the entry that held it".
- [x] 9.2 Add design.md Decision 5 documenting the supersession of Decisions 1/3/4's mirror approach, why the "Replace all X" analogy was wrong for this case, and why Decisions 3/4's `combinedEffectiveUnit` corrections are kept (as a defensive no-op for fresh selections, still useful for pre-existing saved-list data).
- [x] 9.3 In `src/stores/lists.ts`, `combineUnits`: split `wholeUnitOptionIds` into "genuine whole-unit" (mirrored onto both, as before) and `oncePerUnitOptionIds` (collapsed onto entry `a` only, even if selected on both pre-combine).
- [x] 9.4 In `src/stores/lists.ts`, `toggleUpgrade`: for a combined pair and a `oncePerUnit` section, branch away from the existing dual-`applyToggle` path — select adds to the toggled entry only; deselect removes from both entries unconditionally (wherever it lives).
- [x] 9.5 Confirm `splitUnits` needs no code change (verified: since the option now lives on only one entry pre-split, its existing behavior of just clearing `combinedWith` already does the right thing).
- [x] 9.6 Add regression coverage in `src/stores/lists.test.ts`: selecting via the whole-unit panel writes to one entry only; deselecting clears it from wherever it lives; combining two entries that each already independently selected it collapses to one; splitting after selecting leaves it on only the entry that holds it (the exact reported bug).
- [x] 9.7 Re-run the full test suite, `vue-tsc --noEmit`, and `vite build`; confirm all pass. (265/265 tests, both clean)
