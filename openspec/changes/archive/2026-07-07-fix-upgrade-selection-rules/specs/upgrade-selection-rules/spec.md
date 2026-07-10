## ADDED Requirements

### Requirement: Upgrade groups are organized into independently-constrained sections

Each faction's lettered upgrade group SHALL be represented as an ordered list of sections, where each section has its own title and its own selection limit (`one`, `any`, `upToTwo`, `upToThree`, or `upToFour`), instead of a single selection limit applied to the group's entire flat option list.

#### Scenario: A lettered group with multiple independent sub-choices

- **WHEN** a unit's upgrade group letter corresponds to multiple sub-choices printed in the rulebook (e.g. "Replace one Assault Rifle", "Take one Assault Rifle attachment", "Upgrade one model with one")
- **THEN** the group's data exposes each sub-choice as a distinct section with its own title and its own selection limit, not one merged option list

### Requirement: Selection limits are enforced when toggling upgrades

The system SHALL enforce each section's selection limit when the user selects an upgrade option, so the number of options selected within a section never exceeds that section's limit.

#### Scenario: Selecting an option in a "one" section

- **WHEN** the user selects an option in a section whose limit is `one` and another option in that same section is already selected
- **THEN** the previously-selected option in that section is deselected and only the newly-selected option remains checked

#### Scenario: Selecting an option in an "any" section

- **WHEN** the user selects an option in a section whose limit is `any`
- **THEN** the option is added to the unit's selections without affecting any other selected option in that section

#### Scenario: Reaching a numeric cap

- **WHEN** the user attempts to select an additional option in a section whose limit is `upToTwo`, `upToThree`, or `upToFour`, and the number of already-selected options in that section equals the limit
- **THEN** the new selection is rejected and the previously-selected options in that section remain unchanged

#### Scenario: Deselecting always succeeds

- **WHEN** the user deselects an already-selected option in any section, regardless of that section's limit
- **THEN** the option is removed from the unit's selections

### Requirement: Builder UI reflects each section's selection limit

The builder SHALL render each upgrade group's sections separately, with input controls that visually and functionally match each section's selection limit.

#### Scenario: "One" sections render as mutually exclusive

- **WHEN** the builder displays a section whose limit is `one`
- **THEN** its options are rendered as mutually-exclusive controls (only one can be checked at a time within that section)

#### Scenario: Capped sections disable further selection at the limit

- **WHEN** the builder displays a section whose limit is `upToTwo`, `upToThree`, or `upToFour` and the user has already selected that many options in the section
- **THEN** the remaining unselected options in that section are shown disabled until the user deselects one

#### Scenario: Section titles are shown individually

- **WHEN** the builder displays a unit's upgrade group with more than one section
- **THEN** each section's own title is shown above its options, rather than a single combined title for the whole letter group

### Requirement: Imported lists cannot violate section selection limits

The JSON import validator SHALL reject a list whose selected-upgrades for a unit select more options within a single section than that section's limit allows.

#### Scenario: Import exceeding a section's cap

- **WHEN** an imported list's `selectedUpgrades` for a unit include more options from the same `one`/`upToTwo`/`upToThree`/`upToFour` section than that section's limit permits
- **THEN** the import is rejected with an error message identifying the offending unit and section
