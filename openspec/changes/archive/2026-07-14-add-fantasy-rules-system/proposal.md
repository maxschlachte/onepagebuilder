## Why

The app now has draft data for the *Warhammer Fantasy* faction lists (`src/data/factions/fantasy/*.ts`) alongside the existing *Warhammer 40k* (40k-style) factions, but there is no way to actually use them: the UI has a single flat faction/list model built for one system, so fantasy factions would show up mixed in with Warhammer 40k ones, using Warhammer 40k terminology (e.g. "Psyker" instead of this system's "Wizard"). A review of the fantasy data against the source transcription (`one-page-fantasy-army-lists.md`) also found it is not implementation-ready: army special rules and magic spells were extracted from a multi-column PDF and are largely garbled or missing (e.g. `orcs.ts` has an empty `armyRules` array and a single mashed-together `psychicPowers` entry), several standalone units (war machines, etc.) are missing from unit lists, and every faction's `Wizard(N)` upgrade option adds a bare numeral (`adds: ["2"]`) instead of a resolvable rule reference.

## What Changes

- Add a `GameSystem` concept (`system-40k` / `system-fantasy`) that every faction is tagged with, and a system switcher in the UI so the user picks a system before seeing factions/lists for it.
- Scope the lists view, and the Create Army List dialog's faction picker, to the currently selected system — a user only ever sees lists and factions belonging to that system.
- Split the special-rule glossary per game system (rather than one shared glossary) so Warhammer Fantasy's own rules — including `Wizard`, which is its own distinct, separately-sourced rule rather than a renamed `Psyker` — resolve to their own correct wording, since some same-named rules (e.g. `Poison`) differ in mechanic between the two systems.
- Fix the Warhammer Fantasy faction data (`src/data/factions/fantasy/*.ts`) against `one-page-fantasy-army-lists.md`: reconstruct correct `armyRules` and `psychicPowers` entries (name/cast value/text) per faction, add missing standalone units, and change every `Wizard(N)` upgrade option to add a resolvable `Psyker(N)` rule reference (fixing the bare-numeral bug) — no gameplay-facing content may be invented; anything the transcription doesn't make unambiguous is flagged rather than guessed.
- Wire the 16 Warhammer Fantasy factions into the app's rules database alongside the existing Warhammer 40k factions, tagged with the new `system-fantasy` system.
- **BREAKING**: none for end users — existing saved lists keep working unchanged (a list's system is derived from its existing `factionId`, not a new stored field).

## Capabilities

### New Capabilities
- `game-system-switching`: lets the user switch between the Warhammer 40k and Warhammer Fantasy rule systems, scoping the lists view and list-creation faction picker to the selected system, and resolving rule references against the correct system's own glossary.

### Modified Capabilities
- `rules-data`: the typed schema gains a `GameSystem` tag per faction and a per-system glossary (`RulesDatabase.glossaries`); the Warhammer Fantasy faction data is corrected to be complete and valid against its source transcription, on the same footing as the existing Warhammer 40k data.
- `army-list-management`: list creation and the saved-lists view are scoped to the active game system.
- `army-builder-ui`: the roster's caster badge shows "Psyker" or "Wizard" depending on which of the two (system-specific) caster rules the unit carries.

## Impact

- `src/domain/types.ts` — add `GameSystem` type, `Faction.system`, and change `RulesDatabase.glossary` to `RulesDatabase.glossaries: Record<GameSystem, SpecialRule[]>`.
- `src/data/index.ts` — merge the 16 fantasy factions into `rulesDatabase.factions`, each tagged `system-fantasy`; tag existing factions `system-40k`.
- `src/data/factions/fantasy/*.ts` (16 files) — corrected `armyRules`, `psychicPowers`, missing units, and `Psyker(N)` rule references.
- `src/data/glossary-fantasy.ts` (new) — Warhammer Fantasy's own special-rule glossary, sourced from `one-page-fantasy-rules.md`.
- `src/stores/lists.ts`, `src/views/ListsView.vue`, `src/components/CreateListDialog.vue` — system-switcher state and system-scoped filtering.
- No changes to `src/domain/calc.ts` scoring logic or saved-list JSON shape (fully backward compatible).
