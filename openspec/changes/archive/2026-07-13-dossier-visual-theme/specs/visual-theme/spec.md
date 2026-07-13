## ADDED Requirements

### Requirement: Dossier color palette and typography

The app SHALL use a shared "military dossier" visual identity across all views: Oswald for headings, section labels, and button labels; Barlow Semi Condensed as the default body font; and IBM Plex Mono for numeric/stat figures (Quality, points cost, weapon range/attacks). The app SHALL use a brass/steel/blood accent palette (brass as the primary accent for headings and cost/price figures, steel for Quality figures, blood for danger/over-cap states) instead of the default Tailwind gray/blue/red palette, in both light and dark mode.

#### Scenario: Headings use the display font

- **WHEN** the user views any section heading, group label, or button in the app
- **THEN** it renders in the Oswald typeface, uppercase, with letter-spacing

#### Scenario: Stat figures use the monospace font

- **WHEN** the user views a unit's Quality value, points cost, or a weapon's range/attacks figure
- **THEN** it renders in the IBM Plex Mono typeface

#### Scenario: Cost and Quality figures use their accent colors

- **WHEN** the user views a unit's or upgrade option's points cost
- **THEN** it renders in the brass accent color; a unit's Quality value renders in the steel accent color

#### Scenario: Over-cap and validation states use the blood accent

- **WHEN** the list's total points exceed its cap, or a validation issue is shown
- **THEN** the warning is rendered using the blood accent color, in place of the app's previous red accent

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
