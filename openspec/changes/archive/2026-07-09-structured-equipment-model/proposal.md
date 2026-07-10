## Why

Faction data files author equipment as free-form strings (e.g. `'Linked Assault Rifles, Assault Rifles'`, `addEquipment: ['Medium Powersword']`, `removeOneEquipment: ['Assault Rifle']`), which `helpers.ts` then re-derives into typed objects via regex (`eqEntry`, `parseWeaponProfile`, `resolveGlobalWeapon`, tier-prefix and `Linked`-prefix inference) and `calc.ts` re-matches against those same strings at apply-time via case/pluralization-insensitive label comparison (`normalizeLabel`). This round-trip (string → parsed guess → string-matched again) is fragile: a typo or unexpected phrasing in a faction file silently resolves to the wrong weapon, drops a rule, or fails to match an upgrade's replacement target, and the failure is only visible by eyeballing rendered output rather than at authoring time. Moving to structured equipment objects makes the equipment type, its weapon profile (range/attacks/rules), and its identity for upgrade matching explicit and type-checked at the point of authoring.

## What Changes

- Introduce a structured equipment-authoring API in `src/data/factions/helpers.ts`: typed builder functions (e.g. `weapon('assault-rifle')`, `weapon('assault-rifle', { count: 2 })`, `meleeWeapon('medium', 'powersword')`, `inlineWeapon({ name, range, attacks, rules })`, `gear('Servo Arm', { rules: [...] })`) that construct `EquipmentEntry` objects directly, replacing free-text tokens.
- Give every `EquipmentEntry` a stable identity (`key`) independent of its display `label`, used for upgrade add/remove/replace matching instead of fuzzy label-string comparison.
- Replace the string-parsing pipeline (`eqEntry`, `equipment(list)`, `parseWeaponProfile`, `resolveGlobalWeapon`, tier-prefix and `Linked`-prefix name inference) with direct construction — no regex inference of weapon type, range, attacks, or rules from a name string.
- Change `UnitProfile`-builder input and `UpgradeEffect.addEquipment` / `removeEquipment` / `removeOneEquipment` from `string` / `string[]` to structured equipment references (`EquipmentEntry[]` / equipment-key arrays). **BREAKING** (internal data-authoring format only — no change to the runtime `EquipmentEntry`/`Weapon` types consumed by the UI).
- Replace `calc.ts`'s `normalizeLabel`/label-equality matching in `removeEquipment`/`removeOneEquipment` application with exact key-based lookup.
- Rewrite all 16 faction data files (`src/data/factions/*.ts`) to use the new structured builders instead of string equipment tokens.
- Update `parseRule`/`rules()` special-rule parsing is unaffected (special-rule tokens like `Tough(3)` stay string-authored) — only *equipment* tokens are affected.

## Capabilities

### New Capabilities

(none — this changes how an existing capability's data is authored/represented, not the rule set itself)

### Modified Capabilities

- `rules-data`: The "Weapon profiles" requirement's string-inference behavior (tier-prefix melee resolution, `Linked`-prefix resolution, inline-parenthetical parsing, global-weapon-by-name lookup) is replaced by direct structured construction with no inference step. The "Upgrade groups" requirement's label-based matching (case-insensitive, pluralization-insensitive) for `removeEquipment`/`removeOneEquipment` is replaced by exact matching on a stable equipment key.

## Impact

- `src/domain/types.ts`: `EquipmentEntry` gains a stable `key` field; `UpgradeEffect.addEquipment`/`removeEquipment`/`removeOneEquipment` change type from string-based to key/structured-reference-based.
- `src/data/factions/helpers.ts`: string-parsing functions removed/replaced with structured builder functions; `nameToId`/`parseRule`/`rules()` (special-rule parsing) retained as-is.
- `src/data/factions/*.ts` (16 files, ~4200 lines): every unit's `equipment` and every upgrade option's `addEquipment`/`removeEquipment`/`removeOneEquipment` rewritten to use the new builders.
- `src/domain/calc.ts`: equipment-effect application switches from `normalizeLabel` string matching to key matching.
- Tests: `src/data/factions/helpers.test.ts`, `src/data/index.test.ts`, `src/domain/calc.test.ts`, `src/domain/weapon-count-audit.test.ts`, `src/data/melee-weapon-audit.test.ts` need updates to reflect the new authoring API and matching mechanism.
- No intentional UI-facing behavior change — display still consumes the same `EquipmentEntry`/`Weapon` runtime shape. `src/components/EquipmentList.vue`'s `hasOwnInlineProfile` special case becomes dead code (see design.md) and can be deleted; rendered text is unaffected.
