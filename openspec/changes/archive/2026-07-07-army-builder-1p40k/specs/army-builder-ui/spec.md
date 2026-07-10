## ADDED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, and an add control

#### Scenario: Add from the roster

- **WHEN** the user activates the add control on a roster unit
- **THEN** that unit is added to the current list and appears in the list's selected-units area

### Requirement: Edit units and upgrades in the builder

The system SHALL display each selected unit with its effective stats and SHALL provide controls to select that unit's available upgrade options and to remove the unit.

#### Scenario: Upgrade controls reflect available groups

- **WHEN** a selected unit has upgrade-group letters
- **THEN** the builder shows the options for those groups with their point costs, and selecting one updates the unit's stats and cost

#### Scenario: Remove control

- **WHEN** the user activates a unit's remove control
- **THEN** the unit is removed from the list

### Requirement: Live totals and validation display

The system SHALL display the running point total, the points cap, the hero count, and any validation issues, updating them as the list changes.

#### Scenario: Totals update live

- **WHEN** the user adds, upgrades, or removes a unit
- **THEN** the displayed total, hero count, and validation messages update immediately

#### Scenario: Over-cap indication

- **WHEN** the list total exceeds the points cap
- **THEN** the builder visibly indicates the over-cap state

### Requirement: Hover tooltips for rules

The system SHALL display the full explanatory text of a special rule, army special rule, psychic power, or weapon rule when the user hovers over its name in the builder.

#### Scenario: Special rule tooltip

- **WHEN** the user hovers over a special-rule label such as `Fearless` on a unit
- **THEN** a tooltip shows the full rule text from the glossary

#### Scenario: Parameterized rule tooltip

- **WHEN** the user hovers over a parameterized rule such as `Tough(3)`
- **THEN** the tooltip shows the rule text together with its parameter value

#### Scenario: Weapon rule tooltip

- **WHEN** the user hovers over a weapon rule such as Piercing
- **THEN** a tooltip shows that weapon rule's full text
