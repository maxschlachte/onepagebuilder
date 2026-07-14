## 1. Shared builder support

- [x] 1.1 Extended `meleeTypeRules` in `src/data/factions/helpers.ts` with `halberd`/`mace`/`lance`.
- [x] 1.2 Full suite + typecheck confirmed clean before touching any fantasy file.

## 2. Migrate tier+type weapons to `meleeWeapon()`, per file

For each file: find every `customWeapon("<Tier> <Type>[s]", { range: null, attacks: '<n>', rules: rules('<extra>') }, opts?)` call and replace it with `meleeWeapon('<Tier>', '<Type>', { ...opts, rules: rules('<extra>'), label: '<original printed name>' })` (only pass `label` when the original name isn't already exactly what `meleeWeapon` would auto-derive). Leave any `customWeapon` call whose name isn't a tier+type pair (bespoke ability names) untouched. After each file, run `npx vitest run` and `npx vue-tsc --noEmit` and fix any failures before moving to the next file.

- [x] 2.1 `dark-elves.ts` (27 tier+type calls converted; full suite green)
- [x] 2.2 `dwarfs.ts` (17 tier+type calls converted)
- [x] 2.3 `high-elves.ts` (24 tier+type calls converted)
- [x] 2.4 `lizardmen.ts` (27 tier+type calls converted)
- [x] 2.5 `ogre-kingdoms.ts` (32 tier+type calls converted)
- [x] 2.6 `skaven.ts` (26 tier+type calls converted)
- [x] 2.7 `tomb-kings.ts` (30 tier+type calls converted)
- [x] 2.8 `vampire-counts.ts` (34 tier+type calls converted)
- [x] 2.9 `warriors-of-chaos.ts` (39 tier+type calls converted; also fixed a pre-existing data bug found along the way — Chaos Chariot's equipment was a single malformed string `"Master Halberds Medium Claws"` with no separator, now split into two proper weapons)
- [x] 2.10 Spot-checked the 7 already-correct files programmatically (parsed every tier+type `customWeapon` call and compared attacks to tier) — all 7 confirmed correct, no changes needed.

## 3. Common Upgrade tooltips

- [x] 3.1 Added `sergeant`/`musician`/`standard` to `src/data/glossary-fantasy.ts`.
- [x] 3.2 Updated all 48 call sites (16 factions × 3) to attach the matching rule.

## 4. Verification

- [x] 4.1 Extended `fantasy-data-quality-audit.test.ts` with a check that every melee weapon's attacks match its tier and every Mace/Halberd/Lance-type weapon carries its innate rule. Wrote this first (before the migration) and used it as the working verification tool for every file in Group 2 — it caught the one remaining pre-existing bug (Chaos Chariot's malformed concatenated weapon string) that the mechanical migration correctly declined to touch.
- [x] 4.2 Verified in a real browser (Playwright against the Vite dev server): Ogre Kingdoms' Tyrant shows "Master Mace (Melee, A4) — Piercing, Poison" (was 1 attack, no rules, before this change) and "Force Sword (Melee, A5)"; the Ogres unit shows "1x Sergeant — Sergeant" with a hoverable tooltip resolving to "One model gets +1 melee attack." No console errors.
- [x] 4.3 Full suite green: 222/222 tests passing; `vue-tsc --noEmit` clean. Grimdark Future factions unaffected (they don't use the 3 new `meleeTypeRules` type words).
