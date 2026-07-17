## ADDED Requirements

### Requirement: Age of Fantasy mount rule inheritance

The system SHALL mark every equipment entry granted by a "Mount on:"-style upgrade option (or an equivalent single-mount option) as a mount (`EquipmentEntry.isMount`), and a unit's effective special rules SHALL include every special rule carried by its currently-selected mount(s), exactly as if those rules belonged to the unit itself, per `one-page-fantasy-rules.md`'s "Mounts" special rule.

#### Scenario: A mount's non-Tough special rules are inherited by the mounted unit

- **WHEN** a unit selects a mount option whose equipment carries special rules other than Tough (e.g. Fast, Nimble, Flying, Armored, Fear, Impact(N), Regeneration)
- **THEN** the unit's effective special rules include each of those rules, in addition to the unit's own baseline special rules

#### Scenario: Tough values are summed, not replaced

- **WHEN** a unit with a baseline `Tough(N)` special rule selects a mount whose equipment carries `Tough(M)`
- **THEN** the unit's effective special rules show a single `Tough(N+M)` entry, not two separate `Tough` entries and not just the higher of the two

#### Scenario: A mount's weapon rules stay scoped to that weapon

- **WHEN** a unit's selected mount grants a weapon with its own rules (e.g. `Piercing` on `Master Claws`)
- **THEN** that rule stays attached to the weapon entry and is not duplicated into the unit's special rules list

#### Scenario: Non-mount gear grants are not promoted to unit-wide special rules

- **WHEN** a unit selects a non-mount gear-granting option (e.g. Sergeant, Musician, Standard, Fiery Breath)
- **THEN** the granted rule is not added to the unit's effective special rules list, unchanged from today's behavior — only equipment entries marked as a mount are inherited this way
