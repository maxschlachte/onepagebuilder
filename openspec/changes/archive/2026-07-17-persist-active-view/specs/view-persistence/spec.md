## ADDED Requirements

### Requirement: The active screen and list persist across reloads

The system SHALL remember which top-level screen (the builder or the print view) and which list was open, and SHALL restore that screen for that list when the app is reloaded or reopened, provided the list still exists. If no screen was open, or the previously-open list no longer exists, the system SHALL fall back to the saved-lists screen — the same screen the app shows on a completely fresh load with no prior state.

#### Scenario: Refreshing while the builder is open restores the builder for the same list

- **WHEN** the user has a list open in the builder and reloads the page
- **THEN** the app shows the builder for that same list, not the saved-lists screen

#### Scenario: Refreshing while the print view is open restores the print view for the same list

- **WHEN** the user has a list open in the print view and reloads the page
- **THEN** the app shows the print view for that same list, not the saved-lists screen

#### Scenario: A deleted list's previously-open screen falls back to the saved-lists screen

- **WHEN** the user had a list open in the builder or print view, that list is subsequently deleted (e.g. from another tab, or before the next reload), and the user then reloads the page
- **THEN** the app shows the saved-lists screen instead of an error or a broken view referencing the missing list

#### Scenario: Returning to the saved-lists screen and reloading stays on the saved-lists screen

- **WHEN** the user navigates back to the saved-lists screen (e.g. via the builder's back control) and reloads the page
- **THEN** the app shows the saved-lists screen, the same screen it would show with no prior state at all

#### Scenario: A first-time load with no prior state shows the saved-lists screen

- **WHEN** the app is loaded with no previously-persisted screen state
- **THEN** the saved-lists screen is shown, unchanged from today's default behavior
