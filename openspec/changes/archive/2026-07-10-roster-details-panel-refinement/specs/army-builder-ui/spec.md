## MODIFIED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. Each roster unit SHALL show a "Details" button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment, special rules, and every available upgrade section and option with its cost (read-only — no selection controls), and activating it again collapses the panel. The expanded panel SHALL NOT repeat the unit's name, and SHALL NOT render as a bordered/boxed panel nested inside the roster row's own box — it is separated from the row above it by a divider only. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, a "Details" control, and an add control

#### Scenario: Add from the roster

- **WHEN** the user activates the add control on a roster unit
- **THEN** that unit is added to the current list and appears in the list's selected-units area

#### Scenario: Expand a roster unit's details panel

- **WHEN** the user activates a roster unit's "Details" control
- **THEN** an inline panel expands showing that unit's baseline equipment (with weapon rule tooltips), special rules (with tooltips), and every upgrade section/option available to it with its point cost, without needing to add the unit first

#### Scenario: The details panel has no selection controls

- **WHEN** a roster unit's details panel is expanded
- **THEN** its upgrade options are listed without checkboxes or any other selection control — activating the panel never changes the unit's (nonexistent) selection state

#### Scenario: The details panel does not repeat the unit's name or nest a box

- **WHEN** a roster unit's details panel is expanded
- **THEN** the panel does not show the unit's name again, and is not rendered as its own bordered panel inside the roster row's box

#### Scenario: Collapse an expanded details panel

- **WHEN** the user activates the "Details" control of a roster unit whose panel is already expanded
- **THEN** the panel collapses

#### Scenario: Expanding details does not add the unit, and adding does not expand details

- **WHEN** the user activates a roster unit's "Details" control, or its add control
- **THEN** only that control's own action occurs — activating "Details" never adds the unit to the list, and activating add never expands or collapses the details panel

#### Scenario: Hero badge

- **WHEN** a roster unit's special rules include Hero
- **THEN** the roster entry shows a "Hero" badge

#### Scenario: Psyker badge

- **WHEN** a roster unit's special rules include Psyker and do not include Hero
- **THEN** the roster entry shows a "Psyker" badge

#### Scenario: A Hero Psyker shows only the Hero badge

- **WHEN** a roster unit's special rules include both Hero and Psyker
- **THEN** the roster entry shows only the "Hero" badge, not both
