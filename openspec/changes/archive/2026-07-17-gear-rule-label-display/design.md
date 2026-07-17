## Context

`EntryUpgradeControls.vue` renders each upgrade option's row via two independent rule-lookup functions, both reading only `option.effects?.addRules`:

```ts
function labelTooltip(option: UpgradeOption): { tooltip?: RuleRef; prefix: string; suffix: string } {
  const parenIdx = option.label.indexOf(' (')
  const prefix = parenIdx === -1 ? option.label : option.label.slice(0, parenIdx)
  const suffix = parenIdx === -1 ? '' : option.label.slice(parenIdx)
  const tooltip = option.effects?.addRules?.find((r) => resolver.resolve(r).name === prefix)
  return { tooltip, prefix, suffix }
}

function rulesFor(option: UpgradeOption): RuleRef[] {
  return option.effects?.addRules ?? []
}
```
`labelTooltip` picks the single-hoverable-label rendering path when the label (or its text before a trailing parenthetical) exactly names one of the granted rules (e.g. `"Battle Standard"`). `rulesFor` feeds the fallback path — plain label text plus a `(<RuleChips>)` bracket — used when nothing in the label names a rule (e.g. `"Jump Pack (Deep Strike, Flying)"`, where the label itself is just `"Jump Pack"`).

Separately, `weaponsFor(option)` reads `option.effects?.addEquipment`, but only entries that have `.weapon`:
```ts
function weaponsFor(option: UpgradeOption): Weapon[] {
  return (option.effects?.addEquipment ?? []).flatMap((e) => (e.weapon ? [e.weapon] : []))
}
```
A weapon-less `addEquipment` entry — i.e. a `gear(name, { rules: [...] })` call — falls through *all three* functions: not a weapon (skipped by `weaponsFor`), not in `addRules` (skipped by `labelTooltip` and `rulesFor`). Its rules are simply never read by this component.

**How widespread this is** (grepped both game systems' faction data for `addEquipment: [gear(...)]` carrying a non-empty `rules`):
- Fantasy: every faction's "Sergeant"/"Musician"/"Standard" command-group section — 13 factions × 3 options ≈ 39 sites, label is exactly the rule's own name, currently shows nothing.
- 40k: Tau `Markerlight`, `Drone (Markerlight/Shield/Inhibitor/Accelerator)`, `Seeker Missile` (×3 sections); Dark Eldar `Spirit Probe`; Tyranids `Sporocyst (Mine Launcher)`; Harlequins `Zephyrglaive (Impact(1))`; Chaos Daemons `Rot Proboscis (Rending)`, `Venom Sting (Deadly)`.

Four of those 40k sites (`Zephyrglaive (Impact(1))`, `Rot Proboscis (Rending)`, `Venom Sting (Deadly)`, `Sporocyst (Mine Launcher)`) hand-bake the granted rule's name as static parenthetical text directly in the label — the historical workaround for this exact gap. Confirmed by `melee-weapon-audit.test.ts`'s `NON_WEAPON_LABELS` allowlist, which already lists *both* the parenthetical and bare-name variant of each of these four, annotated "structured-equipment-model migration dropped the embedded rule text from the label" — i.e. a prior change already anticipated the bare form becoming canonical once this gap closed.

## Goals / Non-Goals

**Goals:**
- Make gear-granted rules render identically to `adds`-granted rules in the option picker: same two code paths (hoverable bare label, or plain label + chip bracket), same components (`RuleTooltip`, `RuleChips`), zero new UI branches.
- Retire the 4 hand-baked static parentheticals now that the dynamic path can render them for real (hoverable, resolved from the actual glossary text, not just a copy-pasted name).
- Directly answer the "is `gear()` needed vs. `adds`" question raised alongside the display bug, with concrete evidence from the data, so the distinction is documented rather than re-litigated later.

**Non-Goals:**
- Not converting any `gear(...)` call to `adds` — see Decisions. This is a display fix, not a data-model consolidation.
- Not fixing the Tau `Drone (...)` naming-collision edge case (see Risks) — accepted as a pre-existing partial-improvement case, not a regression.
- Not touching baseline unit equipment display (`EquipmentList.vue`, `PrintUnitStats.vue`) — both already correctly handle weapon-less equipment; only the upgrade-option picker has the gap.

## Decisions

**Single shared source function, reused by both existing rendering paths.** Add one function that concatenates `effects.addRules` with the rules carried by any weapon-less `addEquipment` entry:
```ts
function grantedRules(option: UpgradeOption): RuleRef[] {
  const gearRules = (option.effects?.addEquipment ?? []).flatMap((e) => (!e.weapon ? e.rules ?? [] : []))
  return [...(option.effects?.addRules ?? []), ...gearRules]
}
```
`labelTooltip` searches `grantedRules(option)` instead of `option.effects?.addRules` directly; `rulesFor` returns `grantedRules(option)` instead of `option.effects?.addRules ?? []`. No template changes, no new components — the existing branch logic already does the right thing once fed the wider rule set, because it was written generically ("does the label name one of the granted rules?") even though today only one source of grants was wired in.

**Why this doesn't produce duplicate text for the bare-name cases (Sergeant, Musician, Standard, Markerlight, Spirit Probe, Seeker Missile):** in every one of these, the option's label is *exactly* the resolved name of the single rule it grants, with no trailing parenthetical. `labelTooltip`'s prefix search finds the match and takes the single-hoverable-label path — the same path `"Battle Standard"` already takes today. `rulesFor` is never consulted for these (the template only falls to the `rulesFor` branch when `labelTooltip` finds no match), so no bracket is appended and no text is duplicated.

**Why the 4 hand-baked labels must be edited, not left alone:** for these, the label's prefix (`"Zephyrglaive"`, `"Rot Proboscis"`, `"Venom Sting"`, `"Sporocyst"`) names the *gear item*, not the *rule* it grants (`"Impact(1)"`, `"Rending"`, `"Deadly"`, `"Mine Launcher"`) — so `labelTooltip` correctly finds no match, falls to the `rulesFor` bracket path, and *appends* a new `(<RuleChips>)` after the label. Left as-is, the label's own static `" (Impact(1))"` text plus the new dynamic bracket would double up: `"Zephyrglaive (Impact(1)) (Impact(1))"`. Stripping the parenthetical from these 4 labels (to just the gear name) restores the same clean pattern `"Jump Pack (Deep Strike, Flying)"` already uses — bare gear name, dynamic chip supplies the rule text, now genuinely hoverable instead of static.

**Why `gear()` stays, and isn't replaced by `adds` anywhere:** three concrete, structural reasons found in the data, none of which `adds` can express:
1. **Equipment replacement.** Chaos Daemons' `Rot Proboscis`/`Venom Sting` options both pair `addEquipment: [gear(...)]` with `removeEquipment: ['Heavy CCWs (Poison)']` — the gear item *replaces* existing equipment. `adds` only appends a rule to `unit.specialRules`; it has no equipment side to remove against.
2. **Stable referenceable identity.** A mount built via `gear("Warhorse")` needs the same `key` every other equipment entry has, both for `removeEquipment`/replace-chains and, since `mounted-only-upgrade-prerequisite`, as a target of another option's `requiresOneOfSelected`. A rule granted via `adds` has no id anything else can point at.
3. **Presentation matches the rulebook.** Sergeant/Musician/Standard, mounts, and Markerlight are all printed in the rulebook as named equipment/upgrade items, and the app's print card reflects that: they render on the "Other:" equipment line (`PrintUnitStats.vue`), not the "Special Rules:" line. Converting them to `adds` would move them to the Special Rules line and fold them into `unit.specialRules` (participating in `requiresBaselineRule` checks, hero-detection, etc.) — a real behavior and layout change well beyond the stated display fix, and arguably *less* faithful to the source material's own column layout, not more.

So the fix is exactly what it looks like: teach the *display* code to read a source of grants it was always supposed to read per the spec's existing (source-agnostic) wording, without touching the data model.

## Risks / Trade-offs

- **[Risk] Tau's `Drone (Markerlight)`/`Drone (Shield)`/`Drone (Inhibitor)`/`Drone (Accelerator)` have a genuine name collision**: each gear item is named `"Drone"`, and Tau also defines `armyRule('Drone', ...)` — a rule literally named `"Drone"`. Once `labelTooltip` searches the wider `grantedRules()` set, the label prefix `"Drone"` matches *that* rule and takes the single-hoverable-label path, silently dropping the *other* granted rule (e.g. Markerlight) from ever becoming an interactive chip — its text stays exactly as static as it already is today (the literal `" (Markerlight)"` suffix), just not newly upgraded to a tooltip. **Mitigation**: leave these 4 labels untouched entirely. This is a strict improvement over today (the "Drone" word becomes hoverable; nothing that was visible before becomes invisible), not a regression, so it doesn't block the fix — it's a known, narrow follow-up if ever prioritized.
- **[Risk] A component test asserting exact rendered text could be brittle across the ~50 affected sites** → **Mitigation**: test the two *code paths* directly (one Sergeant-style bare-name case, one Zephyrglaive-style distinct-name case) rather than every site; rely on the existing before/after equipment-dump diff technique (from `fantasy-default-weapons`/`mounted-only-upgrade-prerequisite`) to confirm the 4 label edits are the *only* data changes — no weapon/gear stat drift.

## Migration Plan

No runtime data migration. Source-only: one component's two functions widened, 4 label strings edited. Verify with the full test suite, `vue-tsc --noEmit`, and the standard equipment-dump diff (expected: exactly 4 label-only diffs, nothing else).

## Open Questions

- None outstanding — the Drone collision is a documented, accepted limitation, not an open question blocking this change.
