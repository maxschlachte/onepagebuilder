## ADDED Requirements

### Requirement: Sections can declare a baseline-special-rule prerequisite

An upgrade section SHALL support declaring that its availability depends on the unit's *baseline* special rules — independent of any option the player has selected — via a set of required rule tokens (rule name plus level/parameter, e.g. `Psyker(1)`). This is a separate, unconditional gate from the existing selection-based prerequisites (`blockedBySelecting`, `requiresOneOfSelected`, `satisfiedByEquipment`): a section that declares this requirement is unavailable to any unit whose baseline special rules don't include a matching entry, regardless of what the player has selected elsewhere. A match requires both the rule name and its level/parameter to match exactly — a unit whose baseline rule is already at a higher level than required does not satisfy a lower-level requirement.

#### Scenario: A unit without the baseline rule cannot access the section

- **WHEN** a section declares it requires the unit's baseline special rules to include a given rule (e.g. `Psyker(1)`), and the unit's baseline special rules do not include that rule
- **THEN** the section is unavailable, regardless of the unit's other selected upgrades

#### Scenario: A unit with the matching baseline rule can access the section

- **WHEN** a section declares it requires the unit's baseline special rules to include a given rule, and the unit's baseline special rules include that exact rule
- **THEN** the section is available (subject to any other prerequisite clauses it also declares)

#### Scenario: A higher baseline level does not satisfy a lower-level requirement

- **WHEN** a section requires the unit's baseline special rules to include a rule at a specific level (e.g. `Psyker(1)`), and the unit's baseline special rules include that same rule at a different level (e.g. `Psyker(2)`)
- **THEN** the section is unavailable to that unit

#### Scenario: A baseline-rule requirement cannot be satisfied by a selection

- **WHEN** a section declares a baseline-special-rule requirement, and the player has selected another option elsewhere that grants the same rule the section requires
- **THEN** the section remains unavailable, since this requirement is checked only against the unit's baseline special rules, never against selected upgrades

#### Scenario: Every "Upgrade Psyker(N)" section across every faction is gated on its matching baseline level

- **WHEN** the user views or attempts to select from any "Upgrade Psyker(N)" upgrade section, in any faction, on a unit whose baseline special rules do not include `Psyker(N)`
- **THEN** that section is unavailable to that unit, and its options cannot be selected in the builder or accepted on JSON import
