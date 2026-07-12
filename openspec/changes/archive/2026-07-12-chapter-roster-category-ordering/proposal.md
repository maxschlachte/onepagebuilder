## Why

For a Space Marines list with a chapter selected, the builder roster currently lists every base Space Marines unit first, then appends all of that chapter's extra units as one block at the end (in whatever order the chapter's data module defines them). This buries chapter Heroes/Psykers (e.g. Sanguinary Priest, Brother Champion) far below the base roster's Vehicles, and mixes Infantry, Vehicles, and Heroes within the appended block with no relation to the base roster's categories. A chapter's units should read as part of the same army, grouped with their peers by category, not as a separate tacked-on list.

## What Changes

- When a Space Marines list has a chapter selected, the roster is grouped into ordered categories — Heroes/Psykers first, then Infantry, then Vehicles, then anything else — with each chapter's extra units placed within the matching category alongside the base Space Marines units of that same category, rather than appended as one block after all base units.
- Within each category, the base Space Marines units keep their existing relative order, followed by that chapter's units of the same category in their existing relative order (a stable re-sort, not a full alphabetical/manual re-authoring of unit order).
- A Space Marines list with no chapter selected, and every other faction's roster, is unaffected — this only changes the unit order produced when a chapter's units are merged into the roster.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: "Faction selection and unit roster" gains a requirement that a chapter-selected Space Marines roster is ordered by category (Heroes/Psykers, then Infantry, then Vehicles, then other) with chapter units grouped alongside their base-faction category peers.

## Impact

- `src/data/chapters.ts`: `getEffectiveFaction`'s unit-merging step gains a category-based stable sort, applied only to the assembled (chapter-selected) `units` array — the no-chapter passthrough path is untouched.
- No changes to `src/domain/calc.ts`, the store, or any Vue component — the roster (`BuilderView.vue`) already renders `faction.units` in array order, so reordering the assembled array is sufficient.
