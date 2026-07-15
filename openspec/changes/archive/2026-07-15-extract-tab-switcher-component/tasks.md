## 1. `TabSwitcher`

- [x] 1.1 Create `src/components/TabSwitcher.vue` per design.md Decision 1-3: `<script setup lang="ts" generic="T extends string">`, props `options: { id: T; label: string }[]`, `active: T`, `ariaLabel: string`, `fullWidth?: boolean`, emits `select: [id: T]`. Root renders `role="tablist"` with `:aria-label="ariaLabel"` and (when `fullWidth`) `w-full`; each option renders `role="tab"` `:aria-selected` with the segmented active/inactive classes from `ListsView.vue`'s current game-system selector, plus `flex-1 text-center` when `fullWidth`.

## 2. Wire into `ListsView`

- [x] 2.1 Replace the game-system selector's inline markup in `src/views/ListsView.vue` with `<TabSwitcher :options="systemTabOptions" :active="store.activeSystem.value" aria-label="Game system" @select="onSelectSystem" />`, mapping `systemOptions` to `{ id, label: name }`. Correction: `@select` wired to a small `onSelectSystem` handler (using an `isGameSystem` type predicate) rather than `store.setActiveSystem` directly — a Vue/vue-tsc generic-emit inference gap widens the emitted id to `string`; see design.md's "Limitation found during implementation" note under Decision 1.
- [x] 2.2 Run the test suite; confirm no visual/behavioral change to the game-system selector. 221/222 passing, same pre-existing failure documented in `extract-shared-vue-components` (unrelated to this change).

## 3. Wire into `BuilderView`

- [x] 3.1 Replace the mobile tab switcher's two `AppButton`s in `src/views/BuilderView.vue` with `<TabSwitcher full-width :options="builderTabOptions" :active="activeTab" aria-label="Builder panel" @select="onSelectBuilderTab" />`, `builderTabOptions` a computed for the reactive "Selected Units (N)" label. Correction: `@select` wired to `onSelectBuilderTab` (an `isBuilderTab` type predicate), same reason as ListsView's 2.1.
- [x] 3.2 Run the test suite; confirm `integration.test.ts`'s "mobile tab switcher" tests still pass unmodified (they match buttons by text and assert on sibling `<section>` classes, per design.md's Risks section). 221/222 passing, same pre-existing unrelated failure — "mobile tab switcher" describe block passed with no changes needed.

## 4. Verification

- [x] 4.1 Full suite green (`npm test`). 221/222 — 1 pre-existing failure unrelated to this change (same as documented in `extract-shared-vue-components`).
- [x] 4.2 Typecheck clean (`npm run build` or `vue-tsc --noEmit`). Required a design change to get there cast-free — see design.md's "Limitation found during implementation": generic emit inference doesn't narrow past `string` in this vue-tsc version, worked around with `isGameSystem`/`isBuilderTab` type predicates at each call site instead of direct `@select` bindings.
- [x] 4.3 Manual browser pass (Playwright, 7 screenshots): game-system selector on the saved-lists screen (unchanged look, light+dark, switching to Fantasy and back), and the mobile builder tab switcher at a 390px viewport (new segmented look, full-width, both tabs, light+dark, switching tabs), plus confirmed the switcher is hidden again at desktop width. Zero console errors. Not separately re-checked at a high unit count beyond the "(0)" seen in this pass — the label is plain string interpolation already covered by `extract-shared-vue-components`' verification of the same count text, low residual risk.
- [x] 4.4 Inspected the rendered DOM via the same Playwright script: `[role="tablist"][aria-label="Game system"]` and `[role="tablist"][aria-label="Builder panel"]` both present (1 each), each with 2 `[role="tab"]` children, and `aria-selected` flips correctly on click (verified for both switchers) and is hidden (not just visually) at desktop width for the builder switcher.
