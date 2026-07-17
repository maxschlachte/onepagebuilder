## 1. Baseline

- [x] 1.1 Run the full test suite once to confirm a clean baseline before any change.
- [x] 1.2 Dump the resolved equipment (key/label/count/range/attacks/rules) for both game systems' factions to a scratch file, for a before/after diff later (this change touches 40k data too, unlike the two prior fantasy-only changes — dump all factions, not just fantasy).

## 2. Widen the rule source in the builder UI

- [x] 2.1 In `src/components/EntryUpgradeControls.vue`, add a `grantedRules(option)` function: `option.effects?.addRules ?? []` concatenated with the `rules` of every `option.effects?.addEquipment` entry that has no `.weapon`.
- [x] 2.2 Update `labelTooltip` to search `grantedRules(option)` instead of `option.effects?.addRules` directly.
- [x] 2.3 Update `rulesFor` to return `grantedRules(option)` instead of `option.effects?.addRules ?? []`.
- [x] 2.4 Confirm no template changes are needed — the existing `labelTooltip`/`rulesFor` branch logic and `weaponsFor` (unchanged, still `.weapon`-only) already produce the right layout once fed the wider rule set. Confirmed: no template edits, full suite passing (239/239), `vue-tsc` clean.

## 3. Retire the 4 hand-baked static parentheticals

- [x] 3.1 `src/data/factions/40k/harlequins.ts`: `'Zephyrglaive (Impact(1))'` → `'Zephyrglaive'` (option label only; leave the `gear('Zephyrglaive', { rules: rules('Impact(1)') })` call itself unchanged).
- [x] 3.2 `src/data/factions/40k/chaos-daemons.ts`: `'Rot Proboscis (Rending)'` → `'Rot Proboscis'`, `'Venom Sting (Deadly)'` → `'Venom Sting'` (labels only; `removeEquipment: ['Heavy CCWs (Poison)']` and the `gear(...)` calls unchanged).
- [x] 3.3 `src/data/factions/40k/tyranids.ts`: `'Sporocyst (Mine Launcher)'` → `'Sporocyst'` (label only).
- [x] 3.4 Confirmed `melee-weapon-audit.test.ts`'s `NON_WEAPON_LABELS` allowlist already had the bare-name variant of each; removed the 4 now-dead parenthetical-variant entries (`Rot Proboscis (Rending)`, `Venom Sting (Deadly)`, `Zephyrglaive (Impact(1))`, `Sporocyst (Mine Launcher)`) as unreferenced. Test still passes.
- [x] 3.5 Confirmed `src/data/factions/40k/tau.ts`'s `'Drone (Markerlight)'`, `'Drone (Shield)'`, `'Drone (Inhibitor)'`, `'Drone (Accelerator)'` labels remain untouched (documented Tau `armyRule('Drone', ...)` name collision — see design.md Risks).

## 4. Tests

- [x] 4.1 In `EntryUpgradeControls.test.ts`, add a case for the bare-name gear path: mount an Empire "Sergeant" option (or equivalent) and assert its label renders as a hoverable `RuleTooltip` (matching the existing "Battle Standard" test's assertion style), with no separate bracketed chip. Used Empire "Greatswords" (group F: Sergeant/Musician/Standard).
- [x] 4.2 Add a case for the distinct-name gear path: mount a Harlequins unit with the "Zephyrglaive" option and assert the label renders as plain text followed by a separate `RuleChips`/tooltip chip for `Impact(1)`, with the rule text appearing exactly once (not duplicated). Used Harlequins "Skyweavers" (group C). Note: `RuleTooltip` intentionally renders its resolved name twice in raw DOM text (visible span + hidden hover-popup `<strong>`), so "exactly once" is asserted via component-instance count (`tooltips.toHaveLength(1)`) and the visible `.whitespace-nowrap` span text, not a raw substring count.
- [x] 4.3 Add a regression case confirming the Tau "Drone (Markerlight)" option still renders without error and doesn't duplicate or crash — documents the accepted collision behavior rather than silently leaving it unverified. Used Tau "Cadre Fireblade" (group A). Confirmed the predicted design.md behavior exactly: "Drone" becomes an interactive tooltip, "(Markerlight)" remains static suffix text, nothing dropped.

## 5. Final verification

- [x] 5.1 Run the full test suite; fix any failures. 242/242 passing.
- [x] 5.2 Run `vue-tsc --noEmit`; fix any type errors. Clean.
- [x] 5.3 Re-dump resolved equipment for both game systems and diff against the task 1.2 baseline — exactly 4 diffs, all in the dump's `context` string (which embeds the option's own label), matching the 4 intentional label edits; every entry's own `key`/`label`/`count`/`rules` byte-identical. No weapon/gear stat drift.
- [x] 5.4 Grepped both `src/data/factions/40k/*.ts` and `src/data/factions/fantasy/*.ts` for `addEquipment: [gear(...)]` options with a rule-describing parenthetical in their label — none remain beyond the documented Tau `Drone (Markerlight/Shield/Inhibitor/Accelerator)` exception.
