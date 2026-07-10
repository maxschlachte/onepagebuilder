## Why

Players of *One Page 40k* (OnePageRules' single-page Warhammer 40,000 variant) currently build army lists by hand from the PDF rulebook, manually tracking point totals, hero limits, unit upgrades, and copying special-rule text onto reference sheets. This is slow and error-prone. A focused web app can enforce the army-composition rules, let players assemble and edit lists interactively, and produce a self-contained printable reference — all served for free from GitHub Pages with no backend.

## What Changes

- Introduce a Vue 3 + TypeScript + Tailwind single-page application that **compiles to one self-contained `.html` file** (via Vite's single-file build) suitable for GitHub Pages, while the source remains a well-structured, separated-concerns project (not a hand-written monolithic HTML file).
- Encode the full *One Page 40k* ruleset — extracted **exclusively from `1p40k - Main Rulebook v3.3.1.pdf`** — as typed, structured data: 16 factions with their unit profiles, weapon profiles, lettered upgrade groups, army special rules, psychic powers, the global special-rule glossary, and army-composition point/hero limits.
- Let users **create, edit, duplicate, and delete army lists**, persisted in browser storage, with live validation of the point cap and hero limit.
- Let users **export a list to JSON and import it back**, so lists are portable and shareable as files.
- Provide a **print view** that renders a list with each unit's full stat line plus the complete text of every special ability and weapon rule on the unit, so the printed page is self-sufficient at the table.
- In the interactive UI, **show special-rule / weapon-rule explanations on hover** so players never need the rulebook open while building.

## Capabilities

### New Capabilities
- `rules-data`: Typed schema and dataset for the *One Page 40k* ruleset (factions, units, weapons, upgrade groups, special rules, psychic powers, army-composition limits) extracted only from the PDF.
- `army-list-management`: Domain logic for creating/editing/duplicating/deleting lists, applying unit upgrades, computing costs, validating point and hero limits, and persisting lists in browser storage including JSON import/export.
- `army-builder-ui`: Interactive builder UI for choosing a faction, adding/removing units, applying upgrades, viewing running totals and validation, with hover tooltips that explain special and weapon rules.
- `print-view`: A print-optimized rendering of an army list containing every unit's stats and the full text of all relevant special and weapon rules.
- `single-file-build`: Build/tooling configuration that bundles the structured Vue/TS/Tailwind project into a single deployable HTML file for GitHub Pages.

### Modified Capabilities
<!-- None — this is a greenfield project. -->

## Impact

- New greenfield codebase under the project root: Vite + Vue 3 + TypeScript + Tailwind, plus build config for single-file output and a GitHub Pages deployment path.
- Source of truth for all rules data is `1p40k - Main Rulebook v3.3.1.pdf` only; no external rules sources.
- Browser `localStorage` is the persistence layer; no server, no network dependency at runtime.
- New dev dependencies: Vue 3, TypeScript, Vite, Tailwind CSS, and a Vite single-file inlining plugin.
