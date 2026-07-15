## 1. Merge helper

- [x] 1.1 Add `mergeGroup`/`mergeParameterizedRules` to `src/domain/calc.ts` per design.md Decision 1: numeric-only duplicates keep the max; `+N` duplicates sum onto the absolute value (default `0`); any other shape mixed into a group is left as its first entry (documented dead-branch assumption).
- [x] 1.2 Wire `mergeParameterizedRules` into `applyUpgrades`'s return, applied once to the fully-accumulated `specialRules` after the selected-upgrades loop (not per-iteration).

## 2. Tests

- [x] 2.1 `calc.test.ts`: selecting a `Psyker(2)` upgrade on `librarian` (baseline `Psyker(1)`) — effective `specialRules` contains `{ ruleId: 'psyker', param: 2 }` and does not contain `{ ruleId: 'psyker', param: 1 }`.
- [x] 2.2 `calc.test.ts`: an analogous Wizard case (e.g. a fantasy faction unit with baseline `Wizard(1)`/`Wizard(2)` and a `Wizard(2)`/`Wizard(3)` upgrade option) — only the higher tier survives.
- [x] 2.3 `calc.test.ts`: selecting eldar's "Power-Field (Tough(+3))" (group `C`) on a unit with baseline `Tough(3)` (e.g. Vyper or War Walker) — effective `specialRules` contains a single `{ ruleId: 'tough', param: 6 }`, no separate `Tough(3)`/`Tough(+3)` entries.
- [x] 2.4 `calc.test.ts`: a unit with no selected upgrades still shows its unmodified baseline rules unchanged (no accidental merging/reordering when there's nothing to merge).
- [x] 2.5 Run the full test suite; confirm no existing `calc.test.ts`/`integration.test.ts`/`PrintView.test.ts` assertion broke (none currently assert on a duplicated Psyker/Wizard/Tough pair, but confirm). 225/226 passing — 1 pre-existing failure unrelated to this change (documented in prior changes' tasks.md); all 4 new tests pass; no existing test broke.

## 3. Verification

- [x] 3.1 Full suite green (`npm test`). 225/226 — 1 pre-existing failure unrelated to this change.
- [x] 3.2 Typecheck clean (`npm run build` or `vue-tsc --noEmit`).
- [x] 3.3 Manual browser pass (Playwright against the Vite dev server): added Librarian (baseline `Special: Fearless, Psyker(1), Tough(3)`) and checked its `Psyker(2)` upgrade — resulting `Special: Fearless, Psyker(2), Tough(3)`, no duplicate. Added an Eldar Vyper (baseline `Special: Armored, Fast, Strider, Tough(3)`, 75pts) and checked "Power-Field (Tough(+3))" — resulting `Special: Armored, Fast, Strider, Tough(6)` as one entry, cost correctly updated to 110pts (75 + option's own +35). Zero console errors in both.
