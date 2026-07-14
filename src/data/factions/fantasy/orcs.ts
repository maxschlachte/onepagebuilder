import { faction, customWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Black Orc Boss", size: 1, quality: "4+", equipment: [gear("Heavily Armed", { rules: rules("Heavily Armed") })], special: "Fearless, Hero, Tough(3), Waaagh!", upgrades: "A", cost: 105 },
    { name: "Savage Orc Boss", size: 1, quality: "5+", equipment: [customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Furious, Hero, Tough(3), Waaagh!", upgrades: "A", cost: 85 },
    { name: "Orc Boss", size: 1, quality: "5+", equipment: [customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Hero, Tough(3), Waaagh!", upgrades: "A", cost: 80 },
    { name: "Savage Orc Shaman", size: 1, quality: "5+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Furious, Tough(3), Wizard(1)", upgrades: "B", cost: 30 },
    { name: "Orc Shaman", size: 1, quality: "5+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Tough(3), Wizard(1)", upgrades: "B", cost: 25 },
    { name: "Orc Boyz", size: 10, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "-", upgrades: "C, E", cost: 60 },
    { name: "Savage Boyz", size: 10, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Furious", upgrades: "C, D, E", cost: 70 },
    { name: "Black Orcs", size: 10, quality: "4+", equipment: [gear("Heavily Armed", { rules: rules("Heavily Armed") })], special: "Fearless", upgrades: "C", cost: 165 },
    { name: "Orc Arrer Boyz", size: 5, quality: "5+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })], special: "-", upgrades: "C", cost: 50 },
    { name: "Savage Arrer Boyz", size: 5, quality: "5+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })], special: "Furious", upgrades: "C, D", cost: 60 },
    { name: "Orc Boar Boyz", size: 5, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Fast, Nimble, Tusker Charge", upgrades: "C, F", cost: 50 },
    { name: "Savage Boar Boyz", size: 5, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Fast, Furious, Nimble, Tusker Charge", upgrades: "C, F", cost: 55 },
    { name: "Trolls", size: 3, quality: "4+", equipment: [customWeapon("Heavy Swords", { range: null, attacks: "3", rules: rules("") }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Tough(3)", upgrades: "-", cost: 125 },
    { name: "River Trolls", size: 3, quality: "4+", equipment: [customWeapon("Heavy Swords", { range: null, attacks: "3", rules: rules("") }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Strider, Tough(3)", upgrades: "-", cost: 130 },
    { name: "Stone Trolls", size: 3, quality: "4+", equipment: [customWeapon("Heavy Swords", { range: null, attacks: "3", rules: rules("") }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Resistance, Tough(3)", upgrades: "-", cost: 140 },
    { name: "Giant", size: 1, quality: "4+", equipment: [gear("Giant Attack", { rules: rules("Giant Attack") })], special: "Armored, Fall Over, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "-", cost: 100 },
    { name: "Orc Boar Chariot", size: 1, quality: "5+", equipment: [customWeapon("Medium Spear", { range: null, attacks: "2", rules: rules("") }), customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Armored, Fast, Impact(D6), Tough(3), Tusker Charge", upgrades: "-", cost: 45 },
]

export const orcs = faction({
  id: "orcs",
  name: "Orcs",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [customWeapon("Master Sword", { range: null, attacks: '4', rules: rules('') })] },
        // "(Mounted Only)" is a printed usage restriction, not a special rule the model gains.
        { label: "Heavy Spear (Mounted Only)", cost: 5, addEquipment: [customWeapon("Heavy Spear", { range: null, attacks: '3', rules: rules('') })] },
        { label: "Heavy Mace", cost: 15, addEquipment: [customWeapon("Heavy Mace", { range: null, attacks: '3', rules: rules('Piercing, Poison') })] }
      ]),
      section("Mount on:", 'any', [
        { label: "War Boar", cost: 10, addEquipment: [gear("War Boar")] },
        { label: "Boar Chariot", cost: 55, addEquipment: [gear("Boar Chariot")] },
        { label: "Wyvern", cost: 95, addEquipment: [gear("Wyvern")] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "War Boar", cost: 5, addEquipment: [gear("War Boar")] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Big Stabba", cost: 5, addEquipment: [customWeapon("Big Stabba", { range: null, attacks: '1', rules: rules('Impact(D3)') })] }
      ])
    ]),
    group("E", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 10, addEquipment: [customWeapon("Light Spears", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 20, addEquipment: [customWeapon("Medium Swords", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("F", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 5, addEquipment: [customWeapon("Light Spears", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 10, addEquipment: [customWeapon("Medium Swords", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Swords"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Fall Over", "When the giant is killed all units within 3” take D6p automatic hits."),
    armyRule("Giant Attack", "When fighting in melee this unit deals D6p automatic hits."),
    armyRule("Heavily Armed", "When fighting in melee this unit may choose to use either light maces or medium swords, and the Black Orc Boss may choose to use either a heavy mace or a force sword."),
    armyRule("Troll Vomit", "This model may replace all of its melee attacks for a single troll vomit attack. This attack hits automatically and has Piercing."),
    armyRule("Tusker Charge", "This unit gets Piercing in Melee when using Charge actions."),
    armyRule("Waaagh!", "Once per game when the hero charges you may declare a Waaagh!. Until the end of the round all friendly Infantry units get +1 when calculating melee results, and the hero’s unit gets +D3 when calculating melee results."),
  ],
  psychicPowers: [
    power("Brain Bursta", 5, "Target enemy model within 18” takes one automatic hit."),
    power("Fists of Gork", 5, "The wizard gets +3 Attacks and the Piercing rule until the end of the round."),
    power("’Eadbutt", 5, "Target enemy wizard within 4D6” takes D3 automatic hits."),
    power("Gaze of Mork", 6, "Target enemy unit within 4D6” takes D6 automatic hits."),
    power("’Ere we go!", 11, "The wizard, his unit and all friendly units within 2D6” get Rapid in Melee until the end of the round."),
    power("Hand of Gork", 13, "Target friendly unit within 24” may be placed anywhere within 3D6” of its current position."),
  ],
})

export default orcs
