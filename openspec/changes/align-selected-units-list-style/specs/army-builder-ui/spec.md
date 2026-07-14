## ADDED Requirements

### Requirement: Selected Units card headers match the Roster row layout

Each Selected Units card's header row SHALL use the same left-info/right-controls layout as a Roster row: identifying info (name, model count, quality, and points cost) grouped on the left in that order, and only actual controls (combine/group/attach selects, split, leave-group, detach, remove) grouped on the right. This SHALL apply to all four card shapes the Selected Units list renders: a standalone unit, a combined pair, a group-deployment card, and an attached Hero/Wizard/Psyker sub-card.

#### Scenario: A standalone selected unit's cost is part of its info group

- **WHEN** the user views a standalone unit's card in Selected Units
- **THEN** its points cost is shown in the left-hand info group alongside its name/size/quality, and the right-hand group contains only its controls (e.g. Combine/Group/Attach selects, Remove)

#### Scenario: A combined pair's cost is part of its info group

- **WHEN** the user views a combined pair's card in Selected Units
- **THEN** its combined points cost is shown in the left-hand info group, and the right-hand group contains only its Split control

#### Scenario: A group-deployment card's cost is part of its info group

- **WHEN** the user views a group-deployment card in Selected Units
- **THEN** its combined points cost is shown in the left-hand info group, and the right-hand group contains only its "Add to group…" control (when eligible candidates exist)

#### Scenario: An attached sub-card's cost is part of its info group

- **WHEN** the user views an attached Hero/Wizard/Psyker sub-card nested under its host unit
- **THEN** its points cost is shown in the left-hand info group, and the right-hand group contains only its Detach control
