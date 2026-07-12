## MODIFIED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. For a Space Marines list with a chapter selected, the roster SHALL also include that chapter's extra units alongside the base Space Marines units. Each roster unit SHALL show a "Details" button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment, special rules, and every available upgrade section and option with its cost (read-only — no selection controls), and activating it again collapses the panel. The expanded panel SHALL NOT repeat the unit's name, and SHALL NOT render as a bordered/boxed panel nested inside the roster row's own box — it is separated from the row above it by a divider only. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge. Below the mobile breakpoint, the roster is one of the two panels the tab switcher toggles between.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, a "Details" control, and an add control

#### Scenario: A chapter list's roster includes chapter units

- **WHEN** the user views the builder for a Space Marines list with a chapter selected
- **THEN** the roster shows the base Space Marines units plus that chapter's extra units

#### Scenario: A chapter-less Space Marines list's roster is unchanged

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** the roster shows exactly the base Space Marines units, with no chapter-specific units

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

## ADDED Requirements

### Requirement: Chapter Tactics options in the builder

For a Space Marines list with a chapter selected, the system SHALL show that chapter's rule-modifier option(s) as an additional upgrade choice on every unit the modifier applies to (by unit category — Infantry, Vehicle, Hero — or by specific unit name, per the chapter's printed modifiers), alongside the unit's normal upgrade groups, with the option's point cost and granted rule following the same display and selection behavior as any other upgrade option.

#### Scenario: A category-wide Chapter Tactics option appears on every eligible unit

- **WHEN** the user views a Blood Angels list's roster or a selected Infantry unit's upgrade controls
- **THEN** a "Furious" option at +10pts is shown, available on that unit and on every other Infantry-eligible unit in the list

#### Scenario: A named-unit Chapter Tactics option appears only on that unit

- **WHEN** the user views a Dark Angels list's selected Terminators unit
- **THEN** a "Deathwing" option at +20pts is shown on that unit, and is not shown on units other than Terminators

#### Scenario: Selecting a Chapter Tactics option updates cost and rules like any other option

- **WHEN** the user selects a Chapter Tactics option on an eligible unit
- **THEN** the unit's special rules include the granted rule and its cost includes the option's point delta, and the option's rule label shows the same hover tooltip as any other rule reference

#### Scenario: No Chapter Tactics options without a chapter

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** no Chapter Tactics options are shown on any unit
