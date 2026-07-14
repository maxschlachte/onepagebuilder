## MODIFIED Requirements

### Requirement: Typed rules schema

The system SHALL define a typed schema for the rulesets it supports comprising factions, unit profiles, weapon profiles, upgrade groups, special rules, psychic powers, and army-composition limits. Every faction SHALL be tagged with the `GameSystem` it belongs to (`system-40k` or `system-fantasy`). All rules content SHALL be derived exclusively from that system's source document: `1p40k - Main Rulebook v3.3.1.pdf` for `system-40k`, `one-page-fantasy-army-lists.md` for `system-fantasy`.

#### Scenario: Schema covers all rule entities

- **WHEN** the rules dataset is loaded
- **THEN** it exposes factions (each tagged with its game system), a special-rule glossary per game system, a global weapon table, and army-composition limits as strongly-typed objects with no untyped `any` fields for core entities

#### Scenario: Data sourced only from each system's own document

- **WHEN** any unit, weapon, special rule, psychic power/magic spell, or point cost is added to the dataset for a given faction
- **THEN** its values match the corresponding entry in that faction's game system's source document, and no value originates from any other source

## ADDED Requirements

### Requirement: Warhammer Fantasy faction data

The system SHALL encode, for every faction in `one-page-fantasy-army-lists.md`, each unit's name, size, quality, equipment, special rules, available upgrade-group letters, points cost, and whether it is a Hero, using the same schema and authoring conventions as Warhammer 40k factions, tagged with the `system-fantasy` game system.

#### Scenario: All 16 Warhammer Fantasy factions present

- **WHEN** the dataset is queried for factions tagged `system-fantasy`
- **THEN** it returns the 16 factions from `one-page-fantasy-army-lists.md` (Empire, Orcs, Goblins, High Elves, Warriors of Chaos, Dwarfs, Skaven, Lizardmen, Ogre Kingdoms, Dark Elves, Tomb Kings, Vampire Counts, Bretonnia, Beastmen, Wood Elves, Daemons of Chaos)

#### Scenario: Standalone units match the source table

- **WHEN** a faction's `units` list is read
- **THEN** it includes every standalone unit (including war machines, monsters, and mount-only entries printed with their own Quality/cost row) listed in that faction's table in `one-page-fantasy-army-lists.md`

#### Scenario: Army rules and magic spells are not cross-contaminated

- **WHEN** a faction's `armyRules` or `psychicPowers` entries are read
- **THEN** each entry's name and text belong to a single rule or spell as printed for that faction in the source document, with no fragment of an unrelated unit's upgrade-cost text or another rule's description appended, and no faction has an empty `armyRules` array if its source document lists any army special rules

#### Scenario: Wizard abilities resolve to a valid rule reference

- **WHEN** a unit's baseline `special` text or an upgrade option includes a `Wizard(N)` ability as printed in the source document
- **THEN** it is stored as a `Wizard` rule reference with parameter `N` (i.e. authored as `Wizard(N)`), resolvable against the Warhammer Fantasy glossary's own `wizard` entry — never as a bare numeric or unresolvable rule id

### Requirement: Per-system special-rule glossary

The system SHALL maintain a separate special-rule glossary for each game system (`RulesDatabase.glossaries`, keyed by `GameSystem`) rather than a single shared glossary, and SHALL resolve a rule reference against the glossary of the referencing unit's faction's own game system. The Warhammer Fantasy glossary SHALL be sourced from the Warhammer Fantasy core-rules document(s) (e.g. `one-page-fantasy-rules.md`'s "Unit Types" and "Common Special Rules" sections), independently of the Warhammer 40k glossary, since a same-named rule may differ in wording or mechanic between the two systems (e.g. `Poison`, `Furious`).

#### Scenario: Same-named rules can differ between systems

- **WHEN** the `poison` rule is resolved for a Warhammer 40k faction and separately for a Warhammer Fantasy faction
- **THEN** each resolves to that system's own glossary text, which may describe a different mechanic

#### Scenario: Wizard is its own glossary entry, not an alias of Psyker

- **WHEN** the Warhammer Fantasy glossary is queried for the `wizard` rule id
- **THEN** it returns Warhammer Fantasy's own sourced text for Wizard, independently of the Warhammer 40k glossary's `psyker` entry
