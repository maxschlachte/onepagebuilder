## Why

`ListsView.vue`'s game-system selector (Warhammer 40k / Warhammer Fantasy) is a segmented-control tab pattern (`role="tablist"`, a shared bordered/padded container, active/inactive button states) that has no sibling anywhere else in the codebase — `extract-shared-vue-components`' design.md explicitly called it out as a *distinct* pattern from `AppButton` and left it untouched for that reason. `BuilderView.vue`'s mobile Roster/Selected-Units switcher is a second, differently-styled two-option toggle (two full-width `AppButton`s, no shared container, no tablist semantics) solving the same underlying problem: let the user pick one of a small fixed set of views. Having two different-looking, differently-marked-up implementations of "pick one of N" is exactly the kind of duplication this project has been consolidating — a single reusable tab-switcher component lets both call sites share styling and behavior from one file.

## What Changes

- Extract the segmented-control tab pattern from `ListsView.vue` into a new reusable component (exact name finalized in design.md).
- Use it for `ListsView.vue`'s game-system selector (Warhammer 40k / Warhammer Fantasy).
- Use it for `BuilderView.vue`'s mobile Roster / Selected Units switcher, replacing its current two-full-width-`AppButton` markup with the same segmented-control component — this is a visual change for the mobile switcher (adopts the shared bordered/padded container and `role="tablist"`/`role="tab"`/`aria-selected` semantics it didn't have before), bringing it in line with the game-system selector's look and accessibility markup.
- No change to either switcher's underlying state (`store.activeSystem` / `BuilderView`'s local `activeTab`) or the panels/content each one shows — purely the switcher control's markup and how it's shared.

## Capabilities

### New Capabilities
(none — this is an internal refactor, no new user-facing capability)

### Modified Capabilities
- `army-builder-ui`: the "Mobile tab switcher for Roster and Selected Units" requirement's visual/markup contract is refined — the switcher now uses the same segmented-control tab pattern (and `role="tablist"`/`role="tab"` semantics) as the game-system selector, instead of two independent full-width buttons.

## Impact

- `src/views/ListsView.vue` — game-system selector replaced with the new shared component; no behavior change.
- `src/views/BuilderView.vue` — mobile tab switcher replaced with the new shared component; visual/markup change (segmented container, tablist semantics) as described above, same underlying `activeTab` state and panel-visibility logic.
- New file under `src/components/`: the tab-switcher component (name and prop/generic design finalized in design.md).
- Existing tests (`ListsView`-adjacent and `integration.test.ts`'s "Mobile tab switcher" coverage, if any target button text/click behavior) must keep passing — verify during implementation.
