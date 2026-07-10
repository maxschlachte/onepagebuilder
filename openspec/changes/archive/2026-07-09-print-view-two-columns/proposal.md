## Why

The print view currently stacks unit boxes and rule-reference entries in a single vertical column, which wastes horizontal space on a printed page/PDF and makes lists with more than a handful of units run to many more pages than necessary.

## What Changes

- Lay out the unit boxes (`section.space-y-3` in `PrintView.vue`) in two columns instead of one, so paper/PDF width is used efficiently. Each unit box stays visually intact (a box's contents never split across the column break).
- Lay out the Rule Reference entries in two columns as well, but as a flowing multi-column layout (CSS `columns`), not a row-locked grid — entries of different lengths pack independently in each column instead of every row being stretched to the height of its tallest cell.
- No change to what data is shown or how any individual unit box or rule entry is rendered — this is a layout-only change scoped to `PrintView.vue`.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `print-view`: The "Print-optimized output" requirement gains two-column layout behavior for both the unit-box section and the rule-reference section.

## Impact

- `src/views/PrintView.vue`: unit-box container switches from a single-column stack to a two-column layout (with per-box break-avoidance for print pagination); the Rule Reference `<dl>` switches from `grid sm:grid-cols-2` to a two-column CSS multi-column (`columns-2`) layout.
- No changes to `src/domain/calc.ts`, `src/data/**`, or any other view — purely a template/style change in one component.
- No new dependencies.
