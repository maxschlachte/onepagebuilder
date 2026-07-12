# army-builder-ui Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Faction selection and unit roster

The system SHALL let the user choose a faction for the current list and SHALL display that faction's available units with their key stats for adding to the list. For a Space Marines list with a chapter selected, the roster SHALL also include that chapter's extra units alongside the base Space Marines units, ordered by category — Heroes/Psykers first, then Infantry, then Vehicles, then any other category — with each chapter unit placed within the same category as its base-faction peers rather than appended as a separate block after all base units; within a category, base units SHALL keep their existing relative order followed by the chapter's units of that category in their existing relative order. Each roster unit SHALL show a "Details" button, separate from its add control; activating it expands an inline panel showing that unit's baseline equipment, special rules, and every available upgrade section and option with its cost (read-only — no selection controls), and activating it again collapses the panel. The expanded panel SHALL NOT repeat the unit's name, and SHALL NOT render as a bordered/boxed panel nested inside the roster row's own box — it is separated from the row above it by a divider only. A roster unit whose special rules include Hero SHALL show a "Hero" badge; a roster unit that is not Hero but whose special rules include Psyker SHALL show a "Psyker" badge. Below the mobile breakpoint, the roster is one of the two panels the tab switcher toggles between.

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

#### Scenario: Psyker badge

- **WHEN** a roster unit's special rules include Psyker and do not include Hero
- **THEN** the roster entry shows a "Psyker" badge

#### Scenario: A Hero Psyker shows only the Hero badge

- **WHEN** a roster unit's special rules include both Hero and Psyker
- **THEN** the roster entry shows only the "Hero" badge, not both

### Requirement: Edit units and upgrades in the builder

The system SHALL display each selected unit with its effective stats and SHALL provide controls to select that unit's available upgrade options and to remove the unit. The displayed equipment list SHALL reflect weapon additions, removals, and replacements from the unit's currently selected upgrades, not only its baseline loadout, with each weapon's range/attacks shown in brackets and its special rules shown as hoverable tooltips. If a unit's effective equipment (after all currently selected upgrades) contains no melee weapon, the displayed equipment list SHALL include a default `Light CCW` entry with its range/attacks bracket, per the rule that units without a melee weapon count as using Light CCWs/Claws. For a unit with more than one model, each equipment line SHALL be prefixed with the number of models in the unit currently carrying it (e.g. `4x Assault Rifle`), reflecting partial upgrades that replace only some of the unit's models' weapons; a single-model unit's equipment list SHALL NOT show this prefix. An upgrade option that adds one or more weapons SHALL show each added weapon's range/attacks bracket and rule chips next to the option itself, computed from that option's own equipment effect — visible as soon as the option is listed, before it is selected — rather than only once the weapon appears in the unit's effective equipment list; this applies identically to the read-only roster "Details" panel, since it lists upgrade options through the same rendering.

#### Scenario: Upgrade controls reflect available groups

- **WHEN** a selected unit has upgrade-group letters
- **THEN** the builder shows the options for those groups with their point costs, and selecting one updates the unit's stats and cost

#### Scenario: Remove control

- **WHEN** the user activates a unit's remove control
- **THEN** the unit is removed from the list

#### Scenario: Selecting a weapon-replacing upgrade updates the equipment list

- **WHEN** the user selects an upgrade option that replaces one of the unit's weapons
- **THEN** the unit's displayed equipment list updates to show the new weapon, with its range/attacks in brackets and any special rules shown as tooltipped chips

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
- **THEN** the option's row shows that weapon's range/attacks in brackets and its rules as tooltipped chips, matching how the same weapon would be shown once equipped

#### Scenario: A multi-weapon option shows stats for each weapon it adds

- **WHEN** the builder lists an upgrade option whose effect adds more than one weapon (e.g. a pistol and a CCW)
- **THEN** each added weapon's own range/attacks and rules are shown next to the option, in the same order the option's label names them

#### Scenario: The roster details panel also shows inferred weapon stats

- **WHEN** the user expands a roster unit's read-only "Details" panel and it lists an upgrade option that adds a weapon
- **THEN** that option's row shows the same inferred range/attacks/rule chips as the equivalent option in a selected unit's upgrade panel, with no selection control

### Requirement: Live totals and validation display

The system SHALL display the running point total, the points cap, the hero count, and any validation issues, updating them as the list changes.

#### Scenario: Totals update live

- **WHEN** the user adds, upgrades, or removes a unit
- **THEN** the displayed total, hero count, and validation messages update immediately

#### Scenario: Over-cap indication

- **WHEN** the list total exceeds the points cap
- **THEN** the builder visibly indicates the over-cap state

### Requirement: Hover tooltips for rules

The system SHALL display the full explanatory text of a special rule, army special rule, psychic power, or weapon rule when the user hovers over its name in the builder. An upgrade option whose label names a rule it grants (the whole label, or the text before a trailing parenthetical) SHALL show the same hover tooltip on that label, before the option is even selected.

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

Below a mobile-width breakpoint, the system SHALL show a tab switcher letting the user view either the Roster or the Selected Units panel, one at a time, instead of both stacked in sequence. At and above that breakpoint, the system SHALL continue to show both panels side by side, with no tab switcher, exactly as without this requirement.

#### Scenario: Tab switcher shown below the breakpoint

- **WHEN** the builder is viewed at a mobile-width viewport
- **THEN** a tab switcher for "Roster" and "Selected Units" is shown, and only the active tab's panel is visible

#### Scenario: Switching tabs changes the visible panel

- **WHEN** the user activates the other tab in the mobile tab switcher
- **THEN** the previously-hidden panel becomes visible and the previously-visible panel becomes hidden

#### Scenario: No tab switcher at desktop width

- **WHEN** the builder is viewed at desktop width
- **THEN** no tab switcher is shown, and both the Roster and Selected Units panels are visible side by side

### Requirement: Touch-friendly control sizing in the builder

The system SHALL size the builder's interactive controls (buttons and select dropdowns, in the roster and in selected-unit cards) for comfortable touch use rather than the smallest size a mouse-oriented layout would use.

#### Scenario: Roster and selected-unit controls are touch-sized

- **WHEN** the user views a roster row or a selected-unit card
- **THEN** its buttons and select dropdowns (e.g. Details, Add, Split, Remove, Leave group, Detach, Combine/Attach/Group selects) render at the builder's touch-friendly control size, not the smallest available size

### Requirement: Chapter Tactics options in the builder

For a Space Marines list with a chapter selected, the system SHALL show that chapter's rule-modifier option(s) as an additional upgrade choice on every base Space Marines unit the modifier applies to (by unit category — Infantry, Vehicle, Hero — or by specific unit name, per the chapter's printed modifiers), alongside the unit's normal upgrade groups, with the option's point cost and granted rule following the same display and selection behavior as any other upgrade option. The chapter's own extra units SHALL NOT show that chapter's own Chapter Tactics options, even when the unit's category or name would otherwise match. The Chapter Tactics section heading SHALL NOT display the synthesized group's internal id — unlike a real lettered upgrade group's heading (e.g. "A. Replace one Assault Rifle"), it SHALL show only the section title ("Chapter Tactics").

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
- **THEN** the section heading shows only "Chapter Tactics", with no group id prefix

#### Scenario: A real lettered group's heading is unaffected

- **WHEN** the user views any other (non-Chapter-Tactics) upgrade group's heading
- **THEN** it continues to show the group's letter id followed by the section title, exactly as before this change

