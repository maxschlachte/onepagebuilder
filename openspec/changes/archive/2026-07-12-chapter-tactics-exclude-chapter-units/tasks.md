## 1. Restrict Chapter Tactics to base units

- [x] 1.1 In `src/data/chapters.ts`'s `getEffectiveFaction`, changed the unit-assembly line to `[...base.units.map(applyTactics), ...bundle.units].sort(...)` — `bundle.units` are still merged and category-sorted, just no longer passed through `applyTactics`.

## 2. Tests

- [x] 2.1 Rewrote the `src/data/chapters.test.ts` test (now titled "adds a category-wide Chapter Tactics option to every base Infantry-eligible unit, but not to the chapter's own units"): iterates only over base Space Marines Infantry/Vehicle units and asserts they still get Furious/Fast; asserts Blood Angels' own Death Company (Infantry) and Baal Predator (Vehicle) get neither option.
- [x] 2.2 Added coverage for the other three chapters: Space Wolves' Wulfen (Infantry, no Counter-Attack) and Sled Captain (Hero, no Wolf — confirming the exclusion is blanket, not limited to literally-redundant options); Grey Knights' Strike Squad (Infantry, no Aegis), in a new test. Added a `optionsOf(unit, faction)` test helper to reduce repetition. 14/14 tests passing.
- [x] 2.3 Reviewed `src/views/integration.test.ts`'s three chapter-specific tests — all use "Tactical Marines" (a base unit) for the Chapter Tactics assertion, unaffected by this change. No edits needed; 15/15 still pass.
- [x] 2.4 `npm run build` (typecheck + vite build) and `npm run test` both pass clean: 207/207 tests, no typecheck errors.

## 3. Manual verification

- [x] 3.1 Verified against the running dev app (headless Chromium, full-page screenshot): a Blood Angels list with Tactical Marines (base) and Death Company (chapter unit) added shows exactly one "Chapter Tactics" heading on the page (Tactical Marines' card, with "Furious +10pts"), while Death Company's card shows only its own authored `ba-b` group ("Replace any Pistol", "Replace any Medium CCW", "Upgrade all models with") and no Chapter Tactics section. No console errors.
