## Why

"Space Marine Chapters" is currently modeled as its own standalone faction with a disjoint 19-unit roster, and the four chapters' point-cost rule modifiers (e.g. "Blood Angels: Infantry get Furious for +10pts") exist only as unselectable prose in the army-rule glossary — there is no way to actually apply them. In the real ruleset, chapters are a specialization layered on top of a Space Marines army, not a separate faction: a Space Marine list should be able to optionally pick a chapter, gain that chapter's extra units, and pay to add that chapter's rule bonuses to its eligible units.

## What Changes

- Remove "Space Marine Chapters" as a standalone, independently-selectable faction. **BREAKING**: it no longer appears in the faction picker, and its faction id is no longer resolvable on its own.
- Fold its 19 units and their upgrade groups into the Space Marines faction's data, tagged by chapter (Blood Angels, Dark Angels, Grey Knights, Space Wolves), available only when that chapter is selected on a Space Marines list.
- Add a chapter selector (Blood Angels / Dark Angels / Grey Knights / Space Wolves / None) to the Create Army List dialog, enabled only when the chosen faction is Space Marines; defaults to None.
- Apply each chapter's point-cost rule modifiers as purchasable "Chapter Tactics" upgrade options on the eligible existing Space Marines units, reusing the existing upgrade-option (cost + rule-grant) mechanism:
  - Blood Angels: Infantry units may take Furious for +10pts; Vehicle units may take Fast for +5pts.
  - Dark Angels: Terminators may take Deathwing for +20pts; Bike Squad may take Scout for +10pts; Attack Bike may take Scout for +5pts.
  - Grey Knights: Infantry units may take Aegis for +5pts; Vehicle units may take Aegis for +5pts.
  - Space Wolves: Hero units may take one Wolf for +30pts; Infantry units may take Counter-Attack for +10pts.
- When a chapter is selected, the builder's roster shows the base Space Marines units plus that chapter's extra units, and eligible units show their chapter's Chapter Tactics option(s) alongside their normal upgrade groups.
- Existing saved lists using the old `space-marine-chapters` faction id are migrated on load: reassigned to the Space Marines faction with a best-effort inferred chapter (based on which chapter its existing units belong to); existing plain Space Marines lists (no chapter) are unaffected.

## Capabilities

### New Capabilities

(none — this extends existing capabilities rather than introducing a new one)

### Modified Capabilities

- `rules-data`: "Faction unit profiles" now reflects 15 top-level factions instead of 16 (Space Marine Chapters is no longer independently listed); a new requirement covers chapter-tagged units and chapter-tactics upgrade options folded into the Space Marines faction data.
- `army-list-management`: "Create, edit, duplicate, and delete lists" gains an optional chapter selection for Space Marines lists; "Browser persistence" gains a migration scenario for legacy `space-marine-chapters` lists; "JSON export and import" carries the chapter field through export/import and validates it.
- `army-builder-ui`: "Faction selection and unit roster" shows chapter-specific units once a chapter is chosen; a new requirement covers Chapter Tactics options appearing on eligible units and their cost/rule effects.

## Impact

- `src/data/factions/space-marine-chapters.ts`: restructured from a standalone `Faction` into per-chapter unit/upgrade-group data consumed by the Space Marines faction assembly, with upgrade-group ids re-namespaced to avoid colliding with the base Space Marines faction's own group ids.
- `src/data/factions/space-marines.ts`: unchanged in its own unit/upgrade data; consumed as the base for chapter assembly.
- `src/data/index.ts`: `rulesDatabase.factions` drops the standalone `space-marine-chapters` entry (16 → 15 factions).
- New `src/data/chapters.ts` (or similar): assembles the effective Space Marines `Faction` for a given optional chapter (base units/groups/army-rules plus the chapter's units/groups/army-rules plus synthesized Chapter Tactics options), keeping `src/domain/calc.ts` and `src/domain/resolve.ts` chapter-agnostic (both already operate on a single flat `Faction`).
- `src/domain/list.ts`: `ArmyList` gains an optional `chapterId` field.
- `src/stores/lists.ts`: `createList` accepts an optional chapter; every list-scoped `getFaction(list.factionId)` call becomes chapter-aware; `validateImported` validates and carries the chapter field; `load()` migrates legacy `space-marine-chapters` lists.
- `src/components/CreateListDialog.vue`: adds a conditional chapter selector shown only for the Space Marines faction.
- `src/views/ListsView.vue`, `src/views/BuilderView.vue`, `src/views/PrintView.vue`: read the effective (chapter-aware) faction instead of the raw faction-id lookup; list summaries show the chosen chapter.
- `src/data/index.test.ts`: faction-count assertion updates from 16 to 15.
