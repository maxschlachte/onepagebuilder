## ADDED Requirements

### Requirement: Create, edit, duplicate, and delete lists

The system SHALL allow a user to create a new army list for a chosen faction, edit an existing list, duplicate a list, and delete a list.

#### Scenario: Create a new list

- **WHEN** the user creates a list, names it, and selects a faction
- **THEN** a new empty army list is created with that name, faction, and the default points cap, and it appears in the user's list of saved lists

#### Scenario: Edit an existing list

- **WHEN** the user opens a saved list and changes its name, points cap, or unit selections
- **THEN** the changes are applied to that list and its `updatedAt` timestamp is updated

#### Scenario: Duplicate a list

- **WHEN** the user duplicates a list
- **THEN** a new list is created with the same faction, units, and upgrade selections, a distinct id, and a name indicating it is a copy

#### Scenario: Delete a list

- **WHEN** the user deletes a list and confirms
- **THEN** the list is removed from saved lists and from browser storage

### Requirement: Add and remove units with upgrades

The system SHALL allow a user to add units from the list's faction, remove them, and apply upgrade-group options to each added unit.

#### Scenario: Add a unit

- **WHEN** the user adds a unit from the current faction to the list
- **THEN** the unit appears in the list with its base cost and no upgrades selected

#### Scenario: Apply an upgrade

- **WHEN** the user selects an upgrade option available to a unit
- **THEN** the unit's effective equipment, special rules, and cost reflect that option's effects and point delta

#### Scenario: Remove a unit

- **WHEN** the user removes a unit from the list
- **THEN** the unit and its upgrade selections are removed and totals recompute

### Requirement: Cost and limit validation

The system SHALL compute each unit's effective cost, the list's total cost, and the hero count, and SHALL report when the list exceeds its points cap or its hero limit.

#### Scenario: Total reflects units and upgrades

- **WHEN** units and upgrades are added to a list
- **THEN** the displayed total equals the sum of each unit's base cost plus its selected upgrade point deltas

#### Scenario: Over points cap is flagged

- **WHEN** the list's total cost exceeds its points cap
- **THEN** the system reports a validation issue indicating the list is over its points cap

#### Scenario: Hero limit is flagged

- **WHEN** the list contains more Hero units than the hero limit for its points cap
- **THEN** the system reports a validation issue indicating the hero limit is exceeded

### Requirement: Browser persistence

The system SHALL persist all army lists in browser storage so they survive page reloads, with a versioned storage schema.

#### Scenario: Lists survive reload

- **WHEN** the user creates or edits lists and then reloads the page
- **THEN** the same lists with the same contents are present

#### Scenario: Versioned storage key

- **WHEN** lists are written to browser storage
- **THEN** they are stored under a versioned key that includes a schema-version field for future migration

### Requirement: JSON export and import

The system SHALL allow a user to export a single army list to a JSON file and to import a previously exported JSON file back into the app, validating it against the schema and rules database.

#### Scenario: Export a list

- **WHEN** the user exports a list
- **THEN** the browser downloads a `.json` file containing that list's name, faction, points cap, and unit/upgrade selections

#### Scenario: Import a valid list

- **WHEN** the user imports a JSON file previously exported by the app
- **THEN** the list is added to saved lists and its units and upgrades resolve correctly against the rules database

#### Scenario: Reject an invalid list

- **WHEN** the user imports a JSON file that does not match the schema or references unknown unit or upgrade ids
- **THEN** the import is rejected with a clear error message and no partial list is added
