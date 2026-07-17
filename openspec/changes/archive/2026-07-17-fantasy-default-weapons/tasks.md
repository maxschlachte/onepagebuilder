## 1. Baseline

- [x] 1.1 Run the full test suite once before any conversion to confirm a clean baseline (`fantasy-data-quality-audit.test.ts`, `melee-weapon-audit.test.ts`, `index.test.ts`, and any print-view/snapshot tests).
- [x] 1.2 Re-read `design.md`'s classification rules (exact ranged match → `weaponFantasy`, exact tier/type melee match → `meleeWeapon`, everything else stays `customWeapon`) before starting file conversions.

## 2. Convert beastmen.ts

- [x] 2.1 Classify every `customWeapon(...)` call in `src/data/factions/fantasy/beastmen.ts` per the design's rules and convert matches to `weaponFantasy(id, opts)` / `meleeWeapon(tier, type, opts)`.
- [x] 2.2 Run the full test suite; fix any label/key drift before moving on.

## 3. Convert bretonnia.ts

- [x] 3.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/bretonnia.ts`.
- [x] 3.2 Run the full test suite; fix any drift before moving on.

## 4. Convert daemons-of-chaos.ts

- [x] 4.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/daemons-of-chaos.ts` (note: already uses `weaponFantasy` in a few places — extend the pattern, don't duplicate it).
- [x] 4.2 Run the full test suite; fix any drift before moving on.

## 5. Convert dark-elves.ts

- [x] 5.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/dark-elves.ts`.
- [x] 5.2 Run the full test suite; fix any drift before moving on.

## 6. Convert dwarfs.ts

- [x] 6.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/dwarfs.ts`.
- [x] 6.2 Run the full test suite; fix any drift before moving on.

## 7. Convert empire.ts

- [x] 7.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/empire.ts` (largest file — 45 `customWeapon` calls).
- [x] 7.2 Run the full test suite; fix any drift before moving on.

## 8. Convert goblins.ts

- [x] 8.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/goblins.ts`.
- [x] 8.2 Run the full test suite; fix any drift before moving on.

## 9. Convert high-elves.ts

- [x] 9.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/high-elves.ts` (already the heaviest `weaponFantasy` user — extend consistently). No convertible calls found; remaining `customWeapon` entries are bespoke (differing range/compound names).
- [x] 9.2 Run the full test suite; fix any drift before moving on.

## 10. Convert lizardmen.ts

- [x] 10.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/lizardmen.ts`.
- [x] 10.2 Run the full test suite; fix any drift before moving on.

## 11. Convert ogre-kingdoms.ts

- [x] 11.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/ogre-kingdoms.ts`.
- [x] 11.2 Run the full test suite; fix any drift before moving on.

## 12. Convert orcs.ts

- [x] 12.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/orcs.ts`.
- [x] 12.2 Run the full test suite; fix any drift before moving on.

## 13. Convert skaven.ts

- [x] 13.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/skaven.ts`.
- [x] 13.2 Run the full test suite; fix any drift before moving on.

## 14. Convert tomb-kings.ts

- [x] 14.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/tomb-kings.ts`.
- [x] 14.2 Run the full test suite; fix any drift before moving on.

## 15. Convert vampire-counts.ts

- [x] 15.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/vampire-counts.ts`. No convertible calls found; all 4 remaining `customWeapon` entries are bespoke.
- [x] 15.2 Run the full test suite; fix any drift before moving on.

## 16. Convert warriors-of-chaos.ts

- [x] 16.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/warriors-of-chaos.ts`.
- [x] 16.2 Run the full test suite; fix any drift before moving on.

## 17. Convert wood-elves.ts

- [x] 17.1 Classify and convert `customWeapon(...)` calls in `src/data/factions/fantasy/wood-elves.ts`.
- [x] 17.2 Run the full test suite; fix any drift before moving on.

## 18. Clean up drift-detection tests and verify

- [x] 18.1 Review `src/data/fantasy-data-quality-audit.test.ts`: remove or simplify the "every standard-named custom weapon matches the Fantasy Weapons table" and "every melee weapon's attacks match its tier" checks down to whatever bespoke `customWeapon()` usage genuinely remains across all 16 files. Verified zero remaining `customWeapon()` names match a table/tier pattern (both checks now pass trivially); kept both tests as forward-looking regression guards against reintroducing the hand-typed-duplicate pattern, and updated their doc comments to explain their new, narrower role.
- [x] 18.2 Grep all 16 fantasy faction files for remaining `customWeapon(...)` calls and confirm each is a genuinely bespoke weapon (no table/tier match), per the design's Non-Goals.
- [x] 18.3 Run the full test suite one final time and confirm no printed army list output changed unexpectedly (spot-check a few converted units in the print view).
