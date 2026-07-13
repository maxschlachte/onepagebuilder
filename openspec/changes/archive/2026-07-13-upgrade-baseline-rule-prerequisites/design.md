## Context

`SectionPrerequisite` (`src/domain/types.ts:127-141`) already supports gating a section on other selections (`blockedBySelecting`, `blockedBySelectingOnSingleModel`, `requiresOneOfSelected`) and on the unit's *baseline equipment* (`satisfiedByEquipment`, checked against `unit.equipment` in `isSectionAvailable`, `src/domain/calc.ts:278-299`). There is no equivalent for the unit's baseline *special rules* (`unit.specialRules: RuleRef[]`), even though `isSectionAvailable` already receives the full `UnitProfile` and could check it.

At the data-authoring layer (`src/data/factions/helpers.ts`), prerequisites are written in terms of printed strings — option labels for `requiresOneOfSelected`/`blockedBySelecting`, and equipment tokens (parsed by `equipmentKeyOf`) for `satisfiedByEquipment` — and resolved once, in `faction()`, after every group's options are built. Baseline special rules are authored the same way units already declare them: a comma-separated string (e.g. `special: 'Fearless, Psyker(1), Tough(3)'`) parsed by `rules()`/`parseRule()` in the same file into `RuleRef[]` (`{ ruleId, param }`).

Seven `section(...)` calls across six faction files are titled `Upgrade Psyker(N)` and offer an option that grants `Psyker(N+1)`/`Psyker(N+2)`. None currently declare a prerequisite, so any unit sharing that group letter — including ones with no baseline Psyker at all — can select the option. Full list and per-file line numbers are in the proposal's "What Changes" section.

## Goals / Non-Goals

**Goals:**
- Let a section declare "only available if the unit's baseline special rules already include X", authored the same way (`Rule(param)` string tokens) as baseline `special` strings are today, so faction data stays readable and consistent.
- Gate all seven `Upgrade Psyker(N)` sections on the correct baseline level.
- Reuse the existing `isSectionAvailable` / `pruneInvalidSelections` / import-validation pipeline as-is — the new field is just another input to the same availability check, not a new code path.

**Non-Goals:**
- No retroactive migration/cleanup of already-saved lists in a user's local storage that hold a now-invalid selection — `pruneInvalidSelections` already clears these the next time the user toggles any upgrade on that unit, same as any other prerequisite becoming unmet; this change doesn't add a one-time sweep.
- No change to how `requiresOneOfSelected`/`satisfiedByEquipment` combine — the new field is an independent, unconditional gate (see Decisions), not folded into that OR-chain.
- No general "rule level ≥ N" comparison — matching is exact (`ruleId` and `param` both equal), since a section for "Upgrade Psyker(1)" is specifically wrong for a unit that's already Psyker(2) (it should use the Psyker(2) section's cheaper price instead, as Chaos Daemons' Lord of Change does).

## Decisions

**New field name and shape**: `requiresBaselineRule?: string[]` on the author-facing `SectionPrerequisiteInput` (parsed via the existing `parseRule()` into `RuleRef[]` and stored as `SectionPrerequisite.requiresBaselineRule?: RuleRef[]`), matched against `unit.specialRules` by `ruleId` and `param` both matching (an array so a section could in principle accept more than one qualifying baseline rule, though none of today's data needs that — mirrors `satisfiedByEquipment: string[]` for consistency).
  - Alternative considered: extend `requiresOneOfSelected`/`satisfiedByEquipment`'s OR-chain with a third `satisfiedByBaselineRule` alternative. Rejected — semantically wrong here: none of the seven sections should ever be unlockable by a prior *selection* (there's no such selection that would legitimately grant "starting" Psyker), so folding it into that OR-chain would silently accept a same-unit combo that should never be valid. An independent, always-enforced field matches the actual rule.
  - Alternative considered: compare by rendering both sides to display strings (e.g. `"Psyker(1)"`) instead of parsing to `RuleRef`. Rejected — `parseRule()`/`rules()` already exist and are the established pattern for turning printed rule text into structured data in this file; reusing them keeps one parser instead of two.

**Where the check lives**: `isSectionAvailable` gains one more early-return check, `if (prereq.requiresBaselineRule?.length && !prereq.requiresBaselineRule.some(matchesRule)) return false`, alongside (not replacing) the existing checks — a section can combine this with other prerequisite clauses if a future case needs to (none of today's seven do).

**Data changes**: each of the seven `section('Upgrade Psyker(N)', ...)` calls gets a fourth argument `{ requiresBaselineRule: ['Psyker(N)'] }`. `chaos-daemons.ts`'s second Psyker section (`Upgrade Psyker(2)`) gets `{ requiresBaselineRule: ['Psyker(2)'] }`.

## Risks / Trade-offs

- [A saved list already has an invalid Psyker selection] → mitigation: covered by existing `pruneInvalidSelections`, invoked on the next upgrade toggle for that unit (same as any other prerequisite change); explicitly out of scope for a one-time migration per Non-Goals.
- [Import validation now rejects previously-importable JSON] → this is the intended effect (closes the same bug for imports as for the builder UI); the existing import-rejection message already identifies the offending unit/section, so no new UX work is needed.
- [`RuleRef` equality check could be too strict or too loose if a faction's baseline rule has a `note` qualifier alongside Psyker] → mitigation: none of the seven Psyker baseline occurrences use a `note`; matching ignores `note` and compares only `ruleId`+`param`, consistent with how Psyker levels are always expressed in this dataset.
