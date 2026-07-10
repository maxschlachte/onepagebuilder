## 1. Domain model

- [x] 1.1 In `src/domain/types.ts`, add `unitCount?: number` to `EquipmentEntry` (documented as: number of models in the unit carrying this entry; defaults to the unit's full size when omitted).
- [x] 1.2 Rename `UpgradeEffect.removeEquipmentOnSingleModel` to `removeOneEquipment` in `src/domain/types.ts`, updating its doc comment to describe the generalized (unit-size-independent) decrement-by-one-model behavior.
- [x] 1.3 In `src/data/factions/helpers.ts`, rename `OptionInput.removeEquipmentOnSingleModel` to `removeOneEquipment` and update `option()` to pass it through under the new name.

## 2. Core computation logic (`src/domain/calc.ts`)

- [x] 2.1 Add a pluralization-insensitive label-normalization helper (lowercase, strip trailing `s`), matching the convention already used in `eqEntry`.
- [x] 2.2 Replace the `if (unit.size === 1 && effects.removeEquipmentOnSingleModel)` block with unconditional logic: for each label in `effects.removeOneEquipment`, find equipment entries whose normalized label matches, reduce their effective `unitCount` (defaulting to `unit.size` if unset) by one, and drop the entry entirely if it reaches zero.
- [x] 2.3 When applying `effects.addEquipment`, if `effects.removeEquipment` is NOT present on the same option, set `unitCount: 1` on each added entry (covers both "replace one X" and bare attachment options); if `effects.removeEquipment` IS present, leave added entries' `unitCount` unset (defaults to the full unit size).
- [x] 2.4 Keep the existing unconditional `effects.removeEquipment` full-removal logic unchanged.

## 3. Rendering

- [x] 3.1 In `src/components/EquipmentList.vue`, accept the unit's size (new prop, or derive from an existing prop) and prefix each equipment line with `${e.unitCount ?? unitSize}x ` when `unitSize > 1`; no prefix when `unitSize === 1`.
- [x] 3.2 In `src/views/PrintView.vue`, apply the same prefix logic to `weaponLine`'s output (or the surrounding template), passing the unit's size through.
- [x] 3.3 Update the call sites in `BuilderView.vue` (and anywhere else `EquipmentList`/`weaponLine` is used) to pass the unit's size.

## 4. Data migration — rename existing declarations (mechanical)

- [x] 4.1 Rename every existing `removeEquipmentOnSingleModel:` key to `removeOneEquipment:` across all 16 `src/data/factions/*.ts` files (pure find-replace, no behavior/value changes to the arrays themselves).

## 5. Data migration — add missing `removeOneEquipment` declarations, per faction

For each file below, find every "replace one/any/up to N X" section whose options have `addEquipment` but neither `removeEquipment` nor `removeOneEquipment` (the gap identified by the pre-proposal survey — ~103 options across these factions), and add `removeOneEquipment: ['<X>']` to each such option, naming the equipment label the section replaces (matching the section's title/comment, e.g. "Replace one Assault Rifle" → `['Assault Rifle']`).

- [x] 5.1 `src/data/factions/space-marines.ts`
- [x] 5.2 `src/data/factions/sisters-of-battle.ts`
- [x] 5.3 `src/data/factions/orks.ts`
- [x] 5.4 `src/data/factions/eldar.ts`
- [x] 5.5 `src/data/factions/tyranids.ts` — re-audited directly against the loaded rules database (not just the pre-proposal survey): no gap options in this file affect any multi-model unit's display (all are either attachments or belong to single-model-only groups), so no changes were needed.
- [x] 5.6 `src/data/factions/space-marine-chapters.ts`
- [x] 5.7 `src/data/factions/adeptus-mechanicus.ts` — re-audited; no display-affecting gaps (attachment/single-model-only, as with tyranids).
- [x] 5.8 `src/data/factions/tau.ts` — re-audited; no display-affecting gaps.
- [x] 5.9 `src/data/factions/genestealer-cult.ts` — re-audited; no display-affecting gaps.
- [x] 5.10 `src/data/factions/chaos-space-marines.ts` — re-audited; no display-affecting gaps.
- [x] 5.11 Swept `imperial-guard.ts` and `dark-eldar.ts` (found genuine gaps not caught by the initial survey, now fixed) and `necrons.ts`, `chaos-daemons.ts`, `inquisition.ts`, `harlequins.ts` (no display-affecting gaps). Directly re-derived the precise gap list from the loaded (post-rename) rules database rather than relying solely on the original survey — 3 options were deliberately left unfixed with pre-existing/updated comments documenting why (dark-eldar group E's "Pistol or Medium CCW" — both can be present simultaneously, ambiguous which is replaced; dark-eldar group Q's "Replace any Heavy CCW" — despite the title, the CCW is kept, not replaced; space-marine-chapters group D's "Replace Linked Minigun" — ambiguous whether it means one vehicle or the whole squadron).

## 6. Tests

- [x] 6.1 Update `src/domain/calc.test.ts` and `src/data/factions/helpers.test.ts` for the `removeEquipmentOnSingleModel` → `removeOneEquipment` rename.
- [x] 6.2 Add `calc.ts` tests: a "replace one X" option on a multi-model unit reduces X's `unitCount` by one and adds the new weapon with `unitCount: 1`; the same option on a single-model unit still fully removes X (unchanged behavior); a "replace all X" option sets the new weapon's `unitCount` to the full unit size; a bare attachment option (no remove field) adds its weapon with `unitCount: 1` and leaves the original weapon's count untouched; a singular-authored target matches a pluralized baseline label.
- [x] 6.3 Add a rendering-level test (component or snapshot) confirming a multi-model unit's equipment list shows the `Nx ` prefix and a single-model unit's does not.
- [x] 6.4 Add an audit-style test walking every faction's "replace one/any/upToN" sections with a `removeOneEquipment`-bearing option, confirming (for a sample unit in each affected group) that after selecting the option, the total implied model count for the affected weapon pair (original + replacement) never exceeds the unit's size.

## 7. Verification

- [x] 7.1 Run the full test suite and confirm everything passes.
- [x] 7.2 Manually verify in the running app: Sisters of Battle Battle Sisters (5 models) with the group C "Meltagun" option selected shows `4x Assault Rifle` and `1x Meltagun`; a single-model unit (e.g. a Hero) shows no count prefixes; a "replace all" upgrade on a multi-model unit shows the full unit count on the replacement. Check both the builder view and print view.
