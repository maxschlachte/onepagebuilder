# visual-theme Specification

## Purpose
TBD - created by archiving change dossier-visual-theme. Update Purpose after archive.
## Requirements
### Requirement: Dossier color palette and typography

The app SHALL use a shared "military dossier" visual identity across all views: Oswald for headings, section labels, and button labels; Barlow Semi Condensed as the default body font; and IBM Plex Mono for numeric/stat figures (Quality, points cost, weapon range/attacks). The app SHALL use a brass/steel/blood accent palette (brass as the primary accent for headings and cost/price figures, steel for Quality figures, blood for danger/over-cap states) instead of the default Tailwind gray/blue/red palette, in both light and dark mode. Every color in this palette SHALL be expressed as a standard Tailwind color-and-shade utility class (e.g. `yellow-500`, `slate-900`, `stone-100`) rather than a custom-named theme color, so the palette's actual values are readable directly from class names without consulting `tailwind.config.js`.

#### Scenario: Headings use the display font

- **WHEN** the user views any section heading, group label, or button in the app
- **THEN** it renders in the Oswald typeface, uppercase, with letter-spacing

#### Scenario: Stat figures use the monospace font

- **WHEN** the user views a unit's Quality value, points cost, or a weapon's range/attacks figure
- **THEN** it renders in the IBM Plex Mono typeface

#### Scenario: Cost and Quality figures use their accent colors

- **WHEN** the user views a unit's or upgrade option's points cost
- **THEN** it renders in the brass accent color (`yellow-500`/`yellow-700`); a unit's Quality value renders in the steel accent color (`slate-500`)

#### Scenario: Over-cap and validation states use the blood accent

- **WHEN** the list's total points exceed its cap, or a validation issue is shown
- **THEN** the warning is rendered using the blood accent color (`red-800`), in place of the app's previous red accent

#### Scenario: The palette uses no custom-named theme colors

- **WHEN** `tailwind.config.js`'s `theme.extend` is read
- **THEN** it defines no custom `colors` block — every color used by the dossier theme is a stock Tailwind color-and-shade class

### Requirement: Dossier theme works in both light and dark mode

The app SHALL provide both a dark "dossier" mode (near-black panels, brass/steel/blood accents, matching `one-page-40k-army-lists.html`'s palette) and a light "parchment" mode (warm off-white panels, the same brass/steel/blood accent hues adapted for contrast on a light background), following the user's OS-level light/dark preference, consistent with the app's existing light/dark support.

#### Scenario: Dark mode matches the reference palette

- **WHEN** the user's system is set to dark mode
- **THEN** the app's page background, panel backgrounds, and borders use the near-black dossier palette (matching `one-page-40k-army-lists.html`'s `--bg`/`--panel`/`--line` values)

#### Scenario: Light mode uses a parchment adaptation of the same palette

- **WHEN** the user's system is set to light mode
- **THEN** the app's page background, panel backgrounds, and borders use a warm off-white "parchment" palette, with the same brass/steel/blood accent hues adjusted for readable contrast on a light background

### Requirement: Upgrade-group cards use the dossier card treatment

An upgrade group's divider (the group's top-of-section separator, which already carries the group's letter/id badge) SHALL render as a bordered card with a brass left-accent border, and each option row within it SHALL be separated from the next by a dotted divider, matching `one-page-40k-army-lists.html`'s `.up-card`/`.up-line` treatment.

#### Scenario: An upgrade group renders as a left-accent-bordered card

- **WHEN** the user views a unit's upgrade group (in the selected-unit panel or the read-only roster Details panel)
- **THEN** the group's divider area renders with a brass-colored left border, distinguishing it as a card rather than a plain horizontal rule

#### Scenario: Option rows within a section are separated by a dotted divider

- **WHEN** the user views a section with more than one option
- **THEN** each option row (except the last in its section) is separated from the next by a dotted bottom border

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
