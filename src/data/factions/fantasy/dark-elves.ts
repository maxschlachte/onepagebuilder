import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Dreadlord", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Hatred, Hero, Tough(3)", upgrades: "A", cost: 35 },
    { name: "Sorceress", size: 1, quality: "4+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Blessing, Hatred, Tough(3), Wizard(1)", upgrades: "B", cost: 50 },
    { name: "Shadowblade", size: 1, quality: "3+", equipment: [weaponFantasy('throwing-weapon', { rules: rules('Poison') }), meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword", rules: rules('Piercing, Deadly') })], special: "Hatred, Hero, Hidden, Tough(3)", upgrades: "-", cost: 110 },
    { name: "Bleakswords", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Hatred", upgrades: "C, F", cost: 100 },
    { name: "Harpies", size: 10, quality: "4+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Flying", upgrades: "-", cost: 150 },
    { name: "Corsairs", size: 10, quality: "4+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Armored, Hatred", upgrades: "C, I", cost: 170 },
    { name: "Sisters of Slaughter", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Dance of Death, Hatred", upgrades: "C", cost: 195 },
    { name: "Witch Elves", size: 10, quality: "4+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords", rules: rules('Poison') })], special: "Furious, Hatred", upgrades: "C", cost: 215 },
    { name: "Executioners", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces", rules: rules('Deadly') })], special: "Hatred", upgrades: "C", cost: 245 },
    { name: "Black Guard", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Halberd', { key: 'medium-halberd', label: "Medium Halberds", rules: rules('Piercing') })], special: "Fearless, Hatred", upgrades: "C", cost: 270 },
    { name: "Darkshards", size: 5, quality: "4+", equipment: [customWeapon("Rapid Crossbows", { range: 30, attacks: "1", rules: rules("Piercing, Rapid") })], special: "Hatred", upgrades: "C, G", cost: 145 },
    // Source prints "H  Replace all Light Swords: Medium Swords +5pts, Light Maces +30pts" for this
    // unit's upgrade letter, but Shades' only equipment is Rapid Crossbows — no Light Swords at all.
    // Likely column-bleed from a neighboring unit's upgrade text in the PDF extraction; omitted
    // (group H dropped) as unreachable/misattributed rather than guessed at.
    { name: "Shades", size: 5, quality: "3+", equipment: [customWeapon("Rapid Crossbows", { range: 30, attacks: "1", rules: rules("Piercing, Rapid") })], special: "Hatred, Scout", upgrades: "C", cost: 200 },
    { name: "Dark Riders", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], special: "Fast, Hatred, Nimble", upgrades: "C, J", cost: 85 },
    { name: "Cold One Knights", size: 5, quality: "3+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances", rules: rules('Impact(1)') }), meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fast, Fear, Hatred, Nimble", upgrades: "C", cost: 155 },
    { name: "Doomfire Warlocks", size: 5, quality: "3+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords", rules: rules('Poison') })], special: "Armored, Cursed, Fast, Hatred, Nimble", upgrades: "-", cost: 200 },
    { name: "War Hydra", size: 1, quality: "3+", equipment: [gear("Hydra Heads", { rules: rules("Hydra Heads") })], special: "Armored, Fear, Impact(D6), Regeneration, Tough(6)", upgrades: "D", cost: 125 },
    { name: "Kharibdyss", size: 1, quality: "3+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Poison') })], special: "Armored, Fear, Feast of Bones, Impact(D6), Tough(6)", upgrades: "-", cost: 165 },
    { name: "Bloodwrack Medusa", size: 1, quality: "3+", equipment: [customWeapon("Stare", { range: 12, attacks: "4", rules: rules("Deadly") }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fear, Furious, Deadly Gaze, Hatred, Impact(1), Tough(3)", upgrades: "-", cost: 165 },
    { name: "Cold One Chariot", size: 1, quality: "3+", equipment: [customWeapon("Rapid Crossbow", { range: 30, attacks: "1", rules: rules("Piercing, Rapid") }, { count: 2 }), meleeWeapon('Medium', 'Spear', { key: 'medium-spear', label: "Medium Spear" }), meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Fast, Fear, Hatred, Impact(D6), Tough(3)", upgrades: "-", cost: 130 },
    { name: "Scourgerunner Chariot", size: 1, quality: "4+", equipment: [customWeapon("Harpoon", { range: 24, attacks: "3", rules: rules("Piercing, Single Target, Barbed") }), customWeapon("Rapid Crossbow", { range: 30, attacks: "1", rules: rules("Piercing, Rapid") }, { count: 2 }), meleeWeapon('Medium', 'Spear', { key: 'medium-spear', label: "Medium Spear" }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Hatred, Impact(D6), Tough(3)", upgrades: "-", cost: 145 },
    { name: "Bloodwrack Shrine", size: 1, quality: "3+", equipment: [customWeapon("Stare", { range: 12, attacks: "4", rules: rules("Deadly") }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" }), meleeWeapon('Medium', 'Spear', { key: 'medium-spear', label: "Medium Spear" })], special: "Agony, Armored, Deadly Gaze, Fear, Hatred, Impact(D6), Tough(6)", upgrades: "-", cost: 320 },
    { name: "Reaper Bolt Thrower", size: 1, quality: "4+", equipment: [customWeapon("Rapid Bolt Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Single Target, Rapid") })], special: "Armored, Hatred, Ordnance, Tough(3)", upgrades: "-", cost: 105 },
]

export const darkelves = faction({
  id: "dark-elves",
  name: "Dark Elves",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Master Halberd", cost: 5, addEquipment: [meleeWeapon('Master', 'Halberd', { key: 'master-halberd', label: "Master Halberd", rules: rules('Piercing') })], removeEquipment: ["Master Sword"] },
        { label: "Master Lance", cost: 5, requiresOneOfSelected: ["Cold One", "Dark Steed", "Dark Pegasus", "Manticore", "Black Dragon", "Cauldron of Blood"], addEquipment: [meleeWeapon('Master', 'Lance', { key: 'master-lance', label: "Master Lance", rules: rules('Impact(1)') })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Sea Dragon Cloak", cost: 10, adds: ["Armored"] },
        { label: "Rapid Pistol", cost: 10, addEquipment: [customWeapon("Rapid Pistol", { range: 12, attacks: '1', rules: rules("Piercing, Rapid") })] },
        { label: "Rapid Crossbow", cost: 20, addEquipment: [customWeapon("Rapid Crossbow", { range: 30, attacks: '1', rules: rules("Piercing, Rapid") })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Cold One", cost: 15, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Cold One", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "fear" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Dark Steed", cost: 10, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Dark Steed", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Dark Pegasus", cost: 35, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Dark Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "nimble" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Manticore", cost: 105, addEquipment: [
            meleeWeapon('Master', 'Claws', { key: 'master-claws', label: "Master Claws", rules: rules('Deadly') }),
            gear("Manticore", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Black Dragon", cost: 120, addEquipment: [
            gear("Fiery Breath", { rules: rules("Fiery Breath") }),
            meleeWeapon('Force', 'Claws', { key: 'force-claws', label: "Force Claws", rules: rules('Piercing') }),
            gear("Black Dragon", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        },
        { label: "Cauldron of Blood", cost: 210, addEquipment: [
            meleeWeapon('Master', 'Sword', { key: 'cauldron-master-sword', label: "Master Sword", rules: rules('Poison') }),
            gear("Cauldron of Blood", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "fear" }, { ruleId: "fury" }, { ruleId: "impact", param: "D6" }, { ruleId: "resistance" }, { ruleId: "strength" }, { ruleId: "tough", param: 6 }] })
          ]
        }
      ])
    ]),
    group("G", [
      section("Equip all models with:", 'any', [
        { label: "Shields", cost: 15, adds: ["Armored"] }
      ])
    ]),
    group("I", [
      section("Replace all Medium Swords:", 'any', [
        { label: "Rapid Pistols and Light Swords", cost: 20, addEquipment: [customWeapon("Rapid Pistols and Light Swords", { range: null, attacks: '1', rules: rules('') })], removeEquipment: ["Medium Swords"] }
      ])
    ]),
    group("J", [
      section("Equip all models with:", 'any', [
        { label: "Rapid Crossbows", cost: 95, addEquipment: [customWeapon("Rapid Crossbows", { range: 30, attacks: '1', rules: rules("Piercing, Rapid") })] }
      ])
    ]),
    group("B", [
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 10, adds: ["Wizard(2)"] }
      ], { prerequisite: { requiresBaselineRule: ["Wizard(1)"] } }),
      section("Mount on:", 'any', [
        { label: "Cold One", cost: 15, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Cold One", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "fear" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Dark Steed", cost: 10, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Dark Steed", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Dark Pegasus", cost: 35, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Dark Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "nimble" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
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
      section("Upgrade with any:", 'any', [
        { label: "Fiery Breath", cost: 10, adds: ["Fiery Breath"] },
        { label: "Spit Fire", cost: 20, addEquipment: [customWeapon("Spit Fire", { range: 12, attacks: "6", rules: rules("") })] }
      ])
    ]),
    group("E", [
      section("Upgrade with any:", 'any', [
        { label: "Blind Rage", cost: 25, adds: ["+D3 Melee attacks"] },
        { label: "Iron Hard Skin", cost: 25, adds: ["Tough(+3)"] }
      ])
    ]),
    group("F", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 20, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Agony", "Friendly units within 6” may re-roll failed morale tests, and enemy units within 6” must re-roll successful morale tests."),
    armyRule("Barbed", "If this weapon deals one or more wounds to a model roll a die, on 4+ it takes another wound."),
    armyRule("Blessing", "The wizard may re-roll one die when casting spells."),
    armyRule("Cursed", "This unit counts as having the Wizard(2) special rule, however only one model may cast spells with it per round."),
    armyRule("Dance of Death", "This unit counts as having the Armored rule in Melee."),
    armyRule("Deadly Gaze", "Whenever this unit fights in Melee it deals D6p automatic hits with Deadly."),
    armyRule("Feast of Bones", "Enemy units in contact with this model must re-roll successful morale tests, and if this model is fighting melee against a single model and all of its attacks hit, then the enemy model takes an additional D6p automatic hits."),
    armyRule("Fury", "When this unit is activated select one friendly unit within 12”. All models in that unit get +1A in Melee until the end of the round."),
    armyRule("Hatred", "This model may re-roll any failed hits, and if it has Rapid it may re-roll twice."),
    armyRule("Hidden", "You may choose not to deploy this model at the start of the game, and instead declare that it is hidden within a friendly unit. At the beginning of any round you may select a friendly multi-model unit and place this model within 3” of it. If this model is not revealed by the end of the game it counts as a casualty."),
    armyRule("Hydra Heads", "This unit has 9-X melee attacks, where X is the amount of wound markers on it."),
    armyRule("Strength", "Friendly units within 6” get the Piercing special rule as long as this unit is alive."),
  ],
  psychicPowers: [
    power("Power of Darkness", 8, "The wizard and his unit get Rapid in Melee until the end of the round."),
    power("Doombolt", 9, "Target enemy unit within 18” takes 2D6 automatic hits."),
    power("Shroud of Despair", 10, "All enemy units within 12” must re-roll successful morale tests until the end of the round."),
    power("Bladewind", 10, "Target enemy unit within 24” must take as many Quality tests as models, and it takes one automatic hit for each failed test."),
    power("Chillwind", 10, "Target enemy unit within 24” takes D6 hits and must re-roll successful shooting attacks until the end of the round."),
    power("Word of Pain", 13, "Target enemy unit within 24” must re-roll successful shooting and melee attacks until the end of the round."),
  ],
})

export default darkelves
