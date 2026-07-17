# upgrade-prerequisites Specification

## Purpose
TBD - created by archiving change upgrade-prerequisites. Update Purpose after archive.
## Requirements
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

### Requirement: Sections can declare a baseline-special-rule prerequisite

An upgrade section SHALL support declaring that its availability depends on the unit's *baseline* special rules — independent of any option the player has selected — via a set of required rule tokens (rule name plus level/parameter, e.g. `Psyker(1)`). This is a separate, unconditional gate from the existing selection-based prerequisites (`blockedBySelecting`, `requiresOneOfSelected`, `satisfiedByEquipment`): a section that declares this requirement is unavailable to any unit whose baseline special rules don't include a matching entry, regardless of what the player has selected elsewhere. A match requires both the rule name and its level/parameter to match exactly — a unit whose baseline rule is already at a higher level than required does not satisfy a lower-level requirement.

#### Scenario: A unit without the baseline rule cannot access the section

- **WHEN** a section declares it requires the unit's baseline special rules to include a given rule (e.g. `Psyker(1)`), and the unit's baseline special rules do not include that rule
- **THEN** the section is unavailable, regardless of the unit's other selected upgrades

#### Scenario: A unit with the matching baseline rule can access the section

- **WHEN** a section declares it requires the unit's baseline special rules to include a given rule, and the unit's baseline special rules include that exact rule
- **THEN** the section is available (subject to any other prerequisite clauses it also declares)

#### Scenario: A higher baseline level does not satisfy a lower-level requirement

- **WHEN** a section requires the unit's baseline special rules to include a rule at a specific level (e.g. `Psyker(1)`), and the unit's baseline special rules include that same rule at a different level (e.g. `Psyker(2)`)
- **THEN** the section is unavailable to that unit

#### Scenario: A baseline-rule requirement cannot be satisfied by a selection

- **WHEN** a section declares a baseline-special-rule requirement, and the player has selected another option elsewhere that grants the same rule the section requires
- **THEN** the section remains unavailable, since this requirement is checked only against the unit's baseline special rules, never against selected upgrades

#### Scenario: Every "Upgrade Psyker(N)" section across every faction is gated on its matching baseline level

- **WHEN** the user views or attempts to select from any "Upgrade Psyker(N)" upgrade section, in any faction, on a unit whose baseline special rules do not include `Psyker(N)`
- **THEN** that section is unavailable to that unit, and its options cannot be selected in the builder or accepted on JSON import

### Requirement: Individual options can declare a "requires one of selected" prerequisite

An `UpgradeOption` SHALL support declaring `requiresOneOfSelected`, an array of other option ids, meaning it is only selectable while at least one of those ids is currently selected elsewhere on the same unit — independent of whichever other, unrestricted options share its section. This mirrors the existing section-level `requiresOneOfSelected` clause of `SectionPrerequisite`, one level down: where the section-level clause gates an entire section, this option-level clause gates one option within a section that also contains unrestricted alternatives. As with the section-level clause, options are authored by printed label (not id), and the label is resolved to its option id at data-load time, throwing on an unknown label; a referenced option is not required to belong to the same section or group as the option declaring the requirement.

#### Scenario: An option requiring another selection is unselectable without one

- **WHEN** the user attempts to select an option that declares `requiresOneOfSelected`, and none of the referenced option ids are currently selected on that unit
- **THEN** the selection is rejected and the unit's selected upgrades are unchanged

#### Scenario: An option requiring another selection becomes selectable once one is chosen

- **WHEN** at least one of an option's `requiresOneOfSelected` ids is currently selected on the unit, and the user then selects that option
- **THEN** the selection succeeds

#### Scenario: Removing the satisfying selection cascades to clear the dependent option

- **WHEN** a unit has both an option satisfying another option's `requiresOneOfSelected` and that dependent option selected, and the user deselects the satisfying option (and no other referenced id remains selected)
- **THEN** the dependent option is automatically removed from the unit's selected upgrades

#### Scenario: A gated option does not lock its whole section

- **WHEN** a section contains both an option that declares `requiresOneOfSelected` and other options that do not, and none of the referenced ids are currently selected
- **THEN** the unrestricted options in that section remain selectable; only the gated option is unavailable

#### Scenario: Builder UI disables a gated option whose requirement isn't met

- **WHEN** the builder displays an option that declares `requiresOneOfSelected`, and none of the referenced ids are currently selected on the unit
- **THEN** that option's control is shown disabled, without affecting the enabled state of other options in the same section

#### Scenario: Imported lists cannot select a gated option whose requirement isn't met

- **WHEN** an imported list selects an option that declares `requiresOneOfSelected` for a unit where none of the referenced ids are among that unit's other selected upgrades
- **THEN** the import is rejected with an error identifying the unit and the option

### Requirement: Every "Mounted Only" upgrade option requires one of its unit's mount options

Every upgrade option printed with a `"(Mounted Only)"` restriction SHALL declare `requiresOneOfSelected` listing every mount-granting option available to that unit (i.e. every option in that unit's own `"Mount on:"` section), so that taking any one mount satisfies the requirement.

#### Scenario: A "Mounted Only" weapon option is unavailable on an unmounted hero

- **WHEN** a unit has not selected any option from its `"Mount on:"` section, and the builder displays an option printed as `"(Mounted Only)"`
- **THEN** that option is unavailable

#### Scenario: Any one of the unit's mounts satisfies a "Mounted Only" option

- **WHEN** a unit selects any single option from its own `"Mount on:"` section
- **THEN** every `"(Mounted Only)"` option available to that unit becomes selectable, regardless of which specific mount was chosen

