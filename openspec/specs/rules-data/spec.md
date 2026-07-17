# rules-data Specification

## Purpose
TBD - created by archiving change army-builder-1p40k. Update Purpose after archive.
## Requirements
### Requirement: Typed rules schema

The system SHALL define a typed schema for the rulesets it supports comprising factions, unit profiles, weapon profiles, upgrade groups, special rules, psychic powers, and army-composition limits. Every faction SHALL be tagged with the `GameSystem` it belongs to (`system-40k` or `system-fantasy`). All rules content SHALL be derived exclusively from that system's source document: `1p40k - Main Rulebook v3.3.1.pdf` for `system-40k`, `one-page-fantasy-army-lists.md` for `system-fantasy`.

#### Scenario: Schema covers all rule entities

- **WHEN** the rules dataset is loaded
- **THEN** it exposes factions (each tagged with its game system), a special-rule glossary per game system, a global weapon table, and army-composition limits as strongly-typed objects with no untyped `any` fields for core entities

#### Scenario: Data sourced only from each system's own document

- **WHEN** any unit, weapon, special rule, psychic power/magic spell, or point cost is added to the dataset for a given faction
- **THEN** its values match the corresponding entry in that faction's game system's source document, and no value originates from any other source

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

### Requirement: Parameterized special rules and glossary

The system SHALL store the global special-rule glossary as resolvable entries, and SHALL represent rules with numeric parameters (e.g. `Tough(X)`, `Impact(X)`, `Psyker(X)`) as references that carry both the rule identity and its value.

#### Scenario: Glossary text is resolvable

- **WHEN** a special rule reference such as `Fearless` is resolved
- **THEN** the system returns the full explanatory text for that rule as printed in the rulebook glossary

#### Scenario: Parameter is preserved

- **WHEN** a `Tough(3)` reference is resolved
- **THEN** the system returns the rule's glossary text together with the parameter value `3`

### Requirement: Weapon profiles

The system SHALL encode weapon profiles as structured objects with an explicit range, attacks string, and rule references — never inferred by parsing a free-text equipment name. A ranged or melee weapon that appears in its game system's weapon table SHALL be referenced by that table's id — Warhammer 40k and Warhammer Fantasy SHALL each maintain their own weapon table, since some same-named weapons (e.g. `Pistol`, `Rifle`) differ in range, attacks, or rules between the two systems; a weapon whose profile is not in its system's table SHALL be constructed with an explicit range, attacks, and rules rather than embedding that profile inside a name string. The Piercing rule and the Piercing-plus-single-target-assignment combination SHALL be declared as explicit rule references at construction time rather than inferred from trailing `p`/`x` characters in a name. The `Linked` rule SHALL be declared by explicitly wrapping an equipment entry, not inferred from a `Linked ` name prefix. A close-combat weapon's attack-tier (`Light`/`Medium`/`Heavy`/`Master`/`Force`) and type (e.g. `CCW`, `Claws`, `Powersword`, `Powerfist`) SHALL each be declared as explicit construction arguments, with the type's innate rules (`Powersword` → Piercing; `Powerfist` → Piercing and Rending) resolved by direct lookup on those arguments rather than parsed out of a combined name string, and any additional rule declared alongside a melee type SHALL be merged into the same entry's rules rather than replacing the type's innate rule(s). A faction's equipment entry whose range, attacks, and rules are identical to (or a strict superset of, via additional merged rules) an entry already present in its game system's weapon table SHALL be authored as a reference to that table entry rather than as a hand-typed custom profile that duplicates its values.

#### Scenario: Weapon profile fields match the PDF

- **WHEN** a weapon is constructed by referencing the global table's `battle-cannon` entry (printed as `Battle Cannon (48", A9p)`)
- **THEN** its range is `48"`, its attacks is `9`, and it carries a Piercing rule reference

#### Scenario: A weapon wrapped as Linked resolves against the global table

- **WHEN** an equipment entry is constructed by wrapping a reference to the global table's `carbine` entry with the Linked wrapper, with no custom profile given
- **THEN** its range and attacks match the global table's Carbine entry, and it carries a resolvable `Linked` rule reference

#### Scenario: A Linked weapon with a custom profile also carries the Linked rule

- **WHEN** an equipment entry is constructed by wrapping a custom weapon profile (range `24`, attacks `3`, name `Machinegun`) with the Linked wrapper
- **THEN** its range is `24"`, its attacks is `3`, and it carries a resolvable `Linked` rule reference alongside any other rules declared on the custom profile

#### Scenario: An explicit tier-and-type close-combat weapon resolves attacks from the global table

- **WHEN** a melee equipment entry is constructed with tier `Medium`/`Heavy`/`Light`/`Force` and no type (or a type with no innate rules, e.g. `CCW`/`Claws`), and no custom profile
- **THEN** its range is `null` (melee) and its attacks matches that tier's value in the global weapon table (e.g. `Medium` → `2`, `Heavy` → `3`)

#### Scenario: A Powersword carries its innate Piercing rule regardless of tier

- **WHEN** a melee equipment entry is constructed with type `Powersword` at tier `Medium`, `Heavy`, or `Force`, with no additional rules declared
- **THEN** its range is `null`, its attacks matches its tier's value, and it carries a resolvable Piercing rule reference

#### Scenario: A Powerfist carries its innate Piercing and Rending rules regardless of tier

- **WHEN** a melee equipment entry is constructed with type `Powerfist` at tier `Medium`, `Heavy`, or `Master`, with no additional rules declared
- **THEN** its range is `null`, its attacks matches its tier's value, and it carries resolvable Piercing and Rending rule references

#### Scenario: An additional declared rule on a Powersword/Powerfist entry is merged, not shadowed

- **WHEN** a melee equipment entry is constructed with type `Powersword` at tier `Force` and an additional declared Rending rule, or type `Powerfist` at tier `Master` and an additional declared Shake rule
- **THEN** the resolved weapon's rules include both the type's innate rule(s) and the additionally declared rule(s)

#### Scenario: A fantasy faction's ranged weapon matching the Fantasy weapon table is authored as a reference

- **WHEN** a `system-fantasy` faction's equipment entry has a range, attacks, and rule set that are identical to (or that add extra rules on top of) a `weaponsFantasy` table entry (e.g. a `Bow`, `Stone Thrower`, or `Cannon`)
- **THEN** it is constructed via a reference to that table entry's id, with any additional rules merged in, rather than via a hand-typed custom profile that duplicates the table entry's range and attacks

#### Scenario: A fantasy faction's melee weapon matching a shared tier/type is authored as a reference

- **WHEN** a `system-fantasy` faction's melee equipment entry has range `null`, an attacks value matching one of the shared `Light`/`Medium`/`Heavy`/`Master`/`Force` tiers, and rules matching that tier's type-innate rules (if any)
- **THEN** it is constructed via the tier-and-type melee builder rather than via a hand-typed custom profile that duplicates the tier's attacks value

### Requirement: Upgrade groups

The system SHALL encode each faction's lettered upgrade groups, each with its title, selection mode, and options, where each option records its point delta and its effects on the unit's equipment and special rules. An option whose printed effect adds, removes, or replaces a weapon SHALL record that as an equipment effect rather than only a cost delta. A "replace one/up to N" option (as opposed to "replace all") SHALL reduce the model-count of the replaced weapon's equipment entry by one (removing it entirely once its count reaches zero) and record the newly added weapon as carried by exactly one model, regardless of the unit's total size — matching the target entry by its stable equipment key rather than its display label, so a declaration authored once against a unit's baseline entry matches regardless of that entry's size-dependent pluralized label text (e.g. `Assault Rifle` vs `Assault Rifles`). A "replace all" option SHALL always remove every copy of the replaced weapon and record the new weapon as carried by every model in the unit, regardless of unit size, likewise matched by equipment key. A "replace one/up to N" option's model-count reduction targets how many *models* carry an equipment entry; it SHALL NOT be applied to an equipment entry that represents multiple weapon copies carried by a single model (the entry's `count` field, e.g. a single vehicle's `3x Disintegrator Cannons`) — such an entry SHALL be left fully intact by the option, which only adds the new weapon, since reducing a one-model entry's model-count from one to zero would incorrectly discard every copy at once rather than one. An option whose label names a special rule (e.g. `Night Shields (Stealth)`) SHALL record that rule as an added special-rule effect (directly, or via a weapon it adds that itself carries the rule) rather than recording only a cost delta. An option's label SHALL NOT embed a weapon's printed profile (its range and/or attacks, e.g. `(36”, A6x)`) — an option that adds a weapon via `addEquipment` records that weapon's profile there, and it alone is the source of truth for that weapon's stats.

#### Scenario: Upgrade option records cost delta

- **WHEN** an upgrade option such as Space Marines group A "Jump Pack (Deep Strike, Flying)" is read
- **THEN** it records a point delta of `+10` and effects that add the Deep Strike and Flying special rules

#### Scenario: Units reference their upgrade groups

- **WHEN** a unit profile lists upgrade letters (e.g. `A, H`)
- **THEN** those letters resolve to that faction's corresponding upgrade groups

#### Scenario: A weapon-replacing option on a single-model unit swaps the displayed weapon

- **WHEN** a "replace one X" option is selected on a unit that has exactly one model and exactly one copy of X
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by that one model

#### Scenario: The same option on a multi-model unit reduces X's count and adds the new weapon

- **WHEN** the same "replace one X" option is selected on a unit with more than one model
- **THEN** the unit's effective equipment still includes X but with its model-count reduced by one, and now also includes the option's weapon carried by exactly one model

#### Scenario: A "replace all X" option always swaps the displayed weapon

- **WHEN** a "replace all X" option is selected, regardless of unit size
- **THEN** the unit's effective equipment no longer includes X and includes the option's weapon instead, carried by every model in the unit

#### Scenario: A replacement target matches regardless of the baseline entry's pluralized label

- **WHEN** an upgrade option declares its replacement target as the equipment key belonging to `Assault Rifle` and is selected on a unit whose baseline equipment entry carries that key but displays the label `Assault Rifles` (plural, for a multi-model unit)
- **THEN** the unit's `Assault Rifles` entry's model-count is reduced by one

#### Scenario: A single-model unit's multi-copy weapon is not fully removed by a per-model swap

- **WHEN** a "replace one/any X" option is selected on a single-model unit whose baseline equipment entry for X carries more than one weapon copy (e.g. Dark Eldar Ravager's `3x Disintegrator Cannons`)
- **THEN** the unit's effective equipment still includes the full, unchanged X entry, and now also includes the option's weapon carried by one model

#### Scenario: A rule-granting option records its rule as an effect

- **WHEN** an upgrade option's label names a special rule (e.g. `Night Shields (Stealth)`, `Chain-Snares (Impact(+D3))`)
- **THEN** the resulting option effect includes that rule as an added special-rule reference, resolvable via the glossary like any other special rule, rather than only a cost delta

#### Scenario: A weapon-adding option's label carries no stats of its own

- **WHEN** an upgrade option adds a weapon (e.g. a Dark Lance, range `36`, attacks `6`) via `addEquipment`
- **THEN** the option's `label` names the weapon but does not include its range or attacks, and the weapon's actual profile is read from the `addEquipment` entry, not parsed from the label

### Requirement: Army-composition limits

The system SHALL encode the army-composition rules: a default points cap of 750 and the points-to-hero-limit table from the advanced rules (750→0-1, 1500→0-2, 2250→0-3, 3000→0-4, 3750→0-5, 4500→0-6, 5250→0-7, 6000→0-8).

#### Scenario: Default cap is 750

- **WHEN** a new list is created without a specified cap
- **THEN** the points cap defaults to 750

#### Scenario: Hero limit derived from points

- **WHEN** the maximum hero count is requested for a 1500-point cap
- **THEN** the system returns 2, per the composition table

### Requirement: Space Marine chapter specializations

The system SHALL encode each of the four Space Marine chapters (Blood Angels, Dark Angels, Grey Knights, Space Wolves) as chapter-tagged data: each chapter's extra units (with their own upgrade groups, re-namespaced so they do not collide with the base Space Marines faction's own group ids or another chapter's), plus that chapter's point-cost rule modifiers encoded as purchasable upgrade options on the eligible base Space Marines units — an option's `costDelta` and rule-grant effect matching the modifier's printed cost and rule. A chapter's own upgrade groups SHALL carry a display letter, computed at assembly time, that continues the base Space Marines faction's own lettering sequence (e.g. `P`, `Q`, `R`, ... after the base faction's last letter), distinct from their internal (namespaced) id used for lookup. A chapter's own units SHALL NOT receive that chapter's own Chapter Tactics options, even when a unit's category or name would otherwise match the modifier's target, since a chapter's own units already carry that chapter's signature ability directly in their baseline special rules. A chapter's units and rule-modifier options SHALL only be resolvable as part of an assembled Space Marines-plus-chapter faction, never as a standalone faction.

#### Scenario: Chapter units are encoded with Space Marines as their faction

- **WHEN** a chapter unit (e.g. Blood Angels' "Sanguinary Priest") is read from the assembled Space Marines-plus-chapter data
- **THEN** its faction id resolves to Space Marines, and its own upgrade-group ids do not collide with the base Space Marines faction's upgrade-group ids

#### Scenario: A chapter's own upgrade groups get a display letter continuing the base sequence

- **WHEN** the assembled Space Marines-plus-Blood-Angels data's upgrade groups are read
- **THEN** Blood Angels' own five upgrade groups carry display letters `P`, `Q`, `R`, `S`, `T` (continuing after the base Space Marines faction's last letter `O`), distinct from every base group's own letter

#### Scenario: Each chapter's own letters restart at the same continuation point

- **WHEN** the assembled Space Marines-plus-Dark-Angels data's upgrade groups are read
- **THEN** Dark Angels' own two upgrade groups carry display letters `P`, `Q` — the same starting point Blood Angels' own groups would use, since only one chapter is ever assembled with the base faction at a time

#### Scenario: A chapter rule modifier is encoded as a purchasable option on base units only

- **WHEN** the Blood Angels chapter's "Infantry get Furious for +10pts" modifier is read
- **THEN** it resolves to an upgrade option with a point delta of `+10` and an effect that adds the Furious special rule, available on every base Space Marines Infantry-eligible unit in the assembled Space Marines-plus-Blood-Angels data, but not on any of Blood Angels' own extra units

#### Scenario: A named-unit chapter rule modifier targets only that unit

- **WHEN** the Dark Angels chapter's "Terminators get Deathwing for +20pts" modifier is read
- **THEN** it resolves to an upgrade option available only on the (base) Terminators unit, not on other units, with a point delta of `+20` and an effect that adds the Deathwing special rule

#### Scenario: A chapter's own units never show that chapter's own tactics

- **WHEN** the assembled Space Marines-plus-Blood-Angels data's "Death Company" unit (which already carries Rage, implying Furious) is read
- **THEN** it has no Chapter Tactics upgrade group, even though Death Company is Infantry-eligible and would otherwise match the Blood Angels "Infantry get Furious" modifier

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

### Requirement: Per-system special-rule glossary

The system SHALL maintain a separate special-rule glossary for each game system (`RulesDatabase.glossaries`, keyed by `GameSystem`) rather than a single shared glossary, and SHALL resolve a rule reference against the glossary of the referencing unit's faction's own game system. The Warhammer Fantasy glossary SHALL be sourced from the Warhammer Fantasy core-rules document(s) (e.g. `one-page-fantasy-rules.md`'s "Unit Types" and "Common Special Rules" sections), independently of the Warhammer 40k glossary, since a same-named rule may differ in wording or mechanic between the two systems (e.g. `Poison`, `Furious`).

#### Scenario: Same-named rules can differ between systems

- **WHEN** the `poison` rule is resolved for a Warhammer 40k faction and separately for a Warhammer Fantasy faction
- **THEN** each resolves to that system's own glossary text, which may describe a different mechanic

#### Scenario: Wizard is its own glossary entry, not an alias of Psyker

- **WHEN** the Warhammer Fantasy glossary is queried for the `wizard` rule id
- **THEN** it returns Warhammer Fantasy's own sourced text for Wizard, independently of the Warhammer 40k glossary's `psyker` entry

### Requirement: Warhammer Fantasy melee weapon profiles match the Weapons table

The system SHALL derive every Warhammer Fantasy melee weapon's attacks value from its printed tier (`Light`=1, `Medium`=2, `Heavy`=3, `Master`=4, `Force`=5) and SHALL apply its type word's innate rule (`Halberd` → Piercing; `Mace` → Piercing and Poison; `Lance` → Impact(1); `Sword`/`Claws` → none), per `one-page-fantasy-rules.md`'s "Weapons" section, rather than a hardcoded or unverified value.

#### Scenario: A Master-tier weapon has 4 attacks

- **WHEN** a unit's equipment includes a `Master`-tier melee weapon (e.g. Ogre Kingdoms' Master Mace)
- **THEN** its attacks value is 4, not 1

#### Scenario: A Mace-type weapon carries Piercing and Poison

- **WHEN** a unit's equipment includes a weapon whose type word is `Mace` (of any tier)
- **THEN** its rules include both Piercing and Poison

#### Scenario: A Halberd-type weapon carries Piercing

- **WHEN** a unit's equipment includes a weapon whose type word is `Halberd` (of any tier)
- **THEN** its rules include Piercing

#### Scenario: A Lance-type weapon carries Impact(1)

- **WHEN** a unit's equipment includes a weapon whose type word is `Lance` (of any tier)
- **THEN** its rules include Impact(1)

#### Scenario: An extra printed qualifier is preserved alongside the type's innate rule

- **WHEN** a unit's equipment includes a tier+type weapon with an additional printed rule (e.g. a `Deadly` annotation)
- **THEN** both the type's innate rule(s) and the additional rule are present, with no duplicate if they overlap

### Requirement: Warhammer Fantasy ranged weapon profiles match the Weapons table

The system SHALL derive every Warhammer Fantasy ranged weapon's range and attacks from `one-page-fantasy-rules.md`'s Weapons table (`Throwing Weapon`=12"/A1; `Pistol`=12"/A1/Piercing; `Shortbow`=18"/A1; `Fire Thrower`=18"/A6; `Bow`=24"/A1; `Rifle`=24"/A1/Piercing; `Longbow`=30"/A1; `Crossbow`=30"/A1/Piercing; `Stone Thrower`=48"/A3/Piercing; `Cannon`=48"/AD3+3/Piercing; `Bolt Thrower`=48"/A3/Piercing-plus-single-target-assignment), rather than a hardcoded or unverified value, and SHALL maintain these as a Warhammer Fantasy-specific weapon table distinct from Warhammer 40k's own weapon table, since `Pistol` and `Rifle` differ in stats between the two systems.

#### Scenario: Pistol differs between the two systems

- **WHEN** a Warhammer 40k unit's Pistol and a Warhammer Fantasy unit's Pistol are each resolved
- **THEN** the Warhammer 40k Pistol has no special rules, and the Warhammer Fantasy Pistol carries a Piercing rule reference, both with range `12"` and attacks `1`

#### Scenario: Rifle differs between the two systems

- **WHEN** a Warhammer 40k unit's Rifle and a Warhammer Fantasy unit's Rifle are each resolved
- **THEN** the Warhammer 40k Rifle has range `30"`, attacks `1`, and no special rules, and the Warhammer Fantasy Rifle has range `24"`, attacks `1`, and a Piercing rule reference

#### Scenario: A Fantasy-only standard weapon resolves correctly

- **WHEN** a Warhammer Fantasy unit's equipment includes a `Bolt Thrower`
- **THEN** its range is `48"`, its attacks is `3`, and its rules include Piercing and single-target-assignment

#### Scenario: An extra printed rule beyond the standard is preserved

- **WHEN** a Warhammer Fantasy unit's equipment includes a standard-named weapon (e.g. `Stone Thrower`) with an additional printed rule not in the base table (e.g. `Indirect`)
- **THEN** its rules include both the table's baseline rule(s) and the additional rule, with no duplicate if they overlap

### Requirement: Common Upgrades (Sergeant/Musician/Standard) are resolvable rules

The system SHALL make `Sergeant`, `Musician`, and `Standard` resolvable special rules with text sourced from `one-page-fantasy-rules.md`'s "Common Upgrades" section, attached to their equipment entry in every Warhammer Fantasy faction, so their effect renders as a tooltip like any other rule-bearing equipment.

#### Scenario: Sergeant shows its effect

- **WHEN** the user views the Sergeant upgrade option (or its equipment entry once selected) for any Warhammer Fantasy faction
- **THEN** a tooltip/rule chip shows "One model gets +1 melee attack."

#### Scenario: Musician and Standard show their effect

- **WHEN** the user views the Musician or Standard upgrade option (or its equipment entry once selected) for any Warhammer Fantasy faction
- **THEN** a tooltip/rule chip shows "Adds +1 for melee results." for each

### Requirement: Age of Fantasy mount rule inheritance

The system SHALL mark every equipment entry granted by a "Mount on:"-style upgrade option (or an equivalent single-mount option) as a mount (`EquipmentEntry.isMount`), and a unit's effective special rules SHALL include every special rule carried by its currently-selected mount(s), exactly as if those rules belonged to the unit itself, per `one-page-fantasy-rules.md`'s "Mounts" special rule.

#### Scenario: A mount's non-Tough special rules are inherited by the mounted unit

- **WHEN** a unit selects a mount option whose equipment carries special rules other than Tough (e.g. Fast, Nimble, Flying, Armored, Fear, Impact(N), Regeneration)
- **THEN** the unit's effective special rules include each of those rules, in addition to the unit's own baseline special rules

#### Scenario: Tough values are summed, not replaced

- **WHEN** a unit with a baseline `Tough(N)` special rule selects a mount whose equipment carries `Tough(M)`
- **THEN** the unit's effective special rules show a single `Tough(N+M)` entry, not two separate `Tough` entries and not just the higher of the two

#### Scenario: A mount's weapon rules stay scoped to that weapon

- **WHEN** a unit's selected mount grants a weapon with its own rules (e.g. `Piercing` on `Master Claws`)
- **THEN** that rule stays attached to the weapon entry and is not duplicated into the unit's special rules list

#### Scenario: Non-mount gear grants are not promoted to unit-wide special rules

- **WHEN** a unit selects a non-mount gear-granting option (e.g. Sergeant, Musician, Standard, Fiery Breath)
- **THEN** the granted rule is not added to the unit's effective special rules list, unchanged from today's behavior — only equipment entries marked as a mount are inherited this way

