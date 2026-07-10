## MODIFIED Requirements

### Requirement: Printable army list with full stats

The system SHALL provide a print view for an army list that renders every unit's full stat line (name, size, quality, equipment with weapon profiles, and special rules) and the list's total cost. A unit's weapons SHALL be displayed in a tabular layout divided into a Ranged Weapons table (columns: quantity when the unit has more than one model, weapon name, range, attacks, rules) and a Melee Weapons table (the same columns except range, since every row is melee), each shown only when the unit has at least one weapon of that kind. Equipment entries that carry no resolvable weapon profile SHALL be listed separately, unchanged from the equipment list's existing compact style. A combined pair of Infantry-eligible units SHALL render as a single box showing their combined model count and combined cost. A Hero or Psyker attached to another unit SHALL render nested under that host unit's box rather than as its own separate box.

#### Scenario: Units render with complete stats

- **WHEN** the user opens the print view for a list
- **THEN** each unit is shown with its name, size, quality, effective equipment and weapon profiles, effective special rules, and cost, reflecting any applied upgrades

#### Scenario: List summary is shown

- **WHEN** the print view is opened
- **THEN** the list name, faction, points cap, and total cost are displayed

#### Scenario: Ranged and melee weapons render in separate tables

- **WHEN** a unit has both ranged and melee weapons in its effective equipment
- **THEN** the print view shows a Ranged Weapons table listing each ranged weapon with its range, attacks, and rules, and a separate Melee Weapons table listing each melee weapon with its attacks and rules but no range column

#### Scenario: A weapon-only table is omitted when the unit has none of that kind

- **WHEN** a unit's effective equipment has no melee weapon, or no ranged weapon
- **THEN** the print view omits the corresponding (Melee or Ranged) table entirely for that unit

#### Scenario: Quantity column reflects the unit's model count

- **WHEN** a multi-model unit's weapon table is rendered
- **THEN** each row shows the number of models carrying that weapon; a single-model unit's tables show no quantity column

#### Scenario: Non-weapon equipment is not silently dropped

- **WHEN** a unit's effective equipment includes an entry with no resolvable weapon profile (e.g. a rule-granting item like `Markerlight`)
- **THEN** that entry is still shown on the printed page, outside the weapon tables

#### Scenario: A combined pair prints as one box

- **WHEN** the printed list includes a combined pair of Infantry-eligible units
- **THEN** the print view shows one box for the pair with their combined model count and combined cost, instead of two separate boxes

#### Scenario: An attached Hero prints nested under its host

- **WHEN** the printed list includes a Hero or Psyker attached to another unit
- **THEN** the Hero/Psyker's stat block is printed nested under its host unit's box rather than as a separate top-level box
