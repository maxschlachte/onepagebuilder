## Context

`infantry-combine-and-attach` (implemented, still unarchived) introduced `affectsAllModels(option: UpgradeOption): boolean` in `src/domain/calc.ts`, defined as `!option.effects?.removeOneEquipment?.length`. It's consumed by:
- `wholeUnitOptionIds(faction)` (`src/domain/calc.ts`)
- `combinedEffectiveUnit` (indirectly, via the same classification)
- `combineUnits`'s union-onto-both-entries step and `toggleUpgrade`'s dual-write for a combined pair (`src/stores/lists.ts`)
- `EntryUpgradeControls.vue`'s `filter="whole"` / `filter="perModel"` split

A survey of all 16 faction files' 137 distinct upgrade-section titles shows the rulebook consistently marks true whole-unit sections with the word "all" in the title ("Replace all Assault Rifles", "Upgrade all models with one", "Equip all models with one", "Replace all equipment with", …) — 19 of 137 titles. Every other title (`Replace one X`, `Replace any X`, `Take one`, `Equip one model with`, `Upgrade one model with one`, and unqualified singular titles like `Replace Autocannon`/`Replace Kannon`/`Replace Machinegun`) scopes to one model or a bounded subset, never every model.

The current heuristic only correctly excludes the subset of per-model options that happen to carry a `removeOneEquipment` effect (an equipment-swap bookkeeping field, added for an unrelated reason — cost/equipment recomputation — before this feature existed). It wrongly includes:
- Single-model rule-grant options with no equipment effect at all, sitting in `one`/`any`-scoped sections (e.g. `Upgrade one model with one` → Narthecium, Battle Standard; `Replace Pistol` → Kustom Force Field, Shokk Attack Gun).
- Single-item equipment options in unqualified `Replace X` sections that use `removeEquipment` (not `removeOneEquipment`) because that unit only ever has one of that item (e.g. `Replace Autocannon`, `Replace Machinegun`) — `removeEquipment` was authored to mean "zero out this key regardless of count," which happens to coincide with "there's only one of it" but says nothing about whether *every model* has one.

No case was found of the reverse error (a genuine whole-unit option wrongly excluded), and no section mixes whole-unit and per-model options under one title.

## Goals / Non-Goals

**Goals:**
- Make `affectsAllModels` agree with the rulebook's own "affects all models" wording for every option across all 16 faction files, not just the subset that happens to carry `removeOneEquipment`.
- Keep the fix a pure reclassification: no faction-data changes, no `ListUnit`/persisted-list shape changes, no change to `applyUpgrades` cost math.
- Stop `EntryUpgradeControls.vue` from rendering an empty divider for upgrade groups with nothing to show under the active filter.

**Non-Goals:**
- No change to how `removeEquipment`/`removeOneEquipment` drive equipment/cost computation elsewhere in the app — those fields keep their existing meaning for `applyUpgrades`; only their (mis)use as an `affectsAllModels` proxy is being replaced.
- No new authoring convention added to the faction files — the section `title` string the data already carries is sufficient.
- No re-litigation of `isInfantry` or the attach/detach behavior — unaffected by this fix.

## Decisions

**1. `affectsAllModels` becomes section-scoped, not option-scoped, and is derived from the section's title.**

New signature: `affectsAllModels(section: UpgradeSection): boolean`, implemented as a whole-word match for "all" in `section.title` (`/\ball\b/i`). Every option in a section shares its section's classification — the data survey found no section mixing scopes, so there is no need for a finer per-option override.

Call sites update to look up the containing section:
- `wholeUnitOptionIds(faction)`: flat-maps `(group, section) → section.options`, filters by `affectsAllModels(section)`, collects option ids — same shape as today, one extra field threaded through.
- `EntryUpgradeControls.vue`'s `optionsFor(section)`: filter becomes `affectsAllModels(section) === (props.filter === 'whole')` — a single check per section instead of per option, and simpler.
- `src/stores/lists.ts`'s combined-pair toggle sync: today it checks `affectsAllModels(option)` after finding the option by id; it now also needs the option's containing section (a small helper, `findSection(faction, optionId)`, resolves this — the same lookup `labelsFor` in `EntryUpgradeControls.vue` already does for option ids).

Alternative considered: keep `affectsAllModels(option)` but broaden its condition to `!!option.effects?.removeEquipment?.length` (whole-unit only when the option explicitly zeroes an equipment key "regardless of size") and treat everything else — including pure rule-grants — as per-model by default. Rejected: this would *under*-classify genuine whole-unit rule-grant options that carry no equipment effect at all (e.g. Necrons' `Equip all models with one` → Shadowlooms, a squad-wide upgrade with no `addEquipment`/`removeEquipment`), which the title-based rule correctly keeps whole-unit. The title is the one signal that's authored consistently for exactly this purpose across every faction file; equipment-effect fields are not.

Alternative considered: add an explicit `scope: 'unit' | 'model'` field to `UpgradeSection` in all 16 faction files. Rejected for this fix — it's pure duplication of information already unambiguously present in `section.title` (matching `isInfantry`'s decision 2 rationale in `infantry-combine-and-attach/design.md` against adding a redundant `Infantry` tag), and would touch ~137 section declarations for no behavior the title-derived rule doesn't already give.

**2. The database-wide audit test is rewritten around the new definition and extended to catch the previously-missed cases.**

`src/domain/infantry-audit.test.ts` currently asserts every `removeOneEquipment`-bearing option is classified per-model. It's extended to assert, across all 16 faction files:
- No section whose title matches `/\ball\b/i` contains a `removeOneEquipment`-bearing option (whole-unit sections never do partial per-model swaps) — this already holds today per the survey, kept as a regression guard.
- No section whose title does *not* match `/\ball\b/i` is nonetheless treated as whole-unit (i.e., the new predicate never disagrees with the title on the data as it exists today) — this is close to tautological for a title-derived function, so its real value is guarding against a future refactor accidentally reintroducing an option-level heuristic that disagrees with the title.

**3. `EntryUpgradeControls.vue` skips rendering a group entirely when none of its sections have a visible option.**

Add a `hasVisibleContent(group)` check (`group.sections.some(s => optionsFor(s).length > 0)`) and gate the group's outer `<div class="mt-2 border-t … pt-2">` on it (`v-if`), instead of only gating the per-section content inside. This is a template-only change — no new state, no change to `optionsFor`/`isOptionDisabled`/`unavailableReason`.

## Risks / Trade-offs

- **[Risk]** The title-substring heuristic could misclassify a future faction-file section whose title doesn't follow the "all" convention (e.g. a new whole-unit section titled without the word "all", or a per-model section that happens to contain "all" as a substring in an item name). → **Mitigation**: `/\ball\b/i` is a whole-word match (won't fire on names like "Fireball" or "Overall"), and the audit test (decision 2) fails the build the moment a future faction-file edit disagrees with this convention, forcing an explicit look rather than a silent misclassification.
- **[Risk]** Changing `affectsAllModels`'s signature (option → section) touches every call site, including the still-unarchived `infantry-combine-and-attach` change's implementation. → **Mitigation**: this change's tasks include updating all current call sites and their tests in the same PR; there's no intermediate state where callers disagree on the signature.
- **[Trade-off]** A handful of previously-whole-unit options (single-heavy-weapon "Replace X" swaps, single-model leader upgrades) now become per-model, which is a *behavior* change for any list a user already built by combining two units and selecting one of these — on next load, decision 6 of `infantry-combine-and-attach` (drop-invalid-links-on-load) does not apply here since the pair itself is still valid; only the *symmetric selection* on the previously-miscategorized option no longer auto-mirrors. Existing saved lists still load and display fine (both entries simply keep their currently-stored `selectedUpgrades`, now interpreted per-entry instead of forced-synced); this is an acceptable one-time correction, not a breaking data change.

## Migration Plan

Additive/corrective only — no persisted-list shape change, no faction-data change. Recommended sequencing: archive `infantry-combine-and-attach` before or together with this change, since this change's delta spec supersedes wording that only exists in `infantry-combine-and-attach`'s not-yet-merged delta today.

## Open Questions

(none)
