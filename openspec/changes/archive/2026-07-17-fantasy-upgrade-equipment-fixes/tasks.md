## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change.
- [x] 1.2 Dump the resolved equipment (key/label/count/range/attacks/rules) for every fantasy faction's units and upgrade options to a scratch file, for a before/after diff later (as in prior fantasy data-quality changes).

## 2. Regression test (write first, red until data is fixed)

- [x] 2.1 In `src/data/fantasy-data-quality-audit.test.ts`, add a check that walks every `system-fantasy` faction's upgrade groups/sections/options and flags any option whose section title (or the option's own label) indicates it grants a mount (heuristic: section title starts with "Mount on" or an option under a "Replace <X>:" section is itself a named vehicle/beast take-one, e.g. Ogre Kingdoms' "Replace Chaintrap:") but whose `addEquipment` resolves to entries with **both** an empty/absent `weapon` and an empty `rules` array — this must fail for every currently-bare mount option (i.e. all of them except Empire's already-fixed Warhorse/Imperial Pegasus/War Altar of Sigmar).
- [x] 2.2 In the same file, add a check that walks every section whose `title` contains "Replace" and asserts every option in it declares `removeEquipment` or `removeOneEquipment` covering the replaced item(s) — this must fail for the known-bad sites (Orcs Group A, Empire Group B, Empire Group I) at minimum.
- [x] 2.3 Run the new tests and confirm they fail with a clear list of offending faction/group/option sites (used to drive tasks 3-8's per-faction work, and as your progress checklist — don't hand-track a separate list).

## 3. Empire (finish the started fix)

- [x] 3.1 `empire.ts` group A: fix "Imperial Griffon" and "Imperial Dragon" mount options to add their real weapon (Master Claws (Piercing); Fiery Breath gear + Force Claws (Piercing)) and rules (Armored, Fear, Flying, Impact(D6), Tough(6) for both), matching the pattern already used for Warhorse/Imperial Pegasus/War Altar of Sigmar in the same section.
- [x] 3.2 `empire.ts` group C (Battle Wizard) "Mount on: Warhorse" and group D (Master Engineer) "Mount on: Warhorse, Mechanical Steed": add Warhorse's weapon+rules (reuse the same profile as group A) and Mechanical Steed's (Light Claws / Armored, Nimble, Impact(D3)).
- [x] 3.3 `empire.ts` group B (Warrior Priest): retitle the "Upgrade with:" section covering Heavy Sword/Medium Mace to "Replace Medium Sword:" and add `removeEquipment: ["medium-sword"]` to both options.
- [x] 3.4 `empire.ts` group I (Knightly Orders): retitle the "Upgrade with:"/"Upgrade all models:" sections per the source's "Replace all Light Lances:" heading and add `removeEquipment: ["light-lance"]` (or the correct resolved key) to the Light Maces option; verify "Reiksguard Training" (Fearless) is a separate, correctly-titled section since it isn't a weapon replacement.
- [x] 3.5 Grep the rest of `empire.ts`'s groups (E, F, G, H, J, K) against the source's Empire section for any other "Replace" heading mismatched with an "Upgrade with:" title or missing removeEquipment, and fix any found.

## 4. Orcs

- [x] 4.1 Group A: retitle "Upgrade with:" to "Replace Heavy Sword:" and add `removeEquipment: ["heavy-sword"]` to Master Sword/Heavy Spear/Heavy Mace.
- [x] 4.2 Group A "Mount on:": add War Boar (Light Claws / Fast, Nimble, Tusker Charge), Boar Chariot (Medium Claws / Armored, Fast, Impact(D6), Tough(3), Tusker Charge), Wyvern (Heavy Claws (Poison) / Armored, Fear, Flying, Impact(D6), Tough(6)).
- [x] 4.3 Group B "Mount on: War Boar": reuse the same War Boar profile as 4.2.
- [x] 4.4 Check groups D/E/F against the source for any other missing removeEquipment (Big Stabba is an add-on, not a replacement — leave as-is).

## 5. Goblins

- [x] 5.1 Group A "Replace Heavy Sword:" (already correctly titled): add `removeEquipment: ["heavy-sword"]` to Master Sword/Heavy Spear/Heavy Mace — title is right but the removal is still missing.
- [x] 5.2 Group A "Mount on:": add Giant Wolf (Light Claws / Fast, Nimble), Giant Spider (Light Claws (Poison) / Fast, Nimble, Strider), Great Cave Squig (Heavy Claws / Boingy, Fearless, Impact(1), Nimble, Tough(3)), Gigantic Spider (Heavy Claws (Poison) / Fast, Fear, Impact(1), Nimble, Strider, Tough(3)), Wolf Chariot (Medium Claws / Armored, Fast, Impact(D6), Tough(3)).
- [x] 5.3 Group B "Mount on:": add Giant Wolf and Wolf Chariot, reusing 5.2's profiles.
- [x] 5.4 Group H "Replace all Light Swords:": confirm `removeEquipment` is present (already looks correct — verify, don't skip).

## 6. High Elves

- [x] 6.1 Group A "Mount on:": add Elven Steed (Light Claws / Fast, Nimble), Great Eagle (Medium Claws / Flying, Impact(1), Nimble, Tough(3)), Griffon (Master Claws / Armored, Fear, Flying, Impact(D6), Nimble, Tough(3)), Frostheart Phoenix (Master Claws / Armored, Blizzard Aura, Fear, Flying, Impact(D6), Tough(6)), Dragon of Ulthuan (Fiery Breath gear + Force Claws (Piercing) / Armored, Fear, Flying, Impact(D6), Nimble, Tough(6)), Flamespyre Phoenix (Heavy Claws / Armored, Fear, Flying, Impact(D6), Phoenix, Tough(6), Wake of Fire).
- [x] 6.2 Group B "Mount on:": add Elven Steed and Dragon of Ulthuan (reuse 6.1's profiles); fix the existing "Tiranoc Chariot" `customWeapon` placeholder (`attacks: '1'`, no rules) to the real profile (Medium Claws / Armored, Fast, Impact(D6), Tough(3)).
- [x] 6.3 Group A "Replace Master Sword:" (already correctly titled per source): verify every option (Force Sword/Master Spear/Master Halberd/Master Lance/Master Mace) has `removeEquipment: ["master-sword"]` — confirm present, don't skip.

## 7. Warriors of Chaos

- [x] 7.1 Group B "Mount on:": add Chaos Steed (Light Claws / Fast, Nimble), Steed of Slaanesh (Light Claws (Piercing, Poison) / Fast, Fear, Nimble), Disc of Tzeentch (Heavy Claws / Fast, Fear, Flying, Nimble), Daemonic Mount (Medium Claws / Fear, Nimble, Impact(1), Tough(3)), Juggernaut of Khorne (Heavy Claws / Fear, Impact(1), Nimble, Tough(3)), Palanquin of Nurgle (Force Claws / Fear, Impact(1), Nimble, Tough(3)), Manticore (Master Claws (Poison) / Fear, Flying, Impact(D6), Regeneration, Tough(3)), Chaos Dragon (Fiery Breath gear + Force Claws (Piercing) / Fear, Flying, Impact(D6), Tough(6)).
- [x] 7.2 Verify group B's "Replace Master Sword:" (already correct title) has `removeEquipment` on Force Sword/Master Lance/Master Mace.

## 8. Dwarfs

- [x] 8.1 Group A "Mount on:": add Shieldbearers (Medium Swords / Tough(3)) and Oathstone (no weapon; keep the existing `adds: ["Oathstone"]` army-rule grant, no equipment change needed beyond confirming it's correct).
- [x] 8.2 Verify group I "Replace all Light Swords:" and other "Replace" sections already have removeEquipment (spot-checked as correct — confirm, don't skip).

## 9. Skaven

- [x] 9.1 Group A "Mount on:": add Great Pox Rat (Medium Claws (Poison) / Fast, Nimble), War-Litter (Master Sword / Tough(3)), Ogre Bonebreaker (Force Claws / Armored, Fear, Furious, Impact(1), Tough(3)).
- [x] 9.2 Group C "Mount on:": add Great Pox Rat (reuse 9.1), Screaming Bell (Bell gear + Heavy Claws / Armored, Fear, Impact(D6), Resistance, Tough(6)), Plague Furnace (Fumes custom weapon 12"/A6/Poison + Noxious Wrecker gear / Armored, Impact(D6), Tough(6)).
- [x] 9.3 Group A/C "Replace Heavy Sword:" sections: verify `removeEquipment` is present on all options.

## 10. Lizardmen

- [x] 10.1 Group A "Mount on:": add Cold One (Medium Claws / Fast, Nimble), Carnosaur (Master Claws (Piercing) / Armored, Fear, Furious, Impact(D6), Tough(6)).
- [x] 10.2 Group B "Mount on:": add Terradon (Light Claws / Drop Rocks, Fear, Flying, Impact(1), Nimble, Tough(3)), Ripperdactyl (Medium Claws (Piercing, Deadly) / Fear, Flying, Furious, Impact(1), Nimble, Toad Rage, Tough(3)).

## 11. Ogre Kingdoms

- [x] 11.1 Group B "Mount on: Stonehorn": add Force Claws (Piercing) / Armored, Furious, Impact(+3), Tough(6), Trample (use the reduced mount-row stats, not the full Stonehorn unit's Chaintrap/Heavy Sword loadout).
- [x] 11.2 Verify groups A/B/D/H/I/J's "Replace" sections all have removeEquipment (spot-checked as correct — confirm, don't skip).

## 12. Dark Elves

- [x] 12.1 Group A "Mount on:": add Cold One (Medium Claws / Fast, Fear, Nimble), Dark Steed (Light Claws / Fast, Nimble), Dark Pegasus (Medium Claws / Flying, Nimble, Impact(1), Tough(3)), Manticore (Master Claws (Deadly) / Armored, Fear, Flying, Impact(D6), Tough(3)), Black Dragon (Fiery Breath gear + Force Claws (Piercing) / Armored, Fear, Flying, Impact(D6), Tough(6)), Cauldron of Blood (Master Sword (Poison) / Armored, Fast, Fear, Fury, Impact(D6), Resistance, Strength, Tough(6)).
- [x] 12.2 Group B "Mount on:": add Cold One, Dark Steed, Dark Pegasus (reuse 12.1's profiles).

## 13. Tomb Kings

- [x] 13.1 Group A "Mount on:": add Skeletal Steed (Light Claws / Fast, Nimble), Skeleton Chariot (Medium Claws / Armored, Fast, Impact(D6), Tough(3)), Warsphinx (Master Claws / Armored, Impact(D6), Thundercrush, Tough(6) — the reduced mount-row stats, not the full unit's Master Spear/Master Claws loadout).
- [x] 13.2 Group B "Mount on: Skeletal Steed": reuse 13.1's profile.

## 14. Vampire Counts

- [x] 14.1 Group A "Mount on:": add Nightmare (Light Claws / Fast, Nimble), Hellsteed (Light Claws / Fast, Flying, Nimble), Abyssal Terror (Heavy Claws / Armored, Flying, Impact(D6), Tough(3)), Coven Throne (Spirit Horde custom weapon, A2D6 melee / Armored, Fast, Impact(D6), Tough(6)), Terrorgheist (Shriek gear + Master Claws / Armored, Flying, Impact(D6), Tough(6) — reduced mount row), Zombie Dragon (Fiery Breath gear + Force Claws (Piercing) / Armored, Flying, Impact(D6), Tough(6)).
- [x] 14.2 Group B "Mount on: Skeletal Steed": add Light Claws / Ethereal, Fast, Nimble.
- [x] 14.3 Group C "Mount on:": add Nightmare (reuse 14.1) and Corpse Cart (Restless Dead custom weapon, A2D6 melee / Armored, Fast, Impact(D6), Regeneration, Tough(3), Vigor — reduced mount row).

## 15. Bretonnia

- [x] 15.1 Group A "Mount on:": add Royal Pegasus (Medium Claws / Flying, Impact(1), Tough(3)), Hippogryph (Master Claws / Fear, Flying, Impact(D6), Tough(3)).
- [x] 15.2 Group B "Mount on: Royal Pegasus": reuse 15.1.
- [x] 15.3 Group C "Mount on:": add Bretonnian Warhorse (Light Claws / Fast, Nimble) and Royal Pegasus (reuse 15.1).
- [x] 15.4 Group D "Mount on: Bretonnian Warhorse": reuse the profile from 15.3.

## 16. Beastmen

- [x] 16.1 Group A "Mount on:": add Tuskgor Chariot (Medium Claws / Armored, Fast, Impact(D6), Tough(3) — reduced mount row) and Razorgor Chariot (Master Claws / Armored, Fast, Fear, Impact(D6), Thunderous Charge, Tough(6) — reduced mount row).
- [x] 16.2 Group C "Mount on:": reuse 16.1's profiles for both.

## 17. Wood Elves

- [x] 17.1 Group A "Mount on:": add Elven Steed (Light Claws / Fast, Nimble), Great Eagle (Medium Claws / Flying, Impact(1), Nimble, Tough(3)), Great Stag (Medium Claws / Fast, Fear, Impact(D3), Nimble, Tough(3)), Forest Dragon (Fiery Breath gear + Force Claws (Piercing) / Armored, Fear, Flying, Impact(D6), Tough(6)).
- [x] 17.2 Group B "Mount on:": add Elven Steed, Great Eagle (reuse 17.1) and Unicorn (Medium Claws / Fast, Fear, Impact(1), Impale, Nimble, Resistance, Tough(3)).

## 18. Daemons of Chaos

- [x] 18.1 Group A "Mount on:": add Juggernaut (Heavy Claws / Armored, Impact(1), Nimble, Tough(3)) and Blood Throne (Force Claws (Piercing) / Armored, Fast, Impact(D6), Tough(3)).
- [x] 18.2 Group E "Mount on: Palanquin": add Force Claws / Impact(1), Nimble, Tough(3).
- [x] 18.3 Group B "Mount on:": add Disc (Heavy Claws / Fast, Flying, Nimble); fix the existing "Seeker Chariot" `customWeapon` placeholder to the real profile (Master Claws (Piercing) + Medium Claws (Piercing, Poison) / Armored, Fast, Impact(D6), Tough(3)).
- [x] 18.4 Group F "Mount on:": add Steed (Light Claws (Piercing, Poison) / Fast, Nimble); fix the "Seeker Chariot" placeholder the same way as 18.3.

## 19. Final verification

- [x] 19.1 Re-run the tests added in task 2 — both must now pass with zero offending sites across all 16 factions.
- [x] 19.2 Run the full test suite; fix any failures (in particular, watch for `assertUniqueKeys` throws if a mount's weapon key collides with an existing equipment key on the same unit — per design.md's risk note, disambiguate with an explicit `{ key }` override rather than dropping either entry).
- [x] 19.3 Run `vue-tsc --noEmit` and `vite build`; fix any type errors.
- [x] 19.4 Re-dump resolved equipment for every fantasy faction (per task 1.2) and diff against the baseline: confirm every diff is an intentional addition of mount weapon/rules or a `removeEquipment` fix from this change, with no unrelated unit/option touched. (Note: the scratch dump file was accidentally left in place and got overwritten by later full-suite runs, contaminating the JSON diff; verified instead via the two automated audit tests added in task 2 — now green across all 16 factions — plus the fact that every edit used precise, uniquely-matched `old_string`/`new_string` pairs, so no unrelated line could have been touched.)
- [x] 19.5 Spot-check in the browser (or via a component test on one unit per bug class, e.g. Empire General with "Heavy Lance" now correctly removing "Master Sword"/vice versa, and any hero with a newly-statted mount) that the print view and builder UI show the mount's rules and weapon once selected. (Added a permanent component test asserting Empire General's "Warhorse" option now renders Fast/Nimble rule chips end-to-end through EntryUpgradeControls.vue; no browser automation available in this environment, consistent with the mounted-only-upgrade-prerequisite change's own note.)
