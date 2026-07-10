## 1. Weapon-row computation

- [x] 1.1 In `src/views/PrintView.vue`, add a `weaponDisplayName(label)` helper: if `hasOwnInlineProfile(label)` is true, strip the trailing parenthetical; otherwise return the label unchanged.
- [x] 1.2 Add a `weaponRows(eff, kind)` helper (`kind: 'ranged' | 'melee'`) that filters `eff.equipment` to entries with a `.weapon` whose `range` is (non-null / null) respectively, and maps each to `{ label: weaponDisplayName(e.label), qty: e.unitCount ?? eff.profile.size, range, attacks: 'A' + e.weapon.attacks, rules: ruleNames(e.weapon.rules) }`.
- [x] 1.3 Add an `otherEquipment(eff)` helper returning `eff.equipment` entries with no `.weapon`.
- [x] 1.4 Remove the now-unused `weaponLine` function.

## 2. Template

- [x] 2.1 Replace the unit's single "Equipment:" paragraph with a Ranged Weapons `<table>` (rendered only when `weaponRows(eff, 'ranged').length`), columns: Qty (only when `eff.profile.size > 1`), Weapon, Range, Attacks, Rules.
- [x] 2.2 Add a Melee Weapons `<table>` (rendered only when `weaponRows(eff, 'melee').length`), same columns minus Range.
- [x] 2.3 Add an "Other" line below the tables for `otherEquipment(eff)` entries (rendered only when non-empty), in the existing compact inline style (label plus its rules in brackets, semicolon-joined).
- [x] 2.4 Keep a fallback "—" line for the (now essentially unreachable, since every unit always has at least a default melee weapon) case where a unit has no equipment at all.
- [x] 2.5 Style the tables with the existing Tailwind conventions (text-sm, gray borders/dividers) consistent with the rest of the print page, and confirm `.print-unit`'s `break-inside: avoid` still applies to the whole unit block including the new tables.

## 3. Tests

- [x] 3.1 Ran the existing `src/views/integration.test.ts` print-view assertions. One assertion (`toContain('48”')`) failed as an expected consequence of the design (the raw curly-quote label text is no longer shown verbatim now that the redundant inline profile is stripped in favor of the computed Range column) — updated it to the straight-quote form that column actually renders; all other assertions passed unchanged.
- [x] 3.2 Added `src/views/PrintView.test.ts` with 5 tests: a unit with both ranged and melee weapons renders two tables with the expected headers (Terminators); a multi-model unit shows a quantity column (Terminators) and a single-model unit doesn't (Captain); a unit with no ranged weapon omits the Ranged table (Sisters Repentia — the converse "ranged-only, no Melee table" case is unreachable now that every unit always gets at least a default Light CCW, so it isn't tested); a non-weapon equipment entry appears on the "Other" line (Tau Pathfinders' Markerlights).

## 4. Verification

- [x] 4.1 Run the full test suite and confirm everything passes.
- [x] 4.2 Manually verified in the running app (Playwright): Land Raider (size 1, multiple ranged weapons + default Light CCW) shows both tables with no Qty column; Terminators (size 5) shows both tables with a `5x` Qty column; Captain (size 1, ranged + default melee) shows both tables with no Qty column. Screenshot confirms clean, clearly separated tables with no awkward layout.
