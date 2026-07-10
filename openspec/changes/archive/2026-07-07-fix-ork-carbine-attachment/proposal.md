## Why

Orks group A's "Take one Carbine attachment" section (Heavy Flamer (Limited) / Grenade Launcher (Limited)) has no prerequisite at all, so any unit using group A — including Warboss, Boss, Big Mek, Boyz, Kommandos, and Nobz, none of which carry a Carbine at baseline — can take a Carbine attachment without ever taking a Carbine. This was a known, deliberate gap from the `upgrade-prerequisites` change (`src/data/factions/orks.ts:33-38`): the generic `requiresOneOfSelected` prerequisite can only check *selected* options, and group A is shared with Meganobz/Warbikers/Nob Bikers, who already carry a Carbine at baseline — so applying it naively would incorrectly lock the attachment out for them. The prerequisite mechanism needs to also recognize baseline equipment as satisfying the requirement before this section can be constrained correctly.

## What Changes

- Extend `SectionPrerequisite` with a way to satisfy a "requires one of selected" clause via the unit's baseline equipment as well as its selections (e.g. `requiresOneOfSelected` is also satisfied when the unit already carries a listed piece of equipment at baseline).
- Apply this to Orks group A's "Take one Carbine attachment" section: it now requires either a Carbine/Linked Carbine selected via "Replace one Pistol," or a Linked Carbine already present at baseline (Meganobz, Warbikers, Nob Bikers).
- Update the store/import validator and builder UI's existing prerequisite plumbing to account for baseline-satisfied requirements (no separate enforcement path — same `isSectionAvailable` check, extended).
- Remove the now-outdated code comment in `orks.ts` documenting the gap.

## Capabilities

### Modified Capabilities
- `upgrade-prerequisites`: A section's "requires one of selected" clause can also be satisfied by the unit's baseline equipment, not only by an explicit selection elsewhere.

## Impact

- `src/domain/types.ts`: `SectionPrerequisite` gains a field for baseline-equipment-satisfied requirements.
- `src/domain/calc.ts`: `isSectionAvailable` checks baseline equipment as an alternative to a selected option.
- `src/data/factions/helpers.ts`: `SectionPrerequisiteInput`/`section()` plumb the new field through to the built prerequisite.
- `src/data/factions/orks.ts`: group A's "Take one Carbine attachment" section gets the new prerequisite; stale comment removed.
- Existing tests (`calc.test.ts`, `index.test.ts`) gain coverage for the new clause.
