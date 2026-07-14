import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Lord", size: 1, quality: "3+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Fearless, Furious, Hero, Shieldwall, Slow,Tough(3)", upgrades: "A, F", cost: 45 },
    { name: "Thane", size: 1, quality: "4+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Fearless, Furious, Hero, Shieldwall, Slow,Tough(3)", upgrades: "A, F", cost: 35 },
    { name: "Dragon Slayer", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword", rules: rules('Deadly') })], special: "Deathblow, Fearless, Furious, Hero, Slow, Tough(3)", upgrades: "F", cost: 55 },
    { name: "Runesmith", size: 1, quality: "4+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword", rules: rules('Piercing') })], special: "Armored, Fearless, Furious, Hero, Shieldwall, Slow,Tough(3)", upgrades: "A, F, M", cost: 40 },
    { name: "Master Engineer", size: 1, quality: "4+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Artillery Master, Entrenchment, Fearless, Furious, Hero, Resistance, Slow, Tough(3)", upgrades: "A, F", cost: 90 },
    { name: "Dwarf Warriors", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fearless, Furious, Shieldwall, Slow", upgrades: "B, I", cost: 115 },
    { name: "Longbeards", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fearless, Furious, Shieldwall, Slow", upgrades: "B, G, I", cost: 150 },
    { name: "Miners", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "Fearless, Furious, Scout, Slow", upgrades: "B, K", cost: 180 },
    { name: "Ironbreakers", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Armored, Fearless, Furious, Shieldwall, Slow", upgrades: "B, C, G", cost: 180 },
    { name: "Slayers", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords", rules: rules('Deadly') })], special: "Deathblow, Fearless, Furious, Slow", upgrades: "B, F, G", cost: 205 },
    { name: "Hammerers", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Maces" })], special: "Fearless, Furious, Shieldwall, Slow", upgrades: "B, F, G", cost: 290 },
    { name: "Thunderers", size: 5, quality: "4+", equipment: [customWeapon("Rapid Rifles", { range: null, attacks: "1", rules: rules("") })], special: "Fearless, Furious, Shieldwall, Slow", upgrades: "B, J", cost: 120 },
    { name: "Irondrakes", size: 5, quality: "3+", equipment: [customWeapon("Drakeguns", { range: 18, attacks: "1", rules: rules("Piercing, Rapid") })], special: "Armored, Fearless, Furious, Slow", upgrades: "B, C, E, G", cost: 140 },
    { name: "Rangers", size: 5, quality: "4+", equipment: [customWeapon("Rapid Crossbows", { range: null, attacks: "1", rules: rules("") }), meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "Fearless, Furious, Scout, Slow", upgrades: "B, L", cost: 165 },
    { name: "Gyrocopter", size: 1, quality: "4+", equipment: [customWeapon("Steam Gun", { range: 12, attacks: "6", rules: rules("Piercing") }), meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Dive Bomb, Fearless, Flying, Furious, Tough(3)", upgrades: "D", cost: 80 },
    { name: "Gyrobomber", size: 1, quality: "4+", equipment: [customWeapon("Clattergun", { range: 24, attacks: "4", rules: rules("Piercing") }), meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Bombing Run, Fearless, Flying, Furious, Tough(3)", upgrades: "-", cost: 160 },
    { name: "Flame Cannon", size: 1, quality: "4+", equipment: [customWeapon("Fire Thrower", { range: 18, attacks: "6", rules: rules("") })], special: "Armored, Fearless, Ordnance, Slow, Tough(3)", upgrades: "H", cost: 50 },
    { name: "Bolt Thrower", size: 1, quality: "4+", equipment: [customWeapon("Bolt Thrower", { range: 48, attacks: "3", rules: rules("Piercing") })], special: "Armored, Fearless, Ordnance, Slow, Tough(3)", upgrades: "H", cost: 75 },
    { name: "Grudge Thrower", size: 1, quality: "4+", equipment: [customWeapon("Stone Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Indirect") })], special: "Armored, Fearless, Ordnance, Slow, Tough(3)", upgrades: "H", cost: 100 },
    { name: "Dwarf Cannon", size: 1, quality: "4+", equipment: [customWeapon("Cannon", { range: 48, attacks: "D3+3", rules: rules("Piercing") })], special: "Armored, Fearless, Ordnance, Slow, Tough(3)", upgrades: "H", cost: 120 },
    { name: "Organ Gun", size: 1, quality: "4+", equipment: [customWeapon("Organ Gun", { range: 30, attacks: "12", rules: rules("Piercing") })], special: "Armored, Fearless, Ordnance, Slow, Tough(3)", upgrades: "H", cost: 165 },
]

export const dwarfs = faction({
  id: "dwarfs",
  name: "Dwarfs",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("J", [
      // Source prints "Replace all Light Swords: Light Maces +25pts" stacked under
      // this same column as J, but Thunderers (the only unit with group J) has no
      // Light Swords at all — likely column-bleed from a neighboring unit's own
      // upgrade text in the PDF extraction. Omitted as unreachable/misattributed
      // rather than guessed at.
      section("Replace all Rapid Rifles:", 'one', [
        { label: "Rapid Crossbows", cost: 15, addEquipment: [customWeapon("Rapid Crossbows", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Rapid Rifles"] }
      ])
    ]),
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Heavy Sword", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })] },
        { label: "Medium Mace", cost: 10, addEquipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Mace" })] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Rapid Pistol", cost: 10, addEquipment: [customWeapon("Rapid Pistol", { range: null, attacks: '1', rules: rules('') })] },
        { label: "Rapid Rifle", cost: 15, addEquipment: [customWeapon("Rapid Rifle", { range: null, attacks: '1', rules: rules('') })] },
        { label: "Rapid Crossbow", cost: 20, addEquipment: [customWeapon("Rapid Crossbow", { range: null, attacks: '1', rules: rules('') })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Shieldbearers", cost: 40, addEquipment: [gear("Shieldbearers")] },
        { label: "Oathstone", cost: 50, adds: ["Oathstone"], addEquipment: [gear("Oathstone")] }
      ])
    ]),
    group("K", [
      section("Equip one model with any:", 'any', [
        { label: "Steam Drill (Deadly)", cost: 10, adds: ["Deadly"] },
        { label: "Blasting Charges", cost: 15, addEquipment: [customWeapon("Blasting Charges", { range: 6, attacks: "6", rules: rules("Piercing") })] }
      ])
    ]),
    group("L", [
      section("Equip all models with:", 'any', [
        { label: "Throwing Weapons", cost: 15, addEquipment: [customWeapon("Throwing Weapons", { range: null, attacks: '1', rules: rules('') })] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("M", [
      section("Upgrade with:", 'any', [
        { label: "Natural Resistance", cost: 20, adds: ["Natural Resistance"] },
        { label: "Forgefire", cost: 25, adds: ["Forgefire"] }
      ])
    ]),
    group("C", [
      section("Equip one model with:", 'any', [
        { label: "Cinderblast Bomb", cost: 10, addEquipment: [customWeapon("Cinderblast Bomb", { range: 6, attacks: "3", rules: rules("Piercing, Indirect") })] }
      ])
    ]),
    group("D", [
      section("Replace Steam Gun:", 'one', [
        { label: "Brimstone Gun", cost: 0, addEquipment: [customWeapon("Brimstone Gun", { range: 18, attacks: "D3", rules: rules("Piercing, Rapid") })], removeEquipment: ["Steam Gun"] }
      ]),
      section("Upgrade with:", 'any', [
        { label: "Vanguard", cost: 5, adds: ["Vanguard"] }
      ])
    ]),
    group("E", [
      section("Replace one Drakegun:", 'one', [
        { label: "Trollhammer Torpedo", cost: 20, addEquipment: [customWeapon("Trollhammer Torpedo", { range: 24, attacks: "3", rules: rules("Piercing, Single Target") })], removeOneEquipment: ["Drakeguns"] }
      ])
    ]),
    group("F", [
      section("Equip one model with one:", 'one', [
        { label: "Rune of Slaying (Piercing in Melee)", cost: 5, adds: ["Piercing in Melee"] },
        { label: "Rune of Flight", cost: 10, addEquipment: [customWeapon("Rune of Flight", { range: 12, attacks: "1", rules: rules("Sniper") })] },
        { label: "Rune of Fortitude (Regeneration)", cost: 10, adds: ["Regeneration"] },
        { label: "Rune of Adamant (Ignore Piercing)", cost: 20, adds: ["Ignore Piercing"] },
        { label: "Rune of Smiting (Deadly in Melee)", cost: 20, adds: ["Deadly in Melee"] },
        { label: "Rune of Gromril (Tough(+3))", cost: 35, adds: ["Tough(+3)"] }
      ])
    ]),
    group("G", [
      section("Equip one model with one:", 'one', [
        { label: "Rune of Battle", cost: 10, adds: ["Rune of Battle"] },
        { label: "Rune of Slowness", cost: 25, adds: ["Rune of Slowness"] },
        { label: "Rune of Sanctuary (Resistance)", cost: 25, adds: ["Resistance"] }
      ])
    ]),
    group("H", [
      section("Equip with one:", 'one', [
        { label: "Rune of Disguise", cost: 5, adds: ["Rune of Disguise"] },
        { label: "Rune of Immolation", cost: 10, adds: ["Rune of Immolation"] },
        { label: "Rune of Accuracy (Rapid)", cost: 45, adds: ["Rapid"] }
      ])
    ]),
    group("I", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Maces", cost: 50, addEquipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], removeEquipment: ["Light Swords"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Artillery Master", "Each round one Ordnance unit within 3” may shoot at Quality 3+."),
    armyRule("Bombing Run", "This unit may deal 9p hits to one enemy unit it passed over each round."),
    armyRule("Deathblow", "When a model with this rule is killed in melee its attacker takes one automatic hit."),
    armyRule("Dive Bomb", "Once per game this unit may deal 6p hits to one enemy unit it passed over."),
    armyRule("Entrenchment", "Declare one friendly Ordnance unit as entrenched during deployment. The unit counts as being in Cover as long as it is entrenched. If the unit moves it loses its entrenchment."),
    armyRule("Forgefire", "The hero’s unit gets the Piercing rule."),
    armyRule("Natural Resistance", "As long as this hero is alive you may add +2 to the result of your dispel rolls."),
    armyRule("Oathstone", "When taking morale tests this unit rolls one extra die and picks the highest result."),
    armyRule("Shieldwall", "This unit may ignore wounds on a 6+ when being charged."),
    armyRule("Slow", "This unit moves up to 3” when using Advance actions, up to 6” when using March/Charge actions."),
  ],
  psychicPowers: [

  ],
})

export default dwarfs
