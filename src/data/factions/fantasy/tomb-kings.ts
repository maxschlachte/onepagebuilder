import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Tomb Prince", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Curse, Hero, Tough(3), Undead", upgrades: "A", cost: 35 },
    { name: "Necrotect", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Stone Shaper, Tough(3), Undead, Wrath", upgrades: "-", cost: 75 },
    { name: "Liche Priest", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Tough(3), Undead, Wizard(1)", upgrades: "B", cost: 40 },
    { name: "Skeleton Warriors", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Undead", upgrades: "C, H", cost: 40 },
    { name: "Tomb Guard", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Undead", upgrades: "C, I", cost: 80 },
    { name: "Skeleton Archers", size: 5, quality: "6+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })], special: "Asaph’s Arrows, Undead", upgrades: "C", cost: 35 },
    { name: "Skeleton Horsemen", size: 5, quality: "5+", equipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], special: "Fast, Nimble, Undead, Vanguard", upgrades: "C", cost: 65 },
    { name: "Horse Archers", size: 5, quality: "5+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") })], special: "Asaph’s Arrows, Fast, Nimble, Scout, Undead", upgrades: "C", cost: 90 },
    { name: "Tomb Swarms", size: 3, quality: "6+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Poison') })], special: "Entombed, Tough(6), Undead", upgrades: "-", cost: 100 },
    { name: "Carrions", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fast, Flying, Nimble, Tough(3), Undead", upgrades: "-", cost: 115 },
    { name: "Ushabti", size: 3, quality: "3+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })], special: "Impact(1), Tough(3), Undead", upgrades: "C, K", cost: 130 },
    { name: "Sepulchral Stalkers", size: 3, quality: "4+", equipment: [meleeWeapon('Medium', 'Halberd', { key: 'medium-halberd', label: "Medium Halberds", rules: rules('Piercing') })], special: "Entombed, Gaze, Impact(1), Nimble, Tough(3), Undead", upgrades: "-", cost: 165 },
    { name: "Necropolis Knights", size: 3, quality: "3+", equipment: [meleeWeapon('Medium', 'Spears', { key: 'medium-spear', label: "Medium Spears", rules: rules('Deadly') }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws", rules: rules('Poison') })], special: "Armored, Impact(1), Nimble, Tough(3), Undead", upgrades: "C, J", cost: 275 },
    { name: "Tomb Scorpion", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws", rules: rules('Deadly') })], special: "Armored, Entombed, Impact(1), Resistance, Tough(3), Undead", upgrades: "-", cost: 100 },
    { name: "Necrolith Colossus", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword", rules: rules('Piercing') })], special: "Armored, Impact(D6), Tough(6), Undead, Unstoppable", upgrades: "E", cost: 90 },
    // Printed profile "(24”, AD6*2)" — the "*2" notation isn't defined anywhere in the source docs
    // (only "p"/"x" suffixes are); modeled as a plain D6-attack weapon with no inferred extra rule.
    { name: "Hierotitan", size: 1, quality: "4+", equipment: [customWeapon("Icon of Ptra", { range: 24, attacks: "D6", rules: rules("") }), meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword", rules: rules('Piercing') })], special: "Armored, Impact(D6), Spirit Conduit, Tough(6), Undead", upgrades: "-", cost: 140 },
    { name: "Warsphinx", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Spear', { key: 'master-spear', label: "Master Spear", rules: rules('Deadly') }), meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Impact(D6), Thundercrush, Tough(6), Undead", upgrades: "D", cost: 150 },
    { name: "Necrosphinx", size: 1, quality: "3+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Deadly') })], special: "Armored, Flying, Impact(D6), Tough(6), Undead", upgrades: "F", cost: 150 },
    { name: "Skeleton Chariots", size: 3, quality: "5+", equipment: [customWeapon("Bows", { range: 24, attacks: "1", rules: rules("") }, { count: 2 }), meleeWeapon('Master', 'Spears', { key: 'master-spear', label: "Master Spears" }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Asaph’s Arrows, Fast, Impact(D6), Tough(3)", upgrades: "C", cost: 170 },
    { name: "Skull Catapult", size: 1, quality: "5+", equipment: [customWeapon("Stone Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Indirect") })], special: "Armored, Ordnance, Screaming Skulls, Tough(3), Undead", upgrades: "G", cost: 85 },
    { name: "Casket of Souls", size: 1, quality: "4+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" }), meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison, Deadly') })], special: "Armored, Covenant, Light of Death, Ordnance, Tough(6), Unleashed, Undead", upgrades: "-", cost: 285 },
]

export const tombkings = faction({
  id: "tomb-kings",
  name: "Tomb Kings",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Heavy Sword:", 'any', [
        { label: "Heavy Spear", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Spear', { key: 'heavy-spear', label: "Heavy Spear" })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] }
      ]),
      section("Upgrade with:", 'any', [
        { label: "Prince’s Will", cost: 120, adds: ["Prince’s Will"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Skeletal Steed", cost: 10, addEquipment: [gear("Skeletal Steed")] },
        { label: "Skeleton Chariot", cost: 55, addEquipment: [gear("Skeleton Chariot")] },
        { label: "Warsphinx", cost: 85, addEquipment: [gear("Warsphinx")] }
      ])
    ]),
    group("B", [
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 10, adds: ["Wizard(2)"] },
        { label: "Wizard(3)", cost: 20, adds: ["Wizard(3)"] }
      ], { requiresBaselineRule: ["Wizard(1)"] }),
      section("Mount on:", 'any', [
        { label: "Skeletal Steed", cost: 5, addEquipment: [gear("Skeletal Steed")] }
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
      section("Upgrade with any:", 'any', [
        { label: "Fiery Breath", cost: 10, adds: ["Fiery Breath"] },
        { label: "Claw attacks get Poison", cost: 10, adds: ["Poison"] }
      ])
    ]),
    group("E", [
      section("Replace Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Force Mace", cost: 20, addEquipment: [meleeWeapon('Force', 'Mace', { key: 'force-mace', label: "Force Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Bolt Thrower (Asaph’s Arrows)", cost: 55, addEquipment: [customWeapon("Bolt Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Single Target, Asaph’s Arrows") })] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Envenomed Sting (Poison Melee)", cost: 10, adds: ["Poison"] }
      ])
    ]),
    group("G", [
      section("Upgrade with:", 'any', [
        { label: "Skulls of the Foe", cost: 10, adds: ["Skulls of the Foe"] }
      ])
    ]),
    group("H", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("I", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Halberds", cost: 15, addEquipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds", rules: rules('Piercing') })], removeEquipment: ["Light Swords"] }
      ]),
      section("Upgrade with:", 'any', [
        { label: "Cursed Blades (Deadly)", cost: 90, adds: ["Deadly"] }
      ])
    ]),
    group("J", [
      section("Upgrade all models with:", 'any', [
        { label: "Entombed", cost: 10, adds: ["Entombed"] }
      ])
    ]),
    group("K", [
      section("Replace all Heavy Swords:", 'one', [
        { label: "Master Swords", cost: 10, addEquipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], removeEquipment: ["Heavy Swords"] },
        { label: "Heavy Maces", cost: 45, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces", rules: rules('Piercing, Poison') })], removeEquipment: ["Heavy Swords"] }
      ]),
      section("Equip all models with:", 'any', [
        { label: "Great Bows", cost: 55, addEquipment: [customWeapon("Great Bows", { range: 30, attacks: '1', rules: rules("Piercing, Asaph’s Arrows") })] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Asaph’s Arrows", "This unit ignores all shooting modifiers (Cover, Spells, etc.)."),
    armyRule("Covenant", "As long as this unit is alive you get +D3 power dice each round."),
    armyRule("Curse", "If this unit is killed, then the enemy that killed it immediately takes D6 automatic hits."),
    armyRule("Entombed", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit anywhere over 6” away from enemy units. Then roll one die, on a 1-2 the opponent may move the unit by up to 12” (must be in a valid position). On the last round the unit arrives automatically."),
    armyRule("Gaze", "When this model is activated target enemy unit within 6” takes 6 automatic hits."),
    armyRule("Light of Death", "Once per round, when this unit is activated, you may target one enemy unit within 48”. That unit must take a morale test, and if failed it immediately takes D3 automatic wounds. Then you may roll one die, and on a 4+ you may target another enemy unit within 6” of the target that was not already targeted. This continues until the roll is failed or there are no more viable targets."),
    armyRule("Prince’s Will", "This hero may be deployed as part of friendly Infantry unit of Quality 6+ or Quality 5+, and that unit counts as having Quality 4+ as long as the hero is alive."),
    armyRule("Screaming Skulls", "Whenever this unit causes hits from shooting attacks its target must take a morale test regardless of casualties."),
    armyRule("Skulls of the Foe", "Enemy units must re-roll successful morale test caused by this unit’s Screaming Skulls special rule."),
    armyRule("Spirit Conduit", "All friendly wizards within 12” get +D3 to their casting results."),
    armyRule("Stone Shaper", "All friendly units within 12” may ignore wounds on a 6+."),
    armyRule("Thundercrush", "This model may replace all of its claw attacks for a single thundercrush attack. This attack deals D3p automatic hits."),
    armyRule("Undead", "This unit has the Fear special rule. Whenever this unit loses melee it does not take a morale test, but instead takes as many wounds as the difference it lost melee by."),
    armyRule("Unleashed", "If this unit is killed roll one die for every unit within 12”. On a 4+ it takes D6p hits."),
    armyRule("Unstoppable", "Whenever this unit causes one or more wounds it may immediately strike as many extra attacks as wounds it caused. This rule also applies to the newly generated attacks."),
    armyRule("Wrath", "The hero and his unit count as having the Furious special rule."),
  ],
  psychicPowers: [
    power("Neru’s Protection", 7, "Target friendly unit within 12” gets Armored until the end of the round."),
    power("Ptra’s Smiting", 7, "All models in target unit within 12” get +1A in Melee until the end of the round."),
    power("Usirian’s Vengeance", 9, "Target enemy unit within 18” must take a Dangerous terrain test."),
    power("Sakhmet’s Skullstorm", 10, "Target enemy unit anywhere on the table takes D6 automatic hits."),
    power("Usekhp’s Desiccation", 10, "Target enemy unit within 12” must re-roll successful hits and blocks until the end of the round."),
    power("Djaf’s Blades", 13, "Target friendly unit within 12” gets Deadly in Melee until the end of the round."),
  ],
})

export default tombkings
