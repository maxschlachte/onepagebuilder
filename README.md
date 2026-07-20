# Classic One Page — Army Builder

An interactive army-list builder for [Classic One Page Rules](https://www.mattcaron.net/opr_mirror/)
(Main Rulebook **v3.3.1** for 40k and **v3.2.0** for Fantasy). It enforces the army-composition rules, lets you assemble,
edit, duplicate and delete lists, and produces a self-contained printable reference.

The whole app **compiles to a single offline `.html` file** suitable for GitHub Pages —
no backend, no network at runtime. Lists are stored in your browser (`localStorage`) and
can be exported / imported as JSON. You can use the app [here](https://maxschlachte.github.io/onepagebuilder/).

## Tech

Vue 3 (`<script setup>`) + TypeScript + Tailwind CSS, bundled by Vite with
[`vite-plugin-singlefile`](https://github.com/richardtallent/vite-plugin-singlefile).

```
src/
  data/        rules dataset extracted from the PDF (factions/, glossary, weapons, composition)
  domain/      pure TS types + logic (cost, validation, upgrades, rule resolution)
  stores/      list state + localStorage persistence + JSON import/export
  components/   presentational Vue components (RuleTooltip, UnitCard, …)
  views/        ListsView, BuilderView, PrintView
```

## Develop

```bash
npm install
npm run dev      # local dev server with HMR
npm run test     # unit tests (Vitest)
```

## Build (single file)

```bash
npm run build    # type-checks then emits dist/index.html (everything inlined)
npm run preview  # serve the production build locally
```

The build output is a **single** `dist/index.html`. Open it directly in a browser
(even with no network connection) and the app is fully usable.
