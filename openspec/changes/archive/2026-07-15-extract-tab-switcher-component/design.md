## Context

`ListsView.vue`'s game-system selector renders a segmented-control pattern: an outer `flex gap-1 rounded border border-stone-300 p-1` container with `role="tablist"`, containing one `<button role="tab" :aria-selected="…">` per `systemOptions` entry, each auto-sized to its label, with the active option filled (`bg-yellow-700 text-stone-50 …`) and inactive options plain (`hover:bg-stone-100 …`).

`BuilderView.vue`'s mobile Roster/Selected-Units switcher (from `extract-shared-vue-components`) currently renders two full-width `AppButton`s in a plain `flex gap-2` row, each independently bordered (the `secondary` variant's own `border`), no shared container, no `role="tablist"`/`role="tab"`/`aria-selected`. `extract-shared-vue-components`' design.md explicitly flagged the game-system selector as a distinct pattern from `AppButton` and left both switchers separate. This change unifies them: extract the segmented-control pattern once, and use it for both, including for BuilderView's mobile switcher — which is therefore a genuine visual/markup change there (gains the shared bordered container and tablist semantics), not just a code move.

Both call sites' underlying value is read via a getter/`.value` rather than a plain writable ref: `store.activeSystem` is a Pinia `computed` (its setter is the separate `setActiveSystem` action, which also persists to `localStorage` via a `watch` — see `src/stores/lists.ts:146-157`), and `BuilderView`'s `activeTab` is a local `ref` but has no dedicated setter function. A single component API needs to fit both without forcing `store.activeSystem` into something it isn't (a writable ref).

`integration.test.ts`'s "mobile tab switcher" describe block drives the switcher via `builder.findAll('button')` matched by text (`'Roster'`, `'Selected Units (…)'` prefix) and `.trigger('click')` — the new component must keep rendering plain `<button>` elements with that same visible text for those tests to keep passing unmodified.

## Goals / Non-Goals

**Goals:**
- One component (`src/components/TabSwitcher.vue`) implementing the segmented-control pattern, used by both `ListsView.vue`'s game-system selector and `BuilderView.vue`'s mobile Roster/Selected-Units switcher.
- Preserve the game-system selector's exact current appearance and behavior (no regression there).
- Bring the mobile switcher's markup/accessibility semantics in line with the game-system selector's (`role="tablist"`/`role="tab"`/`aria-selected`, shared bordered container) — an intentional, proposal-documented visual change for that one call site.
- Type-safe across both call sites' different literal-union value types (`'system-40k' | 'system-fantasy'` vs. `'roster' | 'selected'`) without `as` casts at the call sites.

**Non-Goals:**
- No change to either switcher's underlying state management — `store.activeSystem`/`setActiveSystem` and `BuilderView`'s local `activeTab` ref keep their current shape; the component only reads a current value and emits a "user picked this one" event.
- No support for more than the two switchers already in the codebase, and no speculative props (icons, disabled options, vertical orientation) beyond what those two call sites need.
- No change to what panels/content each switcher shows or when — purely the switcher control itself.

## Decisions

### 1. `TabSwitcher.vue` — generic component, `active`/`select` (not `v-model`)

`src/components/TabSwitcher.vue`, declared with `<script setup lang="ts" generic="T extends string">` so both call sites get full literal-union type checking with no casts. Props: `options: { id: T; label: string }[]`, `active: T`, `ariaLabel: string` (forwarded to the root's `aria-label`, matching the current `aria-label="Game system"`). Emits `select: [id: T]` rather than using `v-model`/`defineModel`, because `store.activeSystem` is a read-only `computed` — its write path is the `setActiveSystem` action (which also persists to `localStorage`), not a plain assignment, so a two-way-binding API would misrepresent it. `select` keeps both call sites' wiring a plain one-line handler:

- `ListsView.vue`: `<TabSwitcher :options="systemOptions.map(s => ({ id: s.id, label: s.name }))" :active="store.activeSystem.value" aria-label="Game system" @select="store.setActiveSystem" />`
- `BuilderView.vue`: `<TabSwitcher :options="[{ id: 'roster', label: 'Roster' }, { id: 'selected', label: \`Selected Units (${list.units.length})\` }]" :active="activeTab" aria-label="Builder panel" @select="activeTab = $event" />`

*Alternative considered*: `defineModel<T>()` for a `v-model` API. Rejected — it would require exposing a writable computed wrapper around `store.activeSystem`/`setActiveSystem` at the `ListsView.vue` call site just to satisfy the component's API, adding indirection with no benefit over a one-line `@select` handler.

**Limitation found during implementation**: this vue-tsc/Volar version resolves `select`'s payload type to the generic's constraint (`string`) rather than the call site's narrowed `T` (`GameSystem` / `BuilderTab`), even though the `options`/`active` *props* do infer correctly when bound to explicitly-typed variables — a real gap in generic SFC emit-type propagation, not fixable by handler style (tried both a bare function reference and an inline arrow; both hit the same widening). Explicit generic-argument tag syntax (`<TabSwitcher<GameSystem> ...>`) was tried first and rejected for a different reason — it isn't parsed as a generic instantiation by this project's template compiler at all (`':' expected` / `',' expected` parse errors), so it's not a viable syntax here regardless.

Worked around with a per-call-site type-predicate function (`isGameSystem`/`isBuilderTab`) that narrows the `string` payload back to the literal union before it reaches the real setter — no `as` cast, since the predicate function is a genuine (if runtime-trivial) type guard, and it fails closed if `select` ever emitted something outside `options` (impossible given `TabSwitcher`'s own implementation, but the guard costs nothing and keeps the boundary honest). Each call site keeps one small named handler (`onSelectSystem`/`onSelectBuilderTab`) instead of the originally-planned one-line `@select="store.setActiveSystem"` / `@select="activeTab = $event"`.

### 2. `fullWidth` prop for the two container/button layouts

The game-system selector's container and buttons size to content (`inline` segmented control); the mobile switcher's two buttons currently span the full row width evenly (`flex-1` each). Add a `fullWidth?: boolean` prop (default `false`): when `true`, the root container gets `w-full` and each button gets `flex-1 text-center` in addition to the shared segmented classes, replicating the mobile switcher's current full-bleed sizing inside the new shared bordered/padded container. `BuilderView.vue` passes `full-width`; `ListsView.vue` doesn't (keeping its current auto-width look).

*Why a prop instead of leaving sizing to the caller via a `class` override*: the segmented container's `flex`/`gap`/`border`/`p-1` classes and the per-button `flex-1` need to agree with each other (a full-width container with non-`flex-1` buttons wouldn't divide evenly) — bundling them behind one prop keeps that pairing correct at both call sites instead of relying on each caller to pass the right raw classes.

### 3. Root renders `role="tablist"` unconditionally; buttons render `role="tab"`/`aria-selected`

Both call sites get the same accessibility markup the game-system selector already has today. This is the intentional behavior change for `BuilderView.vue`'s mobile switcher called out in the proposal — it currently has no tab semantics at all.

## Risks / Trade-offs

- **[Risk] `integration.test.ts`'s "mobile tab switcher" tests match buttons by `.text()` (`'Roster'`, starts-with `'Selected Units'`) and assert on sibling `<section>` classes — unaffected by the markup change since the component still renders `<button>` elements with the same visible text, but confirm by running the suite rather than assuming.** → Mitigation: task to run the full suite immediately after wiring `BuilderView.vue` to the new component, before moving on.
- **[Trade-off] Making the mobile switcher's look match the game-system selector (bordered segmented container, tighter button padding via the shared classes) is a real visual change users will see, not just a code move.** Accepted per the proposal — this is the explicit point of the request; verify it still reads well at the mobile breakpoint via a manual pass (both panels' item counts, long faction names) before calling this done.
