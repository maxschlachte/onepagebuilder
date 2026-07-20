## Why

`createResolver` degrades unknown rule ids gracefully: an unresolvable `RuleRef` renders as its raw kebab-case id ("poison-in-melee") instead of a real rule name, with the tooltip body reading "Rule text not found." Because it never throws, a mistyped or unregistered rule is invisible in review and only surfaces as a lowercase, hyphenated string in the UI. A probe across the current dataset found **22 such refs**, all in fantasy upgrade options.

Real rule names are always Capitalized. That makes "the resolved name contains no uppercase letter" a cheap, reliable signal that the resolver fell through to its id fallback — enough to catch the whole class as a regression test.

## What Changes

- Add a data-quality audit test that resolves every `RuleRef` reachable in the dataset — unit `specialRules`, equipment `rules`, weapon `rules`, and upgrade-option `addRules`/`addEquipment` rules — through the same `createResolver` the UI uses, and fails on any resolved name lacking an uppercase letter.
- Fix all 22 currently-unresolved refs, by category:
  - **Missing glossary entries** for compound pseudo-rules and stat modifiers (`+1A in Melee`, `D3 melee attacks`, `+1 Attack`, `Poison in Melee`, `Deadly in Melee`, `Ignores Cover`, `Ignore Piercing`) — added to `glossary-fantasy.ts` following the existing `piercing-in-melee` / `piercing-impact` precedent.
  - **Missing faction army rules** (Dwarf runes, Empire `Swift as the Wind` / `Bloodroar`, Lizardmen `Blood Roar`) — added as `armyRule(...)` entries on their factions.
  - **Weapon names misparsed as rules** (`Ratling Gun`, `Fire Thrower`) — corrected at the source call site so they emit equipment, not a `RuleRef`.
- No production behavior changes: the resolver's fallback stays as-is, since graceful degradation is still the right runtime behavior. The test is what makes the fallback loud at build time.

## Capabilities

### New Capabilities

_None._ This adds a verification requirement to existing data, not a new user-facing capability.

### Modified Capabilities

- `rules-data`: adds a requirement that every rule reference in the dataset resolves to a defined rule, rather than silently falling back to its raw id. Tightens the existing "Parameterized special rules and glossary" requirement from "resolvable text exists" to "every reference in the shipped data actually resolves".

## Impact

- **New**: `src/data/rule-ref-resolution-audit.test.ts` — joins the existing audit-test family (`rule-grant-audit`, `label-profile-audit`, `melee-weapon-audit`, `fantasy-data-quality-audit`).
- **Modified**: `src/data/glossary-fantasy.ts` (new entries); fantasy faction files with unresolved refs — `dwarfs`, `empire`, `lizardmen`, `skaven`, `dark-elves`, `vampire-counts`, `warriors-of-chaos`, `wood-elves`, `ogre-kingdoms`.
- **Unchanged**: `src/domain/resolve.ts`, all components. No schema or type changes.
- **Risk**: low. The audit is additive and the data fixes are localized; the uppercase heuristic can only false-positive on a rule genuinely named in all-lowercase, of which the dataset has none.
