## Why

An upgrade that grants an additive bonus to a rule the unit already carries as a **dice expression** is silently dropped. The Ogre Kingdoms Tyrant has baseline `Impact(D3)`; selecting Wallcrusher (`Impact(+1)`) still displays `Impact(D3)` — the player paid 5pts for nothing visible.

The cause is one line in `mergeRuleGroup` (`src/domain/calc.ts:411`). It classifies params as either plain-numeric or `+N`-additive, and any group containing a shape outside those two bails out with `return group[0]` — keeping the first entry and discarding the rest. `Impact(D3)`'s param is the string `"D3"`, which matches neither, so the `+1` is thrown away.

That bail-out is documented as unreachable: the change that introduced it states *"nothing in the current data duplicates those"* and *"this exact shape doesn't exist anywhere in current data (verified by grep across `src/data/factions/`)"*. That was already untrue when written — the Ork `Deff Dred` / `Killa Kan` pairing of baseline `Impact(D3)` with the `Wreckin' Ball` option's `Impact(+D6)` predates it by two days. A probe across the current dataset finds **8 affected unit/option pairings** spanning both game systems.

## What Changes

- Extend `mergeRuleGroup` to merge dice-expression params by **symbolic concatenation**, so a dice base and any additive bonuses combine into one entry instead of one being dropped:
  - `Impact(D3)` + `Impact(+1)` → `Impact(D3+1)`
  - `Impact(D6)` + `Impact(+3)` → `Impact(D6+3)`
  - `Impact(2D6)` + `Impact(+D6)` → `Impact(2D6+D6)`
  - `Impact(D3)` + `Impact(+D6)` → `Impact(D3+D6)`
- Preserve today's behavior exactly for the all-numeric cases: plain tiers still keep-highest (`Psyker(1)`+`Psyker(2)` → `Psyker(2)`), numeric additives still sum to a number (`Impact(1)`+`Impact(+1)` → `Impact(2)`).
- Add a data-driven audit test that finds every same-`ruleId` collision reachable from faction data and asserts none of them lose a contributing entry — so the "not reachable from current data" class of error fails loudly instead of being asserted in prose.
- **Remove the dead `isAdditive` flag** from `SpecialRule` and the three 40k glossary entries that set it. It is never read anywhere; merging is driven entirely by param shape. The fantasy glossary never set it at all, yet fantasy `Impact` merging works — proof the flag is not the contract.

## Capabilities

### New Capabilities

_None._ This corrects existing behavior.

### Modified Capabilities

- `army-builder-ui`: the "Unit card with upgrade controls" requirement already specifies additive-bonus merging, but only in terms of a numeric existing value. Extends it to cover a dice-expression base, and adds scenarios for the dice cases.
- `rules-data`: removes `isAdditive` from the typed schema's special-rule entity.

## Impact

- **Modified**: `src/domain/calc.ts` (`mergeRuleGroup` only), `src/domain/types.ts` (drop `isAdditive`), `src/data/glossary.ts` (drop 3 flag lines).
- **New**: an audit test covering parameterized-rule collisions.
- **Unchanged**: `parseRule`/`rules()` parsing, upgrade availability, point costs. `formatRuleName` already interpolates a string param directly, so `Impact(D3+1)` renders with no display-layer change.
- **Risk**: low, and contained by construction — the all-numeric paths are untouched, and the changed branch currently only ever returns a truncated result.
- **Affected units** (8 pairings): Ogre Kingdoms Tyrant / Bruiser / Hunter (Wallcrusher, and Hunter again via the Stonehorn mount), Lizardmen Stegadon (Sharp Horns), Goblins Pump Wagon (Giant Explodin' Spores), Orks Deff Dred / Killa Kan (Wreckin' Ball).
