## Why

Warhammer Fantasy melee weapons don't return the correct number of attacks — e.g. Ogre Kingdoms' Master Mace shows 1 attack instead of 4. Per `one-page-fantasy-rules.md`'s "Weapons" section, a melee weapon's attacks come from its tier (Light=1, Medium=2, Heavy=3, Master=4, Force=5), and its type word carries an innate rule (Halberd → Piercing; Mace → Piercing + Poison; Lance → Impact(1)). Most of the fantasy faction data hardcodes every melee weapon's attacks to `1` regardless of tier, and several also drop the type's innate rule entirely — a bug affecting hundreds of weapon entries across 9 of the 16 faction files. Separately, the "Common Upgrades" (Sergeant/Musician/Standard) have no attached rule text, so they show no tooltip describing what they do, even though the source document defines them plainly.

## What Changes

- Extend the existing `meleeWeapon(tier, type, opts)` builder (`src/data/factions/helpers.ts`, already used by Warhammer 40k factions and already tier-accurate via the shared global weapon table) with Warhammer Fantasy's three melee type words — `Halberd` → Piercing, `Mace` → Piercing + Poison, `Lance` → Impact(1) — alongside the existing Powersword/Powerfist entries.
- Migrate every raw `customWeapon("<Tier> <Type>", ...)` call across the 9 affected fantasy faction files (`dark-elves`, `dwarfs`, `high-elves`, `lizardmen`, `ogre-kingdoms`, `skaven`, `tomb-kings`, `vampire-counts`, `warriors-of-chaos`) to `meleeWeapon('<Tier>', '<Type>', opts)`, fixing both the wrong attacks count and any missing innate type rule in one pass. Any extra printed rule (e.g. `Deadly`) is preserved via the same `opts.rules` mechanism already used elsewhere.
- Add `Sergeant`, `Musician`, and `Standard` as resolvable rules in `src/data/glossary-fantasy.ts`, sourced verbatim from `one-page-fantasy-rules.md`'s "Common Upgrades" section, and attach them to the corresponding `gear(...)` calls (3 per faction × 16 factions = 48 call sites) so their tooltip renders like any other rule chip.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `rules-data`: Warhammer Fantasy melee-weapon attack counts and innate type rules must match `one-page-fantasy-rules.md`'s Weapons table; the three Common Upgrades must be resolvable rules with their printed text.

## Impact

- `src/data/factions/helpers.ts` — extend the shared `meleeTypeRules` lookup with `halberd`/`mace`/`lance`.
- `src/data/glossary-fantasy.ts` — add `sergeant`, `musician`, `standard` glossary entries.
- `src/data/factions/fantasy/{dark-elves,dwarfs,high-elves,lizardmen,ogre-kingdoms,skaven,tomb-kings,vampire-counts,warriors-of-chaos}.ts` — migrate tier+type `customWeapon` calls to `meleeWeapon`.
- `src/data/factions/fantasy/*.ts` (all 16) — attach the `Sergeant`/`Musician`/`Standard` rule to their `gear(...)` calls.
- No schema/type changes; no UI changes (existing `RuleChips`/`RuleTooltip` components already render any equipment entry's `rules` — this is purely a data-fidelity fix).
