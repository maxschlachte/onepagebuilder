## Context

The custom colors are plain Tailwind utility class suffixes (`bg-brass`, `text-dossier-ink`, `border-parchment-line`, etc.), used consistently as exact class tokens across 12 files (~355 occurrences total, counted via a codebase-wide search). None are referenced from test files — every test that touches these components asserts on structural classes (`rounded-full`, `border-l-4`, `font-display`) or DOM content, never on color classes — so this rename carries no test-coupling risk. The only non-class reference to the old palette is a raw `rgba(201,162,75,.04)` value (brass's hex as RGB) inside an arbitrary-value Tailwind utility for the lists-screen masthead's diagonal texture (`before:bg-[repeating-linear-gradient(...)]`, added in `lists-screen-masthead`).

## Goals / Non-Goals

**Goals:**
- Replace every custom color class with its mapped stock Tailwind class, exactly as listed in the proposal, across all 12 files.
- Remove the now-unused `colors` block from `tailwind.config.js`.
- Keep the visual result effectively unchanged — the mapping was chosen (and the three ambiguous `parchment-*` cases confirmed with the user) specifically to preserve the existing look.

**Non-Goals:**
- No change to `fontFamily` in `tailwind.config.js`, or to any non-color class (spacing, layout, structural classes) — this is a color-token rename only.
- No change to the print-mode `@media print` overrides in `src/assets/main.css` (they use literal `#fff`/`#000`, not the custom palette, and are out of scope).

## Decisions

**Resolving the three `olive-*` comments**: `parchment`, `parchment-panel`, `parchment-line` were commented as `olive-100/200/300`, but Tailwind has no `olive` family. Per the user's choice, these map to the `stone` family instead (matching `ink`/`ink-dim`'s own `stone-900`/`stone-600` comments, so the whole warm-neutral side of the palette now consistently uses `stone`). The exact shades are chosen by hex proximity and correct light-to-dark ordering (Tailwind's convention is higher number = darker), rather than by copying the user's `100/200/300` comment numbers literally — those were internally inconsistent (`parchment-panel` at `#fffdf8`, the *lightest* of the three, was commented `olive-200`, one step *darker* than `parchment` at `#f7f3ea` commented `olive-100`, even though `#fffdf8` is visually lighter). Resolved as: `parchment-panel` (lightest, panels sit above the page) → `stone-50`; `parchment` (page background) → `stone-100`; `parchment-line` (border, darkest of the three) → `stone-300`.

**Global rename mechanics**: each custom token is replaced as a whole Tailwind class suffix (`-brass-dim` before `-brass`, longest-match-first, to avoid `-brass` matching inside `-brass-dim`), scoped to the known Tailwind utility prefixes that use it in this codebase (`bg-`, `text-`, `border-`, `divide-`, `from-`, `to-`, `dark:` variants of each). A plain global find-and-replace of the bare token names (e.g. `brass` → `yellow-500`) is unsafe — `ink` and `dossier` in particular are common enough substrings to risk collateral matches elsewhere (e.g. unrelated words, `divide-dossier-line`'s own `-line` suffix, etc.) — so replacements are done per-file against exact class strings, not blind text substitution.

**The masthead's raw `rgba(201,162,75,.04)`**: converted to `rgba(234,179,8,.04)` — `yellow-500`'s RGB — so the diagonal-texture accent continues to track the same brass-equivalent hue as everywhere else, rather than being left as an orphaned reference to the removed custom color.

## Risks / Trade-offs

- [A mis-scoped replacement accidentally touches an unrelated class or a semantic-badge color (e.g. the amber/purple/teal Hero/Psyker/Group/Combined tags, which were deliberately left untouched by `dossier-visual-theme` and aren't part of the custom palette being removed)] → mitigation: replacements target only the 15 known custom token names with known utility prefixes; the semantic badges use entirely different, already-stock Tailwind names (`amber-200`, `purple-900`, `teal-100`, `blue-100`, etc.) that don't overlap with this list, so they're untouched by construction.
- [Visual drift between the old custom hex values and their stock-shade replacements] → each mapped shade was chosen (in the proposal) for closeness to the original hex; a visual check in both light and dark mode is a task, not an assumption.
