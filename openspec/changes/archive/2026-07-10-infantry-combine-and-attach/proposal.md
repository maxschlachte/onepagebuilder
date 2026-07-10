## Why

The rulebook's "Infantry" unit type lets a player deploy two copies of the same Infantry unit as one bigger unit (with whole-unit upgrades bought for both copies), and lets Heroes/Psykers deploy as part of a friendly Infantry unit of the same Quality. Today the list builder has no representation of either mechanic — every added unit is an independent, unrelated entry — even though both affect how a legal list is put together and how its cost is tallied.

## What Changes

- Add the `Infantry` special rule to the global glossary with its official text (any non-Vehicle unit; two copies may be deployed as one bigger unit; whole-unit upgrades must be bought for both).
- Extend the existing `Psyker` glossary text with the "may be deployed as part of a friendly Infantry unit of the same Quality" clause the rulebook already gives `Hero` (the printed rule covers both).
- Add a derived (not manually tagged) notion of "Infantry-eligible": a unit is Infantry-eligible when its special rules do **not** include Hero, Psyker, Monster, or Vehicle.
- Add a derived notion of "affects all models" for upgrade options: an option affects all models unless it replaces only one model's equipment (i.e. it has no `removeOneEquipment` effect).
- List builder: let a user combine two list entries of the same Infantry-eligible unit into one linked pair that displays and costs as a single bigger unit; whole-unit upgrade options are selected once and apply to both entries, while per-model swap upgrades stay independently selectable on each entry. Let the user split a combined pair back apart.
- List builder: let a user attach a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality in the same list, purely for organizational display (no cost or points-cap/hero-limit effect). Let the user detach it.
- Print view: render a combined pair as one box (doubled size, summed cost), and an attached Hero/Psyker nested under its host unit's box.
- **BREAKING**: none — `ListUnit` gains optional fields only; existing saved lists load unchanged with no combination/attachment state.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-list-management`: gains a new requirement covering combining two Infantry-eligible units into one linked pair, and attaching a Hero/Psyker to a same-Quality Infantry-eligible unit.
- `army-builder-ui`: gains the on-screen controls for combining/splitting and attaching/detaching, and how a combined/attached pair is displayed.
- `print-view`: the printed unit-box rendering is extended to show a combined pair as one box and an attached Hero/Psyker nested under its host.

## Impact

- `src/data/glossary.ts`: add the `infantry` entry; extend the `psyker` entry's text.
- `src/domain/list.ts`: `ListUnit` gains `combinedWith?: string` and `joinedInfantryUnit?: string` (both instance-id references).
- `src/domain/calc.ts` (or a new small domain module): `isInfantry(profile)` and `affectsAllModels(option)` predicates; a combined-pair aggregation helper (summed size/cost/equipment/rules) reused by both views.
- `src/stores/lists.ts`: new actions to combine/split unit pairs and attach/detach a Hero or Psyker, plus cleanup of these links when a linked unit is removed or a list is duplicated.
- `src/views/BuilderView.vue`: combine/split and attach/detach controls; combined-pair and attached-hero rendering.
- `src/views/PrintView.vue`: combined-pair and attached-hero/psyker rendering in the printed output.
- No change to `applyUpgrades`, cost totals, or hero-limit validation for non-combined/non-attached units — this is additive at the list/store/UI layer.
