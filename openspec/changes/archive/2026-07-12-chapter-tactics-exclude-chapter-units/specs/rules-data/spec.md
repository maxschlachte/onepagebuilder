## MODIFIED Requirements

### Requirement: Space Marine chapter specializations

The system SHALL encode each of the four Space Marine chapters (Blood Angels, Dark Angels, Grey Knights, Space Wolves) as chapter-tagged data: each chapter's extra units (with their own upgrade groups, re-namespaced so they do not collide with the base Space Marines faction's own group ids or another chapter's), plus that chapter's point-cost rule modifiers encoded as purchasable upgrade options on the eligible base Space Marines units — an option's `costDelta` and rule-grant effect matching the modifier's printed cost and rule. A chapter's own units SHALL NOT receive that chapter's own Chapter Tactics options, even when a unit's category or name would otherwise match the modifier's target, since a chapter's own units already carry that chapter's signature ability directly in their baseline special rules. A chapter's units and rule-modifier options SHALL only be resolvable as part of an assembled Space Marines-plus-chapter faction, never as a standalone faction.

#### Scenario: Chapter units are encoded with Space Marines as their faction

- **WHEN** a chapter unit (e.g. Blood Angels' "Sanguinary Priest") is read from the assembled Space Marines-plus-chapter data
- **THEN** its faction id resolves to Space Marines, and its own upgrade-group ids do not collide with the base Space Marines faction's upgrade-group ids

#### Scenario: A chapter rule modifier is encoded as a purchasable option on base units only

- **WHEN** the Blood Angels chapter's "Infantry get Furious for +10pts" modifier is read
- **THEN** it resolves to an upgrade option with a point delta of `+10` and an effect that adds the Furious special rule, available on every base Space Marines Infantry-eligible unit in the assembled Space Marines-plus-Blood-Angels data, but not on any of Blood Angels' own extra units

#### Scenario: A named-unit chapter rule modifier targets only that unit

- **WHEN** the Dark Angels chapter's "Terminators get Deathwing for +20pts" modifier is read
- **THEN** it resolves to an upgrade option available only on the (base) Terminators unit, not on other units, with a point delta of `+20` and an effect that adds the Deathwing special rule

#### Scenario: A chapter's own units never show that chapter's own tactics

- **WHEN** the assembled Space Marines-plus-Blood-Angels data's "Death Company" unit (which already carries Rage, implying Furious) is read
- **THEN** it has no Chapter Tactics upgrade group, even though Death Company is Infantry-eligible and would otherwise match the Blood Angels "Infantry get Furious" modifier
