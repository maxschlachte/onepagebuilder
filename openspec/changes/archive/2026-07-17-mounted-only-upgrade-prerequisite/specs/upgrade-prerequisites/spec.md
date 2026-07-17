## ADDED Requirements

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
