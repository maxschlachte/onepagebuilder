## Context

`createResolver` (`src/domain/resolve.ts:48`) resolves a `RuleRef` against a merged index of the system glossary, the faction's `armyRules`, and its `psychicPowers`. On a miss it returns `formatRuleName(ref.ruleId, …)` with text `'Rule text not found.'` — deliberately non-throwing, so a data gap never breaks the app.

The cost is that gaps are silent. Rule ids are produced by `nameToId` (`src/data/factions/helpers.ts:84`), which lowercases and kebab-cases free-text rule strings transcribed from the rulebook. When the transcribed string isn't a real rule name, `nameToId` still yields a plausible-looking id that simply matches nothing — `"+1A in Melee"` → `1a-in-melee`, `"Poison in Melee"` → `poison-in-melee` (the author omitted the parens that `parseRule` needs to split a note off). The UI then prints the raw id.

A probe over the current dataset found 22 distinct unresolved refs across 9 fantasy factions, all reached through upgrade options. The 40k dataset is clean.

## Goals / Non-Goals

**Goals:**
- Detect any `RuleRef` in the shipped dataset that falls through to the resolver's id fallback, as a standing regression test.
- Resolve all 22 current offenders so the audit lands green.
- Reach refs through the same code path the UI uses, so the test can't pass while the UI shows something else.

**Non-Goals:**
- Changing the resolver's fallback behavior. Graceful degradation at runtime remains correct; this change makes gaps loud at build time instead.
- Validating rule *text* accuracy against the source PDFs — `fantasy-data-quality-audit.test.ts` owns content correctness.
- Validating `removeRules` ids (they name rules to strip, and referencing an absent rule is a no-op, not a display bug).

## Decisions

### Uppercase-presence as the failure signal

**Decision:** A resolved name fails if `!/[A-Z]/.test(name)`.

Every rule name in both glossaries and every `armyRule`/`power` name is Title Case — the UI relies on this, printing names verbatim as capitalized labels. A kebab-case id is by construction all-lowercase (`nameToId` lowercases unconditionally). So the two populations are cleanly separated by a single-character test, with no allowlist to maintain.

*Alternatives considered:* Checking `resolver.index.has(ref.ruleId)` directly is more precise and doesn't rely on a casing convention. Rejected as the primary check because it tests the index rather than the rendered string — it would miss a rule that resolves but whose *name* is malformed, which is the actual user-visible symptom the user reported. The audit asserts on the same string the UI renders. A hyphen check (`/-/`) was also rejected: legitimate names contain hyphens (`Hawk-eyed`).

### Traverse every ref-bearing position, deduplicated by site

**Decision:** Walk units (`specialRules`, `equipment[].rules`, `equipment[].weapon.rules`) and upgrade options (`effects.addRules`, `effects.addEquipment[].rules`, `effects.addEquipment[].weapon.rules`), resolving each with a per-faction resolver.

A per-faction resolver is required, not a shared one: `armyRules` are faction-scoped, so the same id can legitimately resolve in one faction and not another. Failures are reported as `faction/location → id` so a red run names the exact call site to edit, and are collected into a single array asserted against `[]` — the whole-file convention in this repo's audit tests, which surfaces all offenders per run rather than stopping at the first.

### Fix categories, not individual strings

The 22 offenders split into three causes, each with a different correct fix:

| Cause | Fix | Examples |
|---|---|---|
| Real rule, no glossary entry | Add to `glossary-fantasy.ts` | `ignores-cover`, `ignore-piercing`, `poison-in-melee`, `deadly-in-melee` |
| Stat modifier written as a rule | Add to `glossary-fantasy.ts` as a named pseudo-rule | `1a-in-melee`, `2a-in-melee`, `d3-melee-attacks`, `1-melee-attack`, `1-attack` |
| Faction-specific rule, not registered | Add `armyRule(...)` to that faction | Dwarf runes, `swift-as-the-wind`, `bloodroar`, `blood-roar` |
| Weapon name parsed as a rule | Correct the call site to emit equipment | `ratling-gun`, `fire-thrower` |

**Decision:** Stat modifiers become glossary entries rather than being stripped from `addRules`.

The dataset already carries `piercing-in-melee` and `piercing-impact` as compound pseudo-rules in exactly this shape, so this follows established precedent rather than introducing a second convention. It also preserves them as tooltip-able chips in the UI, which stripping them would lose. The cost is a glossary that mixes true rulebook rules with derived modifiers — accepted, because the alternative fragments how upgrade effects are represented.

**Note on near-duplicates:** `bloodroar` (Empire) and `blood-roar` (Lizardmen) differ only by a space in the source text. They are transcribed from separate army lists and will be registered separately on their own factions rather than normalized to one id — faction-scoped rules with the same mechanic are already common in this dataset (e.g. `Blessing` exists on both Dark Elves and Wood Elves with different text).

## Risks / Trade-offs

- **A future rule genuinely named in lowercase would false-positive** → No such name exists in either glossary today, and the UI's capitalized presentation makes one unlikely. If one is ever added, the fix is an explicit allowlist entry with a comment, not loosening the check.
- **The audit only covers refs reachable by static traversal** → Refs synthesized at runtime (e.g. chapter-migration paths in `legacy-chapter-migration.ts`) aren't walked. Accepted: those construct refs from ids already present in the static data, which the audit does cover.
- **Adding stat modifiers to the glossary blurs "rulebook rule" vs "derived modifier"** → Mitigated by grouping them in a commented block in `glossary-fantasy.ts` explaining they are transcription conveniences, mirroring the file's existing header comment style.
- **Fixing 22 refs touches 9 faction files** → Each fix is additive (a new glossary/army-rule entry) or a localized call-site correction; the audit itself plus the existing suite verify no regression.
