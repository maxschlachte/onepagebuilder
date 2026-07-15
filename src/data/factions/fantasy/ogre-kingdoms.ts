import { faction, customWeapon, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Tyrant", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Fear, Hero, Impact(D3), Tough(6)", upgrades: "A, C", cost: 75 },
    { name: "Bruiser", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Fear, Hero, Impact(D3), Tough(3)", upgrades: "A, C", cost: 40 },
    { name: "Hunter", size: 1, quality: "4+", equipment: [customWeapon("Great Spear", { range: 12, attacks: "1", rules: rules("Piercing") }), meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Fear, Hero, Impact(D3), Loner, Tough(3)", upgrades: "B, C", cost: 45 },
    { name: "Butcher", size: 1, quality: "4+", equipment: [meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Fear, Impact(D3), Immune, Tough(3), Wizard(1)", upgrades: "D", cost: 70 },
    { name: "Firebelly", size: 1, quality: "4+", equipment: [gear("Fiery Breath", { rules: rules("Fiery Breath") }), meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" })], special: "Fear, Impact(D3), Tough(3), Wizard(1)", upgrades: "D", cost: 75 },
    { name: "Gnoblars", size: 10, quality: "6+", equipment: [customWeapon("Throwing Weapons", { range: 12, attacks: "1", rules: rules("") })], special: "-", upgrades: "E, F", cost: 40 },
    { name: "Ogres", size: 6, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })], special: "Fear, Impact(D3), Tough(3)", upgrades: "E, H", cost: 215 },
    { name: "Maneaters", size: 6, quality: "3+", equipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], special: "Experienced, Fear, Impact(D3), Tough(3)", upgrades: "E, I", cost: 330 },
    { name: "Leadbelchers", size: 3, quality: "4+", equipment: [customWeapon("Belchguns", { range: 24, attacks: "D6", rules: rules("Piercing") }), meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" })], special: "Fear, Impact(D3), Tough(3)", upgrades: "E", cost: 205 },
    { name: "Sabretusks", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fast, Fear, Nimble, Tough(3), Vanguard", upgrades: "-", cost: 110 },
    { name: "Mournfangs", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Swords', { key: 'heavy-sword', label: "Heavy Swords" }), meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Fear, Impact(D3), Nimble, Tough(6)", upgrades: "E, J", cost: 205 },
    { name: "Yhetees", size: 3, quality: "4+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Fear, Frost Aura, Impact(1), Tough(3)", upgrades: "-", cost: 115 },
    { name: "Gorger", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws", rules: rules('Deadly') })], special: "Armored, Ambush, Fear, Fearless, Furious, Impact(1), Tough(3)", upgrades: "-", cost: 90 },
    { name: "Giant", size: 1, quality: "4+", equipment: [customWeapon("Giant Attack", { range: null, attacks: "D6", rules: rules("Piercing") })], special: "Armored, Fall Over, Fearless, Impact(D6), Tough(6)", upgrades: "-", cost: 100 },
    { name: "Stonehorn", size: 1, quality: "4+", equipment: [customWeapon("Chaintrap", { range: 12, attacks: "1", rules: rules("Deadly") }), meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" }), meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Furious, Impact(D6), Tough(6), Trample", upgrades: "G", cost: 115 },
    { name: "Thundertusk", size: 1, quality: "4+", equipment: [customWeapon("Frost Sphere", { range: 24, attacks: "3", rules: rules("Piercing, Indirect") }), meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" }), meleeWeapon('Force', 'Claws', { key: 'force-claw', label: "Force Claws", rules: rules('Piercing') })], special: "Armored, Fear, Impact(D6), Numbing Chill, Tough(6)", upgrades: "K", cost: 155 },
    { name: "Scraplauncher", size: 1, quality: "5+", equipment: [customWeapon("Stone Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Indirect, Deadly") }), meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fast, Fear, Impact(D6), Tough(6)", upgrades: "-", cost: 145 },
    { name: "Ironblaster", size: 1, quality: "4+", equipment: [customWeapon("Titan Cannon", { range: 36, attacks: "D3+3", rules: rules("Piercing") }), meleeWeapon('Heavy', 'Sword', { key: 'heavy-sword', label: "Heavy Sword" }), meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fast, Fear, Impact(D6), Tough(6)", upgrades: "-", cost: 155 },
]

export const ogrekingdoms = faction({
  id: "ogre-kingdoms",
  name: "Ogre Kingdoms",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Ogre Pistol", cost: 10, addEquipment: [customWeapon("Ogre Pistol", { range: 24, attacks: "1", rules: rules("Piercing") })] },
        { label: "Ironfist", cost: 20, adds: ["Armored"] }
      ])
    ]),
    group("B", [
      section("Replace Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Master Sword"] }
      ]),
      section("Equip with any:", 'any', [
        { label: "Ironfist", cost: 10, adds: ["Armored"] },
        { label: "Vulture", cost: 10, addEquipment: [customWeapon("Vulture", { range: 36, attacks: "1", rules: rules("Ignores Cover") })] },
        { label: "Harpoon Launcher", cost: 15, addEquipment: [customWeapon("Harpoon Launcher", { range: 36, attacks: "1", rules: rules("Piercing") })] }
      ]),
      section("Mount on:", 'any', [
        { label: "Stonehorn", cost: 95, addEquipment: [gear("Stonehorn")] }
      ])
    ]),
    group("C", [
      section("Upgrade with one:", 'one', [
        { label: "Longstrider", cost: 5, adds: ["Fast"] },
        { label: "Wallcrusher", cost: 5, adds: ["Impact(+1)"] },
        { label: "Brawlergut", cost: 5, adds: ["Piercing", "Impact"] },
        { label: "Giantbreaker", cost: 10, adds: ["Piercing in Melee"] },
        { label: "Mountaineater", cost: 25, adds: ["Tough(+3)"] }
      ])
    ]),
    group("D", [
      section("Replace Heavy Sword:", 'any', [
        { label: "Master Sword", cost: 5, addEquipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Mace", rules: rules('Piercing, Poison') })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Equip with:", 'any', [
        { label: "Ironfist", cost: 10, adds: ["Armored"] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 5, adds: ["Wizard(2)"] },
        { label: "Wizard(3)", cost: 10, adds: ["Wizard(3)"] }
      ], { requiresBaselineRule: ["Wizard(1)"] })
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("F", [
      section("Upgrade all models with:", 'any', [
        { label: "Traps", cost: 45, adds: ["Traps"] }
      ])
    ]),
    group("G", [
      section("Replace Chaintrap:", 'one', [
        { label: "Harpoon Launcher", cost: 0, addEquipment: [customWeapon("Harpoon Launcher", { range: 36, attacks: '1', rules: rules("Piercing") })], removeEquipment: ["Chaintrap"] }
      ])
    ]),
    group("H", [
      section("Replace all Heavy Swords:", 'one', [
        { label: "Master Swords", cost: 20, addEquipment: [meleeWeapon('Master', 'Swords', { key: 'master-sword', label: "Master Swords" })], removeEquipment: ["Heavy Swords"] },
        { label: "Heavy Maces", cost: 80, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces", rules: rules('Piercing, Poison') })], removeEquipment: ["Heavy Swords"] }
      ])
    ]),
    group("I", [
      section("Replace any Master Sword:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })], removeOneEquipment: ["Master Sword"] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace", rules: rules('Piercing, Poison') })], removeOneEquipment: ["Master Sword"] }
      ]),
      section("Equip any model with:", 'any', [
        { label: "Ogre Pistol", cost: 10, addEquipment: [customWeapon("Ogre Pistol", { range: 24, attacks: "1", rules: rules("Piercing") })] }
      ])
    ]),
    group("J", [
      section("Replace all Heavy Swords:", 'one', [
        { label: "Heavy Maces", cost: 40, addEquipment: [meleeWeapon('Heavy', 'Mace', { key: 'heavy-mace', label: "Heavy Maces", rules: rules('Piercing, Poison') })], removeEquipment: ["Heavy Swords"] }
      ])
    ]),
    group("K", [
      section("Upgrade with any:", 'any', [
        { label: "Chaintrap", cost: 10, addEquipment: [customWeapon("Chaintrap", { range: 12, attacks: '1', rules: rules("Deadly") })] },
        { label: "Harpoon Launcher", cost: 15, addEquipment: [customWeapon("Harpoon Launcher", { range: 36, attacks: '1', rules: rules("Piercing") })] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Ambush", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit on the table touching any table edge over 6” away from enemy units. If the unit has not arrived by the last round it arrives automatically."),
    armyRule("Experienced", "At the beginning of the game you may declare all models in this unit to have one of the following special rules: Fearless, Poison in Melee, Scout, Strider, Fast, Vanguard."),
    armyRule("Fall Over", "When the giant is killed all units within 3” take D6p automatic hits."),
    armyRule("Frost Aura", "Enemies fighting melee against this unit get the Unwieldy special rule."),
    armyRule("Immune", "This model ignores the Poison rule."),
    armyRule("Loner", "This hero may only be deployed as part of a Sabretusk Pack unit."),
    armyRule("Numbing Chill", "All enemy units within 6” of this unit get the Unwieldy special rule."),
    armyRule("Trample", "This model may replace all of its melee attacks for a single trample attack when charging. This attack deals 3D3 automatic hits."),
    armyRule("Traps", "Enemy units charging this unit count as having moved through dangerous terrain."),
  ],
  psychicPowers: [
    power("Braingobbler", 6, "Target enemy unit within 18” must immediately take a morale test."),
    power("Bullgorger", 7, "Target friendly unit within 12” gets Piercing rule until the end of the round."),
    power("Toothcracker", 7, "Target friendly unit within 12” gets the Armored rule until the end of the round."),
    power("Trollguts", 7, "Target friendly unit within 12” gets the Regeneration rule until the end of the round."),
    power("Spinemarrow", 7, "Target friendly unit within 12” gets the Fearless special rule."),
    power("Bonecrusher", 11, "Target enemy unit within 18” takes 2D6p automatic hits."),
  ],
})

export default ogrekingdoms
