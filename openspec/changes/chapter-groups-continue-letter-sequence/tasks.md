## 1. Data model and computed display letter

- [x] 1.1 In `src/domain/types.ts`, added `displayId?: string` to the `UpgradeGroup` interface, alongside the existing `hideId?: boolean`.
- [x] 1.2 In `src/data/chapters.ts`, added `letterFor(index: number): string` (`String.fromCharCode(65 + index)`).
- [x] 1.3 In `getEffectiveFaction`'s chapter-assembly branch, added `bundleGroups = bundle.upgradeGroups.map((g, i) => ({ ...g, displayId: letterFor(base.upgradeGroups.length + i) }))` (shallow clones, `bundle.upgradeGroups` never mutated) and used `bundleGroups` in the assembled `Faction.upgradeGroups` array instead of the raw bundle array.

## 2. UI

- [x] 2.1 In `src/components/EntryUpgradeControls.vue`, updated the section-heading template to `{{ group.hideId ? section.title : \`${group.displayId ?? group.id}. ${section.title}\` }}`.

## 3. Tests and verification

- [x] 3.1 Added 4 tests to `src/data/chapters.test.ts`: Blood Angels' own five groups have display letters `P`,`Q`,`R`,`S`,`T`; base groups never get a `displayId`; Blood Angels' and Dark Angels' own first groups both independently show `P`; `bloodAngelsBundle.upgradeGroups` is never mutated by calling `getEffectiveFaction`. 17/17 tests passing.
- [x] 3.2 Added a component test to `src/components/EntryUpgradeControls.test.ts`: Death Company's own group renders as "Q. Replace any Pistol" (its group `ba-b` is the second Blood Angels bundle group, so it continues at Q after Sanguinary Priest's `ba-a` takes P), never "ba-b. ...".
- [x] 3.3 `npm run build` (typecheck + vite build) and `npm run test` both pass clean: 211/211 tests, no typecheck errors.
- [x] 3.4 Verified against the running dev app (headless Chromium, full-page screenshot): a Blood Angels list with Death Company (chapter unit) and Tactical Marines (base unit) added shows Death Company's own group as "Q. Replace any Pistol" / "Q. Replace any Medium CCW" / "Q. Upgrade all models with" (continuing letter, no "ba-" anywhere on the page), while Tactical Marines' base groups (A/D/E/F) and its "Chapter Tactics" heading are all unchanged from before this change. No console errors.
