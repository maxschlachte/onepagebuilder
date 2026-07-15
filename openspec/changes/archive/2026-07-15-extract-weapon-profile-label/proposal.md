## Why

`EntryUpgradeControls.vue`'s per-option weapon label was recently changed to show a weapon's rules inside its stats bracket (`(24", A1, Piercing)`) instead of after an em dash outside it (`(24", A1) — Piercing`). `EquipmentList.vue` renders the same kind of weapon-stats-plus-rules label — for a unit's actual equipment list rather than an upgrade option — but still uses the old em-dash format, so the two now disagree on how the same information is shown. Extracting the label as its own component and reusing it in both places fixes the inconsistency and gives the app one place to change this formatting in future, matching the pattern already established for `AppButton`/`UnitHeadline`/`UnitLoadout` in `extract-shared-vue-components`.

## What Changes

- Extract `EntryUpgradeControls.vue`'s weapon-stats-plus-rules label (the `(range/attacks[, rule chips])` markup) into a new reusable component (name finalized in design.md).
- Use it in `EntryUpgradeControls.vue`, replacing the inline markup with no visual change there (it already has the new bracket format).
- Use it in `EquipmentList.vue` for equipment entries that carry a weapon profile (`e.weapon`), replacing its em-dash-separated format with the bracket-inclusive one — a visible formatting change to the builder's "Equipment:" list and the print view's equipment listings wherever they route through `EquipmentList.vue`.
- `EquipmentList.vue`'s other case — a non-weapon equipment entry that carries rules directly (`e.rules`, no `e.weapon`) — is unrelated (there's no weapon stats bracket to reuse for it) and keeps its current em-dash rendering; out of scope for this change.

## Capabilities

### New Capabilities
(none — this is an internal refactor plus a small, previously-uncaptured formatting consistency fix)

### Modified Capabilities
- `army-builder-ui`: the "Edit units and upgrades in the builder" requirement's description of how a weapon's rules are shown alongside its range/attacks is tightened — rules render inside the same bracket as the range/attacks (comma-separated), not after a separate dash, and this format is now shared identically between a unit's equipment list and its upgrade-option rows.

## Impact

- `src/components/EntryUpgradeControls.vue` — weapon label markup replaced with the new shared component; no visual change (already on the new format).
- `src/components/EquipmentList.vue` — weapon-entry rendering replaced with the new shared component; visible format change (em dash → inline bracket) for any equipment line with a weapon that has rules.
- New file under `src/components/`: the weapon-profile label component (name/props finalized in design.md).
- Existing tests (`EquipmentList.test.ts`, `EntryUpgradeControls.test.ts`, and any `integration.test.ts`/`PrintView.test.ts` assertions matching weapon-rule text) must keep passing or be updated to match the new format — verify during implementation.
