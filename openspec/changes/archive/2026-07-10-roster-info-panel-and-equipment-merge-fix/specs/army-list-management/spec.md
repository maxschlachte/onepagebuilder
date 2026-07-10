## MODIFIED Requirements

### Requirement: Combine Infantry units and attach Heroes/Psykers

The system SHALL let a user combine two list entries of the same Infantry-eligible unit into one linked pair that displays and costs as a single bigger unit, where any upgrade option that affects all models SHALL be selected identically on both entries, while an option that affects one model or a bounded subset of models remains independently selectable on each entry. The system SHALL let a user split a combined pair back into two independent entries at any time. A unit is Infantry-eligible when its special rules do not include Hero, Psyker, Monster, or Vehicle. An upgrade option affects all models only when it belongs to an upgrade section whose scope is every model in the unit (the sections the rules define as "Replace all…"/"Upgrade all models…"/"Equip all models…"); an option belonging to any other section — including a single-model swap, an "any"/"up to N models" section, or an unqualified single-item replacement that only ever applies to one specific model in the unit — is not whole-unit, regardless of whether it carries an equipment-replacement effect of its own. When the two entries' equipment is merged for display, entries that are the same item but carry different attached rules (e.g. a plain copy of a weapon and a "Limited" copy of the same weapon) SHALL remain separate entries, each with its own model count, rather than being combined into one entry that reports only one side's rules.

The system SHALL also let a user attach a Hero or Psyker list entry to an Infantry-eligible list entry of the same Quality in the same list, purely for organizational display, with no effect on cost or on points-cap/hero-limit validation, and SHALL let the user detach it at any time.

#### Scenario: Combine two copies of the same unit

- **WHEN** a list has two entries of the same Infantry-eligible unit and the user combines them
- **THEN** the two entries become a linked pair that displays as one unit with doubled model count and combined cost

#### Scenario: A whole-unit upgrade applies to both combined entries

- **WHEN** the user selects an upgrade option from a section scoped to every model in the unit (e.g. "Replace all Assault Rifles") on a combined pair
- **THEN** that option is recorded as selected on both linked entries and its point cost is added once per entry

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

### Requirement: Combine units sharing a group-deployment rule

The system SHALL let a user combine up to 10 list entries whose unit profiles share a common "group-deployment" army rule — an army rule whose text says up to some number of models with that rule may deploy together as one unit (e.g. Conclave, Warband, Beastmaster, Court) — into one linked group that displays and costs as a single unit, regardless of whether the entries share the same unit id. Unlike combining two Infantry-eligible units of the same unit id, group members may be different unit types, and the combined member count (summed across each member's model count) SHALL NOT exceed the rule's stated cap. The system SHALL let a user remove a single entry from a group at any time, leaving the remaining members linked. When members' equipment is merged for display, entries that are the same item but carry different attached rules (e.g. a plain copy of a weapon and a "Limited" copy of the same weapon) SHALL remain separate entries, each with its own model count, rather than being combined into one entry that reports only one member's rules.

#### Scenario: Combine entries sharing a group-deployment rule

- **WHEN** a list has two or more entries whose unit profiles share the same group-deployment army rule (e.g. two different Inquisition Warband units) and the user combines them
- **THEN** the entries become a linked group that displays as one unit with summed model count and summed cost

#### Scenario: Entries without a shared group-deployment rule cannot combine

- **WHEN** the user attempts to combine two entries whose unit profiles share no common group-deployment army rule
- **THEN** the combination is rejected

#### Scenario: The group's model count is capped by the rule's stated limit

- **WHEN** combining an entry into a group would make the group's summed model count exceed the group-deployment rule's stated cap (e.g. 10 models)
- **THEN** the combination is rejected

#### Scenario: Remove one entry from a group

- **WHEN** the user removes a single entry from a group of 3 or more members
- **THEN** that entry becomes independent and the remaining members stay linked as a smaller group

#### Scenario: Removing a list entry that belongs to a group unlinks it cleanly

- **WHEN** the user removes a list entry that is a member of a group from the list entirely
- **THEN** the remaining group members stay linked to each other, with no reference to the removed entry

#### Scenario: A rule-variant of a merged equipment item stays its own entry in a group

- **WHEN** one group member has a plain copy of a weapon and another member has a rule-bearing variant of the same weapon (e.g. a "Limited" attachment) selected
- **THEN** the group's displayed equipment shows two separate entries — one for the plain copy, one for the rule-bearing variant with its rule shown — instead of merging them into one entry that omits the variant's rule
