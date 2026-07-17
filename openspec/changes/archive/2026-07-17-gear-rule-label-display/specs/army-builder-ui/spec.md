## MODIFIED Requirements

### Requirement: Hover tooltips for rules

The system SHALL display the full explanatory text of a special rule, army special rule, psychic power, or weapon rule when the user hovers over its name in the builder. An upgrade option whose label names a rule it grants (the whole label, or the text before a trailing parenthetical) SHALL show the same hover tooltip on that label, before the option is even selected. An upgrade option that grants one or more rules via a bare label that does not name any of them SHALL instead render its label as plain text, followed by its granted rules as a separate comma-joined list, each rendered with the same hover tooltip, before the option is even selected. A rule an option grants via a weapon-less `addEquipment` entry (e.g. a `gear(...)` item carrying `rules`) counts as a rule that option grants for both of the preceding sentences, exactly the same as a rule granted directly via `adds` — the source of the grant (`adds` vs. a non-weapon equipment entry) SHALL NOT affect whether or how it is shown.

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

#### Scenario: Upgrade option with a bare label shows its granted rules as separate chips

- **WHEN** an upgrade option's label (e.g. `Jump Pack`) names none of the rules it grants (e.g. `Deep Strike`, `Flying`)
- **THEN** the label renders as plain text, and each granted rule renders immediately after it as its own hoverable tooltip chip, with no rule's name or text duplicated

#### Scenario: An option granting a rule via gear whose label matches the rule's name shows a hoverable label

- **WHEN** an upgrade option adds a weapon-less `gear(...)` equipment entry carrying a single rule, and the option's label (e.g. `Sergeant`) is exactly that rule's resolved name
- **THEN** the whole label renders with the same hover tooltip it would if the rule had been granted via `adds` instead, with no separate bracketed chip appended

#### Scenario: An option granting a rule via gear whose label names the gear rather than the rule shows a chip

- **WHEN** an upgrade option adds a weapon-less `gear(...)` equipment entry carrying a rule, and the option's label (e.g. `Zephyrglaive`) names the gear item rather than the rule it grants
- **THEN** the label renders as plain text, followed by the granted rule rendered as its own hoverable chip, the same as a bare-label `adds`-granted rule would render
