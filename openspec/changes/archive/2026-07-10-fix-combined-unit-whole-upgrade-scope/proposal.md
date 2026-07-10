## Why

The recently-built `infantry-combine-and-attach` feature (implemented, not yet archived) decides whether an upgrade option is "whole-unit" — and must therefore be bought once for a combined pair — using `affectsAllModels(option) = !option.effects?.removeOneEquipment?.length`. That treats *anything that isn't a per-model equipment swap* as whole-unit, which sweeps in options that only ever affect a single model: leader-only upgrades with no equipment effect at all (e.g. Space Marines' Narthecium/Battle Standard, Necrons' Broodlord-equivalents, Orks' Kustom Force Field/Shokk Attack Gun), and single-heavy-weapon swaps on unqualified "Replace X" sections (e.g. "Replace Autocannon", "Replace Machinegun") that only ever apply to the one model in the unit carrying that weapon. In the builder, combining two units now forces these single-model upgrades to be selected/priced identically on both entries, which is wrong — the rulebook's own wording ties "must be bought for both" specifically to upgrades that affect *all* models (the sections the game text itself titles "Replace all…"/"Upgrade all models…"), not to every upgrade that happens not to be a `removeOneEquipment` swap.

Separately, the builder's whole-unit upgrade panel (`EntryUpgradeControls.vue` with `filter="whole"`) renders a bordered/padded divider (`mt-2 border-t … pt-2`) for every upgrade *group* unconditionally, even when none of that group's sections have any option matching the current filter. Since most groups on most units are per-model weapon-swap groups, filtering to `whole` leaves most groups empty — but their divider still renders, producing a long stack of blank bordered rows in the whole-unit section.

## What Changes

- Redefine which upgrade options count as "whole-unit" (`affectsAllModels`) so it reflects the section's own authored scope rather than the mere absence of a `removeOneEquipment` effect: only options that live in a section whose scope is explicitly "all models" (the sections the rulebook itself phrases as "Replace all…", "Upgrade/Equip all models…") are whole-unit; every other section (`one`, `any`, `up to N`, or an unqualified single-item "Replace X") is per-model, regardless of whether its options carry an equipment effect.
- Update the store's `combineUnits`/`toggleUpgrade` whole-unit synchronization and the `wholeUnitOptionIds`/`combinedEffectiveUnit` helpers to use the corrected classification.
- Fix `EntryUpgradeControls.vue` so an upgrade group renders no divider/heading/spacing at all when none of its sections have a visible option under the active `filter` (`whole` or `perModel`), instead of rendering an empty bordered row per group.
- Update the existing database-wide audit test (and the `infantry-combine-and-attach` delta specs it will inherit once that change is archived) to match the corrected classification.
- **BREAKING**: none — this only corrects which already-existing options are classified as whole-unit vs per-model; no data or persisted-list shape changes.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-list-management`: corrects the "affects all models" definition used by the combine-units requirement (from `infantry-combine-and-attach`) so it's scoped to sections the rules define as applying to every model, not merely non-`removeOneEquipment` options.
- `army-builder-ui`: corrects the combined-pair rendering requirement so upgrade groups with no options visible under the current whole-unit/per-model filter render nothing (no empty divider).

## Impact

- `src/domain/calc.ts`: `affectsAllModels` changes from an option-level predicate to one derived from its containing `UpgradeSection` (section-scoped, not option-scoped); `wholeUnitOptionIds` and `combinedEffectiveUnit` updated accordingly.
- `src/stores/lists.ts`: `toggleUpgrade`'s whole-unit sync (`combineUnits`'s helper) looks up the containing section for an option id instead of checking the option alone.
- `src/components/EntryUpgradeControls.vue`: group-level template guard so empty groups (no options after `optionsFor` filtering) render nothing.
- `src/domain/infantry-audit.test.ts`, `src/domain/calc.test.ts`, `src/stores/lists.test.ts`: updated/extended coverage for the corrected classification (including the previously-mismatched single-model rule-grant and unqualified single-weapon cases found across the 16 faction files).
- `openspec/changes/infantry-combine-and-attach/specs/**`: superseded by this change's delta once both are archived (this proposal's delta spec carries the corrected wording forward).
