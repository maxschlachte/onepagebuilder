## Why

`one-page-fantasy-rules.md`'s "Common Upgrades" section defines Sergeant ("One model gets +1 melee attack"), Musician, and Standard ("Adds +1 for melee results") as single command-group grants — a unit only ever fields one of each, regardless of its size. Every Warhammer Fantasy faction's `"Upgrade with:"` section for these three options is authored as an ordinary `'any'`-selection, per-model section (the same shape used for genuinely per-model gear like Skaven's Flayer Gauntlets or Beastmen's mount trinkets), so `affectsAllModels()` — the heuristic that decides whether an upgrade option is selected once for a combined pair or independently per linked entry — classifies them as per-model. When a user combines two entries of the same unit where each entry had independently selected, say, Sergeant, `combinedEffectiveUnit` charges the option's cost twice (once per entry) while deduplicating its displayed label to one — a silent cost/display mismatch, and a unit ending up with two Sergeants, which the rulebook doesn't allow.

## What Changes

- Add an explicit `oncePerUnit?: boolean` flag to `UpgradeSection` (and the `SectionInput` authoring shape), for sections whose printed title doesn't say "all" but whose options are nonetheless capped at one grant per unit regardless of model count — the case the existing title-substring heuristic (`/\ball\b/i`) cannot express, since `"Upgrade with:"` is reused verbatim by dozens of genuinely per-model sections across the same faction files.
- Extend `affectsAllModels(section)` in `src/domain/calc.ts` to also return `true` when `section.oncePerUnit` is set, alongside its existing title-text check — so a combined pair keeps showing the option as selected on both linked entries (matching how a real "Replace all X" option already mirrors), with no change needed to `wholeUnitOptionIds`, `combineUnits`, `toggleUpgrade`, or `EntryUpgradeControls.vue`'s panel split.
- Add a new `oncePerUnitOptionIds(faction)` helper and use it in `combinedEffectiveUnit` to charge a `oncePerUnit`-flagged option's cost exactly once for the pair, instead of once per linked entry — the one genuinely new piece of cost logic this change needs, since mirroring the selection (previous bullet) alone would otherwise still double-charge it, the same way any other whole-unit option's cost legitimately scales with entry count today.
- Mark each of the 16 Warhammer Fantasy faction files' Sergeant/Musician/Standard `"Upgrade with:"` section with `oncePerUnit: true`.
- Extend `src/domain/infantry-audit.test.ts`'s `affectsAllModels` audit to cover the new flag, and add regression coverage in `src/domain/calc.test.ts` proving that a combined pair where each entry independently selected Sergeant/Musician/Standard is charged for it exactly once.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-list-management`: broadens the "Combine Infantry units and attach Heroes/Psykers" requirement's definition of which upgrade options are whole-unit, to also include options an upgrade section explicitly marks as capped at one grant per unit (independent of the section's title wording), and adds a scenario for the Sergeant/Musician/Standard case specifically.

## Impact

- **Affected code**: `src/domain/types.ts` (`UpgradeSection.oncePerUnit`, `EffectiveUnit.selectedUpgradeIds`), `src/data/factions/helpers.ts` (`SectionInput.oncePerUnit`, threaded through `section()`/`group()`), `src/domain/calc.ts` (`affectsAllModels`, `applyUpgrades` populating `selectedUpgradeIds`, new `oncePerUnitOptionIds`, `combinedEffectiveUnit`'s cost math), `src/views/PrintView.vue` and `src/views/BuilderView.vue` (both `combinedEffectiveUnit` call sites gain a `faction` argument).
- **Affected data**: all 16 `src/data/factions/fantasy/*.ts` files — the Sergeant/Musician/Standard section gains `oncePerUnit: true`; the 6 call sites across those same files that pass a section prerequisite positionally are updated for `section()`'s new options-bag shape.
- **Affected tests**: `src/domain/infantry-audit.test.ts` (new audit coverage for `oncePerUnit`), `src/domain/calc.test.ts` (`combinedEffectiveUnit`'s existing 5 tests gain a faction argument; new cost-dedup regression), `src/data/factions/helpers.test.ts` (`section()`'s changed signature).
- **Not affected**: 40k faction data (no 40k faction currently has an equivalent single-command-model-per-unit upgrade sharing a per-model-titled section — verified by survey), `combineUnits`/`toggleUpgrade`'s existing mirror-to-both-entries logic (unchanged — mirroring the *selection* to both linked entries while combined is correct and matches how any other whole-unit option already behaves; splitting the pair back afterward correctly leaves both entries independently holding their own full-price selection, since each is once again its own standalone unit), `EntryUpgradeControls.vue`, `groupEffectiveUnit`/the group-deployment (Conclave/Warband-style) combine path — no Warhammer Fantasy faction uses that mechanism.
