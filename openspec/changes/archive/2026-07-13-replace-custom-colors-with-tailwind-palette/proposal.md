## Why

`tailwind.config.js` currently defines fifteen custom named colors (`brass`, `steel`, `blood`, `ink`, `parchment`, `dossier`, and their variants) for the dossier theme introduced in `dossier-visual-theme`. Tailwind's stock palette already has close equivalents for every one of them, so the custom definitions are unnecessary indirection — a reader has to look up `tailwind.config.js` to know what `text-brass` actually renders as, instead of reading it directly off a standard `text-yellow-500`-style class name.

## What Changes

- Replace every use of the custom color classes with the closest stock Tailwind color+shade, per this mapping (confirmed with the user for the three which didn't correspond to a real Tailwind family):
  - `brass` → `yellow-500`, `brass-dim` → `yellow-700`
  - `steel` → `slate-500`
  - `blood` → `red-800`
  - `ink` → `stone-900`, `ink-dim` → `stone-600`
  - `parchment` → `stone-100`, `parchment-panel` → `stone-50`, `parchment-line` → `stone-300`
  - `dossier` → `slate-950`, `dossier-panel` → `slate-900`, `dossier-panel-2` → `slate-800`, `dossier-line` → `slate-700`, `dossier-ink` → `slate-200`, `dossier-ink-dim` → `slate-400`
- Remove the `colors` block from `tailwind.config.js`'s `theme.extend` (the `fontFamily` block, unrelated to this change, stays).
- Update the one raw (non-class) color reference tied to the old palette — the lists-screen masthead's diagonal-texture `rgba(201,162,75,.04)` (brass's hex as RGB) — to `rgba(234,179,8,.04)` (`yellow-500`'s RGB), so the faint texture still matches the new accent.
- No visual or behavioral change: every replacement is chosen to be the closest available stock shade to the color it replaces, so the app should look effectively the same before and after.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `visual-theme`: the "Dossier color palette and typography" requirement's description of how the palette is implemented changes from custom-named Tailwind colors to stock Tailwind color+shade classes (the palette's visual intent — brass/steel/blood accents, parchment/dossier light/dark treatment — is unchanged).

## Impact

- `tailwind.config.js`: remove the custom `colors` block.
- Every component that references the custom color classes: `src/App.vue`, `src/views/ListsView.vue`, `src/views/BuilderView.vue`, `src/views/PrintView.vue`, `src/components/CreateListDialog.vue`, `src/components/EntryUpgradeControls.vue`, `src/components/EquipmentList.vue`, `src/components/RuleChips.vue`, `src/components/RuleTooltip.vue`, `src/components/RosterUnitPreview.vue`, `src/components/PrintUnitStats.vue`, `src/components/PrintGroupStats.vue` (~355 class-token occurrences across these 12 files, per a full-codebase search).
