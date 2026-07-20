## MODIFIED Requirements

### Requirement: Edit units and upgrades in the builder

The system SHALL display each selected unit with its effective stats and SHALL provide controls to select that unit's available upgrade options and to remove the unit. The displayed equipment list SHALL reflect weapon additions, removals, and replacements from the unit's currently selected upgrades, not only its baseline loadout, with each weapon's range/attacks and any special rules shown together in a single bracket (e.g. `(24", A1, Piercing)`), the rules rendered as hoverable tooltips. If a unit's effective equipment (after all currently selected upgrades) contains no melee weapon, the displayed equipment list SHALL include a default `Light CCW` entry with its range/attacks bracket, per the rule that units without a melee weapon count as using Light CCWs/Claws. For a unit with more than one model, each equipment line SHALL be prefixed with the number of models in the unit currently carrying it (e.g. `4x Assault Rifle`), reflecting partial upgrades that replace only some of the unit's models' weapons; a single-model unit's equipment list SHALL NOT show this prefix. An upgrade option that adds one or more weapons SHALL show each added weapon's range/attacks and rules in that same single bracket next to the option itself, computed from that option's own equipment effect — visible as soon as the option is listed, before it is selected — rather than only once the weapon appears in the unit's effective equipment list; this applies identically to the read-only roster "Details" panel, since it lists upgrade options through the same rendering. This bracketed format SHALL be identical between a unit's equipment list and its upgrade-option rows, sharing one rendering. When a selected upgrade grants a parameterized special rule (e.g. `Psyker(N)`, `Wizard(N)`, `Tough(N)`, `Impact(N)`) that the unit's baseline already carries (or that another selected upgrade already granted) under the same rule name: if the granted value is a plain tier level, the unit's effective special rules SHALL show only the single highest tier, not each tier separately; if the granted value is an additive bonus (printed as `+N` on the upgrade), it SHALL be combined with the unit's existing value for that rule, producing one combined entry rather than a second separate one. Combining SHALL account for every contributing value, never discarding one: where the existing value and the bonus are both plain numbers they SHALL be summed into a single number, and where either is a dice expression (e.g. a baseline `Impact(D3)` or a bonus of `+D6`) they SHALL be joined into a single expression preserving each contributor as printed (e.g. `Impact(D3+1)`, `Impact(2D6+D6)`), rather than the unit showing only one of them.

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

#### Scenario: An additive bonus combines with a dice-expression baseline

- **WHEN** the user selects an `Impact(+1)` upgrade option on a unit whose baseline special rules include `Impact(D3)`
- **THEN** the unit's effective special rules show a single `Impact(D3+1)` entry, not `Impact(D3)` alone and not two separate `Impact` entries

#### Scenario: A dice-expression bonus combines with a dice-expression baseline

- **WHEN** the user selects an `Impact(+D6)` upgrade option on a unit whose baseline special rules include `Impact(2D6)`
- **THEN** the unit's effective special rules show a single `Impact(2D6+D6)` entry, preserving both contributors as printed

#### Scenario: No contributing value is dropped for any parameterized rule

- **WHEN** a unit's baseline special rules and its selected upgrades contribute two or more values for the same parameterized rule, in any combination of plain-number and dice-expression forms
- **THEN** the single merged entry accounts for every contributing value, and no contributor is silently discarded
