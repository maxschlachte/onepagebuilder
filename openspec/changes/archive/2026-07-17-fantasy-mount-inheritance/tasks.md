## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change.

## 2. Domain type and authoring helper

- [x] 2.1 In `src/domain/types.ts`, add `isMount?: boolean` to `EquipmentEntry`, documented as: marks this entry as the unit's mount, per `one-page-fantasy-rules.md`'s "Mounts" rule — its rules are inherited by the mounted unit as its own (Tough summed), rather than only displayed alongside the equipment entry.
- [x] 2.2 In `src/data/factions/helpers.ts`, add `mount?: boolean` to `EquipmentOpts`, and have `gear()` set `isMount: true` on the returned entry when `opts.mount` is true (omit the field otherwise, matching the existing convention of omitting falsy optional fields elsewhere in the same builders).

## 3. Domain logic (`applyUpgrades`)

- [x] 3.1 In `src/domain/calc.ts`, after the existing effect-application loop and before the final `mergeParameterizedRules(specialRules)` call, fold every selected mount-marked equipment entry's `rules` into `specialRules`: non-`tough`-numeric rules are appended directly; absolute-valued `tough` rules (unit's own plus every selected mount's) are summed into a single combined `{ ruleId: 'tough', param: sum }` entry, replacing any existing absolute `tough` entries. Leave any `Tough(+N)` additive-bonus entries untouched so the existing `mergeParameterizedRules` call still sums them onto the new combined base afterward. See design.md's Decisions section for the exact snippet.
- [x] 3.2 Add/extend `src/domain/calc.test.ts` coverage:
  - a mount's non-Tough rules (Fast, Nimble) appear in `applyUpgrades(...).specialRules` once the mount option is selected, and are absent when it isn't.
  - a unit with baseline `Tough(3)` selecting a mount with `Tough(6)` produces one `Tough(9)` entry, not two `Tough` entries and not `Tough(6)`.
  - a mount's weapon rules (e.g. `Piercing` on its claws) do NOT appear in `specialRules` — only on the weapon entry itself.
  - a non-mount gear grant (e.g. Sergeant) still does NOT appear in `specialRules` (regression: confirms the mount-only scoping).
  - baseline `Tough(3)` + a `Tough(+3)` additive upgrade + a mount's `Tough(6)` produces `Tough(12)` (base 3 + mount 6 = 9, then +3 additive = 12), confirming composition with the existing additive-merge path.

## 4. Mark every mount site (`mount: true`)

For each file, add `mount: true` to every `gear("<Mount>", {...})` call that sits in a "Mount on:"-style option's `addEquipment` (the mount's own named-gear entry — not its weapon entry, and not any non-mount gear like Sergeant/Musician/Standard/Fiery Breath/Bell/Noxious Wrecker).

- [x] 4.1 `src/data/factions/fantasy/empire.ts` — groups A (Warhorse ×2 sites, Imperial Pegasus, War Altar of Sigmar, Imperial Griffon, Imperial Dragon), B (Warhorse), C (Warhorse), D (Warhorse, Mechanical Steed).
- [x] 4.2 `src/data/factions/fantasy/orcs.ts` — groups A (War Boar, Boar Chariot, Wyvern), B (War Boar).
- [x] 4.3 `src/data/factions/fantasy/goblins.ts` — groups A (Giant Wolf, Giant Spider, Great Cave Squig, Gigantic Spider, Wolf Chariot), B (Giant Wolf, Wolf Chariot).
- [x] 4.4 `src/data/factions/fantasy/high-elves.ts` — groups A (Elven Steed, Great Eagle, Griffon, Frostheart Phoenix, Dragon of Ulthuan, Flamespyre Phoenix), B (Elven Steed, Great Eagle, Tiranoc Chariot, Dragon of Ulthuan).
- [x] 4.5 `src/data/factions/fantasy/warriors-of-chaos.ts` — group B (Chaos Steed, Steed of Slaanesh, Disc of Tzeentch, Daemonic Mount, Juggernaut of Khorne, Palanquin of Nurgle, Manticore, Chaos Dragon).
- [x] 4.6 `src/data/factions/fantasy/dwarfs.ts` — group A (Shieldbearers; Oathstone also marked — harmless per the task's own note, and required for the task 5.1 audit to pass uniformly).
- [x] 4.7 `src/data/factions/fantasy/skaven.ts` — groups A (Great Pox Rat, War-Litter, Ogre Bonebreaker), C (Great Pox Rat, Screaming Bell, Plague Furnace).
- [x] 4.8 `src/data/factions/fantasy/lizardmen.ts` — groups A (Cold One, Carnosaur), B (Terradon, Ripperdactyl).
- [x] 4.9 `src/data/factions/fantasy/ogre-kingdoms.ts` — group B (Stonehorn).
- [x] 4.10 `src/data/factions/fantasy/dark-elves.ts` — groups A (Cold One, Dark Steed, Dark Pegasus, Manticore, Black Dragon, Cauldron of Blood), B (Cold One, Dark Steed, Dark Pegasus).
- [x] 4.11 `src/data/factions/fantasy/tomb-kings.ts` — groups A (Skeletal Steed, Skeleton Chariot, Warsphinx), B (Skeletal Steed).
- [x] 4.12 `src/data/factions/fantasy/vampire-counts.ts` — groups A (Nightmare, Hellsteed, Abyssal Terror, Coven Throne, Terrorgheist, Zombie Dragon), B (Skeletal Steed), C (Nightmare, Corpse Cart).
- [x] 4.13 `src/data/factions/fantasy/bretonnia.ts` — groups A (Royal Pegasus, Hippogryph), B (Royal Pegasus), C (Bretonnian Warhorse, Royal Pegasus), D (Bretonnian Warhorse).
- [x] 4.14 `src/data/factions/fantasy/beastmen.ts` — groups A (Tuskgor Chariot, Razorgor Chariot), C (Tuskgor Chariot, Razorgor Chariot).
- [x] 4.15 `src/data/factions/fantasy/wood-elves.ts` — groups A (Elven Steed, Great Eagle, Great Stag, Forest Dragon), B (Elven Steed, Great Eagle, Unicorn).
- [x] 4.16 `src/data/factions/fantasy/daemons-of-chaos.ts` — groups A (Juggernaut, Blood Throne), E (Palanquin), B (Disc, Seeker Chariot), F (Steed, Seeker Chariot).

## 5. Regression test

- [x] 5.1 In `src/data/fantasy-data-quality-audit.test.ts`, add a check that every option under a `Mount on:`-titled section has at least one `isMount: true` entry in its `addEquipment` — fails loudly if a future mount option is added without the marker.
- [x] 5.2 Run it and confirm it fails before task 4's edits are applied (or, if run after, temporarily verify against a stashed pre-task-4 diff) — then confirms green once task 4 is complete.

## 6. Final verification

- [x] 6.1 Run the full test suite; fix any failures.
- [x] 6.2 Run `vue-tsc --noEmit` and `vite build`; fix any type errors.
- [x] 6.3 Spot-check via a component test (no browser automation available in this environment): mount `EntryUpgradeControls`/render the print view for a unit with a mount selected (e.g. Empire General + Warhorse) and confirm the unit's special-rules summary now includes Fast/Nimble, and a unit whose baseline has Tough with a mount that also grants Tough shows the summed value.
