## ADDED Requirements

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

### Requirement: Common Upgrades (Sergeant/Musician/Standard) are resolvable rules

The system SHALL make `Sergeant`, `Musician`, and `Standard` resolvable special rules with text sourced from `one-page-fantasy-rules.md`'s "Common Upgrades" section, attached to their equipment entry in every Warhammer Fantasy faction, so their effect renders as a tooltip like any other rule-bearing equipment.

#### Scenario: Sergeant shows its effect

- **WHEN** the user views the Sergeant upgrade option (or its equipment entry once selected) for any Warhammer Fantasy faction
- **THEN** a tooltip/rule chip shows "One model gets +1 melee attack."

#### Scenario: Musician and Standard show their effect

- **WHEN** the user views the Musician or Standard upgrade option (or its equipment entry once selected) for any Warhammer Fantasy faction
- **THEN** a tooltip/rule chip shows "Adds +1 for melee results." for each
