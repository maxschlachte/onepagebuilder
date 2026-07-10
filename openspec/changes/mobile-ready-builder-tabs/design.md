## Context

`BuilderView.vue`'s Roster/Selected-units layout is `<div class="grid gap-4 md:grid-cols-2">` wrapping two `<section>`s — below `md` (768px) this already renders as a single column via Tailwind's grid defaults, but "single column" just means both sections stack full-height, one after the other; there's no way to jump straight to Selected Units without scrolling past the whole roster (18+ rows per faction, more with a `Details` panel expanded). The app already has a correct viewport meta tag and no other blocking mobile issue — this is specifically about the builder's two-panel layout and control sizing.

Buttons/selects across the app currently fall into a handful of ad hoc sizes, all on the small end: `text-xs px-1.5 py-0.5` (roster Details/group-leave/detach), `text-xs px-2 py-0.5` (Add, Split, Remove, combine/attach/group selects), `text-sm px-2 py-1` (Lists screen row actions), `text-sm px-2-3 py-1-1.5` (header-level: Back, Print view, Create, Import). There's no shared `Button.vue` component — every button is inline Tailwind utility classes at its call site, consistent with the rest of the codebase's "no UI component library" convention (confirmed: no `Button`/`Select` wrapper exists anywhere in `src/components/`).

## Goals / Non-Goals

**Goals:**
- On a narrow (mobile-width) screen, let the user switch between Roster and Selected Units without scrolling past one to reach the other.
- Preserve the existing desktop side-by-side view exactly as-is at `md`+.
- Raise the smallest two button/select sizing tiers to more touch-friendly dimensions, consistently, across the builder, lists screen, and print view's on-screen controls.

**Non-Goals:**
- No introduction of a shared `Button.vue`/`Select.vue` component — that's a larger refactor than "make buttons somewhat larger" calls for, and would touch every call site anyway with no behavior difference from bumping classes in place (matches the codebase's existing no-component-library convention).
- No change to the print view's actual printed output (the `print-unit`/`no-print` structure) — only its on-screen "← Back"/"Print / Save as PDF" buttons, which are already `no-print`-scoped and invisible in the PDF/print output.
- No redesign of the roster row or selected-unit card content — the tab switcher only changes *which panel is visible*, not what's inside either one.
- No new Tailwind breakpoint — reuse `md` (768px), the same one the existing grid already keys off, so "mobile" here means exactly what it already means to the current layout.

## Decisions

**1. Tab switcher is `md:hidden`; both sections gain a `hidden`-below-`md`-when-inactive class, always `md:block`.**
```html
<div class="mb-3 flex gap-2 md:hidden">
  <button :class="tabClass('roster')" @click="activeTab = 'roster'">Roster</button>
  <button :class="tabClass('selected')" @click="activeTab = 'selected'">Selected Units ({{ list.units.length }})</button>
</div>
<div class="grid gap-4 md:grid-cols-2">
  <section class="md:block" :class="{ hidden: activeTab !== 'roster' }">...</section>
  <section class="md:block" :class="{ hidden: activeTab !== 'selected' }">...</section>
</div>
```
`activeTab = ref<'roster' | 'selected'>('roster')`. At `md`+, Tailwind's `md:block` (a responsive utility, emitted inside a `@media (min-width: 768px)` block later in the generated stylesheet) overrides the plain `hidden` class regardless of `activeTab` — this is the standard Tailwind "mobile-conditional, always-shown-on-desktop" pattern, not a new technique. Below `md`, only the active tab's section has `block`/no `hidden`, so the grid effectively renders one column of content (the grid itself stays `md:grid-cols-2`, irrelevant below `md` since only one section is ever visible there).
Alternative considered: v-if instead of a `hidden` class, unmounting the inactive panel's DOM entirely on mobile (and both mounted at `md`+ via a computed). Rejected — would need extra logic to force "both mounted" above `md` regardless of `activeTab`, more state than the class-based approach, and would remount (losing scroll position / any local component state) every time the user switches tabs, whereas the CSS-only approach just toggles visibility.

**2. Two sizing tiers, applied by replacing existing classes in place — no new component.**
- **Compact tier** (dense, in-row controls: roster Details/Add, selected-unit Split/Remove/Leave-group/Detach, the combine/attach/group `<select>`s): `text-xs px-1.5-2 py-0.5` → `text-sm px-3 py-1.5`.
- **Primary tier** (header-level actions: Back, Print view, Create, Import JSON, lists-screen row actions Open/Duplicate/Export/Delete): `text-sm px-2-3 py-1-1.5` → `text-base px-4 py-2`.
Applied directly at each call site (consistent with the codebase's existing per-element Tailwind convention), not extracted into a shared component (Non-Goals). `EntryUpgradeControls`' native `<input type="checkbox">` also grows slightly (`h-4 w-4`, up from the browser default ~13px) since it's the most-tapped control in the whole builder.
Alternative considered: a single unified size for every control. Rejected — the existing two-tier visual hierarchy (header actions read as more prominent than in-row row actions) is worth keeping; both tiers grow, but stay visually distinct.

**3. Mobile-tab tests assert the `hidden` class's presence, not actual computed visibility.**
jsdom (this project's test environment) doesn't evaluate CSS media queries or compute layout, so a test can't observe "is this actually hidden at 375px width" — it can only inspect the rendered class list. Tests assert: `activeTab` defaults to `'roster'`; the roster section's classlist has no `hidden`, the selected-units section's does; clicking the "Selected Units" tab flips both. This is a faithful test of the logic Tailwind's responsive classes then apply visually — genuinely testing the `md:block`-wins-at-desktop CSS behavior itself is out of scope for this test environment (as it already is for every other responsive class already in this codebase — none of the existing `md:grid-cols-2`/`sm:grid-cols-2` usages have a dedicated breakpoint test either).

## Risks / Trade-offs

- **[Risk]** Toggling a `hidden` class instead of `v-if` means the inactive tab's content (including any `Details` panel a user expanded in the Roster tab) stays mounted and in the DOM, just not painted — harmless for correctness, but means the roster's `expandedRosterIds` state (and any future per-panel local state) isn't reset by switching tabs. → **Mitigation**: this matches the existing desktop behavior already (both panels are simultaneously mounted at `md`+ today), so mobile tab-switching doesn't introduce a *new* state-retention behavior, just makes the already-existing one reachable on a narrower screen too.
- **[Trade-off]** Larger controls take more vertical space per row, meaning more scrolling within a single (now-isolated) tab on mobile. Accepted — the alternative (small, hard-to-tap controls) is the actual problem being fixed; the tab split is what keeps the *total* scroll distance down, not control size.

## Migration Plan

Presentational only. No persisted-data change, no route change.

## Open Questions

(none)
