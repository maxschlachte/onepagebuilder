## MODIFIED Requirements

### Requirement: Printable army list with full stats

The system SHALL provide a print view for an army list that renders every unit's full stat line (name, size, quality, equipment with weapon profiles, and special rules) and the list's total cost. A unit's weapons SHALL be displayed in a tabular layout divided into a Ranged Weapons table (columns: quantity when the unit has more than one model, weapon name, range, attacks, rules) and a Melee Weapons table (the same columns except range, since every row is melee), each shown only when the unit has at least one weapon of that kind. Equipment entries that carry no resolvable weapon profile SHALL be listed separately, unchanged from the equipment list's existing compact style.

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

### Requirement: Self-sufficient rule reference on the page

The system SHALL include, on the printed page, the full text of every special ability, army special rule, psychic power, and weapon rule referenced by the units in the list, so that no external rulebook is needed at the table.

#### Scenario: All referenced rules are explained

- **WHEN** a list's units reference special or weapon rules
- **THEN** the print view includes a reference section containing the full text of each such rule exactly once (deduplicated)

#### Scenario: No unexplained rule

- **WHEN** any rule name appears on a unit in the print view
- **THEN** that rule's full text is present in the page's reference section

### Requirement: Print-optimized output

The system SHALL style the print view for paper/PDF output so that a browser print or "Save as PDF" produces a clean, complete reference.

#### Scenario: Print styling applied

- **WHEN** the user invokes the browser print/save-as-PDF on the print view
- **THEN** the output omits interactive-only UI chrome and presents the stats and rule reference in a readable print layout
