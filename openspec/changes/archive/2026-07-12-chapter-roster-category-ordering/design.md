## Context

`getEffectiveFaction(factionId, chapterId)` in `src/data/chapters.ts` currently builds the merged unit list for a chapter-selected Space Marines list as `[...base.units, ...bundle.units]` (base faction units followed by the whole chapter bundle, unsorted). `BuilderView.vue`'s roster renders `v-for="unit in faction.units"` with no grouping or re-sorting of its own — the array order it receives is exactly what's displayed. So the roster's category grouping is entirely a property of the order `getEffectiveFaction` produces; nothing in the Vue layer needs to change.

`src/domain/calc.ts` already exports `isInfantry`, `isVehicle`, and `isHero` predicates (added for the Chapter Tactics feature), plus each `UnitProfile.specialRules` carries a `psyker` rule id when applicable — everything needed to categorize a unit is already available with no new predicates required.

## Goals / Non-Goals

**Goals:**
- A chapter-selected roster groups into: Heroes/Psykers, then Infantry, then Vehicles, then anything else (a catch-all for any future category, e.g. Monster, even though none exists in Space Marines/chapter data today).
- Within a category, base units keep their current order, followed by that chapter's units of the same category in their current order — a stable sort, not a full manual reordering.
- No behavior change for a chapter-less Space Marines list or any other faction.

**Non-Goals:**
- No visible section headers/dividers between categories in the roster UI — this change only reorders the underlying array; adding "Heroes", "Infantry", "Vehicles" headings to the roster is a separate, not-requested UI change.
- No change to the *Selected Units* panel's ordering (which follows list-insertion order via `list.units`, not the roster) — only the "available units to add" roster is affected.

## Decisions

1. **Sort in `getEffectiveFaction`, not in the Vue layer.** The category order is computed once per assembled faction, as a plain `Array.prototype.sort` (stable per spec since ES2015+, guaranteed since ES2019) on `[...base.units, ...bundle.units]` by a category rank function. This keeps `BuilderView.vue` completely unaware of chapters (matching the existing design principle that only `chapters.ts` knows about chapter merging) and is trivially unit-testable alongside the existing `chapters.test.ts` coverage.
   - *Alternative considered*: interleave category-by-category while building the merged array (e.g. `[...base heroes, ...chapter heroes, ...base infantry, ...chapter infantry, ...]`) instead of merge-then-sort. Rejected as equivalent in outcome but more code — a single stable sort achieves the same grouping with less surface area, since JS's guaranteed-stable sort naturally preserves each side's relative order within a category.

2. **Category rank function**: `categoryRank(unit) = 0` if `isHero(unit) || unit.specialRules.some(r => r.ruleId === 'psyker')`, `1` if `isInfantry(unit)`, `2` if `isVehicle(unit)`, else `3` (catch-all "other", not currently reachable for Space Marines data but present for forward-compatibility, e.g. a future Monster-type chapter unit). Sorting by this rank alone (stable) achieves "grouped by category, original relative order preserved within each group."
   - *Alternative considered*: reuse `isInfantry`'s exclusion set directly instead of a rank function. Rejected — `isInfantry` already returns false for Hero/Psyker/Monster/Vehicle by design, so a unit that's none of those (a true catch-all) would also fail `isInfantry`; an explicit rank function with a final `else` branch is clearer than chaining three boolean checks with implicit fallthrough.

3. **Scope**: only the chapter-merge branch of `getEffectiveFaction` applies the sort; the no-chapter/non-Space-Marines passthrough branch returns `getFaction(factionId)` completely unchanged, so this cannot affect any other faction or a chapter-less Space Marines list, matching the proposal's stated scope exactly.

## Risks / Trade-offs

- [Risk] A stable sort's "preserves relative order" guarantee depends on the JS engine's `Array.prototype.sort` being spec-stable — Trade-off accepted: stability has been mandated by the ECMAScript spec since ES2019 and is implemented by every evergreen browser and Node version this project targets (Vite/Node tooling requires modern engines already); no polyfill or manual stable-sort implementation needed.
- [Risk] If a future chapter or base-faction unit legitimately carries none of Hero/Psyker/Infantry/Vehicle (falls into the "other" bucket), it will sort after Vehicles with no visual separation from the Vehicles group, which might read oddly — Mitigation: acceptable for now since no such unit exists in the current Space Marines/chapter data; revisit if/when a Monster-type Space Marine unit is added.
