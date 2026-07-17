## Context

`affectsAllModels(section: UpgradeSection): boolean` (`src/domain/calc.ts`) is the single predicate every combine-related consumer keys off: `wholeUnitOptionIds(faction)`, `combineUnits`'s union-onto-both-entries step and `toggleUpgrade`'s dual-write for a combined pair (both `src/stores/lists.ts`), and `EntryUpgradeControls.vue`'s `filter="whole"` / `filter="perModel"` panel split. It's currently a pure title-substring check (`/\ball\b/i.test(section.title)`), established by `fix-combined-unit-whole-upgrade-scope`'s design, on the finding that "the rulebook consistently marks true whole-unit sections with the word 'all' in the title" and "no section mixes whole-unit and per-model options under one title."

That finding no longer holds. Warhammer Fantasy's "Common Upgrades" grants — Sergeant, Musician, Standard — are printed under the heading `"Upgrade with:"` in every one of the 16 faction files (`one-page-fantasy-army-lists.md`, e.g. line 100: `F   Upgrade with:` / `Sergeant +5pts` / `Musician +10pts` / `Standard +10pts`), and per `one-page-fantasy-rules.md`'s "Common Upgrades" section, each of these is capped at one grant per unit regardless of model count ("Sergeant: One model gets +1 melee attack"). But `"Upgrade with:"` is not a whole-unit-exclusive heading — the same literal title is reused 72 times across the 16 fantasy faction files for ordinary per-model gear/weapon sections (e.g. Skaven's Flayer Gauntlets, Beastmen's mount trinkets), so the title text carries no signal distinguishing the 16 Sergeant/Musician/Standard sections from the other 56+ same-titled sections. Retitling the 16 sections to include "all" would misrepresent the printed source (the rules-data spec requires "no value originates from any other source" than the game's own rulebook text), and would be factually wrong besides — Sergeant literally affects one model, not all of them; its "whole-unit" scope comes from the "one per unit" print-cap, not from a "this applies to every model" effect.

## Goals / Non-Goals

**Goals:**
- Give `affectsAllModels` a second, independent signal for "this section's options are capped at one grant per unit" that doesn't depend on section-title wording, alongside its existing title-derived signal — both routes converge on the same whole-unit selection-mirroring treatment for every downstream consumer, with no call-site changes needed beyond the predicate itself.
- Ensure a combined pair is charged for a `oncePerUnit` option exactly once, regardless of whether it's mirrored on both linked entries' `selectedUpgrades` or only ever selected on one.
- Apply it to exactly the 16 Sergeant/Musician/Standard sections, with no other faction-data reclassification.
- Preserve the existing all-model title heuristic exactly as-is for the 137+ sections it already correctly classifies.

**Non-Goals:**
- Not touching `toggleUpgrade`'s dual-write or `EntryUpgradeControls.vue`'s panel split — both already do the right thing (mirror the selection onto both linked entries) once a section is correctly classified as whole-unit; classification is the only change needed at that layer, matching the precedent's own decision to keep `affectsAllModels` as the single source of truth for every selection-state consumer.
- Not preventing a `oncePerUnit` option from being mirrored onto both linked entries' `selectedUpgrades` while combined — this is deliberately kept identical to how any other whole-unit option already behaves (see Decision 1's rationale for why this is actually correct here, not just reused for convenience).
- Not generalizing to a fully generic "authoring-time scope flag on every section" — the title heuristic remains primary; the new flag is an escape hatch for the one printed-heading collision found (Sergeant/Musician/Standard), not a replacement authoring convention. A future genuinely-whole-unit section with an "all"-containing title still needs no flag.
- Not changing what "combine" means for group-deployment units (Conclave/Warband/etc. — a separate mechanism, `groupEffectiveUnit`) — no Warhammer Fantasy faction uses it, so it's out of scope regardless.

## Decisions

**1. Add an explicit `oncePerUnit?: boolean` field to `UpgradeSection`/`SectionInput`, and OR it into `affectsAllModels`.**

```ts
// domain/types.ts
export interface UpgradeSection {
  title: string
  selection: UpgradeSelection
  options: UpgradeOption[]
  prerequisite?: SectionPrerequisite
  /**
   * True when this section's options are capped at one grant per unit
   * regardless of model count, even though the section's own printed title
   * doesn't say "all" (e.g. Warhammer Fantasy's Sergeant/Musician/Standard
   * "Upgrade with:" sections) — an explicit escape hatch for the rare case
   * where affectsAllModels' title heuristic can't distinguish this section
   * from another, per-model section sharing the identical printed heading.
   */
  oncePerUnit?: boolean
}
```

```ts
// domain/calc.ts
export function affectsAllModels(section: UpgradeSection): boolean {
  return section.oncePerUnit === true || /\ball\b/i.test(section.title)
}
```

This is the same alternative `fix-combined-unit-whole-upgrade-scope`'s design considered and rejected — but that rejection was explicitly conditioned on "pure duplication of information already unambiguously present in `section.title`," which was true of the 137-section survey at the time and is false now: `"Upgrade with:"` alone cannot distinguish a Sergeant section from an ordinary per-model one. The flag is additive (title-only classification is untouched for every section that doesn't set it), so no existing section's classification changes.

Folding `oncePerUnit` into `affectsAllModels` (rather than a separate predicate) is deliberate, not just convenient: mirroring a Sergeant/Musician/Standard selection onto *both* linked entries while combined — exactly what `affectsAllModels` inclusion already causes via `wholeUnitOptionIds`/`combineUnits`/`toggleUpgrade`, with zero changes to any of the three — is the *correct* behavior here, not an approximation. If entry A already had Sergeant selected and it's combined with entry B (which didn't), the resulting 10-model unit has exactly one Sergeant; mirroring the selection makes the pair's shared state consistently "has a Sergeant" on both linked entries, and if the pair is later split back into two independent 5-model units, each is once again its own standalone unit and correctly keeps (and is charged for) its own copy — precisely how a real whole-unit option like "Replace all Assault Rifles" already round-trips through combine/split today. The only place mirroring alone gets the *wrong* answer is cost while still combined, addressed by Decision 3.

Alternative considered: retitle the 16 sections to something containing "all" (e.g. `"Upgrade all models with one of:"`). Rejected — it's not what the rulebook prints (breaks the "no value originates from any other source" sourcing rule other rules-data requirements already hold every faction-data field to), and it's semantically wrong: Sergeant grants +1 attack to *one* model, not all of them; the section's whole-unit scope is a *selection cap*, not a per-model effect.

Alternative considered: special-case by option label (`option.label === 'Sergeant' || ...`) inside `affectsAllModels` or a sibling predicate. Rejected — implicit string-matching against specific label text is more fragile than an explicit authored flag (a future faction reusing "Sergeant" for an unrelated single-model grant would silently misclassify), and doesn't self-document at the authoring site the way `oncePerUnit: true` does next to the section it describes.

**2. `section()`'s trailing parameters become an options bag.**

Today: `section(title, selection, options, prerequisite?: SectionPrerequisiteInput)`, with `prerequisite` passed positionally at 6 call sites across the 16 fantasy files. Adding `oncePerUnit` as a 5th positional parameter would force every Sergeant/Musician/Standard call site (which never needs a prerequisite) to pass `undefined` for parameter 4 just to reach parameter 5 — noisy and easy to typo. Instead:

```ts
export function section(
  title: string,
  selection: UpgradeSelection,
  options: OptionInput[],
  opts?: { prerequisite?: SectionPrerequisiteInput; oncePerUnit?: boolean },
): SectionInput {
  return { title, selection, options, prerequisite: opts?.prerequisite, oncePerUnit: opts?.oncePerUnit }
}
```

The 6 existing call sites that currently pass a bare `SectionPrerequisiteInput` as the 4th argument (e.g. `section("Upgrade Wizard(1):", 'any', [...], { requiresBaselineRule: ["Wizard(1)"] })`) are updated to wrap it: `section("Upgrade Wizard(1):", 'any', [...], { prerequisite: { requiresBaselineRule: ["Wizard(1)"] } })`. `group()`'s section-building loop copies `s.oncePerUnit` onto the built `UpgradeSection` alongside its existing `title`/`selection`/`options` copy (omitted when falsy, matching the codebase's existing convention for optional fields).

Alternative considered: a separate `onceSection(title, options)` builder returning `{ ...section(...), oncePerUnit: true }`. Rejected — introduces a second entry point for what's a one-field variation of the same concept, and doesn't compose with a hypothetical future section that needs both a prerequisite and `oncePerUnit` (none exists today, but the options-bag shape doesn't foreclose it).

**3. `combinedEffectiveUnit` subtracts the double-counted cost of `oncePerUnit` options that are mirrored on both entries.**

Decision 1 makes Sergeant/Musician/Standard mirror onto *both* linked entries' `selectedUpgrades`, exactly like "Replace all Assault Rifles" already does. For "Replace all Assault Rifles" that's correct: each entry's own `applyUpgrades(...).cost` legitimately includes the option's `costDelta` once per entry, because each entry's own half of the merged unit actually has its rifles replaced — twice the material, twice the cost, and `combinedEffectiveUnit`'s existing `cost: a.cost + b.cost` (`calc.ts:155-182`) correctly sums that. For Sergeant, the printed cost (`+5pts`) is a single flat price for the whole unit regardless of size — mirroring the *selection* is still correct (Decision 1's rationale), but summing `a.cost + b.cost` naively double-charges it, since both entries' own `applyUpgrades` calls independently add `+5pts`.

`EffectiveUnit` gains a `selectedUpgradeIds: string[]` field (`domain/types.ts`), populated by `applyUpgrades` alongside its existing `upgradeLabels.push(option.label)` line. A new `oncePerUnitOptionIds(faction): Set<string>` (`calc.ts`), parallel in shape to `wholeUnitOptionIds` but filtered to `section.oncePerUnit === true` sections only, identifies which option ids this applies to. `combinedEffectiveUnit` gains a third `faction: Faction` parameter and computes:

```ts
const onceIds = oncePerUnitOptionIds(faction)
const doubleCounted = a.selectedUpgradeIds.filter((id) => onceIds.has(id) && b.selectedUpgradeIds.includes(id))
const overcharge = doubleCounted.reduce((sum, id) => sum + (optionCostDelta(faction, id) ?? 0), 0)
// cost: a.cost + b.cost - overcharge
```

(`optionCostDelta` is a one-line lookup through the same `optionIndex(faction)` map `applyUpgrades` already builds.) Both call sites (`PrintView.vue`, `BuilderView.vue`) already have `faction` in scope — they compute `effA`/`effB` via `applyUpgrades(unit, selectedUpgrades, faction)` immediately before calling `combinedEffectiveUnit`.

Alternative considered: instead of mirroring the selection and subtracting the overcharge afterward, keep the option on exactly one of the two linked entries at combine/toggle time (a genuinely separate "single-slot" write path in `combineUnits`/`toggleUpgrade`, never touching the other entry's `selectedUpgrades` at all). Rejected — it requires bespoke selection-state surgery in `lists.ts` (tracking which of the two entries "owns" the option, handling toggles from either side, handling combine-time collapse) for a problem `combinedEffectiveUnit` can solve in one arithmetic step reusing 100% of the existing mirror/toggle/split machinery unchanged; it would also silently misrepresent the pair's own selection state (the non-owning entry would show Sergeant as *not* selected even though the pair "has" one), which Decision 1's mirroring approach avoids by construction.

**4. `combinedEffectiveUnit`'s equipment-merge step caps a `oncePerUnit` option's merged `unitCount` at the single-entry value, instead of summing it like ordinary equipment.**

Decision 3 only corrected the `cost` field — but `combinedEffectiveUnit`'s equipment-merging loop (`calc.ts:176-187`) has the identical double-counting problem, independently: it walks `[...a.equipment, ...b.equipment]`, and for every pair of entries sharing an `equipmentMergeKey`, sums `unitCount` from both sides (`countA + countB`). Sergeant's `gear("Sergeant", ...)` entry is mirrored onto both linked entries' equipment (since the option is mirrored per Decision 1), each contributing `unitCount: 1` (the default for a non-whole-unit-swap `addEquipment`), so the merged entry reports `unitCount: 2` — the equipment list shows "2x Sergeant," implying two Sergeant models exist, which the rulebook doesn't allow and which Decision 3's cost fix alone doesn't touch (`cost` and `equipment` are computed independently in `combinedEffectiveUnit`).

The fix reuses Decision 3's `doubleCounted` option-id list: for each double-counted `oncePerUnit` option id, resolve its `effects.addEquipment` entries' merge keys via the same `equipmentMergeKey` helper the merge loop already uses, and collect them into a `Set<string>`. When merging an equipment entry whose merge key is in that set, use `Math.max(countA, countB)` instead of `countA + countB` — correct because a genuinely double-selected `oncePerUnit` option always contributes the identical `unitCount` (1) from both sides, so the max collapses two duplicate counts into one, while the pre-existing asymmetric case (only one entry selected it) is already correct under either formula, since one side's count is 0.

```ts
const onceEquipmentKeys = new Set(
  doubleCounted.flatMap((id) => options.get(id)?.effects?.addEquipment?.map(equipmentMergeKey) ?? []),
)
// inside the existing merge loop, per entry:
const unitCount = onceEquipmentKeys.has(mergeKey) ? Math.max(countA, countB) : countA + countB
```

Alternative considered: special-case by equipment `key`/`label` matching `Sergeant`/`Musician`/`Standard` directly in the merge loop. Rejected for the same reason Decision 1 rejected label-matching for classification — it doesn't generalize to any future `oncePerUnit` option and doesn't self-document via the data the way routing through `oncePerUnitOptionIds`/`doubleCounted` does.

**5. Superseding Decisions 1/3/4's mirror-and-correct approach: `combineUnits`/`toggleUpgrade` now store a `oncePerUnit` option on exactly one linked entry, never both.**

Decision 1's mirroring rationale rested on an analogy to a genuine whole-unit option ("Replace all Assault Rifles"): splitting a combined pair should leave each half with its own full-price copy, "precisely how [that option] already round-trips through combine/split today." That analogy is false for Sergeant/Musician/Standard. A "Replace all Assault Rifles" selection is genuinely duplicated across both entries — each half's own rifles really were replaced, so each half keeps its own real copy after splitting. A `oncePerUnit` option represents exactly one grant to the *combined* unit as a whole; there is nothing to duplicate. Testing the actual split flow (not covered by Decisions 3/4's tests, which only checked the *combined* pair's cost/equipment) confirms the bug this false analogy produces: split a pair with Sergeant selected, and — under the mirrored-selection design — **both** resulting independent units keep Sergeant, each now charged for it individually, when only one ever should.

Rather than patch this with yet another split-time correction (the third layer of "mirror, then fix up the display" after Decisions 3 and 4), the fix goes to the root: `oncePerUnit` options stop being mirrored at all.

- **`combineUnits`** (`lists.ts`): still unions genuine whole-unit (`affectsAllModels` minus `oncePerUnit`) options onto both entries exactly as before. For `oncePerUnit` ids, if selected on *either* entry pre-combine (including the double-selected case Decision 3 was written to correct), the result is written onto entry `a` only — never `b`.
- **`toggleUpgrade`** (`lists.ts`): for a combined pair and a `oncePerUnit` option, selecting adds it to whichever entry the toggle was actually invoked on (in practice always the pair's primary/"whole-unit panel" entry, `a`, per `EntryUpgradeControls.vue`'s existing binding — unchanged by this decision); deselecting removes it from *both* entries unconditionally (a no-op wherever it isn't present), so it's always fully cleared regardless of which entry happens to hold it.
- **Splitting** (`splitUnits`) needed no code change at all: since the option now lives on only one entry pre-split, simply clearing `combinedWith` on both sides — its existing, unmodified behavior — already leaves the grant on exactly the one entry that held it.

Decisions 3 and 4's `combinedEffectiveUnit` corrections (`oncePerUnitOptionIds`, the cost overcharge subtraction, the equipment `Math.max` cap) are **kept, not removed**: with single-slot writes, no *newly created* selection can ever land on both entries, so these corrections become defensive no-ops for fresh data going forward — but they still correctly display any already-saved list whose combined pair predates this fix and still has the option recorded on both sides (until the user next splits and re-combines, or re-toggles it), rather than requiring a data migration.

This is the same alternative Decision 3 originally considered and rejected, on the grounds that it "requires bespoke selection-state surgery… for a problem `combinedEffectiveUnit` can solve in one arithmetic step." That rejection's stated problem — cost being double-counted — is real and `combinedEffectiveUnit` genuinely does solve it in one step. But it wasn't the *only* problem: the mirrored selection state itself is observably wrong the moment a pair with a mirrored `oncePerUnit` option splits, which no amount of display-layer correction in `combinedEffectiveUnit` can fix, because by the time `splitUnits` runs there is no "combined pair" left to compute a corrected view of — each entry is independently its own `EffectiveUnit` again, cost included at face value. The rejection's other objection — that single-slot storage "would silently misrepresent the pair's own selection state (the non-owning entry would show Sergeant as *not* selected)" — doesn't actually apply, since the pair's single whole-unit-panel checkbox is (and always was) bound only to entry `a`, which is exactly the entry the single-slot write always populates.

## Risks / Trade-offs

- **[Risk]** A user with an already-saved list containing a combined pair where both linked entries independently hold a Sergeant/Musician/Standard selection (a state the app allowed until this fix, since the option was per-model until now) sees the pair's cost drop by one option's worth the moment this ships — `combinedEffectiveUnit` is a pure computed function over current state, so the corrected (lower) cost applies on the very next render, not gated behind an explicit combine/toggle action. → **Mitigation**: the corrected cost is the cost the rulebook actually charges (one Sergeant per unit, not two); this is a one-time, one-directional correction (only ever reduces a previously-overcharged total, never invents a new charge), consistent with `fix-combined-unit-whole-upgrade-scope`'s own precedent of accepting this class of retroactive correction for a previously-miscategorized option. An asymmetric pair (only one linked entry holds the selection) is unaffected either way, since `combinedEffectiveUnit`'s subtraction only fires when both entries independently hold the same `oncePerUnit` option id.
- **[Risk]** `section()`'s signature change (positional `prerequisite` → options-bag) is a breaking change to any caller not updated in this same commit. → **Mitigation**: `section()` is only called from the 16 faction data files in this repo (confirmed by grep); all 6 affected call sites are updated in the same change, and `vue-tsc --noEmit` catches any missed site immediately (the old 4th-argument shape, a bare object with `requiresOneOfSelected`/etc., does not structurally satisfy the new `{ prerequisite?; oncePerUnit? }` opts-bag type).
- **[Risk]** A user with an already-saved list containing a combined pair with the option mirrored on both entries (from before Decision 5) still gets duplicated equipment on their next *split*, exactly the bug Decision 5 fixes — but only for lists that predate this change and haven't been re-toggled/re-combined since. → **Mitigation**: same one-time, one-directional class of correction as the cost risk above; the moment the user touches that option again (toggling it off then on, or splitting and recombining), the new single-slot logic takes over and self-heals the stored state. No migration script is warranted for a display-only, self-correcting inconsistency in existing data.

## Migration Plan

Additive/corrective only — no persisted-list shape change (`ListUnit.selectedUpgrades` stays `string[]`), no faction-schema migration. Existing saved lists continue to load; the user-visible changes (cost correction, and — per Decision 5 — correct single-entry storage going forward) apply automatically wherever they're relevant, not via a migration step.

## Open Questions

None — the printed source (`one-page-fantasy-rules.md`'s "Common Upgrades" section, `one-page-fantasy-army-lists.md`'s per-faction "Upgrade with:" rows) and the existing `affectsAllModels`/`wholeUnitOptionIds`/`combineUnits` call graph were confirmed directly before writing this design.
