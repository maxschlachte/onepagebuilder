import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Bretonnian Lord", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Armored, Fast, Fearless, Hero, Nimble, Tough(3)", upgrades: "A", cost: 60 },
    { name: "Paladin", size: 1, quality: "5+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Armored, Fast, Fearless, Hero, Nimble, Tough(3)", upgrades: "B", cost: 30 },
    { name: "Prophetess of the Lady", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Hero, Resistance, Tough(3), Wizard(3)", upgrades: "C", cost: 55 },
    { name: "Damsel of the Lady", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Resistance, Tough(3), Wizard(1)", upgrades: "D", cost: 40 },
    { name: "Men-at-Arms", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], special: "Peasant’s Duty", upgrades: "E, G", cost: 40 },
    { name: "Peasant Bowmen", size: 5, quality: "6+", equipment: [weaponFantasy('longbow', { label: "Longbows" })], special: "Adequate Shot, Peasant’s Duty", upgrades: "E, F", cost: 45 },
    // Size modeled as 13 (1 unique Reliquae model + 12 Men-at-Arms) — the app has no way to represent a composite unit with two different equipment/Tough profiles per model; see the "Grail Reliquae" army rule for the real mechanic.
    { name: "Grail Reliquae", size: 13, quality: "6+", equipment: [customWeapon("Grail Reliquae", { range: null, attacks: "1", rules: rules("") })], special: "Armored, Fearless, Furious", upgrades: "-", cost: 125 },
    { name: "Mounted Yeomen", size: 5, quality: "5+", equipment: [weaponFantasy('bow', { label: "Bows" }), meleeWeapon('Light', 'Spear', { key: 'light-spear', label: "Light Spears" })], special: "Fast, Nimble, Peasant’s Duty", upgrades: "E", cost: 75 },
    { name: "Knights Errant", size: 6, quality: "5+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" })], special: "Armored, Fast, Fearless, Lance Formation, Nimble", upgrades: "E", cost: 115 },
    { name: "Knights of the Realm", size: 6, quality: "4+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" })], special: "Armored, Fast, Fearless, Lance Formation, Nimble", upgrades: "E", cost: 155 },
    { name: "Questing Knights", size: 6, quality: "3+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "Armored, Fast, Fearless, Lance Formation, Nimble", upgrades: "E", cost: 200 },
    { name: "Grail Knights", size: 6, quality: "3+", equipment: [meleeWeapon('Medium', 'Lance', { key: 'medium-lance', label: "Medium Lances" })], special: "Armored, Fast, Fearless, Lance Formation, Nimble", upgrades: "E", cost: 210 },
    { name: "Pegasus Knights", size: 3, quality: "4+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" }), meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Armored, Fast, Fearless, Flying, Nimble, Tough(3)", upgrades: "E", cost: 140 },
    { name: "Field Trebuchet", size: 1, quality: "5+", equipment: [weaponFantasy('stone-thrower', { rules: rules('Indirect') })], special: "Armored, Fixed, Ordnance, Peasant’s Duty, Tough(3)", upgrades: "-", cost: 60 },
]

export const bretonnia = faction({
  id: "bretonnia",
  name: "Bretonnia",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Master Sword:", 'one', [
        { label: "Master Lance", cost: 5, addEquipment: [meleeWeapon('Master', 'Lance', { key: 'master-lance', label: "Master Lance" })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace" })], removeEquipment: ["Master Sword"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Royal Pegasus", cost: 50, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Royal Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Hippogryph", cost: 70, addEquipment: [
            meleeWeapon('Master', 'Claws', { key: 'master-claws', label: "Master Claws" }),
            gear("Hippogryph", { mount: true, rules: [{ ruleId: "fear" }, { ruleId: "flying" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("B", [
      section("Replace Heavy Sword:", 'one', [
        { label: "Heavy Lance", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Lance', { key: 'heavy-lance', label: "Heavy Lance" })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Mace", cost: 10, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace" })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Royal Pegasus", cost: 30, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Royal Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("C", [
      section("Mount on:", 'any', [
        { label: "Bretonnian Warhorse", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Bretonnian Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Royal Pegasus", cost: 30, addEquipment: [
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws" }),
            gear("Royal Pegasus", { mount: true, rules: [{ ruleId: "flying" }, { ruleId: "impact", param: 1 }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("D", [
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 10, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Bretonnian Warhorse", cost: 5, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws" }),
            gear("Bretonnian Warhorse", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ], { oncePerUnit: true })
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Defensive Stakes", cost: 25, adds: ["Defensive Stakes"] }
      ])
    ]),
    group("G", [
      section("Replace all Light Spears:", 'one', [
        { label: "Light Halberds", cost: 0, addEquipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds" })], removeEquipment: ["Light Spears"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Adequate Shot", "This unit shoots at Quality 5+."),
    armyRule("Defensive Stakes", "When this unit is deployed place a model of defensive stakes in front of it, and if the unit ever moves it is removed. Whenever this unit is charged in its front all attacking models must take a dangerous terrain test."),
    armyRule("Fixed", "This unit may never move, but it may pivot."),
    armyRule("Grail Reliquae", "This unit is deployed in a special formation by placing a Reliquae model in the center, with two columns of 3 Men-at-Arms models on each side. The Reliquae model counts as having a Master Sword, whilst the Men-at-Arms have Light Swords. When removing models you must first remove the Men-at-Arms until only the Reliquae remains, which counts as having the Tough(6) special rule. This unit always gets +2 when calculating melee results."),
    armyRule("Lance Formation", "This model has Impact(1)."),
    armyRule("Peasant’s Duty", "This unit has the Fearless special rules as long as it is within 6” of another friendly unit with the Fearless special rule."),
    armyRule("The Blessing of the Lady", "When using this army you may choose to forfeit the first round in order for your troops to pray and gain the Blessing of the Lady. If you decide to do so your units may not use any actions during the first round (however they may still strike back if engaged in close combat), and all units in your army may re-roll results of 1 when blocking for the rest of the game."),
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

export default bretonnia
