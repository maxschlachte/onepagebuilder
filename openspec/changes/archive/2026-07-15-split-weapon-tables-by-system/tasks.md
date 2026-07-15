## 1. Fantasy weapon table and helper

- [x] 1.1 Create `src/data/weapons-fantasy.ts` per design.md Decision 1: 11 ranged entries (`throwing-weapon`, `pistol`, `shortbow`, `fire-thrower`, `bow`, `rifle`, `longbow`, `crossbow`, `stone-thrower`, `cannon`, `bolt-thrower`), exporting `weaponsFantasy` and `FantasyWeaponId`.
- [x] 1.2 Add `weaponFantasy(id: FantasyWeaponId, opts)` to `src/data/factions/helpers.ts` per Decision 2, with its own `weaponFantasyById` map.

## 2. Per-system `RulesDatabase.weapons`

- [x] 2.1 Change `RulesDatabase.weapons` in `src/domain/types.ts` from `Weapon[]` to `Record<GameSystem, Weapon[]>`.
- [x] 2.2 Update `src/data/index.ts`'s assembly to `weapons: { 'system-40k': weapons, 'system-fantasy': weaponsFantasy }` (aliasing imports as needed to avoid the name clash with the field).
- [x] 2.3 Update `src/data/index.test.ts`'s "every addEquipment label is not a fabricated weapon name" audit to build `globalWeaponNames` per-faction from `rulesDatabase.weapons[faction.system]` instead of one flat `rulesDatabase.weapons`.
- [x] 2.4 Run `npm test`; confirm the "fabricated weapon name" audit now passes (the `daemons-of-chaos.ts` `Bolt Thrower`/`Stone Thrower` entries resolve once the table exists — full fix lands in task 3, but confirm no other regression here first).

## 3. Fix the 14 found data bugs

- [x] 3.1 `daemons-of-chaos.ts:130` — migrate Warp Gaze's weapon to `weaponFantasy('bolt-thrower', ...)`.
- [x] 3.2 `dwarfs.ts:21` — migrate the Bolt Thrower unit's own weapon to `weaponFantasy('bolt-thrower', ...)`.
- [x] 3.3 `dwarfs.ts:66` — migrate the Throwing Weapons upgrade option to `weaponFantasy('throwing-weapon', ...)`.
- [x] 3.4 `high-elves.ts:10,11,16,17,47` — migrate all 5 Bows/Longbows entries to `weaponFantasy('bow'/'longbow', ...)`, preserving Sisters of Avelorn's extra Piercing rule via `opts.rules`.
- [x] 3.5 `lizardmen.ts:64,82` — migrate both Throwing Weapon(s) entries to `weaponFantasy('throwing-weapon', ...)`, preserving the Poison rule on line 64 via `opts.rules`.
- [x] 3.6 `skaven.ts:41,78,79` — migrate Throwing Weapons/Pistol/Rifle upgrade options to `weaponFantasy('throwing-weapon'/'pistol'/'rifle', ...)`.
- [x] 3.7 `warriors-of-chaos.ts:94` — migrate the Throwing Weapons upgrade option to `weaponFantasy('throwing-weapon', ...)`.
- [x] 3.8 Run `npm test`; confirm the "fabricated weapon name" audit and all other data-quality audits pass, and no unit/option's displayed stats changed except the 14 corrected ones (spot-check a few unrelated units render unchanged).

## 4. Permanent regression test

- [x] 4.1 Add the standard-named-custom-weapon audit to `src/data/fantasy-data-quality-audit.test.ts` per design.md Decision 5: for every Fantasy faction's baseline/upgrade-option weapon whose name matches one of the 11 canonical names (case/pluralization-insensitive), assert `range`/`attacks` equal the canonical value and the canonical rule(s) are present (extra rules allowed).
- [x] 4.2 Run the new test against current (post-fix) data; confirm it passes with zero findings. (The new audit additionally caught 2 more instances of the same bug class that the original manual scan missed — `high-elves.ts`'s "Lothern Skycutter" `3x Bows` and "Tiranoc Chariots" `2x Longbows` — fixed alongside the 14.)

## 5. Unrelated pre-existing test fix

- [x] 5.1 `src/views/integration.test.ts:140` — change `expect(builder.text()).toContain('Combine…')` to `'Merge…'`, matching the app's actual button text (confirmed pre-existing/unrelated to this change or any prior one).

## 6. Verification

- [x] 6.1 Full suite green (`npm test`) — 0 failures except 3 pre-existing unrelated failures confirmed (via `git stash`) to predate this change (`calc.test.ts`, `lists.test.ts`, `EntryUpgradeControls.test.ts` — all the same "Jump Pack (Deep Strike, Flying)" option-lookup issue, part of separate uncommitted WIP already in the working tree). Every test touched by this change (`index.test.ts`, `fantasy-data-quality-audit.test.ts`, `integration.test.ts`) is green.
- [x] 6.2 Typecheck clean (`vue-tsc --noEmit`) — 0 errors.
- [x] 6.3 Manual browser pass (via Playwright against the Vite dev server): Skaven Warlock Engineer's Pistol/Rifle upgrade renders `(12", A1, Piercing)`/`(24", A1, Piercing)`, ranged, not melee. High Elves Archers/Sisters of Avelorn render `Longbows (30", A1)`/`Bows (24", A1, Piercing)`, ranged, not melee (also spot-checked Lothern Skycutter/Tiranoc Chariots, whose "3x Bows"/"2x Longbows" bugs the new audit test caught and were fixed alongside the 14). Daemons of Chaos Soul Grinder's Warp Gaze/Phlegm Bombard upgrades render `Bolt Thrower (48", A3, Piercing, Single Target)`/`Stone Thrower (48", A3, Piercing, Indirect)` with correct stats. No console errors in any case.
