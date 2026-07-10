## Context

`EntryUpgradeControls.vue` currently requires `listId: string` and `listUnit: ListUnit` — every option's checked/disabled state is computed from `listUnit.selectedUpgrades`, and its checkbox's `@change` calls `store.toggleUpgrade(listId, listUnit.instanceId, opt.id)`. A roster unit that hasn't been added yet has no `ListUnit` to pass. `RosterUnitPreview.vue` today only renders `EquipmentList` (baseline equipment) and `RuleChips` (baseline special rules) — it never touches upgrade groups at all, and wraps that content in its own `rounded border ... bg-white` box, itself nested inside the roster `<li>`'s own bordered box, with a repeated `<strong>{{ profile.name }}</strong>` heading.

## Goals / Non-Goals

**Goals:**
- Show every available upgrade section/option (with cost and rule tooltips) for a roster unit before it's added, using the same markup/behavior a selected unit's upgrade list already has, minus interactivity.
- Remove the redundant name and the nested-box styling.
- Give the toggle button a clear text label.

**Non-Goals:**
- No change to the interactive (selected-unit) behavior of `EntryUpgradeControls` — existing callers (all of which pass `listId`/`listUnit`) keep working identically.
- No change to prerequisite/availability logic itself — the read-only mode simply doesn't evaluate it (nothing is selected yet, so "unavailable because X isn't selected" would be true for every gated section and add noise rather than information).
- No change to the `filter="whole"|"perModel"` mechanism — unused by the roster panel (it always wants everything), but left intact for the combined-pair use.

## Decisions

**1. `EntryUpgradeControls` gains a read-only mode by making `listId`/`listUnit` optional, not a separate component.**
`readonly = computed(() => !props.listUnit)`. In read-only mode: `isSectionUnavailable`/`isOptionDisabled` both return `false` unconditionally (skip prerequisite evaluation entirely — see Non-Goals), and the template omits the `<input type="checkbox">` for each option, along with the "cursor-pointer"/disabled styling and the unavailable-reason hint line (which would never render anyway once `isSectionUnavailable` is always `false`). Every group/section header and every option's label+cost still renders exactly as today.
Alternative considered: a separate `ReadOnlyUpgradeList.vue` duplicating the group/section/option markup. Rejected — the user's own framing ("just use the UI for the selected units but without the checkboxes") is exactly what optional props + a read-only branch gives for free, and keeps the tooltip-splitting logic (`labelTooltip`) in one place rather than two components drifting apart over time.

**2. `RosterUnitPreview.vue` becomes: equipment list, special rules, then read-only `EntryUpgradeControls` — no name, no box.**
Drop the `<strong>{{ profile.name }}</strong>` line (redundant with the row header). Replace the `rounded border border-gray-300 bg-white p-2 ...` wrapper with a plain `border-t border-gray-100 pt-1 dark:border-gray-800` divider — visually separates the expanded content from the row header without nesting a second box inside the roster row's existing border. No explicit `text-xs`/font-size override on the wrapper either, since `EquipmentList`/`RuleChips`/`EntryUpgradeControls` already carry their own `text-sm` sizing (the same sizing the "selected units" panel already uses) — letting that apply directly is what makes this "just the selected-units UI" rather than a visually distinct, smaller preview.

**3. Toggle button label changes from "ⓘ" to the word "Details"; `aria-label` simplifies accordingly.**
`{{ expandedRosterIds.has(unit.id) ? 'Hide details' : 'Details' }}` as the button's visible text (doubling as its accessible name — no separate `aria-label` needed once the text itself is descriptive); `aria-expanded` stays as-is.

## Risks / Trade-offs

- **[Risk]** A future caller of `EntryUpgradeControls` could accidentally omit `listUnit` and silently get read-only behavior instead of a type error. → **Mitigation**: none needed beyond the type system — `listId`/`listUnit` becoming optional is an intentional, documented mode switch (mirrors how `filter` is already an optional mode switch on the same component), not an accident waiting to happen; existing call sites are unchanged and keep passing both.
- **[Trade-off]** The read-only catalog shows every option as if fully available, including ones that would actually be gated by a prerequisite once the unit has some other option selected. This is intentional (Non-Goals) — a pre-add catalog can't meaningfully evaluate "unavailable because X isn't selected" when nothing is selected yet, and showing every gated section as unavailable would misrepresent the unit's options as more limited than they are.

## Migration Plan

Additive/corrective UI-only change. No persisted-list shape change, no faction-data change.

## Open Questions

(none)
