## MODIFIED Requirements

### Requirement: Weapon profiles

The system SHALL encode weapon profiles as structured objects with an explicit range, attacks string, and rule references — never inferred by parsing a free-text equipment name. A ranged or melee weapon that appears in its game system's weapon table SHALL be referenced by that table's id — Warhammer 40k and Warhammer Fantasy SHALL each maintain their own weapon table, since some same-named weapons (e.g. `Pistol`, `Rifle`) differ in range, attacks, or rules between the two systems; a weapon whose profile is not in its system's table SHALL be constructed with an explicit range, attacks, and rules rather than embedding that profile inside a name string. The Piercing rule and the Piercing-plus-single-target-assignment combination SHALL be declared as explicit rule references at construction time rather than inferred from trailing `p`/`x` characters in a name. The `Linked` rule SHALL be declared by explicitly wrapping an equipment entry, not inferred from a `Linked ` name prefix. A close-combat weapon's attack-tier (`Light`/`Medium`/`Heavy`/`Master`/`Force`) and type (e.g. `CCW`, `Claws`, `Powersword`, `Powerfist`) SHALL each be declared as explicit construction arguments, with the type's innate rules (`Powersword` → Piercing; `Powerfist` → Piercing and Rending) resolved by direct lookup on those arguments rather than parsed out of a combined name string, and any additional rule declared alongside a melee type SHALL be merged into the same entry's rules rather than replacing the type's innate rule(s).

#### Scenario: Weapon profile fields match the PDF

- **WHEN** a weapon is constructed by referencing the global table's `battle-cannon` entry (printed as `Battle Cannon (48", A9p)`)
- **THEN** its range is `48"`, its attacks is `9`, and it carries a Piercing rule reference

#### Scenario: A weapon wrapped as Linked resolves against the global table

- **WHEN** an equipment entry is constructed by wrapping a reference to the global table's `carbine` entry with the Linked wrapper, with no custom profile given
- **THEN** its range and attacks match the global table's Carbine entry, and it carries a resolvable `Linked` rule reference

#### Scenario: A Linked weapon with a custom profile also carries the Linked rule

- **WHEN** an equipment entry is constructed by wrapping a custom weapon profile (range `24`, attacks `3`, name `Machinegun`) with the Linked wrapper
- **THEN** its range is `24"`, its attacks is `3`, and it carries a resolvable `Linked` rule reference alongside any other rules declared on the custom profile

#### Scenario: An explicit tier-and-type close-combat weapon resolves attacks from the global table

- **WHEN** a melee equipment entry is constructed with tier `Medium`/`Heavy`/`Light`/`Force` and no type (or a type with no innate rules, e.g. `CCW`/`Claws`), and no custom profile
- **THEN** its range is `null` (melee) and its attacks matches that tier's value in the global weapon table (e.g. `Medium` → `2`, `Heavy` → `3`)

#### Scenario: A Powersword carries its innate Piercing rule regardless of tier

- **WHEN** a melee equipment entry is constructed with type `Powersword` at tier `Medium`, `Heavy`, or `Force`, with no additional rules declared
- **THEN** its range is `null`, its attacks matches its tier's value, and it carries a resolvable Piercing rule reference

#### Scenario: A Powerfist carries its innate Piercing and Rending rules regardless of tier

- **WHEN** a melee equipment entry is constructed with type `Powerfist` at tier `Medium`, `Heavy`, or `Master`, with no additional rules declared
- **THEN** its range is `null`, its attacks matches its tier's value, and it carries resolvable Piercing and Rending rule references

#### Scenario: An additional declared rule on a Powersword/Powerfist entry is merged, not shadowed

- **WHEN** a melee equipment entry is constructed with type `Powersword` at tier `Force` and an additional declared Rending rule, or type `Powerfist` at tier `Master` and an additional declared Shake rule
- **THEN** the resolved weapon's rules include both the type's innate rule(s) and the additionally declared rule(s)

## ADDED Requirements

### Requirement: Warhammer Fantasy ranged weapon profiles match the Weapons table

The system SHALL derive every Warhammer Fantasy ranged weapon's range and attacks from `one-page-fantasy-rules.md`'s Weapons table (`Throwing Weapon`=12"/A1; `Pistol`=12"/A1/Piercing; `Shortbow`=18"/A1; `Fire Thrower`=18"/A6; `Bow`=24"/A1; `Rifle`=24"/A1/Piercing; `Longbow`=30"/A1; `Crossbow`=30"/A1/Piercing; `Stone Thrower`=48"/A3/Piercing; `Cannon`=48"/AD3+3/Piercing; `Bolt Thrower`=48"/A3/Piercing-plus-single-target-assignment), rather than a hardcoded or unverified value, and SHALL maintain these as a Warhammer Fantasy-specific weapon table distinct from Warhammer 40k's own weapon table, since `Pistol` and `Rifle` differ in stats between the two systems.

#### Scenario: Pistol differs between the two systems

- **WHEN** a Warhammer 40k unit's Pistol and a Warhammer Fantasy unit's Pistol are each resolved
- **THEN** the Warhammer 40k Pistol has no special rules, and the Warhammer Fantasy Pistol carries a Piercing rule reference, both with range `12"` and attacks `1`

#### Scenario: Rifle differs between the two systems

- **WHEN** a Warhammer 40k unit's Rifle and a Warhammer Fantasy unit's Rifle are each resolved
- **THEN** the Warhammer 40k Rifle has range `30"`, attacks `1`, and no special rules, and the Warhammer Fantasy Rifle has range `24"`, attacks `1`, and a Piercing rule reference

#### Scenario: A Fantasy-only standard weapon resolves correctly

- **WHEN** a Warhammer Fantasy unit's equipment includes a `Bolt Thrower`
- **THEN** its range is `48"`, its attacks is `3`, and its rules include Piercing and single-target-assignment

#### Scenario: An extra printed rule beyond the standard is preserved

- **WHEN** a Warhammer Fantasy unit's equipment includes a standard-named weapon (e.g. `Stone Thrower`) with an additional printed rule not in the base table (e.g. `Indirect`)
- **THEN** its rules include both the table's baseline rule(s) and the additional rule, with no duplicate if they overlap
