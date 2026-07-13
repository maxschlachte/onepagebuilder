## Context

All five badge instances live only in `src/views/BuilderView.vue`: Hero (line ~337) and Psyker (~338-342) in the roster list, Group (~375) in the group-deployment combine row, Combined (~427) in the combined-pair row, and Attached (~524) in the attached-Hero/Psyker row. Each is a `<span>` with `rounded px-1 text-xs` plus its own color classes; three (`hero`, `attached`, `group`/`combined` implicitly via their `ml-1` context) are prefixed inline with a sibling text span, so the badge's own margin (`ml-1`) varies by call site rather than being part of the badge markup itself.

Current exact classes per badge (carried over unchanged):
- `hero` / `attached`: `bg-amber-300 text-amber-700` (no `dark:` override)
- `psyker`: `bg-purple-800 text-purple-200 dark:bg-purple-900 dark:text-purple-300`
- `group`: `bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200`
- `combined`: `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`

## Goals / Non-Goals

**Goals:**
- One `Badge.vue` component with a `variant` prop, used at all five call sites in `BuilderView.vue`.
- Zero visual change — every variant's mapped classes are copied verbatim from the current inline spans.

**Non-Goals:**
- Not fixing the `hero`/`attached` variants' missing `dark:` override or the `psyker` variant's already-dark-toned base classes — those are pre-existing inconsistencies, out of scope for a pure extraction (not requested).
- Not reusing this component anywhere outside `BuilderView.vue` — no other file currently renders one of these five tags.

## Decisions

**Component shape**: `Badge.vue` takes a single `variant: 'hero' | 'psyker' | 'group' | 'combined' | 'attached'` prop, holds a variant→class lookup internally, renders `<span class="rounded px-1 text-xs" :class="variantClasses[variant]"><slot /></span>`, and lets Vue's default attribute fallthrough merge any `class` passed on the component tag (e.g. `class="ml-1"`) onto that root span — so call sites that need the margin (`hero`, `psyker`, `attached`) add it via `class="ml-1"` on the `<Badge>` tag itself, exactly like today's inline spans, while `group`/`combined` (which don't currently have `ml-1`) simply omit it.
  - Alternative considered: a `margin` boolean prop instead of relying on class fallthrough. Rejected — Vue's attribute fallthrough already does this correctly for a single-root-element component with no need for extra prop plumbing.
- Named `variant` values (not raw colors) so each call site reads as "this is the Hero badge," matching how the five tags are already understood in the surrounding code/tests, rather than exposing the color choice as something callers pick.

## Risks / Trade-offs

- [Silently "fixing" a variant's colors while extracting] → mitigated by copying each variant's classes verbatim from its current inline span (verified against the live file before writing the component), not from memory or by symmetry with the other variants.
