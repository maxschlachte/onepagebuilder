import { faction, customWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Wargor", size: 1, quality: "4+", equipment: [customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Hatred, Hero, Tough(3)", upgrades: "A", cost: 30 },
    { name: "Gorebull", size: 1, quality: "3+", equipment: [customWeapon("Master Sword", { range: null, attacks: "4", rules: rules("") })], special: "Fear, Furious, Hero, Impact(D3), Tough(3)", upgrades: "B", cost: 50 },
    { name: "Bray-Shaman", size: 1, quality: "5+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Hatred, Tough(3), Wizard(1)", upgrades: "C", cost: 30 },
    { name: "Ungor Herd", size: 10, quality: "5+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Ambush, Hatred", upgrades: "D, G", cost: 90 },
    { name: "Harpies", size: 10, quality: "5+", equipment: [customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Flying", upgrades: "F", cost: 100 },
    { name: "Gor Herd", size: 10, quality: "4+", equipment: [customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Ambush, Hatred", upgrades: "D, J", cost: 130 },
    { name: "Bestigor Herd", size: 10, quality: "3+", equipment: [customWeapon("Light Maces", { range: null, attacks: "1", rules: rules("Piercing, Poison") })], special: "Hatred", upgrades: "D", cost: 185 },
    { name: "Ungor Raiders", size: 5, quality: "5+", equipment: [customWeapon("Shortbows", { range: 18, attacks: "1", rules: rules("") })], special: "Ambush, Hatred", upgrades: "D", cost: 70 },
    { name: "Warhounds", size: 5, quality: "4+", equipment: [customWeapon("Light Claws", { range: null, attacks: "1", rules: rules("") })], special: "Fast, Nimble", upgrades: "E", cost: 70 },
    { name: "Centigors", size: 5, quality: "3+", equipment: [customWeapon("Medium Spears", { range: null, attacks: "2", rules: rules("") })], special: "Drunkard, Fast, Hatred, Nimble", upgrades: "D, H", cost: 150 },
    { name: "Razorgor Herd", size: 5, quality: "4+", equipment: [customWeapon("Master Claws", { range: null, attacks: "4", rules: rules("") })], special: "Armored, Fast, Fear, Nimble, Thunderous Charge, Tough(3)", upgrades: "-", cost: 250 },
    { name: "Minotaurs", size: 3, quality: "3+", equipment: [customWeapon("Heavy Swords", { range: null, attacks: "3", rules: rules("") })], special: "Fear, Furious, Impact(1), Tough(3)", upgrades: "D, I", cost: 135 },
    { name: "Chaos Spawn", size: 1, quality: "4+", equipment: [customWeapon("Tentacles", { range: null, attacks: "D6+1", rules: rules("") })], special: "Armored, Fear, Fearless, Impact(D6), Tough(3)", upgrades: "-", cost: 55 },
    { name: "Giant", size: 1, quality: "4+", equipment: [gear("Giant Attack")], special: "Armored, Fall Over, Fearless, Impact(D6), Tough(6)", upgrades: "-", cost: 100 },
    { name: "Ghorgon", size: 1, quality: "3+", equipment: [customWeapon("Force Claws", { range: null, attacks: "5", rules: rules("Piercing") })], special: "Armored, Fear, Fearless, Furious, Impact(D6), Swallow, Tough(6)", upgrades: "-", cost: 160 },
    { name: "Jabberslythe", size: 1, quality: "3+", equipment: [customWeapon("Slythey Tongue", { range: 12, attacks: "1", rules: rules("Piercing") }), customWeapon("Master Claws", { range: null, attacks: "4", rules: rules("Poison") })], special: "Armored, Bile-Blood, Fear, Fearless, Flying, Impact(D6), Madness, Tough(6)", upgrades: "-", cost: 170 },
    { name: "Cygor", size: 1, quality: "3+", equipment: [customWeapon("Stone Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Indirect, Unwieldy") }), customWeapon("Force Claws", { range: null, attacks: "5", rules: rules("Piercing, Unwieldy") })], special: "Armored, Fear, Fearless, Ghostsight, Impact(D6), Resistance, Souleater, Tough(6)", upgrades: "-", cost: 200 },
    { name: "Tuskgor Chariot", size: 1, quality: "4+", equipment: [customWeapon("Medium Spear", { range: null, attacks: "2", rules: rules("") }), customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Armored, Fast, Hatred, Impact(D6), Tough(3)", upgrades: "K", cost: 60 },
    { name: "Razorgot Chariot", size: 1, quality: "4+", equipment: [customWeapon("Medium Spear", { range: null, attacks: "2", rules: rules("") }), customWeapon("Master Claws", { range: null, attacks: "4", rules: rules("") })], special: "Armored, Fast, Fear, Hatred, Impact(D6), Thunderous Charge, Tough(6)", upgrades: "K", cost: 100 },
]

export const beastmen = faction({
  id: "beastmen",
  name: "Beastmen",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Heavy Sword:", 'one', [
        { label: "Master Sword", cost: 5, addEquipment: [customWeapon("Master Sword", { range: null, attacks: '4', rules: rules('') })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [customWeapon("Heavy Mace", { range: null, attacks: '3', rules: rules("Piercing, Poison") })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Tuskgor Chariot", cost: 60, addEquipment: [gear("Tuskgor Chariot")] },
        { label: "Razorgor Chariot", cost: 100, addEquipment: [gear("Razorgor Chariot")] }
      ])
    ]),
    group("B", [
      section("Replace Master Sword:", 'one', [
        { label: "Force Sword", cost: 5, addEquipment: [customWeapon("Force Sword", { range: null, attacks: '5', rules: rules('') })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [customWeapon("Master Mace", { range: null, attacks: '4', rules: rules("Piercing, Poison") })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] }
      ])
    ]),
    group("C", [
      section("Replace Light Sword:", 'one', [
        { label: "Medium Sword", cost: 5, addEquipment: [customWeapon("Medium Sword", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Sword"] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Tuskgor Chariot", cost: 50, addEquipment: [gear("Tuskgor Chariot")] },
        { label: "Razorgor Chariot", cost: 80, addEquipment: [gear("Razorgor Chariot")] }
      ])
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Poison", cost: 15, adds: ["Poison"] },
        { label: "Scaly Skin (Armored)", cost: 15, adds: ["Armored"] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Scout", cost: 20, adds: ["Scout"] }
      ])
    ]),
    group("G", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 15, addEquipment: [customWeapon("Light Spears", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("H", [
      section("Replace all Medium Spears:", 'one', [
        { label: "Medium Maces", cost: 30, addEquipment: [customWeapon("Medium Maces", { range: null, attacks: '2', rules: rules("Piercing, Poison") })], removeEquipment: ["Medium Spears"] }
      ]),
      section("Equip all models with:", 'any', [
        { label: "Throwing Weapons", cost: 25, addEquipment: [customWeapon("Throwing Weapons", { range: 12, attacks: '1', rules: rules('') })] }
      ])
    ]),
    group("I", [
      section("Replace all Heavy Swords:", 'one', [
        { label: "Master Swords", cost: 10, addEquipment: [customWeapon("Master Swords", { range: null, attacks: '4', rules: rules('') })], removeEquipment: ["Heavy Swords"] },
        { label: "Heavy Maces", cost: 45, addEquipment: [customWeapon("Heavy Maces", { range: null, attacks: '3', rules: rules("Piercing, Poison") })], removeEquipment: ["Heavy Swords"] }
      ])
    ]),
    group("J", [
      section("Replace all Light Swords:", 'one', [
        { label: "Medium Swords", cost: 40, addEquipment: [customWeapon("Medium Swords", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("K", [
      section("Replace Medium Spear:", 'one', [
        { label: "Medium Mace", cost: 5, addEquipment: [customWeapon("Medium Mace", { range: null, attacks: '2', rules: rules("Piercing, Poison") })], removeEquipment: ["Medium Spear"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Ambush", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit on the table touching any table edge over 6” away from enemy units. If the unit has not arrived by the last round it arrives automatically."),
    armyRule("Bile-Blood", "Whenever this unit takes a wound in melee, its attacker takes one automatic hit."),
    // The drunkard table's 3 results are folded into one text block rather than modeled as a die-roll mechanic (this app doesn't simulate random army-building outcomes).
    armyRule("Drunkard", "At the beginning of the game roll one die on the following table, and all models in this unit get one of the following special rules: 1-2 Sober for Once (Rapid Melee); 3-4 Hungover (+1A when Charging); 5-6 Totally Drunk (Fearless)."),
    armyRule("Fall Over", "When the giant is killed all units within 3” take D6p automatic hits."),
    armyRule("Ghostsight", "This unit may re-roll failed hits when attacking units with the Wizard special rule."),
    armyRule("Giant Attack", "When fighting in melee this unit deals D6p automatic hits."),
    armyRule("Hatred", "This model may re-roll any failed hits, and if it has Rapid it may re-roll twice."),
    armyRule("Madness", "When this unit is activated, all enemy units within 12” must take a morale test. If failed they take D3 wounds."),
    armyRule("Souleater", "Whenever an enemy wizard within 24” of this unit wants to cast a spell, it must take a morale test. If failed the wizard may not cast any spells for the round."),
    armyRule("Swallow", "This model may replace all of its melee attacks for a single swallow attack. Roll one die, on a 4+ the target takes D3+1 wounds which must be applied to a single model. If a model is killed this way this model immediately restores D3 wounds."),
    armyRule("Thunderous Charge", "This unit gets Piercing in Melee when using Charge actions."),
  ],
  psychicPowers: [
    power("Mantle of Ghorok", 5, "Target friendly model within 6” gets +D6 Attacks in Melee until the end of the round."),
    power("Bestial Surge", 7, "All friendly units within 6” move D6+1” toward the nearest enemy unit."),
    power("Devolve", 7, "All enemy units within 12” must take a morale test. If failed they take D3 wounds."),
    power("Bray-Scream", 7, "Target friendly model within 12” may immediately make a Fiery Breath attack."),
    power("Viletide", 10, "Target enemy unit within 24” takes 2D6 automatic hits."),
    power("Traitor-Kin", 13, "All enemy units within 12” take as many hits as models in them. Models with Tough take as many hits as their Tough value."),
  ],
})

export default beastmen
