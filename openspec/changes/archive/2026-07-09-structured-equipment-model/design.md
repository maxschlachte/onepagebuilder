## Context

Today, faction files (`src/data/factions/*.ts`) author equipment as plain strings — a unit's `equipment: 'Linked Assault Rifles, Assault Rifles'`, an upgrade's `addEquipment: ['Medium Powersword']`, `removeOneEquipment: ['Assault Rifle']`. `helpers.ts` turns these into `EquipmentEntry`/`Weapon` objects via a regex pipeline (`eqEntry` → `parseWeaponProfile` / `resolveGlobalWeapon`, with inference for `Linked `-prefixes and melee tier-prefixes like `Medium CCW`). `calc.ts` then re-matches `removeEquipment`/`removeOneEquipment` targets against the *rendered* `label` string of each baseline entry, normalized with a hand-rolled case/pluralization fold (`normalizeLabel`). Two existing audit tests (`melee-weapon-audit.test.ts`, `weapon-count-audit.test.ts`) exist specifically because this pipeline has silently produced wrong results before (dropped attacks values, mismatched replace targets) — they walk the whole database and flag anything that doesn't resolve cleanly. The goal of this change is to remove the inference/re-matching layer entirely by making equipment structured and type-checked at the point of authoring, so those classes of bug become compile-time or construction-time errors instead of requiring a full-database audit to catch.

## Goals / Non-Goals

**Goals:**
- Faction files declare equipment as structured builder calls, not free text; a typo'd weapon id fails to compile rather than silently resolving to `undefined`/no profile.
- Every `EquipmentEntry` carries a stable identity (`key`) that upgrade effects reference directly, replacing label-string matching (exact or normalized) in `calc.ts`.
- No regex inference of weapon type/range/attacks/rules from a name string anywhere in the pipeline.
- Zero behavioral drift: every unit's effective equipment/rules/cost, for every upgrade combination, resolves to the exact same values before and after the rewrite.

**Non-Goals:**
- Redesigning the "attached sub-model" compound-equipment cases (Tau drones, e.g. `Drone (Linked Carbine)`) — these stay on the existing out-of-scope allowlist pattern; this change doesn't add nested-profile support.
- Changing `Weapon`, `RuleRef`, or `SpecialRule` shapes, or how special-rule tokens (e.g. `Tough(3)`) are authored — only *equipment* authoring/matching changes.
- Changing any UI-observable rendering. `EquipmentList.vue`/print-view keep consuming the same `EquipmentEntry`/`Weapon` runtime shape; any label-format cleanup (see Decisions) is required to be visually equivalent, not an intentional UI change.
- Introducing a runtime feature flag or dual-path support — this is a build-time authoring/internal-representation change with no user-facing runtime toggle.

## Decisions

**1. Add `EquipmentEntry.key: string` as the stable matching identity, separate from `label`.**
Builders compute `key` deterministically from their canonical input (a global weapon's `id` for `weapon(...)`, `nameToId(name)` for `customWeapon`/`gear`), never from the display label. `removeEquipment`/`removeOneEquipment` become `string[]` of *keys* (still plain strings authors can type by hand, e.g. `removeOneEquipment: ['assault-rifle']`), matched with exact equality in `calc.ts` — no `normalizeLabel` fold. Alternative considered: reuse `label` as the match key — rejected, since `label` must stay a pluralization/count-aware display string (`"2x Hurricane Bolters"`), which is exactly why today's matching needs fuzzing.

**2. Structured builder functions in `helpers.ts`, replacing the parsing pipeline:**
- `weapon(id: WeaponId, opts?: { count?, unitCount?, rules? })` — looks up the global weapon table by id. `WeaponId` is a union type derived from `weapons.ts` (`(typeof weapons)[number]['id']`), so an unknown id is a compile error, not a silent miss.
- `meleeWeapon(tier: MeleeTier, type?: MeleeTypeWord, opts?)` — explicit tier + type arguments instead of inferring both from a single `"Medium Powersword"`-shaped string; type's innate rules (Piercing for Powersword, Piercing+Rending for Powerfist) are looked up from the existing `meleeTypeRules` map, now invoked directly rather than regex-matched out of a name.
- `customWeapon(name: string, profile: { range: number | null; attacks: string; rules?: RuleRef[] })` — replaces inline-parenthetical parsing (e.g. today's `"Thunderfire Cannon (48”, A12, Indirect)"`) with an explicit profile object.
- `gear(name: string, opts?: { rules?: RuleRef[] })` — non-weapon equipment (`Servo Arm`, `Markerlight`).
- `linked(entry: EquipmentEntry)` — wraps any of the above, adding the `Linked` rule; replaces the `Linked `-name-prefix convention.
`eqEntry`, `equipment(list: string)`, `parseWeaponProfile`, `resolveGlobalWeapon`, and the tier/`Linked`-prefix inference helpers are deleted. `nameToId`, `parseRule`, `rules()` (special-rule string parsing) are untouched.

**3. Label stays a display string, produced by the builder, not hand-typed with an embedded profile.**
Builders set `label` to the plain equipment name (no baked-in `(24", A2)` parenthetical); `EquipmentList.vue`'s `hasOwnInlineProfile` check becomes permanently false and can be deleted as dead code once migration is complete, since the profile bracket it exists to avoid duplicating is now always computed from `entry.weapon`, never embedded in `label`. Rendered text is unchanged (same numbers, now always shown as a suffix bracket instead of sometimes baked into the label) — this is a minor internal simplification alongside the main change, not a UI redesign.

**4. Migrate all 16 faction files as part of this change, not behind a coexistence shim.**
Both authoring styles (string vs. builder) could theoretically coexist in `helpers.ts` during a phased rollout, but nothing else in the codebase benefits from a partial migration — `calc.ts`'s matching logic must switch to key-based matching in one step (it can't cheaply support both old label-fuzzy-matching and new key-matching at once without its own dead code). Migrate faction-by-faction commits within this one change instead.

**5. Safety net: golden snapshot of resolved output, not just the existing audits.**
Before touching any faction file, snapshot every unit's fully-resolved equipment (baseline and under every selectable upgrade combination already exercised by `weapon-count-audit.test.ts`/`melee-weapon-audit.test.ts`) via a temporary test that serializes `rulesDatabase`'s equipment-relevant fields. Re-run after each faction file's migration; the temporary snapshot test is deleted once all 16 files are migrated and the permanent audits (adapted to key-based matching) are green.

## Risks / Trade-offs

- **[Risk]** Manual rewrite of ~700+ equipment/upgrade-effect lines across 16 files risks transcription drift from the PDF, independent of the mechanical refactor. → **Mitigation**: golden snapshot diff (Decision 5) plus keeping `melee-weapon-audit.test.ts`/`weapon-count-audit.test.ts` green throughout, migrating one faction file at a time.
- **[Risk]** `gear(...)`/`customWeapon(...)` names aren't compile-time checked against anything (unlike `weapon(id)`), so a typo'd custom name is still only caught at test time. → **Mitigation**: keep the melee/ranged weapon-resolution audit test (adapted) that fails on any entry with no resolvable profile where one is expected — same safety net as today, still needed even with typed weapon ids.
- **[Risk]** Two distinct equipment entries on the same unit could compute the same `key` (e.g. two `customWeapon` calls that happen to share a name but differ in profile), breaking replace-target matching. → **Mitigation**: builder accepts an optional explicit `key` override for this rare case; add a dev-time assertion in the unit/faction builder that throws on duplicate keys within one unit's equipment list.
- **[Risk]** This is a large, low-diff-locality change (touches every faction file) that's hard to review as one block. → **Mitigation**: structure the implementation as one commit per faction file (17 commits: helpers + 16 factions), each independently green against the snapshot test, even though they land as a single change.

## Open Questions

- Should `removeEquipment`/`removeOneEquipment` keys be validated (at construction time) against the union of the unit's baseline `weapon(...)` ids and any `addEquipment` keys from earlier-resolved upgrade groups, to catch a dangling replace-target the same way a dangling `weapon(id)` typo is now caught? Leaning yes, as a lightweight addition to the existing `weapon-count-audit.test.ts`, but deferring the exact mechanism to implementation.
- Do any factions have a legitimate case for two entries needing the same key on one unit (beyond the rare collision case in Risk 3)? To be confirmed while migrating — if it comes up often, the explicit `key` override becomes a primary API rather than an escape hatch.
