## 1. Project scaffolding & build

- [x] 1.1 Initialize a Vite + Vue 3 + TypeScript project at the repo root with the `src/` structure from design.md (`data/`, `domain/`, `stores/`, `components/`, `views/`)
- [x] 1.2 Add and configure Tailwind CSS (build-time, no CDN) with a base stylesheet
- [x] 1.3 Add and configure `vite-plugin-singlefile` so `npm run build` emits a single self-contained `index.html` with inlined JS/CSS
- [x] 1.4 Verify the production build output is one `.html` file that opens and runs with no network access
- [x] 1.5 Add a GitHub Pages deploy path (e.g. a workflow or documented `dist/` publish) and document the build/serve steps in a README

## 2. Rules schema (types)

- [x] 2.1 Define `domain/types.ts`: `SpecialRule`, `RuleRef` (with optional numeric param), `Weapon`, `UnitProfile`, `UpgradeOption`, `UpgradeGroup`, `Faction`, `RulesDatabase`
- [x] 2.2 Define `ArmyList` and `ListUnit` types (selected upgrades, points cap, timestamps, schema version)
- [x] 2.3 Implement a rule-resolution service that turns a `RuleRef` into full text (+ parameter) from the glossary/army-rules/weapons

## 3. Global rules data (from the PDF)

- [x] 3.1 Encode the special-rule glossary in `data/glossary.ts` from the rulebook (Armored, Deep Strike, Fast, Fear, Fearless, Tough(X), Impact(X), Indirect, Linked, Piercing, Poison, Psyker(X), Rending, Scout, Strider, Transport(X), etc.)
- [x] 3.2 Encode the global weapon table in `data/weapons.ts` (Light…Lascannon) with range, attacks, and normalized `p`/`x` rule references
- [x] 3.3 Encode army-composition limits in `data/composition.ts` (default 750 cap; points→hero-limit table 750→0-1 … 6000→0-8) with a `maxHeroes(cap)` helper

## 4. Faction data (from the PDF — one task per faction page)

- [x] 4.1 Encode Space Marines: units, lettered upgrade groups, army special rules, psychic powers
- [x] 4.2 Encode Imperial Guard / Astra Militarum
- [x] 4.3 Encode Orks
- [x] 4.4 Encode Eldar
- [x] 4.5 Encode Chaos Space Marines
- [x] 4.6 Encode Tau
- [x] 4.7 Encode Necrons
- [x] 4.8 Encode Tyranids
- [x] 4.9 Encode Dark Eldar
- [x] 4.10 Encode Chaos Daemons
- [x] 4.11 Encode Space Marine Chapters (including the per-chapter modifiers)
- [x] 4.12 Encode Sisters of Battle / Adepta Sororitas
- [x] 4.13 Encode Inquisition
- [x] 4.14 Encode Harlequins
- [x] 4.15 Encode Adeptus Mechanicus / Skitarii
- [x] 4.16 Encode Genestealer Cult
- [x] 4.17 Assemble all factions + global data into the typed `RulesDatabase` in `data/index.ts`
- [x] 4.18 Cross-check the encoded dataset against the PDF pages (units, costs, special rules, upgrade letters) and fix discrepancies

## 5. Domain logic

- [x] 5.1 Implement `applyUpgrades(unit, selectedUpgrades)` → effective equipment, special rules, and cost
- [x] 5.2 Implement `totalPoints(list)`, `heroCount(list)`, and `validate(list)` (over-cap and hero-limit issues)
- [x] 5.3 Add unit tests for cost calculation, hero counting, and validation against known PDF examples

## 6. List state & persistence

- [x] 6.1 Implement a lists store (composable or Pinia) with create/edit/duplicate/delete operations
- [x] 6.2 Persist lists to `localStorage` under a versioned key; load on startup; survive reload
- [x] 6.3 Implement JSON export (download a single list) and import (parse + validate against schema and rules DB, reject unknown ids with a clear error)

## 7. Builder UI

- [x] 7.1 Build the lists overview view (create/open/duplicate/delete, with delete confirmation)
- [x] 7.2 Build the builder view: faction selection, unit roster with add controls
- [x] 7.3 Build the selected-units area: per-unit effective stats, upgrade option controls, remove control
- [x] 7.4 Build the live summary: running total, points cap, hero count, and validation messages with over-cap indication
- [x] 7.5 Build a reusable `RuleTooltip` component that resolves and shows full rule text on hover (special rules, army rules, psychic powers, weapon rules), including parameters

## 8. Print view

- [x] 8.1 Build `PrintView` rendering each unit's full stat line and weapon profiles plus the list summary
- [x] 8.2 Generate a deduplicated reference section containing the full text of every special/weapon rule referenced in the list
- [x] 8.3 Add `@media print` styling so browser print / Save-as-PDF yields a clean, complete, chrome-free reference

## 9. Verification

- [x] 9.1 Manually verify a full build flow: create a list, add units/upgrades, see validation, export/import JSON, and print — using the single-file build opened offline
- [x] 9.2 Spot-check several units' print output against the PDF to confirm stats and rule text are complete and accurate
