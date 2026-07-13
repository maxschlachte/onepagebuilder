## 1. Global class rename

- [x] 1.1 Across all 12 affected files (`src/App.vue`, `src/views/ListsView.vue`, `src/views/BuilderView.vue`, `src/views/PrintView.vue`, `src/components/CreateListDialog.vue`, `src/components/EntryUpgradeControls.vue`, `src/components/EquipmentList.vue`, `src/components/RuleChips.vue`, `src/components/RuleTooltip.vue`, `src/components/RosterUnitPreview.vue`, `src/components/PrintUnitStats.vue`, `src/components/PrintGroupStats.vue`), replace every custom color class token with its mapped stock Tailwind class, longest-token-first to avoid partial-match collisions (`brass-dim` before `brass`, `dossier-panel-2` before `dossier-panel` before `dossier`, `dossier-ink-dim` before `dossier-ink`, `parchment-panel`/`parchment-line` before `parchment`, `ink-dim` before `ink`):
  - `brass-dim` → `yellow-700`, `brass` → `yellow-500`
  - `steel` → `slate-500`
  - `blood` → `red-800`
  - `ink-dim` → `stone-600`, `ink` → `stone-900`
  - `parchment-panel` → `stone-50`, `parchment-line` → `stone-300`, `parchment` → `stone-100`
  - `dossier-panel-2` → `slate-800`, `dossier-panel` → `slate-900`, `dossier-line` → `slate-700`, `dossier-ink-dim` → `slate-400`, `dossier-ink` → `slate-200`, `dossier` → `slate-950`
- [x] 1.2 In `src/views/ListsView.vue`'s masthead, update the diagonal-texture arbitrary value's `rgba(201,162,75,.04)` (brass's hex as RGB) to `rgba(234,179,8,.04)` (`yellow-500`'s RGB).
- [x] 1.3 In `tailwind.config.js`, remove the `colors` block from `theme.extend`, leaving `fontFamily` untouched.

## 2. Verify

- [x] 2.1 Grep the codebase for any remaining occurrence of the 15 custom token names as class-name suffixes (`bg-`/`text-`/`border-`/`divide-`/`from-`/`to-`/`dark:`-prefixed) to confirm none were missed.
- [x] 2.2 Run the full test suite (`npm run test`) and `vue-tsc --noEmit`.
- [x] 2.3 In a live browser, spot-check the lists screen (including the masthead's diagonal texture), builder view, upgrade panel, over-cap state, and print view in both light and dark mode, confirming the visual result is effectively unchanged from before this rename.
