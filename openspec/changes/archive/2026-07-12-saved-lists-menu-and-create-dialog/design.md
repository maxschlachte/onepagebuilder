## Context

`src/views/ListsView.vue` renders saved lists as bordered `<li>` rows with four always-visible inline buttons (Open, Duplicate, Export, Delete) and a separate inline "New list" form (name input, faction `<select>`, "Create" button, "Import JSON" button). This works on desktop but is cramped on mobile, where the row of small buttons is hard to tap accurately. The store (`src/stores/lists.ts`) already exposes `renameList` and `setPointsCap`, neither of which is wired into the UI today. There is no dialog/modal pattern anywhere in the codebase yet — the app is plain Vue 3 `<script setup>` SFCs with Tailwind, no component library.

## Goals / Non-Goals

**Goals:**
- Each saved-list row becomes tappable as a whole to Open the list, matching common mobile list UI conventions.
- Per-list secondary actions (Rename, Duplicate, Export, Delete) move behind a three-dot (⋮) menu, and tapping the menu must not also trigger Open.
- The "Create" affordance is renamed "Create Army List" and opens a modal dialog collecting name, faction, and a points-cap chosen from fixed steps (750/1500/2250/3000/3750/4500/5250/6000), rather than always defaulting to 750.
- Reuse existing store methods (`createList`, `renameList`, `duplicateList`, `deleteList`, `downloadList`) with no new persistence logic.

**Non-Goals:**
- No new store/persistence behavior — `pointsCap` selection at creation time already fits `createList(name, factionId, pointsCap)`'s existing signature.
- No general-purpose dialog/modal library or design-system introduction — build one small, local dialog pattern (Tailwind + Vue) scoped to this view, not a reusable framework.
- No changes to the builder view's existing points-cap editing (`setPointsCap` inside an open list) — only the *creation-time* points cap is in scope.
- No changes to Import JSON's flow beyond keeping it available (it stays as its own button, not folded into the dialog).

## Decisions

1. **Row click vs. menu click**: The `<li>` row gets a `@click="emit('open', list.id)"` handler. The three-dot menu button uses `@click.stop` so its click doesn't bubble to the row handler. Menu item clicks (Rename/Duplicate/Export/Delete) also use `.stop` and close the menu after acting.
   - Alternative considered: making only a subset of the row (e.g., the name text) clickable. Rejected because the proposal explicitly asks for "clicking the box" (the whole row) to open, matching mobile list conventions.

2. **Menu implementation**: A small local `open` boolean (per-row, e.g. `ref<string | null>` tracking which list's menu is open) rendered as an absolutely-positioned Tailwind dropdown directly in `ListsView.vue`, closed on outside click (`@click` on a full-screen transparent backdrop, or a `mousedown` document listener) and on `Escape`. No portal/teleport needed since the menu is small and row-relative.
   - Alternative considered: a reusable `<DropdownMenu>` component. Given there's exactly one menu type in the app today, keeping it inline avoids a premature abstraction; can be extracted later if a second menu appears elsewhere.

3. **Dialog implementation**: A new `src/components/CreateListDialog.vue` using `<Teleport to="body">` with a fixed-position semi-transparent backdrop and a centered panel, following the existing Tailwind dark-mode conventions used elsewhere (`dark:bg-gray-800`, `dark:border-gray-700`). Closed via a Cancel button, backdrop click, or `Escape`. It emits a `create` event with `{ name, factionId, pointsCap }`; `ListsView.vue` handles that event by calling `store.createList(...)` then `emit('open', list.id)`, mirroring today's `create()` behavior.
   - Alternative considered: native `<dialog>` element. Rejected for now to avoid inconsistent cross-browser/mobile-Safari styling quirks and to keep full control over backdrop/Escape behavior with Tailwind, consistent with how the rest of the app avoids native form widgets beyond basic inputs/selects.

4. **Points-cap steps source**: The dialog reads the step values from `composition.heroLimitTable.map(t => t.points)` (`src/data/composition.ts`) rather than hardcoding `[750, 1500, ...]`, so the stepper always matches the hero-limit table used for validation elsewhere. Rendered as a `<select>` (simplest, consistent with the existing faction `<select>`) rather than a custom stepper widget.
   - Alternative considered: a numeric `<input type="number" step="750">`. Rejected because it allows arbitrary/off-step values and doesn't visually communicate the fixed set of valid caps.

5. **Rename surfaced via menu**: `renameList` already exists in the store but had no UI. The three-dot menu's "Rename" item prompts inline (reuse the row's name as an editable text field toggled by the menu action, or a simple `window.prompt`-free inline input) rather than introducing a second dialog, keeping the change scoped to menu + create dialog as requested.

## Risks / Trade-offs

- [Risk] Row-click-to-open could conflict with text selection or accidental taps when the row also contains the three-dot button → Mitigation: menu button and its dropdown use `@click.stop`/`@mousedown.stop`, and only the button's own hit area is excluded from the row's open handler.
- [Risk] No existing modal/focus-trap utility means keyboard accessibility (focus trap, focus return, `Escape` handling) must be hand-rolled for the new dialog → Mitigation: keep the dialog small (3 fields + 2 buttons), set initial focus on the name input on open, and return focus to the "Create Army List" button on close.
- [Risk] Outside-click-to-close menu logic (document-level listener) can leak listeners if not cleaned up per row → Mitigation: use a single shared "which row's menu is open" ref instead of per-row listeners, with one document listener added/removed via `onMounted`/`onUnmounted`.

## Migration Plan

No data migration — purely a UI/interaction change over existing store APIs (`createList`, `renameList`, `duplicateList`, `deleteList`, `downloadList`). No storage schema changes. Rollback is a plain revert of the view/component changes.

## Open Questions

None — scope is UI-only and confirmed by the proposal.
