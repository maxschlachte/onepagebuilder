## MODIFIED Requirements

### Requirement: Warhammer Fantasy faction data

The system SHALL encode, for every faction in `one-page-fantasy-army-lists.md`, each unit's name, size, quality, equipment, special rules, available upgrade-group letters, points cost, and whether it is a Hero, using the same schema and authoring conventions as Warhammer 40k factions, tagged with the `system-fantasy` game system.

#### Scenario: All 16 Warhammer Fantasy factions present

- **WHEN** the dataset is queried for factions tagged `system-fantasy`
- **THEN** it returns the 16 factions from `one-page-fantasy-army-lists.md` (Empire, Orcs, Goblins, High Elves, Warriors of Chaos, Dwarfs, Skaven, Lizardmen, Ogre Kingdoms, Dark Elves, Tomb Kings, Vampire Counts, Bretonnia, Beastmen, Wood Elves, Daemons of Chaos)

#### Scenario: Standalone units match the source table

- **WHEN** a faction's `units` list is read
- **THEN** it includes every standalone unit (including war machines, monsters, and mount-only entries printed with their own Quality/cost row) listed in that faction's table in `one-page-fantasy-army-lists.md`

#### Scenario: A mount upgrade option grants that mount's own equipment

- **WHEN** a unit's upgrade option adds a mount (a "Mount on:"-style section, or an equivalent single mount option such as "Replace Chaintrap:")
- **THEN** the option's `addEquipment` includes the weapon and the full special-rules list printed on that mount's own standalone-unit row in `one-page-fantasy-army-lists.md`, not a bare named equipment entry carrying no weapon and no rules

#### Scenario: Army rules and magic spells are not cross-contaminated

- **WHEN** a faction's `armyRules` or `psychicPowers` entries are read
- **THEN** each entry's name and text belong to a single rule or spell as printed for that faction in the source document, with no fragment of an unrelated unit's upgrade-cost text or another rule's description appended, and no faction has an empty `armyRules` array if its source document lists any army special rules

#### Scenario: Wizard abilities resolve to a valid rule reference

- **WHEN** a unit's baseline `special` text or an upgrade option includes a `Wizard(N)` ability as printed in the source document
- **THEN** it is stored as a `Wizard` rule reference with parameter `N` (i.e. authored as `Wizard(N)`), resolvable against the Warhammer Fantasy glossary's own `wizard` entry — never as a bare numeric or unresolvable rule id
