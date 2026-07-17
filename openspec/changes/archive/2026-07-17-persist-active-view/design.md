## Context

`App.vue` is the entire app shell: it holds two plain refs (`view: 'lists' | 'builder' | 'print'`, `currentListId: string | null`), defaulting to `view = 'lists'`, `currentListId = null`, and swaps `ListsView`/`BuilderView`/`PrintView` in place via `v-if`/`v-else-if`. There is no Vue Router and no URL/hash state anywhere in the codebase — this is a pure conditional-render SPA. Neither ref is persisted, so every reload (or reopening the app later) resets to the saved-lists screen, discarding whatever screen/list the user had open, even though the list's own data (and the active game system) already survive reloads via `src/stores/lists.ts`'s existing `localStorage`-backed refs (`STORAGE_KEY` for the lists array, `SYSTEM_STORAGE_KEY` for `activeSystem` — both using the same `ref` + `watch(...) → localStorage.setItem` idiom).

## Goals / Non-Goals

**Goals:**
- A user who refreshes (or reopens the app in a new tab/later session) while the builder or print view is open for some list lands back on that same screen for that same list, not the saved-lists screen.
- If the previously-open list no longer exists (deleted, or its faction belongs to a game system that's no longer active — lists are filtered by `activeSystem` per `game-system-switching`), fall back to the saved-lists screen exactly as today's unconditional default, rather than erroring or showing a broken builder.
- Reuse the exact `ref` + `watch` + `localStorage` idiom `activeSystem` already establishes in this codebase, for a consistent, minimal-surprise implementation.

**Non-Goals:**
- Not persisting `BuilderView.vue`'s mobile `activeTab` (roster vs. selected-units) — that's local, low-stakes UI state that already resets every time the builder is re-entered (not just on refresh), so persisting it would be a behavior change beyond "get back to where I was on refresh," not a fix to one.
- Not introducing a URL router or making the app's screens independently linkable/bookmarkable — that's a materially larger change (routing library, URL-encoded state, browser back/forward semantics) than what's needed to satisfy "get back to the point I was on refresh." `localStorage`-backed restore-on-boot fully satisfies the stated requirement without it.
- Not persisting any finer-grained state within a screen (scroll position, which upgrade group is expanded, print-view selection) — no such state exists as a reactive variable today (confirmed by the research pass for this proposal), so there's nothing to lose there in the first place.

## Decisions

**1. A new `activeView.v1` localStorage key, colocated in `App.vue` using the same idiom as `activeSystem`, not added as new surface on the `lists` store.**

`view`/`currentListId` are `App.vue`-local state, consumed by no other component — unlike `activeSystem`, which several components read (the game-system switcher, the lists filter, the create-list dialog). Adding persistence directly in `App.vue` keeps the new localStorage-backed state colocated with the only code that reads or writes it, rather than growing `lists.ts`'s already-two-concerns store (list CRUD + active system) with a third, unrelated one.

```ts
// App.vue
const VIEW_STORAGE_KEY = 'opr40k.activeView.v1'

interface StoredView {
  view: 'builder' | 'print'
  listId: string
}

function loadStoredView(): StoredView | null {
  try {
    const raw = localStorage.getItem(VIEW_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.view !== 'builder' && parsed?.view !== 'print') return null
    if (typeof parsed.listId !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

const store = useListsStore()
const stored = loadStoredView()
const listExists = stored ? store.lists.value.some((l) => l.id === stored.listId) : false

const view = ref<'lists' | 'builder' | 'print'>(listExists ? stored!.view : 'lists')
const currentListId = ref<string | null>(listExists ? stored!.listId : null)

watch([view, currentListId], ([v, id]) => {
  try {
    if ((v === 'builder' || v === 'print') && id) {
      localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify({ view: v, listId: id }))
    } else {
      localStorage.removeItem(VIEW_STORAGE_KEY)
    }
  } catch {
    /* storage may be unavailable (private mode); ignore */
  }
})
```

The saved-lists screen (`view === 'lists'`) is deliberately *not* persisted as its own stored state — it's already the unconditional default the app falls back to, so there's nothing to remember about it; the stored key's presence/absence alone communicates "was mid-edit somewhere" vs. not, matching the `try/catch`-wrapped, silently-degrade-if-storage-unavailable pattern `lists.ts` already uses for both its own keys.

**2. The "list still exists" check happens once, at `App.vue`'s module-level setup, before the refs are created — not as a post-mount effect.**

This avoids a visible flash of the saved-lists screen before snapping to the builder (which a `watch`+`onMounted`-based restore would cause), at the cost of needing `useListsStore()`'s underlying `lists` ref to already be populated when `App.vue`'s `<script setup>` runs — true today: `const lists = ref<ArmyList[]>(load())` (`lists.ts:123`) is module-level, not inside `useListsStore()`'s function body, so it's populated synchronously the moment the `lists.ts` module is first imported (i.e., before `App.vue`'s own setup code runs, since it imports `useListsStore` at the top of the file) — `useListsStore()` itself is just a plain function returning a fresh object of already-live refs/computeds each call, with no async or lazy initialization to race against.

Alternative considered: also validate that the restored list's faction belongs to the currently-active game system (mirroring `game-system-switching`'s list-filtering behavior), so a list from an inactive system doesn't restore into the builder while the saved-lists screen itself would filter it out. Rejected for this change — `BuilderView`/`PrintView` render correctly from any valid `listId` regardless of `activeSystem` (the filtering only affects `ListsView`'s roster), so restoring into a cross-system list's builder isn't broken, just a minor surprise; scoping the restore check to "does this list still exist" alone keeps the fix minimal and matches exactly the bug being fixed (data loss on refresh), not a new cross-system consistency rule nothing currently enforces elsewhere either.

## Risks / Trade-offs

- **[Risk]** A stale `activeView.v1` entry could point at a list id that's been reused/collided with a different list after export/import across browser profiles (ids are UUIDs, so collision is not a realistic concern in practice). → **Mitigation**: not addressed further — UUID collision is astronomically unlikely and no other persistence code in this codebase guards against it either.
- **[Trade-off]** Restoring straight into the builder/print view on boot means a user's very first paint after a refresh may not be the saved-lists screen even though that's the app's nominal "home" — a deliberate trade-off, since that's exactly the feature being requested.

## Migration Plan

Additive only — a new, independently-failing-safe localStorage key. No change to the existing `lists.v1`/`activeSystem.v1` keys or their shape. A user with no prior `activeView.v1` entry (i.e., everyone before this ships) sees no change in behavior — `loadStoredView()` returns `null` and the app boots to `view = 'lists'` exactly as today.

## Open Questions

None.
