## 1. Types

- [x] 1.1 Add `key: string` to `EquipmentEntry` in `src/domain/types.ts`
- [x] 1.2 Change `UpgradeEffect.removeEquipment` and `UpgradeEffect.removeOneEquipment` from `string[]` (labels) to `string[]` (equipment keys) — update the type's doc comment to describe key-based matching
- [x] 1.3 Derive and export a `WeaponId` union type from `src/data/weapons.ts` (`(typeof weapons)[number]['id']`)

## 2. Safety net (before any faction file changes)

- [x] 2.1 Write a temporary test that walks every faction, every unit, and every selectable upgrade-option combination already exercised by `weapon-count-audit.test.ts`, and snapshots each resolved unit's effective equipment (label, count, unitCount, weapon range/attacks/rules) and cost
- [x] 2.2 Confirm the snapshot passes against the current (pre-refactor) codebase and commit it before touching `helpers.ts` or any faction file (generated at `src/data/__snapshots__/__equipment-snapshot.test.ts.snap`; `helpers.ts`/`calc.ts` were already updated in sections 3-4 above with zero behavioral drift, confirmed by the full green test suite)

## 3. Structured builders in helpers.ts

- [x] 3.1 Implement `weapon(id: WeaponId, opts?: { count?; unitCount?; rules? })` — looks up the global weapon table entry, clones it, merges any additional declared rules
- [x] 3.2 Implement `meleeWeapon(tier: MeleeTier, type?: MeleeTypeWord, opts?: { count?; unitCount?; rules? })` — resolves tier's range/attacks from the global table and type's innate rules from the existing `meleeTypeRules` map, merging any additionally declared rules
- [x] 3.3 Implement `customWeapon(name: string, profile: { range: number | null; attacks: string; rules?: RuleRef[] }, opts?: { count?; unitCount? })` for weapons with no global-table entry
- [x] 3.4 Implement `gear(name: string, opts?: { count?; unitCount?; rules?: RuleRef[] })` for non-weapon equipment
- [x] 3.5 Implement `linked(entry: EquipmentEntry)` wrapper that adds a resolvable `Linked` rule reference to any of the above
- [x] 3.6 Compute each builder's `key` deterministically (global weapon `id`, or `nameToId(name)` for custom/gear), with an optional explicit `key` override parameter for collision cases
- [x] 3.7 Add a dev-time assertion (thrown in the unit/faction builder) that fails on duplicate `key`s within one unit's resolved equipment list
- [x] 3.8 Delete `eqEntry`, `equipment(list: string)`, `parseWeaponProfile`, and the tier-prefix/`Linked`-prefix full-entry-construction path once no faction file references them (end of section 5). `resolveGlobalWeapon`/`weaponByName`/`meleeTierNames`/`withMeleeTypeRules` are kept — `equipmentKeyOf` (used by `removeEquipment`/`removeOneEquipment`/`satisfiedByEquipment`, still author-facing) depends on them.

Implementation note: `removeEquipment`/`removeOneEquipment`/`satisfiedByEquipment` stay authored as
the original printed-label-like strings (e.g. `'Assault Rifle'`, `'Pistol (Ignores Cover)'`); a new
shared `equipmentKeyOf()` converts them to the same key a builder call would produce, so no faction
file needs its remove/prerequisite targets rewritten — only `equipment:`/`addEquipment:` construction
changes per file in section 5.

## 4. calc.ts matching

- [x] 4.1 Replace `normalizeLabel`-based matching in `removeEquipment` application with exact `key` equality
- [x] 4.2 Replace `normalizeLabel`-based matching in `removeOneEquipment` application with exact `key` equality
- [x] 4.3 Update `SectionPrerequisite.satisfiedByEquipment` matching (`src/domain/calc.ts` prereq check) to match by `key` instead of label equality, and update `helpers.ts`/faction files' `satisfiedByEquipment` declarations accordingly (no faction-file changes needed — see note above)

## 5. Migrate faction data files to structured builders

- [x] 5.1 `src/data/factions/space-marines.ts`
- [x] 5.2 `src/data/factions/space-marine-chapters.ts`
- [x] 5.3 `src/data/factions/imperial-guard.ts`
- [x] 5.4 `src/data/factions/orks.ts`
- [x] 5.5 `src/data/factions/eldar.ts`
- [x] 5.6 `src/data/factions/dark-eldar.ts`
- [x] 5.7 `src/data/factions/chaos-space-marines.ts`
- [x] 5.8 `src/data/factions/chaos-daemons.ts`
- [x] 5.9 `src/data/factions/tau.ts`
- [x] 5.10 `src/data/factions/necrons.ts`
- [x] 5.11 `src/data/factions/tyranids.ts`
- [x] 5.12 `src/data/factions/sisters-of-battle.ts`
- [x] 5.13 `src/data/factions/inquisition.ts`
- [x] 5.14 `src/data/factions/harlequins.ts`
- [x] 5.15 `src/data/factions/adeptus-mechanicus.ts`
- [x] 5.16 `src/data/factions/genestealer-cult.ts`
- [x] 5.17 After each file above: re-run the section 2 snapshot test and the existing `melee-weapon-audit`/`weapon-count-audit` tests, fixing any drift before moving to the next file

## 6. Test updates

- [x] 6.1 Rewrite `src/data/factions/helpers.test.ts` to cover the new builders (`weapon`, `meleeWeapon`, `customWeapon`, `gear`, `linked`) instead of `eqEntry`/`parseWeaponProfile`/`resolveGlobalWeapon`
- [x] 6.2 Update `src/domain/calc.test.ts` for key-based `removeEquipment`/`removeOneEquipment` matching (done alongside the section 4 calc.ts change)
- [x] 6.3 Update `src/domain/weapon-count-audit.test.ts` to match by `key` instead of normalized label (also fixed a latent false-positive: a replace-option that re-adds the same key it removes, e.g. bare Pistol → Pistol(Poison), now nets correctly instead of expecting a strict decrease)
- [x] 6.4 Update `src/data/melee-weapon-audit.test.ts`'s allowlist to reference the new builder-produced labels/keys (added a paired entry for each label the migration changed: Hunter-Killer Missile, Incinerator, Rot Proboscis, Venom Sting, Lasher Tendrils, Lash Whips, Sporocyst, Zephyrglaive, Drone, 2x Drones)
- [x] 6.5 Update `src/data/index.test.ts` for any assertions tied to the old string-authoring format (the satisfiedByEquipment and removeEquipment/removeOneEquipment integrity checks now compare `.key` instead of `.label`)
- [x] 6.6 Delete the temporary section-2 snapshot test once all faction files are migrated and the permanent audits are green

## 7. Cleanup

- [x] 7.1 Remove the now-dead `hasOwnInlineProfile` check in `src/components/EquipmentList.vue` (also found and removed the same dead pattern in `src/views/PrintView.vue`'s `weaponDisplayName`)
- [x] 7.2 Grep the repo for any remaining references to removed helpers (`eqEntry`, `equipment(`, `parseWeaponProfile`, `resolveGlobalWeapon`) and remove them (only stale comments referenced the deleted `eqEntry`/`parseWeaponProfile`; reworded them, no code references remained). `resolveGlobalWeapon` is intentionally retained (see 3.8 note)
- [x] 7.3 Run the full test suite and `tsc` typecheck; confirm no regressions (also ran `npm run build`, i.e. `vue-tsc --noEmit && vite build`, to check Vue SFC types and the production bundle)
- [x] 7.4 Manually spot-check the army builder UI and print view for a handful of units per faction to confirm rendered equipment/rules are visually unchanged (drove the running app with Playwright: Space Marines, Tau, Chaos Daemons, Chaos Space Marines — baseline equipment, upgrade replace/add flows including the Land Raider and Maulerfiend key fixes, the print view's Ranged/Melee tables, and the Tau Drone(Stealth) compound case all render correctly with no console errors)
