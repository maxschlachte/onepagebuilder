## Why

The lists screen currently shows a plain heading followed by a separate bordered box for the "Create Army List"/"Import JSON" actions — two disconnected blocks. `one-page-40k-army-lists.html` (the reference the app's dossier theme is already modeled on, per `dossier-visual-theme`) opens with a single "masthead" banner: a mono kicker line, a large Oswald headline, a short description, all in one bordered/textured block. Folding the heading and the two list-creation actions into that same masthead pattern finishes applying the reference's layout convention to the page's most prominent element.

## What Changes

- Replace the lists screen's separate `<h1>` heading and bordered actions box with a single masthead block: a mono "kicker" line, the headline (with the "40k" portion in the brass accent), a short description of the tool, and the "Create Army List"/"Import JSON" buttons right-aligned within the same block.
- Give the masthead the reference's visual treatment — bordered panel, a subtle top-to-bottom gradient background, and a faint repeating diagonal hairline texture overlay — expressed as Tailwind utility classes (including arbitrary values where Tailwind has no matching preset), with a light "parchment" adaptation alongside the existing dark "dossier" treatment, consistent with how every other dark-only reference pattern has already been adapted for both themes in `dossier-visual-theme`.
- The import-error message (shown when a JSON import fails) keeps appearing in the same place relative to the buttons, now inside the masthead.
- No behavior changes: the same two buttons, the same dialog, the same error handling — only their container and surrounding markup change.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `visual-theme`: adds a requirement for the lists screen's masthead banner (kicker/headline/description/actions combined into one bordered, textured block), extending the palette/typography/component-chrome conventions `dossier-visual-theme` already established to this new layout pattern.

## Impact

- `src/views/ListsView.vue`: template restructure — the `<h1>` and the actions `<section>` are replaced by a single masthead block; script changes are limited if any (existing `showCreateDialog`, `fileInput`, `onImportFile`, `importError` all keep their current behavior, just relocated in the template).
