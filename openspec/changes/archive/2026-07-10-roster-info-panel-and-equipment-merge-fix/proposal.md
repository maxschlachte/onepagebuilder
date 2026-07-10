## Why

Two issues found while using the roster/combine features shipped in `builder-roster-preview-and-army-rules` (implemented, not yet archived): the roster's unit-stat preview is a hover-only CSS popover with no discoverable trigger — nothing on the row hints that hovering reveals anything, and it's unusable on touch devices. Separately, a combined pair or group-deployment combine's equipment list silently loses information: two equipment entries that share the same underlying weapon but differ in their attached rules (e.g. one squad copy's plain Meltagun and the other's "Meltagun (Limited)" attachment) get merged into a single "2x Meltagun" line, keeping only one side's rules — the Limited restriction disappears from the display entirely even though the unit still has it.

## What Changes

- **Roster preview becomes an explicit expand/collapse panel.** Replace the hover-triggered popover with an "ⓘ" info button next to each roster row's "Add" button; clicking it expands an inline panel directly in the roster list showing the unit's baseline equipment and special rules (same content as today, reusing `EquipmentList`/`RuleChips`), and clicking again (or the same button) collapses it. Works identically with mouse, keyboard, and touch — no hover dependency.
- **Fix equipment-merge-by-key losing rule variants.** `combinedEffectiveUnit` and `groupEffectiveUnit` (the display-aggregation functions behind a combined Infantry pair and a group-deployment combine) currently merge equipment entries purely by `EquipmentEntry.key`, summing their `unitCount` and keeping only the first-seen entry's `rules`/`weapon.rules` — so a plain weapon and a rule-bearing variant of the *same* weapon (Limited being the concrete case reported, but this applies to any attached-rule variant) silently collapse into one entry that reports neither model's actual loadout correctly. Both functions SHALL instead merge only equipment entries that are the same item *and* carry the same attached rules, keeping distinct rule-variants (e.g. a Limited copy) as separate entries with their own count.
- **BREAKING**: none — the roster preview is a UI-only interaction change (no data shape change); the equipment-merge fix only affects the previously-incorrect display aggregation, not `applyUpgrades`, cost math, or any persisted list data.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: roster stat preview changes from hover-triggered to an explicit info-button expand/collapse panel.
- `army-list-management`: the Infantry combine and group-deployment combine requirements both gain a scenario guaranteeing distinct rule-variants of the same equipment item stay separate entries when merged for display.

## Impact

- `src/components/RosterUnitPreview.vue`: becomes a plain expandable content block (no hover/focus popover CSS, no slot-wrapping trigger) rendered conditionally by its parent.
- `src/views/BuilderView.vue`: roster row gains an info-toggle button and per-unit expanded/collapsed state; the row's trigger content (name/badges) stays inline, no longer wrapped in the preview component.
- `src/domain/calc.ts`: `combinedEffectiveUnit` and `groupEffectiveUnit`'s equipment-merge step keys on `(EquipmentEntry.key, serialized rules)` instead of `EquipmentEntry.key` alone.
- Tests: component test for the roster info-toggle button; unit tests for both merge functions covering a same-key, different-rules pair (e.g. plain Meltagun + Meltagun (Limited)) staying as two distinct entries with their own counts.
