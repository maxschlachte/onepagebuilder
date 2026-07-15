import { faction, customWeapon, weaponFantasy, meleeWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Prince", size: 1, quality: "4+", equipment: [meleeWeapon('Master', 'Sword', { key: 'master-sword', label: "Master Sword" })], special: "Hero, Prowess, Tough(3)", upgrades: "A", cost: 35 },
    { name: "Mage", size: 1, quality: "4+", equipment: [meleeWeapon('Light', 'Sword', { key: 'light-sword', label: "Light Sword" })], special: "Blessing, Prowess, Tough(3), Wizard(1)", upgrades: "B", cost: 45 },
    { name: "Spearmen", size: 10, quality: "4+", equipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], special: "Prowess", upgrades: "C", cost: 120 },
    { name: "Phoenix Guard", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Halberd', { key: 'light-halberd', label: "Light Halberds" })], special: "Armored, Fear, Prowess", upgrades: "C", cost: 225 },
    { name: "White Lions", size: 10, quality: "3+", equipment: [meleeWeapon('Light', 'Mace', { key: 'light-mace', label: "Light Maces" })], special: "Deflect, Fearless, Prowess, Strider", upgrades: "C", cost: 265 },
    { name: "Swordmasters", size: 10, quality: "3+", equipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Maces" })], special: "Deflect, Prowess", upgrades: "C", cost: 310 },
    { name: "Lothern Sea Guard", size: 5, quality: "4+", equipment: [weaponFantasy('bow', { label: "Bows" }), meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], special: "Prowess", upgrades: "C", cost: 100 },
    { name: "Archers", size: 5, quality: "4+", equipment: [weaponFantasy('longbow', { label: "Longbows" })], special: "Prowess", upgrades: "C", cost: 100 },
    { name: "Ellyrian Reavers", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Spears', { key: 'light-spear', label: "Light Spears" })], special: "Fast, Prowess, Nimble", upgrades: "C, F", cost: 85 },
    { name: "Silver Helms", size: 5, quality: "4+", equipment: [meleeWeapon('Light', 'Lance', { key: 'light-lance', label: "Light Lances" })], special: "Armored, Prowess, Nimble", upgrades: "C", cost: 90 },
    { name: "Dragon Princes", size: 5, quality: "3+", equipment: [meleeWeapon('Medium', 'Lance', { key: 'medium-lance', label: "Medium Lances" })], special: "Armored, Prowess, Nimble", upgrades: "C", cost: 130 },
    { name: "Great Eagles", size: 3, quality: "3+", equipment: [meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Flying, Impact(1), Nimble, Tough(3)", upgrades: "D", cost: 125 },
    { name: "Sisters of Avelorn", size: 5, quality: "3+", equipment: [weaponFantasy('bow', { label: "Bows", rules: rules("Piercing") })], special: "Prowess", upgrades: "-", cost: 140 },
    { name: "Shadow Warriors", size: 5, quality: "3+", equipment: [weaponFantasy('longbow', { label: "Longbows" })], special: "Prowess, Scout", upgrades: "-", cost: 150 },
    { name: "Frostheart Phoenix", size: 1, quality: "3+", equipment: [meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Blizzard Aura, Flying, Impact(D6), Tough(6)", upgrades: "-", cost: 110 },
    { name: "Flamespyre Phoenix", size: 1, quality: "3+", equipment: [meleeWeapon('Heavy', 'Claws', { key: 'heavy-claw', label: "Heavy Claws" })], special: "Armored, Fear, Flying, Impact(D6), Phoenix, Tough(6), Wake of Fire", upgrades: "-", cost: 165 },
    { name: "Lion Chariot", size: 1, quality: "4+", equipment: [meleeWeapon('Medium', 'Mace', { key: 'medium-mace', label: "Medium Mace" }), meleeWeapon('Master', 'Claws', { key: 'master-claw', label: "Master Claws" })], special: "Armored, Fast, Fear, Fearless, Impact(D6), Prowess, Tough(3)", upgrades: "-", cost: 90 },
    { name: "Lothern Skycutter", size: 1, quality: "4+", equipment: [weaponFantasy('bow', { count: 3 }), meleeWeapon('Heavy', 'Spear', { key: 'heavy-spear', label: "Heavy Spear" }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Flying, Impact(D6), Prowess, Tough(3)", upgrades: "E", cost: 90 },
    { name: "Tiranoc Chariots", size: 3, quality: "4+", equipment: [weaponFantasy('longbow', { count: 2 }), meleeWeapon('Medium', 'Spear', { key: 'medium-spear', label: "Medium Spear" }), meleeWeapon('Medium', 'Claws', { key: 'medium-claw', label: "Medium Claws" })], special: "Armored, Fast, Impact(D6), Prowess, Tough(3)", upgrades: "-", cost: 235 },
    { name: "Bolt Thrower", size: 1, quality: "4+", equipment: [customWeapon("Rapid Bolt Thrower", { range: 48, attacks: "3", rules: rules("Piercing, Single Target, Rapid") })], special: "Armored, Prowess, Ordnance, Tough(3)", upgrades: "-", cost: 105 },
]

export const highelves = faction({
  id: "high-elves",
  name: "High Elves",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("G", [
      section("Upgrade with:", 'any', [
        { label: "Swiftsense", cost: 5, adds: ["Rapid"] },
        { label: "Shredding Talons", cost: 5, adds: ["Piercing"] }
      ])
    ]),
    group("A", [
      section("Upgrade with:", 'any', [
        { label: "Force Sword", cost: 5, addEquipment: [meleeWeapon('Force', 'Sword', { key: 'force-sword', label: "Force Sword" })] },
        { label: "Master Spear", cost: 5, addEquipment: [meleeWeapon('Master', 'Spear', { key: 'master-spear', label: "Master Spear" })] },
        { label: "Master Halberd", cost: 5, addEquipment: [meleeWeapon('Master', 'Halberd', { key: 'master-halberd', label: "Master Halberd" })] },
        { label: "Master Lance (Mounted Only)", cost: 5, addEquipment: [meleeWeapon('Master', 'Lance', { key: 'master-lance', label: "Master Lance", rules: rules('Mounted Only') })] },
        { label: "Master Mace", cost: 20, addEquipment: [meleeWeapon('Master', 'Mace', { key: 'master-mace', label: "Master Mace" })] }
      ]),
      section("Equip with one:", 'one', [
        { label: "Longbow", cost: 10, addEquipment: [weaponFantasy('longbow')] },
        { label: "Heavy Armor", cost: 10, adds: ["Armored"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Elven Steed", cost: 10, addEquipment: [gear("Elven Steed")] },
        { label: "Great Eagle", cost: 35, addEquipment: [gear("Great Eagle")] },
        { label: "Griffon", cost: 70, addEquipment: [gear("Griffon")] },
        { label: "Frostheart Phoenix", cost: 110, addEquipment: [gear("Frostheart Phoenix")] },
        { label: "Dragon of Ulthuan", cost: 120, addEquipment: [gear("Dragon of Ulthuan")] },
        { label: "Flamespyre Phoenix", cost: 160, addEquipment: [gear("Flamespyre Phoenix")] }
      ])
    ]),
    group("H", [
      section("Upgrade with:", 'any', [
        { label: "Swooping Strike", cost: 5, adds: ["Furious"] },
        { label: "Swiftsense", cost: 5, adds: ["Rapid"] }
      ])
    ]),
    group("B", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(2)", cost: 10, adds: ["Wizard(2)"] },
        { label: "Wizard(3)", cost: 20, adds: ["Wizard(3)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Elven Steed", cost: 10, addEquipment: [gear("Elven Steed")] },
        { label: "Great Eagle", cost: 35, addEquipment: [gear("Great Eagle")] },
        { label: "Tiranoc Chariot", cost: 60, addEquipment: [customWeapon("Tiranoc Chariot", { range: null, attacks: '1', rules: rules('') })] },
        { label: "Dragon of Ulthuan", cost: 120, addEquipment: [gear("Dragon of Ulthuan")] }
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
        { label: "Swiftsense", cost: 5, adds: ["Rapid"] },
        { label: "Shredding Talons", cost: 10, adds: ["Piercing"] }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Eagle Bolt Thrower", cost: 30, addEquipment: [customWeapon("Eagle Bolt Thrower", { range: 24, attacks: "3", rules: rules("Piercing, Single Target") })] }
      ])
    ]),
    group("F", [
      section("Upgrade with:", 'any', [
        { label: "Bows and Light Swords", cost: 30, addEquipment: [customWeapon("Bows and Light Swords", { range: null, attacks: '1', rules: rules('') })] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Blessing", "The wizard may re-roll one die when casting spells."),
    armyRule("Blizzard Aura", "Enemies fighting in melee against this unit get the Unwieldy special rule."),
    armyRule("Deflect", "This unit may re-roll failed blocks against shooting attacks."),
    armyRule("Prowess", "This model may re-roll any failed hits, and if it has Rapid it may re-roll twice."),
    armyRule("Phoenix", "Whenever this model would be killed roll one die, on a 5+ it is not killed and immediately restores D3+2 wounds instead."),
    armyRule("Wake of Fire", "This unit may deal D6+4 hits to one enemy unit it passed over each round."),
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

export default highelves
