## 1. Masthead markup and styles

- [x] 1.1 In `src/views/ListsView.vue`, replace the `<h1>` heading and the separate actions `<section>` with a single masthead container: `relative mb-[38px] overflow-hidden rounded border border-parchment-line px-[34px] py-[30px] dark:border-dossier-line`, plus the light/dark gradient backgrounds (`bg-gradient-to-b from-parchment-panel to-parchment dark:from-dossier-panel dark:to-dossier`) and the `before:` diagonal hairline texture, per design.md's exact Tailwind conversion.
- [x] 1.2 Add the kicker line ("One Page Rules · Army List Builder") with `font-mono text-[0.7rem] uppercase tracking-[.35em] text-brass-dim dark:text-brass`.
- [x] 1.3 Add the headline ("One Page <span>40k</span>") with `font-display mt-[6px] mb-[4px] text-[2.9rem] font-bold uppercase leading-[.95] tracking-[.02em] text-ink dark:text-dossier-ink`, and the "40k" span with `text-brass-dim dark:text-brass`.
- [x] 1.4 Add the description paragraph ("Build, upgrade, and print army lists for every faction and chapter.") with `mt-2.5 max-w-[70ch] text-ink-dim dark:text-dossier-ink-dim`.
- [x] 1.5 Move the existing "Create Army List"/"Import JSON" buttons and hidden file `<input>` into the masthead as a right-aligned row (`flex flex-wrap items-center justify-end gap-2`) below the description, keeping their existing classes/behavior unchanged; move the import-error `<p>` to immediately follow, inside the masthead.

## 2. Verify

- [x] 2.1 Run the dev server and visually check the masthead in both light and dark mode: kicker/headline/description/buttons render correctly, the background gradient and diagonal texture are visible but subtle, the buttons stay right-aligned and wrap sensibly at the mobile breakpoint, and a failed JSON import still shows its error message in the expected spot.
- [x] 2.2 Run the full test suite (`npm run test`) and `vue-tsc --noEmit`; fix any breakage (e.g. if any test queries the old heading/section structure).
