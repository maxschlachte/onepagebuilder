import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

// Melee weapons are named "<Tier> <Type>" per one-page-fantasy-rules.md's weapon table:
// tier gives attacks (Light 1, Medium 2, Heavy 3, Master 4, Force 5), type gives innate
// rules (Halberd: Piercing; Mace: Piercing+Poison; Lance: Impact(1); Sword/Claws: none).
// Ranged weapons named plainly (Pistol/Rifle/Bow/Longbow/Crossbow/Cannon/etc.) take their
// range/attacks/rules from that same table's ranged-weapon section.

const units: UnitInput[] = [
    { name: "General", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Hold the Line!, Tough(3)", upgrades: "A", cost: 60 },
    { name: "Captain", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Hero, Hold the Line!, Tough(3)", upgrades: "A", cost: 50 },
    { name: "Warrior Priest", size: 1, quality: "5+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Fury, Hero, Prayer, Resistance, Tough(3)", upgrades: "B", cost: 70 },
    { name: "Witch Hunter", size: 1, quality: "5+", equipment: [weaponFantasy('pistol'), meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Accusation, Hero, Resistance, Tough(3)", upgrades: "J", cost: 35 },
    { name: "Battle Wizard", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Tough(3), Wizard(1)", upgrades: "C", cost: 35 },
    { name: "Master Engineer", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Ballistic Master, Tough(3)", upgrades: "D", cost: 80 },
    { name: "State Troops", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "-", upgrades: "E, F", cost: 60 },
    { name: "Flagellants", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "End is Nigh!, Fearless, Furious", upgrades: "-", cost: 130 },
    { name: "Greatswords", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "Armored, Fearless", upgrades: "F", cost: 195 },
    { name: "State Marksmen", size: 5, quality: "5+", equipment: [weaponFantasy('bow', { label: "Bows" })], special: "-", upgrades: "F, G", cost: 50 },
    { name: "Pistoliers", size: 5, quality: "5+", equipment: [customWeapon("Pistol Braces", { range: 12, attacks: "2", rules: rules("") }), meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Fast, Nimble", upgrades: "F, H", cost: 75 },
    { name: "Knightly Orders", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" })], special: "Armored, Nimble", upgrades: "F, I", cost: 85 },
    { name: "Demigryph Knights", size: 3, quality: "4+", equipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws", rules: rules('Piercing') })], special: "Armored, Fear, Nimble, Impact(1), Tough(3)", upgrades: "F, K", cost: 160 },
    { name: "Celestial Hurricanum", size: 1, quality: "4+", equipment: [customWeapon("Storm", { range: 24, attacks: "3", rules: rules("Piercing") }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Impact(D6), Portents, Tough(6)", upgrades: "-", cost: 100 },
    { name: "Luminark of Hysh", size: 1, quality: "4+", equipment: [customWeapon("Bolt", { range: 36, attacks: "3", rules: rules("Piercing, Single Target") }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Impact(D6), Protection, Tough(6)", upgrades: "-", cost: 105 },
    { name: "Steam Tank", size: 1, quality: "4+", equipment: [customWeapon("Steam Cannon", { range: 36, attacks: "D3+3", rules: rules("Piercing") }), gear("Fiery Breath", { rules: rules("Fiery Breath") })], special: "Armored, Fast, Impact(D6), Tough(9)", upgrades: "-", cost: 175 },
    { name: "Great Cannon", size: 1, quality: "5+", equipment: [weaponFantasy('cannon')], special: "Armored, Ordnance, Tough(3)", upgrades: "-", cost: 85 },
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
      section("Replace Heavy Sword:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Lance", cost: 5, requiresOneOfSelected: ["Warhorse", "Imperial Pegasus", "War Altar of Sigmar", "Imperial Griffon", "Imperial Dragon"], addEquipment: [meleeWeapon('Heavy', 'Lance', { key: 'heavy-lance', label: "Heavy Lance" })], removeEquipment: ["heavy-sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace" })], removeEquipment: ["heavy-sword"] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Pistol", cost: 5, addEquipment: [weaponFantasy('pistol')] },
        { label: "Heavy Armor", cost: 10, adds: ["Armored"] },
        { label: "Rifle", cost: 10, addEquipment: [weaponFantasy('rifle')] },
        { label: "Longbow", cost: 15, addEquipment: [weaponFantasy('longbow')] }
      ]),
      section("Mount on:", 'one', [
        { label: "Warhorse", cost: 10, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Imperial Pegasus", cost: 30, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Imperial Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "nimble" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "War Altar of Sigmar", cost: 100, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("War Altar of Sigmar", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "holy-fervour" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        },
        { label: "Imperial Griffon", cost: 100, addEquipment: [
            meleeWeapon('Master', 'Claws', { key: 'master-claws', label: "Master Claws", rules: rules('Piercing') }),
            gear("Imperial Griffon", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        },
        { label: "Imperial Dragon", cost: 115, addEquipment: [
            gear("Fiery Breath", { rules: rules("Fiery Breath") }),
            meleeWeapon('Force', 'Claws', { key: 'force-claws', label: "Force Claws", rules: rules('Piercing') }),
            gear("Imperial Dragon", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 6 }] })
          ]
        }
      ])
    ]),
    group("G", [
      section("Replace all Bows:", 'one', [
        { label: "Rifles", cost: 10, addEquipment: [weaponFantasy('rifle', { label: "Rifles" })], removeEquipment: ["Bows"] },
        { label: "Crossbows", cost: 20, addEquipment: [weaponFantasy('crossbow', { label: "Crossbows" })], removeEquipment: ["Bows"] }
      ]),
      section("Replace one Bow with one:", 'one', [
        { label: "Repeater Handgun", cost: 15, addEquipment: [customWeapon("Repeater Handgun", { range: 24, attacks: "3", rules: rules("Piercing") })], removeOneEquipment: ["Bow"] },
        { label: "Hochland Rifle", cost: 40, addEquipment: [customWeapon("Hochland Rifle", { range: 36, attacks: "1", rules: rules("Piercing, Sniper") })], removeOneEquipment: ["Bow"] }
      ]),
      section("Upgrade all models:", 'any', [
        { label: "Huntsman Training", cost: 10, adds: ["Scout"] }
      ])
    ]),
    group("H", [
      section("Replace all Pistol Braces:", 'any', [
        { label: "Repeater Handguns", cost: 70, addEquipment: [customWeapon("Repeater Handguns", { range: 24, attacks: "3", rules: rules("Piercing") })], removeEquipment: ["Pistol Braces"] }
      ]),
      section("Replace one Pistol Brace:", 'one', [
        { label: "Repeater Handgun", cost: 15, addEquipment: [customWeapon("Repeater Handgun", { range: 24, attacks: "3", rules: rules("Piercing") })], removeOneEquipment: ["Pistol Brace"] }
      ])
    ]),
    group("I", [
      section("Replace all Light Lances:", 'any', [
        { label: "Light Maces", cost: 10, addEquipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], removeEquipment: ["Light Lances"] }
      ]),
      section("Upgrade all models:", 'any', [
        { label: "Reiksguard Training", cost: 15, adds: ["Fearless"] }
      ])
    ]),
    group("B", [
      section("Replace Medium Sword:", 'any', [
        { label: "Heavy Sword", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], removeEquipment: ["medium-sword"] },
        { label: "Medium Mace", cost: 10, addEquipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Mace" })], removeEquipment: ["medium-sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Warhorse", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        }
      ])
    ]),
    group("J", [
      section("Replace Medium Sword:", 'any', [
        { label: "Medium Mace", cost: 10, addEquipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Mace" })], removeEquipment: ["medium-sword"] }
      ])
    ]),
    group("K", [
      section("Replace all Light Halberds:", 'any', [
        { label: "Light Lances", cost: 5, addEquipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" })], removeEquipment: ["Light Halberds"] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Warhorse", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        }
      ])
    ]),
    group("L", [
      section("Upgrade with:", 'any', [
        { label: "Iron Hooves", cost: 5, adds: ["Piercing Impact"] },
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
        { label: "Hochland Rifle", cost: 45, addEquipment: [customWeapon("Hochland Rifle", { range: 36, attacks: "1", rules: rules("Piercing, Sniper") })] }
      ]),
      section("Mount on:", 'one', [
        { label: "Warhorse", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Mechanical Steed", cost: 20, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Mechanical Steed", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "nimble" }, { ruleId: "impact", param: "D3" }] })
          ]
        }
      ])
    ]),
    group("M", [
      section("Upgrade with:", 'any', [
        { label: "Bloodroar", cost: 5, adds: ["Bloodroar"] },
        { label: "Two Heads", cost: 5, adds: ["+1A in Melee"] }
      ])
    ]),
    group("E", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 10, addEquipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] },
        { label: "Light Halberds", cost: 10, addEquipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds" })], removeEquipment: ["Light Swords"] },
        { label: "Medium Swords", cost: 20, addEquipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ], { oncePerUnit: true })
    ])
  ],
  armyRules: [
    armyRule("Accusation", "At the beginning of the game select one enemy model. The witch hunter may always target that model directly even if it is part of a unit, and it has the Rapid and Deadly rules against it."),
    armyRule("Ballistic Master", "Each round one Ordnance unit within 3” may shoot at Quality 4+."),
    // Distinct from the Lizardmen's same-mechanic "Blood Roar" — each army list prints its
    // own spelling and wording, so they stay separately registered per faction.
    armyRule("Bloodroar", "Enemies must re-roll successful morale tests from Fear."),
    armyRule("End is Nigh!", "Whenever this unit fights in melee you may sacrifice D3 models before combat begins. If you do then this unit gets the Armored and Rapid special rules for that combat."),
    armyRule("Fury", "The hero and his unit get the Furious rule."),
    armyRule("Hold the Line!", "The hero and his unit get the Fearless special rule."),
    armyRule("Holy Fervour", "All friendly units within 6” get the Furious special rule."),
    armyRule("Portents", "All friendly units within 6” get the Rapid special rule."),
    armyRule("Prayer", "Whenever the hero and his unit fight in melee roll one die, on a 4+ the unit gets the Rapid and Armored special rules."),
    armyRule("Protection", "All friendly units within 6” may ignore Wounds of 6+."),
    // Mechanically identical to the glossary's `Fast`, but printed under its own name in the
    // Empire list rather than as "(Fast)", so it stays a faction rule rather than aliasing.
    armyRule("Swift as the Wind", "This unit moves +3” when using Advance actions and +6” when using March/Charge actions."),
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
