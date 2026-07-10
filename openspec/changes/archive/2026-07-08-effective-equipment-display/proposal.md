## Why

The builder's "Equipment:" list for a selected unit is meant to show the unit's *effective* loadout — it already renders `eff.equipment` (the output of `applyUpgrades`), and `EquipmentList.vue` already prints each weapon's range/attacks in brackets and its special rules as tooltipped chips (`RuleChips`/`RuleTooltip`), matching the "stats and abilities in brackets, abilities have tooltips" ask. But almost no faction data actually authors the `addEquipment`/`removeEquipment` effects that would make a selection change what's displayed: across all 16 factions' ~730 upgrade options, only the type/helper definitions reference those fields — zero options in `src/data/factions/*.ts` set them. So today, selecting "Stormbolter" to replace a Captain's Assault Rifle (or "Carbine" to replace an Ork Boy's Pistol) changes the cost and unlocks dependent sections, but the Equipment list still shows the original baseline weapon. The display plumbing works; the data doesn't drive it.

## What Changes

- Add a size-aware equipment-removal effect, `removeEquipmentOnSingleModel`, alongside the existing `addEquipment`/`removeEquipment`, mirroring the precedent set by `blockedBySelectingOnSingleModel` for prerequisites: a "replace one X" option only removes X from the displayed equipment when the unit has exactly one model (that model's only X is genuinely gone); on a multi-model unit, replacing *one* copy just adds the new weapon alongside the existing ones, since the other models still carry X. "Replace all X" options continue to use the unconditional `removeEquipment`.
- Faction-by-faction data pass: for every upgrade option across all 16 factions whose printed effect swaps, adds, or removes a weapon (as opposed to only adding a special rule like Armored/Fast), author the matching `addEquipment`/`removeEquipment`/`removeEquipmentOnSingleModel` so the unit's effective equipment list is accurate after that selection.
- No new UI component work: `EquipmentList.vue` (stats in brackets) and `RuleChips`/`RuleTooltip` (tooltipped special rules) already do what's asked once the underlying equipment list is correct — this change's UI-facing surface is verification, not new code.

## Capabilities

### Modified Capabilities
- `rules-data`: Upgrade options that change a unit's weapon loadout must record that as an equipment effect (add/remove), with a size-aware variant for partial ("one of several") replacements on multi-model units.
- `army-builder-ui`: The builder's equipment display for a selected unit must reflect weapon changes from applied upgrades, not only its baseline loadout.

## Impact

- `src/domain/types.ts`: `UpgradeEffect` gains `removeEquipmentOnSingleModel?: string[]`.
- `src/domain/calc.ts`: `applyUpgrades` applies `removeEquipmentOnSingleModel` only when `unit.size === 1`.
- `src/data/factions/helpers.ts`: `OptionInput`/`option()` plumb the new field through.
- `src/data/factions/*.ts` (all 16 factions): weapon-changing options gain equipment effects; 6 of them also gained a missing cross-section `requiresOneOfSelected` prerequisite, discovered by the structural tests once equipment effects made a pre-existing gap (selecting a "modify X" option without ever producing X) newly visible in the displayed equipment rather than just harmless in cost.
- `src/components/EquipmentList.vue` and `src/views/PrintView.vue`: turned out **not** already correct — both unconditionally appended a computed `(range, A-attacks)` bracket even when a label already spelled out its own profile (e.g. `Stormbolter (24”, A2)`), producing a duplicated bracket. Fixed in both (pre-existing bug, not introduced by this change, but far more visible once many more `addEquipment` entries used the same label convention).
- Existing tests (`calc.test.ts`, `helpers.test.ts`, `index.test.ts`, `integration.test.ts`) gain/adjust coverage.
