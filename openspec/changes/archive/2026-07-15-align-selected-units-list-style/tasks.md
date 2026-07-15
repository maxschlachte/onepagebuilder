## 1. Relocate cost into the info group, per card shape

In `src/views/BuilderView.vue`'s Selected Units section, for each of the four card header rows: move the `{{ cost }}pts` span from the right-hand controls group into the left-hand info group (after the size/quality text, matching the Roster row's `[size] · Quality X · costpts` order and separator style), leaving the right-hand group holding only its actual controls.

- [x] 1.1 Standalone unit card header (`row.eff.cost`)
- [x] 1.2 Combined pair card header (`row.combined.cost`)
- [x] 1.3 Group-deployment card header (`row.group.cost`)
- [x] 1.4 Attached sub-card header (`a.eff.cost`)

## 2. Verify

- [x] 2.1 Full suite green: 222/222 tests passing, no assertions broke.
- [x] 2.2 Verified in a real browser (Playwright against the Vite dev server), triggering all four card shapes: standalone unit (`Acolyte [1] · Q4+ · 10pts`), attached (`Psyker [1] · Q4+ · 25pts`), group-deployment (`Group [2] · 20pts`), and combined pair (`Tactical Marines Combined [10] · Q3+ · 240pts`) — every one shows cost in the left info group, matching the Roster row's format, with only actual controls (Combine/Group/Attach selects, Split, Remove) on the right. No console errors.
- [x] 2.3 Typecheck clean.
