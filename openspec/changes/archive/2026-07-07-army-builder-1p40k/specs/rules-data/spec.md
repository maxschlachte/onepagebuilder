## ADDED Requirements

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

The system SHALL encode weapon profiles with range and attacks, and SHALL normalize inline weapon-rule notation (such as `p` for Piercing and `x` for the single-target rule) into resolvable rule references.

#### Scenario: Weapon profile fields match the PDF

- **WHEN** a weapon such as `Battle Cannon (48", A9p)` is read
- **THEN** its range is `48"`, its attacks is `9`, and it carries a Piercing rule reference

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules.

#### Scenario: Upgrade option records cost delta

- **WHEN** an upgrade option such as Space Marines group A "Jump Pack (Deep Strike, Flying)" is read
- **THEN** it records a point delta of `+10` and effects that add the Deep Strike and Flying special rules

#### Scenario: Units reference their upgrade groups

- **WHEN** a unit profile lists upgrade letters (e.g. `A, H`)
- **THEN** those letters resolve to that faction's corresponding upgrade groups

### Requirement: Army-composition limits

The system SHALL encode the army-composition rules: a default points cap of 750 and the points-to-hero-limit table from the advanced rules (750→0-1, 1500→0-2, 2250→0-3, 3000→0-4, 3750→0-5, 4500→0-6, 5250→0-7, 6000→0-8).

#### Scenario: Default cap is 750

- **WHEN** a new list is created without a specified cap
- **THEN** the points cap defaults to 750

#### Scenario: Hero limit derived from points

- **WHEN** the maximum hero count is requested for a 1500-point cap
- **THEN** the system returns 2, per the composition table
