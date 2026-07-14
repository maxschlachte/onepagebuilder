import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Chaos Lord", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Armored, Hero, Tough(3)", upgrades: "A, B", cost: 50 },
    { name: "Chaos Sorcerer", size: 1, quality: "3+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Armored, Hero, Tough(3), Wizard(1)", upgrades: "A, B", cost: 65 },
    { name: "Daemon Prince", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword", rules: rules('Piercing') })], special: "Armored, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "A, D", cost: 140 },
    { name: "Chaos Marauders", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "-", upgrades: "C, H, M", cost: 90 },
    { name: "Chaos Warriors", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Armored", upgrades: "C, G, N", cost: 190 },
    { name: "Chosen", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Armored, Fearless", upgrades: "C, G, N", cost: 230 },
    { name: "Forsaken", size: 10, quality: "3+", equipment: [customWeapon("Freakish Limbs", { range: null, attacks: "D3", rules: rules("") })], special: "Armored, Fearless, Furious, Mutations", upgrades: "N", cost: 280 },
    { name: "Chaos Warhounds", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fast, Nimble", upgrades: "E", cost: 70 },
    { name: "Marauder Horsemen", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fast, Nimble", upgrades: "C, J, M", cost: 70 },
    { name: "Hellstriders", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears", rules: rules('Piercing, Poison') })], special: "Fast, Fear, Nimble", upgrades: "C", cost: 115 },
    { name: "Chaos Knights", size: 5, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Armored, Fear, Nimble", upgrades: "C, I, N", cost: 125 },
    { name: "Skullcrushers", size: 3, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fear, Impact(1), Nimble, Tough(3)", upgrades: "C, I", cost: 185 },
    { name: "Chaos Ogres", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })], special: "Fear, Impact(D3), Tough(3)", upgrades: "C, L, M", cost: 110 },
    { name: "Chaos Trolls", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" }), customWeapon("Troll Vomit", { range: null, attacks: "1", rules: rules("") })], special: "Fear, Impact(1), Regeneration, Tough(3)", upgrades: "Q", cost: 125 },
    { name: "Skullreapers", size: 3, quality: "3+", equipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], special: "Furious, Tough(3)", upgrades: "C, O", cost: 125 },
    { name: "Putrid Blightknights", size: 3, quality: "3+", equipment: [customWeapon("Bountiful Blades", { range: null, attacks: "1", rules: rules("") })], special: "Armored, Regeneration, Tough(3)", upgrades: "C", cost: 155 },
    { name: "Dragon Ogres", size: 3, quality: "3+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })], special: "Fear, Impact(1), Resistance, Tough(3)", upgrades: "K", cost: 145 },
    { name: "Slaughterbrute", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws", rules: rules('Piercing') })], special: "Armored, Fear, Impact(D6), Tough(3)", upgrades: "R", cost: 70 },
    { name: "Chaos Spawn", size: 1, quality: "4+", equipment: [customWeapon("Mutated Limbs", { range: null, attacks: "D6+1", rules: rules("") })], special: "Armored, Fear, Impact(1), Tough(6)", upgrades: "A", cost: 75 },
    { name: "Chimera", size: 1, quality: "3+", equipment: [customWeapon("Jaws and Tail", { range: null, attacks: "D3+6", rules: rules("") })], special: "Armored, Fear, Flying, Impact(D6), Tough(3)", upgrades: "F", cost: 85 },
    { name: "Dragon Shaggoth", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Fear, Impact(D6), Resistance, Tough(6)", upgrades: "S", cost: 90 },
    { name: "Giant", size: 1, quality: "4+", equipment: [customWeapon("Giant Attack", { range: null, attacks: "1", rules: rules("") })], special: "Armored, Fall Over, Fear, Fearless,Impact(D6),Tough(6)", upgrades: "A", cost: 100 },
    { name: "Chaos Chariot", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Halberd', { key: 'master-halberd', label: "Master Halberds", rules: rules('Piercing') }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Impact(D6), Tough(3)", upgrades: "A", cost: 80 },
    { name: "Gorebeast Chariot", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Halberd', { key: 'master-halberd', label: "Master Halberd" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fast, Fear, Gorebeast, Impact(D6), Tough(6)", upgrades: "A", cost: 150 },
    { name: "Chaos Warshrine", size: 1, quality: "3+", equipment: [customWeapon("Shrine Bearers", { range: null, attacks: "D6+4", rules: rules("") })], special: "Armored, Fear, Giver of Glory, Tough(6)", upgrades: "A", cost: 190 },
    { name: "Mutalith Beast", size: 1, quality: "3+", equipment: [gear("Maelstrom", { rules: rules("Maelstrom") }), customWeapon("Maw", { range: null, attacks: "D6+2", rules: rules("") })], special: "Armored, Fear, Impact(D6), Regeneration, Tough(6)", upgrades: "-", cost: 150 },
    { name: "Hellcannon", size: 1, quality: "3+", equipment: [customWeapon("Stone Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Indirect") }), meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws" })], special: "Armored, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "-", cost: 195 },
]

export const warriorsofchaos = faction({
  id: "warriors-of-chaos",
  name: "Warriors of Chaos",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Slaanesh (Fearless)", cost: 5, adds: ["Fearless"] },
        { label: "Khorne (Furious)", cost: 5, adds: ["Furious"] },
        { label: "Tzeentch (Resistance)", cost: 10, adds: ["Resistance"] },
        { label: "Nurgle (Regeneration)", cost: 20, adds: ["Regeneration"] }
      ])
    ]),
    group("G", [
      section("Upgrade with:", 'any', [
        { label: "Heavy Swords", cost: 40, addEquipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })] },
        { label: "Medium Halberds", cost: 40, addEquipment: [meleeWeapon('Medium', 'Halberd', { key: 'medium-halberd', label: "Medium Halberds" })] },
        { label: "Medium Maces", cost: 100, addEquipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Maces" })] }
      ])
    ]),
    group("H", [
      section("Upgrade with:", 'any', [
        { label: "Light Maces", cost: 45, addEquipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })] },
        { label: "Master Lance (Mounted Only)", cost: 5, addEquipment: [meleeWeapon('Master', 'Lance', { key: 'master-lance', label: "Master Lance", rules: rules('Mounted Only') })] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace" })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Chaos Steed", cost: 10, addEquipment: [gear("Chaos Steed")] },
        { label: "Steed of Slaanesh", cost: 20, addEquipment: [gear("Steed of Slaanesh")] },
        { label: "Disc of Tzeentch", cost: 25, addEquipment: [gear("Disc of Tzeentch")] },
        { label: "Daemonic Mount", cost: 50, addEquipment: [gear("Daemonic Mount")] },
        { label: "Juggernaut of Khorne", cost: 55, addEquipment: [gear("Juggernaut of Khorne")] },
        { label: "Palanquin of Nurgle", cost: 60, addEquipment: [gear("Palanquin of Nurgle")] },
        { label: "Manticore", cost: 100, addEquipment: [gear("Manticore")] },
        { label: "Chaos Dragon", cost: 125, addEquipment: [gear("Chaos Dragon")] }
      ]),
      section("Upgrade Wizard(1):", 'one', [
        // NOTE: this option's cost was not legible in the source transcription (one-page-fantasy-army-lists.md,
        // Warriors of Chaos section, line ~383 — printed with no visible "+Npts" before the column break).
        // Using +5pts to match the same single-step Wizard(1)->Wizard(2) upgrade cost in Empire/Orcs/Goblins;
        // needs verification against the original PDF.
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ], { requiresBaselineRule: ["Wizard(1)"] })
    ]),
    group("I", [
      section("Upgrade with:", 'any', [
        { label: "Medium Lances", cost: 10, addEquipment: [meleeWeapon('Medium', 'Lance', { key: 'medium-lance', label: "Medium Lances" })] }
      ])
    ]),
    group("J", [
      section("Upgrade with:", 'any', [
        { label: "Light Spears", cost: 10, addEquipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })] },
        { label: "Light Maces", cost: 25, addEquipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })] }
      ]),
      section("Upgrade all models with:", 'any', [
        { label: "Throwing Weapons", cost: 15, addEquipment: [customWeapon("Throwing Weapons", { range: null, attacks: '1', rules: rules('') })] }
      ])
    ]),
    group("K", [
      section("Upgrade with:", 'any', [
        { label: "Master Swords", cost: 10, addEquipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })] },
        { label: "Heavy Halberds", cost: 20, addEquipment: [meleeWeapon('Heavy', 'Halberd', { key: 'heavy-halberd', label: "Heavy Halberds" })] },
        { label: "Heavy Maces", cost: 45, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces" })] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("L", [
      section("Upgrade with:", 'any', [
        { label: "Master Swords", cost: 10, addEquipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })] },
        { label: "Heavy Maces", cost: 15, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces" })] }
      ])
    ]),
    group("M", [
      section("Upgrade with:", 'any', [
        { label: "Tzeentch (Resistance)", cost: 15, adds: ["Resistance"] },
        { label: "Khorne (Furious)", cost: 15, adds: ["Furious"] },
        { label: "Slaanesh (Fearless)", cost: 30, adds: ["Fearless"] },
        { label: "Nurgle (Regeneration)", cost: 30, adds: ["Regeneration"] }
      ])
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Flying", cost: 5, adds: ["Flying"] }
      ]),
      section("Upgrade with one:", 'one', [
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] },
        { label: "Wizard(2)", cost: 30, adds: ["Wizard(2)"] },
        { label: "Wizard(3)", cost: 40, adds: ["Wizard(3)"] }
      ])
    ]),
    group("N", [
      section("Upgrade with:", 'any', [
        { label: "Tzeentch (Resistance)", cost: 15, adds: ["Resistance"] },
        { label: "Khorne (Furious)", cost: 20, adds: ["Furious"] },
        { label: "Nurgle (Regeneration)", cost: 30, adds: ["Regeneration"] },
        { label: "Slaanesh (Fearless)", cost: 40, adds: ["Fearless"] }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Vanguard", cost: 10, adds: ["Vanguard"] },
        { label: "Poison", cost: 15, adds: ["Poison"] },
        { label: "Scaly Hides (Armored)", cost: 15, adds: ["Armored"] }
      ])
    ]),
    group("O", [
      section("Upgrade all models with:", 'any', [
        { label: "Wrathmongers (Impact(D3))", cost: 20, adds: ["Impact(D3)"] }
      ])
    ]),
    group("F", [
      section("Upgrade with any:", 'any', [
        { label: "Fiery Breath", cost: 10, adds: ["Fiery Breath"] },
        { label: "Regenerating Flesh (Regeneration)", cost: 10, adds: ["Regeneration"] },
        { label: "Venomous Ooze (Poison)", cost: 25, adds: ["Poison"] }
      ])
    ]),
    group("P", [
      section("Upgrade with any:", 'any', [
        { label: "Iron Hard Skin (Re-roll blocks)", cost: 20, adds: ["Iron Hard Skin"] },
        { label: "Venom Tail (Deadly)", cost: 25, adds: ["Deadly"] }
      ])
    ]),
    group("Q", [
      section("Replace all Heavy Swords:", 'one', [
        { label: "Master Swords", cost: 10, addEquipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], removeEquipment: ["Heavy Swords"] }
      ])
    ]),
    group("R", [
      section("Upgrade with:", 'any', [
        { label: "Extra Claws (+2A in Melee)", cost: 10, adds: ["+2A in Melee"] }
      ])
    ]),
    group("S", [
      section("Replace Master Sword:", 'one', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace" })], removeEquipment: ["Master Sword"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Bountiful Blades", "When fighting in melee this unit may choose to use medium swords or light maces."),
    armyRule("Fall Over", "When the giant is killed all units within 3” take D6p automatic hits."),
    armyRule("Giant Attack", "When fighting in melee this unit deals D6p automatic hits."),
    armyRule("Giver of Glory", "When this unit is activated select D3 friendly units within 12”. They may re-roll failed hits or blocks until the end of the round (pick one)."),
    armyRule("Gorebeast", "This unit’s Impact hits get Deadly."),
    armyRule("Maelstrom", "When this unit is activated target enemy unit within 18” takes D3p hits."),
    armyRule("Mutations", "Whenever this unit fights in melee roll one die. On a 1-3 the unit has the Piercing rule, on a 4-6 the unit has the Regeneration rule."),
    armyRule("Troll Vomit", "This model may replace all of its melee attacks for a single troll vomit attack. This attack hits automatically and has Piercing."),
    armyRule("Iron Hard Skin", "This unit may re-roll blocks."),
  ],
  psychicPowers: [
    power("Acquiescence", 6, "Target enemy unit within 24” gets the Unwieldy rule until the end of the round."),
    power("Pink Fire", 7, "Target enemy unit within 18” takes D6 automatic hits."),
    power("Corruption", 7, "Target enemy unit within 12” takes D6p automatic hits."),
    power("Lash", 9, "Target enemy unit within 24” takes D6p automatic hits."),
    power("Pestilence", 9, "Target enemy unit within 18” must re-roll hits until the end of the round."),
    power("Treason", 10, "Target enemy unit within 24” must re-roll morale tests until the end of the round."),
  ],
})

export default warriorsofchaos
