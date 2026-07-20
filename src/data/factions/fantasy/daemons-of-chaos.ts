import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    // "Bloodthrister" as printed in the source (likely a transcription typo for "Bloodthirster") — kept verbatim.
    { name: "Bloodthrister", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Furious, Flying, Hero, Impact(D6), Resistance, Tough(6)", upgrades: "-", cost: 150 },
    { name: "Lord of Change", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Flying, Hero, Impact(D6), Regeneration, Tough(6), Wizard(2)", upgrades: "-", cost: 175 },
    { name: "Unclean One", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing, Poison') })], special: "Armored, Fear, Hero, Impact(D6), Stench, Tough(6), Wizard(1)", upgrades: "-", cost: 190 },
    { name: "Keeper of Secrets", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Hero, Impact(D6), Tough(6), Wizard(2)", upgrades: "-", cost: 165 },
    { name: "Daemon Prince", size: 1, quality: "2+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Hero, Impact(D6), Tough(6)", upgrades: "D, H", cost: 130 },
    { name: "Herald of Khorne", size: 1, quality: "3+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Fear, Fearless, Furious, Hero, Resistance, Tough(3)", upgrades: "A", cost: 50 },
    { name: "Herald of Tzeentch", size: 1, quality: "5+", equipment: [meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" })], special: "Fear, Fearless, Hero, Regeneration, Tough(3), Wizard(1)", upgrades: "B", cost: 50 },
    { name: "Herald of Nurgle", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword", rules: rules('Poison') })], special: "Fear, Fearless, Hero, Stench, Tough(3)", upgrades: "E", cost: 50 },
    { name: "Herald of Slaanesh", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword", rules: rules('Piercing') })], special: "Fear, Fearless, Hero, Tough(3)", upgrades: "F", cost: 40 },
    { name: "Pink Horrors", size: 10, quality: "5+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fear, Fearless, Horrors, Regeneration", upgrades: "C, G", cost: 140 },
    { name: "Plaguebearers", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords", rules: rules('Poison') })], special: "Fear, Fearless, Stench", upgrades: "C", cost: 210 },
    { name: "Daemonettes", size: 10, quality: "4+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws", rules: rules('Piercing') })], special: "Fear, Fearless", upgrades: "C", cost: 210 },
    { name: "Bloodletters", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Fear, Fearless, Furious, Resistance", upgrades: "C", cost: 235 },
    { name: "Chaos Furies", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fear, Fearless, Flying", upgrades: "H", cost: 180 },
    { name: "Seekers", size: 5, quality: "4+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords", rules: rules('Piercing, Poison') })], special: "Fast, Fear, Fearless, Nimble", upgrades: "C", cost: 160 },
    { name: "Screamers", size: 5, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" }), gear("Slashing Attack")], special: "Fast, Fear, Fearless, Flying, Nimble, Tough(3)", upgrades: "-", cost: 235 },
    { name: "Flesh Hounds", size: 5, quality: "3+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Fast, Fear, Fearless, Furious, Nimble, Resistance, Tough(3)", upgrades: "-", cost: 265 },
    { name: "Nurglings", size: 3, quality: "5+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Fear, Fearless, Scout, Stench, Tough(3)", upgrades: "-", cost: 105 },
    { name: "Plague Drones", size: 3, quality: "4+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword", rules: rules('Poison') }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fear, Fearless, Impact(1), Nimble, Strider, Tough(3)", upgrades: "C, I", cost: 135 },
    { name: "Flamers", size: 3, quality: "4+", equipment: [customWeapon("Flamers", { range: 18, attacks: "D6", rules: rules("") }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Fear, Fearless, Regeneration, Tough(3)", upgrades: "-", cost: 150 },
    { name: "Fiends", size: 3, quality: "3+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws", rules: rules('Piercing') })], special: "Fast, Fear, Fearless, Impact(1), Nimble, Tough(3)", upgrades: "-", cost: 175 },
    { name: "Nurgle Beasts", size: 3, quality: "4+", equipment: [customWeapon("Rotten Attack", { range: null, attacks: "D6+1", rules: rules("Poison") })], special: "Armored, Fear, Fearless, Impact(1), Nimble, Regeneration, Stench, Tough(3)", upgrades: "-", cost: 235 },
    { name: "Bloodcrushers", size: 3, quality: "3+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fear, Fearless, Furious, Impact(1), Nimble, Resistance, Tough(3)", upgrades: "C", cost: 205 },
    { name: "Soul Grinder", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws", rules: rules('Piercing, Caught') })], special: "Armored, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "H, J", cost: 95 },
    { name: "Seeker Chariot", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws", rules: rules('Piercing') }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws", rules: rules('Piercing, Poison') })], special: "Armored, Fast, Fear, Impact(D6), Tough(3)", upgrades: "-", cost: 75 },
    { name: "Burning Chariot", size: 1, quality: "3+", equipment: [weaponFantasy('fire-thrower'), customWeapon("Blazing Fire", { range: null, attacks: "9", rules: rules("") })], special: "Armored, Fast, Fear, Impact(D6), Regeneration, Tough(3)", upgrades: "-", cost: 120 },
    { name: "Skull Cannon", size: 1, quality: "3+", equipment: [weaponFantasy('cannon'), meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fast, Fear, Furious, Impact(D6), Tough(3)", upgrades: "-", cost: 205 },
]

export const daemonsofchaos = faction({
  id: "daemons-of-chaos",
  name: "Daemons of Chaos",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Equip with one:", 'one', [
        { label: "Locus of Abjuration", cost: 10, adds: ["Locus of Abjuration"] },
        { label: "Locus of Wrath", cost: 50, adds: ["Locus of Wrath"] },
        { label: "Locus of Fury", cost: 115, adds: ["Locus of Fury"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Juggernaut", cost: 60, addEquipment: [
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws" }),
            gear("Juggernaut", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "impact", param: 1 }, { ruleId: "nimble" }, { ruleId: "tough", param: 3 }] })
          ]
        },
        { label: "Blood Throne", cost: 85, addEquipment: [
            meleeWeapon('Force', 'Claws', { key: 'force-claws', label: "Force Claws", rules: rules('Piercing') }),
            gear("Blood Throne", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("E", [
      section("Equip with one:", 'one', [
        { label: "Locus of Contagion", cost: 20, adds: ["Locus of Contagion"] },
        { label: "Locus of Virulence", cost: 55, adds: ["Locus of Virulence"] },
        { label: "Locus of Fecundity", cost: 55, adds: ["Locus of Fecundity"] }
      ]),
      section("Upgrade with:", 'any', [
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Palanquin", cost: 40, addEquipment: [
            meleeWeapon('Force', 'Claws', { key: 'force-claws', label: "Force Claws" }),
            gear("Palanquin", { mount: true, rules: [{ ruleId: "impact", param: 1 }, { ruleId: "nimble" }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("B", [
      section("Equip with one:", 'one', [
        { label: "Locus of Conjuration", cost: 10, adds: ["Locus of Conjuration"] },
        { label: "Locus of Transmogrification", cost: 15, adds: ["Locus of Transmogrification"] },
        { label: "Locus of Change", cost: 15, adds: ["Locus of Change"] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Disc", cost: 10, addEquipment: [
            meleeWeapon('Heavy', 'Claws', { key: 'heavy-claws', label: "Heavy Claws" }),
            gear("Disc", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "flying" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Seeker Chariot", cost: 55, addEquipment: [
            meleeWeapon('Master', 'Claws', { key: 'master-claws', label: "Master Claws", rules: rules('Piercing') }),
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws", rules: rules('Piercing, Poison') }),
            gear("Seeker Chariot", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
          ]
        }
      ])
    ]),
    group("F", [
      section("Equip with one:", 'one', [
        { label: "Locus of Grace", cost: 25, adds: ["Locus of Grace"] },
        { label: "Locus of Beguilement", cost: 45, adds: ["Locus of Beguilement"] },
        { label: "Locus of Swiftness", cost: 50, adds: ["Locus of Swiftness"] }
      ]),
      section("Upgrade with:", 'any', [
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] }
      ]),
      section("Mount on:", 'one', [
        { label: "Steed", cost: 10, addEquipment: [
            meleeWeapon('Light', 'Claws', { key: 'light-claws', label: "Light Claws", rules: rules('Piercing, Poison') }),
            gear("Steed", { mount: true, rules: [{ ruleId: "fast" }, { ruleId: "nimble" }] })
          ]
        },
        { label: "Seeker Chariot", cost: 65, addEquipment: [
            meleeWeapon('Master', 'Claws', { key: 'master-claws', label: "Master Claws", rules: rules('Piercing') }),
            meleeWeapon('Medium', 'Claws', { key: 'medium-claws', label: "Medium Claws", rules: rules('Piercing, Poison') }),
            gear("Seeker Chariot", { mount: true, rules: [{ ruleId: "armored" }, { ruleId: "fast" }, { ruleId: "impact", param: "D6" }, { ruleId: "tough", param: 3 }] })
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
    group("G", [
      section("Upgrade one model with:", 'any', [
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] }
      ])
    ]),
    group("D", [
      section("Upgrade with:", 'any', [
        { label: "Daemonic Flight", cost: 5, adds: ["Flying"] },
        { label: "Wizard(1)", cost: 25, adds: ["Wizard(1)"] },
        { label: "Wizard(2)", cost: 30, adds: ["Wizard(2)"] },
        { label: "Wizard(3)", cost: 40, adds: ["Wizard(3)"] }
      ])
    ]),
    group("H", [
      section("Upgrade with one:", 'one', [
        { label: "Khorne", cost: 15, adds: ["Furious"] },
        { label: "Slaanesh", cost: 15, adds: ["Piercing"] },
        { label: "Nurgle", cost: 30, adds: ["Stench"] },
        { label: "Tzeentch", cost: 30, adds: ["Regeneration"] }
      ])
    ]),
    group("I", [
      section("Upgrade all models with one:", 'one', [
        { label: "Death’s Heads", cost: 20, addEquipment: [customWeapon("Death’s Heads", { range: 12, attacks: "1", rules: rules("Poison") })] },
        { label: "Plague Proboscis", cost: 25, adds: ["Poison"] },
        { label: "Venom Sting", cost: 80, adds: ["Deadly"] }
      ])
    ]),
    group("J", [
      section("Upgrade with one:", 'one', [
        { label: "Baleful Torrent", cost: 20, addEquipment: [weaponFantasy('fire-thrower')] },
        { label: "Warp Gaze", cost: 45, addEquipment: [weaponFantasy('bolt-thrower')] },
        { label: "Phlegm Bombard", cost: 55, addEquipment: [weaponFantasy('stone-thrower', { rules: rules('Indirect') })] },
        { label: "Harvester Cannon", cost: 90, addEquipment: [weaponFantasy('cannon')] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Locus of Abjuration", "The hero and his unit may ignore spells on 3+ from Resistance."),
    armyRule("Locus of Wrath", "The hero and his unit get the Impact(1) special rule."),
    armyRule("Locus of Fury", "The hero and his unit get +1A in Melee when charging."),
    armyRule("Locus of Contagion", "The hero and his unit deal one automatic hit on hit rolls of 6."),
    armyRule("Locus of Virulence", "The hero and his unit deal wounds from Poison on 5+."),
    armyRule("Locus of Fecundity", "The hero and his unit get the Regeneration special rule."),
    armyRule("Locus of Conjuration", "The hero’s Spell attacks all get the Piercing special rule."),
    armyRule("Locus of Transmogrification", "The hero and his unit place D3 markers for the Horrors rule."),
    armyRule("Locus of Change", "The hero and his unit get the Piercing special rule."),
    armyRule("Locus of Grace", "The hero and his unit get the Strider special rule."),
    // Source reads "(Enemies get the Unwieldy special rule again the hero and his unit)" — almost certainly an OCR typo for "against"; transcribed with the sensible reading.
    armyRule("Locus of Beguilement", "Enemies get the Unwieldy special rule against the hero and his unit."),
    armyRule("Locus of Swiftness", "The hero and his unit get the Rapid special rule."),
    armyRule("Caught", "When fighting in Melee roll one die, on 4+ all attacks hit automatically."),
    armyRule("Horrors", "If this model is killed in Melee place a marker next to the unit that killed it. Once both sides have attacked the target takes as many hits as markers, and all markers are removed."),
    armyRule("Slashing Attack", "This model may deal one hit to one enemy unit it passed over each round."),
    armyRule("Stench", "Enemy units must re-roll all successful melee hits against this unit."),
  ],
  psychicPowers: [
    power("Acquiescence", 6, "Target enemy unit within 24” gets the Unwieldy rule until the end of the round."),
    power("Pink Fire", 7, "Target enemy unit within 18” takes D6 automatic hits."),
    power("Corruption", 7, "Target enemy unit within 12” takes D6p automatic hits."),
    // Source has a trailing stray "rule." after "automatic hits" — dropped as an evident transcription artifact.
    power("Lash", 9, "Target enemy unit within 24” takes D6p automatic hits."),
    power("Pestilence", 9, "Target enemy unit within 18” must re-roll hits until the end of the round."),
    power("Treason", 10, "Target enemy unit within 24” must re-roll morale tests until the end of the round."),
  ],
})

export default daemonsofchaos
