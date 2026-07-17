## Context

`SectionPrerequisite` (`src/domain/types.ts`) already gates whole `UpgradeSection`s on cross-section conditions — `blockedBySelecting`, `requiresOneOfSelected` (an array of other option ids; satisfied if any is selected, optionally also satisfied by baseline equipment), and `requiresBaselineRule`. It's enforced in exactly three places: `isSectionAvailable`/`pruneInvalidSelections` in `src/domain/calc.ts`, `applyToggle`/`validateImported` in `src/stores/lists.ts`, and `isOptionDisabled`/`unavailableReason` in `src/components/EntryUpgradeControls.vue`. Options are authored in terms of printed *labels* (`OptionInput.requiresOneOfSelected: string[]`), and `faction()` (`src/data/factions/helpers.ts`) resolves each label to its option id once every group's options exist — labels can reference an option in a different group, since a unit may draw upgrades from several groups.

"Mounted Only" doesn't fit the *section*-level shape: it's always one option among several in the same section (e.g. `section("Replace Master Sword:", 'one', [Force Sword, "Master Lance (Mounted Only)", Master Mace])`), so gating the whole section would incorrectly disable `Force Sword`/`Master Mace` too. It also isn't "requires this one specific other option" — a unit's "Mount on:" section always offers several different mounts (2–8 depending on the faction), and taking *any one* of them should satisfy the requirement.

The user directed a general option-level mechanism: reuse the exact `requiresOneOfSelected: string[]` shape at the `UpgradeOption` level (not a mount-specific boolean), with every mount-granting option id for a given unit explicitly listed in that array — the same explicit, typed-and-validated-at-load-time authoring style the section-level version already uses, just one level down.

Cross-checked against `one-page-fantasy-army-lists.md`: all 8 "Mounted Only" occurrences map 1:1 to the 8 existing data sites (`empire.ts`, `orcs.ts`, `goblins.ts`, `high-elves.ts`, `dark-elves.ts`, `warriors-of-chaos.ts`, `vampire-counts.ts` ×2) — no orphans either direction. Each affected unit has exactly one `"Mount on:"` section in the *same* upgrade group as its "Mounted Only" option (several factions have multiple `"Mount on:"` sections across different groups/units — e.g. Empire groups A/B/C each have their own — so the mount-id list must be scoped per group, not shared faction-wide).

## Goals / Non-Goals

**Goals:**
- Add a general `UpgradeOption.requiresOneOfSelected` mechanism, structurally identical to the existing section-level field, authored via labels and resolved to ids at `faction()` build time (throwing on an unknown label, same as today).
- Enforce it everywhere `SectionPrerequisite` is already enforced: reject on toggle, cascade-clear on removal, disable in the UI, reject on JSON import.
- Wire all 8 "Mounted Only" options to list every one of their unit's own mount option ids.
- Fix the three sites where "Mounted Only" was mistakenly encoded as a weapon rule token (`rules('Mounted Only')`), which renders as an unresolved `mounted-only` chip since no such glossary entry exists.

**Non-Goals:**
- No `blockedBySelecting`/`requiresBaselineRule`/`satisfiedByEquipment` analogs at the option level — only `requiresOneOfSelected`, since that's the shape this concrete need (and the user's direction) calls for. If a future option-scoped need arises for the other clauses, extend then.
- No changes to the 40k side — it has zero `"Mount on:"` sections, so `requiresOneOfSelected` is simply never populated there.
- No migration script for existing saved lists with a now-invalid "Mounted Only" pick — see Risks.

## Decisions

**`UpgradeOption.requiresOneOfSelected?: string[]`** — an array of other option ids. Satisfied if at least one is present in the unit's selected upgrades. No section-scoping restriction on the referenced ids (an option's requirement can point at ids in a different group, same as the section-level version already allows), though in practice every "Mounted Only" site references its own group's "Mount on:" section.

**Authoring mirrors the section-level pattern exactly**, reusing the same deferred-resolution machinery in `helpers.ts`:
- `OptionInput` gains `requiresOneOfSelected?: string[]` (labels, not ids).
- `option()` stashes the raw label list in a new `pendingOptionPrerequisites: WeakMap<UpgradeOption, string[]>` (parallel to the existing `pendingPrerequisites` WeakMap keyed by section), since option ids for other options may not exist yet at the point a given option is built.
- `faction()`'s existing resolution pass — which already walks every group/section to resolve section-level `pendingPrerequisites` — is extended to also walk each section's options, resolving any pending option-level list via the same `resolveLabels` helper (same "throw on unknown label" behavior, so a typo'd mount label fails at data-load time, not silently).

**`isOptionAvailable` needs no `faction` parameter**, unlike an earlier draft of this design that inferred mount-ness from section titles. Since `requiresOneOfSelected` is pre-resolved to concrete ids at data-build time, checking it is just a set-membership test against `selectedUpgradeIds` — identical in shape to how `isSectionAvailable` already checks the section-level field without needing `faction`:
```ts
export function isOptionAvailable(
  unit: UnitProfile, section: UpgradeSection, option: UpgradeOption, selectedUpgradeIds: string[],
): boolean {
  if (!isSectionAvailable(unit, section, selectedUpgradeIds)) return false
  if (option.requiresOneOfSelected?.length) {
    const selected = new Set(selectedUpgradeIds)
    if (!option.requiresOneOfSelected.some((id) => selected.has(id))) return false
  }
  return true
}
```
`pruneInvalidSelections` (which does need `faction`, to look up each selected id's owning section/option via `findSection`) switches from checking only `isSectionAvailable(unit, owning.section, current)` to `isOptionAvailable(unit, owning.section, option, current)` per selected id, so the existing fixed-point pruning loop naturally cascades: deselecting a mount invalidates any `requiresOneOfSelected` selection that depended on it, on the next pass.

**Store and UI call sites get the same small addition each**, mirroring the existing `isSectionAvailable` checks rather than introducing a parallel code path:
- `applyToggle` (`stores/lists.ts`): replace the existing bare `isSectionAvailable` check with `isOptionAvailable(profile, owning.section, opt, unit.selectedUpgrades)` (looking up `opt` from `owning.section.options`), so both the section- and option-level gates are checked in one call.
- `validateImported` (`stores/lists.ts`): same substitution, throwing the same "prerequisite isn't met" error, now naming the unit and option.
- `isOptionDisabled` (`EntryUpgradeControls.vue`): same substitution in place of the current `isSectionUnavailable(section)` check.

**No new UI messaging text.** Every "Mounted Only" option's `label` already prints the restriction as rulebook flavor text (e.g. `"Heavy Lance (Mounted Only)"`) — the existing disabled-checkbox styling communicates unavailability the same way it already does for capped sections. Adding a second, option-scoped `unavailableReason`-style message is out of scope; the label text already tells the player why.

**Weapon-rule cleanup is a token removal, not a rewrite.** For the 3 sites with a bogus `"Mounted Only"` weapon-rule token (`high-elves.ts`, `warriors-of-chaos.ts`, `vampire-counts.ts`'s "Master Lance" option), the fix strips only `", Mounted Only"` (or `"Mounted Only"` alone) from the `rules('...')` string, dropping the `rules(...)` call/option entirely where nothing real remains. Verified by diffing the full resolved-equipment dump before/after (same technique used in the prior `fantasy-default-weapons` change) to confirm no unrelated stat drift.

## Risks / Trade-offs

- **[Risk] A saved/exported list already has a "Mounted Only" option selected without a mount** (previously legal since unenforced) → **Mitigation**: on JSON import this now correctly throws (matching how the import validator already rejects other now-invalid legacy states for section-level prerequisites); in the live builder it self-heals the next time that unit's selections change, via the existing prune-on-toggle cascade.
- **[Risk] A mount added to a faction's data later isn't added to the corresponding "Mounted Only" option's `requiresOneOfSelected` list** → since this is now explicit, hand-maintained data (per the user's directed approach) rather than auto-inferred, this is a real maintenance point: a reviewer/author adding a new mount option must remember to also add its id/label to any "Mounted Only" option in the same group. **Mitigation**: `faction()` throws at data-load time on any *stale* label reference (a removed/renamed mount), so drift can only manifest as an *under*-inclusive list (new mount silently not accepted as satisfying the requirement) — not a crash, and not a false-positive. Acceptable given how rarely fantasy faction data changes.
- **[Risk] Missing a 9th "Mounted Only" site not caught by the cross-check** → **Mitigation**: cross-checked all 8 data occurrences against all 8 `"Mounted Only"` occurrences in `one-page-fantasy-army-lists.md` by line number and faction section header — exact 1:1 match, no orphans on either side.

## Migration Plan

No runtime data migration. Source-only change (domain types, calc helpers, store checks, one UI check, plus 7 faction data files). Verify with the full test suite plus the same before/after resolved-equipment diff technique used in `fantasy-default-weapons`, scoped to confirm the only changes are the 3 weapon-rule-token removals (everything else — keys, labels, ranges, attacks — must be byte-identical).

## Open Questions

- None outstanding.
