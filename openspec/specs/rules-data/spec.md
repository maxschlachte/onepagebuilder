# rules-data Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Typed rules schema

The system SHALL define a typed schema for the *One Page 40k* ruleset comprising factions, unit profiles, weapon profiles, upgrade groups, special rules, psychic powers, and army-composition limits. All rules content SHALL be derived exclusively from `1p40k - Main Rulebook v3.3.1.pdf`.

#### Scenario: Schema covers all rule entities

- **WHEN** the rules dataset is loaded
- **THEN** it exposes factions, a global special-rule glossary, a global weapon table, and army-composition limits as strongly-typed objects with no untyped `any` fields for core entities

#### Scenario: Data sourced only from the PDF

- **WHEN** any unit, weapon, special rule, psychic power, or point cost is added to the dataset
- **THEN** its values match the corresponding entry in `1p40k - Main Rulebook v3.3.1.pdf` and no value originates from any other source

### Requirement: Faction unit profiles

The system SHALL encode, for every faction in the rulebook, each unit's name, size, quality, equipment, special rules, available upgrade-group letters, points cost, and whether it is a Hero.

#### Scenario: All 16 factions present

- **WHEN** the dataset is queried for factions
- **THEN** it returns the 16 factions from the rulebook (Space Marines, Imperial Guard / Astra Militarum, Orks, Eldar, Chaos Space Marines, Tau, Necrons, Tyranids, Dark Eldar, Chaos Daemons, Space Marine Chapters, Sisters of Battle / Adepta Sororitas, Inquisition, Harlequins, Adeptus Mechanicus / Skitarii, Genestealer Cult)

#### Scenario: Unit profile fields match the PDF

- **WHEN** a unit profile is read (e.g. Space Marines "Captain [1]")
- **THEN** its quality, equipment, special rules (including parameters such as `Tough(3)`), upgrade letters, and cost equal the values printed in the rulebook

#### Scenario: Hero units are flagged

- **WHEN** a unit listed with the `Hero` special rule is read
- **THEN** it is marked as a Hero so the composition validator can count it against the hero limit

### Requirement: Parameterized special rules and glossary

The system SHALL store the global special-rule glossary as resolvable entries, and SHALL represent rules with numeric parameters (e.g. `Tough(X)`, `Impact(X)`, `Psyker(X)`) as references that carry both the rule identity and its value.

#### Scenario: Glossary text is resolvable

- **WHEN** a special rule reference such as `Fearless` is resolved
- **THEN** the system returns the full explanatory text for that rule as printed in the rulebook glossary

#### Scenario: Parameter is preserved

- **WHEN** a `Tough(3)` reference is resolved
- **THEN** the system returns the rule's glossary text together with the parameter value `3`

### Requirement: Weapon profiles

The system SHALL encode weapon profiles as structured objects with an explicit range, attacks string, and rule references — never inferred by parsing a free-text equipment name. A ranged or melee weapon that appears in the global weapon table SHALL be referenced by its table id; a weapon whose profile is not in the global table SHALL be constructed with an explicit range, attacks, and rules rather than embedding that profile inside a name string. The Piercing rule and the Piercing-plus-single-target-assignment combination SHALL be declared as explicit rule references at construction time rather than inferred from trailing `p`/`x` characters in a name. The `Linked` rule SHALL be declared by explicitly wrapping an equipment entry, not inferred from a `Linked ` name prefix. A close-combat weapon's attack-tier (`Light`/`Medium`/`Heavy`/`Master`/`Force`) and type (e.g. `CCW`, `Claws`, `Powersword`, `Powerfist`) SHALL each be declared as explicit construction arguments, with the type's innate rules (`Powersword` → Piercing; `Powerfist` → Piercing and Rending) resolved by direct lookup on those arguments rather than parsed out of a combined name string, and any additional rule declared alongside a melee type SHALL be merged into the same entry's rules rather than replacing the type's innate rule(s).

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

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules. An option whose printed effect adds, removes, or replaces a weapon SHALL record that as an equipment effect rather than only a cost delta. A "replace one/up to N" option (as opposed to "replace all") SHALL reduce the model-count of the replaced weapon's equipment entry by one (removing it entirely once its count reaches zero) and record the newly added weapon as carried by exactly one model, regardless of the unit's total size — matching the target entry by its stable equipment key rather than its display label, so a declaration authored once against a unit's baseline entry matches regardless of that entry's size-dependent pluralized label text (e.g. `Assault Rifle` vs `Assault Rifles`). A "replace all" option SHALL always remove every copy of the replaced weapon and record the new weapon as carried by every model in the unit, regardless of unit size, likewise matched by equipment key.

#### Scenario: Upgrade option records cost delta

- **WHEN** an upgrade option such as Space Marines group A "Jump Pack (Deep Strike, Flying)" is read
- **THEN** it records a point delta of `+10` and effects that add the Deep Strike and Flying special rules

#### Scenario: Units reference their upgrade groups

- **WHEN** a unit profile lists upgrade letters (e.g. `A, H`)
- **THEN** those letters resolve to that faction's corresponding upgrade groups

#### Scenario: A weapon-replacing option on a single-model unit swaps the displayed weapon

- **WHEN** a "replace one X" option is selected on a unit that has exactly one model and exactly one copy of X
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by that one model

#### Scenario: The same option on a multi-model unit reduces X's count and adds the new weapon

- **WHEN** the same "replace one X" option is selected on a unit with more than one model
- **THEN** the unit's effective equipment still includes X but with its model-count reduced by one, and now also includes the option's weapon carried by exactly one model

#### Scenario: A "replace all X" option always swaps the displayed weapon

- **WHEN** a "replace all X" option is selected, regardless of unit size
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by every model in the unit

#### Scenario: A replacement target matches regardless of the baseline entry's pluralized label

- **WHEN** an upgrade option declares its replacement target as the equipment key belonging to `Assault Rifle` and is selected on a unit whose baseline equipment entry carries that key but displays the label `Assault Rifles` (plural, for a multi-model unit)
- **THEN** the unit's `Assault Rifles` entry's model-count is reduced by one

### Requirement: Army-composition limits

The system SHALL encode the army-composition rules: a default points cap of 750 and the points-to-hero-limit table from the advanced rules (750→0-1, 1500→0-2, 2250→0-3, 3000→0-4, 3750→0-5, 4500→0-6, 5250→0-7, 6000→0-8).

#### Scenario: Default cap is 750

- **WHEN** a new list is created without a specified cap
- **THEN** the points cap defaults to 750

#### Scenario: Hero limit derived from points

- **WHEN** the maximum hero count is requested for a 1500-point cap
- **THEN** the system returns 2, per the composition table

