## 1. Domain model

- [x] 1.1 Add `UpgradeSection` to `src/domain/types.ts`; change `UpgradeGroup` to `{ id, sections: UpgradeSection[] }`; update `UpgradeSelection` to `'one' | 'any' | 'upToTwo' | 'upToThree' | 'upToFour'` (drop `'replace'`/`'all'`)
- [x] 1.2 Update `src/data/factions/helpers.ts`: replace `group()`'s flat `(id, title, selection, options)` signature with a section-based one (new `section(title, selection, options)` helper; `group(id, sections)` assembles them), keeping the `${groupId}.${runningIndex}` option-id scheme flattened across sections

## 2. Domain logic

- [x] 2.1 Update `optionIndex()`/`applyUpgrades()` in `src/domain/calc.ts` to flatten `group.sections.flatMap(s => s.options)`
- [x] 2.2 Add a `findSection(faction, optionId)` helper (or equivalent) that returns the owning `UpgradeGroup`/`UpgradeSection` for a given option id
- [x] 2.3 Add a `maxPicks(selection)` helper mapping `one → 1`, `upToTwo → 2`, `upToThree → 3`, `upToFour → 4`, `any → Infinity`

## 3. Store enforcement

- [x] 3.1 Update `toggleUpgrade` in `src/stores/lists.ts` to: always allow deselect; for `one` sections, deselect any other selected sibling before adding the new selection; for capped sections, no-op the toggle-on once the section is at its limit
- [x] 3.2 Update `validateImported` in `src/stores/lists.ts` to reject an imported list whose `selectedUpgrades` selects more options in one section than that section's limit allows, with an error naming the unit and section

## 4. Builder UI

- [x] 4.1 Update `BuilderView.vue` to iterate each group's `sections` and render each section's own title as a sub-heading
- [x] 4.2 Render `one`-selection sections as mutually-exclusive radio inputs (grouped by `instanceId` + group id + section index)
- [x] 4.3 Render capped sections (`upToTwo`/`upToThree`/`upToFour`) as checkboxes that disable remaining unselected options once the section's limit is reached
- [x] 4.4 Keep `any`-selection sections as unconstrained checkboxes (current behavior)

## 5. Faction data re-transcription (source of truth: `one-page-40k-army-lists.html`, cross-checked against the PDF for costs/effects)

- [x] 5.1 Space Marines (`space-marines.ts`)
- [x] 5.2 Imperial Guard / Astra Militarum (`imperial-guard.ts`)
- [x] 5.3 Orks (`orks.ts`)
- [x] 5.4 Eldar (`eldar.ts`)
- [x] 5.5 Chaos Space Marines (`chaos-space-marines.ts`)
- [x] 5.6 Tau (`tau.ts`)
- [x] 5.7 Necrons (`necrons.ts`)
- [x] 5.8 Tyranids (`tyranids.ts`)
- [x] 5.9 Dark Eldar (`dark-eldar.ts`)
- [x] 5.10 Chaos Daemons (`chaos-daemons.ts`)
- [x] 5.11 Space Marine Chapters (`space-marine-chapters.ts`)
- [x] 5.12 Sisters of Battle / Adepta Sororitas (`sisters-of-battle.ts`)
- [x] 5.13 Inquisition (`inquisition.ts`)
- [x] 5.14 Harlequins (`harlequins.ts`)
- [x] 5.15 Adeptus Mechanicus / Skitarii (`adeptus-mechanicus.ts`)
- [x] 5.16 Genestealer Cult (`genestealer-cult.ts`)

## 6. Tests

- [x] 6.1 Update `src/domain/calc.test.ts` and `src/data/factions/helpers.test.ts` fixtures/assertions for the new section-based group shape and option ids
- [x] 6.2 Add unit tests for `toggleUpgrade` enforcement: radio behavior in `one` sections, cap rejection in `upToTwo`/`upToThree`/`upToFour` sections, unconstrained `any` sections
- [x] 6.3 Update `src/stores/lists.test.ts` for the new `validateImported` section-cap rejection case
- [x] 6.4 Update `src/data/index.test.ts` (or add coverage) so every faction's upgrade groups pass a structural check: every option id is unique, every section has at least one option, no section's selection limit is `one` with zero options

## 7. Verification

- [x] 7.1 Run the full test suite and type-check (`vue-tsc`/`tsc`) to confirm no regressions
- [x] 7.2 Manually exercise the builder for at least 3 factions (e.g. Space Marines, Tau, Necrons): confirm `one` sections behave as radio groups, capped sections disable extra checkboxes at the limit, and totals/points update correctly
- [x] 7.3 Spot-check 5+ re-transcribed groups per faction against `one-page-40k-army-lists.html` to confirm section titles, selection limits, and option costs all match
