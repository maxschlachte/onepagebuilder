## Why

Close-combat weapon entries (e.g. `Medium CCW`, `Heavy Claws`) never show their attacks count in the army builder or print view, even though the equivalent ranged weapons do (e.g. `Assault Rifle (24", A2)`). The root cause is a name-matching bug: faction data files write melee equipment as `"<Tier> CCW"` / `"<Tier> Claws"` (e.g. `Medium CCW`), but the global weapon table keys melee tiers by their bare name (`medium`, `heavy`, ...). The lookup in `eqEntry` never matches these compound names, so the entry's `weapon` field is left unset and the UI's `e.weapon && ...` guard suppresses the bracket display entirely.

## What Changes

- Fix melee weapon name resolution in `eqEntry` (`src/data/factions/helpers.ts`) so `"<Tier> CCW"` / `"<Tier> Claws"` (and similar melee naming patterns used across the 16 faction files) resolve against the global attack-tier weapon table (`light`, `medium`, `heavy`, `master`, `force`).
- Once resolved, melee weapons automatically pick up the existing `(Melee, A<n>)` bracket rendering already implemented in `EquipmentList.vue` and `PrintView.vue` (no changes needed there).
- Add test coverage in `helpers.test.ts` for melee weapon name resolution, covering bare tier names embedded in compound equipment labels.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: The "Weapon profiles" requirement's global-table resolution must also match melee equipment names that combine a weapon-tier word with a descriptive suffix (e.g. `Medium CCW`, `Heavy Claws`), not just exact tier names.

## Impact

- `src/data/factions/helpers.ts` — `eqEntry` name-lookup logic.
- `src/data/factions/helpers.test.ts` — new test cases.
- No changes to `src/components/EquipmentList.vue` or `src/views/PrintView.vue` (their bracket-rendering logic already handles `range === null` correctly).
- Affects all 16 faction data files' melee equipment entries at runtime (no data file edits required — the fix is in shared resolution logic).
