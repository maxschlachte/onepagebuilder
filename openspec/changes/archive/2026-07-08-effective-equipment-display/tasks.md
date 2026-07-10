## 1. Domain model

- [x] 1.1 Add `removeEquipmentOnSingleModel?: string[]` to `UpgradeEffect` in `src/domain/types.ts`, documented per the design (applied only when `unit.size === 1`)
- [x] 1.2 Add `removeEquipmentOnSingleModel?: string[]` to `OptionInput` in `src/data/factions/helpers.ts`; have `option()` populate `effects.removeEquipmentOnSingleModel` from it (parsed the same way as `removeEquipment` — a list of literal labels, no `eqEntry` parsing needed since it references existing equipment, not new)

## 2. Domain logic

- [x] 2.1 Update `applyUpgrades` in `src/domain/calc.ts` to filter out `effects.removeEquipmentOnSingleModel` labels only when `unit.size === 1`, applied alongside the existing unconditional `removeEquipment` filter, before `addEquipment` is appended

## 3. Domain tests

- [x] 3.1 `calc.test.ts`: a "replace one X" option (with `removeEquipmentOnSingleModel` + `addEquipment`) on a single-model unit removes X and adds the new weapon
- [x] 3.2 `calc.test.ts`: the same option on a multi-model unit leaves X in place and only adds the new weapon
- [x] 3.3 `calc.test.ts`: a "replace all X" option (`removeEquipment` unconditional) removes X regardless of unit size
- [x] 3.4 `helpers.test.ts`: `option()` correctly builds `effects.removeEquipmentOnSingleModel` from `OptionInput.removeEquipmentOnSingleModel`

## 4. Faction-by-faction equipment-effect audit

For each faction below: identify every upgrade option whose printed effect adds, removes, or replaces a weapon (cross-check against `one-page-40k-army-lists.html` where helpful), and author `addEquipment`/`removeEquipment`/`removeEquipmentOnSingleModel` per the design's authoring rule. Leave pure rule-grant options (no weapon change) untouched. Record any single-model-multi-copy edge cases found (Deff Dred-shaped: a size-1 unit whose baseline already carries `Nx <weapon>`) and treat them as pure additions (no removal), per design.

- [x] 4.1 Space Marines (`space-marines.ts`)
- [x] 4.2 Imperial Guard / Astra Militarum (`imperial-guard.ts`)
- [x] 4.3 Orks (`orks.ts`) — including the group A Carbine/Linked Carbine replacement already given prerequisites in a prior change
- [x] 4.4 Eldar (`eldar.ts`)
- [x] 4.5 Chaos Space Marines (`chaos-space-marines.ts`)
- [x] 4.6 Tau (`tau.ts`)
- [x] 4.7 Necrons (`necrons.ts`)
- [x] 4.8 Tyranids (`tyranids.ts`)
- [x] 4.9 Dark Eldar (`dark-eldar.ts`)
- [x] 4.10 Chaos Daemons (`chaos-daemons.ts`)
- [x] 4.11 Space Marine Chapters (`space-marine-chapters.ts`)
- [x] 4.12 Sisters of Battle / Adepta Sororitas (`sisters-of-battle.ts`)
- [x] 4.13 Inquisition (`inquisition.ts`)
- [x] 4.14 Harlequins (`harlequins.ts`)
- [x] 4.15 Adeptus Mechanicus / Skitarii (`adeptus-mechanicus.ts`)
- [x] 4.16 Genestealer Cult (`genestealer-cult.ts`)

Known follow-up (not fixed in this change, no regression — these options simply carry no equipment effect, same as before): several options across Space Marines, Imperial Guard, Necrons, Tyranids, and Eldar name a weapon via a nested-parenthetical label (e.g. `Hunter-Killer Missile (Missile Launcher (Limited))`, `Pintle Mount (Stormbolter (24”, A2))`, `Gauntlet of Fire (Flamer)`, `Ghost Glaive (Rending in Melee)`). `eqEntry`'s parser (`src/data/factions/helpers.ts`) doesn't handle nested parens — it would produce a non-resolving rule chip instead of a real weapon profile — so these were deliberately left without `addEquipment` rather than authoring a broken display. Fixing `eqEntry` to handle nested profiles is a separate, self-contained follow-up.

## 5. Structural tests

- [x] 5.1 `index.test.ts`: every label in an option's `removeEquipment`/`removeEquipmentOnSingleModel` matches a baseline equipment label on some unit that can reach the option's group, so a typo'd label fails at test time
- [x] 5.2 `index.test.ts`: every `addEquipment` label is traceable (global weapon name, baseline label, another option's label, or a substring of its own option's label) rather than fabricated — revised from "resolves a weapon profile" after discovering that's not actually true even for pre-existing baseline melee/`Linked X` entries (see note in the test)

These two tests surfaced 7 real, newly-consequential bugs (previously harmless when upgrades only affected cost — now visible because equipment effects are wired up): six "produce X, then modify X" chains missing their cross-section `requiresOneOfSelected` prerequisite (Space Marines group A "Replace one Medium CCW", Imperial Guard group A same, Eldar group E same, Chaos Space Marines group B same, Dark Eldar group T "Replace Medium CCW", Tau group L "Replace Missile Pod"), and one cross-group case (Space Marines group H "Replace one Stormbolter" needed both `requiresOneOfSelected` pointing at group A's Stormbolter option and `satisfiedByEquipment` for Terminators, who carry Stormbolters at baseline via group H alone) — all fixed by adding the missing prerequisite, matching the established `upgrade-prerequisites` pattern.

## 6. Verification

- [x] 6.1 Run the full test suite and type-check; confirm no regressions (63/63 tests pass, clean type-check)
- [x] 6.2 Manually exercised the builder (Playwright against the dev server) across all 16 factions: for each, added one single-model and one multi-model unit (where available) and toggled available options. 26/32 sampled units showed the "Equipment:" list actually change; the other 6 correctly had no equipment-changing option available (units with `upgrades: '-'`, or factions like Chaos Daemons/Genestealer Cult where the audit deliberately left rule-only options untouched) — confirmed against source, not bugs. Verified stats render in brackets and special-rule chips show tooltips (pre-existing `RuleChips`/`RuleTooltip`, unaffected). Zero console errors across the full run.
- [x] 6.3 Manually checked the print view (Space Marines Captain, Assault Rifle → Stormbolter): print view now shows "Stormbolter (24”, A2)" instead of the baseline Assault Rifle, confirming `applyUpgrades`'s output flows through correctly.

### Bonus fix found during verification (outside the original task list)

Discovered a pre-existing display bug while checking the print view: when an equipment label already embeds its own stat profile in parentheses (e.g. `Stormbolter (24”, A2)`), both `EquipmentList.vue` (builder) and `PrintView.vue`'s independent `weaponLine()` unconditionally appended a *second*, redundant bracket — rendering `Stormbolter (24”, A2)(24", A2)`. This predates this change (reproducible with baseline-only data, e.g. Terminators) but became far more visible once many more `addEquipment` entries started using the same "name (stats)" label convention. Fixed in both places by skipping the appended bracket when the label's own trailing parenthetical already matches a profile pattern; updated one pre-existing test (`integration.test.ts`) whose assertion had accidentally depended on the duplicate (a straight-quote `48"` substring that only existed via the redundant append, when the label itself uses a curly `”`).
