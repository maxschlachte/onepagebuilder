import { faction, customWeapon, gear, rules, armyRule, power, section, group, type UnitInput } from '../helpers'

const units: UnitInput[] = [
    { name: "Glade Captain", size: 1, quality: "4+", equipment: [customWeapon("Longbow", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Heavy Sword", { range: null, attacks: "3", rules: rules("") })], special: "Arrow of Kurnous, Hero, Stalker, Strider, Tough(3)", upgrades: "A", cost: 50 },
    { name: "Spellsinger", size: 1, quality: "4+", equipment: [customWeapon("Light Sword", { range: null, attacks: "1", rules: rules("") })], special: "Blessing, Hero, Stalker, Strider, Tough(3), Wizard(1)", upgrades: "B", cost: 50 },
    { name: "Branchwraith", size: 1, quality: "4+", equipment: [customWeapon("Heavy Claws", { range: null, attacks: "3", rules: rules("") })], special: "Blessing, Fear, Furious, Hero, Strider, Tough(3), Wizard(1)", upgrades: "-", cost: 55 },
    { name: "Waystalker", size: 1, quality: "4+", equipment: [customWeapon("Longbow", { range: 30, attacks: "1", rules: rules("Sniper") }), customWeapon("Medium Sword", { range: null, attacks: "2", rules: rules("") })], special: "Hawk-eyed, Hero, Scout, Stalker, Strider, Tough(3)", upgrades: "-", cost: 70 },
    { name: "Shadowdancer", size: 1, quality: "3+", equipment: [customWeapon("Master Sword", { range: null, attacks: "4", rules: rules("") })], special: "Dancer, Fearless, Hero, Stalker, Strider, Tough(3)", upgrades: "C", cost: 55 },
    { name: "Treeman Ancient", size: 1, quality: "3+", equipment: [gear("Tree Whack"), customWeapon("Heavy Claws", { range: null, attacks: "3", rules: rules("") })], special: "Armored, Blessing, Fear, Fearless, Impact(D6), Strider, Tough(6), Wizard(2)", upgrades: "F, G", cost: 145 },
    { name: "Dryads", size: 10, quality: "4+", equipment: [customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Fear, Furious, Strider", upgrades: "-", cost: 180 },
    { name: "Eternal Guard", size: 10, quality: "3+", equipment: [customWeapon("Light Spears", { range: null, attacks: "1", rules: rules("") })], special: "Fearless, Stalker, Strider", upgrades: "E", cost: 215 },
    { name: "Wardancers", size: 10, quality: "3+", equipment: [customWeapon("Light Spears", { range: null, attacks: "1", rules: rules("") })], special: "Dancer, Fearless, Stalker, Strider", upgrades: "E, H", cost: 255 },
    { name: "Wildwood Rangers", size: 10, quality: "3+", equipment: [customWeapon("Light Maces", { range: null, attacks: "1", rules: rules("Piercing, Poison") })], special: "Fearless, Guardian, Stalker, Strider", upgrades: "E", cost: 265 },
    { name: "Glade Guard", size: 5, quality: "4+", equipment: [customWeapon("Longbows", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Stalker, Strider", upgrades: "D, E", cost: 110 },
    { name: "Deepwood Scouts", size: 5, quality: "4+", equipment: [customWeapon("Longbows", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("") })], special: "Scout, Stalker, Strider", upgrades: "D, E", cost: 125 },
    { name: "Waywatchers", size: 5, quality: "4+", equipment: [customWeapon("Longbows", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Medium Swords", { range: null, attacks: "2", rules: rules("") })], special: "Hawk-eyed, Scout, Stalker, Strider", upgrades: "-", cost: 195 },
    { name: "Wild Riders", size: 5, quality: "3+", equipment: [customWeapon("Light Spears", { range: null, attacks: "1", rules: rules("") })], special: "Fast, Fear, Furious, Nimble, Stalker, Strider", upgrades: "E", cost: 150 },
    { name: "Glade Riders", size: 5, quality: "4+", equipment: [customWeapon("Longbows", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Light Spears", { range: null, attacks: "1", rules: rules("") })], special: "Ambush, Fast, Nimble, Stalker, Strider", upgrades: "D, E", cost: 155 },
    { name: "Sisters of the Thorn", size: 5, quality: "4+", equipment: [customWeapon("Throwing Weapons", { range: 12, attacks: "1", rules: rules("Poison") }), customWeapon("Light Swords", { range: null, attacks: "1", rules: rules("Poison") })], special: "Armored, Deepwood Coven, Fast, Nimble, Stalker, Strider", upgrades: "E", cost: 175 },
    { name: "Great Eagles", size: 3, quality: "3+", equipment: [customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("") })], special: "Flying, Nimble, Impact(1), Tough(3)", upgrades: "-", cost: 125 },
    { name: "Tree Kin", size: 3, quality: "3+", equipment: [customWeapon("Heavy Claws", { range: null, attacks: "3", rules: rules("") })], special: "Armored, Fear, Fearless, Impact(1), Strider, Tough(3)", upgrades: "-", cost: 175 },
    { name: "Warhawk Riders", size: 3, quality: "4+", equipment: [customWeapon("Longbows", { range: 30, attacks: "1", rules: rules("") }), customWeapon("Light Spears", { range: null, attacks: "1", rules: rules("") }), customWeapon("Medium Claws", { range: null, attacks: "2", rules: rules("Piercing") })], special: "Fast, Flying, Furious, Impact(1), Nimble, Predator’s Descent, Stalker, Tough(3)", upgrades: "-", cost: 200 },
    { name: "Treeman", size: 1, quality: "3+", equipment: [gear("Tree Whack"), customWeapon("Force Claws", { range: null, attacks: "5", rules: rules("") })], special: "Armored, Fear, Fearless, Impact(D6), Strider, Tough(6)", upgrades: "G", cost: 120 },
]

export const woodelves = faction({
  id: "wood-elves",
  name: "Wood Elves",
  system: "system-fantasy",
  units,
  upgradeGroups: [
    group("A", [
      section("Replace Heavy Sword:", 'one', [
        { label: "Master Sword", cost: 5, addEquipment: [customWeapon("Master Sword", { range: null, attacks: '4', rules: rules('') })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Spear", cost: 5, addEquipment: [customWeapon("Heavy Spear", { range: null, attacks: '3', rules: rules('') })], removeEquipment: ["Heavy Sword"] },
        { label: "Heavy Mace", cost: 15, addEquipment: [customWeapon("Heavy Mace", { range: null, attacks: '3', rules: rules("Piercing, Poison") })], removeEquipment: ["Heavy Sword"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Elven Steed", cost: 10, addEquipment: [gear("Elven Steed")] },
        { label: "Great Eagle", cost: 35, addEquipment: [gear("Great Eagle")] },
        { label: "Great Stag", cost: 40, addEquipment: [gear("Great Stag")] },
        { label: "Forest Dragon", cost: 120, addEquipment: [gear("Forest Dragon")] }
      ])
    ]),
    group("B", [
      section("Equip with:", 'any', [
        { label: "Longbow", cost: 10, addEquipment: [customWeapon("Longbow", { range: 30, attacks: '1', rules: rules('') })] }
      ]),
      section("Upgrade Wizard(1):", 'any', [
        { label: "Wizard(2)", cost: 10, adds: ["Wizard(2)"] }
      ]),
      section("Mount on:", 'any', [
        { label: "Elven Steed", cost: 10, addEquipment: [gear("Elven Steed")] },
        { label: "Great Eagle", cost: 35, addEquipment: [gear("Great Eagle")] },
        { label: "Unicorn", cost: 50, addEquipment: [gear("Unicorn")] }
      ])
    ]),
    group("C", [
      section("Upgrade with:", 'any', [
        { label: "Wizard(1), Blessing", cost: 25, adds: ["Wizard(1)", "Blessing"] }
      ])
    ]),
    group("D", [
      section("Upgrade all Longbows with one:", 'one', [
        { label: "Trueflight Arrows", cost: 5, adds: ["Ignores Cover"] },
        { label: "Skyfire Shot", cost: 15, adds: ["Rapid"] },
        { label: "Hagbane Tips", cost: 15, adds: ["Poison"] },
        { label: "Arcane Bodkins", cost: 25, adds: ["Piercing"] },
        // "+1 Attack" is not a named rule anywhere in the source (no Common Special Rules entry, no Wood Elves army rule defines it standalone — it only appears as a sub-choice inside "Dancer"/"Hawk-eyed"'s own text) so this reference is left as best-effort and will not resolve against the glossary.
        { label: "Swiftshiver Shards", cost: 50, adds: ["+1 Attack"] }
      ])
    ]),
    group("E", [
      section("Upgrade with:", 'any', [
        { label: "Sergeant", cost: 5, addEquipment: [gear("Sergeant", { rules: rules("Sergeant") })] },
        { label: "Musician", cost: 10, addEquipment: [gear("Musician", { rules: rules("Musician") })] },
        { label: "Standard", cost: 10, addEquipment: [gear("Standard", { rules: rules("Standard") })] }
      ])
    ]),
    group("F", [
      section("Upgrade Wizard(2):", 'any', [
        { label: "Wizard(3)", cost: 10, adds: ["Wizard(3)"] }
      ])
    ]),
    group("G", [
      section("Upgrade with:", 'any', [
        { label: "Strangleroots", cost: 20, addEquipment: [customWeapon("Strangleroots", { range: 12, attacks: "D6+1", rules: rules("") })] }
      ])
    ]),
    group("H", [
      section("Replace all Light Spears:", 'one', [
        { label: "Medium Swords", cost: 25, addEquipment: [customWeapon("Medium Swords", { range: null, attacks: '2', rules: rules('') })], removeEquipment: ["Light Spears"] }
      ])
    ])
  ],
  armyRules: [
    armyRule("Woodland Ambush", "When using this army you may deploy additional forests which count as Difficult Terrain and Cover within 24” of your table edge. You may either deploy one forest up to 10”x10” in size, or two forests up to 5”x10” in size each."),
    armyRule("Ambush", "You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit on the table touching any table edge over 6” away from enemy units. If the unit has not arrived by the last round it arrives automatically."),
    armyRule("Arrow of Kurnous", "After both armies have been deployed but before the first turn begins, if an enemy hero is within 36” and line of sight of this model it takes one automatic hit with Piercing."),
    armyRule("Blessing", "The wizard may re-roll two dice when casting spells as long as it is in a forest."),
    armyRule("Dancer", "Whenever this unit fights in close combat you must choose one Dance, and all models in the unit gain its benefits: Whirling Death (Piercing); Storm of Blades (+1 Attack); Shadow’s Coil (Armored); Woven Mist (+1 when calculating results)."),
    armyRule("Deepwood Coven", "This unit counts as having the Wizard(2) special rule, however only one model may cast spells with it per round."),
    armyRule("Guardian", "This model has +1 Attack in Melee when fighting against units with the Fear special rule."),
    armyRule("Hawk-eyed", "Whenever this unit shoots you must choose one Technique, and all models in the unit gain its benefits: Fast Shot (+1 Attack); Aimed Shot (Piercing)."),
    armyRule("Impale", "This unit gets Piercing in Melee when using Charge actions."),
    armyRule("Predator’s Descent", "This unit gets Deadly claw attacks when using Charge actions."),
    armyRule("Stalker", "This model may re-roll any failed hits twice as long as it is in a forest, and if it has Rapid it may re-roll three times."),
    armyRule("Tree Whack", "This model may replace all of its claw attacks for a single tree whack attack. Roll one die, on 4+ target model takes D6 automatic wounds. Note that this can’t be ignored by the Armored rule."),
  ],
  psychicPowers: [
    power("Apotheosis", 6, "Target friendly model within 18” immediately removes one wound marker."),
    power("Drain Magic", 9, "Target unit within 18” loses all spell effects with “until the end of the round”."),
    power("Shroud of Despair", 10, "All enemy units within 12” must re-roll successful morale tests until the end of the round."),
    power("Bladewind", 10, "Target enemy unit within 24” must take as many Quality tests as models, and it takes one automatic hit for each failed test."),
    power("Tempest", 11, "Target enemy unit within 30” takes D6+3 automatic hits."),
    power("Word of Pain", 13, "Target enemy unit within 24” must re-roll successful shooting and melee attacks until the end of the round."),
  ],
})

export default woodelves
