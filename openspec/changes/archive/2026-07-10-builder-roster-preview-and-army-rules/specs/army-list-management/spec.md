## ADDED Requirements

### Requirement: Combine units sharing a group-deployment rule

The system SHALL let a user combine up to 10 list entries whose unit profiles share a common "group-deployment" army rule — an army rule whose text says up to some number of models with that rule may deploy together as one unit (e.g. Conclave, Warband, Beastmaster, Court) — into one linked group that displays and costs as a single unit, regardless of whether the entries share the same unit id. Unlike combining two Infantry-eligible units of the same unit id, group members may be different unit types, and the combined member count (summed across each member's model count) SHALL NOT exceed the rule's stated cap. The system SHALL let a user remove a single entry from a group at any time, leaving the remaining members linked.

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
