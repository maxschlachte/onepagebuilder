## Context

The app currently models a single flat ruleset: `RulesDatabase.factions` is one array, `getFaction(id)` scans it directly, and `ListsView`/`CreateListDialog` show every faction and every saved list with no grouping. This was fine when only Warhammer 40k (40k-style) factions existed.

Draft data for Warhammer Fantasy factions already exists at `src/data/factions/fantasy/*.ts`, written with the same `faction()`/`unit()`/`group()` builder helpers (`src/data/factions/helpers.ts`) used by the Warhammer 40k factions, transcribed from `one-page-fantasy-army-lists.md`. Comparing the draft against that transcription (sampling `empire.ts` and `orcs.ts` in full, and grepping the rest) found three classes of defects, present across most/all of the 16 files:

1. **Garbled or missing `armyRules`/`psychicPowers`.** The source PDF is multi-column; the draft's extraction jammed unrelated column fragments into single rule/spell entries (e.g. `empire.ts`'s `armyRule("Equip with one", "Repeater Handgun (24”, A3p) +15pts and it has the Rapid and Deadly rules against it. Pistol +5pts Hochland Rifle...")` mixes an upgrade-table fragment with unrelated rule text under a wrong name). Some files (`orcs.ts`) have an empty `armyRules` array entirely, with everything crammed into one `psychicPowers` entry instead.
2. **Missing standalone units.** `empire.ts`'s `units` array has 12 entries; the transcription's Empire table lists ~19 standalone units including several war machines (Great Cannon, Helstorm Battery, Helblaster Gun, Mortar, Celestial Hurricanum, Luminark of Hysh, Steam Tank) and Flagellants — none of which appear in the draft at all. Unit counts vary widely across the 16 files (9–25), suggesting this is inconsistent per faction rather than a one-off.
3. **Broken `Wizard(N)` rule references.** Every `Wizard(N)` upgrade option in every file adds a bare numeral instead of a rule reference, e.g. `{ label: "Wizard(2)", cost: 5, adds: ["2"] }`. `adds` strings are parsed by `parseRule()` (`helpers.ts`), which turns `"2"` into `{ ruleId: "2" }` — a nonsense rule id.
4. **No source for the ~25 generic/"common" special rules used across every fantasy faction as baseline unit traits** (`Nimble`, `Wizard`, `Fast`, `Tough`, etc. — the Warhammer Fantasy analogue of Warhammer 40k's `Fearless`/`Piercing`/`Psyker`). `glossary.ts` is explicitly scoped to `1p40k - Main Rulebook v3.3.1.pdf`; `one-page-fantasy-army-lists.md` is army-list pages only and never defines these. Running the existing `index.test.ts`/`melee-weapon-audit.test.ts` integrity audits against the wired-in fantasy factions surfaced ~50 unresolved rule ids; most turned out to be per-faction "Army Special Rules" that resolve once defect 1 is fixed (each faction's own list restates any rule it uses, e.g. `Undead: This unit has the Fear special rule.` printed inline in both Tomb Kings' and Vampire Counts' own sections) — but roughly 25 are genuinely global/common rules with no per-faction restatement. The user supplied two additional source documents for these: `fantasy-special-abilities.md` (a "Common Special Rules" excerpt) and the more complete `one-page-fantasy-rules.md` (full core rules: phases, unit types, weapon-type table, common special rules, common upgrades). **`Wizard` turned out to be its own distinct, separately-sourced rule** — not a rename of `psyker` — with wording that parallels but doesn't copy Psyker's (`"...Wizards may cast Spells... If a Wizard rolls two or more 6s..."` vs. Psyker's `"...Psykers may manifest Powers... If a Psyker rolls two or more 6s..."`), so it's authored as `Psyker(N)`-style bug fixed to `Wizard(N)` (keeping the name "Wizard"), not converted to `Psyker(N)`.

This change both (a) builds the system-switching feature and (b) brings the fantasy data up to the same fidelity bar as the existing Warhammer 40k data before it's wired in and user-visible.

## Goals / Non-Goals

**Goals:**
- Let a user pick a game system (Warhammer 40k / Warhammer Fantasy) and see only that system's factions and saved lists.
- Fix the fantasy faction data's `armyRules`, `psychicPowers`, missing units, and `Wizard(N)` references against `one-page-fantasy-army-lists.md`, following the existing authoring conventions in `helpers.ts`.
- Render the shared Psyker mechanic under the name "Wizard" wherever a Warhammer Fantasy faction is shown, without duplicating its rule text.
- Keep existing saved lists (Warhammer 40k) working with no data migration.

**Non-Goals:**
- No new game systems beyond these two (no Firefight, no Warfleet, etc.) — the mechanism should generalize, but only two systems ship.
- No attempt to reconcile or share `armyRules`/`psychicPowers`/unit content between the two systems — they are independent rulesets that happen to share a builder UI and some rule mechanics.
- No redesign of the builder/print views' layout — only the lists view and creation dialog change; `BuilderView`/`PrintView` already operate per-list and need no system-awareness beyond what the faction/upgrade data already carries.
- No attempt to verify every point cost/rule text by hand beyond what's checkable against the provided transcription; anything the transcription itself leaves ambiguous is called out rather than guessed.

## Decisions

### 1. `system` lives on `Faction`, not on `ArmyList`

Add `system: GameSystem` (`'system-40k' | 'system-fantasy'`) to the `Faction` type and populate it in every faction module. A saved `ArmyList` already has `factionId`; its system is derived via `getFaction(list.factionId)?.system` rather than stored redundantly.

*Why*: a list's system is fully determined by its faction and can never change independently (there's no "convert this list to another system" feature). Storing it separately would let it drift out of sync with `factionId` and would require a migration for every existing saved list in users' `localStorage`. Deriving it keeps existing saved-list JSON valid with zero migration.

*Alternative considered*: store `system` directly on `ArmyList` at creation time. Rejected — purely redundant with `factionId`, and every existing list in a user's browser would need a one-time backfill.

### 2. One merged `rulesDatabase.factions` array, filtered by system in the UI layer

Keep `RulesDatabase.factions` as a single flat array (Warhammer 40k's 15 + Warhammer Fantasy's 16 factions, each tagged), rather than splitting into `rulesDatabase.systems[systemId].factions`.

*Why*: `getFaction(id)`/`getUnit(id, id)` are called from many places (`chapters.ts`, `lists.ts`, `calc.ts`, views) purely by faction id, with no caller needing to know the system up front — factions ids are already globally unique strings. Splitting the database into per-system sub-trees would force every one of those call sites to also thread a system parameter through. Filtering happens only at the two UI seams that need it: the lists view (filter saved lists by `getFaction(list.factionId)?.system`) and the create-dialog's faction dropdown (filter `factions` by the selected system before passing them in as props).

*Alternative considered*: nest factions under a system key in the database shape. Rejected as a wider blast-radius change for no behavioral benefit, given faction ids are already globally unique.

### 3. Per-system glossaries (`RulesDatabase.glossaries: Record<GameSystem, SpecialRule[]>`), and `Wizard` as its own real rule — not a Psyker display-name override

**Superseded from an earlier draft of this design**, which proposed a `terminologyOverrides` display-name table aliasing `Wizard` to the shared `psyker` rule. Implementation revealed that was wrong: `Wizard`'s actual sourced text (`one-page-fantasy-rules.md`'s "Common Special Rules") parallels `psyker`'s but isn't identical wording, and several *other* same-named rules between the two systems turned out to have different mechanics entirely (e.g. `Poison` — a re-roll-blocks rule in Warhammer 40k vs. an automatic-wound-on-6 rule in Warhammer Fantasy; `Furious` also drops a clause). A single shared glossary array can't hold two different definitions under one id, so the glossary itself has to be per-system, at which point `Wizard` is just its own ordinary entry in the Warhammer Fantasy glossary — no override mechanism needed at all.

`RulesDatabase.glossary: SpecialRule[]` becomes `RulesDatabase.glossaries: Record<GameSystem, SpecialRule[]>`; `createResolver(db, faction)` (`domain/resolve.ts`) picks `db.glossaries[faction?.system ?? 'system-40k']` instead of a single flat array. Every existing call site already goes through `createResolver`, so this is the only resolution-path change needed — tooltips, rule chips, and the print reference all pick up the correct per-system text automatically. The handful of places that special-case the literal id `'psyker'` for cross-cutting behavior (Infantry-eligibility exclusion in `calc.ts`, the roster caster badge and psychic-powers/spells panel in `BuilderView.vue`, the print view's spells-section gate in `PrintView.vue`) now check `'psyker' || 'wizard'`, since a given faction only ever carries one of the two (they belong to different systems) but the shared cross-cutting logic (join an Infantry unit of the same Quality, count against non-Infantry, unlock the spells/powers reference section) applies identically to either.

Fantasy faction data is authored using `Wizard(N)` directly (the bug fix is the same shape as before: `adds: ["2"]` → `adds: ["Wizard(N)"]`, just keeping the name "Wizard" instead of converting to "Psyker").

*Why*: matches the project's existing sourcing discipline (every rule's text must come from its own system's real source) instead of asserting two differently-worded rules are "the same" for implementation convenience.

*Alternative considered (this design's original decision 3)*: a display-name override table aliasing `wizard` to the shared `psyker` id. Rejected once the actual Warhammer Fantasy source text showed the two rules aren't word-for-word identical, and that this problem recurs for other same-named rules (`Poison`, `Furious`) — an override table only solves the *naming* mismatch, not the *wording* mismatch, so a real per-system glossary was needed regardless.

### 4. System switcher lives in `ListsView`, as local/persisted UI state — not a route

Add a `GameSystem` toggle (two tabs/buttons) at the top of `ListsView`, backed by a `ref` that's read/written to the same persistence mechanism the lists store already uses (e.g. `localStorage`), defaulting to `system-40k` for existing users. Switching the toggle filters the displayed saved-lists list and the factions passed into `CreateListDialog`; it does not navigate anywhere or affect `BuilderView`/`PrintView`, which remain per-list and system-agnostic.

*Why*: there's no independent "system" screen or URL to route to — it's a filter over the same lists view, and it needs to persist across reloads like the rest of the app's client-only state so the choice sticks between sessions.

*Alternative considered*: a global system store/route (e.g. a `useSystemStore` outside `ListsView`, or a `/system/:id` path). Rejected as unnecessary structure — the app has no router today, and no other view needs to know the selected system (`BuilderView`/`PrintView` get their faction from the list itself).

### 5. Fantasy data fixes are corrective, not exploratory

For each of the 16 fantasy faction files, `armyRules` and `psychicPowers` are rebuilt by re-deriving each entry's correct `name`/`text` (and `castValue` for powers) directly from the corresponding prose block in `one-page-fantasy-army-lists.md` (the "Army Special Rules" / "Magic Spells" columns for that faction), and any unit present in the transcription's table but absent from the draft's `units` array is added using the same `unit()`/equipment-builder conventions already used for that faction's existing units. Every `Wizard(N)` token becomes `Psyker(N)` (parsed the same way `Tough(N)`/`Impact(N)` already are). Where the transcription's column-interleaved text makes an entry's correct boundary genuinely ambiguous (not just tedious to untangle), the task notes it as a specific open item rather than guessing at a plausible-sounding split.

*Why*: this mirrors the existing Warhammer 40k data's bar (`rules-data`'s spec already requires values to "match the corresponding entry" in its source document) — Warhammer Fantasy factions should be held to the same standard before being exposed in the UI, rather than shipping visibly-broken rule text behind the new switcher.

## Risks / Trade-offs

- **[Risk] Reconstructing garbled multi-column text for 16 factions is labor-intensive and error-prone by hand.** → Mitigation: process one faction file at a time, diffing each rebuilt `armyRules`/`psychicPowers` entry against its exact source block in `one-page-fantasy-army-lists.md` line-by-line, and add a lightweight test (mirroring existing audits like `rule-grant-audit.test.ts`) asserting every faction has a non-empty `armyRules` array and every `psychicPowers`/`armyRules` entry's `text` doesn't contain a stray `+\d+pts` or other-faction unit name (a cheap smell test for leftover cross-column contamination).
- **[Risk] Some standalone units (e.g. war machines) may need equipment/rules not yet expressible by `helpers.ts` builders (e.g. multi-profile weapons like the Steam Tank's `Steam Cannon` + `FieryBreath`).** → Mitigation: these builders already support arbitrary `customWeapon`/`gear` combinations per unit (see `Imperial Dragon`'s `Fiery Breath, Force Claws (Piercing)` pattern already in `empire.ts`), so this is expected to be additive data entry, not a builder change; flag as an open question only if a genuinely new profile shape is hit.
- **[Risk] Existing `army-builder-ui` "Psyker badge" requirement is worded specifically around the `Psyker` rule/name.** → Mitigation: update that spec's scenario text to reference the resolved/overridden display name rather than the literal string "Psyker", covered by the `game-system-switching` delta spec's terminology-resolution requirement.
- **[Trade-off] Filtering `rulesDatabase.factions` in the UI layer (Decision 2) means any future caller that lists factions must remember to filter by system.** → Accepted: only two call sites do this today (lists view, create dialog); documented in the spec requirement so new UI is written against it deliberately.

## Open Questions

- Are there Warhammer Fantasy-specific army-composition rules (points-cap steps, hero-limit table) distinct from Warhammer 40k's, or is the composition table (`src/data/composition.ts`) shared across both systems? The provided transcription (`one-page-fantasy-army-lists.md`) contains only army lists, no composition/points section — pending confirmation, this change assumes the composition table is shared, matching how One Page Rules' core rules are shared across its game lines.
