## 1. Dark Eldar: Group L equipment bug

- [x] 1.1 In `src/data/factions/dark-eldar.ts` group L, remove `removeOneEquipment: ['Disintegrator Cannon (36”, A3p)']` from the Dark Lance option so it becomes addition-only, matching the established single-model/multi-copy pattern (Deff Dred, Wraithlord, Wraithknight, Voidweaver, Starweaver).
- [x] 1.2 Replace the group L inline comment (which incorrectly claims a "label mismatch" protects the Ravager) with one explaining the addition-only rationale, consistent with the comments already used for the analogous cases in `eldar.ts`/`harlequins.ts`.
- [x] 1.3 Add a regression check (unit test or extend an existing audit test) asserting that selecting the group L option on the Ravager leaves its `3x Disintegrator Cannons` entry intact and adds exactly one Dark Lance.

## 2. Dark Eldar: missing rule effects

- [x] 2.1 Group H `Chain-Snares (Impact(+D3))`: add `adds: ['Impact(+D3)']`.
- [x] 2.2 Group H `Night Shields (Stealth)`: add `adds: ['Stealth']`.
- [x] 2.3 Group H `Aeathersails`: fix the label typo to `Aethersails` (matching the file's own `armyRule` definition) and add `adds: ['Aethersails']`.
- [x] 2.4 Group U `Cluster Caltrops (Impact(+D6))`: add `adds: ['Impact(+D6)']`.

## 3. Cross-faction missing-adds: high confidence

(Exact rule name already proven via bare `adds` elsewhere in the codebase, or matches the faction's own `armyRule` definition.)

- [x] 3.1 `chaos-daemons.ts` group D `Locus of Abjuration (Fearless)`: add `adds: ['Fearless']`.
- [x] 3.2 `chaos-daemons.ts` group D `Locus of Fecundity (Regeneration)`: add `adds: ['Regeneration']`.
- [x] 3.3 `chaos-daemons.ts` group G `Locus of Grace (Strider)`: add `adds: ['Strider']`.
- [x] 3.4 `chaos-daemons.ts` group E `Chaos Icon (Beacon)`: add `adds: ['Beacon']`.
- [x] 3.5 `necrons.ts` group K `Shadowlooms`: add `adds: ['Shadowloom']` (note singular armyRule vs. plural option label — keep the label as printed, add the singular rule id).
- [x] 3.6 `imperial-guard.ts` group O `Demolitions (Demo Charge)`: add `adds: ['Demo Charge']`.
- [x] 3.7 `inquisition.ts` group B `3x Servo Skull`: add `adds: ['Servo-Skull']` (check exact armyRule spelling in the same file before committing the id).
- [x] 3.8 `orks.ts` group K `Grot Riggers (Mek Tools)`: add `adds: ['Mek Tools']`.
- [x] 3.9 `orks.ts` group C `Deff Rolla (Reinforced Ram, Impact(+D6))`: add `adds: ['Reinforced Ram', 'Impact(+D6)']` — the option's own inline comment already claims it grants these; the code just never did.
- [x] 3.10 `tyranids.ts` group C `Adrenal Glands (Furious)`: add `adds: ['Furious']`.
- [x] 3.11 `tyranids.ts` group L `Adrenal Glands (Furious)`: add `adds: ['Furious']`.

## 4. Cross-faction missing-adds: moderate confidence

(Clean bare rule token, delta-param mechanism already proven elsewhere, but this exact word/param combination has no prior instance — verify each resolves sensibly via `parseRule` before committing.)

- [x] 4.1 `chaos-daemons.ts` group D `Locus of Contagion (Impact(1))`: add `adds: ['Impact(1)']`.
- [x] 4.2 `chaos-daemons.ts` group P `Shredder (Impact(+D3))`: add `adds: ['Impact(+D3)']`.
- [x] 4.3 `chaos-daemons.ts` group P `Flyer (Impact(+D6))`: add `adds: ['Impact(+D6)']`.
- [x] 4.4 `chaos-daemons.ts` group G `Locus of Swiftness (Fear)`: add `adds: ['Fear']`.
- [x] 4.5 `necrons.ts` group G `Whip Coils (Fear)`: add `adds: ['Fear']`.
- [x] 4.6 `orks.ts` group K `Wreckin' Ball (Impact(+D6))`: add `adds: ['Impact(+D6)']`.
- [x] 4.7 `space-marine-chapters.ts` group C `Death Masks (Fear)`: add `adds: ['Fear']`.

## 5. Ambiguous cases: resolve with a judgment call, don't apply mechanically

- [x] 5.1 `chaos-daemons.ts`: decide whether `Locus of Wrath (Linked)`, `Locus of Beguilement (Linked)`, and `Locus of Virulence (Rending)` are meant as unit-wide grants or melee-only (sibling option `Warpsword (Linked in Melee)` in the same file deliberately leaves the melee-qualified phrasing unwired) — apply `adds` only if a unit-wide reading is correct, otherwise leave as-is with a comment explaining why, matching the file's existing convention for melee-qualified no-ops.
- [x] 5.2 `necrons.ts`: decide the correct fix for `Nebuloscope(s) (Ignores Cover)` (groups A & K) — likely needs re-issuing the relevant weapon (e.g. Staff of Light) with the rule attached via `addEquipment`'s `rules:`, following the pattern in `eldar.ts` group G, rather than a bare `adds` (no precedent exists for "Ignores Cover" as a unit-wide rule).

## 6. Infer weapon stats in the upgrade picker: shared formatter + UI

- [x] 6.1 Extract `EquipmentList.vue`'s `profile()` range/attacks formatter into a shared module (e.g. `src/domain/format.ts`) as `formatWeaponProfile(weapon: Weapon): string`; update `EquipmentList.vue` to import it, no behavior change there.
- [x] 6.2 In `EntryUpgradeControls.vue`, for each rendered option, iterate `opt.effects?.addEquipment` and render each entry's `formatWeaponProfile(entry.weapon)` bracket plus `RuleChips` for `entry.weapon.rules` next to the (now stats-free) label — matching `EquipmentList.vue`'s visual presentation. Options with no `addEquipment`, or whose `addEquipment` entries have no `.weapon`, render no stats block (unchanged from today).
- [x] 6.3 Verify this rendering applies to both the selected-unit upgrade panel and the read-only roster "Details" panel, since both use `EntryUpgradeControls.vue`.

## 7. Infer weapon stats: audit test enforcing the label convention

- [x] 7.1 Add a test (e.g. `src/data/label-profile-audit.test.ts`) that walks every `UpgradeOption.label` across all 16 faction files and fails if any parenthetical matches the weapon-profile heuristic already used by `equipmentKeyOf`'s `looksLikeProfile` in `helpers.ts` (a quoted range or an `A<digits/D>` attacks token).
- [x] 7.2 Extend the same test to assert, for any option whose label lists N comma-separated weapon-name fragments, that `addEquipment` contains at least N entries carrying a `.weapon` profile — catching a future label/equipment ordering or count mismatch.
- [x] 7.3 Run the test against current data to produce the authoritative fix list (expected: 209 labels, per the one-off audit; treat any discrepancy as a sign the heuristic needs adjusting before proceeding).

## 8. Infer weapon stats: strip embedded stats from labels, one task per faction file

(Counts from the one-off audit; re-run the task 7.1 test per file to confirm each is fully clean before moving to the next.)

- [x] 8.1 `dark-eldar.ts` (31 labels) — also verify against the group L/H/U edits from sections 1–2 above, which touch overlapping options.
- [x] 8.2 `tau.ts` (25 labels)
- [x] 8.3 `eldar.ts` (20 labels)
- [x] 8.4 `tyranids.ts` (18 labels)
- [x] 8.5 `necrons.ts` (17 labels)
- [x] 8.6 `space-marine-chapters.ts` (16 labels)
- [x] 8.7 `orks.ts` (15 labels)
- [x] 8.8 `adeptus-mechanicus.ts` (14 labels)
- [x] 8.9 `imperial-guard.ts` (12 labels)
- [x] 8.10 `space-marines.ts` (11 labels) — while here, also fix the duplicate `'Hunter-Killer Missile (Missile Launcher (Limited))'` entry in group K (lines 315–316) spotted during the audit, since it's touched anyway.
- [x] 8.11 `chaos-space-marines.ts` (10 labels)
- [x] 8.12 `chaos-daemons.ts` (6 labels) — also verify against the section 3–4 rule-effect edits above.
- [x] 8.13 `harlequins.ts` (6 labels)
- [x] 8.14 `inquisition.ts` (4 labels)
- [x] 8.15 `sisters-of-battle.ts` (3 labels)
- [x] 8.16 `genestealer-cult.ts` (1 label)

## 9. Verification

- [x] 9.1 Run the full test suite (`npx vitest run`) and confirm no regressions, especially `src/domain/weapon-count-audit.test.ts`, `src/data/index.test.ts`, and the new label-profile audit test from section 7.
- [x] 9.2 Spot-check the Ravager in the running builder: select the Group L option once and confirm the equipment list shows `3x Disintegrator Cannons` plus `1x Dark Lance`, not just `1x Dark Lance`.
- [x] 9.3 Spot-check one fixed option per file (e.g. Dark Eldar Night Shields, Chaos Daemons Locus of Fearless) in the running builder and confirm the granted rule now appears in the unit's special-rules display.
- [x] 9.4 Spot-check the upgrade picker (both a selected unit's panel and a roster unit's "Details" panel) for a few weapon-adding options across different factions and confirm stats/rule chips render correctly and match what's shown once the option is actually selected and equipped.
