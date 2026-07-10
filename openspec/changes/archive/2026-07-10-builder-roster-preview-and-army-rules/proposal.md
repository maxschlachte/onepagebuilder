## Why

Several small builder/print gaps make the list-building loop slower and the printed sheet less self-sufficient than the app already promises: a player can't see a roster unit's full stat line before adding it, upgrade options that grant an army rule (e.g. "Battle Standard") show no tooltip and — because the option itself never records that rule as an effect — the rule's text silently never reaches the print view's "self-sufficient rule reference," even though that's already the print view's documented job. Psychic powers are folded into that same reference section instead of getting their own, harder to scan at the table. Separately, the rulebook's "deploy up to 10 models sharing this rule as one unit" mechanic (Conclave, Warband, Beastmaster, Court — already present as army-rule text in four factions) has no builder support at all, unlike the structurally similar "two Infantry copies" combine feature shipped for the same purpose. Finally, a lone Psyker unit is a valid attach source today exactly like a Hero (implemented alongside Hero attach), but the roster gives it no visual cue the way Hero units get a badge.

## What Changes

- **Builder roster: unit stat preview.** Hovering (or focusing, for keyboard/touch) a roster entry SHALL show a popover with that unit's baseline equipment (with weapon rule tooltips) and special rules (with tooltips), reusing the existing equipment-list/rule-chip rendering — so a player can see the full stat line before adding the unit.
- **Builder roster: Psyker badge.** A roster unit whose special rules include Psyker SHALL show a badge next to its name, the same way a Hero unit already does (a unit that is both continues to show only the Hero badge, since Hero already implies eligibility to join a unit — no need to double-badge).
- **Army-rule tooltips, and making upgrade options that grant a rule actually grant it.** Any upgrade option whose selection is meant to confer a special or army rule SHALL declare that rule as an effect (`addRules`) so it (a) actually becomes part of the unit's effective special rules once selected, (b) gets a hover tooltip in the builder's upgrade list before selection, matching the tooltip already shown once it's on the unit, and (c) — as a direct consequence of (a) — is included in the print view's existing "self-sufficient rule reference" the same way any other special rule already is. This is a data-conformance fix across the 16 faction files (several options, starting with "Battle Standard", currently carry no `addRules` even though `rules-data`'s "Upgrade groups" requirement already says an option's rule effects must be recorded) plus the builder-side tooltip rendering to surface it.
- **Print view: Psychic Powers as its own section.** Psychic powers currently get merged into the "Rule Reference" section. They SHALL instead render in a separate section (same layout/style, headline "Psychic Powers"), shown whenever the list contains a Psyker; the Rule Reference section keeps special/army/weapon rules only.
- **Group-deployment combine (Conclave / Warband / Beastmaster / Court).** The system SHALL let a user combine up to 10 list entries that share a "deploy up to 10 models with this rule together as one unit" army rule (regardless of unit type, unlike the existing same-unit-only Infantry combine) into one linked group that displays and costs as a single unit in the builder and prints as one box, and SHALL let the user remove an entry from the group. This generalizes the combine mechanic already shipped for Infantry to the rulebook's other "form a single unit" army rules — derived from the army rule's own text, not a hardcoded rule-id list, so any future faction data with the same wording is picked up automatically.
- **BREAKING**: none — all additions are optional/derived; existing saved lists load unchanged, and units unaffected by any of the above keep their current appearance and behavior.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: roster gains a stat-preview popover and a Psyker badge; hover tooltips extend to upgrade options that grant a rule; new controls to form/leave a group-deployment combine.
- `army-list-management`: gains a requirement for combining up to 10 list entries sharing a group-deployment army rule into one linked group.
- `print-view`: Psychic Powers becomes its own section separate from Rule Reference; a group-deployment combine renders as one box, matching how a combined Infantry pair already does.

## Impact

- `src/data/factions/*.ts`: audit every upgrade option whose label names a real special/army rule (starting with each faction's "Battle Standard" option) and add the missing `adds`/`addRules` declaration; no new faction-data authoring convention beyond what `rules-data`'s existing "Upgrade groups" requirement already specifies.
- `src/domain/calc.ts` (or a new small domain module): a derived `isGroupCombinable`-style helper reading an army rule's text for the "deploy up to 10 models... single unit" pattern (mirroring how `isInfantry`/`affectsAllModels` are already derived rather than tagged); a group-aggregation helper generalizing `combinedEffectiveUnit` to N members of possibly-different `UnitProfile`s.
- `src/domain/list.ts`: `ListUnit` gains a new optional group-combine reference (kept separate from the existing pairwise `combinedWith`, which stays exactly as-is for Infantry).
- `src/stores/lists.ts`: new actions to join/leave a group-deployment combine, plus the same cleanup-on-remove/remap-on-duplicate/drop-invalid-on-load handling the Infantry combine already has.
- `src/components/`: a new roster-preview popover component (reusing `EquipmentList`/`RuleChips`); `EntryUpgradeControls.vue` renders a rule tooltip next to an option's label when the option grants a matching-named rule; roster row template gains a Psyker badge.
- `src/views/BuilderView.vue`, `src/views/PrintView.vue`: group-deployment combine controls and rendering, alongside the existing Infantry-combine/attach ones.
- `src/domain/resolve.ts`: unchanged — it already resolves army-rule and psychic-power ids; only the print view's grouping of ids into sections changes.
