## MODIFIED Requirements

### Requirement: Chapter Tactics options in the builder

For a Space Marines list with a chapter selected, the system SHALL show that chapter's rule-modifier option(s) as an additional upgrade choice on every unit the modifier applies to (by unit category — Infantry, Vehicle, Hero — or by specific unit name, per the chapter's printed modifiers), alongside the unit's normal upgrade groups, with the option's point cost and granted rule following the same display and selection behavior as any other upgrade option. The Chapter Tactics section heading SHALL NOT display the synthesized group's internal id — unlike a real lettered upgrade group's heading (e.g. "A. Replace one Assault Rifle"), it SHALL show only the section title ("Chapter Tactics").

#### Scenario: A category-wide Chapter Tactics option appears on every eligible unit

- **WHEN** the user views a Blood Angels list's roster or a selected Infantry unit's upgrade controls
- **THEN** a "Furious" option at +10pts is shown, available on that unit and on every other Infantry-eligible unit in the list

#### Scenario: A named-unit Chapter Tactics option appears only on that unit

- **WHEN** the user views a Dark Angels list's selected Terminators unit
- **THEN** a "Deathwing" option at +20pts is shown on that unit, and is not shown on units other than Terminators

#### Scenario: Selecting a Chapter Tactics option updates cost and rules like any other option

- **WHEN** the user selects a Chapter Tactics option on an eligible unit
- **THEN** the unit's special rules include the granted rule and its cost includes the option's point delta, and the option's rule label shows the same hover tooltip as any other rule reference

#### Scenario: No Chapter Tactics options without a chapter

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** no Chapter Tactics options are shown on any unit

#### Scenario: Chapter Tactics heading omits the internal group id

- **WHEN** the user views a unit's Chapter Tactics section, in either a selected unit's upgrade controls or the read-only roster Details panel
- **THEN** the section heading shows only "Chapter Tactics", with no group id prefix

#### Scenario: A real lettered group's heading is unaffected

- **WHEN** the user views any other (non-Chapter-Tactics) upgrade group's heading
- **THEN** it continues to show the group's letter id followed by the section title, exactly as before this change
