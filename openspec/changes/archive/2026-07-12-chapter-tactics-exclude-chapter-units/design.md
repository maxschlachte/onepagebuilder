## Context

`getEffectiveFaction` in `src/data/chapters.ts` currently builds the merged unit list as:

```ts
const units = [...base.units, ...bundle.units]
  .map(applyTactics)
  .sort((a, b) => categoryRank(a) - categoryRank(b))
```

`applyTactics` runs the chapter's `tacticsTables` predicates (`isInfantry`, `isVehicle`, `isHero`, or a specific unit name) against every unit in the combined list — base Space Marines units and the chapter's own bundle units alike — and appends a synthesized "Chapter Tactics" group wherever a row matches. Since a chapter's own units are authored with that chapter's signature ability already baked into their `special` field (e.g. Blood Angels' Death Company: `'Fearless, Rage, Regeneration'`, where Rage's glossary text is "This unit has the Furious special rule but gets +2 attacks when Assaulting"; Grey Knights' Strike Squad: `'Aegis, Brothers, Fearless'`; Space Wolves' Wulfen: `'Counter-Attack, Fast, Fearless, Rage, Regeneration, Tough(3)'`), applying that same chapter's Chapter Tactics option to those units again is redundant.

## Goals / Non-Goals

**Goals:**
- A chapter's own units never show that chapter's own Chapter Tactics options, regardless of whether the unit's category/name would otherwise match.
- Base Space Marines units are completely unaffected — they keep getting Chapter Tactics options exactly as before.
- No change to category ordering (already handled by a prior change) or to the hidden-id heading behavior (already handled by a prior change) — this only narrows *which units* get a Chapter Tactics group at all.

**Non-Goals:**
- No per-tactic-row exception list (e.g. allowing Space Wolves' Sled Captain to still buy a "Wolf" companion since that's arguably not redundant the way a baked-in rule is). The user's request is a blanket rule — a chapter's own roster additions are treated as already fully representing that chapter, uniformly across all four chapters and all their tactic rows.

## Decisions

1. **Only map `applyTactics` over `base.units`, not `bundle.units`.** Change the assembly line to `[...base.units.map(applyTactics), ...bundle.units].sort(...)`. This is the minimal, correct fix — `bundle.units` are included in the final array unchanged (still merged, still category-sorted, still chapter-tagged for id/roster purposes), they simply never pass through the tactics-injection step.
   - *Alternative considered*: keep mapping over the full combined array but add a per-unit guard inside `applyTactics` (e.g. skip if `unit.id` starts with a `bundle`-derived slug). Rejected — splitting the `.map()` call itself is simpler and more obviously correct than adding a runtime check that has to reverse-engineer "is this a chapter unit," when the two arrays are already separately available at the call site.
2. **No new predicate needed.** `bundle.units` is already the authoritative "this chapter's own units" list at the point `getEffectiveFaction` assembles the roster — no need to introduce an `isChapterUnit()` helper or tag units with their originating chapter.

## Risks / Trade-offs

- [Risk] None of consequence — this narrows an existing synthesis step with no change to its output shape (`UnitProfile`/`UpgradeGroup` structures unaffected), no store/UI/migration changes needed. The existing "hideId" and category-ordering behavior for base units is untouched.
