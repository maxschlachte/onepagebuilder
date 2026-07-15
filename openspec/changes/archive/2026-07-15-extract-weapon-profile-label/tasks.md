## 1. `WeaponProfileLabel`

- [x] 1.1 Create `src/components/WeaponProfileLabel.vue` per design.md Decision 1-2: props `weapon: Weapon`, `faction?: Faction`; no default classes on the root (styling supplied by the caller via attrs fallthrough).

## 2. Wire into `EntryUpgradeControls`

- [x] 2.1 Replace the weapon-label markup in `src/components/EntryUpgradeControls.vue`'s `weaponsFor(opt)` loop with `<WeaponProfileLabel>`, passing the existing `ml-1 text-xs` + disabled-dimming classes on the component instance.
- [x] 2.2 Run the test suite; confirm no visual change (this call site is already on the target format). 221/222 passing, same pre-existing unrelated failure — `EntryUpgradeControls.test.ts` passed unchanged.

## 3. Wire into `EquipmentList`

- [x] 3.1 Replace the `v-if="e.weapon"` bracket + rules markup in `src/components/EquipmentList.vue` with `<WeaponProfileLabel v-if="e.weapon" :weapon="e.weapon" :faction="faction" class="ml-1 text-xs text-stone-600 dark:text-slate-400" />`. Leave the `e.rules`-only (non-weapon) branch untouched per design.md's Non-Goals.
- [x] 3.2 Run the test suite; confirm `EquipmentList.test.ts` still passes (it doesn't assert on the em-dash/bracket punctuation, confirmed in design.md). 221/222 passing, same pre-existing unrelated failure — `EquipmentList.test.ts` passed unchanged.

## 4. Verification

- [x] 4.1 Full suite green (`npm test`). 221/222 — 1 pre-existing failure unrelated to this change.
- [x] 4.2 Typecheck clean (`npm run build` or `vue-tsc --noEmit`). Caught a real (if minor) issue: swapping the weapon loop's child to `<WeaponProfileLabel>` made vue-tsc flag the loop's `wi` index variable as unused — fixed by keying on `w.id` instead of the index (see design.md "Found during implementation" note).
- [x] 4.3 Manual browser pass (Playwright against the Vite dev server): added Terminators (multi-rule baseline weapon `Medium Powerfists (Melee, A2, Piercing, Rending)`, rule-less baseline weapon `Stormbolters (24", A2)`) and inspected both the live Selected Units equipment list and the read-only roster Details panel's equipment list and upgrade options (`Minigun (Rending) (24", A3, Rending)`, `Heavy Flamer (12", A6, Piercing)`, `Missile Launcher (48", AD3, Piercing)`) — all consistent bracket format, correct no-trailing-comma behavior for the rule-less weapon, zero console errors.
- [x] 4.4 Confirmed the `e.rules`-only (non-weapon) case is untouched in the diff (still its own `v-else-if` branch with the em dash) — not separately re-screenshotted since no unit in this pass exercised it live, but the code path and its test coverage in `EquipmentList.test.ts` are unchanged.
