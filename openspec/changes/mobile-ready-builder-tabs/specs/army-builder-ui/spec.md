## ADDED Requirements

### Requirement: Mobile tab switcher for Roster and Selected Units

Below a mobile-width breakpoint, the system SHALL show a tab switcher letting the user view either the Roster or the Selected Units panel, one at a time, instead of both stacked in sequence. At and above that breakpoint, the system SHALL continue to show both panels side by side, with no tab switcher, exactly as without this requirement.

#### Scenario: Tab switcher shown below the breakpoint

- **WHEN** the builder is viewed at a mobile-width viewport
- **THEN** a tab switcher for "Roster" and "Selected Units" is shown, and only the active tab's panel is visible

#### Scenario: Switching tabs changes the visible panel

- **WHEN** the user activates the other tab in the mobile tab switcher
- **THEN** the previously-hidden panel becomes visible and the previously-visible panel becomes hidden

#### Scenario: No tab switcher at desktop width

- **WHEN** the builder is viewed at desktop width
- **THEN** no tab switcher is shown, and both the Roster and Selected Units panels are visible side by side

### Requirement: Touch-friendly control sizing in the builder

The system SHALL size the builder's interactive controls (buttons and select dropdowns, in the roster and in selected-unit cards) for comfortable touch use rather than the smallest size a mouse-oriented layout would use.

#### Scenario: Roster and selected-unit controls are touch-sized

- **WHEN** the user views a roster row or a selected-unit card
- **THEN** its buttons and select dropdowns (e.g. Details, Add, Split, Remove, Leave group, Detach, Combine/Attach/Group selects) render at the builder's touch-friendly control size, not the smallest available size

## MODIFIED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. Each roster unit SHALL show a "Details" button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment, special rules, and every available upgrade section and option with its cost (read-only — no selection controls), and activating it again collapses the panel. The expanded panel SHALL NOT repeat the unit's name, and SHALL NOT render as a bordered/boxed panel nested inside the roster row's own box — it is separated from the row above it by a divider only. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge. Below the mobile breakpoint, the roster is one of the two panels the tab switcher toggles between.

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
