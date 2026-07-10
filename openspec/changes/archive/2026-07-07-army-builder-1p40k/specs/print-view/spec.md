## ADDED Requirements

### Requirement: Printable army list with full stats

The system SHALL provide a print view for an army list that renders every unit's full stat line (name, size, quality, equipment with weapon profiles, and special rules) and the list's total cost.

#### Scenario: Units render with complete stats

- **WHEN** the user opens the print view for a list
- **THEN** each unit is shown with its name, size, quality, effective equipment and weapon profiles, effective special rules, and cost, reflecting any applied upgrades

#### Scenario: List summary is shown

- **WHEN** the print view is opened
- **THEN** the list name, faction, points cap, and total cost are displayed

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
