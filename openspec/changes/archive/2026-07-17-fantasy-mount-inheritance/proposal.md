## Why

`one-page-fantasy-rules.md`'s "Mounts" special rule states: "Units that are mounted use any equipment and special rules from their mount as if they were their own, and they add Tough values together." The `fantasy-upgrade-equipment-fixes` change just gave every mount option a real weapon and a `gear("<Mount>", { rules: [...] })` entry carrying the mount's special rules (Fast, Nimble, Flying, Armored, Fear, Impact(N), Regeneration, Tough(N), etc.) — but `applyUpgrades()` (`src/domain/calc.ts`) only ever folds a unit's baseline `specialRules` plus an option's explicit `adds:` tokens into the unit's effective special-rules line; it never reads rules carried by an added `EquipmentEntry`. So today a mounted unit's Fast/Nimble/Flying/etc. are only visible next to the equipment line (e.g. "Warhorse [Fast, Nimble]"), never merged into the unit's own "Special Rules:" summary the way the rulebook requires, and if the unit's own baseline already has a `Tough` value, the mount's `Tough` value is simply never combined with it at all.

Nothing today distinguishes a mount-granting `gear()` call from any other non-weapon `gear()` call (Sergeant/Musician/Standard/Fiery Breath/Bell/etc.), so there is no way to apply this inheritance rule to mounts specifically without also wrongly promoting those command-group/named-ability grants to unit-wide special rules.

## What Changes

- Add a way to mark an `EquipmentEntry` as a mount (`isMount?: boolean`), settable via a new `mount?: boolean` option on the `gear()` authoring helper (`src/data/factions/helpers.ts`).
- Mark every "Mount on:"-style option's mount `gear()` call (and the few equivalent single-mount options, e.g. Ogre Kingdoms' "Replace Chaintrap: Stonehorn") across all 16 Age of Fantasy faction files with `mount: true` — the same ~98 sites the `fantasy-upgrade-equipment-fixes` change touched.
- In `applyUpgrades()` (`src/domain/calc.ts`), once a unit's final equipment list is known, fold every selected mount-marked entry's `rules` into the unit's `specialRules` (so Fast/Nimble/Flying/Armored/Fear/Impact(N)/Regeneration/etc. from the mount now appear in the unit's own special-rules line, in the builder and print view, with no separate UI change needed since both already render `EffectiveUnit.specialRules`).
- Special-case `Tough`: when a mount contributes a `Tough(N)` rule, sum it with whatever `Tough` value(s) the unit already carries (baseline plus any other selected upgrades) into one combined `Tough(N+M)`, rather than the existing "keep the highest" merge that already applies to every other duplicate absolute-valued rule (`mergeRuleGroup` in `calc.ts`). Every other rule kind keeps today's existing merge behavior (max for duplicate absolute values, sum-onto-max for `+N` additive bonuses) — the rulebook only calls out `Tough` for summation.
- Per the user's explicit instruction, the mount's own `EquipmentEntry` (its weapon and its named `gear(...)` line) stays visible in the unit's equipment list exactly as today — this change only affects the `specialRules` aggregation, not what's displayed in the equipment section.
- No changes to 40k faction data or any `system-40k` computation path — "Mounts" is an Age of Fantasy-only rule (`one-page-fantasy-rules.md`); no 40k faction currently has a comparable equipment-triggered rule-inheritance mechanic.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: adds a new requirement describing the Age of Fantasy "Mounts" special rule — a selected mount's own special rules are inherited by the mounted unit as its own, with `Tough` specifically summed rather than replaced.

## Impact

- **Affected code**: `src/domain/types.ts` (new `EquipmentEntry.isMount` field), `src/data/factions/helpers.ts` (new `EquipmentOpts.mount` → `gear()` sets `isMount`), `src/domain/calc.ts` (`applyUpgrades` folds mount-marked equipment rules into `specialRules`, with `Tough` summed).
- **Affected data**: all 16 files in `src/data/factions/fantasy/*.ts` — every mount-granting `gear()` call gains `mount: true`.
- **Affected tests**: `src/domain/calc.test.ts` gains coverage for the new merge behavior (mount rules folded in; `Tough` summed, not maxed); `src/data/fantasy-data-quality-audit.test.ts` gains a check that every "Mount on:"-style option's `gear()` entry is marked `isMount`.
- **Not affected**: `PrintUnitStats.vue`, `PrintView.vue`, `EntryUpgradeControls.vue`, `EquipmentList.vue`, or any other display component — all already read `EffectiveUnit.specialRules`/`unit.specialRules` as computed by `applyUpgrades`, so fixing the computation fixes both the builder and print view without touching either. The equipment-line display (which already shows a gear entry's own rules inline next to it) is also unchanged, so a mount's rules will now appear in two places (its own equipment line and the unit's special-rules summary) — a minor, accepted display redundancy per the user's "keep the equipment entry too for now" instruction, not something this change resolves.
- **Not affected**: 40k faction data, weapon-level rules (a mount's own weapon's rules, e.g. Piercing on its claws, stay scoped to that weapon and are not folded into `specialRules` — only the mount's `gear()` entry's rules are).
