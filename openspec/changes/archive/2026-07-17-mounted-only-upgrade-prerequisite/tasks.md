## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change.
- [x] 1.2 Dump the resolved equipment (key/label/count/range/attacks/rules) for every fantasy faction's units and upgrade options (as in `fantasy-default-weapons`) to a scratch file, for a before/after diff later.

## 2. Domain types

- [x] 2.1 In `src/domain/types.ts`, add `requiresOneOfSelected?: string[]` to `UpgradeOption`, documenting it as the option-level counterpart to `SectionPrerequisite.requiresOneOfSelected` — satisfied if any referenced option id is currently selected on the unit.

## 3. Domain logic

- [x] 3.1 In `src/domain/calc.ts`, add `isOptionAvailable(unit, section, option, selectedUpgradeIds)`: returns false if `!isSectionAvailable(unit, section, selectedUpgradeIds)`, false if `option.requiresOneOfSelected?.length` and none of those ids are in `selectedUpgradeIds`, true otherwise. No `faction` parameter needed (the ids are pre-resolved at data-load time).
- [x] 3.2 Update `pruneInvalidSelections` in `src/domain/calc.ts` to look up each selected id's specific option (via `owning.section.options.find(o => o.id === id)`) and check it via `isOptionAvailable` instead of only `isSectionAvailable`, so deselecting a mount cascades to remove any now-invalid `requiresOneOfSelected` selections.
- [x] 3.3 Add/extend `src/domain/calc.test.ts` coverage: an option with `requiresOneOfSelected` is unavailable when none of its referenced ids are selected, available once one is, gets pruned when that selection is removed, and doesn't affect sibling options in the same section.

## 4. Authoring helpers

- [x] 4.1 In `src/data/factions/helpers.ts`, add `requiresOneOfSelected?: string[]` to `OptionInput` (authored as labels, matching the existing section-level `SectionPrerequisiteInput.requiresOneOfSelected` convention).
- [x] 4.2 Add a module-scoped `pendingOptionPrerequisites: WeakMap<UpgradeOption, string[]>` (parallel to the existing `pendingPrerequisites` WeakMap for sections). In `option()`, stash `o.requiresOneOfSelected` there when present.
- [x] 4.3 In `faction()`, extend the existing prerequisite-resolution loop (which already walks every group/section to resolve section-level `pendingPrerequisites`) to also walk each section's options, resolving any pending option-level label list via the existing `resolveLabels` helper and assigning it to `opt.requiresOneOfSelected` — same "throw on unknown label" behavior as the section-level resolution.

## 5. Store enforcement

- [x] 5.1 In `src/stores/lists.ts`, update `applyToggle`: where it currently checks `!isSectionAvailable(profile, owning.section, unit.selectedUpgrades)`, look up the target option (`owning.section.options.find(o => o.id === optionId)`) and use `!isOptionAvailable(profile, owning.section, opt, unit.selectedUpgrades)` instead, so both section- and option-level gates are enforced.
- [x] 5.2 In `src/stores/lists.ts`, update `validateImported`: where it currently checks `!isSectionAvailable(profile, owning.section, selected)`, look up the specific option and use `!isOptionAvailable(...)` instead, keeping the existing error message style (identify the unit and the option/group).
- [x] 5.3 Add/extend store-level tests covering: rejecting a `requiresOneOfSelected`-gated selection without its requirement met, accepting it once met, and rejecting an imported list with the same invalid combination. Used real Empire "Heavy Lance (Mounted Only)"/"Warhorse" data (5 new tests in `src/stores/lists.test.ts`: reject-then-accept, sibling unaffected, cascade-clear on mount removal, import rejection, import acceptance).

## 6. Builder UI

- [x] 6.1 In `src/components/EntryUpgradeControls.vue`, update `isOptionDisabled`: where it currently checks `isSectionUnavailable(section)`, look up the option and also account for `isOptionAvailable` (or an equivalent option-level check), so a gated option is disabled without disabling its section-mates.
- [x] 6.2 Verify: no browser automation tooling is available in this environment (no Playwright/Puppeteer/Cypress dependency, no connected claude-in-chrome extension), so verified instead with 2 new jsdom component tests in `src/components/EntryUpgradeControls.test.ts` that mount the real component for Empire's General and assert the rendered checkbox's `disabled` attribute — confirmed disabled unmounted, enabled once "Warhorse" is selected, and the unrestricted "Master Sword" sibling stays enabled throughout. Also confirmed `vite build` succeeds cleanly.

## 7. Fix the 8 fantasy data sites

For each site, add `requiresOneOfSelected` to the "Mounted Only" option listing every label from that unit's own (same-group) `"Mount on:"` section.

- [x] 7.1 `src/data/factions/fantasy/empire.ts` — group A "Heavy Lance (Mounted Only)": `requiresOneOfSelected: ["Warhorse", "Imperial Pegasus", "War Altar of Sigmar", "Imperial Griffon", "Imperial Dragon"]`. Remove the now-obsolete "not modeled" comment above it.
- [x] 7.2 `src/data/factions/fantasy/orcs.ts` — group A "Heavy Spear (Mounted Only)": `requiresOneOfSelected: ["War Boar", "Boar Chariot", "Wyvern"]`. Remove the now-obsolete comment above it.
- [x] 7.3 `src/data/factions/fantasy/goblins.ts` — group A "Heavy Spear (Mounted Only)": `requiresOneOfSelected: ["Giant Wolf", "Giant Spider", "Great Cave Squig", "Gigantic Spider", "Wolf Chariot"]`. Remove the now-obsolete comment above it.
- [x] 7.4 `src/data/factions/fantasy/high-elves.ts` — group A "Master Lance (Mounted Only)": `requiresOneOfSelected: ["Elven Steed", "Great Eagle", "Griffon", "Frostheart Phoenix", "Dragon of Ulthuan", "Flamespyre Phoenix"]`; also strip the bogus `Mounted Only` token from its weapon's `rules(...)` call (currently `rules('Mounted Only')` with nothing else — remove the `rules` option entirely).
- [x] 7.5 `src/data/factions/fantasy/dark-elves.ts` — group A "Master Lance (Mounted Only)": `requiresOneOfSelected: ["Cold One", "Dark Steed", "Dark Pegasus", "Manticore", "Black Dragon", "Cauldron of Blood"]`.
- [x] 7.6 `src/data/factions/fantasy/warriors-of-chaos.ts` — group B "Master Lance (Mounted Only)": `requiresOneOfSelected: ["Chaos Steed", "Steed of Slaanesh", "Disc of Tzeentch", "Daemonic Mount", "Juggernaut of Khorne", "Palanquin of Nurgle", "Manticore", "Chaos Dragon"]`; also strip the bogus `Mounted Only` token from its weapon's `rules(...)` call (currently `rules('Mounted Only')` — remove the `rules` option entirely, since Lance's innate `Impact(1)` still applies automatically).
- [x] 7.7 `src/data/factions/fantasy/vampire-counts.ts`:
  - group A "Master Lance (Mounted Only)": `requiresOneOfSelected: ["Nightmare", "Hellsteed", "Abyssal Terror", "Coven Throne", "Terrorgheist", "Zombie Dragon"]`; strip `, Mounted Only` from its weapon's `rules('Impact(1), Mounted Only')` call, leaving `rules('Impact(1)')`.
  - group B "Heavy Lance (Deadly, Mounted Only)": `requiresOneOfSelected: ["Skeletal Steed"]`; strip `, Mounted Only` from its weapon's `rules('Impact(1), Deadly, Mounted Only')` call, leaving `rules('Impact(1), Deadly')`.
- [x] 7.8 Grep all 16 fantasy faction files for `Mounted Only` once more: confirm every remaining occurrence is either the intended printed label text, or the explicit `requiresOneOfSelected` arrays just added — no leftover bogus rule tokens or stale "not modeled" comments. Also manually verified, for all 8 sites, that every referenced mount label is either unique within its faction file or its first (registered) occurrence is in the same group as the "Mounted Only" option itself — so the label→id resolution (which keeps only the first-seen id per label) always resolves to the correct group's mount options. All 232 tests pass, confirming no unknown-label errors.

## 8. Final verification

- [x] 8.1 Run the full test suite; fix any failures. 239/239 passing.
- [x] 8.2 Run `vue-tsc --noEmit`; fix any type errors. Clean; also confirmed `vite build` succeeds.
- [x] 8.3 Re-dump the resolved equipment for every fantasy faction and diff against the task 1.2 baseline — confirmed the only differences are exactly the 4 weapon-rule-token removals from task 7.4/7.6/7.7 (`high-elves`, `vampire-counts` ×2, `warriors-of-chaos` — each losing only the bogus `mounted-only` rule id; every key/label/count/range/attacks and every real rule, e.g. `impact1`/`deadly`, byte-identical).
- [x] 8.4 Spot-check: no browser automation tooling available in this environment (see 6.2) — covered instead by the 2 new `EntryUpgradeControls.test.ts` component tests (Empire General) plus the 5 new `lists.test.ts` store tests (Empire General), which together exercise disabled-unmounted, enabled-once-mounted, sibling-unaffected, and cascade-clear-on-mount-removal end-to-end through the real component/store, not just the underlying `calc.ts` functions.
