## Why

The builder lets a unit select upgrade options independently of each other within a group, but the rulebook data (and the reference `one-page-40k-army-lists.html`) makes several sections implicitly conditional on what was picked in another section of the same group. Two concrete patterns recur across at least 7 factions:

1. **"Attachment" sections require the base weapon to still exist.** E.g. Space Marines group A has "Replace one Assault Rifle" and, separately, "Take one Assault Rifle attachment" — the attachment clips onto an Assault Rifle, so it shouldn't be selectable on a model that no longer has one. For a single-model unit (e.g. Captain, size 1), replacing its one Assault Rifle removes the only one there is. For a multi-model unit (e.g. Tactical Marines, size 5, or the user's example, Battle Sisters, size 5), replacing *one* Assault Rifle still leaves others in the unit, so the attachment section should remain available — the constraint is size-sensitive, not a blanket block.
2. **"Replace X" sections require X to have been produced by an earlier choice.** E.g. Sisters of Battle group A has "Replace one Assault Rifle" (two of its four options swap the rifle for a Pistol combo) followed by "Replace Pistol" — that section only makes sense if the Pistol-producing option was actually picked, since the unit's baseline loadout has no pistol at all. Today nothing stops picking "Replace Pistol" regardless.

Right now the builder has no notion of these dependencies: any section's options can be freely toggled regardless of what else is selected, so a user can produce inconsistent loadouts (e.g. an "Assault Rifle attachment" on a model that traded its Assault Rifle for a Stormbolter) that the printed list then displays as if valid.

## What Changes

- Add a prerequisite mechanism to `UpgradeSection`: a section can declare that it's unavailable while specific other options are selected (optionally scoped to single-model units only), and/or that it's only available while specific other options are selected.
- Enforce prerequisites in the store: selecting an option in a currently-unavailable section is rejected (mirrors the existing selection-cap enforcement from the prior `fix-upgrade-selection-rules` change); deselecting/selecting an option that changes another section's availability cascades to auto-deselect any now-invalid selections in that dependent section.
- Extend `validateImported` to reject an imported list whose selections violate a section's prerequisite.
- Update the builder UI to visibly disable an unavailable section's options (consistent with the existing capped-section disabling) and show why (e.g. "Requires: an Assault Rifle" / "Unavailable while all Assault Rifles are replaced").
- Annotate the faction data: for every group where a real prerequisite exists between two of its sections (identified during this change's research: at least Space Marines, Chaos Space Marines, Sisters of Battle, Orks, Inquisition, Space Marine Chapters, and Imperial Guard have at least one such pair — the full faction-by-faction pass will confirm the complete set and catch any missed elsewhere), add the prerequisite declaration. Groups without a real cross-section dependency are left untouched.

## Capabilities

### New Capabilities
- `upgrade-prerequisites`: Cross-section availability rules within a unit's upgrade groups — a section can require or forbid selections made in another section, with single-model-vs-multi-model sensitivity — enforced in the store, reflected in the UI, and validated on import.

## Impact

- `src/domain/types.ts`: `UpgradeSection` gains prerequisite fields.
- `src/domain/calc.ts`: a prerequisite-evaluation helper (needs the unit profile, not just the faction, to know model count).
- `src/stores/lists.ts`: `toggleUpgrade` enforcement + cascading auto-deselect; `validateImported` prerequisite check.
- `src/views/BuilderView.vue`: disable + explain unavailable sections.
- Faction data files where a real dependency exists (subset of the 16, exact list confirmed during the faction-by-faction task).
- Existing tests (`calc.test.ts`, `lists.test.ts`, `index.test.ts`) gain prerequisite coverage.
