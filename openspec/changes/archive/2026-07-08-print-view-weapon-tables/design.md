## Context

`PrintView.vue` currently builds one string per equipment entry via `weaponLine(e, unitSize)` (`${count-prefix}${label} (${range-or-Melee}, A${attacks})`) and joins all entries for a unit with `; ` inside a single `<p>`. This is compact but unstructured — a reader has to parse a run-on sentence to find, say, all of a vehicle's ranged guns versus its one melee weapon. Everything needed to split and tabulate this is already on `EffectiveUnit.equipment`: `e.weapon.range === null` marks melee, a non-null number marks ranged, and entries with no `.weapon` at all (a handful of rule-granting, non-attack items like `Markerlight` or `Zephyrglaive (Impact(1))`, catalogued by the `fix-melee-weapon-parsing-gaps` audit) are neither.

## Goals / Non-Goals

**Goals:**
- Split each unit's weapons into a Ranged table and a Melee table in the print view, each only rendered when non-empty.
- Keep every piece of information the current inline format shows (count, name, range, attacks, rules) — this is a layout change, not a data reduction.
- Keep the existing non-weapon equipment and Special Rules lines intact.

**Non-Goals:**
- Changing the interactive builder's `EquipmentList.vue` — out of scope; the user's complaint is specifically about the print view.
- Changing what counts as "melee" vs "ranged" vs "non-weapon" — reuses the exact same `weapon.range` semantics already established by prior changes.
- Sorting or reordering weapons within a table beyond their existing array order.

## Decisions

**Two separate `<table>` elements per unit (Ranged, then Melee), not one merged table with a Type column.** The user explicitly asked for weapons "divided into melee and ranged weapons" — two distinct tables is the more literal, scannable reading of that request (a reader looking for "what can this unit do in combat" doesn't have to scan a Type column), versus a single table that's merely sorted/grouped.

**Melee's table omits a Range column entirely, rather than showing "Melee" in every row.** Every row in that table is melee by construction (it's a separate table), so a Range column would be constant, wasted width. Ranged's table keeps Range since it actually varies per row.

**Qty column is conditional on `unit.size > 1`, matching `show-weapon-counts`'s existing display rule.** Reusing the same threshold keeps the print view consistent with the builder — a size-1 Hero/vehicle never shows a trivial "1x" column in either place.

**Strip a weapon's own inline-profile parenthetical from the Weapon column when present, rather than showing it twice.** `hasOwnInlineProfile` (already used by the current `weaponLine`) detects labels like `Battle Cannon (48", A9p)` that spell out range/attacks/rules directly in the data. In the old inline-sentence format this check prevented appending a redundant `(48", A9)` after the label; in a table, the same redundancy would show up as the parenthetical sitting in the Weapon cell while the same numbers also populate the Range/Attacks columns. Stripping it once, structurally, keeps every column meaningful without repeating data.

*Alternative considered*: leave the label untouched and let the parenthetical sit alongside the columns. Rejected as visually redundant and undermining the stated goal of making weapons easier to scan.

**Non-weapon equipment keeps today's compact inline-list style, on one line below the tables.** These are a handful of rule-granting items with no range/attacks to tabulate (confirmed by the `fix-melee-weapon-parsing-gaps` audit's documented allowlist) — putting them in a third single-column table would be more ceremony than the content warrants. A plain "Other: X, Y" line preserves the information without inventing a table with mostly-empty columns.

## Risks / Trade-offs

- **Table layout on very narrow print widths** (unlikely for a `max-w-4xl` page, but possible if a user shrinks their print margins) could wrap awkwardly. → Not addressing pagination/responsive edge cases in this change; the existing page is already a fixed reasonable width.
- **Long Rules text in the last column** could stretch a table wider than intended on some rows. → Acceptable; standard HTML table auto-layout already handles this today in the existing rule-reference `<dl>` grid without complaint.

## Migration Plan

Pure presentation change in one Vue component — no data migration, no domain logic changes. Existing integration tests (substring-based) should continue passing; new assertions are added for the table structure and the ranged/melee split.
