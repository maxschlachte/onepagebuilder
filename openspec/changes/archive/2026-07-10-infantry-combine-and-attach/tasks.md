## 1. Glossary content

- [x] 1.1 Add the `infantry` entry to `src/data/glossary.ts` with the official rulebook text ("Any non-Vehicle unit. You may deploy two copies of the same Infantry unit as one big unit; upgrades that affect all models must be bought for both.")
- [x] 1.2 Extend the `psyker` entry's text in `src/data/glossary.ts` with the "may be deployed as part of a friendly Infantry unit of the same Quality" clause (matching the existing `hero` entry's wording)

## 2. Domain predicates

- [x] 2.1 Add `isInfantry(profile: UnitProfile): boolean` (true unless `specialRules` includes `hero`, `psyker`, `monster`, or `vehicle`) to `src/domain/calc.ts`
- [x] 2.2 Add `affectsAllModels(option: UpgradeOption): boolean` (true unless the option has a non-empty `removeOneEquipment`) to `src/domain/calc.ts`
- [x] 2.3 Add a database-wide audit test (alongside `melee-weapon-audit.test.ts`/`weapon-count-audit.test.ts`) asserting every current Hero/Psyker/Monster/Vehicle unit is excluded by `isInfantry`, and every current `removeOneEquipment`-bearing option is classified as per-model by `affectsAllModels`

## 3. List/domain model

- [x] 3.1 Add `combinedWith?: string` and `joinedInfantryUnit?: string` to `ListUnit` in `src/domain/list.ts`
- [x] 3.2 Add a combined-pair aggregation helper in `src/domain/calc.ts` (e.g. `combinedEffectiveUnit`) that sums two linked `EffectiveUnit`s' size/cost/equipment/special rules for display, without changing `applyUpgrades` itself

## 4. Store actions

- [x] 4.1 Add `combineUnits(listId, instanceIdA, instanceIdB)`: validates both entries share the same `unitId` and are `isInfantry`-eligible, unions any already-selected whole-unit (`affectsAllModels`) options onto both entries, and sets `combinedWith` symmetrically
- [x] 4.2 Add `splitUnits(listId, instanceId)`: clears `combinedWith` on both linked entries
- [x] 4.3 Add `toggleUpgrade` handling (or a new store method) so toggling a whole-unit option on a combined entry applies it to both linked entries in one atomic store update; toggling a per-model (`removeOneEquipment`-bearing) option continues to affect only the entry it was toggled on
- [x] 4.4 Add `attachToUnit(listId, instanceId, hostInstanceId)`: validates the host is `isInfantry`-eligible and its `quality` matches the attaching entry's `quality`, then sets `joinedInfantryUnit`
- [x] 4.5 Add `detachFromUnit(listId, instanceId)`: clears `joinedInfantryUnit`
- [x] 4.6 Update `removeUnit` to clear `combinedWith`/`joinedInfantryUnit` on any other entry that referenced the removed instance
- [x] 4.7 Update `duplicateList` to remap `combinedWith`/`joinedInfantryUnit` references consistently alongside the existing instance-id remapping, so combined/attached relationships survive duplication
- [x] 4.8 On list load (including JSON import), drop any `combinedWith`/`joinedInfantryUnit` reference that no longer resolves to a valid, eligible partner (missing target, `unitId`/Quality mismatch, or target no longer `isInfantry`-eligible)
- [x] 4.9 Extend `validate()` in `src/domain/calc.ts` to report a validation issue if a combined pair's whole-unit selections ever mismatch (defensive fallback for hand-edited/imported lists)

## 5. Builder UI

- [x] 5.1 In `src/views/BuilderView.vue`, show a "Combine" control on a selected unit's card when another uncombined entry of the same `unitId` exists and the unit `isInfantry`-eligible
- [x] 5.2 Render a combined pair as a single card: combined model count, combined cost, one shared set of whole-unit upgrade controls, and a per-entry panel for per-model (`removeOneEquipment`-bearing) options
- [x] 5.3 Show a "Split" control on a combined pair's card
- [x] 5.4 Show an "Attach to…" control on a Hero/Psyker unit's card, listing only same-Quality `isInfantry`-eligible entries in the current list as targets
- [x] 5.5 Render an attached Hero/Psyker's card nested under (or visibly grouped with) its host unit's card, with a "Detach" control

## 6. Print view

- [x] 6.1 In `src/views/PrintView.vue`, render a combined pair as one unit box using the combined-pair aggregation helper (task 3.2)
- [x] 6.2 Render an attached Hero/Psyker's stat block nested under its host unit's box instead of as a separate top-level box

## 7. Tests & verification

- [x] 7.1 Unit tests for `isInfantry` and `affectsAllModels` (`src/domain/calc.test.ts`)
- [x] 7.2 Unit tests for the new store actions: combine, split, attach, detach, cleanup on remove, remap on duplicate, drop-invalid-on-load (`src/stores/lists.test.ts`)
- [x] 7.3 Component/integration test coverage for the combine/split and attach/detach UI flows (`src/views/integration.test.ts` or new test files as appropriate)
- [x] 7.4 Manually run the app: combine two Tactical Marines squads and confirm combined cost/size and shared whole-unit upgrade selection; attach a Librarian to a Tactical Marines unit of matching Quality and confirm it's rejected for a mismatched-Quality unit; check the print view renders both correctly
- [x] 7.5 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions
