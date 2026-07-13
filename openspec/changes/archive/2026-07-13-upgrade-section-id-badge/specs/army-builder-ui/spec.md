## MODIFIED Requirements

### Requirement: Chapter Tactics options in the builder

For a Space Marines list with a chapter selected, the system SHALL show that chapter's rule-modifier option(s) as an additional upgrade choice on every base Space Marines unit the modifier applies to (by unit category — Infantry, Vehicle, Hero — or by specific unit name, per the chapter's printed modifiers), alongside the unit's normal upgrade groups, with the option's point cost and granted rule following the same display and selection behavior as any other upgrade option. The chapter's own extra units SHALL NOT show that chapter's own Chapter Tactics options, even when the unit's category or name would otherwise match. A real lettered upgrade group's id SHALL render once per group, as a badge overlaid on the divider above the group's sections, rather than as a text prefix on each section's headline; the Chapter Tactics section heading SHALL NOT display the synthesized group's internal id — it renders no id badge on its divider, and its section heading SHALL show only the section title ("Chapter Tactics").

#### Scenario: A category-wide Chapter Tactics option appears on every eligible base unit

- **WHEN** the user views a Blood Angels list's roster or a selected base Space Marines Infantry unit's upgrade controls
- **THEN** a "Furious" option at +10pts is shown, available on that unit and on every other base Space Marines Infantry-eligible unit in the list

#### Scenario: A named-unit Chapter Tactics option appears only on that unit

- **WHEN** the user views a Dark Angels list's selected Terminators unit
- **THEN** a "Deathwing" option at +20pts is shown on that unit, and is not shown on units other than Terminators

#### Scenario: A chapter's own unit never shows that chapter's own Chapter Tactics options

- **WHEN** the user views a Blood Angels list's roster or a selected Death Company unit (a Blood Angels-specific unit that already carries Rage, implying Furious)
- **THEN** no Chapter Tactics section is shown for Death Company, even though it is Infantry-eligible

#### Scenario: Selecting a Chapter Tactics option updates cost and rules like any other option

- **WHEN** the user selects a Chapter Tactics option on an eligible unit
- **THEN** the unit's special rules include the granted rule and its cost includes the option's point delta, and the option's rule label shows the same hover tooltip as any other rule reference

#### Scenario: No Chapter Tactics options without a chapter

- **WHEN** the user views the builder for a Space Marines list with no chapter selected
- **THEN** no Chapter Tactics options are shown on any unit

#### Scenario: Chapter Tactics heading omits the internal group id

- **WHEN** the user views a unit's Chapter Tactics section, in either a selected unit's upgrade controls or the read-only roster Details panel
- **THEN** the section heading shows only "Chapter Tactics", with no group id prefix, and the divider above it renders with no id badge

#### Scenario: A real lettered group's id renders once as a badge on the divider

- **WHEN** the user views any other (non-Chapter-Tactics) upgrade group with more than one section, in either a selected unit's upgrade controls or the read-only roster Details panel
- **THEN** the group's letter id appears exactly once, as a badge overlaid on the divider above the group's first section, and every section's headline within that group shows only its own title with no id prefix
