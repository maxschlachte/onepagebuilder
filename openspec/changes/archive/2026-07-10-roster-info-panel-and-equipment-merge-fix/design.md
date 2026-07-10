## Context

**Roster preview.** `RosterUnitPreview.vue` currently wraps its slot content in a `group relative` span and shows an absolutely-positioned panel via `group-hover:block`/`group-focus:block`/`group-focus-within:block` — a CSS-only popover with no visible affordance that hovering does anything, and no equivalent for touch (there's no hover state on a touchscreen, and `:focus-within` only fires if the user happens to tab into the row's "Add" button). `BuilderView.vue` wraps the roster row's name/badges span in this component.

**Equipment merge bug.** Confirmed by reproducing directly: `applyUpgrades` itself is correct — selecting both a plain "Meltagun" (group D, `weapon('meltagun')`) and the "Meltagun (Limited)" attachment (group A, `weapon('meltagun', { rules: rules('Limited') })`) on one list entry produces two distinct `EquipmentEntry` objects, both keyed `"meltagun"`, `unitCount: 1` each, one with `weapon.rules` containing `limited` and one without. The bug is in `combinedEffectiveUnit` (`src/domain/calc.ts`), used whenever two such entries need to be *aggregated for display* across a combined pair or group: its merge loop dedupes purely on `e.key`, so when side A has a plain Meltagun and side B has the Limited one, the result is a single entry — `unitCount: 2`, and only the *first-encountered* side's `rules` (verified by direct reproduction: the merged entry silently drops `limited`). `groupEffectiveUnit` has the identical merge-by-`key` pattern and the same bug, just not yet reported against it.

`EquipmentEntry.key` is documented as "stable identity for upgrade matching (add/remove/replace), independent of the display label" — it is deliberately shared across rule-variants of the same weapon so that a later "replace the Meltagun" option can match it regardless of which variant is currently equipped. That contract is correct and used elsewhere (`applyUpgrades`'s `removeEquipment`/`removeOneEquipment`, prerequisite matching); it should not change. The bug is specifically that the *display-aggregation* merge in `combinedEffectiveUnit`/`groupEffectiveUnit` reuses `.key` alone as its grouping key, which is too coarse for "should these two lines collapse into one" — that decision also needs the attached rules to match.

## Goals / Non-Goals

**Goals:**
- Make the roster preview discoverable and usable without hover: an explicit button, same content, keyboard/touch-friendly.
- Make `combinedEffectiveUnit`/`groupEffectiveUnit` preserve every distinct rule-variant of a merged equipment item as its own entry with its own count, while still correctly summing `unitCount` for entries that really are identical (same key *and* same rules).

**Non-Goals:**
- No change to `applyUpgrades`, `EquipmentEntry.key`'s meaning, or any add/remove/replace/prerequisite matching — all of that already works correctly and keys on `.key` alone deliberately.
- No redesign of `EquipmentList.vue`'s rendering — it already renders one line per array entry; once the merge step stops collapsing distinct variants, it renders correctly with no changes.
- No audit of `removeOneEquipment`'s per-entry decrement behavor when multiple rule-variants share a key (noticed while investigating, not reachable by the reported bug, and not requested — flagged under Risks below as a candidate for separate future scrutiny rather than folded into this fix).

## Decisions

**1. Roster preview: parent-controlled expand/collapse state, `RosterUnitPreview.vue` becomes purely presentational.**
`BuilderView.vue` gets a `expandedRosterIds = ref(new Set<string>())` and a `toggleRosterInfo(unitId)` action. The roster `<li>` becomes two parts: the existing header row (name, badges, an "ⓘ" button *before* "Add", then "Add") and a conditionally-rendered block below it (`v-if="expandedRosterIds.has(unit.id)"`) containing `RosterUnitPreview`'s content. `RosterUnitPreview.vue` drops its `group`/hover wrapper and slot entirely — it becomes a plain component taking `profile`/`faction` and rendering the equipment/rules block directly, mounted only when expanded (so there's no always-in-DOM hidden popover to manage visibility for).
Alternative considered: keep `RosterUnitPreview` as a wrapping component but add a `v-model:expanded` toggle internally, triggered by a slot-provided button. Rejected — parent-owned state is simpler here since `BuilderView` already owns analogous per-row UI state patterns (none currently, but the existing `combineCandidates`/`groupJoinCandidates`-style per-row computations are already read from the parent), and a purely-presentational child avoids the component needing to both render content and manage its own visibility/keyboard semantics.
The info button toggles independent of "Add" — clicking "Add" does not expand or collapse the panel, and expanding the panel does not add the unit.

**2. Equipment merge groups by `(key, rules signature)`, not `key` alone.**
Add a small helper in `src/domain/calc.ts`:
```ts
function equipmentMergeKey(e: EquipmentEntry): string {
  const rules = e.weapon?.rules ?? e.rules ?? []
  const sig = [...rules].map((r) => r.ruleId).sort().join(',')
  return `${e.key}|${sig}`
}
```
`combinedEffectiveUnit` and `groupEffectiveUnit`'s merge loops use `equipmentMergeKey(e)` in place of `e.key` for the `seenKeys`/grouping logic, and when summing `unitCount` across sides, match by the same composite key rather than `e.key`. Two entries with the same `key` but different rule sets (Limited vs not) now produce two separate output entries, each with its own summed `unitCount` (1 if only one side has that variant); two entries that are truly identical (same key, same rules, same weapon) still merge into one with a summed count exactly as today.
Alternative considered: change `EquipmentEntry.key` itself to already encode rules (e.g. append `-limited`). Rejected — `.key` is deliberately rule-independent for add/remove/replace matching (design.md rationale already established when the equipment model was introduced); overloading it to also serve as a display-merge key would risk breaking a "replace the Meltagun regardless of variant" style option, and would require touching every faction file's `removeEquipment`/`removeOneEquipment` targets. Scoping the fix to the two display-only merge functions is the minimal correct change.
Alternative considered: sort rules by full `RuleRef` (including `param`/`note`) rather than just `ruleId`. Rejected as unnecessary for the reported case (weapon-attached rules on these entries are plain rule ids, no parameters); scoping to `ruleId` keeps the signature simple and matches how the rest of the merge logic already treats rules as an unordered set (see `combinedEffectiveUnit`'s existing special-rules dedup, which also compares by `ruleId` alone).

## Risks / Trade-offs

- **[Risk]** `removeOneEquipment`'s decrement loop (`applyUpgrades`) independently decrements *every* entry matching a target key by one, which — if a unit ever had two rule-variants sharing a key *before* a later "replace one" option is applied — could decrement both instead of just one. Not reachable by the bug as reported (that unit never reaches a state where two same-key variants coexist *and* a further per-key removal is applied), and no current faction data exercises it. → **Mitigation**: not fixed here (would be speculative rework beyond what's confirmed broken); flagged so a future audit test (in the style of `melee-weapon-audit`) can check whether any faction data path actually reaches this shape.
- **[Risk]** Any other code reading `EquipmentEntry.key` and assuming "one entry per key" within a *single* (non-combined, non-group) unit's equipment array could be affected if such an assumption exists elsewhere. → **Mitigation**: `applyUpgrades` itself never merges by key (it only ever appends), so a single unit's equipment array can already contain same-key, different-rule entries today (confirmed by direct reproduction) — this fix only touches the two functions that *do* merge, bringing them in line with behavior `applyUpgrades` and `EquipmentList.vue` already handle correctly.
- **[Trade-off]** Info-button roster preview takes one extra click compared to hover, but is the only option that works uniformly across mouse, keyboard, and touch, and gives the row a visible affordance instead of a hidden hover behavior.

## Migration Plan

Additive/corrective only. No persisted-list shape change, no faction-data change. As with the prior change, this proposal's `army-list-management` delta modifies a requirement that also has a pending, not-yet-archived group-deployment addition in `builder-roster-preview-and-army-rules` — recommend archiving that change first (or together), same as before.

## Open Questions

(none)
