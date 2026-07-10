## Context

`applyUpgrades` (`src/domain/calc.ts`) already folds `UpgradeOption.effects.addEquipment`/`removeEquipment` into the unit's effective equipment list, and `EquipmentList.vue` already renders that list with weapon profiles in brackets and rule chips (`RuleChips` → `RuleTooltip`) for special abilities — tooltips included. Both are exercised today only through hand-written tests, because no faction data file actually sets `addEquipment`/`removeEquipment` on any of the ~730 upgrade options across the 16 factions. The display and domain-logic plumbing are correct; the data simply never drives them, so every unit's "Equipment:" list is frozen at its baseline loadout regardless of what's selected.

The complicating factor is that a printed "Replace one X" (or "up to N") section is ambiguous for a multi-model unit: replacing *one* copy of X still leaves the other models carrying X. The data model has no per-model loadout tracking (equipment is one flat list per unit, matching how the rulebook prints it), so a literal full swap is only correct when the unit has exactly one model *and* exactly one copy of the weapon being replaced.

## Goals / Non-Goals

**Goals:**
- Make selecting a weapon-swapping upgrade option change what's shown in the unit's effective equipment list, for both the builder and the print view (both already consume `eff.equipment`/`applyUpgrades`).
- Keep the fix data-driven and consistent with the existing `blockedBySelectingOnSingleModel` precedent: a small, size-aware effect field plus a faction-by-faction authoring pass, not a redesign of the equipment model.

**Non-Goals:**
- Per-model loadout tracking (which specific model in a 10-model unit carries the swapped weapon). The rulebook itself doesn't track this either — it prints a unit's equipment as one list.
- Modeling "replace up to two Light Powerfists" (Deff Dred: a *single-model* unit that nonetheless carries 4 copies of one weapon) as a precise partial removal. Single-model-ness is a proxy for "exactly one copy," which breaks for multi-copy-on-one-model units; see Risks.
- Any change to `EquipmentList.vue`, `RuleChips.vue`, `RuleTooltip.vue`, or print view — they're already correct.

## Decisions

**Add `removeEquipmentOnSingleModel?: string[]` to `UpgradeEffect`, applied only when `unit.size === 1`.**

```ts
export interface UpgradeEffect {
  addRules?: RuleRef[]
  removeRules?: string[]
  addEquipment?: EquipmentEntry[]
  removeEquipment?: string[]
  /** Same as removeEquipment, but only applied when the unit has exactly one
   * model (a partial "replace one/up to N" swap that would be wrong to apply
   * in full on a unit where other models still carry the replaced item). */
  removeEquipmentOnSingleModel?: string[]
}
```

`applyUpgrades` becomes:

```ts
if (effects.removeEquipment) {
  const remove = new Set(effects.removeEquipment)
  equipment = equipment.filter((e) => !remove.has(e.label))
}
if (unit.size === 1 && effects.removeEquipmentOnSingleModel) {
  const remove = new Set(effects.removeEquipmentOnSingleModel)
  equipment = equipment.filter((e) => !remove.has(e.label))
}
if (effects.addEquipment) equipment = [...equipment, ...effects.addEquipment]
```

**Authoring rule for the faction-by-faction pass**, applied per section:

- **"Replace all X" / "Replace X"** (unconditional, unambiguous — every model's X is gone): `removeEquipment: [<X's baseline label>]`, `addEquipment: [<option's own label>]`.
- **"Replace one X" / "Replace up to N X" where the unit's baseline has exactly one total copy of X** (i.e. a single-model unit and the baseline entry has no `Nx` count prefix): `removeEquipmentOnSingleModel: [<X's baseline label>]`, `addEquipment: [<option's own label>]`. On any multi-model unit sharing the same group/section, the removal is skipped automatically (size check) and only the addition applies — correctly leaving the group's baseline entry in place alongside the new item.
- **"Replace one X" / "Replace up to N X" where even a single-model unit carries multiple copies of X** (e.g. Deff Dred's `4x Light Powerfists`): `addEquipment` only, no removal — matches the multi-model case's "just add" behavior since a literal full swap would be wrong here too. Called out per-option in the task list, not automated.
- **Pure additions** ("Take one/any/up to N", "Equip with", pintle/sponson mounts): `addEquipment` only.
- **Options that only add a special rule** (e.g. `'Eavy Armor (Armored)`, `Warbike (Fast, Linked Carbine)` where the parenthetical is descriptive flavor already captured via `adds: ['Fast']`) are audited case-by-case: only options whose *rulebook entry itself represents picking up a distinct weapon* get equipment effects — pure rule-grants are left as-is. Where an option both changes special rules and equipment (e.g. a bike mount that grants `Fast` and swaps in a `Linked Carbine`), both `adds` and `addEquipment`/`removeEquipmentOnSingleModel` are set.

Matching is by exact `EquipmentEntry.label` string, consistent with the existing `removeEquipment`/`satisfiedByEquipment` mechanisms — including the quirk that a baseline entry like `4x Light Powerfists` keeps its `Nx ` prefix as part of `.label` (`eqEntry` only strips the prefix for weapon-name *lookup*, not for the stored label), so any `removeEquipment*` reference to it must include the prefix verbatim.

Alternatives considered:
- **Always removeEquipment unconditionally, ignore multi-model nuance.** Rejected: would make a 10-model Boyz unit's equipment list show only "Carbine" after one model swaps its pistol, incorrectly implying all 10 did.
- **Track per-entry counts and decrement on partial replace (e.g. `9x Pistols, 1x Carbine`).** Rejected as disproportionate: the rulebook's own printed equipment lists don't carry model-level counts for common gear (only for naturally multi-weapon models like the Deff Dred), and no other part of the app consumes such granularity. `removeEquipmentOnSingleModel` gets the common case (single-model swap) exactly right and degrades to "list both" for the multi-model and multi-copy-single-model cases, which is honest rather than misleadingly precise.

## Risks / Trade-offs

- [A multi-model unit's equipment list grows additively rather than showing an accurate "N carry X, M carry Y" split] → Accepted per Non-Goals; this matches the rulebook's own level of detail and is a strict improvement over today (which shows nothing changed at all).
- [Deff Dred-style single-model-multi-copy units aren't auto-covered by the single-model heuristic] → Mitigated by explicit per-option authoring judgment (documented above) rather than blind automation; flagged as its own task item during the audit so it isn't silently mishandled.
- [Faction audit is large (~730 options) and manual misclassification is possible] → Mitigated by a structural test asserting every `removeEquipment`/`removeEquipmentOnSingleModel` label resolves to a real baseline (or previously added) equipment label reachable by some unit in the option's group, so a typo'd label fails at test time instead of silently no-oping; plus spot-checking a representative unit per faction in the running builder.
