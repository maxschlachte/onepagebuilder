## Context

The rulebook's general weapons table (Rules page, "Weapons" section) prints, verbatim:

> Units without a melee weapon count as using Light CCWs/Claws.
> CCW/Claws: No special rules.
> Powersword: Counts as Piercing.
> Powerfist: Counts as Piercing and Rending.

`fix-melee-attacks-display` taught `eqEntry` to resolve a `"<Tier> <Type>"` melee name (e.g. `Medium CCW`) against the global attack-tier table by matching the leading tier word, attaching the tier's bare `Weapon` object (`range: null`, `attacks` per tier, `rules: []`). That fix was correct for `CCW`/`Claws` (which the rulebook says carry no special rules) but incomplete for `Powersword`/`Powerfist`, which the rulebook says always carry innate rules regardless of tier. It also didn't address the "no melee weapon at all" default, or the one label in the dataset that omits a tier entirely.

An audit script (walking every faction's baseline `UnitProfile.equipment` and every `UpgradeOption.effects.addEquipment` through `eqEntry`) found ~30 unresolved labels. Cross-referencing each against the rulebook PDF text sorted them into three buckets:

1. **Genuine gaps this change fixes**: `Powersword`/`Powerfist` combos (missing innate rules), one bare `Powersword` (Sisters of Battle), and every ranged-only unit (missing the default melee weapon).
2. **Correctly-unresolved trait items**: named melee "upgrades" that only ever grant a special rule and have no printed attacks value anywhere in the book — e.g. `Zephyrglaive (Impact(1))`, `Lasher Tendrils (Fear)`, `Lash Whips (Fear)`, `Rot Proboscis (Rending)`, `Venom Sting (Deadly)`, `Toxin Sacs (Poison in Melee)`, `Scything Talons (+1A in Melee)`. These are correctly left as rule-only entries today; this change must not regress them, and the new audit test needs to know about them so it doesn't false-positive.
3. **Out of scope**: ranged "alias to a known weapon" labels (`Incinerator (Heavy Flamer)`, `Hunter-Killer Missile (Missile Launcher (Limited))`, `Seeker Missile`, `Sporocyst (Mine Launcher)`) and Tau's `Drone (X)` compounds. Neither is a melee weapon; both need a different parsing feature (or data-model change, for Drone) than this change is scoped to build.

## Goals / Non-Goals

**Goals:**
- Every tier-prefixed melee weapon (`CCW`, `Claws`, `Powersword`, `Powerfist`) resolves both its attacks/range *and* its type-mandated innate rules.
- The one bare `Powersword` label resolves with a documented, defensible tier assumption.
- Every unit's *effective* (post-upgrade) equipment always includes a melee weapon, defaulting to `Light CCW` per the rulebook when none is otherwise present.
- A committed test durably catches future melee-weapon parsing regressions, distinguishing genuine gaps from intentionally rule-only trait items.

**Non-Goals:**
- Resolving the ranged alias-to-known-weapon pattern (`Incinerator (Heavy Flamer)`, etc.) — different feature, different (non-melee) problem, left for a future change.
- Modeling `Drone (X)` as a nested sub-unit with its own equipment — requires an `EquipmentEntry` schema change beyond this change's scope.
- Adding real rulebook stats for `Mine Launcher`'s bespoke post-move-attack mechanic — it isn't a standard `(range, attacks)` weapon at all, per its own special-rule text.

## Decisions

**Split "tier" (attacks) from "type" (innate rules) as two independent lookups.** `resolveGlobalWeapon` (from the prior change) keeps finding the *tier* word (`light`/`medium`/`heavy`/`master`/`force`) for attacks/range. A new, small map — `{ powersword: [Piercing], powerfist: [Piercing, Rending] }` — is checked against the remainder of the name (after stripping the tier word, singularized) to find *type*-mandated innate rules; `ccw`/`claws` and anything unrecognized default to no innate rules, matching "CCW/Claws: No special rules" and preserving the prior change's deliberately generic (non-hardcoded) tier-matching behavior for any other/future suffix.

*Alternative considered*: enumerate full `"<Tier> <Type>"` combinations (`medium-powersword`, `heavy-powerfist`, ...) as explicit global-table entries. Rejected — same maintenance-burden argument as the prior change: a 5-tier × N-type cross product doesn't need enumerating when tier and type each independently determine one part of the profile.

**Fold inline parenthetical rules into `weapon.rules`, not `entry.rules`, whenever a weapon resolves.** Today, `EquipmentList.vue`/`PrintView.vue` show `weapon.rules` when non-empty, and only fall back to `entry.rules` when `weapon.rules` is empty (`v-if="e.weapon && e.weapon.rules.length"` / `v-else-if="e.rules && e.rules.length"`). Before this change, every tier-fallback-resolved weapon had `rules: []`, so this fallback always worked by accident. Once Powersword/Powerfist attach non-empty innate rules, any *additional* inline note (`Force Powersword (Rending)`, `Master Powerfist (Shake)`) would silently stop rendering unless folded into the same `weapon.rules` array — exactly the merge the existing `known && linkedM` branch already does for `Linked`-prefixed weapons. This change generalizes that merge to run whenever `known` resolves and `inner` exists, regardless of a `Linked` prefix.

*Alternative considered*: change `EquipmentList.vue`/`PrintView.vue` to show both `weapon.rules` and `entry.rules` together instead of either/or. Rejected — larger blast radius (touches two display components instead of one data-parsing function) for the same outcome, and the existing either/or convention already has a working precedent (the `Linked` merge) to extend instead of overturning.

**Default the bare `Powersword` (Sisters of Battle) to `Medium` tier.** The rulebook prints this option directly below "Pistol and Medium CCW" in the same list, with the same free-form omission of "Medium" implied by proximity; all other bare-type sightings in the data are always tier-prefixed. No other reading is defensible from the text alone. This is called out explicitly as an assumption (not silently guessed) via a code comment and a dedicated test.

**Apply the default melee weapon in `applyUpgrades`, not in the raw per-faction data.** The default is a *computed* consequence of a global game rule ("units without a melee weapon..."), not printed per-unit data — it belongs in the same place `EffectiveUnit.equipment` is already assembled from upgrades, so it automatically disappears once a real melee weapon is added by an upgrade, and automatically applies to every faction uniformly without editing 16 data files. Implemented as a final check after the upgrade-effects loop: if no equipment entry has `weapon.range === null`, append a synthetic `{ label: 'Light CCW', weapon: <light tier weapon> }`.

*Risk called out, not resolved differently*: the rulebook's line applies uniformly with no vehicle exception, so vehicles (which rarely assault) will also show a `Light CCW` entry. This is implemented as printed; if it reads wrong in practice it's a one-line follow-up to exclude units with the `Vehicle` rule.

**Audit test uses an explicit, commented allowlist, not a heuristic.** A regex-based "looks like a weapon name" heuristic would be fragile (it's exactly the kind of guess that caused the original bug). Instead, the test enumerates the exact labels found by this change's audit that are legitimately rule-only (bucket 2 above) with a one-line rulebook-sourced reason each, and fails on any *other* unresolved-weapon label — so a newly transcribed faction with a real parsing gap gets caught, while known trait items don't false-positive.

## Risks / Trade-offs

- **Vehicles getting a `Light CCW` entry** may look wrong cosmetically even though it's rules-accurate. → Documented above; easy follow-up if the user wants an exception.
- **The bare `Powersword` → Medium assumption** could be wrong if the original rulebook intended a different tier. → Documented inline and in a dedicated test, so it's one place to fix if corrected later.
- **The audit test's allowlist will need updating** whenever a new faction or unit introduces another legitimately rule-only trait item. → Acceptable maintenance cost; the alternative (no test) is what let this exact class of bug ship silently before.
- **Existing `calc.test.ts` assertions on exact equipment-label arrays** will gain a trailing `Light CCW` for any fixture unit with no melee weapon. → These 3 tests are updated as part of this change (not a silent behavior change hiding a red diff).

## Migration Plan

No migration needed — pure logic change in a pure function plus one computed-equipment addition, no persisted state. Existing test suite plus the new audit test validate correctness before/after.
