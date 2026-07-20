## MODIFIED Requirements

### Requirement: Typed rules schema

The system SHALL define a typed schema for the rulesets it supports comprising factions, unit profiles, weapon profiles, upgrade groups, special rules, psychic powers, and army-composition limits. Every faction SHALL be tagged with the `GameSystem` it belongs to (`system-40k` or `system-fantasy`). All rules content SHALL be derived exclusively from that system's source document: `1p40k - Main Rulebook v3.3.1.pdf` for `system-40k`, `one-page-fantasy-army-lists.md` for `system-fantasy`. Whether a parameterized rule's value combines additively SHALL be determined by the shape of the value at the reference site (a `+N`-style value is an additive bonus; a plain value is not), not by a flag on the rule's glossary definition — so the same convention applies uniformly across both game systems' glossaries.

#### Scenario: Schema covers all rule entities

- **WHEN** the rules dataset is loaded
- **THEN** it exposes factions (each tagged with its game system), a special-rule glossary per game system, a global weapon table, and army-composition limits as strongly-typed objects with no untyped `any` fields for core entities

#### Scenario: Data sourced only from each system's own document

- **WHEN** any unit, weapon, special rule, psychic power/magic spell, or point cost is added to the dataset for a given faction
- **THEN** its values match the corresponding entry in that faction's game system's source document, and no value originates from any other source

#### Scenario: Additive-ness is carried by the reference, not the definition

- **WHEN** a glossary special-rule definition is read
- **THEN** it carries no flag declaring the rule additive, and a consumer determines additive combination solely from the referencing value's own `+N` shape
