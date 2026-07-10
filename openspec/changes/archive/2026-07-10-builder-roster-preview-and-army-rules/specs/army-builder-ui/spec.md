## MODIFIED Requirements

### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. Hovering or focusing a roster unit SHALL show a preview of that unit's baseline equipment and special rules, so a player can see its full stat line before adding it. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, and an add control

#### Scenario: Add from the roster

- **WHEN** the user activates the add control on a roster unit
- **THEN** that unit is added to the current list and appears in the list's selected-units area

#### Scenario: Roster unit stat preview on hover

- **WHEN** the user hovers or focuses a roster unit's entry
- **THEN** a preview shows that unit's baseline equipment (with weapon rule tooltips) and special rules (with tooltips), without needing to add the unit first

#### Scenario: Hero badge

- **WHEN** a roster unit's special rules include Hero
- **THEN** the roster entry shows a "Hero" badge

#### Scenario: Psyker badge

- **WHEN** a roster unit's special rules include Psyker and do not include Hero
- **THEN** the roster entry shows a "Psyker" badge

#### Scenario: A Hero Psyker shows only the Hero badge

- **WHEN** a roster unit's special rules include both Hero and Psyker
- **THEN** the roster entry shows only the "Hero" badge, not both

### Requirement: Hover tooltips for rules

The system SHALL display the full explanatory text of a special rule, army special rule, psychic power, or weapon rule when the user hovers over its name in the builder. An upgrade option whose label names a rule it grants (the whole label, or the text before a trailing parenthetical) SHALL show the same hover tooltip on that label, before the option is even selected.

#### Scenario: Special rule tooltip

- **WHEN** the user hovers over a special-rule label such as `Fearless` on a unit
- **THEN** a tooltip shows the full rule text from the glossary

#### Scenario: Parameterized rule tooltip

- **WHEN** the user hovers over a parameterized rule such as `Tough(3)`
- **THEN** the tooltip shows the rule text together with its parameter value

#### Scenario: Weapon rule tooltip

- **WHEN** the user hovers over a weapon rule such as Piercing
- **THEN** a tooltip shows that weapon rule's full text

#### Scenario: Upgrade option tooltip for a granted army rule

- **WHEN** the user hovers over an upgrade option's label whose text names an army rule it grants (e.g. a "Battle Standard" option)
- **THEN** a tooltip shows that army rule's full text, the same as it would once the option is selected and shown on the unit

## ADDED Requirements

### Requirement: Group-deployment combine controls in the builder

The system SHALL show a control to combine a selected list entry with another entry sharing a group-deployment army rule (Conclave, Warband, Beastmaster, Court, or any future rule of the same "deploy up to N models together" shape), visible only when at least one other eligible, not-yet-full-group entry exists in the list. A group SHALL render as a single card showing its combined model count, combined cost, and a per-member roster listing each distinct member unit and count, with each member's own upgrade controls shown independently underneath. The system SHALL show a control on each member to remove it from the group.

#### Scenario: Combine control appears only when an eligible partner exists

- **WHEN** the list has two or more entries sharing a group-deployment army rule and room remains under the rule's model cap
- **THEN** a control to combine them is shown; it is not shown when no other eligible entry exists or the group is already at its model cap

#### Scenario: A group renders as one card with a member roster

- **WHEN** two or more entries are combined into a group
- **THEN** the builder shows one card with the group's combined model count, combined cost, and a roster line per distinct member unit and count

#### Scenario: Remove-from-group control is available per member

- **WHEN** a group card is displayed
- **THEN** each member shows a control to remove just that member from the group
