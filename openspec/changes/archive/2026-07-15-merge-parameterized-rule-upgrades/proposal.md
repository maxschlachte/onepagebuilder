## Why

`applyUpgrades` (`src/domain/calc.ts:379`) builds a unit's effective special rules by simply concatenating the base profile's rules with every selected upgrade's `addRules`: `specialRules = [...specialRules, ...effects.addRules]`. For most rules this is correct (a unit either has `Fearless` or it doesn't). But for the game's tiered/parameterized rules it produces wrong output: selecting a "Psyker(2)" upgrade on a unit with baseline `Psyker(1)` shows **both** `Psyker(1)` and `Psyker(2)` in its special rules, when only the higher tier should be shown — same for `Wizard(1)`→`Wizard(2)`→`Wizard(3)`. Separately, `Tough(+3)`-style upgrades (already parsed as a distinct additive form, per `RuleRef.param`'s existing `number | string` type and `parseRule`'s `+3`/dice handling) are meant to add onto the unit's existing `Tough(X)` value, but today they're just appended as a second, separate `Tough` rule instead of being combined into one.

## What Changes

- Add a merge step to `applyUpgrades` that resolves duplicate same-`ruleId` entries in the final special-rules list according to the parameter's own already-established convention:
  - Plain numeric params (e.g. `Psyker(2)`, `Wizard(3)`, an absolute `Tough(3)`) are **tiered** — when the same ruleId appears more than once with plain numeric params, only the highest-valued one is kept.
  - `+N` params (e.g. `Tough(+3)`, `Impact(+1)`) are **additive** — they combine with the group's absolute value (an existing plain-numeric entry, or `0` if none) into a single merged entry with the summed numeric param.
  - Any other shape (dice expressions like `Impact(D3)`, or a `note`-only rule) is left untouched — no merge semantics are defined for those, and none is needed by anything in the game data today.
- No change to which upgrade options are offered, their costs, or their prerequisites — only how the resulting `specialRules` list is computed for display and for any rule-presence checks that read it.

## Capabilities

### New Capabilities
(none — this is a correctness fix to existing computed output)

### Modified Capabilities
- `army-builder-ui`: the "Edit units and upgrades in the builder" requirement's description of a unit's effective special rules is extended to define how duplicate parameterized rules (from a baseline rule plus one or more upgrades) are resolved into a single entry, instead of being left to duplicate.

## Impact

- `src/domain/calc.ts` — `applyUpgrades`'s special-rules assembly (the loop building `specialRules` from `unit.specialRules` and each selected option's `effects.addRules`/`effects.removeRules`).
- No change to `combinedEffectiveUnit`/`groupEffectiveUnit` (`src/domain/calc.ts`'s combined/group display merges) — those merge *different unit instances'* rules for a roster summary, a different semantic than one unit's upgrades stacking, and are out of scope here (see design.md).
- No change to faction data, upgrade option definitions, or `parseRule`/`rules()` parsing.
- Existing tests (`calc.test.ts`) must keep passing; new tests cover the Psyker/Wizard tier-override and Tough additive-merge cases.
