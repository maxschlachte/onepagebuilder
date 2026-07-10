## MODIFIED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. Each roster unit SHALL show an info button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment and special rules, and activating it again collapses the panel. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, an info control, and an add control

#### Scenario: Add from the roster

- **WHEN** the user activates the add control on a roster unit
- **THEN** that unit is added to the current list and appears in the list's selected-units area

#### Scenario: Expand a roster unit's info panel

- **WHEN** the user activates a roster unit's info control
- **THEN** an inline panel expands showing that unit's baseline equipment (with weapon rule tooltips) and special rules (with tooltips), without needing to add the unit first

#### Scenario: Collapse an expanded info panel

- **WHEN** the user activates the info control of a roster unit whose panel is already expanded
- **THEN** the panel collapses

#### Scenario: Expanding info does not add the unit, and adding does not expand info

- **WHEN** the user activates a roster unit's info control, or its add control
- **THEN** only that control's own action occurs — activating info never adds the unit to the list, and activating add never expands or collapses the info panel

#### Scenario: Hero badge

- **WHEN** a roster unit's special rules include Hero
- **THEN** the roster entry shows a "Hero" badge

#### Scenario: Psyker badge

- **WHEN** a roster unit's special rules include Psyker and do not include Hero
- **THEN** the roster entry shows a "Psyker" badge

#### Scenario: A Hero Psyker shows only the Hero badge

- **WHEN** a roster unit's special rules include both Hero and Psyker
- **THEN** the roster entry shows only the "Hero" badge, not both
