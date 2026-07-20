## MODIFIED Requirements

### Requirement: Parameterized special rules and glossary

The system SHALL store the global special-rule glossary as resolvable entries, and SHALL represent rules with numeric parameters (e.g. `Tough(X)`, `Impact(X)`, `Psyker(X)`) as references that carry both the rule identity and its value. Every special-rule reference present in the shipped dataset SHALL resolve to a defined rule — in its game system's glossary, in its faction's army rules, or in its faction's psychic powers — so that no reference relies on the resolver's unknown-id fallback. A rule that is transcribed as a compound or derived modifier rather than a standalone rulebook entry (e.g. `Piercing in Melee`, `+1A in Melee`) SHALL still be declared as a named glossary entry rather than left unresolvable.

#### Scenario: Glossary text is resolvable

- **WHEN** a special rule reference such as `Fearless` is resolved
- **THEN** the system returns the full explanatory text for that rule as printed in the rulebook glossary

#### Scenario: Parameter is preserved

- **WHEN** a `Tough(3)` reference is resolved
- **THEN** the system returns the rule's glossary text together with the parameter value `3`

#### Scenario: Every shipped reference resolves to a named rule

- **WHEN** every special-rule reference reachable in the dataset — a unit's `specialRules`, an equipment entry's `rules`, a weapon's `rules`, or an upgrade option's `addRules` and added-equipment rules — is resolved through the faction's own resolver
- **THEN** each resolved name is the rule's declared display name, and no resolved name is the reference's raw kebab-case id

#### Scenario: Unresolvable reference is detected by casing

- **WHEN** a reference's id has no matching glossary entry, army rule, or psychic power, and the resolver falls back to returning the id itself
- **THEN** the resulting name contains no uppercase letter, and the dataset audit fails and reports the faction and location of the offending reference

## ADDED Requirements

### Requirement: Faction-scoped rule registration

The system SHALL resolve faction-specific special rules against the referencing faction's own `armyRules`, and SHALL permit two factions to declare same-named rules independently with their own text. A rule referenced by a faction's units or upgrade options SHALL be declared on that faction rather than assumed to exist in the shared glossary.

#### Scenario: Faction rule resolves only for its own faction

- **WHEN** a faction declares an army rule and one of its units references it
- **THEN** the reference resolves to that faction's declared name and text

#### Scenario: Same-named rules coexist across factions

- **WHEN** two factions each declare a rule with the same name but different text
- **THEN** each faction's references resolve to that faction's own text, with neither overriding the other
