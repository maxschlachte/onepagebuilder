## 1. Domain model

- [x] 1.1 Add `satisfiedByEquipment?: string[]` to `SectionPrerequisite` in `src/domain/types.ts`, documented as an alternative satisfaction path for `requiresOneOfSelected` (met if the unit's baseline equipment includes a listed label)
- [x] 1.2 Add `satisfiedByEquipment?: string[]` to `SectionPrerequisiteInput` in `src/data/factions/helpers.ts`; pass it through unchanged (no label→id resolution needed) when building the resolved `SectionPrerequisite` in `faction()`

## 2. Domain logic

- [x] 2.1 Update `isSectionAvailable` in `src/domain/calc.ts`: when `requiresOneOfSelected` is set and unmet by the current selection, also check `satisfiedByEquipment` against `unit.equipment[].label` before returning unavailable

## 3. Orks data fix

- [x] 3.1 In `src/data/factions/orks.ts`, add the prerequisite to group A's "Take one Carbine attachment" section: `requiresOneOfSelected: ['Carbine', 'Linked Carbine']`, `satisfiedByEquipment: ['Linked Carbines']`
- [x] 3.2 Remove the now-outdated comment (lines 33-38) explaining why the prerequisite was omitted

## 4. Tests

- [x] 4.1 `calc.test.ts`: `isSectionAvailable` case where `requiresOneOfSelected` is unmet by selection but met by `satisfiedByEquipment` (e.g. Meganobz-shaped unit) → available
- [x] 4.2 `calc.test.ts`: case where neither the selection nor `satisfiedByEquipment` is met → unavailable
- [x] 4.3 `calc.test.ts`: case where `satisfiedByEquipment` is declared but the selection alone already satisfies the requirement (regression check that the new field doesn't change existing met-by-selection behavior)
- [x] 4.4 `index.test.ts`: extend the structural prerequisite test (or add a new one) asserting every `satisfiedByEquipment` label matches at least one baseline `equipment[].label` on some unit of the faction that uses the section, so a typo/rename fails at test time
- [x] 4.5 Add/extend an Orks-specific test (`calc.test.ts` or `index.test.ts`) exercising the real data: Boyz cannot take a Carbine attachment without first replacing a Pistol with a Carbine/Linked Carbine; Meganobz can take one with no selections; Warbikers/Nob Bikers can take one with no selections

## 5. Verification

- [x] 5.1 Run the full test suite and type-check; confirm no regressions in other factions' prerequisite tests (55/55 tests pass, clean type-check)
- [x] 5.2 Manually exercised the builder (Playwright against the dev server): Boyz shows "A. Take one Carbine attachment" with both options disabled and "Requires: Carbine or Linked Carbine" shown; selecting "Carbine" under "Replace one Pistol" enables both options and the reason text disappears; Meganobz and Warbikers show the section fully enabled immediately with no selections (baseline Linked Carbines). No console errors.
