## Context

`src/views/ListsView.vue` currently opens with two separate blocks: a plain `<h1>` ("One Page 40k — Army Lists") and, below it, a bordered `<section>` containing the "Create Army List"/"Import JSON" buttons and the import-error message. The reference (`one-page-40k-army-lists.html`) opens instead with a single `.masthead` banner combining a mono "kicker" line, a large headline, and a description, styled with a bordered panel, a subtle dark gradient background, and a faint repeating-diagonal hairline texture — all dark-only in the reference's own CSS (reproduced in the proposal). `dossier-visual-theme` already established the pattern of adapting the reference's dark-only styling to both a dark "dossier" and light "parchment" treatment using named Tailwind tokens (`brass`, `brass-dim`, `ink`, `ink-dim`, `parchment*`, `dossier*`) added in that change's `tailwind.config.js` update, and already gave the lists screen's `<h1>` a `text-brass-dim dark:text-brass` treatment for consistency — this change continues that same convention for the new masthead.

## Goals / Non-Goals

**Goals:**
- Combine the heading and the two list-creation actions into one masthead block, matching the reference's structure (kicker → headline → description → actions).
- Convert the reference's masthead CSS to Tailwind utility classes precisely, using arbitrary-value utilities (`px-[34px]`, `tracking-[.35em]`, `before:bg-[repeating-linear-gradient(...)]`, etc.) where Tailwind's default scale has no exact match, rather than rounding to the nearest preset — the user asked for a direct conversion of specific values.
- Give the masthead both a dark (matching the reference) and light (parchment-adapted) treatment, consistent with every other component `dossier-visual-theme` already restyled.

**Non-Goals:**
- No change to what the buttons do, the create-list dialog, or import error handling — only their container/markup position changes.
- No change to the "Saved lists" section below the masthead.
- No sidebar/masthead-banner treatment anywhere else in the app (the builder header already has its own, different, compact header — this is specific to the lists screen's top banner, matching how the reference's masthead is a document-level opener, not a repeated element).

## Decisions

**Kicker and description text**: the reference's literal kicker ("One Page Rules · Main Rulebook v3.3.1") and description describe the *static rulebook reference document*, not this interactive builder, so they aren't copied verbatim — only the visual treatment is. This change uses:
- Kicker: `One Page Rules · Army List Builder`
- Headline: `One Page <span>40k</span>` (keeping the app's existing "40k" wording rather than the reference's "40,000", since "40k" is what the app has always called itself)
- Description: `Build, upgrade, and print army lists for every faction and chapter.`

**Tailwind conversion of `.masthead`**:
```
border:1px solid var(--line);
background: linear-gradient(180deg,#1b1e26,#111318);   /* dark only in the reference */
padding:30px 34px; margin-bottom:38px; position:relative; overflow:hidden;
```
→ `relative mb-[38px] overflow-hidden rounded border border-parchment-line px-[34px] py-[30px] dark:border-dossier-line`, plus a background gradient pair:
- Light (no reference equivalent — new parchment adaptation): `bg-gradient-to-b from-parchment-panel to-parchment`
- Dark (matches the reference's tones, mapped onto existing tokens rather than introducing two new one-off hex values): `dark:bg-gradient-to-b dark:from-dossier-panel dark:to-dossier`

**Tailwind conversion of `.masthead:before` (diagonal hairline texture)**:
```
content:"";position:absolute;inset:0;
background:repeating-linear-gradient(45deg,transparent,transparent 22px,rgba(201,162,75,.04) 22px,rgba(201,162,75,.04) 23px);
pointer-events:none;
```
→ Tailwind's `before:` variant with arbitrary values on the masthead container itself: `before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[repeating-linear-gradient(45deg,transparent,transparent_22px,rgba(201,162,75,.04)_22px,rgba(201,162,75,.04)_23px)]`. `#c9a24b` (`rgba(201,162,75,...)`) is the `brass` token's own hex value, so the faint texture already ties to the established palette; used at the same low opacity in both light and dark (no `dark:before:` override needed — a 4%-opacity brass wash reads the same subtle way on both the parchment and dossier gradient backgrounds).

**Tailwind conversion of `.kicker`**: `font-family:'IBM Plex Mono';letter-spacing:.35em;text-transform:uppercase;color:var(--brass);font-size:.7rem` → `font-mono text-[0.7rem] uppercase tracking-[.35em] text-brass-dim dark:text-brass` (brass/brass-dim pairing, matching the same light-mode-contrast fix already applied to every other brass heading in `dossier-visual-theme` — plain single-toned `text-brass` was established there as readable on *both* near-black and light-parchment only for short bold/mono accents in body copy, e.g. price figures; a full-block letter-spaced kicker line reads more like a heading, so it gets the same dim/bright pairing the "One Page 40k" `<h1>` and section headings already use, rather than the shared single tone).

**Tailwind conversion of `h1`**: `font-family:'Oswald';font-weight:700;text-transform:uppercase;letter-spacing:.02em;font-size:2.9rem;line-height:.95;margin:6px 0 4px;color:#fff` → `font-display mt-[6px] mb-[4px] text-[2.9rem] font-bold uppercase leading-[.95] tracking-[.02em] text-ink dark:text-dossier-ink` — `color:#fff` maps to the app's own `dossier-ink` dark-mode text token (not a one-off pure white) for consistency with how every other heading in the app already resolves its dark-mode text color, paired with `ink` for light mode (the reference has no light equivalent to draw from).

**Tailwind conversion of `h1 span`**: `color:var(--brass)` → `text-brass-dim dark:text-brass`, the same accent pairing used everywhere else in the app (plain `text-brass` alone is the dark-mode value only; light mode needs `brass-dim` for contrast, per `dossier-visual-theme`'s established rule).

**Tailwind conversion of `p`**: `color:var(--ink-dim);max-width:70ch;margin:10px 0 0` → `mt-2.5 max-w-[70ch] text-ink-dim dark:text-dossier-ink-dim`.

**Buttons and error message placement**: the existing "Create Army List"/"Import JSON" buttons and hidden file `<input>` move into the masthead, in a `flex flex-wrap items-center justify-end gap-2` row (right-aligned, per the requested layout) rendered after the description paragraph; their own existing classes (already restyled by `dossier-visual-theme`) are unchanged. The import-error `<p>` stays immediately after that button row, inside the masthead, exactly where it sits relative to the buttons today (just inside the new container instead of the old one).

## Risks / Trade-offs

- [Arbitrary-value Tailwind classes (`px-[34px]`, `tracking-[.35em]`, `before:bg-[repeating-linear-gradient(...)]`) are more verbose and less greppable than scale-based utilities] → accepted per the user's explicit ask for a direct conversion of the given pixel/em values rather than nearest-preset rounding; this is a one-off banner, not a repeated pattern, so the verbosity is contained to a single block.
- [`before:` pseudo-element texture could have unexpected stacking/interaction with the button row if `z-index` isn't considered] → mitigation: the texture layer gets `pointer-events-none` (matches the reference) and the content (kicker/h1/p/buttons) is plain in-flow content painted after the `::before` layer in normal stacking order, so no explicit z-index is needed — verified visually as a task.
