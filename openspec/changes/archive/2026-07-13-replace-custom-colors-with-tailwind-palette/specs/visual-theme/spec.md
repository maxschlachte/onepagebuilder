## MODIFIED Requirements

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
