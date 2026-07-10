## MODIFIED Requirements

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
