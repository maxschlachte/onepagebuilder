## Why

Chapter Tactics options are currently offered on every matching unit in an assembled chapter faction — including that chapter's own units. But a chapter's own units already bake that chapter's signature ability directly into their special rules: Blood Angels' Death Company and Sanguinary Guard already carry Furious (via Rage or directly); Grey Knights' Strike Squad, Grey Knights Terminators, Brother Champion, and Dreadknight already carry Aegis directly; Space Wolves' Wulfen, Thunderwolf Cavalry, Fenrisian Wolves, and Sled Captain already carry Counter-Attack directly. Offering the matching Chapter Tactics option again on these units is redundant and confusing — it looks like a paid upgrade for something the unit already has for free.

## What Changes

- Chapter Tactics options are synthesized only for base Space Marines units, never for the selected chapter's own extra units. A chapter's own units keep exactly their authored upgrade groups, with no Chapter Tactics section appended.
- This applies uniformly across all four chapters' units, not only where a naming/rule overlap is obvious — a chapter's own roster additions are assumed to already represent that chapter's flavor.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: "Space Marine chapter specializations" — a chapter's rule-modifier options are now scoped to the base Space Marines roster only, not to that chapter's own units.
- `army-builder-ui`: "Chapter Tactics options in the builder" — the category-wide/named-unit Chapter Tactics scenarios are refined to state that a chapter's own units never show that chapter's own Chapter Tactics options, even when they'd otherwise match the category/name predicate.

## Impact

- `src/data/chapters.ts`: `getEffectiveFaction`'s unit-assembly step applies the Chapter Tactics synthesis (`applyTactics`) only to `base.units`, not to `bundle.units`.
- `src/data/chapters.test.ts`: the existing test asserting Chapter Tactics options appear "including chapter units" needs updating to assert the opposite (chapter units do NOT get their own chapter's tactics options).
