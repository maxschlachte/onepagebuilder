## 1. Category sort in chapter assembly

- [x] 1.1 In `src/data/chapters.ts`, added a `categoryRank(unit: UnitProfile): number` helper: `0` if `isHero(unit)` or the unit carries the `psyker` rule id, `1` if `isInfantry(unit)`, `2` if `isVehicle(unit)`, else `3`.
- [x] 1.2 In `getEffectiveFaction`'s chapter-assembly branch, stable-sorted `units` by `categoryRank` after `applyTactics` and before returning it. The no-chapter/non-Space-Marines passthrough branch (`return base` before the bundle lookup) is untouched.

## 2. Tests

- [x] 2.1 Added 3 tests to `src/data/chapters.test.ts`: category ordering is non-decreasing across the whole roster with all three real categories represented; within a category base units precede chapter units and base units keep their own original relative order (Captain < Chaplain < Librarian; Tactical Marines < Death Company; Rhino < Baal Predator); a chapter-less faction's unit order is byte-for-byte identical (`.map(u => u.id)` equality) to the raw base faction.
- [x] 2.2 `npm run build` and `npm run test` both pass clean: 203/203 tests, no typecheck errors.

## 3. Manual verification

- [x] 3.1 Verified against the running dev app (headless Chromium): a Blood Angels list's roster reads Captain, Chaplain, Librarian, Sanguinary Priest (Heroes/Psykers) → Techmarine, Scout Squad, Tactical Marines, Terminators, Centurions, Scout Bikers, Bike Squad, Attack Bike, Thunderfire, Land Speeder, Dreadnought, Drop Pod, Death Company, Sanguinary Guard, Furioso Dreadnought (Infantry-category, base then chapter) → Rhino, Razorback, Predator, Land Raider, Baal Predator (Vehicle-rule units, base then chapter) — screenshot confirms visually. A chapter-less Space Marines list's roster order (`Captain...Land Raider`) is byte-for-byte identical to the pre-change order. No console errors.
