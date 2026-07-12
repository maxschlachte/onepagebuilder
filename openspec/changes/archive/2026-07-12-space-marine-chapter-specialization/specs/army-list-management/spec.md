## MODIFIED Requirements

### Requirement: Create, edit, duplicate, and delete lists

The system SHALL allow a user to create a new army list for a chosen faction and points limit, edit an existing list, duplicate a list, and delete a list. List creation SHALL be initiated via a "Create Army List" action that opens a dialog collecting the list's name, faction, and points limit before the list is created. When the chosen faction is Space Marines, the dialog SHALL also offer an optional chapter selection (Blood Angels, Dark Angels, Grey Knights, Space Wolves, or None), defaulting to None; the chapter selector SHALL be hidden, and any previously chosen chapter reset to None, when a different faction is selected. Per-list secondary actions (rename, duplicate, export, delete) SHALL be accessible from a three-dot (⋮) menu on each saved list, and activating a saved list's row anywhere outside that menu SHALL open the list.

#### Scenario: Create a new list via dialog

- **WHEN** the user activates "Create Army List", enters a name, selects a faction, and selects a points limit in the dialog, then confirms
- **THEN** a new empty army list is created with that name, faction, and the selected points limit, it appears in the user's list of saved lists, and it opens

#### Scenario: Points limit choices are fixed steps

- **WHEN** the user opens the points-limit selector in the Create Army List dialog
- **THEN** the available choices are the fixed step values used for hero-limit thresholds (e.g. 750, 1500, 2250, 3000, ...), with no arbitrary/off-step value selectable

#### Scenario: Cancel list creation

- **WHEN** the user cancels the Create Army List dialog (via a Cancel action, backdrop, or Escape)
- **THEN** the dialog closes and no new list is created

#### Scenario: Edit an existing list

- **WHEN** the user opens a saved list and changes its name, points cap, or unit selections
- **THEN** the changes are applied to that list and its `updatedAt` timestamp is updated

#### Scenario: Open a list by activating its row

- **WHEN** the user clicks or taps a saved list's row outside of its three-dot menu
- **THEN** that list opens

#### Scenario: Three-dot menu exposes secondary actions

- **WHEN** the user clicks or taps a saved list's three-dot (⋮) menu
- **THEN** a menu opens showing Rename, Duplicate, Export, and Delete actions for that list, and the list does not open

#### Scenario: Duplicate a list

- **WHEN** the user chooses Duplicate from a list's three-dot menu
- **THEN** a new list is created with the same faction, units, and upgrade selections, a distinct id, and a name indicating it is a copy

#### Scenario: Delete a list

- **WHEN** the user chooses Delete from a list's three-dot menu and confirms
- **THEN** the list is removed from saved lists and from browser storage

#### Scenario: Rename a list

- **WHEN** the user chooses Rename from a list's three-dot menu and enters a new name
- **THEN** the list's name is updated and its `updatedAt` timestamp is updated

#### Scenario: Choose a chapter for a Space Marines list

- **WHEN** the user selects Space Marines as the faction in the Create Army List dialog and selects a chapter (e.g. Blood Angels)
- **THEN** the created list is a Space Marines list tagged with that chapter, and the chapter's extra units and rule-modifier options become available on it

#### Scenario: Space Marines list with no chapter behaves as before

- **WHEN** the user creates a Space Marines list and leaves the chapter selection at None
- **THEN** the created list has no chapter, and its available units and options are exactly the base Space Marines roster, unchanged from before chapters existed

#### Scenario: Chapter selector is hidden for non-Space-Marines factions

- **WHEN** the user selects a faction other than Space Marines in the Create Army List dialog
- **THEN** no chapter selector is shown, and any previously chosen chapter is reset to None

### Requirement: Browser persistence

The system SHALL persist all army lists in browser storage so they survive page reloads, with a versioned storage schema.

#### Scenario: Lists survive reload

- **WHEN** the user creates or edits lists and then reloads the page
- **THEN** the same lists with the same contents are present

#### Scenario: Versioned storage key

- **WHEN** lists are written to browser storage
- **THEN** they are stored under a versioned key that includes a schema-version field for future migration

#### Scenario: Legacy Space Marine Chapters lists are migrated

- **WHEN** a previously saved list referencing the retired standalone `space-marine-chapters` faction is loaded
- **THEN** it is migrated to a Space Marines list tagged with the chapter inferred from the majority of its existing units, with its unit and upgrade-selection ids remapped to resolve against that chapter's data; any of its units belonging to a different chapter than the inferred one are dropped from the migrated list rather than left unresolvable

#### Scenario: Plain Space Marines lists are unaffected by chapter migration

- **WHEN** a previously saved Space Marines list with no chapter is loaded
- **THEN** it loads unchanged, with no chapter assigned and no ids remapped

### Requirement: JSON export and import

The system SHALL allow a user to export a single army list to a JSON file and to import a previously exported JSON file back into the app, validating it against the schema and rules database. A Space Marines list's chosen chapter, if any, SHALL be included in its exported JSON and validated on import.

#### Scenario: Export a list

- **WHEN** the user exports a list
- **THEN** the browser downloads a `.json` file containing that list's name, faction, points cap, and unit/upgrade selections

#### Scenario: Export includes the chosen chapter

- **WHEN** the user exports a Space Marines list that has a chapter selected
- **THEN** the exported JSON includes that chapter

#### Scenario: Import a valid list

- **WHEN** the user imports a JSON file previously exported by the app
- **THEN** the list is added to saved lists and its units and upgrades resolve correctly against the rules database

#### Scenario: Import validates the chapter field

- **WHEN** the user imports a JSON file whose chapter field names an unknown chapter, or names a chapter while its faction is not Space Marines
- **THEN** the import is rejected with a clear error message and no partial list is added

#### Scenario: Reject an invalid list

- **WHEN** the user imports a JSON file that does not match the schema or references unknown unit or upgrade ids
- **THEN** the import is rejected with a clear error message and no partial list is added
