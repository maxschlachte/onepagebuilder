## 1. Fix real-data option-lookup strings

- [x] 1.1 `src/domain/calc.test.ts:339` — change `optionId(sm, 'A', 'Flamer (Limited)')` to `optionId(sm, 'A', 'Flamer')`.
- [x] 1.2 `src/domain/calc.test.ts:536` — change `optionId(sm, 'A', 'Meltagun (Limited)')` to `optionId(sm, 'A', 'Meltagun')`.
- [x] 1.3 `src/stores/lists.test.ts:306` — change `o.label === 'Jump Pack (Deep Strike, Flying)'` to `o.label === 'Jump Pack'`.
- [x] 1.4 Run `npx vitest run src/domain/calc.test.ts src/stores/lists.test.ts`; confirm both pass.

## 2. Rewrite the obsolete compound-label test

- [x] 2.1 In `src/components/EntryUpgradeControls.test.ts`, import `RuleTooltip` from `./RuleTooltip.vue`.
- [x] 2.2 Replace the "does not duplicate rule text for a compound label like 'Jump Pack (Deep Strike, Flying)'" test (per design.md Decision 2) with a test that: finds the `Jump Pack` option's `<label>` row, asserts no `RuleTooltip` within it resolves to the name `Jump Pack`, and asserts exactly two `RuleTooltip`s render with `ruleId`s `deep-strike` and `flying`. (Scoped tooltips to the label via `wrapper.findAllComponents(RuleTooltip).filter(t => label.element.contains(t.element))` rather than `label.findAllComponents(...)` directly — the latter resolves to `DOMWrapper`'s untyped `any` override, which fails `vue-tsc --noEmit` under `noImplicitAny`.)
- [x] 2.3 Run `npx vitest run src/components/EntryUpgradeControls.test.ts`; confirm it passes.

## 3. Spec sync

- [x] 3.1 Confirm the delta spec at `specs/army-builder-ui/spec.md` (extending "Hover tooltips for rules") accurately reflects the rewritten test's expectations.

## 4. Verification

- [x] 4.1 Full suite green (`npm test`) — 0 failures (18/18 test files, 227/227 tests).
- [x] 4.2 Typecheck clean (`vue-tsc --noEmit`) — 0 errors.
