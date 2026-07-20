## 1. Red baseline

- [x] 1.1 Add failing unit tests in `src/domain/calc.test.ts` for the four dice shapes: `Impact(D3)`+`Impact(+1)` → `Impact(D3+1)`, `Impact(D6)`+`Impact(+3)` → `Impact(D6+3)`, `Impact(2D6)`+`Impact(+D6)` → `Impact(2D6+D6)`, `Impact(D3)`+`Impact(+D6)` → `Impact(D3+D6)`
- [x] 1.2 Add regression tests pinning the all-numeric behavior that must not change: `Psyker(1)`+`Psyker(2)` → `Psyker(2)`, `Tough(3)`+`Tough(+3)` → `Tough(6)` (numeric, not `"3+3"`), and a single-entry group returned unchanged
- [x] 1.3 Run the suite and confirm 1.1 fails and 1.2 passes

## 2. Merge logic

- [x] 2.1 In `src/domain/calc.ts`, replace `mergeRuleGroup`'s two-way partition with the explicit shape classifier (numeric / additive `/^\+/` / dice-or-other) from design Decision 1
- [x] 2.2 Implement the all-numeric path to produce a `number` exactly as today (max of non-additives, plus the sum of additives), keeping the single-entry short-circuit
- [x] 2.3 Implement the symbolic path: join non-additive bases by `+` in first-occurrence order, then append each additive verbatim (its leading `+` is the joiner), producing a `string`
- [x] 2.4 Update `mergeRuleGroup`'s doc comment — it currently documents the removed bail-out and cites the superseded "not reachable from current data" assumption
- [x] 2.5 Run the suite and confirm the group-1 tests now pass with no other test regressing

## 3. Remove the dead `isAdditive` flag

- [x] 3.1 Delete `isAdditive` from the `SpecialRule` interface in `src/domain/types.ts`
- [x] 3.2 Delete the three `isAdditive: true` lines in `src/data/glossary.ts` (`impact`, `tough`, `transport`)
- [x] 3.3 Run `npm run build` to confirm `vue-tsc` reports no remaining references

## 4. Collision audit

- [x] 4.1 Create an audit test that, per faction, crosses each unit's baseline `specialRules` against the rule-granting options in the upgrade groups that unit can take, including rules carried by mount equipment entries
- [x] 4.2 Assert the merge invariant for every collision found: the merged entry accounts for every contributing param (each contributor's text appears in the merged expression, or the group merged arithmetically to a number)
- [x] 4.3 Confirm the audit reports the 8 known pairings as passing, and verify it actually fails by temporarily reinstating the old bail-out

## 5. Verification

- [x] 5.1 Run the full suite (`npm test`) — no regressions
- [x] 5.2 Run `npm run build` — `vue-tsc` clean
- [x] 5.3 Render-check the reported case end to end: Ogre Kingdoms Tyrant with Wallcrusher selected shows `Impact(D3+1)` in the unit's special rules, with a working tooltip
- [x] 5.4 Confirm point costs are unchanged for every affected unit (the merge is display-only; `costDelta` accumulation is untouched)
