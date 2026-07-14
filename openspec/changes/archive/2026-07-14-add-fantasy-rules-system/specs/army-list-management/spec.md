## ADDED Requirements

### Requirement: List creation and browsing are scoped to the active game system

The Create Army List dialog's faction selector SHALL offer only factions belonging to the currently active game system (see `game-system-switching`), and the saved-lists screen SHALL show only lists whose faction belongs to the currently active game system.

#### Scenario: Faction dropdown is scoped

- **WHEN** the user opens the Create Army List dialog while `Warhammer 40k` is the active system
- **THEN** the faction dropdown offers only Warhammer 40k factions

#### Scenario: Saved lists are scoped

- **WHEN** the user has saved lists across both game systems and views the saved-lists screen
- **THEN** only the saved lists belonging to the active game system are shown, with the count shown next to "Saved lists" reflecting only those
