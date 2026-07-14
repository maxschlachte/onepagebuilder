## Context

`BuilderView.vue` renders two side-by-side lists: the Roster (`faction.units`) and Selected Units (`displayRows`). Each Roster `<li>` header is a single `flex items-center justify-between` row with two `<span>` groups: a left one holding `{{ unit.name }}`, `[{{ unit.size }}] · Quality {{ unit.quality }} · {{ unit.cost }}pts`, and any badge; and a right one holding the Details/Add buttons.

Selected Units renders four different card shapes (standalone unit, combined pair, group-deployment card, attached sub-card), each with its own near-identical header row already using the same `flex items-center justify-between` two-span structure — but in all four, the left span stops at name/size/quality, and `{{ cost }}pts` is the first child of the *right* span, ahead of the actual controls (selects/buttons).

## Goals / Non-Goals

**Goals:**
- Every Selected Units card header reads `name [size] · Q<quality> · costpts` on the left (matching Roster's order/format) and holds only actual controls on the right, for all four card shapes.

**Non-Goals:**
- No change to what controls exist, when they're shown, or what they do (Combine/Group/Attach select visibility rules, Split/Leave group/Detach/Remove behavior) — purely moving the cost figure's position in the header markup.
- No change to the Roster row itself.
- No change to badges (`Combined`, `Group`, `Attached`) — they stay where they currently are relative to the name, since the Roster row's own badge placement (Hero/caster badge, inline after the info text) is the pattern being matched, and these cards already follow that.

## Decisions

### 1. Move `{{ cost }}pts` into each card's left span, right after the quality figure

For each of the four header rows, relocate the `<span class="font-semibold text-yellow-700 dark:text-yellow-500">{{ cost }}pts</span>` from the start of the right-hand controls span into the left-hand info span, appended after the existing size/quality text — mirroring the Roster row's `[{{ unit.size }}] · <span>Quality {{ unit.quality }}</span> · <span class="text-yellow-700 dark:text-yellow-500">{{ unit.cost }}pts</span>` structure and its `·` separators. The right-hand span keeps its `flex items-center gap-2` wrapper and now starts directly with the first actual control (a `<select>` or `<button>`).

*Why*: this is the minimal-diff way to match Roster's layout exactly — same two-span/`justify-between` shape, just relocating one existing element, no new wrapper elements or CSS needed.

*Alternative considered*: restructure all four cards to reuse a single shared sub-component (e.g. `<UnitCardHeader>`) for the header row. Rejected as out of scope — the four cards' info content differs enough (combined size vs. quality vs. group roster count) that a shared component would need several slots/props for a purely cosmetic fix; worth considering separately if a future change needs to touch these headers again, not here.

### 2. Verify existing tests only assert cost *text presence*, not DOM position

`integration.test.ts`/`PrintView.test.ts` assertions matching `${cost}pts` (if any target the builder's Selected Units panel specifically) use `wrapper.text()`-style whole-text matching, which is insensitive to where in the DOM the text sits — so relocating the span shouldn't break them. Confirm this by running the full suite after the change rather than assuming.

## Risks / Trade-offs

- **[Risk] The `combined`/`group`/`attached` cards' left span currently has no `flex`/wrapping behavior tuned for the extra text length; adding `· costpts` could wrap awkwardly on narrow viewports.** → Mitigation: check the mobile Selected Units tab (already covered by the "Mobile tab switcher" requirement) after the change, matching Roster's own (already mobile-tested) wrapping behavior since the structure is now identical.
