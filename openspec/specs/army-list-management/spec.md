# army-list-management Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
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

### Requirement: Combine Infantry units and attach Heroes/Psykers

The system SHALL let a user combine two list entries of the same Infantry-eligible unit into one linked pair that displays and costs as a single bigger unit, where any upgrade option that affects all models SHALL be selected identically on both entries, while an option that affects one model or a bounded subset of models remains independently selectable on each entry. The system SHALL let a user split a combined pair back into two independent entries at any time. A unit is Infantry-eligible when its special rules do not include Hero, Psyker, Monster, or Vehicle. An upgrade option affects all models when it belongs to an upgrade section whose scope is every model in the unit (the sections the rules define as "Replace all…"/"Upgrade all models…"/"Equip all models…"), or when it belongs to a section the data explicitly marks as capped at one grant per unit regardless of model count (e.g. a Warhammer Fantasy faction's Sergeant/Musician/Standard "Upgrade with:" section) even though that section's own printed title doesn't say "all"; an option belonging to any other section — including a single-model swap, an "any"/"up to N models" section, or an unqualified single-item replacement that only ever applies to one specific model in the unit — is not whole-unit, regardless of whether it carries an equipment-replacement effect of its own. A whole-unit option's point cost SHALL be added once per linked entry it is selected on. An option belonging to a section capped at one grant per unit is an exception to this "selected identically on both entries" rule: the system SHALL record it on at most one of the two linked entries (never both), so that the combined pair's cost and any equipment that option grants are inherently counted exactly once, and so that splitting the pair afterward leaves the grant on only the entry that held it — not duplicated onto both, since the unit as a whole only ever had one such grant to begin with. It SHALL still render and toggle from the same "applies to the whole combined pair" control as a genuine whole-unit option, and remains independently purchasable again on either resulting entry once split. When the two entries' equipment is merged for display, entries that are the same item but carry different attached rules (e.g. a plain copy of a weapon and a "Limited" copy of the same weapon) SHALL remain separate entries, each with its own model count, rather than being combined into one entry that reports only one side's rules.

The system SHALL also let a user attach a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality in the same list, purely for organizational display, with no effect on cost or on points-cap/hero-limit validation, and SHALL let the user detach it at any time.

#### Scenario: Combine two copies of the same unit

- **WHEN** a list has two entries of the same Infantry-eligible unit and the user combines them
- **THEN** the two entries become a linked pair that displays as one unit with doubled model count and combined cost

#### Scenario: A whole-unit upgrade applies to both combined entries

- **WHEN** the user selects an upgrade option from a section scoped to every model in the unit (e.g. "Replace all Assault Rifles") on a combined pair
- **THEN** that option is recorded as selected on both linked entries and its point cost is added once per entry

#### Scenario: A once-per-unit upgrade is charged only once for a combined pair

- **WHEN** the user selects an option from a section the data marks as capped at one grant per unit (e.g. Sergeant) on a combined pair, via the same control a genuine whole-unit option uses
- **THEN** the option is recorded on only one of the two linked entries, and the combined pair's cost includes that option's point delta exactly once

#### Scenario: A once-per-unit upgrade's equipment is shown once for a combined pair

- **WHEN** a once-per-unit option (e.g. Sergeant) is selected on a combined pair
- **THEN** the combined pair's displayed equipment shows that option's granted equipment (e.g. the Sergeant gear entry) with a model count of one, not doubled

#### Scenario: Combining two entries that each already independently selected the same once-per-unit option collapses to one

- **WHEN** each of two entries of the same Infantry-eligible unit independently selected the same once-per-unit option before being combined (a state the app allowed prior to this fix, or a previously-saved list), and the user combines them
- **THEN** the resulting combined pair records that option on only one of the two linked entries, not both

#### Scenario: Splitting a combined pair leaves a once-per-unit upgrade on only the entry that held it

- **WHEN** a combined pair has a once-per-unit option (e.g. Sergeant) selected, and the user splits the pair back into two independent entries
- **THEN** only the one entry that actually held the selection keeps it; the other entry has none, and may independently purchase its own copy going forward

#### Scenario: A single-model upgrade stays independent per combined entry

- **WHEN** the user selects an upgrade option from a section scoped to one model or a bounded subset (e.g. "Replace one Stormbolter", "Upgrade one model with one", or an unqualified single-item section like "Replace Autocannon") on one entry of a combined pair
- **THEN** that selection applies only to the entry it was selected on, leaving the other entry's selections unaffected — even when the option carries no equipment-replacement effect of its own (e.g. a leader-only upgrade that only grants a special rule)

#### Scenario: A rule-variant of a merged equipment item stays its own entry

- **WHEN** one entry of a combined pair has a plain copy of a weapon and the other entry has a rule-bearing variant of the same weapon (e.g. a "Limited" attachment) selected
- **THEN** the combined pair's displayed equipment shows two separate entries — one for the plain copy, one for the rule-bearing variant with its rule shown — instead of merging them into one entry that omits the variant's rule

#### Scenario: Split a combined pair

- **WHEN** the user splits a combined pair
- **THEN** the two entries become independent again, each keeping its own selected upgrades

#### Scenario: Removing one entry of a combined pair splits it

- **WHEN** the user removes one entry of a combined pair from the list
- **THEN** the remaining entry becomes independent (no longer combined) rather than referencing a removed entry

#### Scenario: Attach a Hero to a same-Quality Infantry unit

- **WHEN** the user attaches a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality
- **THEN** the two entries are linked for display, with no change to either entry's cost or to the list's hero count

#### Scenario: Attaching to a mismatched target is rejected

- **WHEN** the user attempts to attach a Hero or Psyker to a list entry with a different Quality, or to a unit that is not Infantry-eligible
- **THEN** the attachment is not made

#### Scenario: Detach a Hero

- **WHEN** the user detaches a previously attached Hero or Psyker
- **THEN** the two entries are shown independently again

### Requirement: Combine units sharing a group-deployment rule

The system SHALL let a user combine up to 10 list entries whose unit profiles share a common "group-deployment" army rule — an army rule whose text says up to some number of models with that rule may deploy together as one unit (e.g. Conclave, Warband, Beastmaster, Court) — into one linked group that displays and costs as a single unit, regardless of whether the entries share the same unit id. Unlike combining two Infantry-eligible units of the same unit id, group members may be different unit types, and the combined member count (summed across each member's model count) SHALL NOT exceed the rule's stated cap. The system SHALL let a user remove a single entry from a group at any time, leaving the remaining members linked. When members' equipment is merged for display, entries that are the same item but carry different attached rules (e.g. a plain copy of a weapon and a "Limited" copy of the same weapon) SHALL remain separate entries, each with its own model count, rather than being combined into one entry that reports only one member's rules.

#### Scenario: Combine entries sharing a group-deployment rule

- **WHEN** a list has two or more entries whose unit profiles share the same group-deployment army rule (e.g. two different Inquisition Warband units) and the user combines them
- **THEN** the entries become a linked group that displays as one unit with summed model count and summed cost

#### Scenario: Entries without a shared group-deployment rule cannot combine

- **WHEN** the user attempts to combine two entries whose unit profiles share no common group-deployment army rule
- **THEN** the combination is rejected

#### Scenario: The group's model count is capped by the rule's stated limit

- **WHEN** combining an entry into a group would make the group's summed model count exceed the group-deployment rule's stated cap (e.g. 10 models)
- **THEN** the combination is rejected

#### Scenario: Remove one entry from a group

- **WHEN** the user removes a single entry from a group of 3 or more members
- **THEN** that entry becomes independent and the remaining members stay linked as a smaller group

#### Scenario: Removing a list entry that belongs to a group unlinks it cleanly

- **WHEN** the user removes a list entry that is a member of a group from the list entirely
- **THEN** the remaining group members stay linked to each other, with no reference to the removed entry

#### Scenario: A rule-variant of a merged equipment item stays its own entry in a group

- **WHEN** one group member has a plain copy of a weapon and another member has a rule-bearing variant of the same weapon (e.g. a "Limited" attachment) selected
- **THEN** the group's displayed equipment shows two separate entries — one for the plain copy, one for the rule-bearing variant with its rule shown — instead of merging them into one entry that omits the variant's rule

### Requirement: List creation and browsing are scoped to the active game system

The Create Army List dialog's faction selector SHALL offer only factions belonging to the currently active game system (see `game-system-switching`), and the saved-lists screen SHALL show only lists whose faction belongs to the currently active game system.

#### Scenario: Faction dropdown is scoped

- **WHEN** the user opens the Create Army List dialog while `Warhammer 40k` is the active system
- **THEN** the faction dropdown offers only Warhammer 40k factions

#### Scenario: Saved lists are scoped

- **WHEN** the user has saved lists across both game systems and views the saved-lists screen
- **THEN** only the saved lists belonging to the active game system are shown, with the count shown next to "Saved lists" reflecting only those

