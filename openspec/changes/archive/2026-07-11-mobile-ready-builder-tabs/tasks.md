## 1. Builder: mobile tab switcher

- [x] 1.1 In `BuilderView.vue`, add `activeTab = ref<'roster' | 'selected'>('roster')`
- [x] 1.2 Add a tab-switcher bar (`md:hidden`) above the Roster/Selected-units grid, with a "Roster" tab and a "Selected Units (N)" tab, each setting `activeTab` on click and visually indicating the active tab
- [x] 1.3 Gate the Roster `<section>` and the Selected Units `<section>` with `class="md:block" :class="{ hidden: activeTab !== '<tab>' }"` so only the active tab's panel is visible below `md`, and both are always visible at `md`+ (unchanged from today)

## 2. Touch-friendly control sizing

- [x] 2.1 In `BuilderView.vue`, bump every compact-tier button/select (roster Details/Add; selected-unit Split/Remove/Leave-group/Detach; combine/attach/group `<select>`s) from `text-xs`/`py-0.5` to `text-sm`/`py-1.5`/`px-3`
- [x] 2.2 In `BuilderView.vue`, bump the header-level primary-tier buttons (← Lists, Print view) from `text-sm` to `text-base`/`py-2`/`px-4`
- [x] 2.3 In `ListsView.vue`, bump Create/Import JSON to the primary tier and Open/Duplicate/Export/Delete to the compact tier per design.md's sizing values
- [x] 2.4 In `PrintView.vue`, bump the on-screen "← Back"/"Print / Save as PDF" buttons (both already `no-print`-scoped) to the primary tier
- [x] 2.5 In `EntryUpgradeControls.vue`, bump the upgrade-option checkbox size (e.g. `h-4 w-4`)

## 3. Tests & verification

- [x] 3.1 Component/integration test: `activeTab` defaults to `'roster'`; the roster section has no `hidden` class and the selected-units section does; clicking the "Selected Units" tab flips both; clicking back to "Roster" flips them again
- [x] 3.2 Confirm existing builder integration tests (combine/attach/group flows, roster details toggle) still pass unchanged — they don't depend on tab state since both panels remain mounted
- [x] 3.3 Manually run the app: resize the browser below and above the `md` breakpoint and confirm the tab switcher appears/disappears and both panels remain reachable at each size; spot-check that the bumped buttons/selects are visibly larger without breaking any row's layout — verified via Playwright at 375px (tab switcher shown, one panel at a time) and 1280px (no tab switcher, both panels side by side, unchanged from before); ListsView and PrintView on-screen buttons confirmed larger too
- [x] 3.4 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions — 174/174 tests pass, `vue-tsc --noEmit` clean, `npm run build` succeeds
