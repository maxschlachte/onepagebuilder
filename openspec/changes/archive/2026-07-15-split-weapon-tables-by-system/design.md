## Context

`src/data/weapons.ts` (header comment: *"Global weapon table, transcribed from `1p40k - Main Rulebook v3.3.1.pdf`"*) is imported once by `src/data/factions/helpers.ts` and used by every faction file (both systems) via `weapon(id, opts)`, `weaponById`, `weaponByName`, and `resolveGlobalWeapon()`. It was never actually shared correctly: `one-page-fantasy-rules.md`'s own Weapons section (lines 95-112) prints different stats for two overlapping names and nine names 40k doesn't have at all:

| Name | 40k (`weapons.ts`) | Fantasy (`one-page-fantasy-rules.md`) |
|---|---|---|
| Pistol | `12", A1`, no rules | `12", A1`, **Piercing** |
| Rifle | `30", A1`, no rules | `24", A1`, **Piercing** |
| Throwing Weapon, Shortbow, Fire Thrower, Bow, Longbow, Crossbow, Stone Thrower, Cannon, Bolt Thrower | — (absent) | present |

The 5 melee tiers (`Light`=1…`Force`=5) are identical between the two rulebooks and already resolve correctly for Fantasy today via the shared table (`meleeWeapon()`'s tier lookup) — confirmed by `melee-weapon-audit.test.ts` and `fantasy-data-quality-audit.test.ts`'s existing tier-attack assertions, both passing. Only the *ranged* table needs a Fantasy-specific counterpart.

Because the shared table never had Fantasy's ranged weapons, every Fantasy faction file already works around it with `customWeapon(name, { range, attacks, rules })` one-offs instead of a checked reference. An exhaustive scan of all 74 such calls whose name matches one of the 11 standard Fantasy weapon names (written as a throwaway audit script while investigating this change, its logic productionized into a permanent test per Decision 3) found 14 with wrong `range`/`attacks`/missing baseline rules — almost all `range: null` (i.e. the weapon was accidentally authored as melee):

| File:line | Weapon | Bug |
|---|---|---|
| `daemons-of-chaos.ts:130` | Bolt Thrower (Warp Gaze) | missing `Single Target` |
| `dwarfs.ts:21` | Bolt Thrower (unit) | missing `Single Target` |
| `dwarfs.ts:66` | Throwing Weapons | `range: null`, should be `12` |
| `high-elves.ts:10` | Bows (Lothern Sea Guard) | `range: null`, should be `24` |
| `high-elves.ts:11` | Longbows (Archers) | `range: null`, should be `30` |
| `high-elves.ts:16` | Bows (Sisters of Avelorn) | `range: null`, should be `24` |
| `high-elves.ts:17` | Longbows (Shadow Warriors) | `range: null`, should be `30` |
| `high-elves.ts:47` | Longbow (upgrade option) | `range: null`, should be `30` |
| `lizardmen.ts:64` | Throwing Weapon (upgrade option) | `range: null`, should be `12` |
| `lizardmen.ts:82` | Throwing Weapons (upgrade option) | `range: null`, should be `12` |
| `skaven.ts:41` | Throwing Weapons (upgrade option) | `range: null`, should be `12` |
| `skaven.ts:78` | Pistol (upgrade option) | `range: null`, should be `12`; missing Piercing |
| `skaven.ts:79` | Rifle (upgrade option) | `range: null`, should be `24`; missing Piercing |
| `warriors-of-chaos.ts:94` | Throwing Weapons (upgrade option) | `range: null`, should be `12` |

Two of these (`daemons-of-chaos.ts`'s "Warp Gaze"/"Phlegm Bombard", the `Bolt Thrower`/`Stone Thrower` names) are also why `index.test.ts`'s "every addEquipment label is not a fabricated weapon name" audit currently fails: neither name exists anywhere in the 40k-only global table, and no other unit/option in `daemons-of-chaos.ts` happens to carry that exact label as a fallback match (unlike `Fire Thrower`, coincidentally already "known" there via `Burning Chariot`'s own baseline equipment).

`RulesDatabase.weapons` (`domain/types.ts:204-210`) currently has exactly one consumer outside `helpers.ts` (which imports `./weapons` directly, not via `rulesDatabase`): `index.test.ts:144`'s `globalWeaponNames` set for the fabricated-name audit. `RulesDatabase.glossaries` already models the "per-system table" shape as `Record<GameSystem, SpecialRule[]>` — a direct precedent to follow for `weapons`.

## Goals / Non-Goals

**Goals:**
- A proper, checked Fantasy ranged-weapon table exists and is provably complete/correct against `one-page-fantasy-rules.md`.
- `Pistol`/`Rifle` (and any future same-named-but-different weapon) can never again be silently conflated between the two systems.
- The 14 found data bugs are fixed at the source (referencing the canonical table), not just patched with corrected literals.
- A permanent test catches this class of drift (wrong stats on a standard-named custom weapon) automatically.
- Full suite green, including the one pre-existing unrelated `integration.test.ts` failure.

**Non-Goals:**
- No migration of the other 60 (of 74) `customWeapon()` calls that already have correct stats — they stay as literal `customWeapon()` calls. Migrating every one of them to `weaponFantasy()` is a valid follow-up cleanup but a much larger, riskier diff across all 16 Fantasy files for no behavior change; out of scope here (mirrors the same scoping discipline in `extract-weapon-profile-label`'s design.md).
- No change to the 5 shared melee tiers or `meleeWeapon()`/`meleeTypeRules` — already correct and system-agnostic, confirmed by existing passing audits.
- No re-verification of the 40k weapon table (`weapons.ts`) against its own source — no reference document for it is available in the repo, and nothing in this investigation suggests it's wrong.
- No change to `Faction`, upgrade-option, or unit schemas — only the weapon-table plumbing and the 14 data values.

## Decisions

### 1. `src/data/weapons-fantasy.ts` — a second table, not a merge into the existing one

New file, same shape as `weapons.ts` (`Weapon[]`, `as const satisfies Weapon[]`), containing exactly the 11 ranged rows from `one-page-fantasy-rules.md`'s Weapons section — not the 5 melee tiers (already shared, per Context). Ids have no need to avoid `weapons.ts`'s ids (`pistol`, `rifle` reused) since this is a separate type/map, never merged with the 40k one:

```ts
export const weaponsFantasy = [
  { id: 'throwing-weapon', name: 'Throwing Weapon', range: 12, attacks: '1', rules: [] },
  { id: 'pistol', name: 'Pistol', range: 12, attacks: '1', rules: P },
  { id: 'shortbow', name: 'Shortbow', range: 18, attacks: '1', rules: [] },
  { id: 'fire-thrower', name: 'Fire Thrower', range: 18, attacks: '6', rules: [] },
  { id: 'bow', name: 'Bow', range: 24, attacks: '1', rules: [] },
  { id: 'rifle', name: 'Rifle', range: 24, attacks: '1', rules: P },
  { id: 'longbow', name: 'Longbow', range: 30, attacks: '1', rules: [] },
  { id: 'crossbow', name: 'Crossbow', range: 30, attacks: '1', rules: P },
  { id: 'stone-thrower', name: 'Stone Thrower', range: 48, attacks: '3', rules: P },
  { id: 'cannon', name: 'Cannon', range: 48, attacks: 'D3+3', rules: P },
  { id: 'bolt-thrower', name: 'Bolt Thrower', range: 48, attacks: '3', rules: X },
] as const satisfies Weapon[]

export type FantasyWeaponId = (typeof weaponsFantasy)[number]['id']
```

(`P`/`X` are the same `Piercing`/`Piercing+SingleTarget` rule-ref constants already defined in `weapons.ts` — duplicated locally rather than imported, since `weapons.ts`'s are marked internal/unexported today; trivial one-line constants, not worth adding a shared-constants module for two files.)

*Alternative considered*: one shared array with system-scoped ids for every entry (e.go. `40k-pistol`/`fantasy-pistol`) instead of two tables. Rejected — would force renaming `weapons.ts`'s existing ids too (touching ~100+ existing 40k `weapon('pistol', ...)` call sites for zero behavioral gain) just to make room for a prefix convention; two separate tables/types achieve the same disambiguation with zero changes to any existing 40k call site.

### 2. `weaponFantasy(id: FantasyWeaponId, opts)` helper, mirroring `weapon()`

Added to `helpers.ts` alongside `weapon()`, with its own `weaponFantasyById` map built from `weaponsFantasy` the same way `weaponById` is built from `weapons`. Implementation is a straight copy of `weapon()`'s body against the new map — no shared abstraction extracted for two near-identical 10-line functions differing only in which table they close over; introducing a generic "table-backed weapon resolver" for exactly two call sites would be premature.

### 3. `RulesDatabase.weapons: Weapon[]` → `Record<GameSystem, Weapon[]>`

Matches `glossaries`' existing shape exactly. `index.ts` assembles `weapons: { 'system-40k': weapons, 'system-fantasy': weaponsFantasy }` (aliasing the `weapons.ts` import to avoid a name clash with the field). The only external consumer, `index.test.ts`'s fabricated-name audit, is updated to pick `rulesDatabase.weapons[faction.system]` per faction instead of one flat `rulesDatabase.weapons` — which also *tightens* that audit (a Fantasy faction's custom weapon can no longer be excused by an unrelated 40k-only name, and vice versa; not exercised by current data, but a real correctness improvement).

*Alternative considered*: add a second field (`weaponsFantasy: Weapon[]`) instead of restructuring `weapons` itself, to minimize the diff. Rejected — `Record<GameSystem, Weapon[]>` is one line more work at the single call site that reads it and is self-documenting/consistent with `glossaries`, versus a same-purpose-different-shape sibling field that invites the next reader to wonder why the two aren't symmetric.

### 4. Fix the 14 entries by migrating them to `weaponFantasy(id, opts)`

Each of the 14 found bugs becomes a `weaponFantasy('<id>', { ...opts })` call instead of a hand-rolled `customWeapon(name, { range, attacks, rules })` — the bug disappears because the stats now come from the checked table rather than a re-typed literal. Where the original call had an extra rule beyond the standard (e.g. `lizardmen.ts:64`'s Throwing Weapon carrying `Poison`), that extra rule is passed via `weaponFantasy`'s `opts.rules` (merged with the base rules the same way `weapon()` already merges `opts.rules`, via `addUniqueRule`), preserving it.

### 5. New permanent audit test, alongside `fantasy-data-quality-audit.test.ts`

Add `it('every standard-named custom weapon matches the Fantasy Weapons table', ...)` to `fantasy-data-quality-audit.test.ts` (already the home of the parallel melee-tier/type-rule assertions, and already scoped to `FANTASY_FACTIONS`) — walks every Fantasy faction's units and upgrade-option `addEquipment` entries, and for any `weapon.name`/`weapon.id` matching one of the 11 canonical names (case/pluralization-insensitive, same normalization `EquipmentList`'s existing `isKnownWeaponName` uses), asserts `range`/`attacks` equal the canonical value and the canonical rule(s) are a subset of the entry's rules (extra rules like a war machine's `Indirect` remain allowed — only the baseline is enforced, matching Decision 4's "extra rules preserved" behavior and the real data's many legitimate `Stone Thrower`/`Cannon` variants that add `Indirect`/`Poison`/etc.). This productionizes the throwaway audit script's logic as a standing regression guard, catching a future data-authoring slip the same way `melee-weapon-audit.test.ts` already does for melee tiers.

### 6. Fix `integration.test.ts`'s pre-existing `'Combine…'`/`'Merge…'` mismatch

Unrelated to the weapon-table work, but part of "get the suite green" per the proposal. The UI's actual button text has been `'Merge…'` since before this investigation (confirmed via `git stash` against `main` in an earlier session) — the test's `'Combine…'` expectation is the stale one. Fix: change the assertion to `'Merge…'`, not the UI text.

## Risks / Trade-offs

- **[Risk] `RulesDatabase.weapons`'s shape change is a breaking type change.** → Mitigation: verified exactly one external consumer (`index.test.ts:144`); `helpers.ts` imports the raw arrays directly and is unaffected. Grep confirmed before writing this design.
- **[Risk] The new audit test (Decision 5)'s "extra rules allowed, baseline required" check could still miss a genuine range/attacks typo on an entry using a *non-standard* name (e.g. a bespoke "Warpfire Thrower") that happens to resemble a standard one.** → Accepted: the audit only activates on an exact (depluralized, case-insensitive) name match against the 11 canonical names, same precision as the existing "fabricated weapon name" audit; a bespoke name is out of scope by design, same as today.
- **[Trade-off] Leaving 60 already-correct `customWeapon()` calls unmigrated (Non-Goals) means the codebase still has two ways to declare a standard Fantasy ranged weapon.** Accepted per scope discipline — the new audit test (Decision 5) catches drift in *either* form, so leaving the correct ones as literals doesn't reduce safety, only consistency; a full migration remains available as a separate, lower-urgency cleanup.
