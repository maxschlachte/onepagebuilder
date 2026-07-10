## MODIFIED Requirements

### Requirement: Weapon profiles

The system SHALL encode weapon profiles with range and attacks, and SHALL normalize inline weapon-rule notation (such as `p` for Piercing and `x` for the single-target rule) into resolvable rule references. A `Linked ` prefix on an equipment entry's name SHALL also be normalized: the remainder of the name SHALL be used to resolve range/attacks (from an inline profile or the global weapon table), and the entry SHALL carry a resolvable `Linked` rule reference. A close-combat equipment name that leads with a melee attack-tier word (`Light`, `Medium`, `Heavy`, `Master`, `Force`) but does not exactly match a global weapon table entry SHALL resolve that tier's range (`Melee`) and attacks value from the global weapon table, so its attacks count is not silently dropped.

#### Scenario: Weapon profile fields match the PDF

- **WHEN** a weapon such as `Battle Cannon (48", A9p)` is read
- **THEN** its range is `48"`, its attacks is `9`, and it carries a Piercing rule reference

#### Scenario: A bare Linked-prefixed weapon resolves against the global table

- **WHEN** an equipment entry named `Linked Carbine` (no inline profile) is read
- **THEN** its range and attacks match the global table's `Carbine` entry, and it carries a resolvable `Linked` rule reference

#### Scenario: A Linked-prefixed weapon with an inline profile also carries the Linked rule

- **WHEN** an equipment entry named `Linked Machinegun (24”, A3)` is read
- **THEN** its range is `24"`, its attacks is `3`, and it carries a resolvable `Linked` rule reference alongside any other rules present in the parenthetical

#### Scenario: A tier-prefixed close-combat weapon name resolves attacks from the global table

- **WHEN** an equipment entry named `Medium CCW`, `Heavy Claws`, `Light Powerfist`, or `Force Powersword` (no inline profile) is read
- **THEN** its range is `null` (melee) and its attacks matches that tier's value in the global weapon table (e.g. `Medium` → `2`, `Heavy` → `3`)

#### Scenario: A tier-prefixed close-combat weapon with its own inline profile is not overridden

- **WHEN** an equipment entry has an inline parenthetical containing a range or attacks token (e.g. `Heavy Grav-Cannon (30", A2p)`)
- **THEN** its profile is parsed from the inline notation as before, and the tier-word fallback does not apply
