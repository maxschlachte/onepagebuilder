## Why

A follow-up audit (walking every faction's baseline equipment and every upgrade option's `addEquipment` through `eqEntry`) found several remaining classes of melee weapon that still don't display an attacks bracket, plus a rulebook-mandated default that the app never applies:

- **Powerswords never show their stats.** The rulebook's general weapons table states `Powersword: Counts as Piercing` and `Powerfist: Counts as Piercing and Rending` — these are *type*-based innate rules, layered on top of the tier's attack value. The tier-word fallback added in `fix-melee-attacks-display` resolves the attacks/range correctly, but it attaches the bare tier weapon object (`rules: []`), so the innate Piercing/Rending are silently missing from every Powersword and Powerfist in the game.
- **One bare `Powersword` (no tier) never resolves at all.** Sisters of Battle's "Pistol and Powersword" option (printed in the rulebook with no tier prefix, directly under a "Pistol and Medium CCW" option) doesn't match the tier-word fallback since it has no leading tier word.
- **Units with no melee weapon never show one.** The rulebook states: *"Units without a melee weapon count as using Light CCWs/Claws."* Ranged-only units (the majority of infantry squads and all vehicles) never get this default applied — their equipment list simply omits a melee line entirely, even though the rules say every unit can fight in melee.
- **No regression coverage.** Nothing currently catches a melee weapon silently failing to resolve a profile — the `fix-melee-attacks-display` change had to be caught by manual audit, not a test.

## What Changes

- `eqEntry` (`src/data/factions/helpers.ts`): recognize the melee weapon *type* word (`CCW`/`Claws` → no innate rules, `Powersword` → Piercing, `Powerfist` → Piercing + Rending) alongside the existing tier-word match, and attach the type's innate rules to the resolved weapon.
- Fold any additional inline parenthetical rule (e.g. `Force Powersword (Rending)`, `Master Powerfist (Shake)`) into the weapon's own rule list rather than a separate `entry.rules`, so it isn't hidden by the existing "show `weapon.rules` OR `entry.rules`, never both" display logic once the weapon carries its own innate rules.
- Resolve the bare Sisters of Battle `Powersword` option by defaulting an untiered melee-type name to the `Medium` tier (documented assumption — see design.md).
- `applyUpgrades` (`src/domain/calc.ts`): after applying all upgrade effects, if a unit's final equipment has no melee weapon (`weapon.range === null`), append a synthetic `Light CCW` entry, per the rulebook's stated default.
- Add a maintained audit test that walks the full rules database (every unit's baseline equipment, every upgrade option's `addEquipment`) and fails if an equipment entry that should carry a weapon profile doesn't, checked against a documented, rulebook-justified allowlist of non-attack "trait" items (e.g. `Markerlight`, `Explosive Head`, `Zephyrglaive (Impact(1))`) that intentionally have no printed attacks value.
- Update the 3 existing `calc.test.ts` assertions on exact equipment-label arrays to include the new default `Light CCW` entry where applicable.

**Out of scope** (documented in design.md as follow-up candidates, not silently dropped):
- Ranged "alias to a known weapon" labels (`Incinerator (Heavy Flamer)`, `Hunter-Killer Missile (Missile Launcher (Limited))`, `Seeker Missile`, `Sporocyst (Mine Launcher)`) — a different parsing feature (resolving an inner parenthetical that names another weapon, not a rule), and not melee weapons.
- `Drone (X)` compound labels (Tau) — represent an attached sub-model with its own loadout; the current `EquipmentEntry` model can't cleanly express a profile-in-profile.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: the "Weapon profiles" requirement gains innate type-based rules for tier-prefixed melee weapons (Powersword/Powerfist) and a documented default-tier resolution for the one bare `Powersword` label.
- `army-builder-ui`: the "Edit units and upgrades in the builder" requirement's displayed equipment list must include a default `Light CCW` entry when a unit's effective equipment has no melee weapon.

## Impact

- `src/data/factions/helpers.ts` — `eqEntry`'s global-weapon resolution.
- `src/domain/calc.ts` — `applyUpgrades`'s effective-equipment computation.
- `src/data/factions/helpers.test.ts` — new/updated unit tests.
- `src/domain/calc.test.ts` — 3 existing tests updated for the new default-equipment behavior.
- New audit test (exact location decided in design.md) covering the full rules database.
- `src/components/EquipmentList.vue` / `src/views/PrintView.vue` — no changes; both already render `(Melee, A<n>)` and rule chips correctly once a weapon profile with rules is attached.
