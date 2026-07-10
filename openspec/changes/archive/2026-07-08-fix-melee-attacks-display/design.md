## Context

`eqEntry` (`src/data/factions/helpers.ts`) resolves an equipment token to a `Weapon` profile in one of two ways: (1) an inline parenthetical containing a range/attacks token (e.g. `Battle Cannon (48", A9p)`), or (2) an exact, case-insensitive, de-pluralized match of the whole name against the global weapon table (`src/data/weapons.ts`), which is keyed by full weapon names like `Pistol`, `Assault Rifle`, and — for melee — the bare attack-tier words `Light`, `Medium`, `Heavy`, `Master`, `Force` (each carrying `range: null` and a fixed `attacks` value).

Across all 16 faction files, melee equipment is always authored as `"<Tier> <Type>"` (e.g. `Medium CCW`, `Heavy Claws`, `Light Powerfist`, `Force Powersword`), never as the bare tier word alone. The exact-match lookup (`weaponByName.get("medium ccw")`) always misses, so `entry.weapon` is left `undefined` for every melee weapon that isn't given its own inline profile. `EquipmentList.vue` and `PrintView.vue` already render `(Melee, A<n>)` correctly whenever `weapon.range === null` — they just never receive a `weapon` object for these entries.

## Goals / Non-Goals

**Goals:**
- Make `eqEntry` resolve `"<Tier> <Type>"` melee names against the global attack-tier table, so `entry.weapon` (and thus the attacks bracket) is populated the same way ranged weapons already are.
- Keep the fix in the shared parsing helper so it applies uniformly to all 16 faction files without editing their data.
- Preserve all existing exact-match and `Linked`-prefix behavior for ranged weapons.

**Non-Goals:**
- Changing the rendering components (`EquipmentList.vue`, `PrintView.vue`) — their bracket logic already handles `range === null` correctly.
- Adding new weapon types/rules to `src/data/weapons.ts`.
- Validating every individual faction file's melee wording exhaustively (covered indirectly by existing full-dataset tests plus new targeted unit tests).

## Decisions

**Match on the leading tier word, not a hardcoded suffix list.** Rather than special-casing `"CCW"`, `"CCWs"`, `"Claws"`, `"Powerfist"`, `"Powersword"` (an incomplete and growing list — the data already has all of these), fall back to checking whether the *first word* of the (already `Linked`-stripped) lookup name matches one of the melee tier ids (`light`, `medium`, `heavy`, `master`, `force`) in the global table. If it does, use that tier's `Weapon` object.

This is only attempted when the exact full-name match fails, so it can't change behavior for any weapon whose full name already matches an entry (e.g. `Heavy Flamer`). It also can't fire for weapons resolved via the inline-profile branch (checked earlier in `eqEntry` and unaffected by this change), which already covers every ranged weapon in the data that happens to start with a tier word but carries its own printed range (e.g. `Heavy Grav-Cannon (30", ...)`).

*Alternative considered*: enumerate known suffixes (`CCW(s)`, `Claws`, `Powerfist(s)`, `Powersword(s)`) and match `"<Tier> <Suffix>"` explicitly. Rejected — it requires maintaining the suffix list as new melee weapon types are transcribed from the rulebook, whereas the tier-word-prefix approach is derived directly from the global table and needs no maintenance.

**Attach the tier `Weapon` object as-is (no rename/clone).** Consistent with the existing exact-match branch (`if (known) entry.weapon = known`), the tier weapon's `id`/`name` (`'medium'`/`'Medium'`) is used unchanged; only `range`/`attacks` are read by the display logic, and `label` (shown in the UI) already comes from the original token. No component reads `weapon.name`/`weapon.id` for display today (confirmed by search).

**Leave `Linked` handling untouched.** The existing `Linked`-prefix branch (stripping a leading `Linked ` from the name) and the parenthetical-rules-into-`weapon.rules` folding logic run independently of this fix; a melee weapon in a `Linked` upgrade slot would follow the same path a ranged one does today.

## Risks / Trade-offs

- **Compound labels starting with a tier word but describing more than one item** (e.g. `Medium Powerfists and Force Shields (Tough(3))`) will now attach a `Weapon` profile (tier `medium`, attacks `2`) for the whole label. → Acceptable: the melee weapon is still the first-mentioned item, the displayed attacks value is correct for it, and the trailing `(Tough(3))` special rule is unaffected (already parsed into `entry.rules` regardless of `known`). No data changes needed.
- **A future faction weapon that legitimately starts with a tier word but isn't a tier-based melee weapon** (none exist in current data — verified by auditing every equipment/label token starting with `Light`/`Medium`/`Heavy`/`Master`/`Force` across all faction files) could be mis-resolved. → Mitigated by scoping the fallback strictly to the 5 known melee tier ids (not arbitrary word matches), and by the existing full-dataset tests in `src/data/index.test.ts` that would surface an obviously wrong attacks value via manual/print-view review.
- **Stale test comment**: `src/data/index.test.ts`'s `'every addEquipment label is not a fabricated weapon name'` test carries a comment stating labels like `Medium CCW` "never resolve via eqEntry" — this becomes inaccurate after the fix. → Update the comment as part of this change; the test's actual assertions are unaffected since they operate on label strings, not `eqEntry` output.

## Migration Plan

No migration needed — this is a pure logic fix in a pure function with no persisted state or external interface. Existing snapshot/behavioral tests plus new targeted tests validate the change; no feature flag required given the low blast radius (additive display data only, never removes information).
