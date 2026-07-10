## Context

Today `EquipmentEntry` has no notion of "how many models in the unit have this" — the equipment array is just a flat list of distinct items, and the UI displays each label once. `count` is a different, existing concept: copies of the same item *on a single model* (e.g. a Land Raider's `2x Hurricane Bolters`), unrelated to how many models in the unit carry it.

`UpgradeEffect.removeEquipmentOnSingleModel` was introduced (see the `effective-equipment-display` change) specifically to distinguish "replace one X" from "replace all X": on a single-model unit, replacing "one" of something *is* replacing all of it, so the effect removes the label outright — but only `if (unit.size === 1)`. For any bigger unit, the same option just adds the new weapon and leaves the old one's entry untouched, because there was never a need to track *how many* models still have it — nothing displayed a count, so an admittedly-incomplete "additions only" was an acceptable stopgap (see the multiple comments across faction files acknowledging this explicitly).

A full-codebase survey (before writing this proposal) found ~100 upgrade options across 8+ factions matching this exact gap: a "replace one/some X" section (by title and by `selection: 'one'/'any'/'upToTwo'`) whose options have `addEquipment` but no `removeEquipment` and no `removeEquipmentOnSingleModel` at all. It also confirmed:
- Every section's options replace the *same* named target (the section title always names one thing, e.g. "Replace one Assault Rifle"), so a per-option declaration is sufficient (no section mixes different replacement targets across its options).
- Each *selected option* in an `'any'`/`'upToN'` section corresponds to exactly one model swapping (no section implies a different per-option multiplier).
- Every "replace all X" section already uses unconditional `removeEquipment` and already works correctly today for any unit size — no changes needed there.
- No baseline (non-upgrade) unit mixes different weapons across its own models without an upgrade.
- "Upgrade/Equip all models with X" sections that actually add equipment (rather than just a special rule) always already pair it with unconditional `removeEquipment` — so the "whole-unit add" case is already structurally identical to "replace all", requiring no new signal.
- Every "Nx " baked into a label today (e.g. `2x Hurricane Bolters`, `5x Venom Cannons`) belongs to a size-1 unit — so the new computed count prefix (gated on `unit.size > 1`) never collides with it.

## Goals / Non-Goals

**Goals:**
- Every equipment line in a multi-model unit's effective equipment shows an accurate `Nx ` model-count prefix, including after partial ("replace one X") upgrades.
- Fix the underlying data gap (not just the display) so the count is actually correct, across all factions.
- Preserve all existing single-model-unit behavior and existing "replace all" behavior unchanged.

**Non-Goals:**
- Per-model weapon-copy counts (the existing `count` field and its own "additions only" vehicle edge cases) — untouched.
- Deduplicating/merging separately-added equipment entries that end up sharing a label — left as a known, rare display gap.
- Changing how many *options* can be selected within a section (`maxPicks`/`UpgradeSelection`) — unchanged; this change only tracks the consequence of a selection on model counts.

## Decisions

**Add `unitCount?: number` to `EquipmentEntry`, defaulting to the unit's full size when absent.** This means the hundreds of existing baseline entries and "replace all" swapped-in entries need *no* changes at all — they're already correct under the default. Only entries affected by a single-model swap or attachment need an explicit `unitCount` set. Alternative considered: require every entry to carry an explicit count. Rejected — would mean touching every one of the ~2000+ equipment entries across the dataset for a value that's almost always just "the whole unit," for no benefit.

**Generalize `removeEquipmentOnSingleModel` into `removeOneEquipment`, dropping the `unit.size === 1` gate.** For a size-1 unit, decrementing a count-1 entry by one removes it — identical to today's behavior. For a size-N unit, it now correctly reduces the shared entry's `unitCount` by one instead of no-op'ing. The rename reflects that it's no longer conditional on unit size; keeping the old name after generalizing its behavior would be actively misleading to a future reader. This single rename, applied mechanically across all 16 faction files (existing declarations), automatically fixes every case where a group is *shared* between a single-model unit and multi-model units (e.g. Sisters of Battle group A serves both the size-1 Canoness and the size-5 Battle Sisters) — those already declare the field, just gated wrong.

**Match `removeEquipment`/`removeOneEquipment` targets against labels pluralization-insensitively.** A shared group's decrement target is conventionally authored in the singular (`'Assault Rifle'`, matching the size-1 unit's exact baseline label), but a multi-model unit's baseline label is the plural form (`'Assault Rifles'`). Normalizing both sides (lowercase, strip a trailing `s`) before comparing — the same normalization `eqEntry` already uses — lets one declaration correctly match either form without requiring per-unit-size label variants.

**When an option's `addEquipment` fires and `removeEquipment` (the unconditional, whole-unit variant) is *not* present, force `unitCount: 1` on each added entry.** This covers both "replace one X" (paired with `removeOneEquipment`) and bare attachments (no remove field at all, e.g. "Take one Assault Rifle attachment") uniformly — in both cases exactly one model is gaining the new item. When `removeEquipment` *is* present, added entries are left with `unitCount` unset, defaulting to the (already-updated) unit size — matching "the whole unit now has this instead."

*Alternative considered*: infer "one model" vs. "whole unit" vs. "replace" vs. "attach" from the section's title text (e.g. regex on "Replace one X" vs. "Take one X attachment"), avoiding any new field. Rejected — the survey's title-wording is consistent today, but title text is meant for players to read (verbatim from the rulebook) and isn't a contract this codebase relies on elsewhere for behavior; an explicit, typed field is safer and matches how `SectionPrerequisite`/`UpgradeEffect` are already modeled structurally rather than inferred from prose.

**Gate the rendered `Nx ` prefix on `unit.size > 1`.** For single-model units, `unitCount` is always trivially 1 for every entry — showing "1x Pistol, 1x Medium Powersword" for every Hero/vehicle would be pure noise and would visually clash with the existing baked-in per-model counts on some size-1 units' labels (`2x Hurricane Bolters`, `5x Venom Cannons`). The survey confirmed no size-2+ unit has a baked-in count prefix in its label, so this gate cleanly avoids any collision.

## Risks / Trade-offs

- **~100 individual data-file edits** to add missing `removeOneEquipment` declarations, across most factions. → Mitigated by the mechanism being uniform and mechanical (per section: name the section's replacement target, add it to each option); tasks are split one-per-faction-file for tracked, incremental progress. The user explicitly chose the comprehensive (all-factions) rollout over a partial pilot.
- **Duplicate-label merging isn't handled** — if two separate upgrade selections independently add equipment that resolves to the same label, the display shows two separate `1x` lines instead of one `2x` line. → Documented as a known, rare limitation; not addressed here.
- **`selection: 'any'`/`upToN'` sections with more selections than the unit has models** (e.g. selecting more "replace one X" options than there are models) could decrement a target below zero. → The decrement is clamped at removal (an already-removed/absent entry is simply not found by later decrements, never goes negative) — not flagged as an error, since nothing in the existing UI prevents over-selecting today either.

## Migration Plan

No runtime/persisted-data migration — this only affects derived (`EffectiveUnit`) computation and the static faction dataset shipped with the app. Rollout is: land the domain/calc/rendering mechanism first (with tests), then work through each faction file's missing `removeOneEquipment` declarations, verifying the full test suite (plus a new audit-style test) after each. No feature flag needed given the low blast radius (equipment lines gain a prefix; nothing is removed from what's already shown).
