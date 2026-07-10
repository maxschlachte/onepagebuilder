## MODIFIED Requirements

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
