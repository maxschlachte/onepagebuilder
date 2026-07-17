## MODIFIED Requirements

### Requirement: Combine Infantry units and attach Heroes/Psykers

The system SHALL let a user combine two list entries of the same Infantry-eligible unit into one linked pair that displays and costs as a single bigger unit, where any upgrade option that affects all models SHALL be selected identically on both entries, while an option that affects one model or a bounded subset of models remains independently selectable on each entry. The system SHALL let a user split a combined pair back into two independent entries at any time. A unit is Infantry-eligible when its special rules do not include Hero, Psyker, Monster, or Vehicle. An upgrade option affects all models when it belongs to an upgrade section whose scope is every model in the unit (the sections the rules define as "Replace all…"/"Upgrade all models…"/"Equip all models…"), or when it belongs to a section the data explicitly marks as capped at one grant per unit regardless of model count (e.g. a Warhammer Fantasy faction's Sergeant/Musician/Standard "Upgrade with:" section) even though that section's own printed title doesn't say "all"; an option belonging to any other section — including a single-model swap, an "any"/"up to N models" section, or an unqualified single-item replacement that only ever applies to one specific model in the unit — is not whole-unit, regardless of whether it carries an equipment-replacement effect of its own. A whole-unit option's point cost SHALL be added once per linked entry it is selected on. An option belonging to a section capped at one grant per unit is an exception to this "selected identically on both entries" rule: the system SHALL record it on at most one of the two linked entries (never both), so that the combined pair's cost and any equipment that option grants are inherently counted exactly once, and so that splitting the pair afterward leaves the grant on only the entry that held it — not duplicated onto both, since the unit as a whole only ever had one such grant to begin with. It SHALL still render and toggle from the same "applies to the whole combined pair" control as a genuine whole-unit option, and remains independently purchasable again on either resulting entry once split. When the two entries' equipment is merged for display, entries that are the same item but carry different attached rules (e.g. a plain copy of a weapon and a "Limited" copy of the same weapon) SHALL remain separate entries, each with its own model count, rather than being combined into one entry that reports only one side's rules.

The system SHALL also let a user attach a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality in the same list, purely for organizational display, with no effect on cost or on points-cap/hero-limit validation, and SHALL let the user detach it at any time.

#### Scenario: Combine two copies of the same unit

- **WHEN** a list has two entries of the same Infantry-eligible unit and the user combines them
- **THEN** the two entries become a linked pair that displays as one unit with doubled model count and combined cost

#### Scenario: A whole-unit upgrade applies to both combined entries

- **WHEN** the user selects an upgrade option from a section scoped to every model in the unit (e.g. "Replace all Assault Rifles") on a combined pair
- **THEN** that option is recorded as selected on both linked entries and its point cost is added once per entry

#### Scenario: A once-per-unit upgrade is charged only once for a combined pair

- **WHEN** the user selects an option from a section the data marks as capped at one grant per unit (e.g. Sergeant) on a combined pair, via the same control a genuine whole-unit option uses
- **THEN** the option is recorded on only one of the two linked entries, and the combined pair's cost includes that option's point delta exactly once

#### Scenario: A once-per-unit upgrade's equipment is shown once for a combined pair

- **WHEN** a once-per-unit option (e.g. Sergeant) is selected on a combined pair
- **THEN** the combined pair's displayed equipment shows that option's granted equipment (e.g. the Sergeant gear entry) with a model count of one, not doubled

#### Scenario: Combining two entries that each already independently selected the same once-per-unit option collapses to one

- **WHEN** each of two entries of the same Infantry-eligible unit independently selected the same once-per-unit option before being combined (a state the app allowed prior to this fix, or a previously-saved list), and the user combines them
- **THEN** the resulting combined pair records that option on only one of the two linked entries, not both

#### Scenario: Splitting a combined pair leaves a once-per-unit upgrade on only the entry that held it

- **WHEN** a combined pair has a once-per-unit option (e.g. Sergeant) selected, and the user splits the pair back into two independent entries
- **THEN** only the one entry that actually held the selection keeps it; the other entry has none, and may independently purchase its own copy going forward

#### Scenario: A single-model upgrade stays independent per combined entry

- **WHEN** the user selects an upgrade option from a section scoped to one model or a bounded subset (e.g. "Replace one Stormbolter", "Upgrade one model with one", or an unqualified single-item section like "Replace Autocannon") on one entry of a combined pair
- **THEN** that selection applies only to the entry it was selected on, leaving the other entry's selections unaffected — even when the option carries no equipment-replacement effect of its own (e.g. a leader-only upgrade that only grants a special rule)

#### Scenario: A rule-variant of a merged equipment item stays its own entry

- **WHEN** one entry of a combined pair has a plain copy of a weapon and the other entry has a rule-bearing variant of the same weapon (e.g. a "Limited" attachment) selected
- **THEN** the combined pair's displayed equipment shows two separate entries — one for the plain copy, one for the rule-bearing variant with its rule shown — instead of merging them into one entry that omits the variant's rule

#### Scenario: Split a combined pair

- **WHEN** the user splits a combined pair
- **THEN** the two entries become independent again, each keeping its own selected upgrades

#### Scenario: Removing one entry of a combined pair splits it

- **WHEN** the user removes one entry of a combined pair from the list
- **THEN** the remaining entry becomes independent (no longer combined) rather than referencing a removed entry

#### Scenario: Attach a Hero to a same-Quality Infantry unit

- **WHEN** the user attaches a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality
- **THEN** the two entries are linked for display, with no change to either entry's cost or to the list's hero count

#### Scenario: Attaching to a mismatched target is rejected

- **WHEN** the user attempts to attach a Hero or Psyker to a list entry with a different Quality, or to a unit that is not Infantry-eligible
- **THEN** the attachment is not made

#### Scenario: Detach a Hero

- **WHEN** the user detaches a previously attached Hero or Psyker
- **THEN** the two entries are shown independently again
