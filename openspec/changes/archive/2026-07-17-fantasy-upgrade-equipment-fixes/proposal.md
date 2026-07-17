## Why

Comparing all 16 Age of Fantasy faction files against `one-page-fantasy-army-lists.md` turns up two systemic, data-quality bugs that make many upgrades mechanically inert or wrong, beyond the "Mounted Only" prerequisite gap already closed in `mounted-only-upgrade-prerequisite`.

First: every "Mount on:" upgrade option (and equivalent, e.g. "Replace Chaintrap:") across every faction adds the mount via a bare `gear("Warhorse")`-style call carrying no weapon and no rules — even though the source prints every mount as its own standalone unit row with a real weapon and a special-rules list (e.g. Empire's "Warhorse [1] - Light Claws / Fast, Nimble", "Imperial Griffon [1] - Master Claws (Piercing) / Armored, Fear, Flying, Impact(D6), Tough(6)"). A player can pay up to 210pts (Dark Elves' Cauldron of Blood) for a mount and get zero combat effect: no attacks, no Flying/Fear/Tough/Impact, nothing. This affects effectively every mount option in all 16 files. The user has already hand-fixed 3 of Empire's 5 Group-A mounts (Warhorse, Imperial Pegasus, War Altar of Sigmar) as the reference pattern; Imperial Griffon and Imperial Dragon in that same section, and every mount in the other 15 factions, are still bare.

Second: several "Replace <weapon>:" upgrade sections — both single-hero ones (e.g. Orcs Group A, mistitled "Upgrade with:" for what the source calls "Replace Heavy Sword:") and unit-wide "replace all" ones (e.g. Empire Group I's "Light Maces" option for Knightly Orders, which the source prints as "Replace all Light Lances:") — omit `removeEquipment` entirely. `rules-data`'s existing "Upgrade groups" requirement already mandates that a weapon-replacing option swaps the displayed weapon rather than stacking it; these sites currently violate that requirement, letting a model end up dual-wielding its starting weapon plus the "replacement" for double the attacks.

## What Changes

- For every "Mount on:"-style upgrade option in all 16 Age of Fantasy faction files, replace the bare `gear("<Mount>")` call with the mount's actual weapon (via `meleeWeapon`/`weaponFantasy`/`customWeapon` as appropriate) plus a `gear("<Mount>", { rules: rules("...") })` (or equivalent) carrying its full special-rules list, sourced from that mount's own standalone-unit row in `one-page-fantasy-army-lists.md`. Empire's Warhorse/Imperial Pegasus/War Altar of Sigmar (Group A) are already fixed and serve as the pattern; this closes the remaining ~2 in Empire and all mounts in the other 15 factions.
- Audit every "Replace <weapon>:" section (single-model hero and unit-wide "replace all") across all 16 files: where the section's own title or the source's printed heading indicates a swap but the option(s) lack `removeEquipment` targeting the replaced item, add it (or correct a mistitled section, e.g. Orcs Group A "Upgrade with:" → "Replace Heavy Sword:", Empire Group B "Upgrade with:" → "Replace Medium Sword:", Empire Group I "Upgrade with:" → "Replace all Light Lances:").
- No changes to `helpers.ts`, `domain/types.ts`, `domain/calc.ts`, or any store/UI code — both fixes use mechanisms (`meleeWeapon`/`weaponFantasy`/`customWeapon`/`gear(..., {rules})`, `removeEquipment`) that already exist and are already exercised elsewhere in the same files.
- **BREAKING (data-quality fix)**: any saved/exported list that has a mount or a "replace" option selected will show different (correct) stats and equipment after this change — a unit with "Warhorse" selected gains Fast/Nimble it previously lacked; a unit with a starting weapon "replaced" no longer shows both weapons.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: the "Warhammer Fantasy faction data" requirement's "Standalone units match the source table" scenario is extended with a new scenario asserting that when a mount is granted via an upgrade option, the granted equipment (weapon + rules) matches that mount's own standalone-unit row — today the requirement only checks the standalone row itself exists, not that selecting it as a mount actually grants its stats. The existing "Upgrade groups" requirement's weapon-replacement scenarios are unchanged in wording; this change is a data-quality fix to bring all 16 Fantasy files into compliance with those already-stated scenarios, not a new requirement.

## Impact

- **Affected data**: all 16 files in `src/data/factions/fantasy/*.ts` — every "Mount on:"-style section gains a real weapon + rules per mount; a smaller number of "Replace <weapon>:" sections gain `removeEquipment` and/or a corrected title.
- **Affected tests**: `src/data/fantasy-data-quality-audit.test.ts` gains coverage asserting no faction has a mount-granting option whose `addEquipment` is rules-and-weapon-empty, and no "replace"-titled section has an option missing `removeEquipment`/`removeOneEquipment`.
- **Not affected**: `domain/types.ts`, `domain/calc.ts`, `stores/lists.ts`, `factions/helpers.ts`, any 40k faction data, and any UI component — all consume the same `EquipmentEntry[]` shape regardless of which builder produced it, and the fix only changes what each Fantasy option's `addEquipment`/`removeEquipment` arrays contain.
