## Context

`BuilderView.vue` (578 lines) is the largest component by a wide margin (next is `PrintView.vue` at 227). It renders two panels — Roster (`faction.units`) and Selected Units (`displayRows`, a discriminated union of `single` / `combined` / `group` rows, each with its own template branch, plus a nested `attached` sub-card) — and each branch repeats the same four sub-patterns with small variable substitutions:

1. **Headline row**: `<span class="text-md"><span class="font-medium">{name}</span><span class="text-stone-600 …">[{size}] · Q{quality} · {cost}pts</span><Badge …/></span>` inside a `flex items-center justify-between` wrapper, paired with a right-hand controls group. Occurs for the roster row and all four Selected Units card shapes (standalone/combined/group/attached) — 5 near-identical copies, differing in which fields exist (group has no single quality; roster has a conditional Hero/caster badge instead of a static one) and whether the wrapper has a bottom border/divider.
2. **Equipment + Special-rules block**: `<div>Equipment: <EquipmentList …/></div><div>Special: <RuleChips …/></div>` — appears in `RosterUnitPreview.vue` and 4 times in `BuilderView.vue` (standalone/combined/group/attached).
3. **Candidate `<select>`**: a dropdown populated from a computed candidate list (`combineCandidates`/`groupJoinCandidates`/`attachCandidates`), with a placeholder first option and a change handler that reads `event.target.value`, dispatches a store action, and manually resets `select.value = ''`. Three call sites in `BuilderView.vue` (`onCombineSelect`/`onAttachSelect`/`onGroupSelect`) plus a fourth inline "Add to group…" select using `onGroupSelect` again — same shape, same reset dance, each hand-rolled.
4. **Buttons**: every button across `BuilderView.vue`, `ListsView.vue`, `CreateListDialog.vue`, and `App.vue` inlines one of three visual treatments — filled/primary (`bg-yellow-700 … text-stone-50`), outlined/secondary (`border border-stone-300 … hover:bg-stone-100`), or filled/danger (`bg-red-800 … text-stone-50`) — at one of two sizes (base `px-4 py-2 text-base`, small `px-3 py-1.5 text-sm`). `align-selected-units-list-style`'s design.md already flagged the headline duplication and deferred consolidating it to "a future change"; this change is that follow-up, extended to cover the other three patterns the review surfaced.

`army-builder-ui/spec.md`'s "Touch-friendly control sizing" requirement already mandates a touch-friendly control size for builder buttons/selects — the extracted components must keep satisfying it, not just preserve current pixel values incidentally.

## Goals / Non-Goals

**Goals:**
- One component per repeated pattern (button, unit headline, equipment/rules block, candidate select), each used everywhere that pattern currently appears, so a styling change is a one-file edit.
- No visible or behavioral change: same classes (mod. minor, documented normalizations below), same DOM text, same interactions. The existing test suite (`integration.test.ts`, `PrintView.test.ts`, `EquipmentList.test.ts`, `EntryUpgradeControls.test.ts`) must keep passing without weakening assertions.
- Meaningfully shrink `BuilderView.vue` (script and template) by deleting the duplicated branches in favor of component calls.

**Non-Goals:**
- No new visual design — this is a mechanical extraction, not a redesign.
- No change to `EntryUpgradeControls.vue`'s internals, upgrade logic, or the `domain/calc.ts` computations that feed the templates.
- No extraction of the outer card wrapper (`<li class="rounded border …">` vs. the attached sub-card's amber-tinted variant) — the two wrapper shapes are a single class-list line each, low duplication value, and merging them would entangle the "attached" visual treatment with the other four; left as plain markup in `BuilderView.vue`.
- No touching the `ListsView.vue` list-menu items (Rename/Duplicate/Export/Delete — borderless, left-aligned menu rows), its `text-xs` rename Save/Cancel pair, or its game-system tab buttons (a segmented-control treatment — shared container border, no per-button border, active/inactive states that don't match either `AppButton` variant) — different affordances from the button grid below; not worth a shared component now, called out as an explicit exclusion so "replace every inline button" isn't read to include them.

## Decisions

### 1. `AppButton.vue` — variant × size prop grid, native attrs passthrough

`src/components/AppButton.vue` with props `variant: 'primary' | 'secondary' | 'danger'` (default `'secondary'`) and `size: 'base' | 'sm'` (default `'base'`), rendering a single `<button :type="type ?? 'button'">` with a default slot. No `emit('click')` — Vue 3's automatic attrs inheritance forwards `@click`, `:disabled`, `:aria-*`, `ref`, etc. straight to the root `<button>`, so call sites keep writing `<AppButton @click="…">` unchanged.

Class table (base classes always applied: `rounded font-display uppercase tracking-wide`):

| variant × size | classes |
|---|---|
| primary / base | `bg-yellow-700 px-4 py-2 text-base text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700` |
| primary / sm | `bg-yellow-700 px-3 py-1.5 text-sm text-stone-50 hover:bg-yellow-500 dark:bg-yellow-500 dark:text-slate-950 dark:hover:bg-yellow-700` |
| secondary / base | `border border-stone-300 px-4 py-2 text-base hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800` |
| secondary / sm | `border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 dark:border-slate-700 dark:hover:bg-slate-800` |
| danger / base | (unused today, included for completeness) `bg-red-800 px-4 py-2 text-base text-stone-50 hover:bg-red-600 dark:bg-red-600 dark:text-slate-950 dark:hover:bg-red-800` |
| danger / sm | `bg-red-800 px-3 py-1.5 text-sm text-stone-50 hover:bg-red-600 dark:bg-red-600 dark:text-slate-950 dark:hover:bg-red-800` |

**Normalization**: today's `secondary/sm` instances (Details, Leave group, Split, Detach) omit `font-display uppercase tracking-wide` while `primary/sm` (Add) and `danger/sm` (Remove) include it. Applying `font-display uppercase tracking-wide` uniformly is a one-line visual change (secondary/sm buttons gain uppercase+display-font styling to match their filled siblings) — small enough to fold into this refactor rather than special-casing it away. Called out explicitly here per the proposal's "verify equivalence" requirement; confirm it reads fine at both breakpoints during manual verification (task in tasks.md).

`CreateListDialog.vue`'s submit button keeps its own `disabled:opacity-50` — passed via a class on the `<AppButton>` instance (Tailwind classes on a component's root merge with the component's own via attrs fallthrough) rather than baked into `AppButton`, since disabled-state styling is only needed there today.

**Additional normalization found during implementation**: `CreateListDialog.vue`'s Cancel/Create buttons used a third padding/text combo (`px-4 py-2 text-sm`) not in the table above — neither `base` (`px-4 py-2 text-base`) nor `sm` (`px-3 py-1.5 text-sm`). Mapped to `size="sm"` (matching on text size, the more visually significant dimension); this shrinks their padding slightly from `px-4 py-2` to `px-3 py-1.5`. Covered by task 5.3's manual pass of the Create Army List dialog.

*Alternative considered*: a single `class` prop with raw Tailwind strings per call site (no variant enum). Rejected — that's just moving the duplication into props instead of removing it, and loses the "change once" property the proposal asks for.

### 2. `UnitHeadline.vue` — presentational, slot-based badge and controls

`src/components/UnitHeadline.vue`, props `name: string`, `cost: number`, `size?: number`, `quality?: string` (`UnitProfile.quality` is a string like `"3+"`, not numeric — corrected during implementation; group rows omit quality), `divider?: boolean` (default `true` — Selected Units cards keep their `border-b … pb-1` under the headline; the Roster row passes `:divider="false"` since it has no such border today). Two named slots: `badge` (optional, rendered right after the info text — covers the Roster row's conditional Hero/caster `<Badge>` and each card's static `Combined`/`Group`/`Attached` badge) and `controls` (the right-hand `flex items-center gap-2` group — Details/Add, Split, the "Add to group…" select, or the Combine/Group/Attach selects + Remove).

Renders:
```
<div class="flex items-center justify-between" :class="{ 'mb-1 border-b border-stone-300 pb-1 dark:border-slate-700': divider }">
  <span class="text-md">
    <span class="font-medium">{{ name }}</span>
    <span class="text-stone-600 dark:text-slate-400">
      <template v-if="size !== undefined">[{{ size }}] · </template>
      <template v-if="quality !== undefined"><span class="text-slate-600 dark:text-slate-400">Q{{ quality }}</span> · </template>
      <span class="text-yellow-700 dark:text-yellow-500">{{ cost }}pts</span>
    </span>
    <slot name="badge" />
  </span>
  <span class="flex flex-wrap items-center gap-2"><slot name="controls" /></span>
</div>
```
The group row's headline (`Group [2] · 20pts`, no quality) and the roster row (has quality, no divider) both fit this same prop surface — verified against every current usage while writing this design, no 6th shape needed.

**Additional normalization found during implementation**: the right-hand controls wrapper varied slightly across the five current call sites — Roster used `flex items-center gap-1`, the combined/group/attached cards used `flex items-center gap-2`, and only the standalone card used `flex flex-wrap items-center gap-2`. `UnitHeadline` standardizes on `flex flex-wrap items-center gap-2` for all five (Roster's gap goes from `1` to `2`; the others gain `flex-wrap`, inert unless a card ever has enough controls to overflow its width). Covered by task 5.3's manual pass.

*Alternative considered*: pass `badgeVariant`/`badgeLabel` props instead of a `badge` slot. Rejected — the Roster row's badge is conditional between two variants (Hero vs. caster) computed from a function (`casterBadgeLabel`) that stays in `BuilderView.vue`'s script; a slot keeps that decision at the call site instead of teaching the presentational component about roster-specific rules.

### 3. `UnitLoadout.vue` — equipment + special-rules pair

`src/components/UnitLoadout.vue`, props `equipment: EquipmentEntry[]`, `unitSize: number`, `faction: Faction`, `specialRules: RuleRef[]`. Renders the two-line `Equipment: <EquipmentList/>` / `Special: <RuleChips/>` block exactly as it appears in the 4 `BuilderView.vue` card shapes. `RosterUnitPreview.vue` keeps its own `border-t pt-1` wrapper and `EntryUpgradeControls` call around a `<UnitLoadout>` instance — the border/padding is specific to the roster preview panel, not part of the repeated pattern itself.

### 4. `CandidatePicker.vue` — candidate select with self-resetting value

`src/components/CandidatePicker.vue`, props `candidates: ListUnit[]`, `placeholder: string`, `label: (u: ListUnit) => string`, emits `pick: [instanceId: string]`. Owns a local `ref('')` bound to the `<select>` via `v-model`; a `watch` (or inline handler) emits `pick` with the chosen value and resets the local ref to `''` in the same tick — replacing the `event.target as HTMLSelectElement` + manual `select.value = ''` pattern in `onCombineSelect`/`onAttachSelect`/`onGroupSelect`. `v-if="candidates.length"` stays at the call site (visibility rules differ slightly in what they gate on — combine/attach/group eligibility functions already exist in `BuilderView.vue`'s script and are unrelated to the select's own rendering).

`BuilderView.vue` keeps `combineCandidates`/`groupJoinCandidates`/`attachCandidates`/`candidateLabel` and the store-dispatching logic (`store.combineUnits`/`attachToUnit`/`joinGroup`) in its script; only the DOM/reset boilerplate moves into `CandidatePicker.vue`. The three call sites collapse from a `<select>` + handler function each to `<CandidatePicker :candidates="…" placeholder="…" :label="candidateLabel" @pick="store.combineUnits(list.id, row.listUnit.instanceId, $event)" />`, and `onCombineSelect`/`onAttachSelect`/`onGroupSelect` are deleted from the script.

## Risks / Trade-offs

- **[Risk] `UnitHeadline`'s `secondary/sm` button normalization (Decision 1) and the badge/controls slot indirection change the exact DOM tree, which could break tests that use structural selectors (`find('.class > span')`) rather than text matching.** → Mitigation: run the full suite after each extraction step (tasks.md sequences this component-by-component, not as one big-bang swap), and grep test files for selector patterns touching these areas before starting, per Risk below turning into a concrete task.
- **[Risk] `CandidatePicker`'s internal `ref`-based reset is a behavior change from directly mutating `event.target.value`, even though the visible result (dropdown shows placeholder again after a pick) is the same.** → Mitigation: manual verification pass (mobile + desktop) for all four select call sites (Merge/Group/Attach/"Add to group…") after extraction, confirming re-selecting the same candidate twice in a row still fires (a `v-model` bound to `''` before the pick means selecting the same option twice produces two distinct "change" transitions, matching today's native-select behavior).
- **[Trade-off] `UnitHeadline`'s slot-based API is less rigid than a fully data-driven props API (e.g. `badge: { variant, label }`) — a future badge with different placement needs would require touching the component.** Accepted: the Roster row's conditional two-variant badge logic doesn't fit a single data shape cleanly, and slots keep the component simpler now; revisit only if a third badge shape appears.
