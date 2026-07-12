## Why

A chapter's own upgrade groups (e.g. Blood Angels' Death Company's own upgrade table) are currently rendered with their internal namespaced id (e.g. `ba-b. Replace any Pistol`) instead of a clean single letter like the rulebook's `A.`/`B.`/`C.` convention every other group uses. The internal id exists only to avoid colliding with the base Space Marines faction's own `A`–`O` groups when the two are merged — it was never meant to be player-facing.

## What Changes

- Each chapter's own upgrade groups display a single continuing letter after the base Space Marines faction's own last letter (`O`) — e.g. Blood Angels' five groups display as `P`, `Q`, `R`, `S`, `T`; Dark Angels' two groups as `P`, `Q`; Grey Knights' three as `P`, `Q`, `R`; Space Wolves' two as `P`, `Q`. Each chapter's own lettering restarts at `P` independently (chapters are never assembled together, so there's no cross-chapter collision), while staying distinct from every base Space Marines group in the same assembled faction.
- The letter is computed at assembly time from the base faction's own group count, not hardcoded per chapter, so it stays correct if the base roster's group count ever changes.
- The internal group id (used for lookup/selection) is unchanged — only the displayed heading text changes.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: "Space Marine chapter specializations" gains a requirement that a chapter's own upgrade groups have a display letter continuing the base faction's own lettering sequence.
- `army-builder-ui`: a new requirement covers chapter units' own upgrade groups rendering with a continuing single letter instead of their internal namespaced id.

## Impact

- `src/domain/types.ts`: `UpgradeGroup` gains an optional `displayId?: string` field (distinct from the existing `hideId` flag used for the synthesized Chapter Tactics group).
- `src/data/chapters.ts`: `getEffectiveFaction` stamps each of the chapter bundle's own upgrade groups with a computed `displayId` (continuing letters after the base faction's own group count) when assembling the merged faction, without mutating the shared bundle objects.
- `src/components/EntryUpgradeControls.vue`: the section-heading template prefers `group.displayId` over `group.id` when present (falls back to `group.id` for every group that doesn't have one, i.e. every non-chapter group, unchanged).
