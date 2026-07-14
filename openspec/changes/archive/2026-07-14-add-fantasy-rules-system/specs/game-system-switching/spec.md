## ADDED Requirements

### Requirement: Switch between game systems

The system SHALL let the user select one of the available game systems (`Warhammer 40k`, `Warhammer Fantasy`) via a visible switcher control, and SHALL remember the selected system across reloads. The selected system SHALL default to `Warhammer 40k` for a user who has never made a selection.

#### Scenario: Switcher is visible

- **WHEN** the user views the saved-lists screen
- **THEN** a control showing both game systems is visible, with the currently selected system indicated

#### Scenario: Switching systems changes the active system

- **WHEN** the user selects the other game system from the switcher
- **THEN** that system becomes the active system and the saved-lists view and faction picker immediately reflect it

#### Scenario: Selection persists across reloads

- **WHEN** the user selects a game system and later reloads the app
- **THEN** the same game system is still selected

#### Scenario: Default system for a first-time user

- **WHEN** a user with no prior selection opens the app
- **THEN** `Warhammer 40k` is the active system

### Requirement: Saved lists are scoped to the active game system

The system SHALL show, on the saved-lists screen, only the lists whose faction belongs to the currently active game system. A list's game system SHALL be derived from its faction, not stored as separate list data, so existing saved lists remain valid without migration.

#### Scenario: Lists view filters by active system

- **WHEN** the user has saved lists in both game systems and views the saved-lists screen with `Warhammer 40k` active
- **THEN** only the lists whose faction belongs to `Warhammer 40k` are shown

#### Scenario: Switching systems changes which lists are shown

- **WHEN** the user switches the active system from `Warhammer 40k` to `Warhammer Fantasy`
- **THEN** the saved-lists screen now shows only lists whose faction belongs to `Warhammer Fantasy`

#### Scenario: A pre-existing list (created before this change) still displays correctly

- **WHEN** a saved list created before game systems existed is loaded
- **THEN** it is shown under the game system of its `factionId`'s faction, with no data migration required

### Requirement: List creation is scoped to the active game system

The system SHALL restrict the Create Army List dialog's faction picker to factions belonging to the currently active game system.

#### Scenario: Faction picker shows only the active system's factions

- **WHEN** the user opens the Create Army List dialog with `Warhammer Fantasy` active
- **THEN** the faction dropdown lists only Warhammer Fantasy factions, with no Warhammer 40k factions present

#### Scenario: A newly created list belongs to the active system

- **WHEN** the user creates a list while `Warhammer Fantasy` is active
- **THEN** the new list's faction is a Warhammer Fantasy faction, and the list subsequently appears under the Warhammer Fantasy system

### Requirement: Rule resolution uses the faction's own game system's glossary

The system SHALL resolve a special-rule reference against the glossary belonging to the referencing unit's faction's game system, never against a different system's glossary — since a rule name can carry different wording or mechanics between systems (e.g. `Poison`).

#### Scenario: A Warhammer 40k unit's rules resolve against the Warhammer 40k glossary

- **WHEN** a rule reference on a unit belonging to a Warhammer 40k faction is displayed (badge, rule chip, glossary tooltip, print reference)
- **THEN** its name and text come from the Warhammer 40k glossary

#### Scenario: An Warhammer Fantasy unit's rules resolve against the Warhammer Fantasy glossary

- **WHEN** a rule reference on a unit belonging to a Warhammer Fantasy faction is displayed
- **THEN** its name and text come from the Warhammer Fantasy glossary — e.g. a unit carrying the `Wizard` rule shows "Wizard" with Warhammer Fantasy's own casting text, not Warhammer 40k's `Psyker` text

#### Scenario: Caster-badge and spells-reference behavior applies to either system's caster rule

- **WHEN** a roster unit's special rules include Warhammer 40k's `Psyker` or Warhammer Fantasy's `Wizard` rule (and not Hero)
- **THEN** the roster entry shows a badge with that rule's own name ("Psyker" or "Wizard" respectively), and the list's psychic-powers/spells reference section is available if the faction has any
