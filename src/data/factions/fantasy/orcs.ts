import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Black Orc Boss", size: 1, quality: "4+", equipment: [gear("Heavily Armed", { rules: rules("Heavily Armed") })], special: "Fearless, Hero, Tough(3), Waaagh!", upgrades: "A", cost: 105 },
    { name: "Savage Orc Boss", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Furious, Hero, Tough(3), Waaagh!", upgrades: "A", cost: 85 },
    { name: "Orc Boss", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Tough(3), Waaagh!", upgrades: "A", cost: 80 },
    { name: "Savage Orc Shaman", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Furious, Tough(3), Wizard(1)", upgrades: "B", cost: 30 },
    { name: "Orc Shaman", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Tough(3), Wizard(1)", upgrades: "B", cost: 25 },
    { name: "Orc Boyz", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "-", upgrades: "C, E", cost: 60 },
    { name: "Savage Boyz", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Furious", upgrades: "C, D, E", cost: 70 },
    { name: "Black Orcs", size: 10, quality: "4+", equipment: [gear("Heavily Armed", { rules: rules("Heavily Armed") })], special: "Fearless", upgrades: "C", cost: 165 },
    { name: "Orc Arrer Boyz", size: 5, quality: "5+", equipment: [weaponFantasy('bow', { label: "Bows" })], special: "-", upgrades: "C", cost: 50 },
    { name: "Savage Arrer Boyz", size: 5, quality: "5+", equipment: [weaponFantasy('bow', { label: "Bows" })], special: "Furious", upgrades: "C, D", cost: 60 },
    { name: "Orc Boar Boyz", size: 5, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fast, Nimble, Tusker Charge", upgrades: "C, F", cost: 50 },
    { name: "Savage Boar Boyz", size: 5, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fast, Furious, Nimble, Tusker Charge", upgrades: "C, F", cost: 55 },
    { name: "Trolls", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Tough(3)", upgrades: "-", cost: 125 },
    { name: "River Trolls", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Strider, Tough(3)", upgrades: "-", cost: 130 },
    { name: "Stone Trolls", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" }), gear("Troll Vomit", { rules: rules("Troll Vomit") })], special: "Fear, Impact(1), Regeneration, Resistance, Tough(3)", upgrades: "-", cost: 140 },
    { name: "Giant", size: 1, quality: "4+", equipment: [gear("Giant Attack", { rules: rules("Giant Attack") })], special: "Armored, Fall Over, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "-", cost: 100 },
    { name: "Orc Boar Chariot", size: 1, quality: "5+", equipment: [meleeWeapon('Medium', 'Spear', { key: 'medium-spear', label: "Medium Spear" }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Impact(D6), Tough(3), Tusker Charge", upgrades: "-", cost: 45 },
]

export const orcs = faction({
  id: "orcs",
  name: "Orcs",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Heavy Sword:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Spear", cost: 5, requiresOneOfSelected: ["War Boar", "Boar Chariot", "Wyvern"], addEquipment: [meleeWeapon('Heavy', 'Spear', { key: 'heavy-spear', label: "Heavy Spear" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace" })], removeEquipment: ["heavy-sword"] }
      ]),
      section("Mount on:", 'any', [
        { label: "War Boar", cost: 10, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("War Boar", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }, { ruleId: "tusker-charge" }] })
          ]
        },
        { label: "Boar Chariot", cost: 55, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Boar Chariot", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }, { ruleId: "tusker-charge" }] })
          ]
        },
        { label: "Wyvern", cost: 95, addEquipment: [
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws", rules: rules('Poison') }),
            gear("Wyvern", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "War Boar", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("War Boar", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }, { ruleId: "tusker-charge" }] })
          ]
        }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ], { oncePerUnit: true })
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Big Stabba", cost: 5, addEquipment: [customWeapon("Big Stabba", { range: null, attacks: '1', rules: rules('Impact(D3)') })] }
      ])
    ]),
    group("E", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 10, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 20, addEquipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("F", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 10, addEquipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], removeEquipment: ["Light Swords"] }
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
