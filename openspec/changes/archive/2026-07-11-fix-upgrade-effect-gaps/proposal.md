## Why

A review of `src/data/factions/dark-eldar.ts` found an upgrade option whose runtime effect contradicts its own printed rule text and the codebase's own documented precedent, plus several upgrade options across the faction dataset that charge points but grant no mechanical effect at all. Both are silent correctness bugs: nothing throws, the UI just quietly does the wrong thing (or nothing).

## What Changes

- Fix Dark Eldar upgrade group L ("Replace any Disintegrator Cannon"): selecting it on the Ravager currently deletes all 3 of its linked Disintegrator Cannons and adds a single Dark Lance, instead of swapping one cannon at a time. Change it to addition-only (no `removeOneEquipment`), matching the established, tested pattern already used for every other single-model-multiple-weapon-copy unit in the dataset (Deff Dred, Wraithlord, Wraithknight, Voidweaver, Starweaver).
- Wire up the missing `adds:` rule effects on Dark Eldar group H (`Chain-Snares`, `Night Shields`) and group U (`Cluster Caltrops`), which currently have no effect beyond their point cost.
- Audit the same "label names a rule, option has no effect" pattern across the other 15 faction files and fix every confirmed instance found.
- Correct the stale, factually-wrong inline comment on Dark Eldar group L that currently claims the Ravager is protected from the bug by a "label mismatch" that does not exist.
- Show a weapon-adding upgrade option's stats (range/attacks/rules) next to it in the upgrade picker *before* it's selected, not only after the weapon is equipped — reusing the same range/attacks/rule-chip presentation the effective-equipment list already shows for equipped weapons.
- Stop hand-authoring weapon stats into `OptionInput.label` strings (e.g. `'Dark Lance (36”, A6x)'`). An option's displayed stats SHALL be inferred from its own `addEquipment` weapon profile(s) at render time, so the label and the actual weapon data can never drift apart. **BREAKING** (data-shape convention, not a public API): every faction file's weapon-adding option labels are rewritten to drop their embedded stat parentheticals — an audit found 209 such labels across all 16 faction files.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `rules-data`: adds three scenarios to the existing "Upgrade groups" requirement — (1) an equipment entry representing multiple weapon copies on a single-model unit must not be targeted by a per-model-count removal effect, (2) an upgrade option whose label names a special rule must record that rule as an effect, not just a cost delta, and (3) an option's label must not embed a weapon's printed profile — that's inferred from its equipment effect.
- `army-builder-ui`: extends the "Edit units and upgrades in the builder" requirement so an upgrade option that adds a weapon shows that weapon's range/attacks and rule chips next to the option itself, before it's selected — covering both the selected-unit upgrade panel and the read-only roster "Details" panel, since both render through the same component.

## Impact

- `src/data/factions/dark-eldar.ts`: group L (Ravager fix), group H, group U, and the group L comment.
- `src/data/factions/*.ts`: additional files touched per the missing-`adds` audit (list finalized in tasks.md), plus a label rewrite (dropping embedded stat parentheticals) across all 16 faction files — 209 option labels affected.
- `src/components/EntryUpgradeControls.vue`: render inferred weapon stats/rule chips per option, alongside the existing rule-tooltip logic.
- `src/components/EquipmentList.vue` (or a new shared module it's factored into): its existing range/attacks formatter is extracted so both components use one implementation.
- `openspec/specs/rules-data/spec.md`: three scenarios under "Upgrade groups" (one already covered, two new).
- `openspec/specs/army-builder-ui/spec.md`: new scenarios under "Edit units and upgrades in the builder".
- No changes to `src/domain/calc.ts` or `helpers.ts` — the equipment/effects data model already carries everything needed (`addEquipment`'s weapon profiles); this only changes how that data is displayed and how option labels are authored.
