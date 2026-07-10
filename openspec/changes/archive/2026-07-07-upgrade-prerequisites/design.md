## Context

The previous change (`fix-upgrade-selection-rules`) split each lettered upgrade group into independently-capped **sections** (`UpgradeSection { title, selection, options }`) and enforced how many options can be picked *within* a section. It did not address dependencies *between* sections of the same group. Two concrete patterns were found by grepping the now-corrected faction data:

- **Attachment-depends-on-base-weapon**: `Space Marines` group A ("Replace one Assault Rifle" + "Take one Assault Rifle attachment"), and the same shape in `Chaos Space Marines` B, `Sisters of Battle` A, `Orks` A ("Carbine attachment"), `Inquisition` A, `Space Marine Chapters` A. The attachment section's options only make sense while the unit still has the weapon they attach to.
- **Produced-item-then-replaced**: `Sisters of Battle` group A ("Replace one Assault Rifle" → two of four options produce a Pistol → "Replace Pistol" section). Also present in `Inquisition`, `Orks`, `Space Marine Chapters`, `Harlequins` wherever a "Replace Pistol"/"Replace [item]" section follows a section that only sometimes produces that item.

Both patterns are resolvable without a general equipment-inventory engine: in every case found, "is the prerequisite met" reduces to "is a specific, enumerable option (or one of a few) currently selected/unselected" — not an open-ended count. A full quantity-tracking system (e.g., "at least 2 of 5 Assault Rifles remain") was considered and rejected — see Decisions.

## Goals / Non-Goals

**Goals:**
- A section can declare it becomes unavailable once specific option(s) elsewhere are selected, optionally scoped to single-model units only (since "replace one X" on a multi-model unit never exhausts X, but does on a size-1 unit).
- A section can declare it's only available once specific option(s) elsewhere are selected (the "produced item" case).
- Violating a prerequisite is prevented at selection time (store-level) and cascades: deselecting/reselecting an option that invalidates an already-selected option elsewhere auto-clears that now-invalid selection.
- Imported JSON lists that violate a prerequisite are rejected with a clear error.
- The UI visibly disables an unavailable section's inputs, consistent with how capped sections already disable inputs at their limit.

**Non-Goals:**
- No general per-model equipment-quantity simulation (e.g., tracking that a 5-model unit has exactly 3 Assault Rifles left after two separate replacements). Every real case found is satisfied by "was this specific option selected," not a running count. If a genuine count-sensitive case turns up later, it's a separate, larger change.
- No restructuring of `EquipmentEntry` to split compound labels ("Pistol and Medium CCW") into atomic per-weapon entries — the prerequisite model here is expressed purely in terms of `UpgradeOption` ids, not equipment inventory, so it doesn't need that.
- Not every faction/group gets annotated — only groups where a real dependency exists between two of their sections (identified per-faction during implementation).

## Decisions

**Prerequisites reference option ids directly, not abstract "equipment tags."**
Alternative considered: give equipment entries a normalized tag (e.g. `'assault-rifle'`) plus a computed quantity (`entry.count × unit.size`), have options declare `consumesTag`/`producesTag`, and have sections declare `requiresTagRemaining`. Rejected because many equipment entries are compound free-text labels ("Pistol and Medium CCW", "Stormbolter and Master Powerfist") authored as a single string — extracting "does this entry include a Pistol" would mean either parsing labels (fragile, easy to silently break on a rewording) or restructuring `EquipmentEntry` into atomic per-weapon rows across all 16 factions (a large, unrelated migration). Since every concrete prerequisite found reduces to "was this enumerable option picked," referencing option ids directly is simpler, exact, and needs no equipment-model changes.

**Two independent clause types on `UpgradeSection`, not one combined boolean expression:**
```ts
export interface SectionPrerequisite {
  /** This section is unavailable while any of these option ids (elsewhere in the unit) are selected. */
  blockedBySelecting?: string[]
  /** Same as blockedBySelecting, but only enforced when the unit has exactly one model (unit.size === 1). */
  blockedBySelectingOnSingleModel?: string[]
  /** This section is only available while at least one of these option ids is selected. */
  requiresOneOfSelected?: string[]
}

export interface UpgradeSection {
  title: string
  selection: UpgradeSelection
  options: UpgradeOption[]
  prerequisite?: SectionPrerequisite
}
```
`blockedBySelecting` covers "replace **all** X" options, which remove X regardless of unit size. `blockedBySelectingOnSingleModel` covers "replace **one** X" options, which only remove the unit's entire supply of X when there's exactly one model. `requiresOneOfSelected` covers the produced-item case. A section can combine clauses (e.g. an attachment section could in principle need both a single-model block and, separately, an all-model block from a different sibling section) — evaluated as: available ⇔ (`blockedBySelecting` all unselected) ∧ (unit.size > 1 ∨ `blockedBySelectingOnSingleModel` all unselected) ∧ (`requiresOneOfSelected` empty ∨ at least one selected). Alternative considered: a single generic boolean-expression tree — rejected as over-engineering for three clause shapes that cover every case found.

**Evaluation needs the `UnitProfile`, not just the `Faction`.**
`blockedBySelectingOnSingleModel` depends on `unit.size`. The existing `findSection(faction, optionId)` helper (from the prior change) only needs the faction; the new `isSectionAvailable(faction, unit, section, selectedUpgrades)` helper takes the unit profile too. Call sites (`toggleUpgrade`, `BuilderView`) already have the unit profile in scope.

**Cascading deselect via fixed-point re-validation, not a dependency graph walk.**
After any toggle, re-scan the unit's `selectedUpgrades`: drop any option whose owning section is no longer available given the *current* remaining selections, and repeat until a pass removes nothing. In the data found, chains are at most two sections deep, but a fixed-point loop is simple, correct for arbitrary depth, and cheap (a unit has at most a few dozen selected upgrades). Alternative considered: computing an explicit dependency graph and topologically invalidating — unnecessary complexity for the scale of data involved (bounded by `faction.upgradeGroups` per unit, typically under 5 groups).

**UI: reuse the existing disabled-checkbox treatment; add a one-line reason.**
Sections already render disabled checkboxes once a cap is reached (prior change). Unavailable-by-prerequisite sections get the same visual treatment, plus a short inline note under the section title (e.g. "Requires an Assault Rifle" or computed from the blocking option's label, e.g. "Unavailable — Assault Rifle replaced"). Any options already selected in a section that just became unavailable are cleared by the same store-level cascade, so the UI never has to reconcile a disabled-but-checked state.

## Risks / Trade-offs

- [Missing a real dependency during the faction-by-faction annotation pass] → Mitigated by working faction-by-faction against `one-page-40k-army-lists.html` (same rigor as the prior transcription change) and by the structural test added in this change (every `blockedBySelecting*`/`requiresOneOfSelected` id must resolve to a real option in the same faction — a typo'd id fails loudly instead of silently no-oping).
- [Over-annotating a section that doesn't actually need a prerequisite, subtly restricting a legal loadout] → Mitigated by only adding a prerequisite where the printed rule's wording implies one (an "attachment" to a specific weapon, or a "Replace X" where X isn't in the baseline loadout) — verified against the PDF/HTML text, not inferred from title patterns alone.
- [Cascading deselect surprises a user who didn't realize an earlier click invalidated a later one] → The UI change disables the now-invalid section immediately (before the user could add to it further) and the cascade only ever *removes* selections, never adds cost silently; this mirrors how the existing cap enforcement already removes/blocks without a separate confirmation step.

## Open Questions

- None blocking. If, during the faction-by-faction pass, a case is found that doesn't fit the three clause shapes (e.g. genuinely needs a remaining-count check), it will be flagged for a follow-up change rather than forcing it into this model.
