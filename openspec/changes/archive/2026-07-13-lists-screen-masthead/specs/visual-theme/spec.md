## ADDED Requirements

### Requirement: Lists screen masthead

The lists screen SHALL open with a single masthead banner combining a mono "kicker" line, the page headline (with its "40k" portion in the brass accent), a short description, and the "Create Army List"/"Import JSON" actions right-aligned within the same block — matching `one-page-40k-army-lists.html`'s masthead treatment (bordered panel, subtle background gradient, faint repeating-diagonal hairline texture), adapted for both light and dark mode per the app's existing dossier/parchment theme. Any import error message SHALL appear within the masthead, in the same position relative to the actions as before this change.

#### Scenario: The masthead combines heading and actions

- **WHEN** the user views the lists screen
- **THEN** a single bordered masthead block shows the kicker line, the headline, a short description, and the "Create Army List" and "Import JSON" buttons right-aligned, with no separate heading or actions box outside it

#### Scenario: The masthead renders in both light and dark mode

- **WHEN** the user's system is set to light mode, or to dark mode
- **THEN** the masthead's border, background gradient, and text colors use the app's parchment or dossier palette respectively, matching every other themed component

#### Scenario: An import error still appears near the actions

- **WHEN** the user attempts a JSON import that fails
- **THEN** the error message appears within the masthead, in the same position relative to the import action as before this change
