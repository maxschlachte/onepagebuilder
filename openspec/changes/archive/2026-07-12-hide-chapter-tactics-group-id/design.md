## Context

`EntryUpgradeControls.vue` (reused unchanged by `RosterUnitPreview.vue`'s read-only Details panel) renders every upgrade section heading as `{{ group.id }}. {{ section.title }}` — the single source of this rendering across the app (confirmed by grep: no other component displays `group.id`). Real faction data always uses short single-letter group ids (`A`, `B`, ...), so this reads naturally. The Chapter Tactics feature (`src/data/chapters.ts`) synthesizes one `UpgradeGroup` per matching unit with an id like `blood-angels-tactics-tactical-marines`, needed only for internal uniqueness (it's used as a lookup key and as the value pushed onto a unit's `upgradeGroups` list) — it was never meant to be shown to the player.

## Goals / Non-Goals

**Goals:**
- Chapter Tactics headings show only "Chapter Tactics", not the internal group id.
- Every other (real, lettered) group's heading is completely unaffected.
- The fix is data-driven (a flag on the group), not a heuristic on the id's shape (e.g. "hide if id.length > 1"), per the user's explicit request.

**Non-Goals:**
- No change to the internal group id scheme itself, or to how it's used for lookup/keying — only its display is affected.

## Decisions

1. **Add `UpgradeGroup.hideId?: boolean`, set via `group()`'s new third parameter.** This keeps the flag co-located with the data that owns it (the group), consistent with how every other display nuance in this codebase (e.g. `UpgradeOption.label`, `SectionPrerequisite`) is expressed as typed data rather than inferred in the Vue layer.
   - *Alternative considered*: infer "hide the id" from the id's shape (e.g. contains a hyphen, or length > 1) directly in `EntryUpgradeControls.vue`. Rejected — matches the user's own suggestion of an explicit flag, and avoids coupling the UI to an incidental naming convention of the chapter-tactics id scheme, which could change independently.
2. **`group(id, sections, opts?: { hideId?: boolean })`** — an optional third argument, so every existing call site across all faction data files (`group('A', [...])`) continues to compile and behave identically (`hideId` defaults to `undefined`, falsy).
3. **Template change**: `{{ group.hideId ? section.title : `${group.id}. ${section.title}` }}`, a single-line conditional in the one place that renders this heading.

## Risks / Trade-offs

- [Risk] None of consequence — this is a purely additive, backward-compatible type/helper change plus a one-line template conditional. Existing tests exercising heading text (e.g. `integration.test.ts`'s `'A. Replace one Assault Rifle'`-shaped assertions, if any) are unaffected since no existing call site sets `hideId`.
