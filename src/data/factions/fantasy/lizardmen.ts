import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Slann Mage-Priest", size: 1, quality: "3+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Armored, Fearless, Hero, Tough(6), Wizard(3)", upgrades: "-", cost: 105 },
    { name: "Scar-Veteran", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Fearless, Hero, Predatory, Tough(3)", upgrades: "A", cost: 35 },
    { name: "Skink Chief", size: 1, quality: "6+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Fearless, Hero, Strider, Tough(3)", upgrades: "B", cost: 10 },
    { name: "Skink Priest", size: 1, quality: "6+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Arcane Vassal, Fearless, Strider, Tough(3), Wizard(1)", upgrades: "-", cost: 40 },
    { name: "Saurus Warriors", size: 10, quality: "4+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" })], special: "Fearless, Predatory", upgrades: "C, H", cost: 170 },
    { name: "Temple Guard", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Halberd', { key: 'medium-halberd', label: "Medium Halberds" })], special: "Fearless, Predatory", upgrades: "C", cost: 260 },
    { name: "Skinks", size: 5, quality: "6+", equipment: [customWeapon("Throwing Weapons", { range: 12, attacks: "1", rules: rules("Poison") })], special: "Fearless, Strider", upgrades: "C, J", cost: 45 },
    { name: "Chameleon Skinks", size: 5, quality: "5+", equipment: [customWeapon("Blowpipes", { range: 12, attacks: "2", rules: rules("Poison") })], special: "Chameleon, Fearless, Scout, Strider", upgrades: "-", cost: 115 },
    { name: "Cold One Riders", size: 5, quality: "4+", equipment: [meleeWeapon('Medium', 'Swords', { key: 'medium-sword', label: "Medium Swords" }), meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fast, Fear, Fearless, Nimble, Predatory", upgrades: "C, I", cost: 145 },
    { name: "Terradon Riders", size: 3, quality: "5+", equipment: [customWeapon("Fireleech Bolas", { range: 6, attacks: "1", rules: rules("") })], special: "Drop Rocks, Fear, Fearless, Flying, Impact(1), Nimble, Tough(3)", upgrades: "D", cost: 85 },
    { name: "Ripperdactyl Riders", size: 3, quality: "5+", equipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" }), meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws", rules: rules('Piercing, Deadly') })], special: "Fear, Flying, Furious, Impact(1), Nimble, Toad Rage, Tough(3)", upgrades: "-", cost: 120 },
    { name: "Kroxigors", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces" })], special: "Armored, Fear, Fearless, Impact(1), Predatory, Strider, Tough(3)", upgrades: "-", cost: 190 },
    { name: "Jungle Swarms", size: 3, quality: "5+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Poison') })], special: "Fearless, Strider, Tough(6)", upgrades: "-", cost: 155 },
    { name: "Razordon Pack", size: 1, quality: "4+", equipment: [customWeapon("Shoot Barbs", { range: 18, attacks: "D6", rules: rules("") }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Fear, Fearless, Handlers, Impact(1), Strider, Tough(3)", upgrades: "-", cost: 55 },
    { name: "Salamander Pack", size: 1, quality: "4+", equipment: [customWeapon("Fire Thrower", { range: 18, attacks: "6", rules: rules("") }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Fear, Fearless, Handlers, Impact(1), Strider, Tough(3)", upgrades: "-", cost: 60 },
    { name: "Stegadon", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" }), meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" }), customWeapon("Throwing Weapon", { range: 12, attacks: "1", rules: rules("Poison") }, { count: 2 })], special: "Armored, Fear, Fearless, Impact(D6), Tough(6)", upgrades: "E", cost: 100 },
    { name: "Troglodon", size: 1, quality: "4+", equipment: [customWeapon("Spit Venom", { range: 18, attacks: "D3", rules: rules("Poison") }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws", rules: rules('Poison') })], special: "Arcane Vassal, Fear, Fearless, Predatory, Roar, Strider, Tough(6)", upgrades: "-", cost: 120 },
    { name: "Bastiladon", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" }), meleeWeapon('Medium', 'Sword', { key: 'medium-sword', label: "Medium Sword" }), customWeapon("Throwing Weapon", { range: 12, attacks: "1", rules: rules("Poison") }, { count: 2 })], special: "Armored, Bludgeon, Fear, Fearless, Impact(D6), Tough(9)", upgrades: "F", cost: 135 },
]

export const lizardmen = faction({
  id: "lizardmen",
  name: "Lizardmen",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("I", [
      section("Upgrade with:", 'any', [
        { label: "Medium Spears", cost: 10, addEquipment: [meleeWeapon('Medium', 'Spears', { key: 'medium-spear', label: "Medium Spears" })] }
      ])
    ]),
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })] },
        { label: "Master Spear", cost: 5, addEquipment: [meleeWeapon('Master', 'Spear', { key: 'master-spear', label: "Master Spear" })] },
        { label: "Master Halberd", cost: 5, addEquipment: [meleeWeapon('Master', 'Halberd', { key: 'master-halberd', label: "Master Halberd" })] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace" })] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor (Armored)", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Cold One", cost: 15, addEquipment: [gear("Cold One")] },
        { label: "Carnosaur", cost: 100, addEquipment: [gear("Carnosaur")] }
      ])
    ]),
    group("J", [
      section("Upgrade with:", 'any', [
        { label: "Lustrian Venom (Poison in Melee)", cost: 15, adds: ["Poison in Melee"] }
      ]),
      section("Replace all Throwing Weapons:", 'any', [
        { label: "Blowpipes", cost: 20, addEquipment: [customWeapon("Blowpipes", { range: 12, attacks: "2", rules: rules("Poison") })], removeEquipment: ["Throwing Weapons"] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Heavy Spear", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Spear', { key: 'heavy-spear', label: "Heavy Spear" })] },
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Throwing Weapon (Poison)", cost: 5, adds: ["Poison"], addEquipment: [customWeapon("Throwing Weapon", { range: null, attacks: '1', rules: rules("Poison") })] },
        { label: "Blowpipe", cost: 10, addEquipment: [customWeapon("Blowpipe", { range: 12, attacks: "2", rules: rules("Poison") })] },
        { label: "Shield (Armored)", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Terradon", cost: 15, addEquipment: [gear("Terradon")] },
        { label: "Ripperdactyl", cost: 35, addEquipment: [gear("Ripperdactyl")] }
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
      section("Upgrade with:", 'any', [
        { label: "Throwing Weapons", cost: 5, addEquipment: [customWeapon("Throwing Weapons", { range: null, attacks: '1', rules: rules('') })] }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Unstoppable Stampede (Furious)", cost: 5, adds: ["Furious"] },
        { label: "Sharp Horns (Impact(+3))", cost: 10, adds: ["Sharp Horns (Impact(+3))"] }
      ]),
      section("Take one:", 'one', [
        { label: "Giant Bow", cost: 35, addEquipment: [customWeapon("Giant Bow", { range: 36, attacks: "3", rules: rules("Piercing, Single Target, Poison") })] },
        { label: "Engine of the Gods", cost: 35, addEquipment: [customWeapon("Engine of the Gods", { range: null, attacks: '1', rules: rules("Engine of the Gods") })] },
        { label: "Giant Blowpipe", cost: 55, addEquipment: [customWeapon("Giant Blowpipe", { range: 18, attacks: "2D6", rules: rules("Poison") })] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Ark of Sotek", cost: 30, addEquipment: [customWeapon("Ark of Sotek", { range: "D6", attacks: "2D6", rules: rules("Spawn") })] },
        { label: "Solar Engine", cost: 125, addEquipment: [customWeapon("Solar Engine", { range: null, attacks: '1', rules: rules("Solar Engine") })] }
      ])
    ]),
    group("G", [
      section("Upgrade with:", 'any', [
        { label: "Loping Stride (Fast)", cost: 5, adds: ["Fast"] },
        { label: "Blood Roar", cost: 5, adds: ["Blood Roar"] }
      ])
    ]),
    group("H", [
      section("Replace all Medium Swords:", 'one', [
        { label: "Medium Spears", cost: 15, addEquipment: [meleeWeapon('Medium', 'Spears', { key: 'medium-spear', label: "Medium Spears" })], removeEquipment: ["Medium Swords"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Arcane Vassal", "Friendly Slann Mage-Priests within 24” of this model may cast spells from its position."),
    armyRule("Bludgeon", "Whenever this unit fights in Melee nominate one of its attacks to be a bludgeon attack. That attack has the Piercing and Deadly rules."),
    armyRule("Chameleon", "Enemy units must re-roll successful hits from shooting against this unit."),
    armyRule("Drop Rocks", "Once per game his model may deal D3 hits to one enemy unit it passed over."),
    armyRule("Engine of the Gods", "All friendly units within 6” may ignore wounds on a 6+. When this unit is activated you may deal D6 automatic hits to all enemy units within 4D6”."),
    armyRule("Handlers", "Place three skink handler models next to this unit as long as it is alive. This unit has +1 Attack in Melee for every handler model, however whenever it takes a wound you must remove one skink handler model."),
    armyRule("Predatory", "Whenever this model rolls a 6 to hit with a melee attack you may immediately roll one more attack die. This rule does not apply to attack dice generated by this."),
    armyRule("Roar", "All friendly units within 12” with Predatory get extra attacks on rolls of 5+."),
    armyRule("Solar Engine", "All friendly units within 6” get the Rapid special rule. When this unit is activated you may deal D6+3 hits to one enemy unit within 24”."),
    armyRule("Spawn", "This weapon may also be fired whilst in Melee. After shooting target a friendly Jungle Swarm unit within 6” and roll one die. On a 4+ you may add one Jungle Swarm model to it."),
    armyRule("Toad Rage", "At the beginning of the game place a toad marker next to one enemy unit. All models in this unit get +D3 attacks and may re-roll failed hits when fighting units with toad markers."),
  ],
  psychicPowers: [
    power("Apotheosis", 6, "Target friendly model within 18” immediately removes one wound marker."),
    power("Soul Quench", 9, "Target enemy unit within 18” takes 2D6 automatic hits."),
    power("Drain Magic", 9, "Target unit within 18” loses all spell effects with “until the end of the round”."),
    power("Hand of Glory", 9, "Target friendly unit within 18” gets Rapid shooting or melee attacks until the end of the round (pick one)."),
    power("Tempest", 11, "Target enemy unit within 30” takes D6+3 automatic hits."),
    power("Walk Between Worlds", 13, "Target friendly unit within 24” may move by up to 10”."),
  ],
})

export default lizardmen
