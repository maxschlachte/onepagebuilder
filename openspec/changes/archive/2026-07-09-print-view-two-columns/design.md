## Context

`PrintView.vue` renders two independent lists as a single vertical stack: the per-unit stat boxes (`section.space-y-3` > `.print-unit` divs, each with a variable height driven by how many weapon tables/rules it has) and the deduplicated Rule Reference entries (`dl.grid.sm:grid-cols-2`, already two columns but as a CSS grid — each grid *row* is as tall as its tallest cell, so a long rule definition in the left column stretches empty space into the right column's same row).

Both sections need to become two columns on a printed page/PDF, and the rule-reference section specifically needs to stop being a row-locked grid.

## Goals / Non-Goals

**Goals:**
- Unit boxes flow into two columns, filling the page width, without visually splitting a single unit's content across the column break.
- Rule Reference entries flow into two columns as an unpaired, height-independent layout (CSS multi-column, not grid) — a short entry in column one doesn't force blank space in column two's same "row" (there is no row).
- Layout holds up both on screen and in the browser's print/PDF output.

**Non-Goals:**
- No change to what data each unit box or rule entry contains, or how an individual box/entry is rendered internally.
- No responsive breakpoint design for narrow screens — this is a print-first view; two columns is fine down to typical paper widths, and single-column readability at very narrow viewport widths is an acceptable pre-existing trade-off (the current grid already assumes `sm:` width for two columns).

## Decisions

**Use CSS multi-column (`columns-2`) for both sections, not CSS grid.**
CSS multi-column flow (`column-count`) balances variable-height items into columns automatically, filling column one before starting column two (or balancing heights, depending on `column-fill`), which is exactly the "not a grid" behavior requested for the Rule Reference and is *also* the better fit for the unit-box section: unit boxes vary a lot in height (a 1-line Troop vs. a Land Raider with two weapon tables), and a CSS grid would force row-pairing that produces uneven whitespace. Tailwind's `columns-2` utility (core since Tailwind CSS 3.4, already the project's version) maps directly to `column-count: 2`, so no new dependency or plugin is needed.
Alternative considered: keep `grid grid-cols-2` for unit boxes (row-paired) — rejected because unit box heights are too variable; a tall box would strand a short one across the page from its "row partner" while leaving visible dead space.

**Each unit box gets `break-inside-avoid`.**
CSS multi-column layout can split a single flowed element across the column break (or across a print page). Tailwind's `break-inside-avoid` utility maps to `break-inside: avoid`, keeping each `.print-unit` box intact in whichever column it lands in. This is the standard fix for "don't split this card" in a multi-column or print context and needs no JS.

**Keep the existing per-box and per-entry markup unchanged; only change the two container elements' classes.**
`section.space-y-3` → `columns-2 gap-3` (plus `break-inside-avoid` added to each `.print-unit`); `dl.grid.gap-x-6.gap-y-1.sm:grid-cols-2` → `dl.columns-2.gap-x-6` (the individual `<div>` rule entries don't need a break-avoidance class since a split rule definition read across a column break is a much smaller readability cost than a split unit box, and rule text is normally short enough not to span the column height in practice — revisit only if real print output shows a problem).

## Risks / Trade-offs

- **[Risk]** A very tall single unit box (many upgrades, several weapon tables) could still be taller than one column's available height, and `break-inside-avoid` combined with a taller-than-column box can push it whole onto the next column/page, leaving a large gap. → **Mitigation**: acceptable for this app's realistic list sizes (One Page 40k unit stat blocks are short); revisit only if real usage shows oversized boxes.
- **[Risk]** Browser support/consistency for CSS multi-column in print contexts varies slightly more than grid across browsers/print engines. → **Mitigation**: spot-check the browser print preview (Chrome, the most common "Save as PDF" path) after implementing; this is a cosmetic risk, not a data-correctness one.

## Open Questions

None — this is a small, low-ambiguity layout change; proceed to implementation.
