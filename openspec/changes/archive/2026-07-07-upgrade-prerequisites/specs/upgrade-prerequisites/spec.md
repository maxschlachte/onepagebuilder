## ADDED Requirements

### Requirement: Sections can declare cross-section prerequisites

An upgrade section SHALL support declaring that its availability depends on which options are currently selected in other sections of the same unit, via: options that block it when selected (optionally scoped to single-model units only), and/or options that must include at least one selection for it to be available.

#### Scenario: A section blocked by a selection elsewhere, on a single-model unit

- **WHEN** a section declares it is blocked by a given option, that block is scoped to single-model units, and the unit has exactly one model
- **THEN** the section becomes unavailable once that option is selected

#### Scenario: The same block does not apply to a multi-model unit

- **WHEN** a section declares a single-model-scoped block by a given option, and the unit has more than one model
- **THEN** the section remains available regardless of whether that option is selected

#### Scenario: A section requiring a prior selection

- **WHEN** a section declares it requires one of a set of option ids to be selected, and none of those options are currently selected
- **THEN** the section is unavailable

#### Scenario: A section's requirement is met

- **WHEN** a section declares it requires one of a set of option ids, and at least one of them is currently selected
- **THEN** the section is available (subject to any other prerequisite clauses it also declares)

### Requirement: The store enforces section availability when toggling upgrades

The system SHALL prevent selecting an option in a section that is currently unavailable, and SHALL automatically deselect any options that become invalid as a result of a change elsewhere.

#### Scenario: Selecting into an unavailable section is rejected

- **WHEN** the user attempts to select an option in a section that is currently unavailable per its prerequisite
- **THEN** the selection is rejected and the unit's selected upgrades are unchanged

#### Scenario: A change elsewhere cascades to clear a now-invalid selection

- **WHEN** the user selects or deselects an option such that a section containing an already-selected option becomes unavailable
- **THEN** that already-selected option is automatically removed from the unit's selected upgrades

### Requirement: Builder UI reflects unavailable sections

The builder SHALL visibly disable the controls of a section that is currently unavailable per its prerequisite, and SHALL indicate why.

#### Scenario: An unavailable section's options are disabled

- **WHEN** the builder displays a section that is currently unavailable per its prerequisite
- **THEN** that section's option controls are shown disabled, distinguishing this from a capped section that is merely full

### Requirement: Imported lists cannot violate section prerequisites

The JSON import validator SHALL reject a list whose selected upgrades include an option in a section whose prerequisite is not satisfied by the rest of that unit's selections.

#### Scenario: Import with a selection that violates a prerequisite

- **WHEN** an imported list selects an option belonging to a section whose prerequisite is not met by the unit's other selected upgrades
- **THEN** the import is rejected with an error identifying the unit and the unmet prerequisite
