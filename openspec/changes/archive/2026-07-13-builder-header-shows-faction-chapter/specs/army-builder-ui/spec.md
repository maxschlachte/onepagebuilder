## ADDED Requirements

### Requirement: Builder header shows the list's faction and chapter

The builder header SHALL show the open list's faction name below the editable list-name field, and, when the list has a Space Marine chapter selected, the chapter name alongside it in parentheses — matching the "Faction Name (Chapter Name)" format already used for each list on the saved-lists screen. A list with no chapter selected, or for a faction other than Space Marines, SHALL show only the faction name.

#### Scenario: A Space Marines list with a chapter selected

- **WHEN** the user opens a Space Marines list that has a chapter selected (e.g. Blood Angels)
- **THEN** the builder header shows "Space Marines (Blood Angels)" below the list-name field

#### Scenario: A list with no chapter

- **WHEN** the user opens a Space Marines list with no chapter selected, or a list for any other faction
- **THEN** the builder header shows only the faction name below the list-name field, with no parenthetical

#### Scenario: Renaming the list does not affect the faction/chapter line

- **WHEN** the user edits the list-name field
- **THEN** the faction/chapter line below it is unaffected, since it reflects the list's faction and chapter, not its name
