## Context

Today a `ListUnit` (`src/domain/list.ts`) is a fully independent entry: a stable `instanceId`, a `unitId` (the `UnitProfile` it references), and its own `selectedUpgrades: string[]`. `applyUpgrades(profile, selectedUpgrades, faction)` (`src/domain/calc.ts`) resolves one `ListUnit` to its effective equipment/rules/cost in isolation; `BuilderView.vue` renders one card per `ListUnit` with its own independent upgrade checkboxes; `PrintView.vue` renders one box per `ListUnit`. Nothing links two entries together, and there is no notion of "Infantry" anywhere in the codebase — cross-checking `one-page-40k-army-lists.html` (the same secondary source every faction file already cites) confirms "Infantry" is never printed as a per-unit special rule; it's defined once, generically, under "Unit Types": *"Any non-Vehicle unit. You may deploy two copies of the same Infantry unit as one big unit; upgrades that affect all models must be bought for both."* The same section defines Heroes/Psykers: *"May be deployed as part of friendly Infantry units of the same Quality."*

The user has clarified the practical eligibility rule for this feature: a unit is Infantry-eligible when its special rules do **not** include Hero, Psyker, Monster, or Vehicle (stricter than the bare "non-Vehicle" wording, since Hero/Psyker units are single, composition-limited, and instead join an Infantry unit rather than combine with each other, and Monster is its own single-large-model unit type).

## Goals / Non-Goals

**Goals:**
- Represent two Infantry-eligible copies of the same unit as one linked, combined pair: displayed and costed as a single bigger unit, with whole-unit-affecting upgrades bought once for both.
- Represent a Hero/Psyker attached to a same-Quality Infantry-eligible unit, for list organization and print grouping.
- Derive "Infantry-eligible" and "affects all models" from data that's already in the rules database — no per-unit or per-option data tagging across the 16 faction files.
- Keep `applyUpgrades` and per-unit cost math completely unchanged; combination/attachment is purely additive at the list/store/UI layer.

**Non-Goals:**
- No deployment/positioning or battlefield simulation — this is list-building and print organization only.
- No support for combining more than two copies (the rule specifically says "two copies").
- No enforcement that per-model swap upgrades (`removeOneEquipment` options) match between two combined copies — they're legitimately independent per the rule's own wording ("upgrades that affect all models must be bought for both", not upgrades in general).
- No cost or points-cap/hero-limit effect from attaching a Hero/Psyker to a unit — the rulebook clause is an organizational/deployment rule, not a cost rule.

## Decisions

**1. Combined pair via a symmetric `combinedWith?: string` field on `ListUnit`, not a separate group entity.**
`ListUnit.combinedWith` holds the other instance's `instanceId`; when A and B are combined, `A.combinedWith === B.instanceId` and vice versa. This is the smallest change to the existing flat `units: ListUnit[]` array, trivially serializes/deserializes, and is naturally undone by clearing one field on split.
Alternative considered: a separate `combinedGroups: { a: string; b: string }[]` list on `ArmyList` — rejected as an extra indirection with no benefit over a field directly on the two entries it relates.

**2. `isInfantry(profile: UnitProfile): boolean` is a derived predicate, not stored data.**
Implemented as `!profile.specialRules.some(r => ['hero', 'psyker', 'monster', 'vehicle'].includes(r.ruleId))`. Since the rulebook never prints "Infantry" as an explicit per-unit special rule, tagging ~100+ unit profiles across 16 faction files would be pure duplication of information the app can already derive, and would risk exactly the kind of transcription drift the recent equipment-model migration had to guard against. `isHero` remains a stored flag (as today) since it's independently useful and cheap to keep; `isInfantry` is computed on demand from the same `specialRules` array `isHero` already reads.

**3. `affectsAllModels(option: UpgradeOption): boolean` reuses the existing per-model/whole-unit distinction already encoded by `removeOneEquipment` vs. everything else.**
`rules-data`'s own "Upgrade groups" requirement already distinguishes a "replace one/up to N" option (`removeOneEquipment`, explicitly per-model) from a "replace all" option or a pure rule-grant option (both whole-unit). So: `affectsAllModels(option) = !(option.effects?.removeOneEquipment?.length)`. No new authoring convention or faction-file change needed — this is a straight read of data that already exists for an unrelated reason (the recent equipment-model migration).

**4. Whole-unit upgrade sections render once per combined pair with a single synchronized control; per-model sections stay independent per instance.**
When two `ListUnit`s are combined, `BuilderView.vue` groups their upgrade sections using decision 3: a whole-unit section shows one checkbox row whose `@change` toggles the option on **both** linked instances' `selectedUpgrades` in one store call; a per-model (`removeOneEquipment`) section still shows two independent panels (one per instance), since the rule doesn't require them to match. This makes "must be bought for both" true by construction for the only class of upgrade the rule actually applies to, rather than relying on the user to notice and copy a selection manually.
Alternative considered: leave both panels fully independent and only show a mismatch warning — rejected as the *primary* mechanism (it's strictly more error-prone for no benefit), but kept as a defensive fallback (decision 6) for lists that reach a mismatched state some other way (hand-edited JSON import).

**5. Hero/Psyker attachment via `joinedInfantryUnit?: string` (an `instanceId` reference) on the Hero/Psyker's own `ListUnit`.**
Attaching is validated at the moment the user picks a target: the target must be Infantry-eligible (decision 2) and its `quality` string must exactly equal the Hero/Psyker unit's `quality`. This is a one-directional reference (the host unit doesn't need to know who's attached to it beyond looking it up), kept purely for `BuilderView`/`PrintView` grouping — it has no effect on `totalPoints`, `heroCount`, or cap/limit validation.

**6. Links are cleaned up automatically, and defensively re-validated.**
- `removeUnit` clears `combinedWith`/`joinedInfantryUnit` on any other entry that pointed at the removed instance, so a combined/attached partner is never left dangling.
- `duplicateList` remaps `instanceId`s consistently across the whole copied unit list, so a combined pair or an attachment relationship survives duplication (already-existing behavior for `selectedUpgrades`, extended to these two new fields).
- On load (including JSON import), any `combinedWith`/`joinedInfantryUnit` reference that doesn't resolve to a valid, still-eligible partner (wrong `unitId`, wrong Quality, or no longer Infantry-eligible/target missing) is silently dropped rather than blocking the list — matches the app's existing "reject only structurally invalid imports, otherwise degrade gracefully" posture.
- If a combined pair's whole-unit selections ever mismatch anyway (only reachable via hand-edited/imported JSON, since decision 4 prevents it through the UI), `validate()` reports it as a new informational issue alongside the existing over-cap/hero-limit ones, rather than silently picking one side.

**7. No `LIST_SCHEMA_VERSION` bump.**
Both new `ListUnit` fields are optional; a list persisted before this change simply deserializes with them `undefined`, which is exactly "not combined, not attached" — a safe default requiring no migration step.

## Risks / Trade-offs

- **[Risk]** Synchronizing a whole-unit option across two stored `ListUnit`s could partially fail (one updated, one not) if not done as a single atomic store mutation. → **Mitigation**: implement as one store action that mutates both entries' `selectedUpgrades` before the store's single reactive/persist tick fires (mirrors how existing single-unit toggles already work).
- **[Risk]** A hand-edited/imported list could combine two units that aren't actually eligible (different `unitId`s, or one no longer Infantry-eligible after a rules-data change) or attach a Hero to a mismatched-Quality unit. → **Mitigation**: decision 6's load-time re-validation drops any link that no longer checks out.
- **[Risk]** `isInfantry`/`affectsAllModels` are pure-function heuristics rather than authored flags; a future unit or option shape could be misclassified. → **Mitigation**: cover both with a database-wide audit test (in the style of the existing `melee-weapon-audit`/`weapon-count-audit` tests) asserting every current Hero/Psyker/Monster/Vehicle unit is excluded and every current `removeOneEquipment` option is classified as per-model.

## Migration Plan

Additive only. No data migration for existing saved lists; no faction-file content changes beyond the two glossary entries.

## Open Questions

- When two instances are first combined, if they already have different `selectedUpgrades` for a whole-unit option (e.g. one has "Jump Packs" selected, the other doesn't), should combining auto-union the option onto both, or require the user to reconcile it manually first? Leaning: auto-union onto both at the moment of combining (least surprising, and decision 4 keeps them in sync from then on) — confirm during implementation once the store action is written.
