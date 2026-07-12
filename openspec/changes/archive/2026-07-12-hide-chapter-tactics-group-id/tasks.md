## 1. Data model and helper

- [x] 1.1 In `src/domain/types.ts`, added `hideId?: boolean` to the `UpgradeGroup` interface.
- [x] 1.2 In `src/data/factions/helpers.ts`, changed `group(id, sections)` to `group(id, sections, opts?: { hideId?: boolean })`, setting `hideId: opts?.hideId` on the returned `UpgradeGroup`. Every existing `group('A', [...])`-shaped call site across faction files compiles unchanged (optional third param).

## 2. Apply to Chapter Tactics

- [x] 2.1 In `src/data/chapters.ts`, updated the per-unit Chapter Tactics `group(groupId, [...])` call to pass `{ hideId: true }` as the third argument.

## 3. UI

- [x] 3.1 In `src/components/EntryUpgradeControls.vue`, changed the section-heading template to `{{ group.hideId ? section.title : \`${group.id}. ${section.title}\` }}`.

## 4. Tests and verification

- [x] 4.1 Added a test to `src/data/chapters.test.ts` confirming the Chapter Tactics group's `hideId` is `true` and a real faction group's (`A`) `hideId` is falsy.
- [x] 4.2 Added an "EntryUpgradeControls section headings" describe block to `src/components/EntryUpgradeControls.test.ts` (2 tests): a real group renders `A. Replace one Assault Rifle`; the Chapter Tactics group renders exactly `Chapter Tactics` with no `blood-angels-tactics...` id text anywhere in its headings.
- [x] 4.3 `npm run build` (typecheck + vite build) and `npm run test` both pass clean: 206/206 tests, no typecheck errors.
- [x] 4.4 Verified against the running dev app (headless Chromium, full-page screenshot): a Blood Angels Tactical Marines unit's headings, in both the selected-unit upgrade panel and the roster's read-only Details panel, are identical: `A. Replace one Assault Rifle`, `A. Replace one Medium CCW`, `A. Take one Assault Rifle attachment`, `A. Upgrade one model with one`, `A. Upgrade Psyker(1)`, `D. Replace one Assault Rifle`, `D. Upgrade all models with any`, `E. Replace one Assault Rifle`, `E. Upgrade one model with one`, `F. Replace all Assault Rifles`, then plain `Chapter Tactics` (no id prefix) as the last heading. No console errors.
