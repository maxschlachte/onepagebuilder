## 1. Domain model

- [x] 1.1 Add `SectionPrerequisite` to `src/domain/types.ts` (`blockedBySelecting`, `blockedBySelectingOnSingleModel`, `requiresOneOfSelected`) and an optional `prerequisite?: SectionPrerequisite` field on `UpgradeSection`
- [x] 1.2 Update `src/data/factions/helpers.ts`'s `section()` helper to accept an optional prerequisite argument

## 2. Domain logic

- [x] 2.1 Add `isSectionAvailable(unit, section, selectedUpgradeIds)` to `src/domain/calc.ts`, evaluating all three prerequisite clauses (with `blockedBySelectingOnSingleModel` gated on `unit.size === 1`)
- [x] 2.2 Add `pruneInvalidSelections(faction, unit, selectedUpgradeIds)`: the fixed-point set of selected upgrades that remain valid for a unit (repeatedly drop ids whose owning section is unavailable given the current set, until a pass removes nothing)

## 3. Store enforcement

- [x] 3.1 Update `toggleUpgrade` in `src/stores/lists.ts` to reject selecting an option whose section is currently unavailable
- [x] 3.2 After every toggle (select or deselect), run the fixed-point cascade so any now-invalid selections elsewhere on the same unit are cleared
- [x] 3.3 Update `validateImported` to reject a list where a selected option's section prerequisite isn't satisfied by the unit's other selections, naming the unit and the unmet requirement

## 4. Builder UI

- [x] 4.1 In `BuilderView.vue`, compute per-section availability (via `isSectionAvailable`) and disable that section's option controls when unavailable
- [x] 4.2 Show a short inline reason under an unavailable section's title (derived from the prerequisite, e.g. naming the blocking or required option's label)

## 5. Faction-by-faction prerequisite identification (cross-checked against `one-page-40k-army-lists.html`; annotate only where a real dependency exists)

- [x] 5.1 Space Marines — group A "Take one Assault Rifle attachment" now blocked (single-model) by its own "Replace one Assault Rifle" options, and blocked (any size) by group F's "Replace all Assault Rifles" — a genuine cross-group case, which prompted resolving prerequisite labels faction-wide (not just within one group) in `helpers.ts`
- [x] 5.2 Imperial Guard / Astra Militarum — reviewed; no group has a real cross-section dependency (Pistol/Medium CCW are always baseline where replaced)
- [x] 5.3 Orks — group A's "Take one Carbine attachment" does depend on "Replace one Pistol" producing a Carbine, but **left unannotated**: group A is shared with Meganobz/Warbikers/Nob Bikers, who already carry a baseline Carbine, so a section-level prerequisite would incorrectly lock the attachment for them (noted in a code comment)
- [x] 5.4 Eldar — reviewed; no attachment/produced-item dependency found
- [x] 5.5 Chaos Space Marines — group B "Take one Assault Rifle attachment" blocked (single-model) by its own "Replace one Assault Rifle" options; group O "Equip with one Pintle Mount attachment" requires the "Pintle Mount (Linked Assault Rifle)" option from its own "Take any" section; group M reviewed — no dependency (nothing removes the baseline Powerfist)
- [x] 5.6 Tau — reviewed; no dependency found
- [x] 5.7 Necrons — reviewed; no dependency found
- [x] 5.8 Tyranids — reviewed group N ("Replace Pistol"); Termagants already have baseline Pistols, no dependency needed
- [x] 5.9 Dark Eldar — reviewed groups E/J; all units sharing them have baseline Pistols, no dependency needed
- [x] 5.10 Chaos Daemons — reviewed; no dependency found
- [x] 5.11 Space Marine Chapters — group A "Take one Assault Rifle attachment" requires the "Assault Rifle" option from its own "Take one" section (baseline is a bare Medium CCW)
- [x] 5.12 Sisters of Battle — group A "Replace Pistol" requires a Pistol-producing option from "Replace one Assault Rifle"; "Take one Assault Rifle attachment" blocked (single-model) by the same section's options
- [x] 5.13 Inquisition — group A "Take one Assault Rifle attachment" requires the "Assault Rifle"/"Linked Assault Rifle" options from "Replace Pistol" (baseline is a bare Pistol)
- [x] 5.14 Harlequins — reviewed; no dependency found (Shadowseer already has a baseline Pistol)
- [x] 5.15 Adeptus Mechanicus / Skitarii — reviewed; no dependency found
- [x] 5.16 Genestealer Cult — reviewed; no dependency found

## 6. Tests

- [x] 6.1 Unit tests for `isSectionAvailable`: single-model block, multi-model non-block, cross-group "replace all" block, requires-one-of-selected (met and unmet)
- [x] 6.2 Unit tests for `pruneInvalidSelections` (direct invalidation and a no-op case)
- [x] 6.3 Store tests: rejecting a toggle into an unavailable section; cascading deselect after an earlier selection is changed
- [x] 6.4 `validateImported` test: reject an import violating a prerequisite
- [x] 6.5 Structural test in `index.test.ts`: every option id referenced by any section's `prerequisite` resolves to a real option in the same faction

## 7. Verification

- [x] 7.1 Run the full test suite and type-check to confirm no regressions (51/51 tests pass, clean type-check)
- [x] 7.2 Manually exercised the builder (Playwright): Space Marines Captain (single-model) — replacing its Assault Rifle disables "Take one Assault Rifle attachment" with the reason "Unavailable — Stormbolter (24”, A2) selected"; Tactical Marines (multi-model) — the same replacement leaves the attachment section available
- [x] 7.3 Manually verified the produced-item case: Sisters of Battle Canoness's "Replace Pistol" shows "Requires: Pistol and Medium CCW or Pistol and Powersword", is locked until picked, unlocks once picked, and deselecting the pistol-producing option auto-clears the already-selected Pistol upgrade (cascade)
