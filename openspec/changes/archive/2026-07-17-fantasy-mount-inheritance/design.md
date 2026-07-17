## Context

`one-page-fantasy-rules.md` line 178: **"Mounts: Units that are mounted use any equipment and special rules from their mount as if they were their own, and they add Tough values together."**

Today, `applyUpgrades()` (`src/domain/calc.ts:407-457`) builds a unit's effective `specialRules` from only two sources: the unit's own baseline `unit.specialRules`, and any selected option's `effects.addRules` (the authored `adds: [...]` tokens). It never reads `EquipmentEntry.rules` — the rules attached to a `gear(...)` call — so a mount's Fast/Nimble/Flying/Tough/etc. (added by `fantasy-upgrade-equipment-fixes` as `gear("Warhorse", { rules: [...] })`) are only ever visible inline next to that equipment entry (`PrintUnitStats.vue:106`), never merged into the unit's own "Special Rules:" line (`PrintUnitStats.vue:112`, fed by `EffectiveUnit.specialRules`).

Separately, duplicate same-`ruleId` rules are already collapsed by `mergeRuleGroup`/`mergeParameterizedRules` (`calc.ts:359-401`): two absolute-valued rules of the same id keep the higher value; an absolute value plus one or more `+N` additive bonuses sum the bonuses onto the absolute value. Neither path sums two *absolute* values together — that's a documented, deliberate choice for the general case (design.md of `merge-parameterized-rule-upgrades`), but the Mounts rule explicitly calls for exactly that, for `Tough` only, when the second value comes from a mount.

## Goals / Non-Goals

**Goals:**
- Mark mount-granting equipment so the "as if they were their own" inheritance can be scoped to mounts specifically, not every non-weapon `gear()` grant (Sergeant/Musician/Standard/Fiery Breath/etc. must NOT be promoted to unit-wide special rules — this is deliberate today, per `EntryUpgradeControls.vue`'s existing gear-rule display design).
- A selected mount's rules appear in the unit's own effective `specialRules`, automatically flowing through to both the builder and the print view.
- `Tough` specifically sums between the unit's own value and its mount's, rather than keeping only the higher one.

**Non-Goals:**
- Not changing what's displayed in the equipment list itself — the mount's own equipment-line rule chips stay exactly as they render today (explicit user instruction: "keep the equipment entry too for now"). A `Tough(N)`/`Fast`/etc. will now visibly appear twice (once on the equipment line, once in the unit's special-rules summary) — an accepted, temporary redundancy, not something this change resolves.
- Not enforcing "only one mount may be selected" — `one-page-fantasy-army-lists.md`'s "Mount on:" sections are already authored as `'any'`-selection (not `'one'`), and the rulebook text doesn't state a one-mount cap. If more than one mount is ever selected (not something any current section actually constrains against), all their rules — including `Tough` — sum together, which is a reasonable, consistent generalization of "add Tough values together" rather than a special case to guard against.
- Not touching the Heroes/Wizards "have the Nimble special rule (not when Mounted)" clause a few lines above the Mounts rule in the same source document (`one-page-fantasy-rules.md:161`) — a separate baseline-rule mechanic (an unmounted hero's own innate Nimble) that isn't part of what the user asked for and isn't touched by this change.
- Not touching 40k faction data or computation — Mounts is an Age of Fantasy-only rule; no 40k mechanic depends on this.

## Decisions

**Marking mechanism: `EquipmentEntry.isMount?: boolean`, set via `gear()`'s new `mount?: boolean` option.** Adding the flag directly to the type (rather than inferring "is this a mount" positionally, e.g. "last gear entry in a `Mount on:`-titled section") is more robust and self-documenting, and costs one line per site to set explicitly. A structural/positional survey (done during this proposal's research) confirms every real "Mount on:" option's `addEquipment` array already ends with exactly one `gear("<Mount>", {...})` call, so a positional rule was considered viable — but an explicit flag doesn't depend on section-title string matching at merge time in `calc.ts`, and self-documents intent at the authoring site the same way `EquipmentOpts.rules`/`label`/`key` already do.

**Where the merge happens: inside `applyUpgrades`, after the existing effect-application loop, before the final `mergeParameterizedRules(specialRules)` call.** At that point `equipment` already reflects every add/remove/replace from the full selection, so `equipment.filter(e => e.isMount)` reliably finds exactly the mount(s) actually selected (none, if no mount option was chosen). Concretely (replacing the `return` statement at `calc.ts:456`):

```ts
const mountRules = equipment.filter((e) => e.isMount).flatMap((e) => e.rules ?? [])
if (mountRules.length) {
  const isAbsoluteTough = (r: RuleRef) => r.ruleId === 'tough' && typeof r.param === 'number'
  const toughFromMounts = mountRules.filter(isAbsoluteTough)
  specialRules = [...specialRules, ...mountRules.filter((r) => !isAbsoluteTough(r))]
  if (toughFromMounts.length) {
    const mountSum = toughFromMounts.reduce((sum, r) => sum + (r.param as number), 0)
    const base = specialRules.filter(isAbsoluteTough).reduce((max, r) => Math.max(max, r.param as number), 0)
    specialRules = [...specialRules.filter((r) => !isAbsoluteTough(r)), { ruleId: 'tough', param: base + mountSum }]
  }
}
return { profile: unit, equipment, specialRules: mergeParameterizedRules(specialRules), upgradeLabels, cost }
```

This composes cleanly with the existing `mergeRuleGroup`: any `Tough(+N)` additive-bonus entries (from ordinary, non-mount upgrades) are left untouched by the code above (the `isAbsoluteTough` filter only matches numeric-`param` entries) and are still summed onto the new combined absolute value by the pre-existing `mergeParameterizedRules` call that follows — so `baseline Tough(3)` + a `Tough(+3)` upgrade + a mount's `Tough(6)` correctly resolves to `Tough(12)` (3 base + 6 mount = 9 combined absolute, then +3 additive = 12), not by growing `mergeRuleGroup` itself with a mount-aware special case that the rest of the codebase (`combinedEffectiveUnit`/`groupEffectiveUnit`, which do their own separate, simpler same-ruleId dedup for cross-unit combining) doesn't need to know about.

**Only the `gear()` entry's rules are folded in, not the mount's weapon's rules.** A mount's weapon (e.g. `Light Claws`) already becomes one of the unit's own weapons the normal way (any `EquipmentEntry` with a `.weapon` already fights as part of the unit) — its own rules (e.g. `Piercing` on `Master Claws`) stay correctly scoped to that weapon, exactly like every other weapon on the unit; only the mount's *named special-rules grant* (its `gear()` entry, e.g. `Fast`, `Nimble`, `Tough(N)`) is what the rulebook means by "special rules from their mount," and is what gets marked and folded.

## Risks / Trade-offs

- **Visible duplication**: a mounted unit's Fast/Nimble/etc. now show both inline on the equipment line and in the special-rules summary. Accepted per explicit user instruction; a follow-up change could later suppress the inline duplicate now that the info is elevated, but that's out of scope here.
- **Multiple mounts selected at once**: not guarded against (see Non-Goals) — if it ever happens, rules and `Tough` from every selected mount all sum together, consistent with the stated rule generalized.
- **A future rule other than `Tough` that also needs summing** (none currently known) would need its own explicit carve-out the same way `Tough` gets one here — deliberately not building a generic "summable rules" list for a case that doesn't exist yet, mirroring `mergeRuleGroup`'s existing "don't grow merge logic for an unreachable case" precedent.

## Migration Plan

Not applicable — static data plus pure-function domain-logic change, no persisted schema, no runtime migration.

## Open Questions

None — the rule text, the merge precedent, and the exact code site were all confirmed directly against the source rulebook and the current `calc.ts` implementation before writing this design.
