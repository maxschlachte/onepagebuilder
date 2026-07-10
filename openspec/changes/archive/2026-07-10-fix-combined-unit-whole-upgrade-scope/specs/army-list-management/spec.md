## MODIFIED Requirements

### Requirement: Combine Infantry units and attach Heroes/Psykers

The system SHALL let a user combine two list entries of the same Infantry-eligible unit into one linked pair that displays and costs as a single bigger unit, where any upgrade option that affects all models SHALL be selected identically on both entries, while an option that affects one model or a bounded subset of models remains independently selectable on each entry. The system SHALL let a user split a combined pair back into two independent entries at any time. A unit is Infantry-eligible when its special rules do not include Hero, Psyker, Monster, or Vehicle. An upgrade option affects all models only when it belongs to an upgrade section whose scope is every model in the unit (the sections the rules define as "Replace all…"/"Upgrade all models…"/"Equip all models…"); an option belonging to any other section — including a single-model swap, an "any"/"up to N models" section, or an unqualified single-item replacement that only ever applies to one specific model in the unit — is not whole-unit, regardless of whether it carries an equipment-replacement effect of its own.

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
