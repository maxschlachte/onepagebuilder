## Why

The Age of Fantasy faction files hand-type weapon profiles with `customWeapon(name, { range, attacks, rules })` instead of referencing the shared `weaponFantasy(id)` (11-entry ranged table) or `meleeWeapon(tier, type)` (shared melee-tier table) helpers that already exist for this exact purpose — and that the 40k faction files already use as the default pattern (`weapon()` outnumbers `customWeapon()` 3-6x in every 40k file). Across the 16 fantasy faction files there are 303 `customWeapon()` calls; a large fraction reproduce a `weaponsFantasy` entry or a melee tier's stats byte-for-byte, or reproduce it plus one extra rule. 10 of 16 factions never call `weaponFantasy()` at all, and 7 of 16 never call `meleeWeapon()`.

This hand-copying is a live data-quality risk, not just a style issue: `fantasy-data-quality-audit.test.ts` already has to hand-re-encode the canonical ranged table and melee tier/type-rule tables a second time as regression tests, purely to catch drift in `customWeapon()`-authored entries — and that safety net only catches weapons whose *name* happens to match a canonical one, so a renamed duplicate (e.g. "Rapid Bolt Thrower", "Harvester Cannon") escapes it entirely. Consolidating onto the reference helpers eliminates the drift class at the type/construction level for every converted entry, matching how `rules-data`'s "Weapon profiles" requirement already describes the intended architecture (reference the system's global table by id; only construct a custom profile when the weapon isn't in that table).

## What Changes

- Replace `customWeapon(...)` calls in the 16 Age of Fantasy faction files with `weaponFantasy(id, opts)` wherever the call's `range`/`attacks` exactly match a `weaponsFantasy` table entry (optionally plus extra `rules`, which `weaponFantasy`'s `opts.rules` already merges in).
- Replace `customWeapon(...)` calls with `meleeWeapon(tier, type, opts)` wherever the call is a plain `"<Tier> <Type>"` melee weapon (range `null`) whose attacks match that tier's value and whose rules match the type's innate rules (or have no innate-rule type, e.g. `CCW`/`Claws`/`Sword`/`Spear`).
- Leave `customWeapon(...)` in place for genuinely bespoke weapons: profiles that don't match any `weaponsFantasy` entry or melee tier/type combination (e.g. named special weapons like "Frost Sphere", "Chaintrap", "Fangs", faction-unique guns/breath attacks), and for melee entries whose rules diverge from what the tier/type combination would produce in a way `opts.rules` can't cleanly express (none currently known, but the conversion pass must verify case-by-case rather than assume).
- No changes to `weapons-fantasy.ts`, `weapons.ts`, `helpers.ts`, or any type in `domain/types.ts` — the reference helpers and schema already support this; this is purely an authoring-time conversion in the 16 faction data files.
- Once conversion is complete, simplify or remove the parts of `fantasy-data-quality-audit.test.ts` that exist solely to catch `customWeapon()` drift against the canonical tables (the "every standard-named custom weapon matches the Fantasy Weapons table" and "every melee weapon's attacks match its tier" checks), since converted entries are correct by construction and no longer need a parallel hand-maintained check. Any remaining check should cover only whatever bespoke `customWeapon()` usage remains.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: the "Weapon profiles" requirement already mandates referencing a system's global weapon table by id when a weapon appears in it; this change adds two explicit scenarios to that requirement calling out the fantasy-specific case (a ranged weapon matching `weaponsFantasy`, a melee weapon matching a shared tier/type) as testable acceptance criteria, since the existing requirement text and scenarios were written 40k-first and didn't make the fantasy consolidation case explicit.

## Impact

- **Affected code**: `src/data/factions/fantasy/*.ts` (all 16 files — `beastmen.ts`, `bretonnia.ts`, `daemons-of-chaos.ts`, `dark-elves.ts`, `dwarfs.ts`, `empire.ts`, `goblins.ts`, `high-elves.ts`, `lizardmen.ts`, `ogre-kingdoms.ts`, `orcs.ts`, `skaven.ts`, `tomb-kings.ts`, `vampire-counts.ts`, `warriors-of-chaos.ts`, `wood-elves.ts`).
- **Affected tests**: `src/data/fantasy-data-quality-audit.test.ts` (simplify/trim drift-detection helpers made redundant by the conversion), plus whatever snapshot/print-output tests assert on generated `label`/`key` text — converting `customWeapon("Bows", ...)` to `weaponFantasy('bow', { label: 'Bows', count: ... })` must preserve identical `label`/`key`/`count`/`unitCount` output so no unrelated test or printed army list changes.
- **Not affected**: `domain/types.ts`, `weapons-fantasy.ts`, `weapons.ts`, `factions/helpers.ts`, the 40k faction files, and any UI/print-view code — all consume the same `EquipmentEntry[]`/`Weapon` shape regardless of which builder produced it.
