## Context

`src/data/factions/helpers.ts` already has a tier+type melee-weapon builder, `meleeWeapon(tier, type, opts)`, used throughout the Warhammer 40k faction files:

```ts
export function meleeWeapon(tier: 'Light' | 'Medium' | 'Heavy' | 'Master' | 'Force', type: string, opts = {}): EquipmentEntry {
  const tierWeapon = weaponById.get(nameToId(tier) as WeaponId)!   // pulls range/attacks from the global weapon table
  const typeRules = meleeTypeRules[type.toLowerCase()] ?? []        // innate rules for the type word
  ...
}
```

The global weapon table (`src/data/weapons.ts`) already defines `Light`/`Medium`/`Heavy`/`Master`/`Force` as melee tiers with attacks `1`/`2`/`3`/`4`/`5` respectively — this happens to be identical to Warhammer Fantasy's own tier table in `one-page-fantasy-rules.md`'s "Weapons" section (both game lines share the same core tier convention). `meleeTypeRules` currently only has two entries, both Warhammer 40k's: `powersword` → Piercing, `powerfist` → Piercing + Rending.

The Warhammer Fantasy faction data (added/fixed in the prior `add-fantasy-rules-system` change) never used `meleeWeapon()` — every melee weapon was authored as a raw `customWeapon("<Tier> <Type>", { range: null, attacks: '1', rules: rules('...') })` call, with the attacks value hardcoded to `'1'` regardless of tier, and the type's innate rule (Halberd → Piercing, Mace → Piercing + Poison, Lance → Impact(1)) inconsistently applied — correct in some files (`empire`, `orcs`, `goblins`, `beastmen`, `bretonnia`, `daemons-of-chaos`, `wood-elves`), wrong or missing in 9 others (`dark-elves`, `dwarfs`, `high-elves`, `lizardmen`, `ogre-kingdoms`, `skaven`, `tomb-kings`, `vampire-counts`, `warriors-of-chaos` — 198+ individual mismatched entries by direct count).

Separately, `Sergeant`/`Musician`/`Standard` (Warhammer Fantasy's universal "Common Upgrades", per `one-page-fantasy-rules.md`) are authored as `gear("Sergeant")` etc. with no `rules` attached, so `RuleChips`/`RuleTooltip` (which render whatever's in an equipment entry's `rules` array) have nothing to show — these three options are the only common-upgrade options in the entire ruleset with no resolvable rule text, everything else already goes through a `RuleRef`.

## Goals / Non-Goals

**Goals:**
- Every Warhammer Fantasy melee weapon's attacks count matches its tier, and its type's innate rule (if any) is present, matching `one-page-fantasy-rules.md`.
- `Sergeant`/`Musician`/`Standard` show a tooltip with their printed effect, consistent with every other rule-bearing equipment entry in the app.

**Non-Goals:**
- No change to the `Spear` type's "+1 Attack when charged" rule — the app has no combat/charge-state simulation (it's a list builder and point calculator only), so this, like other purely-descriptive rules elsewhere in the app, isn't mechanically enforceable and isn't part of this fix.
- No change to ranged weapons (Bow/Crossbow/Pistol/etc.) — the reported bug and the audit are scoped to the 5 melee tiers only.
- No change to the 7 files that already use correct tier-based attacks (`empire`, `orcs`, `goblins`, `beastmen`, `bretonnia`, `daemons-of-chaos`, `wood-elves`) — they're spot-checked for regressions but not rewritten.

## Decisions

### 1. Reuse `meleeWeapon()` rather than add a new fantasy-specific builder

Extend the existing shared `meleeTypeRules` lookup in `helpers.ts` with three more entries (`halberd`, `mace`, `lance`), rather than writing a parallel `fantasyMeleeWeapon()` function. Warhammer Fantasy faction files then call the same `meleeWeapon('Master', 'Mace', opts)` Warhammer 40k already calls — no new abstraction, no duplicated tier→attacks table.

*Why*: the tier→attacks mapping is already correct and shared (`weapons.ts`'s Light/Medium/Heavy/Master/Force = 1/2/3/4/5, true for both game lines); the type word is just a lookup key with no cross-system collision risk (`halberd`/`mace`/`lance` vs. `powersword`/`powerfist`). `meleeWeapon()` already supports everything the migration needs: a `label` override for pluralized display names (already used by Warhammer 40k for multi-model units, e.g. `meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })`), and an `opts.rules` list merged alongside the type's innate rules for any extra printed qualifier (e.g. `Deadly`).

*Alternative considered*: a separate `fantasyMeleeWeapon()` with its own tier table. Rejected — the tier table would be a byte-for-byte duplicate of what already exists, and two functions doing the same lookup is a maintenance hazard (a future tier-count fix would need to land in two places).

### 2. Migrate raw `customWeapon` calls mechanically, file by file, verified by the existing audits

For each of the 9 affected files, every `customWeapon("<Tier word> <Type word(s)>[s]", { range: null, attacks: '<anything>', rules: rules('<extra>') }, opts?)` call whose name starts with `Light`/`Medium`/`Heavy`/`Master`/`Force` becomes `meleeWeapon('<Tier>', '<Type>', { ...opts, rules: rules('<extra>'), label: '<original name>' })` (label only needed when the original name doesn't already match `meleeWeapon`'s own auto-derived `"<Tier> <Type>"`/pluralized form). Any `customWeapon` call whose name does *not* start with a tier word (a bespoke ability name like `Bloodroar`, `Engine of the Gods`, `Hydra Heads`) is left untouched — it isn't a tier+type melee weapon at all.

*Why*: this is the same category of fix as the prior change's per-faction data-fidelity work, and the existing `melee-weapon-audit`/`label-profile-audit`/`fantasy-data-quality-audit`/full-suite tests already provide a verification harness — no new test infrastructure is needed, just running the suite after each file's migration.

*Alternative considered*: leave `customWeapon` calls as-is and just hand-correct the `attacks` string per entry. Rejected — that fixes the attacks count but not the (separately confirmed) missing innate-rule cases, and leaves the underlying pattern (hardcoded, unverified profile) in place for the next faction file someone adds.

### 3. `Sergeant`/`Musician`/`Standard` as three separate glossary entries with shared text where the source shares it

Add three entries to `glossary-fantasy.ts`: `sergeant` ("One model gets +1 melee attack."), `musician` and `standard` (both "Adds +1 for melee results.") — matching the source's own combined "Musician/Standard:" heading, which prints one line of text for two separately-purchasable options.

*Why*: `Sergeant`/`Musician`/`Standard` are already three independent `gear(...)` calls (independent upgrade options with independent costs) in every faction file; giving them independent glossary ids matches that existing structure and needs no changes to the options themselves beyond attaching `rules: rules("Sergeant")` etc.

## Risks / Trade-offs

- **[Risk] Mechanically converting ~200+ call sites by hand is error-prone (mis-parsed tier/type word, dropped `count`/`removeEquipment`/`removeOneEquipment` option, etc.).** → Mitigation: process one file at a time, run the full test suite after each (particularly `melee-weapon-audit`, `label-profile-audit`, and `rule-grant-audit`, which already catch profile/label/rule mismatches), and diff each converted line against the original to confirm only the intended fields changed.
- **[Risk] A tier+type name that also carries an explicit parenthetical override (e.g. a hypothetical "Heavy Claws" printed as an exception) needs the override preserved, not silently replaced by the generic type rule.** → Mitigation: preserve exactly whatever the original call's `rules("...")` argument contained via `opts.rules`, in addition to (not instead of) the type's innate rule — `meleeWeapon` already merges the two via `addUniqueRule`, so a duplicate (e.g. the original already had `Piercing` and the type adds it again) is deduped automatically.
- **[Trade-off] `Spear`'s "+1 Attack when charged" stays unenforced/undisplayed**, same as today. Accepted per Non-Goals — no combat-state simulation exists to hang it on, and inventing a rule that renders in a tooltip but never gets referenced by the Spear type-lookup would be more misleading than nothing.
