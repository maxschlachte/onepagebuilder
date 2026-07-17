## Why

Eight Age of Fantasy upgrade options across seven factions are printed as `"<Weapon> (Mounted Only)"` — a rulebook restriction meaning the option is only legal on a model that has also taken a mount. Today this restriction exists only as flavor text in the option's `label`; nothing in the data model or the builder actually checks whether the unit has a mount selected. A player can select "Heavy Lance (Mounted Only)" on a foot hero and the app never objects. Worse, three of the eight sites (`high-elves.ts`, `warriors-of-chaos.ts`, and one of two in `vampire-counts.ts`) currently paper over the gap by stuffing `"Mounted Only"` into the *weapon's* rule list via `rules('Mounted Only')` — since no glossary entry exists for that id, it renders as the raw, unresolved id text (`mounted-only`) in the builder and print view instead of being enforced as a prerequisite.

The app already has a proven mechanism for exactly this class of problem — `SectionPrerequisite` (`requiresOneOfSelected`, `blockedBySelecting`, `requiresBaselineRule`), enforced in the store on toggle, on JSON import, and reflected as disabled controls in the builder UI — but it only operates at the *section* level. A "Mounted Only" option always sits in the same multi-option section as non-restricted alternatives (e.g. `Force Sword` / `Master Lance (Mounted Only)` / `Master Mace`), so gating the whole section would incorrectly lock out the unrestricted options too. This change extends the same `requiresOneOfSelected` concept one level down, to individual options, so a single option's availability can depend on any of a listed set of other option ids being selected — the general form of "checks for any taken upgrades from an array of upgrade ids" — and wires it up for the "requires a mount" case by listing every mount-granting option id for each affected unit.

## What Changes

- Add an option-level prerequisite: an `UpgradeOption` can declare `requiresOneOfSelected: string[]`, meaning it's only selectable while at least one of those other option ids (elsewhere on the same unit, resolved from authored labels the same way section-level prerequisites already are) is currently selected. This is a general mechanism, not mount-specific — reusable for any future "only selectable if X is also taken" restriction.
- For each of the 8 "Mounted Only" options, populate `requiresOneOfSelected` with the full, explicit list of that unit's own "Mount on:" section's option ids — every mount upgrade for that unit goes into the array, so selecting *any* mount satisfies the requirement.
- Enforce option-level `requiresOneOfSelected` everywhere the section-level version is already enforced: rejected on toggle-select in the store, auto-pruned (cascading) when the unit's mount selection is later removed, disabled in the builder UI, and rejected on JSON import with a clear error.
- Fix the eight "Mounted Only" upgrade options across `empire.ts`, `orcs.ts`, `goblins.ts`, `high-elves.ts`, `dark-elves.ts`, `warriors-of-chaos.ts`, and `vampire-counts.ts` (two sites) to declare `requiresMount: true`.
- **BREAKING (data-quality fix)**: remove the bogus `"Mounted Only"` token from the three weapon `rules(...)` calls that currently embed it as a fake special rule (`high-elves.ts`, `warriors-of-chaos.ts`, `vampire-counts.ts`'s "Master Lance" option) — it stops rendering as an unresolved `mounted-only` rule chip, since the restriction is now enforced structurally via `requiresMount` instead.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `upgrade-prerequisites`: adds a new requirement for option-level (not just section-level) prerequisites, specifically the "requires a mount" case — the existing section-scoped requirements (`requiresOneOfSelected`, `blockedBySelecting`, `requiresBaselineRule`) are unchanged.

## Impact

- **Affected code**: `src/domain/types.ts` (new `UpgradeOption.requiresOneOfSelected` field, mirroring the existing section-level one), `src/domain/calc.ts` (new `isOptionAvailable` helper, updated `pruneInvalidSelections`), `src/data/factions/helpers.ts` (`OptionInput.requiresOneOfSelected` threaded through `option()` and resolved from labels to ids in `faction()`, reusing the existing label-resolution machinery), `src/stores/lists.ts` (`applyToggle` and `validateImported` enforce the new option-level check), `src/components/EntryUpgradeControls.vue` (`isOptionDisabled` accounts for it).
- **Affected data**: `src/data/factions/fantasy/{empire,orcs,goblins,high-elves,dark-elves,warriors-of-chaos,vampire-counts}.ts` — 8 upgrade options gain an explicit `requiresOneOfSelected` list of that unit's mount option labels; 3 of them also lose a bogus weapon rule token.
- **Affected behavior**: a saved/exported list that already has a "Mounted Only" option selected without a mount (previously silently allowed, since unenforced) will now fail JSON-import validation, and will be auto-pruned the next time that unit's selections change in the builder. This is the intended effect of closing the gap, not a regression.
- **Not affected**: the 40k side of the app has zero `"Mount on:"` sections (verified), so `isMountSection`/`requiresMount` never engage there; no 40k faction data or behavior changes.
