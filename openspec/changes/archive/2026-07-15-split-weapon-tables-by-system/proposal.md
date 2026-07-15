## Why

`src/data/weapons.ts` is a single global weapon table, transcribed only from the Warhammer 40k rulebook, but it's imported and used (via `helpers.ts`'s `weapon()`) as if it applied to both game systems. It doesn't: the Warhammer Fantasy rules (`one-page-fantasy-rules.md`'s "Weapons" section) print a materially different table — `Pistol` is `12", A1, Piercing` in Fantasy vs. `12", A1`, no rules in 40k; `Rifle` is `24", A1, Piercing` in Fantasy vs. `30", A1`, no rules in 40k; and nine Fantasy-only names (`Throwing Weapon`, `Shortbow`, `Fire Thrower`, `Bow`, `Longbow`, `Crossbow`, `Stone Thrower`, `Cannon`, `Bolt Thrower`) don't exist in the shared table at all. Because of this gap, every Fantasy faction file works around it by hand-rolling `customWeapon("Pistol", { range: 12, attacks: '1', rules: rules('Piercing') })`-style one-offs instead of referencing a shared, checked table — and an exhaustive audit of all 74 such calls across the 16 Fantasy faction files (run while investigating this change) found 14 with wrong stats (mostly `range: null`, i.e. accidentally melee, on weapons that should be ranged), independently of the two that are currently failing `index.test.ts`'s "every addEquipment label is not a fabricated weapon name" audit (`daemons-of-chaos.ts`'s "Warp Gaze"/"Phlegm Bombard", whose custom `Bolt Thrower`/`Stone Thrower` names aren't recognized as legitimate anywhere in the ruleset).

Separately, `integration.test.ts` has one pre-existing, unrelated failing assertion (`expect(builder.text()).toContain('Combine…')` where the UI has always rendered `'Merge…'`) that should be cleaned up while getting the suite green.

## What Changes

- Add `src/data/weapons-fantasy.ts`: a Fantasy-specific ranged-weapon table (11 entries: the 5 melee tiers — already correctly shared with 40k's identical tier stats, kept as-is — are *not* duplicated here; only the ranged weapons that differ or are Fantasy-only), transcribed exactly from `one-page-fantasy-rules.md`'s Weapons section.
- Add a `weaponFantasy(id, opts)` helper in `src/data/factions/helpers.ts`, mirroring `weapon()`, resolving against the new table — giving Fantasy faction files a proper checked reference instead of hand-rolled `customWeapon()` calls for standard weapons.
- **BREAKING** (internal only — no faction data or app behavior beyond bug fixes): `RulesDatabase.weapons` changes from `Weapon[]` to `Record<GameSystem, Weapon[]>` (matching the existing `glossaries` field's per-system shape), so each system's weapon table is queryable independently. The sole external consumer (`index.test.ts`'s fabricated-weapon-name audit) is updated to check each faction's `addEquipment` labels against its own system's table.
- Fix the 14 faction-data entries the audit found with wrong stats, migrating each to reference the new `weaponFantasy()` table (which also resolves the 2 currently-failing "fabricated weapon name" cases, since `Bolt Thrower`/`Stone Thrower` become recognized standard names).
- Add a permanent regression test (alongside the existing `melee-weapon-audit.test.ts`/`fantasy-data-quality-audit.test.ts` pattern) asserting every Fantasy `customWeapon()` call matching one of the 11 standard names has stats consistent with the canonical table (extra rules layered on top, e.g. a war-machine's `Indirect`, remain allowed), so this class of drift is caught automatically going forward.
- Fix the pre-existing `integration.test.ts` assertion mismatch (`'Combine…'` → `'Merge…'`, matching the app's actual, long-standing button text).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `rules-data`: the "Weapon profiles" requirement is updated to describe per-system weapon tables (not one shared "global weapon table") since some same-named weapons differ in stats between systems. A new requirement, "Warhammer Fantasy ranged weapon profiles match the Weapons table" (parallel to the existing melee-specific requirement), formalizes the Fantasy ranged-weapon table's completeness and correctness, including that `Pistol`/`Rifle` differ from their Warhammer 40k namesakes.

## Impact

- `src/data/weapons-fantasy.ts` — new file, the Fantasy ranged-weapon table.
- `src/data/factions/helpers.ts` — new `weaponFantasy()` helper.
- `src/domain/types.ts` — `RulesDatabase.weapons: Weapon[]` → `Record<GameSystem, Weapon[]>`.
- `src/data/index.ts` — assembles `weapons` per-system.
- `src/data/index.test.ts` — the fabricated-weapon-name audit becomes per-system-aware.
- 5 Fantasy faction files with data fixes: `daemons-of-chaos.ts`, `dwarfs.ts`, `high-elves.ts`, `lizardmen.ts`, `skaven.ts`, `warriors-of-chaos.ts` (6 files, 14 entries).
- `src/views/integration.test.ts` — one assertion corrected (unrelated pre-existing bug).
- New test file (or extension of `fantasy-data-quality-audit.test.ts`) covering the ranged-weapon table's completeness/correctness.
