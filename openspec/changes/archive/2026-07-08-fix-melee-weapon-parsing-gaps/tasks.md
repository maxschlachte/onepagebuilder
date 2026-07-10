## 1. Innate type rules for Powersword/Powerfist

- [x] 1.1 In `src/data/factions/helpers.ts`, add a `meleeTypeRules` map (`ccw`/`claws` → `[]`, `powersword` → `[Piercing]`, `powerfist` → `[Piercing, Rending]`) keyed on the singularized weapon-type word.
- [x] 1.2 Extend the tier-fallback resolution so that when a tier word is matched, the remainder of the name is also checked against `meleeTypeRules` and the matched type's rules are attached to the resolved weapon (defaulting to no rules for `ccw`/`claws`/unrecognized types).
- [x] 1.3 Generalize the existing `known && linkedM` inline-rule-merging branch so that whenever `known` resolves (tier fallback or exact match) and an inline parenthetical (`inner`) is present, its parsed rules are folded into the resolved weapon's `rules` array (deduplicated), regardless of whether a `Linked` prefix is present.

## 2. Bare Powersword default

- [x] 2.1 Resolve a bare `Powersword` (no tier prefix) by defaulting to the `Medium` tier, with a code comment explaining the rulebook-context assumption (Sisters of Battle "Pistol and Powersword", printed directly below "Pistol and Medium CCW").

## 3. Default melee weapon for ranged-only units

- [x] 3.1 In `src/domain/calc.ts`, after `applyUpgrades` finishes applying all upgrade effects, check whether the final `equipment` array contains any entry with `weapon.range === null`; if not, append a synthetic `{ label: 'Light CCW', count: 1, weapon: <light tier weapon from src/data/weapons.ts> }`.
- [x] 3.2 Update the 3 existing `calc.test.ts` assertions on exact equipment-label arrays (`'a "replace one X" option...'`, `'the same option only adds...'`, `'a "replace all X" option...'`) to include the new default `Light CCW` entry.

## 4. Tests for the new resolution logic

- [x] 4.1 Add `eqEntry` unit tests in `helpers.test.ts`: `Medium Powersword`/`Heavy Powersword`/`Force Powersword` carry Piercing; `Medium Powerfist`/`Master Powerfist` carry Piercing+Rending; `CCW`/`Claws` still carry no innate rules.
- [x] 4.2 Add a test for `Force Powersword (Rending)` and `Master Powerfist (Shake)` confirming both the innate and inline rules appear together on the resolved weapon.
- [x] 4.3 Add a test for bare `Powersword` resolving to Medium tier attacks (`2`) with a Piercing rule.
- [x] 4.4 Add `calc.ts` tests: a unit with no melee weapon gets a default `Light CCW` (`Melee, A1`, no rules); a unit with an existing melee weapon (baseline or added by an upgrade) does not get the default; the default disappears once an upgrade adds a real melee weapon.

## 5. Audit test for melee-weapon parsing gaps

- [x] 5.1 Add a new test file (e.g. `src/data/melee-weapon-audit.test.ts`) that walks every faction's baseline `unit.equipment` and every upgrade option's `effects.addEquipment`, collecting any entry where `.weapon` is undefined.
- [x] 5.2 Filter the collected list against a documented, commented allowlist of known non-attack "trait" labels (`Markerlight`/`Markerlights`, `Explosive Head`, `Spirit Probe`, `Digital Weapons`, `Mine Launcher`, `Sporocyst (Mine Launcher)`, `Seeker Missile`, `Spawn`, `Lasher Tendrils (Fear)`, `Lash Whips (Fear)`, `Rot Proboscis (Rending)`, `Venom Sting (Deadly)`, `Zephyrglaive (Impact(1))`, `Toxin Sacs (Poison in Melee)`, `Scything Talons (+1A in Melee)`, `Hunter-Killer Missile (Missile Launcher (Limited))`, `Incinerator (Heavy Flamer)`, `Drone (...)` variants), each with a one-line rulebook-sourced reason.
- [x] 5.3 Assert the filtered (non-allowlisted) list is empty; run the test and confirm it passes with zero remaining unexplained gaps after tasks 1–3 are implemented.

## 6. Verification

- [x] 6.1 Run the full test suite and confirm everything passes.
- [x] 6.2 Manually verify in the running app: a Powersword-equipped unit shows `(Melee, A<n>) — Piercing`; a Powerfist-equipped unit shows `— Piercing, Rending`; a ranged-only unit (e.g. Space Marines Tactical Marines) now shows a `Light CCW (Melee, A1)` line; check both the builder view and print view.
