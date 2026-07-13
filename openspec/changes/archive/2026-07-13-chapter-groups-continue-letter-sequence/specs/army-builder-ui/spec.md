## ADDED Requirements

### Requirement: Chapter units' own upgrade groups display with a continuing letter

For a Space Marines list with a chapter selected, a chapter's own extra unit's own upgrade group heading SHALL show its computed display letter (continuing the base Space Marines faction's own lettering sequence), not its internal namespaced id, in both a selected unit's upgrade controls and the read-only roster Details panel.

#### Scenario: A chapter unit's own group heading shows a continuing letter, not its internal id

- **WHEN** the user views a Blood Angels list's selected Death Company unit's upgrade controls
- **THEN** its own upgrade group headings show single letters (e.g. "P. Replace any Pistol"), not the internal namespaced id (e.g. not "ba-b. Replace any Pistol")

#### Scenario: The roster Details panel shows the same continuing letter

- **WHEN** the user expands a chapter unit's read-only roster Details panel
- **THEN** its own upgrade group headings show the same continuing letter as the selected-unit upgrade controls would
