## MODIFIED Requirements

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules. An option whose printed effect adds, removes, or replaces a weapon SHALL record that as an equipment effect rather than only a cost delta. A "replace one/up to N" option (as opposed to "replace all") SHALL reduce the model-count of the replaced weapon's equipment entry by one (removing it entirely once its count reaches zero) and record the newly added weapon as carried by exactly one model, regardless of the unit's total size — matching labels case-insensitively and pluralization-insensitively, since a declaration authored against a single-model unit's singular baseline label (e.g. `Assault Rifle`) SHALL also match a multi-model unit's pluralized baseline label (e.g. `Assault Rifles`). A "replace all" option SHALL always remove every copy of the replaced weapon and record the new weapon as carried by every model in the unit, regardless of unit size.

#### Scenario: Upgrade option records cost delta

- **WHEN** an upgrade option such as Space Marines group A "Jump Pack (Deep Strike, Flying)" is read
- **THEN** it records a point delta of `+10` and effects that add the Deep Strike and Flying special rules

#### Scenario: Units reference their upgrade groups

- **WHEN** a unit profile lists upgrade letters (e.g. `A, H`)
- **THEN** those letters resolve to that faction's corresponding upgrade groups

#### Scenario: A weapon-replacing option on a single-model unit swaps the displayed weapon

- **WHEN** a "replace one X" option is selected on a unit that has exactly one model and exactly one copy of X
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by that one model

#### Scenario: The same option on a multi-model unit reduces X's count and adds the new weapon

- **WHEN** the same "replace one X" option is selected on a unit with more than one model
- **THEN** the unit's effective equipment still includes X but with its model-count reduced by one, and now also includes the option's weapon carried by exactly one model

#### Scenario: A "replace all X" option always swaps the displayed weapon

- **WHEN** a "replace all X" option is selected, regardless of unit size
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by every model in the unit

#### Scenario: A singular-authored replacement target matches a pluralized baseline label

- **WHEN** an upgrade option declares its replacement target as `Assault Rifle` (singular) and is selected on a unit whose baseline equipment label is `Assault Rifles` (plural)
- **THEN** the unit's `Assault Rifles` entry's model-count is reduced by one
