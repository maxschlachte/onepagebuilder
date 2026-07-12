## Why

Every upgrade section heading in the builder is rendered as `{{ group.id }}. {{ section.title }}` (e.g. "A. Replace one Assault Rifle"), which reads naturally for the rulebook's real lettered groups. But the synthesized per-unit "Chapter Tactics" groups added by the chapter feature use long descriptive ids for internal uniqueness (e.g. `blood-angels-tactics-tactical-marines`), so the same heading renders as the ugly `blood-angels-tactics-tactical-marines. Chapter Tactics`. The id was never meant to be player-facing for this synthesized group.

## What Changes

- `UpgradeGroup` gains an optional `hideId` flag; when set, the builder's upgrade-section heading omits the `{{ group.id }}. ` prefix and shows only the section title.
- The `group()` data-authoring helper accepts an optional third `{ hideId?: boolean }` argument to set this flag; every existing call site is unaffected (defaults to showing the id, as today).
- The Chapter Tactics group synthesized per unit in `src/data/chapters.ts` is built with `hideId: true`, so its heading renders as plain "Chapter Tactics" instead of the internal group id followed by "Chapter Tactics".

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: "Chapter Tactics options in the builder" gains a requirement that the Chapter Tactics heading does not display the synthesized group's internal id.

## Impact

- `src/domain/types.ts`: `UpgradeGroup` gains an optional `hideId?: boolean` field.
- `src/data/factions/helpers.ts`: `group()` gains an optional third parameter to set `hideId`.
- `src/data/chapters.ts`: the per-unit Chapter Tactics `group(...)` call passes `{ hideId: true }`.
- `src/components/EntryUpgradeControls.vue`: the section-heading template conditionally omits the `group.id. ` prefix when `group.hideId` is set. (Reused as-is by `RosterUnitPreview.vue`'s read-only Details panel, so both surfaces are fixed by this one change.)
