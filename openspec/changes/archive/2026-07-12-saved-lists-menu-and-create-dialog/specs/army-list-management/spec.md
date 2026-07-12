## MODIFIED Requirements

### Requirement: Create, edit, duplicate, and delete lists

The system SHALL allow a user to create a new army list for a chosen faction and points limit, edit an existing list, duplicate a list, and delete a list. List creation SHALL be initiated via a "Create Army List" action that opens a dialog collecting the list's name, faction, and points limit before the list is created. Per-list secondary actions (rename, duplicate, export, delete) SHALL be accessible from a three-dot (⋮) menu on each saved list, and activating a saved list's row anywhere outside that menu SHALL open the list.

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
