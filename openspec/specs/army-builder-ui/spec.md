# army-builder-ui Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. For a Space Marines list with a chapter selected, the roster SHALL also include that chapter's extra units alongside the base Space Marines units, ordered by category — Heroes/Psykers first, then Infantry, then Vehicles, then any other category — with each chapter unit placed within the same category as its base-faction peers rather than appended as a separate block after all base units; within a category, base units SHALL keep their existing relative order followed by the chapter's units of that category in their existing relative order. Each roster unit SHALL show a "Details" button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment, special rules, and every available upgrade section and option with its cost (read-only — no selection controls), and activating it again collapses the panel. The expanded panel SHALL NOT repeat the unit's name, and SHALL NOT render as a bordered/boxed panel nested inside the roster row's own box — it is separated from the row above it by a divider only. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include a caster rule (Warhammer 40k's `Psyker` or Warhammer Fantasy's `Wizard`) SHALL show a badge labeled with that rule's own name ("Psyker" or "Wizard" respectively). Below the mobile breakpoint, the roster is one of the two panels the tab switcher toggles between.

#### Scenario: Browse a faction roster

- **WHEN** the user views the builder for a list with a chosen faction
- **THEN** the faction's units are listed with name, size, quality, cost, a "Details" control, and an add control

#### Scenario: A chapter list's roster includes chapter units

- **WHEN** the user views the builder for a Space Marines list with a chapter selected
- **THEN** the roster shows the base Space Marines units plus that chapter's extra units

#### Scenario: A chapter list's roster is grouped by category

- **WHEN** the user views the builder for a Space Marines list with a chapter selected
- **THEN** the roster lists every Hero/Psyker unit (base and chapter) first, then every Infantry unit (base and chapter), then every Vehicle unit (base and chapter), with the chapter's units of each category appearing alongside — not after all of — the base units of that same category

#### Scenario: Within a category, base and chapter relative order is preserved

- **WHEN** the user views a chapter list's roster
- **THEN** the base Space Marines units within a category appear in their existing order, followed by that chapter's units of the same category in their existing order

#### Scenario: A chapter-less Space Marines list's roster is unchanged

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** the roster shows exactly the base Space Marines units, with no chapter-specific units, in their original (non-category-grouped) order

#### Scenario: Add from the roster

- **WHEN** the user activates the add control on a roster unit
- **THEN** that unit is added to the current list and appears in the list's selected-units area

#### Scenario: Expand a roster unit's details panel

- **WHEN** the user activates a roster unit's "Details" control
- **THEN** an inline panel expands showing that unit's baseline equipment (with weapon rule tooltips), special rules (with tooltips), and every upgrade section/option available to it with its point cost, without needing to add the unit first

#### Scenario: The details panel has no selection controls

- **WHEN** a roster unit's details panel is expanded
- **THEN** its upgrade options are listed without checkboxes or any other selection control — activating the panel never changes the unit's (nonexistent) selection state

#### Scenario: The details panel does not repeat the unit's name or nest a box

- **WHEN** a roster unit's details panel is expanded
- **THEN** the panel does not show the unit's name again, and is not rendered as its own bordered panel inside the roster row's box

#### Scenario: Collapse an expanded details panel

- **WHEN** the user activates the "Details" control of a roster unit whose panel is already expanded
- **THEN** the panel collapses

#### Scenario: Expanding details does not add the unit, and adding does not expand details

- **WHEN** the user activates a roster unit's "Details" control, or its add control
- **THEN** only that control's own action occurs — activating "Details" never adds the unit to the list, and activating add never expands or collapses the details panel

#### Scenario: Hero badge

- **WHEN** a roster unit's special rules include Hero
- **THEN** the roster entry shows a "Hero" badge

#### Scenario: Psyker badge in Warhammer 40k

- **WHEN** a Warhammer 40k roster unit's special rules include Psyker and do not include Hero
- **THEN** the roster entry shows a "Psyker" badge

#### Scenario: Wizard badge in Warhammer Fantasy

- **WHEN** a Warhammer Fantasy roster unit's special rules include the `Wizard` rule and do not include Hero
- **THEN** the roster entry shows a "Wizard" badge, not "Psyker"

#### Scenario: A Hero Psyker/Wizard shows only the Hero badge

- **WHEN** a roster unit's special rules include both Hero and a caster rule (Psyker or Wizard)
- **THEN** the roster entry shows only the "Hero" badge, not both

### Requirement: Edit units and upgrades in the builder

The system SHALL display each selected unit with its effective stats and SHALL provide controls to select that unit's available upgrade options and to remove the unit. The displayed equipment list SHALL reflect weapon additions, removals, and replacements from the unit's currently selected upgrades, not only its baseline loadout, with each weapon's range/attacks and any special rules shown together in a single bracket (e.g. `(24", A1, Piercing)`), the rules rendered as hoverable tooltips. If a unit's effective equipment (after all currently selected upgrades) contains no melee weapon, the displayed equipment list SHALL include a default `Light CCW` entry with its range/attacks bracket, per the rule that units without a melee weapon count as using Light CCWs/Claws. For a unit with more than one model, each equipment line SHALL be prefixed with the number of models in the unit currently carrying it (e.g. `4x Assault Rifle`), reflecting partial upgrades that replace only some of the unit's models' weapons; a single-model unit's equipment list SHALL NOT show this prefix. An upgrade option that adds one or more weapons SHALL show each added weapon's range/attacks and rules in that same single bracket next to the option itself, computed from that option's own equipment effect — visible as soon as the option is listed, before it is selected — rather than only once the weapon appears in the unit's effective equipment list; this applies identically to the read-only roster "Details" panel, since it lists upgrade options through the same rendering. This bracketed format SHALL be identical between a unit's equipment list and its upgrade-option rows, sharing one rendering. When a selected upgrade grants a parameterized special rule (e.g. `Psyker(N)`, `Wizard(N)`, `Tough(N)`, `Impact(N)`) that the unit's baseline already carries (or that another selected upgrade already granted) under the same rule name: if the granted value is a plain tier level, the unit's effective special rules SHALL show only the single highest tier, not each tier separately; if the granted value is an additive bonus (printed as `+N` on the upgrade), it SHALL be added to the unit's existing value for that rule, producing one combined entry rather than a second separate one.

#### Scenario: Upgrade controls reflect available groups

- **WHEN** a selected unit has upgrade-group letters
- **THEN** the builder shows the options for those groups with their point costs, and selecting one updates the unit's stats and cost

#### Scenario: Remove control

- **WHEN** the user activates a unit's remove control
- **THEN** the unit is removed from the list

#### Scenario: Selecting a weapon-replacing upgrade updates the equipment list

- **WHEN** the user selects an upgrade option that replaces one of the unit's weapons
- **THEN** the unit's displayed equipment list updates to show the new weapon, with its range/attacks and any rules together in one bracket

#### Scenario: A ranged-only unit's equipment list shows a default melee weapon

- **WHEN** a unit's baseline equipment and currently selected upgrades include no melee weapon
- **THEN** the displayed equipment list includes a `Light CCW` entry showing `(Melee, A1)`

#### Scenario: A unit with a real melee weapon does not get the default

- **WHEN** a unit's baseline equipment or currently selected upgrades already include a melee weapon
- **THEN** the displayed equipment list does not include a default `Light CCW` entry

#### Scenario: A partial single-model swap splits the displayed count

- **WHEN** a 5-model unit with baseline `Assault Rifles` has a "replace one Assault Rifle" upgrade option selected that adds a `Meltagun`
- **THEN** the displayed equipment list shows `4x Assault Rifle` and `1x Meltagun`

#### Scenario: A whole-unit replacement shows the full unit count

- **WHEN** a multi-model unit has a "replace all X" upgrade option selected
- **THEN** the displayed equipment list shows the replacement weapon prefixed with the unit's full model count, and no longer lists the original weapon

#### Scenario: A single-model unit shows no count prefix

- **WHEN** a unit with exactly one model is displayed
- **THEN** its equipment list shows no `Nx ` count prefix on any line

#### Scenario: An unselected weapon-adding option shows the weapon's stats

- **WHEN** the builder lists an upgrade option that adds a weapon (e.g. `Dark Lance`), before the user selects it
- **THEN** the option's row shows that weapon's range/attacks and rules together in one bracket, matching how the same weapon would be shown once equipped

#### Scenario: A multi-weapon option shows stats for each weapon it adds

- **WHEN** the builder lists an upgrade option whose effect adds more than one weapon (e.g. a pistol and a CCW)
- **THEN** each added weapon's own bracketed range/attacks/rules are shown next to the option, in the same order the option's label names them

#### Scenario: The roster details panel also shows inferred weapon stats

- **WHEN** the user expands a roster unit's read-only "Details" panel and it lists an upgrade option that adds a weapon
- **THEN** that option's row shows the same inferred bracketed range/attacks/rules as the equivalent option in a selected unit's upgrade panel, with no selection control

#### Scenario: A weapon with no rules shows a plain bracket

- **WHEN** a displayed weapon (in the equipment list or an upgrade option row) has no special rules
- **THEN** its bracket shows only the range/attacks, with no trailing comma or empty rules segment

#### Scenario: A tiered rule upgrade replaces the lower tier

- **WHEN** the user selects a `Psyker(2)` upgrade option on a unit whose baseline special rules already include `Psyker(1)`
- **THEN** the unit's effective special rules show only `Psyker(2)`, not both `Psyker(1)` and `Psyker(2)`

#### Scenario: A tiered rule upgrade works the same for Wizard

- **WHEN** the user selects a `Wizard(3)` upgrade option on a unit whose baseline special rules already include `Wizard(2)`
- **THEN** the unit's effective special rules show only `Wizard(3)`, not both `Wizard(2)` and `Wizard(3)`

#### Scenario: An additive rule upgrade combines with the baseline value

- **WHEN** the user selects a `Tough(+3)` upgrade option on a unit whose baseline special rules include `Tough(3)`
- **THEN** the unit's effective special rules show a single `Tough(6)` entry, not two separate `Tough` entries

### Requirement: Live totals and validation display

The system SHALL display the running point total, the points cap, the hero count, and any validation issues, updating them as the list changes.

#### Scenario: Totals update live

- **WHEN** the user adds, upgrades, or removes a unit
- **THEN** the displayed total, hero count, and validation messages update immediately

#### Scenario: Over-cap indication

- **WHEN** the list total exceeds the points cap
- **THEN** the builder visibly indicates the over-cap state

### Requirement: Hover tooltips for rules

The system SHALL display the full explanatory text of a special rule, army special rule, psychic power, or weapon rule when the user hovers over its name in the builder. An upgrade option whose label names a rule it grants (the whole label, or the text before a trailing parenthetical) SHALL show the same hover tooltip on that label, before the option is even selected. An upgrade option that grants one or more rules via a bare label that does not name any of them SHALL instead render its label as plain text, followed by its granted rules as a separate comma-joined list, each rendered with the same hover tooltip, before the option is even selected.

#### Scenario: Special rule tooltip

- **WHEN** the user hovers over a special-rule label such as `Fearless` on a unit
- **THEN** a tooltip shows the full rule text from the glossary

#### Scenario: Parameterized rule tooltip

- **WHEN** the user hovers over a parameterized rule such as `Tough(3)`
- **THEN** the tooltip shows the rule text together with its parameter value

#### Scenario: Weapon rule tooltip

- **WHEN** the user hovers over a weapon rule such as Piercing
- **THEN** a tooltip shows that weapon rule's full text

#### Scenario: Upgrade option tooltip for a granted army rule

- **WHEN** the user hovers over an upgrade option's label whose text names an army rule it grants (e.g. a "Battle Standard" option)
- **THEN** a tooltip shows that army rule's full text, the same as it would once the option is selected and shown on the unit

#### Scenario: Upgrade option with a bare label shows its granted rules as separate chips

- **WHEN** an upgrade option's label (e.g. `Jump Pack`) names none of the rules it grants (e.g. `Deep Strike`, `Flying`)
- **THEN** the label renders as plain text, and each granted rule renders immediately after it as its own hoverable tooltip chip, with no rule's name or text duplicated

### Requirement: Combine and attach controls in the builder

The system SHALL show a control to combine two selected list entries of the same Infantry-eligible unit, visible only when the list has two such eligible entries available to combine, and a control to split an already-combined pair. A combined pair SHALL render as a single card showing its combined model count and combined cost, with upgrade options that affect all models shown once (selecting one applies it to both linked entries) and options that affect one model or a bounded subset of models shown per entry. An upgrade group that has no option matching the current whole-unit/per-entry panel SHALL render nothing for that group (no heading, divider, or empty space). The system SHALL show a control to attach a selected Hero or Psyker list entry to an eligible Infantry list entry of the same Quality, and a control to detach it; an attached Hero/Psyker SHALL render nested under its host unit's card.

#### Scenario: Combine control appears only when eligible

- **WHEN** the list has two entries of the same Infantry-eligible unit
- **THEN** a control to combine them is shown; it is not shown for a unit that is not Infantry-eligible or when there is only one copy

#### Scenario: Combined pair renders as one card

- **WHEN** two entries are combined
- **THEN** the builder shows one card with the combined model count, combined cost, one set of whole-unit upgrade controls, and a per-entry panel for any single-model/bounded-subset options

#### Scenario: A group with no matching options renders no divider

- **WHEN** a combined pair's whole-unit upgrade panel (or a single entry's per-model panel) is displayed and an upgrade group has no option that belongs to that panel
- **THEN** that group renders nothing — no heading, no divider line, and no empty space — for that panel

#### Scenario: Split control is always available on a combined pair

- **WHEN** a combined pair is displayed
- **THEN** a control to split it back into two independent entries is shown

#### Scenario: Attach control targets eligible units

- **WHEN** the user attaches a Hero or Psyker entry
- **THEN** only same-Quality Infantry-eligible entries are offered as valid targets

#### Scenario: Attached Hero renders nested under its host

- **WHEN** a Hero or Psyker is attached to a unit
- **THEN** the builder shows the Hero/Psyker's card nested under (or visibly grouped with) its host unit's card, with a detach control

### Requirement: Group-deployment combine controls in the builder

The system SHALL show a control to combine a selected list entry with another entry sharing a group-deployment army rule (Conclave, Warband, Beastmaster, Court, or any future rule of the same "deploy up to N models together" shape), visible only when at least one other eligible, not-yet-full-group entry exists in the list. A group SHALL render as a single card showing its combined model count, combined cost, and a per-member roster listing each distinct member unit and count, with each member's own upgrade controls shown independently underneath. The system SHALL show a control on each member to remove it from the group.

#### Scenario: Combine control appears only when an eligible partner exists

- **WHEN** the list has two or more entries sharing a group-deployment army rule and room remains under the rule's model cap
- **THEN** a control to combine them is shown; it is not shown when no other eligible entry exists or the group is already at its model cap

#### Scenario: A group renders as one card with a member roster

- **WHEN** two or more entries are combined into a group
- **THEN** the builder shows one card with the group's combined model count, combined cost, and a roster line per distinct member unit and count

#### Scenario: Remove-from-group control is available per member

- **WHEN** a group card is displayed
- **THEN** each member shows a control to remove just that member from the group

### Requirement: Mobile tab switcher for Roster and Selected Units

Below a mobile-width breakpoint, the system SHALL show a tab switcher letting the user view either the Roster or the Selected Units panel, one at a time, instead of both stacked in sequence. At and above that breakpoint, the system SHALL continue to show both panels side by side, with no tab switcher, exactly as without this requirement. The tab switcher SHALL use the same segmented-control tab pattern as the game-system switcher on the saved-lists screen — a shared bordered container marked `role="tablist"`, with each option rendered as a `role="tab"` control whose `aria-selected` state reflects whether its panel is the one currently shown.

#### Scenario: Tab switcher shown below the breakpoint

- **WHEN** the builder is viewed at a mobile-width viewport
- **THEN** a tab switcher for "Roster" and "Selected Units" is shown, and only the active tab's panel is visible

#### Scenario: Switching tabs changes the visible panel

- **WHEN** the user activates the other tab in the mobile tab switcher
- **THEN** the previously-hidden panel becomes visible and the previously-visible panel becomes hidden

#### Scenario: No tab switcher at desktop width

- **WHEN** the builder is viewed at desktop width
- **THEN** no tab switcher is shown, and both the Roster and Selected Units panels are visible side by side

#### Scenario: Tab switcher exposes tab semantics

- **WHEN** the builder's mobile tab switcher is shown
- **THEN** its container has `role="tablist"`, each of its two options has `role="tab"`, and the option matching the currently visible panel has `aria-selected="true"` while the other has `aria-selected="false"`

### Requirement: Touch-friendly control sizing in the builder

The system SHALL size the builder's interactive controls (buttons and select dropdowns, in the roster and in selected-unit cards) for comfortable touch use rather than the smallest size a mouse-oriented layout would use.

#### Scenario: Roster and selected-unit controls are touch-sized

- **WHEN** the user views a roster row or a selected-unit card
- **THEN** its buttons and select dropdowns (e.g. Details, Add, Split, Remove, Leave group, Detach, Combine/Attach/Group selects) render at the builder's touch-friendly control size, not the smallest available size

### Requirement: Chapter Tactics options in the builder

For a Space Marines list with a chapter selected, the system SHALL show that chapter's rule-modifier option(s) as an additional upgrade choice on every base Space Marines unit the modifier applies to (by unit category — Infantry, Vehicle, Hero — or by specific unit name, per the chapter's printed modifiers), alongside the unit's normal upgrade groups, with the option's point cost and granted rule following the same display and selection behavior as any other upgrade option. The chapter's own extra units SHALL NOT show that chapter's own Chapter Tactics options, even when the unit's category or name would otherwise match. A real lettered upgrade group's id SHALL render once per group, as a badge overlaid on the divider above the group's sections, rather than as a text prefix on each section's headline; the Chapter Tactics section heading SHALL NOT display the synthesized group's internal id — it renders no id badge on its divider, and its section heading SHALL show only the section title ("Chapter Tactics").

#### Scenario: A category-wide Chapter Tactics option appears on every eligible base unit

- **WHEN** the user views a Blood Angels list's roster or a selected base Space Marines Infantry unit's upgrade controls
- **THEN** a "Furious" option at +10pts is shown, available on that unit and on every other base Space Marines Infantry-eligible unit in the list

#### Scenario: A named-unit Chapter Tactics option appears only on that unit

- **WHEN** the user views a Dark Angels list's selected Terminators unit
- **THEN** a "Deathwing" option at +20pts is shown on that unit, and is not shown on units other than Terminators

#### Scenario: A chapter's own unit never shows that chapter's own Chapter Tactics options

- **WHEN** the user views a Blood Angels list's roster or a selected Death Company unit (a Blood Angels-specific unit that already carries Rage, implying Furious)
- **THEN** no Chapter Tactics section is shown for Death Company, even though it is Infantry-eligible

#### Scenario: Selecting a Chapter Tactics option updates cost and rules like any other option

- **WHEN** the user selects a Chapter Tactics option on an eligible unit
- **THEN** the unit's special rules include the granted rule and its cost includes the option's point delta, and the option's rule label shows the same hover tooltip as any other rule reference

#### Scenario: No Chapter Tactics options without a chapter

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** no Chapter Tactics options are shown on any unit

#### Scenario: Chapter Tactics heading omits the internal group id

- **WHEN** the user views a unit's Chapter Tactics section, in either a selected unit's upgrade controls or the read-only roster Details panel
- **THEN** the section heading shows only "Chapter Tactics", with no group id prefix, and the divider above it renders with no id badge

#### Scenario: A real lettered group's id renders once as a badge on the divider

- **WHEN** the user views any other (non-Chapter-Tactics) upgrade group with more than one section, in either a selected unit's upgrade controls or the read-only roster Details panel
- **THEN** the group's letter id appears exactly once, as a badge overlaid on the divider above the group's first section, and every section's headline within that group shows only its own title with no id prefix

### Requirement: Chapter units' own upgrade groups display with a continuing letter

For a Space Marines list with a chapter selected, a chapter's own extra unit's own upgrade group heading SHALL show its computed display letter (continuing the base Space Marines faction's own lettering sequence), not its internal namespaced id, in both a selected unit's upgrade controls and the read-only roster Details panel.

#### Scenario: A chapter unit's own group heading shows a continuing letter, not its internal id

- **WHEN** the user views a Blood Angels list's selected Death Company unit's upgrade controls
- **THEN** its own upgrade group headings show single letters (e.g. "P. Replace any Pistol"), not the internal namespaced id (e.g. not "ba-b. Replace any Pistol")

#### Scenario: The roster Details panel shows the same continuing letter

- **WHEN** the user expands a chapter unit's read-only roster Details panel
- **THEN** its own upgrade group headings show the same continuing letter as the selected-unit upgrade controls would

### Requirement: Builder header shows the list's faction and chapter

The builder header SHALL show the open list's faction name below the editable list-name field, and, when the list has a Space Marine chapter selected, the chapter name alongside it in parentheses — matching the "Faction Name (Chapter Name)" format already used for each list on the saved-lists screen. A list with no chapter selected, or for a faction other than Space Marines, SHALL show only the faction name.

#### Scenario: A Space Marines list with a chapter selected

- **WHEN** the user opens a Space Marines list that has a chapter selected (e.g. Blood Angels)
- **THEN** the builder header shows "Space Marines (Blood Angels)" below the list-name field

#### Scenario: A list with no chapter

- **WHEN** the user opens a Space Marines list with no chapter selected, or a list for any other faction
- **THEN** the builder header shows only the faction name below the list-name field, with no parenthetical

#### Scenario: Renaming the list does not affect the faction/chapter line

- **WHEN** the user edits the list-name field
- **THEN** the faction/chapter line below it is unaffected, since it reflects the list's faction and chapter, not its name

### Requirement: Selected Units card headers match the Roster row layout

Each Selected Units card's header row SHALL use the same left-info/right-controls layout as a Roster row: identifying info (name, model count, quality, and points cost) grouped on the left in that order, and only actual controls (combine/group/attach selects, split, leave-group, detach, remove) grouped on the right. This SHALL apply to all four card shapes the Selected Units list renders: a standalone unit, a combined pair, a group-deployment card, and an attached Hero/Wizard/Psyker sub-card.

#### Scenario: A standalone selected unit's cost is part of its info group

- **WHEN** the user views a standalone unit's card in Selected Units
- **THEN** its points cost is shown in the left-hand info group alongside its name/size/quality, and the right-hand group contains only its controls (e.g. Combine/Group/Attach selects, Remove)

#### Scenario: A combined pair's cost is part of its info group

- **WHEN** the user views a combined pair's card in Selected Units
- **THEN** its combined points cost is shown in the left-hand info group, and the right-hand group contains only its Split control

#### Scenario: A group-deployment card's cost is part of its info group

- **WHEN** the user views a group-deployment card in Selected Units
- **THEN** its combined points cost is shown in the left-hand info group, and the right-hand group contains only its "Add to group…" control (when eligible candidates exist)

#### Scenario: An attached sub-card's cost is part of its info group

- **WHEN** the user views an attached Hero/Wizard/Psyker sub-card nested under its host unit
- **THEN** its points cost is shown in the left-hand info group, and the right-hand group contains only its Detach control

### Requirement: Shared visual primitives render consistently across contexts

The system SHALL render buttons, unit-card headlines (name, model count, quality, points cost, and badge), and equipment/special-rules blocks through shared components, so that every occurrence of a given primitive uses identical markup and styling regardless of where it appears. This SHALL hold across the Roster row, all four Selected Units card shapes (standalone unit, combined pair, group-deployment card, attached Hero/Wizard/Psyker sub-card), the roster unit "Details" preview panel, and the saved-lists/create-list screens.

#### Scenario: Buttons share one visual treatment per variant and size

- **WHEN** the user views buttons across the Roster, Selected Units, saved-lists, and Create Army List screens
- **THEN** every button of the same variant (primary/secondary/danger) and size (base/small) renders with identical classes — corner radius, padding, colors, hover state, and typography

#### Scenario: Unit headlines share one format across all card shapes

- **WHEN** the user views the Roster row and each Selected Units card shape (standalone, combined, group, attached)
- **THEN** each headline renders name, model count (when applicable), quality (when applicable), and points cost in the same order and styling, with any badge shown in the same position relative to the info text

#### Scenario: Equipment/special-rules blocks share one format

- **WHEN** the user views a unit's equipment and special rules in the roster "Details" panel or in any Selected Units card shape
- **THEN** the "Equipment:" and "Special:" lines render with identical structure and styling in both places

#### Scenario: A styling change to a shared primitive applies everywhere at once

- **WHEN** a developer changes the styling of the shared button, unit-headline, or equipment/special-rules component
- **THEN** the change is visible in every context that primitive is used, without editing more than one component file

