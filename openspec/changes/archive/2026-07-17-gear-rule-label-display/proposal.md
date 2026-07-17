## Why

`EntryUpgradeControls.vue`'s upgrade-option row already shows, in brackets after the label, the rules an option grants directly via `adds` (`effects.addRules`) — that's the existing "Jump Pack (Deep Strike, Flying)" / hoverable "Battle Standard" behavior the `army-builder-ui` spec's "Hover tooltips for rules" requirement already promises. But an option can also grant a rule indirectly, by adding a non-weapon `gear(name, { rules: [...] })` equipment entry (`effects.addEquipment`) — and today those rules are invisible in the option row. `rulesFor()` only reads `effects.addRules`; `weaponsFor()` only reads `addEquipment` entries that *do* have a `.weapon`, so a rule-only gear entry falls through both and never renders.

This isn't a cosmetic gap — it's a real, widespread one. Grepping both game systems' data turns up ~50 upgrade options built this way: every fantasy faction's "Sergeant"/"Musician"/"Standard" command-group upgrade (no visible indication they do anything until you check the equipment list separately), plus 40k options like Tau's "Markerlight", Dark Eldar's "Spirit Probe", Tyranids' "Sporocyst (Mine Launcher)", Harlequins' "Zephyrglaive (Impact(1))", and Chaos Daemons' "Rot Proboscis (Rending)"/"Venom Sting (Deadly)". Several of the latter group show the telltale sign of a known workaround: the granted rule's text is hand-baked as *static, non-interactive* text directly into the label (`"Zephyrglaive (Impact(1))"`) instead of being generated dynamically the way every `adds`-based option already is. The melee-weapon-audit's `NON_WEAPON_LABELS` allowlist already has both the parenthetical and bare-name variants of exactly these four labels pre-listed, with comments noting a prior migration "dropped the embedded rule text from the label" — this change is what finishes that job.

## What Changes

- Widen the rule-lookup used by `EntryUpgradeControls.vue`'s label-tooltip and rule-chip rendering to also include rules carried by weapon-less `addEquipment` entries (gear), not just `effects.addRules` — reusing the exact same rendering paths (`labelTooltip`'s single hoverable-label path, `rulesFor`'s plain-label-plus-chips path) that `adds`-based options already use, so gear-granted rules look and behave identically once wired in.
- Remove the now-redundant hand-baked parenthetical rule text from the 4 labels that were working around this gap (`Zephyrglaive (Impact(1))` → `Zephyrglaive`, `Rot Proboscis (Rending)` → `Rot Proboscis`, `Venom Sting (Deadly)` → `Venom Sting`, `Sporocyst (Mine Launcher)` → `Sporocyst`), letting the now-dynamic, hoverable chip supply that text instead of dead static text.
- **Answers the open design question** ("is `gear()` in `addEquipment` needed in contrast to `adds`?"): no, this change does not replace any `gear()` calls with `adds`. `gear()` stays — it does something `adds` structurally cannot: it creates a keyed equipment entry, which is required whenever an option (a) pairs the grant with `removeEquipment` to *replace* existing equipment (e.g. Chaos Daemons' Rot Proboscis/Venom Sting swap out `Heavy CCWs (Poison)`), (b) needs a stable id other options can reference (every mount, now also the target of `requiresOneOfSelected` from the `mounted-only-upgrade-prerequisite` change), or (c) is presented by the rulebook as a named equipment/upgrade item (Sergeant/Musician/Standard, mounts, Markerlight) rather than an innate special rule — which is also why these render in the unit's "Other:" equipment line on the print card, not its "Special Rules:" line. This change fixes the *display* gap; it does not collapse the two mechanisms.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: the "Hover tooltips for rules" requirement is clarified to explicitly cover rules granted via a weapon-less `addEquipment` entry, not only via `adds` — the requirement's existing wording ("a rule it grants") already implied this generically; the implementation just didn't fulfill it for this source. New scenarios cover the bare gear-name case (Sergeant-style) and the distinct-gear-name case (Zephyrglaive-style).

## Impact

- **Affected code**: `src/components/EntryUpgradeControls.vue` (widen the rule source read by `labelTooltip`/`rulesFor`), `src/components/EntryUpgradeControls.test.ts` (new coverage).
- **Affected data**: `src/data/factions/40k/harlequins.ts`, `src/data/factions/40k/chaos-daemons.ts` (2 sites), `src/data/factions/40k/tyranids.ts` — label text edits only, removing redundant parentheticals. No stat/equipment/rule changes.
- **Not affected**: `src/data/factions/40k/tau.ts`'s "Drone (...)" options are deliberately left untouched — Tau's own `armyRule('Drone', ...)` collides by name with the gear's own name "Drone", which would make the widened `labelTooltip` swallow the *other* granted rule (e.g. Markerlight) into a non-interactive suffix. This is a pre-existing, narrow edge case documented in design.md rather than solved here; the fix is a strict improvement (the "Drone" part becomes a live tooltip) with no regression versus today.
- **Not affected**: baseline unit equipment display (`EquipmentList.vue`, `PrintUnitStats.vue`) — both already correctly branch on `e.weapon` presence and render gear rules; this change is scoped entirely to the upgrade-*option* picker.
