## Why

A unit's equipment list currently shows each distinct weapon label once, with no indication of how many of the unit's models actually carry it. For a 5-model unit like Battle Sisters where one model's Assault Rifle has been swapped for a Meltagun, the list just shows "Assault Rifles" and "Meltagun" side by side — it's ambiguous whether that means 1 model has each, or 4 have rifles and 1 has the Meltagun (the correct reading). The user wants each weapon line prefixed with its actual count, e.g. `4x Assault Rifle (24", A1)` and `1x Meltagun (12", A3, ...)`.

Getting this right required investigating how partial (single-model) weapon swaps are represented today. The answer: for multi-model units, they mostly aren't. `UpgradeEffect.removeEquipmentOnSingleModel` only fires when `unit.size === 1` — for any unit bigger than that, a "replace one X" upgrade option today just *adds* the new weapon without ever tracking that one model gave up its old one. A codebase-wide survey found roughly 100 upgrade options across 8+ factions that hit exactly this gap (many carry a comment like `"Battle Sisters/Dominions/Celestians are all size 5 — additions only"` acknowledging it). Showing accurate counts means fixing this gap, not just adding a display prefix.

## What Changes

- `EquipmentEntry` (`src/domain/types.ts`) gains an optional `unitCount` field: the number of models in the unit carrying this entry. When omitted, it defaults to the unit's full size (preserves today's implicit "every model has this" meaning for untouched baseline/whole-unit entries — no changes needed to the hundreds of entries where that's already correct).
- `UpgradeEffect.removeEquipmentOnSingleModel` is renamed to `removeOneEquipment` and its runtime behavior generalizes: it now decrements the matching equipment's model-count by exactly one *regardless of unit size* (removing the entry entirely once its count reaches zero), instead of only firing when `unit.size === 1`. For a size-1 unit this is unchanged (a decrement from 1 removes it, same as full removal today); for a multi-model unit it now correctly reduces the shared entry's count instead of leaving it untouched.
- `applyUpgrades` (`src/domain/calc.ts`): matches `removeEquipment`/`removeOneEquipment` targets against equipment labels case-insensitively and pluralization-insensitively (e.g. a declared target `Assault Rifle` matches a multi-model unit's baseline `Assault Rifles`), and marks equipment added by a non-whole-unit upgrade option (no `removeEquipment` present) with `unitCount: 1`.
- `EquipmentList.vue` and `PrintView.vue` render an `Nx ` prefix (using `unitCount`, defaulting to the unit's size) in front of each equipment line, but only for units with more than 1 model — a size-1 unit's display is unchanged (a trivial "1x" on every line for Heroes/vehicles would be noise, and several vehicles/monsters already bake their own per-model weapon-copy count into the label text, e.g. "2x Hurricane Bolters", which this feature doesn't touch).
- Add the missing `removeOneEquipment` declarations to the ~100 upgrade options identified by the survey, across all factions, so counts are accurate everywhere rather than only where the field already happened to exist.

**Out of scope:**
- Per-model weapon-copy counts baked into a label (e.g. Land Raider's "2x Hurricane Bolters", a single model carrying 2 copies) — a different axis (copies-per-model, not models-per-unit) that already has its own known "additions only" edge cases (see e.g. the comment in `space-marines.ts` group I), left untouched.
- Merging two separately-added equipment entries that happen to resolve to the same label (e.g. if two different upgrade sections both replace a weapon with something that ends up with an identical label) into a single combined count line — an existing display would just show two separate `1x` lines instead of one `2x` line. Rare edge case, not addressed in this change.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: the "Edit units and upgrades in the builder" requirement's displayed equipment list must show each weapon's model count as an `Nx ` prefix for multi-model units.
- `rules-data`: the upgrade-effects model gains a generalized "replace one" equipment effect (replacing the size-gated `removeEquipmentOnSingleModel`), and equipment/upgrade label matching becomes pluralization-insensitive.

## Impact

- `src/domain/types.ts` — `EquipmentEntry.unitCount`, `UpgradeEffect.removeOneEquipment` (renamed from `removeEquipmentOnSingleModel`).
- `src/domain/calc.ts` — `applyUpgrades`'s equipment-effect application logic.
- `src/data/factions/helpers.ts` — `OptionInput`/`option()` field rename.
- All 16 `src/data/factions/*.ts` files — mechanical rename of `removeEquipmentOnSingleModel` → `removeOneEquipment` (existing declarations), plus new `removeOneEquipment` declarations added to the ~100 gap options found by the survey.
- `src/components/EquipmentList.vue`, `src/views/PrintView.vue` — render the `Nx ` prefix.
- `src/domain/calc.test.ts`, `src/data/factions/helpers.test.ts` — updated for the rename; new tests for count computation.
