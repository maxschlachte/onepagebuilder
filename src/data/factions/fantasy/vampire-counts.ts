import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Vampire Lord", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Hero, Hunger, Tough(3), Undead, Wizard(1)", upgrades: "A", cost: 65 },
    { name: "Wight King", size: 1, quality: "6+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword", rules: rules('Deadly') })], special: "Hero, Tough(3), Undead", upgrades: "B", cost: 35 },
    { name: "Banshee", size: 1, quality: "5+", equipment: [gear("Shriek", { rules: rules("Shriek") }), meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Ethereal, Hero, Tough(3), Undead", upgrades: "-", cost: 45 },
    { name: "Wraith", size: 1, quality: "5+", equipment: [gear("Grasp", { rules: rules("Grasp") }), meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Piercing, Poison') })], special: "Ethereal, Hero, Tough(3), Undead", upgrades: "-", cost: 45 },
    { name: "Necromancer", size: 1, quality: "5+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Tough(3), Undead, Wizard(1)", upgrades: "C", cost: 45 },
    { name: "Zombies", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws", rules: rules('Unwieldy') })], special: "Undead", upgrades: "D", cost: 35 },
    { name: "Skeleton Warriors", size: 10, quality: "6+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords" })], special: "Undead", upgrades: "D, H", cost: 40 },
    { name: "Crypt Ghouls", size: 10, quality: "5+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws", rules: rules('Poison') })], special: "Undead", upgrades: "-", cost: 160 },
    { name: "Grave Guard", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords", rules: rules('Deadly') })], special: "Undead", upgrades: "D, I", cost: 210 },
    { name: "Wraiths", size: 5, quality: "5+", equipment: [gear("Grasp", { rules: rules("Grasp") }), meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces", rules: rules('Piercing, Poison') })], special: "Ethereal, Tough(3), Undead", upgrades: "-", cost: 220 },
    { name: "Dire Wolves", size: 5, quality: "5+", equipment: [meleeWeapon('Light', 'Claws', { key: 'light-claw', label: "Light Claws" })], special: "Fast, Nimble, Undead, Vanguard", upgrades: "-", cost: 60 },
    { name: "Hexwraiths", size: 5, quality: "5+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces", rules: rules('Piercing, Poison') })], special: "Ethereal, Fast, Nimble, Soulstrider, Undead", upgrades: "-", cost: 135 },
    { name: "Black Knights", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Swords', { key: 'light-sword', label: "Light Swords", rules: rules('Deadly') })], special: "Ethereal, Fast, Nimble, Undead", upgrades: "D, J", cost: 150 },
    { name: "Blood Knights", size: 5, quality: "3+", equipment: [meleeWeapon('Medium', 'Lance', { key: 'medium-lance', label: "Medium Lances", rules: rules('Impact(1)') })], special: "Armored, Furious, Nimble, Undead", upgrades: "D", cost: 150 },
    { name: "Fell Bats", size: 3, quality: "5+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Fast, Flying, Nimble, Tough(3), Undead", upgrades: "-", cost: 70 },
    { name: "Bat Swarms", size: 3, quality: "6+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws" })], special: "Cloud of Horror, Strider, Tough(6), Undead", upgrades: "-", cost: 100 },
    { name: "Vargheists", size: 3, quality: "3+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Flying, Furious, Impact(1), Tough(3), Undead", upgrades: "-", cost: 145 },
    { name: "Spirit Hosts", size: 3, quality: "5+", equipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], special: "Ethereal, Tough(6), Undead", upgrades: "-", cost: 175 },
    { name: "Crypt Horrors", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws", rules: rules('Poison') })], special: "Armored, Impact(1), Regeneration, Tough(3), Undead", upgrades: "-", cost: 180 },
    { name: "Morghast", size: 1, quality: "3+", equipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], special: "Armored, Flying, Impact(D3), Undead, Tough(3)", upgrades: "-", cost: 65 },
    { name: "Varghulf", size: 1, quality: "3+", equipment: [meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws" })], special: "Armored, Furious, Impact(D6), Regeneration, Tough(3), Undead", upgrades: "-", cost: 80 },
    { name: "Terrorgheist", size: 1, quality: "4+", equipment: [gear("Shriek", { rules: rules("Shriek") }), meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Flying, Impact(D6), Tough(6), Undead", upgrades: "E", cost: 100 },
    { name: "Black Coach", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Piercing, Poison') }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Evocation of Death, Fast, Impact(D6), Tough(3), Undead", upgrades: "-", cost: 75 },
    { name: "Corpse Cart", size: 1, quality: "5+", equipment: [customWeapon("Restless Dead", { range: null, attacks: "2D6", rules: rules("") })], special: "Armored, Fast, Impact(D6), Regeneration, Tough(3), Undead, Vigor", upgrades: "F", cost: 105 },
    { name: "Mortis Engine", size: 1, quality: "4+", equipment: [gear("Shriek", { rules: rules("Shriek") }), gear("Grasp", { rules: rules("Grasp") }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" }), customWeapon("Spirit Horde", { range: null, attacks: "2D6", rules: rules("") })], special: "Armored, Ethereal, Fast, Impact(D6), Regeneration, Reliquary, Tough(6), Undead", upgrades: "K", cost: 190 },
]

export const vampirecounts = faction({
  id: "vampire-counts",
  name: "Vampire Counts",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Master Lance (Mounted Only)", cost: 5, addEquipment: [meleeWeapon('Master', 'Lance', { key: 'master-lance', label: "Master Lance", rules: rules('Impact(1), Mounted Only') })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor", cost: 10, adds: ["Armored"] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ], { requiresBaselineRule: ["Wizard(1)"] }),
      section("Mount on:", 'any', [
        { label: "Nightmare", cost: 10, addEquipment: [gear("Nightmare")] },
        { label: "Hellsteed", cost: 10, addEquipment: [gear("Hellsteed")] },
        { label: "Abyssal Terror", cost: 60, addEquipment: [gear("Abyssal Terror")] },
        { label: "Coven Throne", cost: 100, addEquipment: [gear("Coven Throne")] },
        { label: "Terrorgheist", cost: 105, addEquipment: [gear("Terrorgheist")] },
        { label: "Zombie Dragon", cost: 110, addEquipment: [gear("Zombie Dragon")] }
      ])
    ]),
    group("B", [
      section("Replace Heavy Sword:", 'any', [
        { label: "Heavy Mace", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Piercing, Poison, Deadly') })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Lance (Deadly, Mounted Only)", cost: 5, addEquipment: [meleeWeapon('Heavy', 'Lance', { key: 'heavy-lance', label: "Heavy Lance", rules: rules('Impact(1), Deadly, Mounted Only') })], removeEquipment: ["Heavy Sword"] },
        { label: "Master Sword", cost: 10, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword", rules: rules('Deadly') })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Heavy Armor", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Skeletal Steed", cost: 15, addEquipment: [gear("Skeletal Steed")] }
      ])
    ]),
    group("C", [
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] }
      ], { requiresBaselineRule: ["Wizard(1)"] }),
      section("Mount on:", 'any', [
        { label: "Nightmare", cost: 5, addEquipment: [gear("Nightmare")] },
        { label: "Corpse Cart", cost: 120, addEquipment: [gear("Corpse Cart")] }
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
      section("Upgrade with any:", 'any', [
        { label: "Infested", cost: 10, adds: ["Infested"] },
        { label: "Rancid Maw", cost: 10, adds: ["Poison in Melee"] }
      ])
    ]),
    group("F", [
      section("Upgrade with any:", 'any', [
        { label: "Unholy Lodestone", cost: 10, adds: ["Unholy Lodestone"] },
        { label: "Balefire", cost: 40, adds: ["Balefire"] }
      ])
    ]),
    group("G", [
      section("Upgrade with any:", 'any', [
        { label: "Sword-Claws", cost: 5, addEquipment: [customWeapon("Sword-Claws", { range: null, attacks: '1', rules: rules("Piercing in Melee") })] },
        { label: "Poisonous Tail", cost: 10, addEquipment: [customWeapon("Poisonous Tail", { range: null, attacks: '1', rules: rules("Poison in Melee") })] }
      ])
    ]),
    group("H", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Spears", cost: 5, addEquipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("I", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Maces", cost: 15, addEquipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces", rules: rules('Piercing, Poison, Deadly') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("J", [
      section("Replace all Light Swords:", 'one', [
        { label: "Light Lances", cost: 15, addEquipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances", rules: rules('Impact(1), Deadly') })], removeEquipment: ["Light Swords"] }
      ])
    ]),
    group("K", [
      section("Upgrade with:", 'any', [
        { label: "Blasphemous Tome", cost: 40, adds: ["Blasphemous Tome"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Balefire", "Enemy wizards within 24” get -1 to their spell casting results."),
    armyRule("Blasphemous Tome", "Friendly wizards within 12” get +2 to their spell casting results."),
    armyRule("Cloud of Horror", "Enemy units in base contact with this unit get the Unwieldy special rule."),
    armyRule("Ethereal", "This unit may ignore wounds from non-spell attacks on a 3+. Note that it still takes wounds from the Undead rule normally."),
    armyRule("Evocation of Death", "At the beginning of each round roll one die and consult this table: 1-2 The unit gets the Rapid rule. 3-4 The unit gets the Resistance rule. 5-6 This unit gets the Flying rule."),
    armyRule("Grasp", "This model may replace all of its claw attacks for a single grasp attack. If the attack hits the target takes one automatic wound. Note that this can’t be ignored by the Armored rule."),
    armyRule("Hunger", "Whenever this unit kills one or more enemy models in melee roll one die. On 6 you may remove one wound marker from this model."),
    armyRule("Infested", "When this unit is killed all units in base contact take 2D6 automatic hits."),
    armyRule("Reliquary", "Whenever this unit is activated all enemy units within 2D6” take D3 automatic hits and all friendly units within 2D6” may ignore wounds on 6+ until the end of the round."),
    armyRule("Shriek", "When this unit is activated, target enemy unit within 12” must take a morale test. If failed it takes D3 automatic wounds."),
    armyRule("Soulstrider", "This model may move through other units and obstacles, and if it does the unit it moved through takes one automatic hit."),
    armyRule("Unholy Lodestone", "Friendly wizards within 6” that cast Nehek’s Invocation may re-roll one die to determine restoration."),
    armyRule("Undead", "This unit has the Fear special rule. Whenever this unit loses melee it does not take a morale test, but instead takes as many wounds as the difference it lost melee by."),
    armyRule("Vigor", "All friendly units within 6” get the Rapid rule."),
  ],
  psychicPowers: [
    power("Raise Dead", 7, "Place a unit for 2D6+3 Zombies anywhere within 18”."),
    power("Nehek’s Invocation", 7, "This spell targets all friendly units within 6”. Zombie units restore 3D6 models, Skeleton Warriors restore 2D6, Crypt Ghouls restore D6 and Grave Guard D3. Units with the Tough rule restore D3 wounds."),
    power("Macabre Danse", 7, "Target friendly unit within 12” gets Rapid until the end of the round."),
    power("Hellish Vigor", 7, "Target friendly unit within 12” gets Piercing until the end of the round."),
    power("Curse of Years", 9, "Target enemy unit within 18” must take a Dangerous Terrain test."),
    power("Nagash’s Gaze", 10, "Target enemy unit within 24” takes 2D6 automatic hits."),
  ],
})

export default vampirecounts
