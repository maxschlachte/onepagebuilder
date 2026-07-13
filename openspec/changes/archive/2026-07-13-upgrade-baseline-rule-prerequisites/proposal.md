## Why

Some upgrade options only make sense as a "level up" of a special rule the unit is printed as already having at baseline — e.g. an "Upgrade Psyker(1)" section's "Psyker(2)" option is meant to bump an existing Psyker(1) model up a level, not grant Psyker from scratch. Because upgrade groups are shared across every unit that lists that group letter, and the prerequisite system has no way to gate a section on a unit's baseline special rules (only on baseline equipment or other selections), units that don't actually start with the base rule can currently take the "level up" option anyway. A survey of every faction found this is live today: units with no baseline Psyker (e.g. Space Marines Tactical Marines, Imperial Guard Guardsmen, Chaos Space Marines Chaos Marines, Chaos Daemons' Great Unclean One/Keeper of Secrets) can currently select a Psyker(2)/Psyker(3) upgrade meant only for the one unit per faction that actually has the matching baseline level (Librarian, Psyker, Sorcerer, Lord of Change).

## What Changes

- Add a new kind of section prerequisite that gates a section's availability on the unit's *baseline* special rules (distinct from the existing `requiresOneOfSelected`/`satisfiedByEquipment`, which look at other selections or baseline equipment) — a section can now declare it requires the unit to already carry a specific rule+level (e.g. `Psyker(1)`) at baseline, independent of anything the player has selected.
- Apply this new prerequisite to every "Upgrade Psyker(N)" section found in the faction data, so each is only available to units whose baseline special rules include `Psyker(N)`:
  - `imperial-guard.ts` group A "Upgrade Psyker(1)" — only the Psyker unit qualifies.
  - `space-marines.ts` group A "Upgrade Psyker(1)" — only the Librarian qualifies.
  - `chaos-space-marines.ts` group B "Upgrade Psyker(1)" — only the Sorcerer qualifies.
  - `chaos-daemons.ts` group A "Upgrade Psyker(1)" — only units with baseline Psyker(1) (Great Unclean One, Keeper of Secrets) qualify; Lord of Change (baseline Psyker(2)) no longer qualifies for this section.
  - `chaos-daemons.ts` group A "Upgrade Psyker(2)" — only Lord of Change (baseline Psyker(2)) qualifies; this closes the bug where Great Unclean One/Keeper of Secrets could buy a Psyker(3) upgrade at the cheaper "already at level 2" price without ever paying for level 2.
  - `orks.ts` group B and `harlequins.ts` group A "Upgrade Psyker(1)" — already only used by their one qualifying unit (Weirdboy, Shadowseer) today, but gated defensively so the same bug can't reappear if either group is ever extended to another unit.
- The JSON list import validator, which already rejects prerequisite-violating selections, automatically covers this new prerequisite kind with no separate validator change needed.
- **BREAKING**: a previously-importable list that had one of these now-invalid Psyker upgrades selected on a unit without the matching baseline rule will be rejected on import, and the option will no longer be selectable/toggleable in the builder for that unit.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `upgrade-prerequisites`: adds a new prerequisite kind — a section can require the unit's *baseline* special rules to include a given rule (not just baseline equipment or other selections) — plus the seven faction data points above that now declare it.

## Impact

- `src/domain/types.ts`: `SectionPrerequisite` gains a new field for a baseline-special-rule requirement.
- `src/domain/calc.ts`: `isSectionAvailable` gains a check against `unit.specialRules` for the new field.
- `src/data/factions/helpers.ts`: `SectionPrerequisiteInput` and the `faction()` resolver gain the new author-facing field, parsed the same way baseline `special` rule strings already are.
- `src/data/factions/{imperial-guard,space-marines,chaos-space-marines,chaos-daemons,orks,harlequins}.ts`: seven `section(...)` calls gain the new prerequisite.
- Existing saved lists in a user's local storage that already have one of these now-invalid selections are not retroactively migrated by this change; they're cleared the next time the user changes any upgrade on that unit (existing `pruneInvalidSelections` behavior, unchanged).
