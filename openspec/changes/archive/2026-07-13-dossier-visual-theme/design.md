## Context

`one-page-40k-army-lists.html` (repo root) is a static, dark-only reference document with its own CSS: near-black backgrounds (`--bg:#0d0e11`, `--panel:#16181e`, `--panel-2:#1d2028`), a warm gold "brass" accent (`--brass:#c9a24b`, `--brass-dim:#8f7433`) plus `--steel:#5a7d99` and `--blood:#a3352c` secondary accents, and three Google Fonts: Oswald (bold uppercase headings/labels), Barlow Semi Condensed (body text), IBM Plex Mono (numeric/stat figures — Quality, cost, range/attacks).

The app is a Vue 3 + Tailwind v3 SPA (`tailwind.config.js` has an empty `theme.extend`, `darkMode` unset → defaults to the `media` strategy, i.e. `dark:` utilities follow `prefers-color-scheme`). Every component styles itself with inline Tailwind utility classes (no CSS modules, no existing design-token layer) using stock Tailwind grays/blues/reds paired manually at each call site, e.g. `text-gray-500 dark:text-gray-400`, `bg-white dark:bg-gray-900`. `src/assets/main.css` is the one global stylesheet (Tailwind directives + a couple of print-mode overrides). A handful of tests assert exact utility class names as CSS selectors (`div.text-xs.font-semibold.text-gray-500`, `.border-dotted`, `span.rounded-full` in `EntryUpgradeControls.test.ts`; `div.border-t` in `integration.test.ts`).

Per the two scope decisions already made: light and dark mode both stay supported (the reference itself is dark-only, so light mode needs an original-but-consistent adaptation of the same palette), and this is a restyle of colors/typography/component chrome only — the app's existing responsive layout and interaction structure are unchanged.

## Goals / Non-Goals

**Goals:**
- Define a small, named Tailwind color palette (brass/steel/blood accents, plus dark- and light-mode panel/background/text tokens) that every component uses instead of stock grays/blues/reds, following the same explicit `X dark:Y` per-utility pairing convention the app already uses everywhere.
- Load and apply Oswald (headings/labels/buttons), Barlow Semi Condensed (body), and IBM Plex Mono (stat/cost/quality figures) app-wide.
- Reskin component chrome — panel cards, table styling, the upgrade-group cards' left-accent border and dotted option separators, section headings — to match the reference's visual patterns, applied on top of the app's existing DOM structure (no markup restructuring beyond what's needed to add a border/class).

**Non-Goals:**
- No change to the reference's own document layout (sidebar nav, masthead banner) — not applicable to an interactive builder.
- No change to any component's behavior, data flow, or responsive breakpoints — this is a styling-only pass.
- No pixel-perfect contrast certification; new colors get a manual light/dark contrast sanity check (task-level), not a full accessibility audit.

## Decisions

**New Tailwind color tokens** (`tailwind.config.js` `theme.extend.colors`), added as flat named colors (not a numeric 50–950 scale, to match the app's existing "explicit pair at each call site" convention rather than inventing an auto-switching scale):

| Token | Value | Used for |
|---|---|---|
| `brass` | `#c9a24b` | dark-mode primary accent (headings, prices, borders) |
| `brass-dim` | `#8f7433` | dark-mode secondary accent (sub-labels, less prominent borders); **also** reused as light-mode's primary accent (see below) |
| `steel` | `#5a7d99` | secondary data accent (Quality values) — shared across modes; readable on both near-black and light-parchment backgrounds |
| `blood` | `#a3352c` | danger/over-cap accent — shared across modes |
| `ink` | `#2a2620` | light-mode primary body text |
| `ink-dim` | `#6b6355` | light-mode secondary/muted text |
| `parchment` | `#f7f3ea` | light-mode page background |
| `parchment-panel` | `#fffdf8` | light-mode card/table background |
| `parchment-line` | `#ded4b9` | light-mode borders/dividers |
| `dossier` | `#0d0e11` | dark-mode page background |
| `dossier-panel` | `#16181e` | dark-mode card/table background |
| `dossier-panel-2` | `#1d2028` | dark-mode offset background (table header row, alternating rows) |
| `dossier-line` | `#2c3038` | dark-mode borders/dividers |
| `dossier-ink` | `#dfe2e8` | dark-mode primary body text |
| `dossier-ink-dim` | `#9aa0ab` | dark-mode secondary/muted text |

`brass`/`brass-dim` are intentionally reused for both their reference-original purpose (dark-mode's own two-tier accent) **and** as the dark/light pairing for the app's primary accent — e.g. a price figure is `class="text-brass-dim dark:text-brass"`. This is a deliberate simplification (one fewer token to introduce) rather than adding a dedicated `brass-light`/`brass-ink` pair; `brass-dim`'s value (`#8f7433`) is dark enough to read on the light parchment background. `steel` and `blood` are used as single shared values in both modes (no `dark:` override needed for those two) since their usage here is short/bold/accent text (Quality figures, warnings), not long-form paragraph copy, so both hold acceptable contrast on both a near-white and near-black background — verified as a task, not assumed.

**Font tokens** (`tailwind.config.js` `theme.extend.fontFamily`):
- `sans` overridden to `['"Barlow Semi Condensed"', 'system-ui', 'sans-serif']` — becomes the new default body font app-wide with no per-component class changes needed.
- `display: ['Oswald', 'sans-serif']` — new utility `font-display`, applied to headings, section titles, group/upgrade labels, and buttons.
- `mono` extended to `['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono]` — the existing `font-mono` utility (if used) and any numeric/stat text (Quality, cost, range/attacks brackets) gets `font-mono`.

Fonts are loaded via a `<link>` in `index.html` (same Google Fonts URL the reference uses), not `@import` in CSS, to avoid render-blocking-in-CSS and match how the reference itself loads them.

**Component chrome mapping** (reference class → app treatment):
- `.masthead` → the builder header's list-name area and the lists-screen title get the Oswald-uppercase brass-accented treatment (no banner/border-frame restructuring, just typography/color).
- `.faction-head h2` → existing bold section headers ("Space Marines — Roster", "Selected units (N)") become `font-display uppercase tracking-wide text-brass-dim dark:text-brass`.
- `h3.block` (uppercase, letter-spaced, brass, trailing rule) → applied to sub-headings that already exist as bold text (e.g. upgrade section titles inside `EntryUpgradeControls.vue`), using a `flex items-center gap-2 ... after:flex-1 after:h-px after:bg-{line}` trailing-rule pattern.
- `.up-card` (left-accent border, bordered panel) → the upgrade-group divider `<div>` in `EntryUpgradeControls.vue` (already `relative` with the circle-badge id from `upgrade-section-id-badge`) gains a `border-l-2 border-l-brass-dim dark:border-l-brass` treatment and panel background, turning each lettered group into a bordered card rather than a plain top-divider.
- `.up-line` (dotted separator between option rows) → each option `<label>` row gets a `border-b border-dotted border-{line}` (last row in a section: no border), and its cost gets `font-mono text-brass-dim dark:text-brass`.
- Table styling (`thead th` brass-on-panel-2, `td.q` steel mono, `td.cost` brass mono bold, `td.sr` dim) → applied wherever the app renders unit stat rows (roster list rows, print view stat blocks): Quality gets `font-mono text-steel`, cost gets `font-mono text-brass-dim dark:text-brass font-semibold`, special-rules text gets the `ink-dim`/`dossier-ink-dim` pairing.
- Buttons (`Add`, `Details`, `Print view`, dialog buttons) → `font-display uppercase tracking-wide` labels; primary actions get a brass fill/outline instead of the current blue, destructive actions (`Remove`) keep a `blood`-based treatment instead of red.

## Risks / Trade-offs

- [Brittle test selectors coupled to exact utility class names] → `EntryUpgradeControls.test.ts` (`div.text-xs.font-semibold.text-gray-500`, `.border-dotted`, `span.rounded-full`) and `integration.test.ts` (`div.border-t`) will break once those specific classes change; fixed as an explicit task, verified by re-running the full suite after the restyle.
- [New brass/steel/blood accents might not meet AA contrast on one of the two backgrounds] → manual check task (view each accent's usage — heading, price, Quality, danger — in both light and dark) before calling the change done; adjust the specific hex in `tailwind.config.js` if a pairing reads poorly, without needing another design round.
- [Google Fonts adds an external network dependency at load time] → same trade-off the reference file itself already accepts; no offline/self-hosted fallback is in scope for this change.
- [Large surface area (every visual component) increases regression risk] → mitigated by doing the restyle in small per-area passes (tokens/fonts first, then shell/nav, then builder, then upgrade cards, then print view) with a test-suite run after each pass rather than one giant edit.
