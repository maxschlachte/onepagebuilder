# single-file-build Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Modular source project

The system SHALL be implemented as a well-structured Vue 3 + TypeScript + Tailwind project with separated concerns (rules data, domain logic, state/persistence, and presentation components), and SHALL NOT be authored as a single hand-written monolithic HTML file.

#### Scenario: Separation of concerns

- **WHEN** the source tree is inspected
- **THEN** rules data, domain logic, state/persistence, and UI components reside in distinct modules/directories rather than in one HTML file

### Requirement: Single-file production build

The build SHALL compile the project into a single self-contained `.html` file with all JavaScript and CSS inlined, requiring no external runtime assets or network access.

#### Scenario: Build emits one HTML file

- **WHEN** the production build command is run
- **THEN** the build output is a single `.html` file that contains the inlined application JS and CSS

#### Scenario: Runs offline

- **WHEN** the produced `.html` file is opened in a browser with no network connection
- **THEN** the app loads and is fully usable (browse factions, build lists, print)

### Requirement: GitHub Pages deployable

The single-file build output SHALL be servable directly via GitHub Pages without a server-side component.

#### Scenario: Served as a static page

- **WHEN** the built `.html` file is served as a static GitHub Pages site
- **THEN** the app loads and functions using only browser storage, with no backend

