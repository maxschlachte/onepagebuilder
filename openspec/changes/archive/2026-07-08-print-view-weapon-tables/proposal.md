## Why

The print view currently renders a unit's equipment as one run-on, semicolon-separated sentence (`Equipment: 4x Assault Rifles (24", A1); 1x Meltagun (12", A6) [Piercing, Single Target]; 5x Light CCW (Melee, A1)`), mixing ranged and melee weapons together with no visual structure. For units with several weapons (vehicles, upgraded squads) this becomes a hard-to-scan wall of text — exactly the "too obscure" problem the user is asking to fix. The user wants weapons shown in a more tabular layout, split into melee and ranged sections.

## What Changes

- `PrintView.vue`: replace the single "Equipment:" paragraph with up to two tables per unit — a **Ranged Weapons** table (columns: Qty, Weapon, Range, Attacks, Rules) and a **Melee Weapons** table (columns: Qty, Weapon, Attacks, Rules — no Range column, since it's always melee). A table is only rendered if the unit has at least one weapon of that kind.
- The **Qty** column is only shown for multi-model units (`unit.size > 1`), matching the existing convention from `show-weapon-counts` (a size-1 unit's per-line count is always trivially 1 and would just be noise).
- A weapon whose label already spells out its own profile inline (e.g. `Battle Cannon (48", A9p)`) shows just the bare weapon name in the Weapon column — the trailing parenthetical is stripped since Range/Attacks/Rules now have their own columns and repeating it would be redundant.
- Equipment entries that aren't weapons (no resolvable range/attacks — e.g. `Markerlight`, `Zephyrglaive (Impact(1))`) are listed on a single compact "Other" line below the tables, unchanged from today's inline style, so nothing silently disappears.
- Special Rules stays as its own line below the tables, unchanged (it describes the whole unit, not a specific weapon).
- No changes to the interactive builder's equipment list (`EquipmentList.vue`) — the user's report is specifically about the print view; the builder already uses a different, appropriately compact per-line format with hover tooltips.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `print-view`: the "Printable army list with full stats" requirement gains a tabular, melee/ranged-divided equipment layout.

## Impact

- `src/views/PrintView.vue` — equipment rendering (template + helper functions), replacing `weaponLine`.
- `src/views/integration.test.ts` — existing print-view assertions use `toContain` on substrings, so they should keep passing unchanged; new assertions will be added for the table structure.
- No changes to `src/domain/calc.ts`, `src/domain/types.ts`, or any faction data file — this is a pure presentation change using data (`EquipmentEntry.weapon`, `.unitCount`, `.rules`) that already exists.
