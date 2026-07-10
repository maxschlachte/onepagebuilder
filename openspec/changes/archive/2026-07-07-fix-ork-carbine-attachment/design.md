## Context

`isSectionAvailable` (`src/domain/calc.ts`) already receives the full `UnitProfile` — including its baseline `equipment` — not just the faction data, because `blockedBySelectingOnSingleModel` needs `unit.size`. The only missing piece for the Orks Carbine case is a way for `requiresOneOfSelected` to also treat baseline equipment as satisfying the requirement, instead of only checking currently-selected option ids.

This is narrowly scoped to fixing the one documented gap (`src/data/factions/orks.ts:33-38`) rather than a general re-architecture of the prerequisite system.

## Goals / Non-Goals

**Goals:**
- Let a section's "requires one of selected" clause be satisfied by baseline equipment the unit already carries, so it can be applied correctly to Orks group A without breaking Meganobz/Warbikers/Nob Bikers.
- Keep the change additive and narrow: existing prerequisites (none of which currently need this) are unaffected.

**Non-Goals:**
- Re-auditing other factions for the same "attachment" pattern — the prior `upgrade-prerequisites` change already did a faction-by-faction pass; Orks was the only documented deferral.
- Modeling equipment gained via *other selected upgrades* in this same clause (e.g. "Warbike" in group A's own "Equip one model with any" section also grants a Linked Carbine) — out of scope; not needed for the Ork case, since "Take one Carbine attachment" and "Equip one model with any" are independent sections and the rulebook only ties the attachment to the Carbine produced by "Replace one Pistol" or carried at baseline.

## Decisions

**Add a sibling field `satisfiedByEquipment` to `SectionPrerequisite`, checked only alongside `requiresOneOfSelected`.**

```ts
export interface SectionPrerequisite {
  blockedBySelecting?: string[]
  blockedBySelectingOnSingleModel?: string[]
  requiresOneOfSelected?: string[]
  /** Alternative to requiresOneOfSelected: also satisfied if the unit's baseline
   * equipment already includes any of these labels (e.g. a unit that starts
   * with the relevant gear needs no prior selection to unlock the section). */
  satisfiedByEquipment?: string[]
}
```

`isSectionAvailable` becomes:

```ts
if (prereq.requiresOneOfSelected?.length) {
  const metBySelection = prereq.requiresOneOfSelected.some((id) => selected.has(id))
  const metByEquipment = prereq.satisfiedByEquipment?.some((label) =>
    unit.equipment.some((e) => e.label === label),
  )
  if (!metBySelection && !metByEquipment) return false
}
```

Alternatives considered:
- **Match by weapon id instead of equipment label.** Rejected: `EquipmentEntry.label` is already the authored, human-readable string (`"Linked Carbines"`), matching how `requiresOneOfSelected` is authored against option *labels* in `helpers.ts` before being resolved to ids. Reusing labels keeps both fields symmetric and keeps `orks.ts` readable. A weapon-id match would require every relevant baseline entry to resolve to a known global weapon, which isn't guaranteed (`eqEntry` only sets `.weapon` for recognized/inline-profile entries).
- **Split group A into two groups (one for baseline-Carbine units, one without).** Rejected: it duplicates every other section in group A (Medium CCW replacement, "Equip one model with any") across two groups purely to special-case one section, and would need to change which letter is assigned to which unit — larger, riskier data diff for the same outcome.
- **A unit-level "already has X" flag set at data-authoring time.** Rejected: equipment is already the source of truth for what a unit carries; adding a parallel flag risks drifting out of sync with it.

**Resolve `satisfiedByEquipment` as literal strings (no id lookup).** Unlike `requiresOneOfSelected`/`blockedBySelecting`, these aren't option ids that need resolving via `faction()`'s `labelToId` map — they're equipment labels checked directly against `unit.equipment[].label`. `section()`/`group()` pass the array through unchanged.

## Risks / Trade-offs

- [Label matching is exact-string, so a future rewording of `"Linked Carbines"` in `orks.ts` silently breaks the check] → Mitigated by a structural test (extending `index.test.ts`) asserting every `satisfiedByEquipment` label matches at least one unit's baseline `equipment[].label` across the faction that uses the section, so a typo or rename fails at data-load/test time rather than silently.
- [Scope creep temptation to also cover the "Warbike"/"Mega Armor" case, which also grants a Linked Carbine via a different section] → Explicitly a non-goal; the rulebook doesn't tie the Carbine attachment to those, and today's bug report is specifically about baseline vs. produced-by-pistol-replacement, not this combination.
