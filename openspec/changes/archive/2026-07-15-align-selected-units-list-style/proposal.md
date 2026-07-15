## Why

In the builder, the Roster list (left panel) and the Selected Units list (right panel) use visibly different header-row layouts for what is structurally the same kind of row: a unit's identifying info on one side and its action controls on the other. In the Roster, each row's info group (name, size, quality, **cost**) sits on the left and its controls (Details, Add) sit on the right. In Selected Units, the info group only holds name/size/quality — the points cost is grouped with the action controls on the right instead, so the two lists don't read consistently and the right side is visually cluttered with a cost figure that isn't a control.

## What Changes

- Move each Selected Units card's points-cost display out of its right-hand controls group and into its left-hand info group, matching the Roster row's `name [size] · Quality X · costpts` ordering — for all four card shapes the Selected Units list renders: a standalone unit, a combined pair, a group-deployment card, and an attached Hero/Wizard/Psyker sub-card.
- Leave the right-hand group holding only actual controls (Combine/Group/Attach selects, Split, Leave group, Detach, Remove) — no other visual/behavioral change to those controls.
- No change to the Roster list itself (already correct); no change to any list/points logic, only the header row's markup/layout.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `army-builder-ui`: Selected Units card header rows must match the Roster row's left-info/right-controls layout, with cost shown as part of the info group rather than the controls group.

## Impact

- `src/views/BuilderView.vue` — the four Selected Units card header rows (standalone unit, combined pair, group-deployment card, attached sub-card).
- No test/domain-logic changes expected; existing `integration.test.ts`/`PrintView.test.ts` assertions that check for cost text (e.g. `toContain('${cost}pts')`) should still pass since the text itself doesn't change, only its position in the DOM — verify this holds during implementation.
