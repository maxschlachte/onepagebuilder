## MODIFIED Requirements

### Requirement: Sections can declare cross-section prerequisites

An upgrade section SHALL support declaring that its availability depends on which options are currently selected in other sections of the same unit, via: options that block it when selected (optionally scoped to single-model units only), and/or options that must include at least one selection for it to be available. A "requires one of selected" clause SHALL also be treated as satisfied if the unit's baseline equipment already includes a listed equipment label, without needing a matching selection.

#### Scenario: A section blocked by a selection elsewhere, on a single-model unit

- **WHEN** a section declares it is blocked by a given option, that block is scoped to single-model units, and the unit has exactly one model
- **THEN** the section becomes unavailable once that option is selected

#### Scenario: The same block does not apply to a multi-model unit

- **WHEN** a section declares a single-model-scoped block by a given option, and the unit has more than one model
- **THEN** the section remains available regardless of whether that option is selected

#### Scenario: A section requiring a prior selection

- **WHEN** a section declares it requires one of a set of option ids to be selected, and none of those options are currently selected, and the unit's baseline equipment does not satisfy the requirement either
- **THEN** the section is unavailable

#### Scenario: A section's requirement is met by a selection

- **WHEN** a section declares it requires one of a set of option ids, and at least one of them is currently selected
- **THEN** the section is available (subject to any other prerequisite clauses it also declares)

#### Scenario: A section's requirement is met by baseline equipment

- **WHEN** a section declares it requires one of a set of option ids, none of them are currently selected, and the section also declares that a given baseline-equipment label satisfies the requirement, and the unit's baseline equipment includes that label
- **THEN** the section is available (subject to any other prerequisite clauses it also declares)
