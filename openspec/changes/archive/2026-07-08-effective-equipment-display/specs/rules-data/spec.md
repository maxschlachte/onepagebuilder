## MODIFIED Requirements

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules. An option whose printed effect adds, removes, or replaces a weapon SHALL record that as an equipment effect rather than only a cost delta; a "replace one/up to N" option (as opposed to "replace all") SHALL remove the replaced weapon from display only when doing so is unambiguous (the unit has exactly one model and exactly one copy of that weapon), and SHALL otherwise only add the new weapon, leaving the original in place.

#### Scenario: Upgrade option records cost delta

- **WHEN** an upgrade option such as Space Marines group A "Jump Pack (Deep Strike, Flying)" is read
- **THEN** it records a point delta of `+10` and effects that add the Deep Strike and Flying special rules

#### Scenario: Units reference their upgrade groups

- **WHEN** a unit profile lists upgrade letters (e.g. `A, H`)
- **THEN** those letters resolve to that faction's corresponding upgrade groups

#### Scenario: A weapon-replacing option on a single-model unit swaps the displayed weapon

- **WHEN** a "replace one X" option is selected on a unit that has exactly one model and exactly one copy of X
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead

#### Scenario: The same option on a multi-model unit adds without removing

- **WHEN** the same "replace one X" option is selected on a unit with more than one model
- **THEN** the unit's effective equipment still includes X and now also includes the option's weapon

#### Scenario: A "replace all X" option always swaps the displayed weapon

- **WHEN** a "replace all X" option is selected, regardless of unit size
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead
