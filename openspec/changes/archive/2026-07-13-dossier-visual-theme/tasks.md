## 1. Design tokens and fonts

- [x] 1.1 In `tailwind.config.js`, add the named colors from design.md (`brass`, `brass-dim`, `steel`, `blood`, `ink`, `ink-dim`, `parchment`, `parchment-panel`, `parchment-line`, `dossier`, `dossier-panel`, `dossier-panel-2`, `dossier-line`, `dossier-ink`, `dossier-ink-dim`) to `theme.extend.colors`.
- [x] 1.2 In `tailwind.config.js`, extend `theme.extend.fontFamily`: override `sans` to lead with `"Barlow Semi Condensed"`, add `display: ['Oswald', 'sans-serif']`, extend `mono` to lead with `"IBM Plex Mono"`.
- [x] 1.3 In `index.html`, add the Google Fonts `<link>` tags for Oswald, Barlow Semi Condensed, and IBM Plex Mono (same families/weights as `one-page-40k-army-lists.html`).
- [x] 1.4 In `src/assets/main.css`, set the page's default background/text color to the new `parchment`/`dossier` and `ink`/`dossier-ink` tokens (`bg-parchment dark:bg-dossier text-ink dark:text-dossier-ink` equivalent on `body`), preserving the existing `@media print` overrides untouched.

## 2. App shell and lists screen

- [x] 2.1 Restyle `src/App.vue`'s root background/text classes to the new tokens.
- [x] 2.2 Restyle `src/views/ListsView.vue`: page title and "Saved lists" heading get the Oswald/brass heading treatment; list rows, buttons (Create Army List, per-list menu), and the faction/chapter subtitle get the new palette.
- [x] 2.3 Restyle `src/components/CreateListDialog.vue`: dialog panel, labels, selects, and buttons get the new palette and heading font.

## 3. Builder view

- [x] 3.1 Restyle `src/views/BuilderView.vue`'s header (list name, faction/chapter subtitle, points cap, Print view button) with the new fonts/colors.
- [x] 3.2 Restyle the live-summary panel (points total, Heroes count, validation issues) — issues/over-cap state uses the `blood` accent in place of the current red.
- [x] 3.3 Restyle the roster table/rows and the selected-units panel container (borders, name/cost/Quality text) per design.md's table-styling mapping (Quality in `steel` mono, cost in `brass` mono).
- [x] 3.4 Restyle `src/components/RosterUnitPreview.vue`'s Details panel to match (equipment list, Special line, dividers).

## 4. Upgrade controls

- [x] 4.1 In `src/components/EntryUpgradeControls.vue`, give each upgrade group's divider a brass left-accent border (card treatment) and restyle the group-id badge, section headings, and unavailable-reason text with the new palette.
- [x] 4.2 Add a dotted bottom border between option rows within a section (omitted on each section's last row), and restyle each option's cost figure (`font-mono`, brass accent) and the "Free" case (steel accent, matching the reference's `.price.free`).
- [x] 4.3 Restyle `src/components/EquipmentList.vue` and `src/components/RuleChips.vue`/`src/components/RuleTooltip.vue` (rule-name underline color, tooltip panel background/border) with the new palette.

## 5. Print view

- [x] 5.1 Restyle `src/views/PrintView.vue`, `src/components/PrintUnitStats.vue`, and `src/components/PrintGroupStats.vue`'s on-screen (non-printed) rendering with the new palette, without altering the existing `@media print` rules in `src/assets/main.css` that force a plain black-on-white printed page.

## 6. Tests and verification

- [x] 6.1 Update `src/components/EntryUpgradeControls.test.ts`'s class-name-coupled selectors (`div.text-xs.font-semibold.text-gray-500`, `.border-dotted`, `span.rounded-full`) to match whatever classes those elements carry after the restyle.
- [x] 6.2 Update `src/views/integration.test.ts`'s `div.border-t` selector if the upgrade-group divider's border classes changed under the new card treatment.
- [x] 6.3 Run the full test suite (`npm run test`) and `vue-tsc --noEmit`; fix any other breakage.
- [x] 6.4 In a live browser, visually check the lists screen, create-list dialog, builder view (roster, selected units, upgrade panel, live summary, over-cap state), roster Details panel, and print view, in both light and dark mode and at the mobile breakpoint — confirm no contrast/readability regressions in the new accent colors and no layout shifts from the restyle.
