# print-view Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Printable army list with full stats

The system SHALL provide a print view for an army list that renders every unit's full stat line (name, size, quality, equipment with weapon profiles, and special rules) and the list's total cost. A unit's weapons SHALL be displayed in a tabular layout divided into a Ranged Weapons table (columns: quantity when the unit has more than one model, weapon name, range, attacks, rules) and a Melee Weapons table (the same columns except range, since every row is melee), each shown only when the unit has at least one weapon of that kind. Equipment entries that carry no resolvable weapon profile SHALL be listed separately, unchanged from the equipment list's existing compact style. A combined pair of Infantry-eligible units SHALL render as a single box showing their combined model count and combined cost. A Hero or Psyker attached to another unit SHALL render nested under that host unit's box rather than as its own separate box. A group of entries combined under a shared group-deployment army rule SHALL render as a single box showing the group's combined model count, combined cost, and a roster line per distinct member unit and count.

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

#### Scenario: A group-deployment combine prints as one box with a member roster

- **WHEN** the printed list includes a group of entries combined under a shared group-deployment army rule
- **THEN** the print view shows one box for the group with its combined model count, combined cost, and a roster line per distinct member unit and count, instead of one box per member

### Requirement: Self-sufficient rule reference on the page

The system SHALL include, on the printed page, the full text of every special ability, army special rule, and weapon rule referenced by the units in the list, so that no external rulebook is needed at the table. Psychic powers referenced by the list SHALL be listed separately, in their own "Psychic Powers" section with the same layout and style, rather than mixed into the same section as special/army/weapon rules.

#### Scenario: All referenced rules are explained

- **WHEN** a list's units reference special, army, or weapon rules
- **THEN** the print view includes a Rule Reference section containing the full text of each such rule exactly once (deduplicated)

#### Scenario: No unexplained rule

- **WHEN** any special, army, or weapon rule name appears on a unit in the print view
- **THEN** that rule's full text is present in the page's Rule Reference section

#### Scenario: An army rule granted only through an upgrade still appears in the reference

- **WHEN** a list's unit has an upgrade option selected that grants an army rule (e.g. Battle Standard) rather than carrying that rule at baseline
- **THEN** that army rule's full text is present in the page's Rule Reference section, the same as any baseline special rule

#### Scenario: Psychic Powers get their own section

- **WHEN** a list contains a Psyker unit
- **THEN** the print view includes a separate "Psychic Powers" section, styled like the Rule Reference section, listing the full text of each of the faction's psychic powers exactly once

#### Scenario: No Psychic Powers section without a Psyker

- **WHEN** a list contains no Psyker unit
- **THEN** the print view shows no "Psychic Powers" section

### Requirement: Print-optimized output

The system SHALL style the print view for paper/PDF output so that a browser print or "Save as PDF" produces a clean, complete reference. The unit-box section SHALL lay its unit boxes out in two columns, with each unit box kept visually intact (never split across the column break). The Rule Reference section SHALL lay its entries out in two columns as a flowing multi-column layout, not a row-locked grid, so entries of differing length pack independently in each column instead of being paired row-by-row.

#### Scenario: Print styling applied

- **WHEN** the user invokes the browser print/save-as-PDF on the print view
- **THEN** the output omits interactive-only UI chrome and presents the stats and rule reference in a readable print layout

#### Scenario: Unit boxes render in two columns

- **WHEN** the print view renders more than one unit
- **THEN** the unit boxes are arranged in two columns rather than a single vertical stack

#### Scenario: A unit box is never split across the column break

- **WHEN** a unit box falls near the boundary between the two columns
- **THEN** the box's entire content (name, weapon tables, equipment, special rules) stays together in one column rather than being divided across the break

#### Scenario: Rule Reference entries flow in two columns, not a grid

- **WHEN** the Rule Reference section is rendered with entries of noticeably different lengths
- **THEN** the entries are arranged in two flowing columns (a shorter entry does not leave matching blank space next to a longer one in an adjacent row), rather than a row-paired grid

