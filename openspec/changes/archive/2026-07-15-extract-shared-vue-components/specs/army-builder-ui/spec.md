## ADDED Requirements

### Requirement: Shared visual primitives render consistently across contexts

The system SHALL render buttons, unit-card headlines (name, model count, quality, points cost, and badge), and equipment/special-rules blocks through shared components, so that every occurrence of a given primitive uses identical markup and styling regardless of where it appears. This SHALL hold across the Roster row, all four Selected Units card shapes (standalone unit, combined pair, group-deployment card, attached Hero/Wizard/Psyker sub-card), the roster unit "Details" preview panel, and the saved-lists/create-list screens.

#### Scenario: Buttons share one visual treatment per variant and size

- **WHEN** the user views buttons across the Roster, Selected Units, saved-lists, and Create Army List screens
- **THEN** every button of the same variant (primary/secondary/danger) and size (base/small) renders with identical classes — corner radius, padding, colors, hover state, and typography

#### Scenario: Unit headlines share one format across all card shapes

- **WHEN** the user views the Roster row and each Selected Units card shape (standalone, combined, group, attached)
- **THEN** each headline renders name, model count (when applicable), quality (when applicable), and points cost in the same order and styling, with any badge shown in the same position relative to the info text

#### Scenario: Equipment/special-rules blocks share one format

- **WHEN** the user views a unit's equipment and special rules in the roster "Details" panel or in any Selected Units card shape
- **THEN** the "Equipment:" and "Special:" lines render with identical structure and styling in both places

#### Scenario: A styling change to a shared primitive applies everywhere at once

- **WHEN** a developer changes the styling of the shared button, unit-headline, or equipment/special-rules component
- **THEN** the change is visible in every context that primitive is used, without editing more than one component file
