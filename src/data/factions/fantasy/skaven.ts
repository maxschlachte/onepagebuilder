import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Warlord", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Strength in Numbers, Tough(3)", upgrades: "A", cost: 30 },
    { name: "Chieftain", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Strength in Numbers, Tough(3)", upgrades: "A", cost: 20 },
    { name: "Warlock Engineer", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberd" })], special: "Hero, Strength in Numbers, Tough(3)", upgrades: "B", cost: 15 },
    { name: "Assassin", size: 1, quality: "3+", equipment: [weaponFantasy('throwing-weapon'), meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword", rules: rules('Poison') })], special: "Hero, Scout, Sneaky, Tough(3)", upgrades: "-", cost: 60 },
    { name: "Plague Priest", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Furious, Strength in Numbers, Tough(3), Wizard(1)", upgrades: "C", cost: 45 },
    { name: "Vermin Lord", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword", rules: rules('Piercing') })], special: "Armored, Fear, Impact(D6), Tough(6), Wizard(3)", upgrades: "-", cost: 170 },
    { name: "Giant Rats", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fast, Strength in Numbers", upgrades: "-", cost: 45 },
    { name: "Skavenslaves", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Cornered Rats, Strength in Numbers", upgrades: "D, F", cost: 45 },
    { name: "Clanrats", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Strength in Numbers", upgrades: "D, E, H", cost: 70 },
    { name: "Weapon Team", size: 1, quality: "5+", equipment: [customWeapon("Ratling Gun", { range: 18, attacks: "D6", rules: rules("Piercing") })], special: "Strength in Numbers", upgrades: "E", cost: 25 },
    { name: "Plague Monks", size: 10, quality: "5+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Furious, Strength in Numbers", upgrades: "D", cost: 100 },
    { name: "Stormvermin", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds" })], special: "Strength in Numbers", upgrades: "D, E", cost: 120 },
    { name: "Censer Bearers", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces", rules: rules('Noxious') })], special: "Furious, Strength in Numbers", upgrades: "-", cost: 150 },
    { name: "Globadiers", size: 5, quality: "5+", equipment: [weaponFantasy('throwing-weapon', { label: "Throwing Weapons", rules: rules('Poison') })], special: "Strength in Numbers", upgrades: "-", cost: 60 },
    { name: "Night Runners", size: 5, quality: "5+", equipment: [weaponFantasy('throwing-weapon', { label: "Throwing Weapons" }), meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Strength in Numbers, Vanguard", upgrades: "-", cost: 60 },
    { name: "Gutter Runners", size: 5, quality: "4+", equipment: [weaponFantasy('throwing-weapon', { label: "Throwing Weapons" }), meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Scout, Sneaky, Strength in Numbers", upgrades: "G", cost: 100 },
    { name: "Rat Swarms", size: 3, quality: "6+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws" })], special: "Tough(6)", upgrades: "-", cost: 50 },
    { name: "Rat Ogres", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fear, Furious, Impact(1), Packmaster, Tough(3)", upgrades: "-", cost: 105 },
    { name: "Stormfiends", size: 3, quality: "4+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Fear, Furious, Impact(1), Tough(3)", upgrades: "I", cost: 140 },
    { name: "Warplock Jezzails", size: 3, quality: "5+", equipment: [customWeapon("Jezzails", { range: 36, attacks: "1", rules: rules("Piercing, Sniper") })], special: "Armored", upgrades: "-", cost: 160 },
    { name: "Hell Pit Abomination", size: 1, quality: "4+", equipment: [customWeapon("Flailing Fists", { range: null, attacks: "3D6", rules: rules("Piercing") })], special: "Armored, Fear, Fearless, Impact(D6), Regeneration, Too Horrible to Die, Tough(6)", upgrades: "-", cost: 145 },
    { name: "Doomwheel", size: 1, quality: "5+", equipment: [customWeapon("Zzzzap!", { range: 18, attacks: "D6", rules: rules("Piercing") }), customWeapon("Crew", { range: null, attacks: "2D6", rules: rules("") })], special: "Armored, Fast, Fear, Impact(D6), Tough(6)", upgrades: "-", cost: 85 },
    { name: "Lightning Cannon", size: 1, quality: "5+", equipment: [weaponFantasy('cannon', { rules: rules('Poison') })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 100 },
    { name: "Plagueclaw Catapult", size: 1, quality: "5+", equipment: [customWeapon("Catapult", { range: 48, attacks: "9", rules: rules("Indirect, Poison") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 140 },
]

export const skaven = faction({
  id: "skaven",
  name: "Skaven",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })] }
      ]),
      section("Equip all models with:", 'any', [
        { label: "Throwing Weapons", cost: 10, addEquipment: [weaponFantasy('throwing-weapon', { label: "Throwing Weapons" })] }
      ])
    ]),
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })] },
        { label: "Heavy Halberd", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Halberd', { key: 'heavy-halberd', label: "Heavy Halberd" })] },
        { label: "Heavy Mace", cost: 10, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace" })] }
      ]),
      section("Equip with any:", 'any', [
        { label: "Tail Weapon", cost: 5, addEquipment: [customWeapon("Tail Weapon", { range: null, attacks: '1', rules: rules("+1 Melee attack") })] },
        { label: "Rat Hound", cost: 5, adds: ["+1 Melee attack"] },
        { label: "Unctuous Lotions", cost: 10, adds: ["Poison"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Great Pox Rat", cost: 15, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws", rules: rules('Poison') }),
            gear("Great Pox Rat", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "War-Litter", cost: 30, addEquipment: [
            meleeWeapon('Master', 'Sword', { key: 'war-litter-master-sword', label: "Master Sword" }),
            gear("War-Litter", { mount: true, rules: rules("Tough(3)") })
          ]
        },
        { label: "Ogre Bonebreaker", cost: 60, addEquipment: [
            meleeWeapon('Force', 'Claws', { key: 'force-claws', label: "Force Claws" }),
            gear("Ogre Bonebreaker", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "furious" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("G", [
      section("Equip all models with any:", 'any', [
        { label: "Smoke Bombs", cost: 10, adds: ["Smoke Bombs"] },
        { label: "Snare Nets", cost: 15, adds: ["Snare Nets"] },
        { label: "Venomous Blades", cost: 30, adds: ["Poison"] }
      ])
    ]),
    group("H", [
      section("Upgrade with:", 'any', [
        { label: "Light Spears", cost: 10, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Medium Halberd", cost: 5, addEquipment: [meleeWeapon('Medium', 'Halberd', { key: 'medium-halberd', label: "Medium Halberd" })] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Pistol", cost: 5, addEquipment: [weaponFantasy('pistol')] },
        { label: "Rifle", cost: 10, addEquipment: [weaponFantasy('rifle')] }
      ]),
      section("Upgrade with one:", 'one', [
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] },
        { label: "Wizard(2)", cost: 35, adds: ["Wizard(2)"] }
      ])
    ]),
    group("I", [
      section("Upgrade with:", 'any', [
        { label: "Flayer Gauntlets", cost: 5, adds: ["Impact(+D3)"] },
        { label: "Shock Gauntlets", cost: 5, adds: ["Piercing in Melee"] },
        { label: "Grinderfists", cost: 15, addEquipment: [customWeapon("Grinderfists", { range: null, attacks: '1', rules: rules("Grinder") })] },
        { label: "Warpfire Projectors", cost: 20, adds: ["Fire Thrower"] },
        { label: "Windlaunchers", cost: 45, addEquipment: [customWeapon("Windlaunchers", { range: 24, attacks: "3", rules: rules("Piercing, Indirect, Poison") })] },
        { label: "Ratling Cannons", cost: 70, addEquipment: [customWeapon("Ratling Cannons", { range: 18, attacks: "3D6", rules: rules("Piercing") })] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })] },
        { label: "Heavy Halberd", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Halberd', { key: 'heavy-halberd', label: "Heavy Halberd" })] },
        { label: "Heavy Mace", cost: 20, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Noxious') })] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Great Pox Rat", cost: 15, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws", rules: rules('Poison') }),
            gear("Great Pox Rat", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Screaming Bell", cost: 125, addEquipment: [
            gear("Bell", { rules: rules("Bell") }),
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws" }),
            gear("Screaming Bell", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "impact", param: "D6" }, { ruleId: "resistance" }, { ruleId: "tough", param: 6 }] })
          ]
        },
        { label: "Plague Furnace", cost: 185, addEquipment: [
            customWeapon("Fumes", { range: 12, attacks: "6", rules: rules("Poison") }),
            gear("Noxious Wrecker", { rules: rules("Noxious Wrecker") }),
            gear("Plague Furnace", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        }
      ])
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ], { oncePerUnit: true })
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Weapons Team", cost: 25, adds: ["Ratling Gun"] }
      ]),
      section("Replace Ratling Gun:", 'any', [
        { label: "Poisoned Wind Mortar", cost: 10, addEquipment: [customWeapon("Poisoned Wind Mortar", { range: 24, attacks: "3", rules: rules("Indirect, Poison") })], removeEquipment: ["Ratling Gun"] },
        { label: "Warpfire Thrower", cost: 10, addEquipment: [customWeapon("Warpfire Thrower", { range: 18, attacks: "6", rules: rules("Piercing") })], removeEquipment: ["Ratling Gun"] },
        { label: "Warp Grinder", cost: 30, adds: ["Grinder"], removeEquipment: ["Ratling Gun"] },
        { label: "Doom Flayer", cost: 45, adds: ["Doom Flayer"], removeEquipment: ["Ratling Gun"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Bell", "Whenever this unit is activated, you may roll one die on this table: 1 Nothing happens. 2 This unit must move D6”. 3 All friendly units within 24” get Fearless until the end of the round. 4 All enemy units within 24” take D3 automatic hits. 5 All friendly models within 24” get +1 attack until the end of the round. 6 All enemy units within 4D6” take as many hits as models they have."),
    armyRule("Cornered Rats", "If this unit loses in Melee, then this unit is removed as a casualty and all units within D6” take D3+4 automatic hits."),
    armyRule("Doom Flayer", "This weapon deals 6p automatic hits in Melee and the equipped model gets the Armored and Impact(D3) special rules."),
    armyRule("Grinder", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit anywhere over 6” away from enemy units. Then roll one die, on a 1-2 the opponent may move the unit by up to 12” (must be in a valid position). On the last round the unit arrives automatically."),
    armyRule("Noxious", "This unit deal D3 wounds from Poison instead of just 1 wound."),
    armyRule("Noxious Wrecker", "This unit deals 3D6 automatic hits in Melee with the Poison special rule."),
    armyRule("Packmaster", "Place a packmaster model next to this unit as long as it is alive. This unit has the Fearless special rule, however if it ever fails a morale test remove the packmaster model and the unit loses the Fearless special rule."),
    armyRule("Sneaky", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit on the table touching any table edge over 6” away from enemy units. If the unit has not arrived by the last round it arrives automatically."),
    armyRule("Strength in Numbers", "As long as this unit is within 6” of a friendly unit when taking morale tests it rolls one extra die and picks the highest result."),
    armyRule("Too Horrible to Die", "Whenever this model would be killed roll one die, on a 6+ it is not killed and immediately restores D6 wounds instead."),
    armyRule("Smoke Bombs", "The unit always counts as in Cover."),
    armyRule("Snare Nets", "Enemies get Unwieldy in Melee against this unit."),
  ],
  psychicPowers: [
    power("Skitterleap", 6, "Target friendly model within 12” may be placed anywhere on the table."),
    power("Pestilent Breath", 7, "Target enemy unit within 12” takes D6 automatic hits with Poison."),
    power("Warp Lightning", 7, "Target enemy unit within 24” takes D6 automatic hits."),
    power("Bless with Filth", 7, "Target friendly unit within 12” gets Poison melee until the end of the round."),
    power("Wither", 7, "Target enemy unit within 12” must re-roll blocks until the end of the round."),
    power("Death Frenzy", 10, "Target friendly unit within 18” gets +2A in Melee until the end of the round."),
  ],
})

export default skaven
