## MODIFIED Requirements

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
