## Why

Any weapon whose printed name is prefixed `Linked ` (e.g. `Linked Assault Rifle`, `Linked Carbine`, `Linked Lascannon`) fails to display correctly in the builder and print view. Two distinct symptoms, both traced to `eqEntry` in `src/data/factions/helpers.ts`:

1. **Bare `Linked X` labels with no inline profile** (e.g. baseline `Linked Carbines` on Meganobz, or `Linked Assault Rifle` added by several upgrade options) show neither range/attacks nor the Linked special rule at all. `eqEntry`'s known-global-weapon lookup only strips a trailing `s` before matching against `src/data/weapons.ts` — it doesn't strip a leading `Linked `, so `weaponByName.get('linked assault rifle')` never matches the table's `Assault Rifle` entry, and the entry falls through with an empty rule list.
2. **`Linked X (range, A-attacks)` labels with an inline profile** (e.g. `Linked Machinegun (24”, A3)`) do show their range/attacks (the inline parser doesn't care about the base name), but never show the Linked special rule itself, because `parseWeaponProfile` only extracts rules from the text *inside* the parentheses — and the convention that already works correctly elsewhere in this codebase (`Hurricane Bolter (24”, A3, Linked)`) spells `Linked` as a trailing rule token inside the parens, not as a prefix on the name. Data authored the `Linked X` way (matching how the rulebook prints these as distinct proper names) never gets that token.

This is a parsing-layer gap, not a data problem: ~250 equipment references across the faction files already carry a `Linked ` name (17 distinct bare names plus ~231 with inline profiles), and none of them need editing — `eqEntry` just needs to recognize the prefix.

## What Changes

- `eqEntry`/`parseWeaponProfile` (`src/data/factions/helpers.ts`) recognize a leading `Linked ` (case-insensitive) on an equipment token's base name: it's stripped before the known-global-weapon lookup (so `Linked Carbine` resolves against the table's `Carbine` entry), and it adds a `linked` rule reference to the resulting entry's rules in both the inline-profile and known-weapon-lookup paths (deduplicated against an explicit `Linked` token already present inside the parens, if any).
- No data file changes — this only touches the shared parsing helper. Every existing `Linked X` label, in baseline equipment or upgrade-option `addEquipment`, benefits automatically.
- No UI changes expected: `EquipmentList.vue`/`PrintView.vue` and `RuleChips`/`RuleTooltip` already render whatever's in an entry's `weapon.rules`/`.rules` generically, and the glossary already has a `linked` entry — confirmed by verifying in the running app before finalizing tasks, not assumed (a prior change in this same area made an "already correct" claim that turned out to be wrong).

## Capabilities

### Modified Capabilities
- `rules-data`: Weapon-profile normalization also recognizes a `Linked ` name prefix as shorthand for the `Linked` special rule, alongside the existing `p`/`x` attacks-suffix normalization.

## Impact

- `src/data/factions/helpers.ts`: `eqEntry` and `parseWeaponProfile` gain `Linked `-prefix handling.
- `src/data/factions/helpers.test.ts`: new cases for bare `Linked X`, `Linked X (rules only)`, and `Linked X (range, attacks)`.
- No changes anticipated to `src/domain/*`, faction data files, or Vue components — verified, not assumed, before archiving.
