import { faction, customWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

// Melee weapons are named "<Tier> <Type>" per one-page-fantasy-rules.md's weapon table:
// tier gives attacks (Light 1, Medium 2, Heavy 3, Master 4, Force 5), type gives innate
// rules (Halberd: Piercing; Mace: Piercing+Poison; Lance: Impact(1); Sword/Claws: none).
// Ranged weapons named plainly (Pistol/Rifle/Bow/Longbow/Crossbow/Cannon/etc.) take their
// range/attacks/rules from that same table's ranged-weapon section.

const units: UnitInput[] = [
    { name: "General", size: 1, quality: "4+", equipment: [customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Hero, Hold the Line!, Tough(3)", upgrades: "A", cost: 60 },
    { name: "Captain", size: 1, quality: "5+", equipment: [customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Hero, Hold the Line!, Tough(3)", upgrades: "A", cost: 50 },
    { name: "Warrior Priest", size: 1, quality: "5+", equipment: [customWeapon("Medium Sword", { range: null, attacks: "2", rules: rules("") })], special: "Fury, Hero, Prayer, Resistance, Tough(3)", upgrades: "B", cost: 70 },
    { name: "Witch Hunter", size: 1, quality: "5+", equipment: [customWeapon("Pistol", { range: 12, attacks: "1", rules: rules("Piercing") }), customWeapon("Medium Sword", { range: null, attacks: "2", rules: rules("") })], special: "Accusation, Hero, Resistance, Tough(3)", upgrades: "J", cost: 35 },
    { name: "Battle Wizard", size: 1, quality: "5+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Tough(3), Wizard(1)", upgrades: "C", cost: 35 },
    { name: "Master Engineer", size: 1, quality: "5+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Ballistic Master, Tough(3)", upgrades: "D", cost: 80 },
    { name: "State Troops", size: 10, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "-", upgrades: "E, F", cost: 60 },
    { name: "Flagellants", size: 10, quality: "5+", equipment: [customWeapon("Light Maces", { range: null, attacks: "1", rules: rules("Piercing, Poison") })], special: "End is Nigh!, Fearless, Furious", upgrades: "-", cost: 130 },
    { name: "Greatswords", size: 10, quality: "4+", equipment: [customWeapon("Light Maces", { range: null, attacks: "1", rules: rules("Piercing, Poison") })], special: "Armored, Fearless", upgrades: "F", cost: 195 },
    { name: "State Marksmen", size: 5, quality: "5+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })], special: "-", upgrades: "F, G", cost: 50 },
    { name: "Pistoliers", size: 5, quality: "5+", equipment: [customWeapon("Pistol Braces", { range: 12, attacks: "2", rules: rules("") }), customWeapon("Medium Swords", { range: null, attacks: "2", rules: rules("") })], special: "Fast, Nimble", upgrades: "F, H", cost: 75 },
    { name: "Knightly Orders", size: 5, quality: "4+", equipment: [customWeapon("Light Lances", { range: null, attacks: "1", rules: rules("Impact(1)") })], special: "Armored, Nimble", upgrades: "F, I", cost: 85 },
    { name: "Demigryph Knights", size: 3, quality: "4+", equipment: [customWeapon("Light Halberds", { range: null, attacks: "1", rules: rules("Piercing") }), customWeapon("Heavy Claws", { range: null, attacks: "3", rules: rules("Piercing") })], special: "Armored, Fear, Nimble, Impact(1), Tough(3)", upgrades: "F, K", cost: 160 },
    { name: "Celestial Hurricanum", size: 1, quality: "4+", equipment: [customWeapon("Storm", { range: 24, attacks: "3", rules: rules("Piercing") }), customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Armored, Fast, Impact(D6), Portents, Tough(6)", upgrades: "-", cost: 100 },
    { name: "Luminark of Hysh", size: 1, quality: "4+", equipment: [customWeapon("Bolt", { range: 36, attacks: "3", rules: rules("Piercing, Single Target") }), customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Armored, Fast, Impact(D6), Protection, Tough(6)", upgrades: "-", cost: 105 },
    { name: "Steam Tank", size: 1, quality: "4+", equipment: [customWeapon("Steam Cannon", { range: 36, attacks: "D3+3", rules: rules("Piercing") }), gear("Fiery Breath", { rules: rules("Fiery Breath") })], special: "Armored, Fast, Impact(D6), Tough(9)", upgrades: "-", cost: 175 },
    { name: "Great Cannon", size: 1, quality: "5+", equipment: [customWeapon("Cannon", { range: 48, attacks: "D3+3", rules: rules("Piercing") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 85 },
    { name: "Helstorm Battery", size: 1, quality: "5+", equipment: [customWeapon("Rocket Battery", { range: 48, attacks: "D3*3", rules: rules("Piercing, Indirect") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 115 },
    { name: "Helblaster Gun", size: 1, quality: "5+", equipment: [customWeapon("Volley Gun", { range: 24, attacks: "18", rules: rules("Piercing") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 130 },
    { name: "Mortar", size: 1, quality: "5+", equipment: [customWeapon("Mortar", { range: 48, attacks: "9", rules: rules("Piercing, Indirect") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 160 },
]

export const empire = faction({
  id: "empire",
  name: "Empire",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [customWeapon("Master Sword", { range: null, attacks: '4', rules: rules('') })] },
        // "(Mounted Only)" is a printed usage restriction, not a special rule the model gains — not modeled as a RuleRef (no prerequisite mechanism ties an option to "currently mounted" state today).
        { label: "Heavy Lance (Mounted Only)", cost: 5, addEquipment: [customWeapon("Heavy Lance", { range: null, attacks: '3', rules: rules("Impact(1)") })] },
        { label: "Heavy Mace", cost: 15, addEquipment: [customWeapon("Heavy Mace", { range: null, attacks: '3', rules: rules('Piercing, Poison') })] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Pistol", cost: 5, addEquipment: [customWeapon("Pistol", { range: 12, attacks: '1', rules: rules('Piercing') })] },
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] },
        { label: "Rifle", cost: 10, addEquipment: [customWeapon("Rifle", { range: 24, attacks: '1', rules: rules('Piercing') })] },
        { label: "Longbow", cost: 15, addEquipment: [customWeapon("Longbow", { range: 30, attacks: '1', rules: rules('') })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Warhorse", cost: 10, addEquipment: [gear("Warhorse")] },
        { label: "Imperial Pegasus", cost: 30, addEquipment: [gear("Imperial Pegasus")] },
        { label: "War Altar of Sigmar", cost: 100, addEquipment: [gear("War Altar of Sigmar")] },
        { label: "Imperial Griffon", cost: 100, addEquipment: [gear("Imperial Griffon")] },
        { label: "Imperial Dragon", cost: 115, addEquipment: [gear("Imperial Dragon")] }
      ])
    ]),
    group("G", [
      section("Replace all Bows:", 'one', [
        { label: "Rifles", cost: 10, addEquipment: [customWeapon("Rifles", { range: 24, attacks: '1', rules: rules('Piercing') })], removeEquipment: ["Bows"] },
        { label: "Crossbows", cost: 20, addEquipment: [customWeapon("Crossbows", { range: 30, attacks: '1', rules: rules('Piercing') })], removeEquipment: ["Bows"] }
      ]),
      section("Replace one Bow with one:", 'one', [
        { label: "Repeater Handgun", cost: 15, addEquipment: [customWeapon("Repeater Handgun", { range: 24, attacks: "3", rules: rules("Piercing") })], removeOneEquipment: ["Bow"] },
        { label: "Hochland Rifle (Sniper)", cost: 40, addEquipment: [customWeapon("Hochland Rifle", { range: 36, attacks: "1", rules: rules("Piercing, Sniper") })], removeOneEquipment: ["Bow"] }
      ]),
      section("Upgrade all models:", 'any', [
        { label: "Huntsman Training (Scout)", cost: 10, adds: ["Scout"] }
      ])
    ]),
    group("H", [
      section("Upgrade with:", 'any', [
        { label: "Repeater Handguns", cost: 70, addEquipment: [customWeapon("Repeater Handguns", { range: 24, attacks: "3", rules: rules("Piercing") })] }
      ]),
      section("Replace one Pistol Brace:", 'one', [
        { label: "Repeater Handgun", cost: 15, addEquipment: [customWeapon("Repeater Handgun", { range: 24, attacks: "3", rules: rules("Piercing") })], removeOneEquipment: ["Pistol Brace"] }
      ])
    ]),
    group("I", [
      section("Upgrade with:", 'any', [
        { label: "Light Maces", cost: 10, addEquipment: [customWeapon("Light Maces", { range: null, attacks: '1', rules: rules('Piercing, Poison') })] }
      ]),
      section("Upgrade all models:", 'any', [
        { label: "Reiksguard Training (Fearless)", cost: 15, adds: ["Fearless"] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Heavy Sword", cost: 5, addEquipment: [customWeapon("Heavy Sword", { range: null, attacks: '3', rules: rules('') })] },
        { label: "Medium Mace", cost: 10, addEquipment: [customWeapon("Medium Mace", { range: null, attacks: '2', rules: rules('Piercing, Poison') })] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Warhorse", cost: 5, addEquipment: [gear("Warhorse")] }
      ])
    ]),
    group("J", [
      section("Upgrade with:", 'any', [
        { label: "Medium Mace", cost: 10, addEquipment: [customWeapon("Medium Mace", { range: null, attacks: '2', rules: rules('Piercing, Poison') })] }
      ])
    ]),
    group("K", [
      section("Upgrade with:", 'any', [
        { label: "Light Lances", cost: 5, addEquipment: [customWeapon("Light Lances", { range: null, attacks: '1', rules: rules('Impact(1)') })] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Warhorse", cost: 5, addEquipment: [gear("Warhorse")] }
      ])
    ]),
    group("L", [
      section("Upgrade with:", 'any', [
        { label: "Iron Hooves (Piercing Impact hits)", cost: 5, adds: ["Piercing"] },
        // "Swift as the Wind" grants a move bonus with no matching glossary rule id — kept as a bare addRules token (parsed name only, no glossary text) rather than invented.
        { label: "Swift as the Wind", cost: 5, adds: ["Swift as the Wind"] }
      ])
    ]),
    group("D", [
      section("Equip with one:", 'one', [
        { label: "Blunderbuss", cost: 5, addEquipment: [customWeapon("Blunderbuss", { range: 18, attacks: "1", rules: rules("Piercing") })] },
        { label: "Repeater Pistol", cost: 10, addEquipment: [customWeapon("Repeater Pistol", { range: 12, attacks: "3", rules: rules("Piercing") })] },
        { label: "Pigeon Bomb", cost: 10, addEquipment: [customWeapon("Pigeon Bomb", { range: 24, attacks: "D3", rules: rules("Piercing") })] },
        { label: "Repeater Handgun", cost: 20, addEquipment: [customWeapon("Repeater Handgun", { range: 24, attacks: "3", rules: rules("Piercing") })] },
        { label: "Hochland Rifle (Sniper)", cost: 45, addEquipment: [customWeapon("Hochland Rifle", { range: 36, attacks: "1", rules: rules("Piercing, Sniper") })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Warhorse", cost: 5, addEquipment: [gear("Warhorse")] },
        { label: "Mechanical Steed", cost: 20, addEquipment: [gear("Mechanical Steed")] }
      ])
    ]),
    group("M", [
      section("Upgrade with:", 'any', [
        { label: "Bloodroar", cost: 5, adds: ["Bloodroar"] },
        { label: "Two Heads (+1A in Melee)", cost: 5, adds: ["+1A in Melee"] }
      ])
    ]),
    group("E", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 10, addEquipment: [customWeapon("Light Spears", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Light Swords"] },
        { label: "Light Halberds", cost: 10, addEquipment: [customWeapon("Light Halberds", { range: null, attacks: '1', rules: rules('Piercing') })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 20, addEquipment: [customWeapon("Medium Swords", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Accusation", "At the beginning of the game select one enemy model. The witch hunter may always target that model directly even if it is part of a unit, and it has the Rapid and Deadly rules against it."),
    armyRule("Ballistic Master", "Each round one Ordnance unit within 3” may shoot at Quality 4+."),
    armyRule("End is Nigh!", "Whenever this unit fights in melee you may sacrifice D3 models before combat begins. If you do then this unit gets the Armored and Rapid special rules for that combat."),
    armyRule("Fury", "The hero and his unit get the Furious rule."),
    armyRule("Hold the Line!", "The hero and his unit get the Fearless special rule."),
    armyRule("Holy Fervour", "All friendly units within 6” get the Furious special rule."),
    armyRule("Portents", "All friendly units within 6” get the Rapid special rule."),
    armyRule("Prayer", "Whenever the hero and his unit fight in melee roll one die, on a 4+ the unit gets the Rapid and Armored special rules."),
    armyRule("Protection", "All friendly units within 6” may ignore Wounds of 6+."),
  ],
  psychicPowers: [
    power("Spirit Leech", 6, "Target enemy model within 12” must take a morale test. If failed it immediately takes D3 wounds."),
    power("Fireball", 7, "Target enemy unit within 24” takes D6 automatic hits."),
    power("Earth Blood", 8, "The wizard and his unit get the Regeneration rule until the end of the round."),
    power("Plague of Rust", 10, "Target enemy unit within 24” must re-roll blocks until the end of the round."),
    power("Wyssan’s Wildform", 10, "Target friendly unit within 12” gets the Piercing and Armored rules until the end of the round."),
    power("Mystifying Miasma", 13, "Target enemy unit within 48” must re-roll successful hits in Melee or Shooting until the end of the round (pick one)."),
  ],
})

export default empire
