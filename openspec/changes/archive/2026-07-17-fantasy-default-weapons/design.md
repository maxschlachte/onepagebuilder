## Context

`src/data/factions/fantasy/*.ts` (16 files) author unit equipment and upgrade-option equipment via four builders in `src/data/factions/helpers.ts`: `weapon(id)` (40k table), `weaponFantasy(id)` (11-entry fantasy ranged table in `src/data/weapons-fantasy.ts`), `meleeWeapon(tier, type)` (shared 5-tier melee table + `meleeTypeRules` innate-rule lookup), and `customWeapon(name, profile)` (fully hand-typed, no table lookup). All four ultimately produce the same `EquipmentEntry { key, label, count?, unitCount?, weapon?: Weapon, rules? }` shape — `weapon`/`weaponFantasy`/`meleeWeapon` clone a canonical table entry (`{ ...base, rules: mergedRules }`), `customWeapon` fabricates one from scratch.

Today, of 303 `customWeapon()` calls across the 16 fantasy files, a large fraction are exact or near-exact duplicates of a `weaponsFantasy` entry or a melee tier/type combination (confirmed by direct grep: e.g. `customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })` appears verbatim in `bretonnia.ts`, `empire.ts`, `orcs.ts`, `tomb-kings.ts` — identical to the `bow` table entry). `fantasy-data-quality-audit.test.ts` already hand-re-encodes `RANGED_TABLE`, `TIER_ATTACKS`, and `TYPE_RULE_IDS` as a second copy of the canonical data purely to catch drift in these hand-typed calls.

## Goals / Non-Goals

**Goals:**
- Convert every fantasy faction `customWeapon(...)` call whose profile matches a `weaponsFantasy` table entry (exactly, or plus additional merged rules) to `weaponFantasy(id, opts)`.
- Convert every fantasy faction `customWeapon(...)` call that is a plain `"<Tier> <Type>"` melee weapon (range `null`, attacks matching the tier, rules matching the type's innate rules or none) to `meleeWeapon(tier, type, opts)`.
- Preserve identical runtime output for every converted entry: same `label`, `key`, `count`, `unitCount`, `range`, `attacks`, and resolved `rules` (as a set) as before conversion — this is a pure authoring-pattern change, not a rules/balance change.
- Once conversion is done, trim `fantasy-data-quality-audit.test.ts`'s hand-encoded drift checks down to whatever `customWeapon()` usage genuinely remains (bespoke named weapons).

**Non-Goals:**
- No changes to `weapons-fantasy.ts`, `weapons.ts`, `helpers.ts`, or `domain/types.ts` — the reference/merge machinery already exists and already produces correct output; this change is data-only.
- No changes to bespoke/unique weapons that don't match any table entry or tier/type combo (e.g. "Frost Sphere", "Chaintrap", "Fangs", faction-unique guns) — these correctly stay as `customWeapon()`.
- No attempt to reconcile cases where a hand-typed profile appears to *diverge* from the source rulebook (e.g. a `customWeapon` with a rule the table doesn't have and that isn't a plausible "extra rule on top of the base" — such cases are a data-correctness question against `one-page-fantasy-army-lists.md`, out of scope for this authoring-pattern cleanup, and should be flagged rather than silently converted).

## Decisions

**Conversion classification, per `customWeapon(name, profile, opts)` call site:**

1. **Ranged, exact match** — `profile.range`/`profile.attacks` equal a `weaponsFantasy` entry's `range`/`attacks`, and `profile.rules` is either identical to that entry's `rules` or is that entry's `rules` plus extra rule(s) not present on the base entry → convert to `weaponFantasy(id, { rules: <extra rules only>, ...other opts })`. `weaponFantasy`'s own merge logic (`helpers.ts:218-229`) already unions the base rules with `opts.rules` via `addUniqueRule`, so only the *extra* rules need to be passed, not the full set.
2. **Melee, exact match** — `profile.range === null`, `profile.attacks` equals one of the five tier values (`Light`→`1`, `Medium`→`2`, `Heavy`→`3`, `Master`→`4`, `Force`→`5`), and the call's `name` follows the `"<Tier> <Type>"` pattern → convert to `meleeWeapon(tier, type, opts)`. If `type.toLowerCase()` is one of `meleeTypeRules`' keys (`powersword`, `powerfist`, `halberd`, `mace`, `lance`), drop the now-redundant explicit rules from `profile.rules` that match the type's innate rules; keep any rules beyond those as `opts.rules`.
3. **Name text**: `weaponFantasy`/`meleeWeapon` auto-derive `label` from the table entry's/tier-type's name via `withCountPrefix`. Where the original `customWeapon` call's `name` string differs from the table's canonical name only by pluralization/count (e.g. `"Bows"` vs. `"Bow"`), rely on the builder's own `count`/`unitCount`-driven pluralization rather than passing an explicit `label`. Where the original call used a materially different display name (e.g. `"Rapid Bolt Thrower"` for a `bolt-thrower` + `Rapid` rule), keep `customWeapon` — this is a bespoke-named weapon, not a plain reference (see Non-Goals).
4. **No new helper needed**: `weaponFantasy`/`meleeWeapon` already support everything this conversion requires (rule merging, count/label overrides). No changes to `helpers.ts`.
5. **Test cleanup ordering**: convert data first, run the full test suite (including `fantasy-data-quality-audit.test.ts` and any print-output/snapshot tests) after each faction file to catch label/key drift immediately, then trim the audit test's now-redundant drift-detection logic last, once no `customWeapon()` calls remain that those checks were covering.

## Risks / Trade-offs

- **[Risk] A `customWeapon` call looks like an exact match but the source rulebook actually intends a distinct weapon (coincidental stat overlap)** → Mitigation: convert per-faction in small batches, run `fantasy-data-quality-audit.test.ts` plus the full suite after each batch, and cross-check any surprising case against `one-page-fantasy-army-lists.md` / `one-page-fantasy-rules.md` before converting rather than after.
- **[Risk] Label/key text drift breaks a print-view snapshot or an upgrade's `removeEquipment` key match** → Mitigation: `weaponFantasy`/`meleeWeapon` derive `key` from the same `nameToId` convention `customWeapon` uses when no explicit `label`/`key` override is given, so a straight conversion should reproduce identical `key`/`label` for the common case; where an upgrade option elsewhere in the same faction file references the equipment by key (e.g. `removeEquipment: ["Light Swords"]`), verify that key still resolves after conversion.
- **[Risk] Over-eager conversion swallows a genuinely bespoke weapon that only coincidentally shares a tier's attack value** → Mitigation: require the *name* to also follow the `"<Tier> <Type>"` convention (not just the attacks number) before converting a melee entry; ranged entries require the *name* to match the table entry's canonical name (or be a simple pluralization of it) before converting.
- **[Trade-off] This is a large, mechanical, file-by-file diff (16 files, ~300 call sites to triage) with no user-visible behavior change** → Accepted, since the payoff is eliminating a whole class of manually-maintained duplicate-data drift checks and bringing fantasy data authoring in line with the already-established 40k pattern and the `rules-data` spec.

## Migration Plan

No runtime migration — this is a source-only refactor of faction data files, applied and reviewed incrementally per faction file, with the test suite green after each file. No deploy/rollback concerns beyond normal PR review; revertible per-commit if a conversion is found to have altered a weapon's stats.

## Open Questions

- None outstanding — classification rules above are mechanical and can be applied file-by-file during implementation; any call site that doesn't clearly fit rule 1 or 2 stays as `customWeapon()` by default.
