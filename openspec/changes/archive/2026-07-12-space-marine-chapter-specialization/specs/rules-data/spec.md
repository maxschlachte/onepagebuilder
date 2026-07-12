## MODIFIED Requirements

### Requirement: Faction unit profiles

The system SHALL encode, for every faction in the rulebook, each unit's name, size, quality, equipment, special rules, available upgrade-group letters, points cost, and whether it is a Hero. Space Marine Chapters (Blood Angels, Dark Angels, Grey Knights, Space Wolves) are not one of these independently-listed factions; their units and rule modifiers are encoded as chapter-tagged data folded into the Space Marines faction, per the "Space Marine chapter specializations" requirement below.

#### Scenario: All 15 factions present

- **WHEN** the dataset is queried for factions
- **THEN** it returns the 15 factions from the rulebook (Space Marines, Imperial Guard / Astra Militarum, Orks, Eldar, Chaos Space Marines, Tau, Necrons, Tyranids, Dark Eldar, Chaos Daemons, Sisters of Battle / Adepta Sororitas, Inquisition, Harlequins, Adeptus Mechanicus / Skitarii, Genestealer Cult), with no separately-listed "Space Marine Chapters" faction

#### Scenario: Unit profile fields match the PDF

- **WHEN** a unit profile is read (e.g. Space Marines "Captain [1]")
- **THEN** its quality, equipment, special rules (including parameters such as `Tough(3)`), upgrade letters, and cost equal the values printed in the rulebook

#### Scenario: Hero units are flagged

- **WHEN** a unit listed with the `Hero` special rule is read
- **THEN** it is marked as a Hero so the composition validator can count it against the hero limit

## ADDED Requirements

### Requirement: Space Marine chapter specializations

The system SHALL encode each of the four Space Marine chapters (Blood Angels, Dark Angels, Grey Knights, Space Wolves) as chapter-tagged data: each chapter's extra units (with their own upgrade groups, re-namespaced so they do not collide with the base Space Marines faction's own group ids or another chapter's), plus that chapter's point-cost rule modifiers encoded as purchasable upgrade options on the eligible existing Space Marines units — an option's `costDelta` and rule-grant effect matching the modifier's printed cost and rule. A chapter's units and rule-modifier options SHALL only be resolvable as part of an assembled Space Marines-plus-chapter faction, never as a standalone faction.

#### Scenario: Chapter units are encoded with Space Marines as their faction

- **WHEN** a chapter unit (e.g. Blood Angels' "Sanguinary Priest") is read from the assembled Space Marines-plus-chapter data
- **THEN** its faction id resolves to Space Marines, and its own upgrade-group ids do not collide with the base Space Marines faction's upgrade-group ids

#### Scenario: A chapter rule modifier is encoded as a purchasable option

- **WHEN** the Blood Angels chapter's "Infantry get Furious for +10pts" modifier is read
- **THEN** it resolves to an upgrade option with a point delta of `+10` and an effect that adds the Furious special rule, available on every Infantry-eligible unit in the assembled Space Marines-plus-Blood-Angels data

#### Scenario: A named-unit chapter rule modifier targets only that unit

- **WHEN** the Dark Angels chapter's "Terminators get Deathwing for +20pts" modifier is read
- **THEN** it resolves to an upgrade option available only on the Terminators unit, not on other units, with a point delta of `+20` and an effect that adds the Deathwing special rule
