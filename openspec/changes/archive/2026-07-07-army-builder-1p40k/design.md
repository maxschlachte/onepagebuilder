## Context

*One Page 40k* (v3.3.1) is a free single-page miniatures wargame. The rulebook PDF contains:

- A **global rules layer**: army-composition limits (default 750pts, one Hero; a points→hero-limit table scaling 750/1500/2250/… up to 6000pts → 0-1…0-8 Heroes), a weapons table (Name / Range / Attacks, with `p`=Piercing and `x`=single-target special notation), and a **special-rule glossary** (Armored, Deep Strike, Fast, Fear, Fearless, Tough(X), Impact(X), etc.).
- A **per-faction layer** (16 factions): a unit roster table — `Name [Size]`, `Quality` (e.g. `3+`), `Equipment`, `Special Rules`, `Upgrades` (letters referencing groups), `Cost` — plus lettered **upgrade groups** (each a header like *"Replace one Assault Rifle"* / *"Take one"* / *"Upgrade with any"* and a list of options with point deltas), **Army Special Rules**, and **Psychic Powers**.

The app must turn this static reference into an interactive builder that compiles to a **single HTML file** for GitHub Pages, while keeping the source code modular. All rules content is sourced **only** from the PDF.

## Goals / Non-Goals

**Goals:**
- Faithful, typed encoding of the PDF ruleset as data, decoupled from UI.
- Interactive list building with live point/hero validation.
- Browser-persisted lists (localStorage) plus JSON export/import.
- Self-contained print view (stats + full rule text on the page).
- Hover tooltips explaining every special/weapon rule.
- One-command build to a single deployable `.html`; modular source.

**Non-Goals:**
- Simulating gameplay (dice, combat resolution, turns). The app builds *lists*, it does not play the game.
- Automatically validating every nuanced upgrade legality constraint from the PDF (e.g. "you must own an Assault Rifle to replace it"). v1 surfaces upgrade options and costs; deep legality enforcement is a stretch goal.
- A backend, accounts, or cloud sync.
- Importing rules from any source other than the PDF.

## Decisions

### Stack & single-file build
Vue 3 (`<script setup>` + Composition API) + TypeScript + Tailwind CSS, bundled by **Vite**. To emit one HTML file, use **`vite-plugin-singlefile`**, which inlines JS and CSS into `index.html`. Tailwind is processed at build time so no runtime CDN is needed; the single file is fully offline-capable.
- *Alternative considered:* hand-authoring one big HTML file — rejected explicitly by the requirement (separation of concerns) and unmaintainable.
- *Alternative considered:* Tailwind Play CDN — rejected; requires network and ships unused utilities.

### Project structure (separation of concerns)
```
src/
  data/         # rules dataset extracted from the PDF (the source of truth in-app)
    factions/   # one module per faction (units, upgrade groups, army rules, psychic powers)
    glossary.ts # global special-rule glossary
    weapons.ts  # global weapon profiles
    composition.ts # points→hero-limit table, default points cap
    index.ts    # assembles + exposes the typed RulesDatabase
  domain/       # pure TS: types + logic (cost calc, validation, upgrade application)
  stores/       # Pinia (or composables) for lists + persistence
  components/   # presentational Vue components (UnitCard, RuleTooltip, …)
  views/        # BuilderView, ListsView, PrintView
  router/       # if routing; otherwise a view switch
```
- Data is plain typed objects (no Vue/DOM imports) so it can be unit-tested and reused by both UI and print view.
- *Alternative considered:* one giant JSON blob — rejected; per-faction TS modules give type-checking, references between rules, and reviewability.

### Rules data model (typed)
Core entities:
- `SpecialRule { id, name, text, hasParameter? }` — glossary entries; parameterized rules like `Tough(X)` store a base `text` and units reference them as `{ ruleId, param }`.
- `Weapon { id, name, range, attacks, rules: RuleRef[] }` — `p`/`x` and named rules normalized to rule references.
- `UnitProfile { id, factionId, name, size, quality, equipment: Weapon/RuleRef refs, specialRules: RuleRef[], upgradeGroups: string[], cost, isHero }`.
- `UpgradeGroup { id (letter), title, options: UpgradeOption[], selection: 'one'|'any'|'replace'|… }` and `UpgradeOption { label, costDelta, effects }` where `effects` add/remove weapons and special rules.
- `Faction { id, name, units, upgradeGroups, armyRules, psychicPowers }`.
- `RulesDatabase { factions, glossary, weapons, composition }`.

A `RuleRef` carries an optional numeric parameter so `Tough(3)` resolves to glossary text + the value `3`. Tooltips and the print view resolve refs → full text through one lookup service.

### Army list model & persistence
- `ArmyList { id, name, factionId, pointsCap, units: ListUnit[], createdAt, updatedAt }`; `ListUnit { unitId, selectedUpgrades }`.
- Lists live in a store, persisted to `localStorage` under a versioned key (e.g. `opr40k.lists.v1`) with a schema-version field to allow future migration.
- Derived state (per-unit cost, total cost, hero count, validation messages) is **computed** from the list + rules DB, never stored, so it can never drift.
- Export = serialize one `ArmyList` to a downloadable `.json` Blob; import = parse + validate against the schema and rules DB (unknown unit/upgrade ids are rejected with a clear error).

### Validation
Pure functions in `domain/`: `totalPoints(list)`, `heroCount(list)`, `maxHeroes(pointsCap)` (from the composition table), `validate(list)` → list of issues (over cap, too many heroes). UI shows these live; they do not block editing (informational), matching how players actually build.

### Tooltips & print view
- A single `RuleTooltip` component wraps any rule chip; on hover it resolves the `RuleRef` to glossary/army-rule/weapon text. Same resolver feeds the print view.
- `PrintView` renders each unit's full stat line and a deduplicated appendix of every special/weapon rule referenced in the list, styled with a print stylesheet (`@media print`) so a browser "Print"/"Save as PDF" yields a complete table reference.

## Risks / Trade-offs

- **PDF data-entry accuracy & volume (16 factions)** → Encode faction-by-faction with the unit roster as the spine; cross-check each unit's Special Rules and Upgrade letters against the page. Treat the dataset as the largest task and review it against the PDF images. Keep parameterized rules (`Tough(X)`, `Impact(X)`) as references so values are explicit and checkable.
- **Upgrade-group semantics are irregular** (replace/take one/take any/upgrade-with, sometimes "up to two") → Model a small set of `selection` modes covering the observed headers; render options accordingly. Accept that v1 lets a user pick options without enforcing prerequisite-ownership; flag this as a known limitation rather than mis-encode rules.
- **localStorage size/loss** → Lists are tiny (ids + selections, not full rule text); risk is low. Mitigate accidental loss with JSON export and a confirm step before delete.
- **Single-file bundle size** with all 16 factions inlined → Data is compact text; acceptable for one HTML file. If it grows large, the build still works (one file); revisit lazy data only if load time suffers.
- **Rule-text fidelity for print** → Resolver pulls text verbatim from the glossary/army-rule data so the printed page matches the encoded rules; correctness reduces to dataset correctness above.

## Open Questions

- Routing: lightweight `vue-router` (hash mode, GitHub-Pages-friendly) vs. a simple reactive view switch — both work in a single file; default to a view switch unless deep-linking to print is wanted.
- State layer: Pinia vs. plain composables — either is fine; default to a small composable-based store to keep the bundle lean.
