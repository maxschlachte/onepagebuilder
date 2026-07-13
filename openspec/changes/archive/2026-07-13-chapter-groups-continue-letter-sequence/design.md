## Context

`EntryUpgradeControls.vue` renders every upgrade section heading as `{{ group.hideId ? section.title : \`${group.id}. ${section.title}\` }}` (the `hideId` branch was added for the synthesized per-unit Chapter Tactics group, which has no meaningful letter at all). A chapter's own authored groups (`space-marine-chapters.ts`'s `bloodAngelsBundle`/`darkAngelsBundle`/`greyKnightsBundle`/`spaceWolvesBundle`) use internal ids like `ba-a`, `ba-b`, `da-e`, `gk-h`, `sw-k` — re-namespaced (see `space-marine-chapter-specialization`'s design.md decision 3) specifically so they don't collide with base Space Marines' own `A`–`O` group ids when merged into one `Faction.upgradeGroups` array in `getEffectiveFaction`. That collision-avoidance need is real (the codebase's `unit.upgradeGroups: string[]` → `Faction.upgradeGroups[].id` lookup requires ids to be unique within one assembled `Faction`), but the resulting id is not meant to be shown to a player, the same class of problem `hideId` already solved for the Chapter Tactics group — this is the same problem for a *real* group that does have a meaningful letter, just not `id` itself.

The user considered reusing each chapter's original pre-merge letters (Blood Angels: A–D,G; Dark Angels: E,F; Grey Knights: H,I,J; Space Wolves: K,L — what the old standalone `space-marine-chapters` faction used) but explicitly chose to continue the alphabet after the base faction's own last letter instead, so that within one assembled (chapter-selected) faction, a letter never means two different upgrade tables depending on which unit's card it's shown on — preserving the existing codebase convention that one letter = one specific shared upgrade table within a faction.

## Goals / Non-Goals

**Goals:**
- A chapter's own upgrade groups render with a single continuing letter (`P`, `Q`, `R`, ...) instead of their internal namespaced id.
- Every letter in an assembled (chapter-selected) faction is unique — no letter is shown on two different groups.
- The letter assignment is computed, not hardcoded, so it can't silently go stale if the base roster's group count changes.
- The internal `id` (used for `unit.upgradeGroups` references, `findSection`, `optionIndex`, etc.) is completely unchanged — this is a display-only fix, identical in spirit to the earlier `hideId` fix.

**Non-Goals:**
- No change to the Chapter Tactics group's own display (`hideId: true`, shows just "Chapter Tactics") — that's a separate, already-correct case with no meaningful letter to show at all.
- No renumbering/reordering of the base Space Marines faction's own `A`–`O` groups.

## Decisions

1. **Add `UpgradeGroup.displayId?: string`, computed in `getEffectiveFaction`, not hardcoded in `space-marine-chapters.ts`.** When assembling a chapter-selected faction, map `bundle.upgradeGroups` to shallow clones stamped with `displayId: letterFor(base.upgradeGroups.length + index)` (where `letterFor(n) = String.fromCharCode(65 + n)`, i.e. index `15` → `'P'` since base has 15 groups, `A`–`O`). This derives the continuation point from `base.upgradeGroups.length` at assembly time rather than a magic literal, so it's correct even if the base roster's group count changes later.
   - *Alternative considered*: hardcode `displayId: 'P'` etc. directly in each of the 12 `group(...)` calls across the four bundles in `space-marine-chapters.ts` (matching how `hideId: true` was set directly on the synthesized Chapter Tactics group). Rejected — that's 12 call sites to keep in sync by hand, all implicitly assuming base Space Marines will always have exactly 15 groups; computing it once in `getEffectiveFaction` from `base.upgradeGroups.length` is both less code and self-correcting.
2. **Never mutate `bundle.upgradeGroups`.** Each chapter bundle constant (`bloodAngelsBundle`, etc.) is a shared module-level export; the display-id stamping creates new group objects (`{ ...g, displayId }`) rather than mutating the originals in place, consistent with the existing "never mutate the base/bundle singletons" principle already followed for units in `applyTactics`.
3. **`EntryUpgradeControls.vue` heading**: `{{ group.hideId ? section.title : \`${group.displayId ?? group.id}. ${section.title}\` }}` — prefers `displayId` when set, falls back to `id` otherwise (every non-chapter group, unchanged behavior).

## Risks / Trade-offs

- [Risk] None of consequence — purely additive (`displayId` is optional and only set for chapter-bundle groups), no change to lookup/selection logic, no store/migration impact. Existing tests asserting real-group headings (`A. Replace one Assault Rifle`) are unaffected since base groups never get a `displayId`.
