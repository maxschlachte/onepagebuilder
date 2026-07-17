import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Night Goblin Boss", size: 1, quality: "6+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Deranged, Hero, Tough(3)", upgrades: "A", cost: 15 },
    { name: "Goblin Boss", size: 1, quality: "6+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Tough(3)", upgrades: "A", cost: 10 },
    { name: "Night Goblin Shaman", size: 1, quality: "6+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Deranged, Tough(3), Wizard(1)", upgrades: "B", cost: 40 },
    { name: "Goblin Shaman", size: 1, quality: "6+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Tough(3), Wizard(1)", upgrades: "B", cost: 35 },
    { name: "Goblins", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "-", upgrades: "C, G", cost: 30 },
    { name: "Night Goblins", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Deranged", upgrades: "C, D", cost: 35 },
    { name: "Snotlings", size: 3, quality: "6+", equipment: [meleeWeapon('Force', 'Swords', { key: 'force-sword', label: "Force Swords" }), gear("Explodin’ Spores", { rules: rules("Explodin’ Spores") })], special: "Tough(6)", upgrades: "-", cost: 80 },
    { name: "Squig Herd", size: 10, quality: "5+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Deranged, Fearless, Wild", upgrades: "-", cost: 110 },
    { name: "Goblin Archers", size: 5, quality: "6+", equipment: [weaponFantasy('shortbow', { label: "Shortbows" })], special: "-", upgrades: "C, G, H", cost: 25 },
    { name: "Night Goblin Archers", size: 5, quality: "6+", equipment: [weaponFantasy('shortbow', { label: "Shortbows" })], special: "Deranged", upgrades: "C, D", cost: 30 },
    { name: "Wolf Riders", size: 5, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fast, Nimble", upgrades: "C, H, I", cost: 25 },
    { name: "Squig Hoppers", size: 5, quality: "6+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Boingy, Deranged, Fearless, Nimble", upgrades: "-", cost: 40 },
    { name: "Spider Riders", size: 5, quality: "6+", equipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears", rules: rules('Poison') })], special: "Fast, Nimble, Strider", upgrades: "C, I", cost: 45 },
    { name: "Mangler Squigs", size: 1, quality: "5+", equipment: [gear("Out of Control", { rules: rules("Out of Control") })], special: "Fearless, Tough(3)", upgrades: "-", cost: 110 },
    { name: "Arachnarok Spider", size: 1, quality: "4+", equipment: [customWeapon("Fangs", { range: null, attacks: "8", rules: rules("Poison") }), gear("Venom Surge", { rules: rules("Venom Surge") }), meleeWeapon('Master', 'Spear', { key: 'master-spear', label: "Master Spear" }), weaponFantasy('shortbow', { label: "Shortbows" })], special: "Armored, Fear, Fearless, Impact(D6), Strider, Tough(9)", upgrades: "E", cost: 185 },
    { name: "Pump Wagon", size: 1, quality: "6+", equipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" }), gear("Explodin’ Spores", { rules: rules("Explodin’ Spores") })], special: "Armored, Impact(2D6), Pump, Tough(3)", upgrades: "F", cost: 55 },
    { name: "Wolf Chariots", size: 3, quality: "6+", equipment: [weaponFantasy('shortbow', { count: 3 }), meleeWeapon('Force', 'Spear', { key: 'force-spear', label: "Force Spears" })], special: "Armored, Fast, Impact(D6), Tough(3)", upgrades: "-", cost: 120 },
    { name: "Spear Chukka", size: 1, quality: "5+", equipment: [weaponFantasy('bolt-thrower')], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 55 },
    { name: "Rock Lobber", size: 1, quality: "5+", equipment: [weaponFantasy('stone-thrower', { rules: rules('Indirect') })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 70 },
    { name: "Doom Diver Catapult", size: 1, quality: "5+", equipment: [customWeapon("Doom Diver", { range: 48, attacks: "D6", rules: rules("Piercing, Indirect") })], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 75 },
]

export const goblins = faction({
  id: "goblins",
  name: "Goblins",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Heavy Sword:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Spear", cost: 5, requiresOneOfSelected: ["Giant Wolf", "Giant Spider", "Great Cave Squig", "Gigantic Spider", "Wolf Chariot"], addEquipment: [meleeWeapon('Heavy', 'Spear', { key: 'heavy-spear', label: "Heavy Spear" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Mace", cost: 10, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace" })], removeEquipment: ["heavy-sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Shortbow", cost: 5, addEquipment: [weaponFantasy('shortbow')] }
      ]),
      section("Mount on:", 'any', [
        { label: "Giant Wolf", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Giant Wolf", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Giant Spider", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws", rules: rules('Poison') }),
            gear("Giant Spider", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }, { ruleId: "strider" }] })
          ]
        },
        { label: "Great Cave Squig", cost: 15, addEquipment: [
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws" }),
            gear("Great Cave Squig", { mount: true, rules: [{ ruleId: "boingy" }, { ruleId: "fearless" }, { ruleId: "impact", param: 1 }, { ruleId: "nimble" }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Gigantic Spider", cost: 25, addEquipment: [
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws", rules: rules('Poison') }),
            gear("Gigantic Spider", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "fear" }, { ruleId: "impact", param: 1 }, { ruleId: "nimble" }, { ruleId: "strider" }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Wolf Chariot", cost: 40, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Wolf Chariot", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Giant Wolf", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Giant Wolf", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Wolf Chariot", cost: 40, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Wolf Chariot", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
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
      section("Take up to three:", 'any', [
        { label: "Fanatic", cost: 5, adds: ["Fanatic"] }
      ]),
      section("Equip all models with any:", 'any', [
        { label: "Nets", cost: 15, adds: ["Nets"] }
      ]),
      section("Replace all Light Swords:", 'any', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("E", [
      section("Equip with:", 'any', [
        { label: "Stone Thrower", cost: 85, addEquipment: [weaponFantasy('stone-thrower', { rules: rules('Indirect, Sticky') })] }
      ])
    ]),
    group("F", [
      section("Upgrade with any:", 'any', [
        { label: "Out-Rigga", cost: 5, addEquipment: [gear("Out-Rigga")] },
        { label: "Flappas", cost: 5, adds: ["Strider"] },
        // Source prints a clarifying note on the following line: "(Impact(+D6) once per game)".
        { label: "Giant Explodin’ Spores", cost: 5, adds: ["Impact(+D6)"] },
        { label: "Spiky Roller", cost: 10, adds: ["Piercing"] }
      ])
    ]),
    group("G", [
      section("Take up to three:", 'any', [
        { label: "Nasty Skulkers", cost: 5, adds: ["Nasty Skulkers"] }
      ])
    ]),
    group("H", [
      section("Replace all Light Swords:", 'any', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("I", [
      section("Equip all models with:", 'any', [
        { label: "Shortbows", cost: 10, addEquipment: [weaponFantasy('shortbow', { label: "Shortbows" })] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Boingy", "This unit always moves 3D6”, and if you roll an 18 for its movement the unit counts as having Impact(1) until the end of the round."),
    armyRule("Deranged", "This unit may re-roll failed hits in Melee when using Charge actions."),
    armyRule("Explodin’ Spores", "This model may throw a spore at one enemy unit within 12” during the shooting phase, which deals one automatic hit with Piercing."),
    armyRule("Fanatic", "Place a goblin fanatic model next to this unit as long as it is alive. Once per game you may remove the goblin fanatic model and deal D6p automatic hits to one enemy unit within 6”."),
    armyRule("Nasty Skulkers", "Place a nasty skulker model next to this unit as long as it is alive. Once per game you may remove the nasty skulker model and deal one automatic hit with the Deadly special rule to one enemy unit in base contact."),
    armyRule("Nets", "Enemy units must re-roll successful melee attacks against this unit."),
    armyRule("Out of Control", "This unit may only use Advance actions and moves 3D6”. The unit may pass through enemy units, and deals 2D6p automatic hits when doing so. Enemy units may not Charge this unit, but instead may move through it, taking 3D6p hits and removing it as a casualty."),
    armyRule("Pump", "This unit always moves 2D6”. You may add +D6” to this movement, however if you roll a 1, then it takes D3 automatic wounds."),
    armyRule("Sticky", "If a unit is hit by this weapon it gets the Unwieldy rule until the end of the next round."),
    armyRule("Venom Surge", "Whenever this unit fights in Melee nominate one of its attacks to be a venom surge attack. That attack has the Deadly special rule."),
    armyRule("Wild", "If this unit fails a morale test all units within 2D6” take D6 automatic hits and this unit is removed as a casualty."),
  ],
  psychicPowers: [
    power("Night Shroud", 7, "The wizard and his unit count as being in Cover until the end of the round."),
    power("Sneaky Stabbin’", 7, "Target friendly unit within 12” gets Piercing melee until the end of the round."),
    power("Spider-God’s Gift", 7, "Target friendly unit within 12” gets Poison attacks until the end of the round."),
    power("Itchy Nuisance", 8, "Target enemy unit within 24” reduces all movement by D6” (to a minimum of 1) until the end of the round."),
    power("Gork’ll Fix It", 9, "Target enemy unit within 24” must re-roll all successful hits and blocks of 6 until the end of the round."),
    power("Vindicative Glare", 10, "Target enemy unit within 24” takes 2D6 automatic hits."),
  ],
})

export default goblins
