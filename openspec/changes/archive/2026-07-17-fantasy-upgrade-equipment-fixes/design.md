## Context

`one-page-fantasy-army-lists.md` prints every mount as its own standalone unit row directly below the units that can take it — e.g. Empire's:

```
Warhorse [1]          -   Light Claws     Fast, Nimble                    -   -
Imperial Griffon [1]  -   Master Claws (Piercing)   Armored, Fear, Flying, Impact(D6), Tough(6)   M   -
```

("Quality" and "Cost" are `-` because the mount is never bought standalone; it's only reachable via a hero's "Mount on:" option.) `rules-data`'s existing "Standalone units match the source table" scenario already requires each of these rows to exist as its own zero-cost `UnitInput`, and every faction file already does list them there. The bug is one level up: the "Mount on:" upgrade *option* that a player actually selects adds the mount via a bare `gear("Warhorse")` call, which carries neither the weapon nor the rules that the mount's own standalone row lists two lines above it in the same file. The option and the standalone unit both exist, but nothing connects them — the option's `addEquipment` was never populated from the standalone row's own equipment/special columns.

The user has already hand-fixed 3 of Empire's 5 Group-A mounts (`empire.ts`, group `A`, section `Mount on:` — Warhorse, Imperial Pegasus, War Altar of Sigmar) as the reference pattern:

```ts
{ label: "Warhorse", cost: 10, addEquipment: [
    meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
    gear("Warhorse", { rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
  ]
},
```

This design generalizes that pattern to every remaining mount option across all 16 files, plus a smaller, related "Replace <weapon>:" `removeEquipment` gap.

## Goals / Non-Goals

**Goals:**
- Every "Mount on:"-style option's `addEquipment` grants the same weapon and rules as that mount's own standalone-unit row.
- Every "Replace <weapon>:" section (single-hero or "replace all") whose options add a weapon in place of an existing one also removes the original via `removeEquipment`/`removeOneEquipment`, matching the section's own printed heading.
- A regression test locks both fixes in so they can't silently regress per-faction later.

**Non-Goals:**
- No changes to `helpers.ts`, `domain/types.ts`, `domain/calc.ts`, `stores/lists.ts`, or any Vue component — every mechanism needed (`meleeWeapon`, `weaponFantasy`, `customWeapon`, `gear(name, { rules })`, `removeEquipment`, `removeOneEquipment`) already exists and is already used elsewhere in these same files.
- Not re-auditing unit-level baseline equipment, costs, or special rules (covered by the existing `fantasy-data-quality-audit.test.ts`) — scope is limited to upgrade-*option* equipment effects.
- Not touching 40k faction data.

## Decisions

**Weapon builder choice per mount.** Use the same decision rule the codebase already applies elsewhere: if the mount's melee weapon is a plain `"<Tier> <Type>"` matching a shared tier/type (the overwhelming majority — `Light/Medium/Heavy/Master/Force Claws`, occasionally `Sword`), use `meleeWeapon(tier, type, opts)`; if it's a named non-standard weapon with its own profile (e.g. Skaven's "Fumes" on Plague Furnace, Vampire Counts' "Spirit Horde"/"Restless Dead", Dwarfs' "Bell"), use `customWeapon`. Every mount's rules (the row's own special-rules column) go on a `gear("<Mount Name>", { rules: rules("...") })` entry alongside the weapon, exactly as the Empire reference fix does — `gear` stays even though it grants no stats of its own, because it's what keeps the mount's own name visible as a distinct equipment line, and other options (existing `requiresOneOfSelected` arrays) already reference these mounts by their printed label.

**"Reduced" standalone variants.** A few mounts are printed twice: once as a full unit with its own upgrades (e.g. Ogre Kingdoms' "Stonehorn [1] 4+ ... G" with Chaintrap/Heavy Sword/Force Claws), and again as a bare mount variant lower in the same table with a shorter equipment/rules list and no Quality/upgrades (e.g. "Stonehorn [1] - Force Claws (Piercing) / Armored, Furious, Impact(+3), Tough(6), Trample -"). The *mount option* must use the second, reduced row — the mount is not "the full unit as a mount," it's the specifically-printed mount variant. Same pattern applies to Warsphinx (Tomb Kings), Tuskgor/Razorgor Chariot (Beastmen), Terrorgheist/Corpse Cart (Vampire Counts), Seeker Chariot (Daemons of Chaos), Skeleton Chariot vs. the Orc/Goblin/Empire "Boar/Wolf Chariot" mounts, and Frostheart/Flamespyre Phoenix (High Elves, printed a second time at the bottom of the table with a slightly different rules list than the standalone-unit version above).

**Already-partially-modeled mounts get corrected in place, not treated as bare.** A few sites (High Elves' Group B "Tiranoc Chariot", Daemons of Chaos' "Seeker Chariot" in Groups B and F) already pass a `customWeapon(...)` instead of bare `gear(...)`, but with a wrong/placeholder profile (`attacks: '1'`, no rules) instead of the mount's real printed stats. These are fixed the same way as the bare-`gear` sites — replace the placeholder profile with the real one — rather than being out of scope because they're "already using a weapon builder."

**Reference table of correct mount stats** (compiled from `one-page-fantasy-army-lists.md`; implementers should still open the source section for the faction they're editing to double check row alignment, since the PDF-extraction source has occasional column bleed noted elsewhere in these files):

| Faction | Mount | Weapon | Rules |
|---|---|---|---|
| Empire | Imperial Griffon | Master Claws (Piercing) | Armored, Fear, Flying, Impact(D6), Tough(6) |
| Empire | Imperial Dragon | Fiery Breath (gear), Force Claws (Piercing) | Armored, Fear, Flying, Impact(D6), Tough(6) |
| Empire | Mechanical Steed | Light Claws | Armored, Nimble, Impact(D3) |
| Orcs | War Boar | Light Claws | Fast, Nimble, Tusker Charge |
| Orcs | Boar Chariot | Medium Claws | Armored, Fast, Impact(D6), Tough(3), Tusker Charge |
| Orcs | Wyvern | Heavy Claws (Poison) | Armored, Fear, Flying, Impact(D6), Tough(6) |
| Goblins | Giant Wolf | Light Claws | Fast, Nimble |
| Goblins | Giant Spider | Light Claws (Poison) | Fast, Nimble, Strider |
| Goblins | Great Cave Squig | Heavy Claws | Boingy, Fearless, Impact(1), Nimble, Tough(3) |
| Goblins | Gigantic Spider | Heavy Claws (Poison) | Fast, Fear, Impact(1), Nimble, Strider, Tough(3) |
| Goblins | Wolf Chariot | Medium Claws | Armored, Fast, Impact(D6), Tough(3) |
| High Elves | Elven Steed | Light Claws | Fast, Nimble |
| High Elves | Great Eagle | Medium Claws | Flying, Impact(1), Nimble, Tough(3) |
| High Elves | Griffon | Master Claws | Armored, Fear, Flying, Impact(D6), Nimble, Tough(3) |
| High Elves | Frostheart Phoenix (mount row) | Master Claws | Armored, Blizzard Aura, Fear, Flying, Impact(D6), Tough(6) |
| High Elves | Flamespyre Phoenix (mount row) | Heavy Claws | Armored, Fear, Flying, Impact(D6), Phoenix, Tough(6), Wake of Fire |
| High Elves | Dragon of Ulthuan | Fiery Breath (gear), Force Claws (Piercing) | Armored, Fear, Flying, Impact(D6), Nimble, Tough(6) |
| High Elves | Tiranoc Chariot | Medium Claws | Armored, Fast, Impact(D6), Tough(3) |
| Dark Elves | Cold One | Medium Claws | Fast, Fear, Nimble |
| Dark Elves | Dark Steed | Light Claws | Fast, Nimble |
| Dark Elves | Dark Pegasus | Medium Claws | Flying, Nimble, Impact(1), Tough(3) |
| Dark Elves | Manticore | Master Claws (Deadly) | Armored, Fear, Flying, Impact(D6), Tough(3) |
| Dark Elves | Black Dragon | Fiery Breath (gear), Force Claws (Piercing) | Armored, Fear, Flying, Impact(D6), Tough(6) |
| Dark Elves | Cauldron of Blood | Master Sword (Poison) | Armored, Fast, Fear, Fury, Impact(D6), Resistance, Strength, Tough(6) |
| Warriors of Chaos | Chaos Steed | Light Claws | Fast, Nimble |
| Warriors of Chaos | Steed of Slaanesh | Light Claws (Piercing, Poison) | Fast, Fear, Nimble |
| Warriors of Chaos | Disc of Tzeentch | Heavy Claws | Fast, Fear, Flying, Nimble |
| Warriors of Chaos | Daemonic Mount | Medium Claws | Fear, Nimble, Impact(1), Tough(3) |
| Warriors of Chaos | Juggernaut of Khorne | Heavy Claws | Fear, Impact(1), Nimble, Tough(3) |
| Warriors of Chaos | Palanquin of Nurgle | Force Claws | Fear, Impact(1), Nimble, Tough(3) |
| Warriors of Chaos | Manticore | Master Claws (Poison) | Fear, Flying, Impact(D6), Regeneration, Tough(3) |
| Warriors of Chaos | Chaos Dragon | Fiery Breath (gear), Force Claws (Piercing) | Fear, Flying, Impact(D6), Tough(6) |
| Vampire Counts | Nightmare | Light Claws | Fast, Nimble |
| Vampire Counts | Hellsteed | Light Claws | Fast, Flying, Nimble |
| Vampire Counts | Abyssal Terror | Heavy Claws | Armored, Flying, Impact(D6), Tough(3) |
| Vampire Counts | Coven Throne | Spirit Horde (custom, A2D6 melee) | Armored, Fast, Impact(D6), Tough(6) |
| Vampire Counts | Terrorgheist (mount row) | Shriek (gear), Master Claws | Armored, Flying, Impact(D6), Tough(6) |
| Vampire Counts | Zombie Dragon | Fiery Breath (gear), Force Claws (Piercing) | Armored, Flying, Impact(D6), Tough(6) |
| Vampire Counts | Skeletal Steed | Light Claws | Ethereal, Fast, Nimble |
| Vampire Counts | Corpse Cart (mount row) | Restless Dead (custom, A2D6 melee) | Armored, Fast, Impact(D6), Regeneration, Tough(3), Vigor |
| Dwarfs | Shieldbearers | Medium Swords | Tough(3) |
| Dwarfs | Oathstone | — (no equipment) | Oathstone (already applied via `adds`; just needs the empty gear rules left as-is or removed) |
| Skaven | Great Pox Rat | Medium Claws (Poison) | Fast, Nimble |
| Skaven | War-Litter | Master Sword | Tough(3) |
| Skaven | Ogre Bonebreaker | Force Claws | Armored, Fear, Furious, Impact(1), Tough(3) |
| Skaven | Screaming Bell | Bell (gear), Heavy Claws | Armored, Fear, Impact(D6), Resistance, Tough(6) |
| Skaven | Plague Furnace | Fumes (custom, 12", A6, Poison), Noxious Wrecker (gear) | Armored, Impact(D6), Tough(6) |
| Lizardmen | Cold One | Medium Claws | Fast, Nimble |
| Lizardmen | Carnosaur | Master Claws (Piercing) | Armored, Fear, Furious, Impact(D6), Tough(6) |
| Lizardmen | Terradon | Light Claws | Drop Rocks, Fear, Flying, Impact(1), Nimble, Tough(3) |
| Lizardmen | Ripperdactyl | Medium Claws (Piercing, Deadly) | Fear, Flying, Furious, Impact(1), Nimble, Toad Rage, Tough(3) |
| Ogre Kingdoms | Stonehorn (mount row) | Force Claws (Piercing) | Armored, Furious, Impact(+3), Tough(6), Trample |
| Tomb Kings | Skeletal Steed | Light Claws | Fast, Nimble |
| Tomb Kings | Skeleton Chariot | Medium Claws | Armored, Fast, Impact(D6), Tough(3) |
| Tomb Kings | Warsphinx (mount row) | Master Claws | Armored, Impact(D6), Thundercrush, Tough(6) |
| Bretonnia | Bretonnian Warhorse | Light Claws | Fast, Nimble |
| Bretonnia | Royal Pegasus | Medium Claws | Flying, Impact(1), Tough(3) |
| Bretonnia | Hippogryph | Master Claws | Fear, Flying, Impact(D6), Tough(3) |
| Beastmen | Tuskgor Chariot (mount row) | Medium Claws | Armored, Fast, Impact(D6), Tough(3) |
| Beastmen | Razorgor Chariot (mount row) | Master Claws | Armored, Fast, Fear, Impact(D6), Thunderous Charge, Tough(6) |
| Wood Elves | Elven Steed | Light Claws | Fast, Nimble |
| Wood Elves | Great Eagle | Medium Claws | Flying, Impact(1), Nimble, Tough(3) |
| Wood Elves | Great Stag | Medium Claws | Fast, Fear, Impact(D3), Nimble, Tough(3) |
| Wood Elves | Forest Dragon | Fiery Breath (gear), Force Claws (Piercing) | Armored, Fear, Flying, Impact(D6), Tough(6) |
| Wood Elves | Unicorn | Medium Claws | Fast, Fear, Impact(1), Impale, Nimble, Resistance, Tough(3) |
| Daemons of Chaos | Juggernaut | Heavy Claws | Armored, Impact(1), Nimble, Tough(3) |
| Daemons of Chaos | Blood Throne | Force Claws (Piercing) | Armored, Fast, Impact(D6), Tough(3) |
| Daemons of Chaos | Palanquin | Force Claws | Impact(1), Nimble, Tough(3) |
| Daemons of Chaos | Disc | Heavy Claws | Fast, Flying, Nimble |
| Daemons of Chaos | Seeker Chariot | Master Claws (Piercing), Medium Claws (Piercing, Poison) | Armored, Fast, Impact(D6), Tough(3) |
| Daemons of Chaos | Steed | Light Claws (Piercing, Poison) | Fast, Nimble |

("Mount row" annotates a mount name that's also printed elsewhere as a full independent unit with different stats — use the shorter, `-`-Quality/-Cost row for the mount option, per the "reduced standalone variants" decision above.)

**"Replace <weapon>:" `removeEquipment` audit.** Spot-checked sites confirming the gap exists beyond Empire: Orcs Group A (titled "Upgrade with:", source says "Replace Heavy Sword:"), Empire Group B (titled "Upgrade with:", source says "Replace Medium Sword:"), Empire Group I (titled "Upgrade with:"/"Upgrade all models:", source says "Replace all Light Lances:"). Each of the 16 files' upgrade groups needs a full pass — not just these three — checking every section whose source heading contains "Replace" against the section's actual title and whether every option in it declares `removeEquipment`/`removeOneEquipment` targeting the replaced item(s).

## Risks / Trade-offs

- **Volume of hand-transcription** → mitigated by the reference table above (compiled directly from the source doc) and by a new automated audit test (see tasks) that fails loudly if any "Mount on:" option's `addEquipment` still resolves to zero weapon and zero rules, or any "Replace"-titled section option is missing removal — so a missed site fails CI rather than shipping silently.
- **A mount name collides with an unrelated equipment key already on the unit** (e.g. if a hero's own weapon happens to already use the same key as a mount's granted weapon) → `assertUniqueKeys` (already enforced by `option()`/`unit()` in `helpers.ts`) throws at data-load time, so any such collision is caught immediately by the existing test suite rather than silently overwriting.
- **This is the same "BREAKING" data shift already flagged in the proposal** — saved lists with a mount selected will show new stats. No migration needed since this is a client-side static-data change with no persisted schema version to bump.

## Migration Plan

Not applicable — static data change, no runtime migration, no schema version bump. Ship as a normal PR once tests pass.

## Open Questions

- None outstanding; all mount profiles were cross-referenced directly against `one-page-fantasy-army-lists.md` during this design's research pass.
