## 1. Type and availability check

- [x] 1.1 In `src/domain/types.ts`, add `requiresBaselineRule?: RuleRef[]` to `SectionPrerequisite`, documented as an independent, unconditional gate on the unit's baseline `specialRules` (not satisfiable by any selection).
- [x] 1.2 In `src/domain/calc.ts`, add a match helper and a corresponding check in `isSectionAvailable`: if `prereq.requiresBaselineRule?.length` and none of the unit's `specialRules` match (both `ruleId` and `param` equal) any listed rule, the section is unavailable.

## 2. Data-authoring support

- [x] 2.1 In `src/data/factions/helpers.ts`, add `requiresBaselineRule?: string[]` to `SectionPrerequisiteInput`, parsed via the existing `parseRule()` (same parser used for baseline `special` strings).
- [x] 2.2 In `faction()`'s prerequisite-resolution loop, map `raw.requiresBaselineRule` through `parseRule` into the resolved `SectionPrerequisite.requiresBaselineRule`.

## 3. Gate the seven Psyker sections

- [x] 3.1 `src/data/factions/imperial-guard.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group A's "Upgrade Psyker(1)" section.
- [x] 3.2 `src/data/factions/space-marines.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group A's "Upgrade Psyker(1)" section.
- [x] 3.3 `src/data/factions/chaos-space-marines.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group B's "Upgrade Psyker(1)" section.
- [x] 3.4 `src/data/factions/chaos-daemons.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group A's "Upgrade Psyker(1)" section, and `{ requiresBaselineRule: ['Psyker(2)'] }` to group A's "Upgrade Psyker(2)" section.
- [x] 3.5 `src/data/factions/orks.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group B's "Upgrade Psyker(1)" section.
- [x] 3.6 `src/data/factions/harlequins.ts` — add `{ requiresBaselineRule: ['Psyker(1)'] }` to group A's "Upgrade Psyker(1)" section.

## 4. Tests

- [x] 4.1 In `src/domain/calc.test.ts`, add `isSectionAvailable` cases: unavailable without the baseline rule, available with the exact matching baseline rule, unavailable when the unit has the same rule at a different level, and unaffected by a same-rule-granting selection elsewhere.
- [x] 4.2 Add or extend a faction-data test (e.g. alongside `src/data/label-profile-audit.test.ts` or a new audit test) asserting that every "Upgrade Psyker(N)" section in every faction declares a `requiresBaselineRule` matching its own title's level — a regression guard so a newly added faction/unit sharing one of these groups can't silently reintroduce the bug.
- [x] 4.3 Add a store-level test (alongside `src/stores/lists.test.ts`) confirming `toggleUpgrade` rejects selecting a gated Psyker option on a unit lacking the baseline rule (e.g. Tactical Marines attempting "Psyker(2)"), and that a unit with the matching baseline rule (e.g. Librarian) can still select it.
- [x] 4.4 Add or confirm an import-validation test showing a list with a gated Psyker option selected on a non-qualifying unit is rejected.

## 5. Verify

- [x] 5.1 Run the full test suite (`npm run test`) and `vue-tsc --noEmit`, fixing any other assertions that depended on the previously-unrestricted Psyker sections.
- [x] 5.2 Manually check in a live browser: a Librarian (or other qualifying unit) can still select its Psyker upgrade, and a non-qualifying unit sharing the same group (e.g. Tactical Marines) shows that section's option(s) disabled/unselectable.
