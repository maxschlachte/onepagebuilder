## MODIFIED Requirements

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules. An option whose printed effect adds, removes, or replaces a weapon SHALL record that as an equipment effect rather than only a cost delta. A "replace one/up to N" option (as opposed to "replace all") SHALL reduce the model-count of the replaced weapon's equipment entry by one (removing it entirely once its count reaches zero) and record the newly added weapon as carried by exactly one model, regardless of the unit's total size — matching the target entry by its stable equipment key rather than its display label, so a declaration authored once against a unit's baseline entry matches regardless of that entry's size-dependent pluralized label text (e.g. `Assault Rifle` vs `Assault Rifles`). A "replace all" option SHALL always remove every copy of the replaced weapon and record the new weapon as carried by every model in the unit, regardless of unit size, likewise matched by equipment key. A "replace one/up to N" option's model-count reduction targets how many *models* carry an equipment entry; it SHALL NOT be applied to an equipment entry that represents multiple weapon copies carried by a single model (the entry's `count` field, e.g. a single vehicle's `3x Disintegrator Cannons`) — such an entry SHALL be left fully intact by the option, which only adds the new weapon, since reducing a one-model entry's model-count from one to zero would incorrectly discard every copy at once rather than one. An option whose label names a special rule (e.g. `Night Shields (Stealth)`) SHALL record that rule as an added special-rule effect (directly, or via a weapon it adds that itself carries the rule) rather than recording only a cost delta. An option's label SHALL NOT embed a weapon's printed profile (its range and/or attacks, e.g. `(36”, A6x)`) — an option that adds a weapon via `addEquipment` records that weapon's profile there, and it alone is the source of truth for that weapon's stats.

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

#### Scenario: A replacement target matches regardless of the baseline entry's pluralized label

- **WHEN** an upgrade option declares its replacement target as the equipment key belonging to `Assault Rifle` and is selected on a unit whose baseline equipment entry carries that key but displays the label `Assault Rifles` (plural, for a multi-model unit)
- **THEN** the unit's `Assault Rifles` entry's model-count is reduced by one

#### Scenario: A single-model unit's multi-copy weapon is not fully removed by a per-model swap

- **WHEN** a "replace one/any X" option is selected on a single-model unit whose baseline equipment entry for X carries more than one weapon copy (e.g. Dark Eldar Ravager's `3x Disintegrator Cannons`)
- **THEN** the unit's effective equipment still includes the full, unchanged X entry, and now also includes the option's weapon carried by one model

#### Scenario: A rule-granting option records its rule as an effect

- **WHEN** an upgrade option's label names a special rule (e.g. `Night Shields (Stealth)`, `Chain-Snares (Impact(+D3))`)
- **THEN** the resulting option effect includes that rule as an added special-rule reference, resolvable via the glossary like any other special rule, rather than only a cost delta

#### Scenario: A weapon-adding option's label carries no stats of its own

- **WHEN** an upgrade option adds a weapon (e.g. a Dark Lance, range `36`, attacks `6`) via `addEquipment`
- **THEN** the option's `label` names the weapon but does not include its range or attacks, and the weapon's actual profile is read from the `addEquipment` entry, not parsed from the label
