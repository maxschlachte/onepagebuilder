## Why

The app currently looks like generic default Tailwind (white/gray panels, system sans-serif, blue accent buttons) with no visual identity tying it to the 40k tabletop-rulebook material it's built around. `one-page-40k-army-lists.html` (a static transcription of the rulebook already in this repo) has a deliberate "military dossier" visual identity — near-black panels, brass/steel/blood accent colors, condensed uppercase headings (Oswald), body text in Barlow Semi Condensed, and monospaced stat/cost/quality figures (IBM Plex Mono) — that reads as a natural fit for an army-list builder. Restyling the app to match gives it a distinct, on-theme identity instead of looking like an unstyled admin tool.

## What Changes

- Add the reference's three Google Fonts (Oswald, Barlow Semi Condensed, IBM Plex Mono) and apply them app-wide: Oswald for headings/section labels/buttons, Barlow Semi Condensed as the body font (replacing the current system-sans stack), IBM Plex Mono for numeric/stat figures (points, Quality, costs, range/attacks).
- Introduce the reference's accent palette (brass/brass-dim as the primary accent, steel as a secondary accent, blood as the danger/over-cap accent) as named Tailwind colors, alongside a light-mode equivalent of the same palette (the reference is dark-only; light mode gets a parchment/warm-paper adaptation of the same brass/steel/blood accents rather than being dropped) — **both light and dark mode continue to work**, following the app's existing `dark:` variant convention.
- Reskin component chrome to match the reference's patterns: bordered panel cards, a left-accent-border treatment for upgrade-group cards (extending the existing per-group circle badge from `upgrade-section-id-badge`), uppercase letter-spaced section headings with a trailing rule (the reference's `h3.block` style), dotted separators between upgrade option lines, and monospace right-aligned cost/stat columns in tables.
- **No layout or interaction changes**: the app's existing responsive structure (roster/selected-units panels, mobile tab switcher, builder header, print view layout) is unchanged — this is a color/typography/component-chrome restyle applied on top of the existing structure, not a layout rebuild. The reference's own page layout (sidebar nav, masthead banner, multi-column reading document) is a static-document layout and is explicitly not being copied.
- **BREAKING** (internal only): a handful of existing component tests assert specific Tailwind utility class names (e.g. `div.text-xs.font-semibold.text-gray-500`, `.border-dotted`) as selectors; these need updating to match the new class names once colors change. No user-facing behavior changes.

## Capabilities

### New Capabilities

- `visual-theme`: the app's color palette, typography, and component-chrome conventions (panels, cards, tables, badges, separators) for both light and dark mode.

### Modified Capabilities

(none — this is purely presentational; no existing behavioral requirement in `army-builder-ui`, `print-view`, or `army-list-management` describes specific colors/fonts, so none of them change)

## Impact

- `tailwind.config.js`: add named colors (brass, brass-dim, steel, blood, and light/dark panel/ink tokens as needed) and font-family tokens for Oswald/Barlow Semi Condensed/IBM Plex Mono.
- `index.html` or `src/assets/main.css`: load the three Google Fonts and set the new body font-family/background defaults.
- Every component with visual styling: `src/App.vue`, `src/views/ListsView.vue`, `src/components/CreateListDialog.vue`, `src/views/BuilderView.vue`, `src/components/RosterUnitPreview.vue`, `src/components/EntryUpgradeControls.vue`, `src/components/EquipmentList.vue`, `src/components/RuleChips.vue`, `src/components/RuleTooltip.vue`, `src/views/PrintView.vue`, `src/components/PrintUnitStats.vue`, `src/components/PrintGroupStats.vue`.
- `src/components/EntryUpgradeControls.test.ts` and `src/views/integration.test.ts`: update the handful of class-name-coupled selectors (`text-gray-500`, `border-dotted`, `rounded-full`, `border-t`) to match new class names where those specific classes change.
