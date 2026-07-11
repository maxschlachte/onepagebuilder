// Necrons — transcribed from the rulebook PDF (page 11),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, rules, section, weapon } from './helpers'

export const necrons = faction({
  id: 'necrons',
  name: 'Necrons',
  units: [
    { name: 'Necron Lord', size: 1, quality: '3+', equipment: [customWeapon('Staff of Light', { range: 12, attacks: '3' }), meleeWeapon('Medium', 'CCW')], special: 'Hero, Robot, Tough(3)', upgrades: 'A', cost: 55 },
    { name: 'Command Barge', size: 1, quality: '3+', equipment: [customWeapon('Tesla Cannon', { range: 24, attacks: '2', rules: rules('Piercing, Tesla') }), customWeapon('Staff of Light', { range: 12, attacks: '3' }), meleeWeapon('Heavy', 'CCW')], special: 'Fast, Fearless, Hero, Resilient, Robot, Strider, Tough(6), Vehicle', upgrades: 'A, C', cost: 150 },
    { name: 'Destroyer Lord', size: 1, quality: '3+', equipment: [customWeapon('Staff of Light', { range: 12, attacks: '3' }), meleeWeapon('Heavy', 'CCW')], special: 'Armored, Deep Strike, Hero, Flying, Robot, Tough(3)', upgrades: 'A', cost: 75 },
    { name: 'C’tan Shard', size: 1, quality: '2+', equipment: [meleeWeapon('Master', 'Powersword')], special: 'Armored, Deep Strike, Fear, Fearless, Flying, Necrodermis, Impact(D3), Tough(6)', upgrades: 'J', cost: 145 },
    { name: 'Cryptek', size: 1, quality: '3+', equipment: [customWeapon('Staff of Light', { range: 12, attacks: '3' }), meleeWeapon('Light', 'CCW')], special: 'Hero, Robot, Technomancer, Tough(3)', upgrades: 'A, I', cost: 65 },
    { name: 'Necron Warriors', size: 10, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Rending') })], special: 'Robot', upgrades: '-', cost: 250 },
    { name: 'Immortals', size: 5, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Tesla') })], special: 'Robot', upgrades: 'B', cost: 120 },
    { name: 'Lychguard', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords', rules: rules('Rending') })], special: 'Robot', upgrades: 'D', cost: 130 },
    { name: 'Flayed Ones', size: 5, quality: '3+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws', rules: rules('Piercing') })], special: 'Deep Strike, Fear, Robot, Scout', upgrades: '-', cost: 185 },
    { name: 'Praetorians', size: 5, quality: '3+', equipment: [customWeapon('Rods of Covenant', { range: 12, attacks: '1' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Armored, Fearless, Robot', upgrades: 'E', cost: 140 },
    { name: 'Deathmarks', size: 5, quality: '3+', equipment: [customWeapon('Synaptic Disintegrators', { range: 24, attacks: '1', rules: rules('Piercing, Sniper') })], special: 'Deep Strike, Hyperspace Hunter, Robot', upgrades: '-', cost: 245 },
    { name: 'Scarab Swarms', size: 3, quality: '6+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws', rules: rules('Rending') })], special: 'Fearless, Tough(3)', upgrades: '-', cost: 70 },
    { name: 'Tomb Blades', size: 3, quality: '3+', equipment: [linked(weapon('assault-rifle', { rules: rules('Tesla') }), { label: 'Linked Assault Rifles' })], special: 'Fast, Robot, Strider', upgrades: 'K', cost: 100 },
    { name: 'Wraiths', size: 3, quality: '3+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing, Rending') })], special: 'Fast, Fearless, Flying, Robot, Tough(3)', upgrades: 'G', cost: 205 },
    { name: 'Destroyers', size: 3, quality: '3+', equipment: [customWeapon('Gauss Cannons', { range: 24, attacks: '2', rules: rules('Rending') })], special: 'Armored, Deep Strike, Flying, Robot, Tough(3)', upgrades: 'H', cost: 225 },
    { name: 'Spyder', size: 1, quality: '4+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Piercing') })], special: 'Armored, Fear, Hive, Impact(D3), Tough(3)', upgrades: 'F', cost: 125 },
    { name: 'Stalker', size: 1, quality: '3+', equipment: [customWeapon('Heat Ray', { range: 24, attacks: '3', rules: rules('Piercing') }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Armored, Impact(D3), Resilient, Tough(6)', upgrades: 'L', cost: 135 },
    { name: 'Ghost Ark', size: 1, quality: '3+', equipment: [customWeapon('Gauss Flayer Array', { range: 24, attacks: '5', rules: rules('Rending') })], special: 'Resilient, Tough(6), Transport(11), Vehicle', upgrades: '-', cost: 155 },
    { name: 'Annihilation Barge', size: 1, quality: '3+', equipment: [customWeapon('Gauss Cannon', { range: 24, attacks: '2', rules: rules('Rending') }), customWeapon('Linked Tesla Destructor', { range: 24, attacks: '4', rules: rules('Piercing, Tesla, Linked') })], special: 'Resilient, Strider, Tough(6), Vehicle', upgrades: 'C', cost: 175 },
    { name: 'Doomsday Ark', size: 1, quality: '3+', equipment: [customWeapon('Doomsday Cannon', { range: 48, attacks: '9', rules: rules('Piercing, Rending') }), customWeapon('Gauss Flayer Array', { range: 24, attacks: '5', rules: rules('Rending') })], special: 'Resilient, Strider, Tough(6), Vehicle', upgrades: '-', cost: 380 },
    { name: 'Monolith', size: 1, quality: '3+', equipment: [customWeapon('Gauss Flux Arc', { range: 24, attacks: '3', rules: rules('Rending') }, { count: 4, label: '4x Gauss Flux Arc' }), customWeapon('Particle Whip', { range: 24, attacks: '9', rules: rules('Piercing') })], special: 'Deep Strike, Resilient, Strider, Tough(9), Transport(21), Vehicle', upgrades: '-', cost: 400 },
  ],
  upgradeGroups: [
    group('A', [
      section('Take up to two', 'upToTwo', [
        { label: 'Fabricator Claw Array', cost: 5, adds: ['Fabricator Claw Array'] },
        { label: 'Mindshackle Scarabs', cost: 5, adds: ['Mindshackle Scarabs'] },
        // Ignores Cover has no precedent as a unit-wide rule anywhere in the dataset — it's
        // always attached to a specific weapon. A Nebuloscope is a scope for this hero's own
        // Staff of Light, so it re-issues that weapon with the rule attached instead.
        {
          label: 'Nebuloscope (Ignores Cover)',
          cost: 5,
          addEquipment: [customWeapon('Staff of Light', { range: 12, attacks: '3', rules: rules('Ignores Cover') })],
          removeOneEquipment: ['Staff of Light'],
        },
        { label: 'Resurrection Orb', cost: 5, adds: ['Resurrection Orb'] },
        { label: 'Shadowloom', cost: 20, adds: ['Shadowloom'] },
        { label: 'Chronometron', cost: 35, adds: ['Chronometron'] },
        { label: 'Gloom Prism', cost: 95, adds: ['Gloom Prism'] },
      ]),
      section('Take one', 'one', [
        // "Gauntlet of Fire (Flamer)" is skipped: the parenthetical names a weapon
        // *type* rather than a profile, and "Gauntlet of Fire" isn't itself a known
        // global weapon — no resolvable equipment effect to record.
        { label: 'Gauntlet of Fire (Flamer)', cost: 25 },
        { label: 'Tachyon Arrow', cost: 45, addEquipment: [customWeapon('Tachyon Arrow', { range: 48, attacks: '9', rules: rules('Piercing, Single Target, Limited') })] },
      ]),
    ]),
    group('B', [
      section('Replace all Assault Rifles (Tesla)', 'one', [
        {
          label: 'Assault Rifles (Rending)',
          cost: 5,
          addEquipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Rending') })],
          removeEquipment: ['Assault Rifles (Tesla)'],
        },
      ]),
    ]),
    group('C', [
      section('Replace Gauss Cannon', 'one', [
        {
          label: 'Tesla Cannon',
          cost: 5,
          addEquipment: [customWeapon('Tesla Cannon', { range: 24, attacks: '2', rules: rules('Piercing, Tesla') })],
          removeEquipment: ['Gauss Cannon (24”, A2, Rending)'],
        },
      ]),
    ]),
    group('D', [
      section('Replace all Medium Powerswords', 'one', [
        {
          label: 'Medium CCWs, Shields (Armored)',
          cost: 0,
          adds: ['Armored'],
          addEquipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })],
          removeEquipment: ['Medium Powerswords (Rending)'],
        },
      ]),
    ]),
    group('E', [
      section('Replace all Rods of Covenant and Medium CCWs', 'one', [
        {
          label: 'Particle Casters and Medium CCWs (Rending)',
          cost: 40,
          addEquipment: [customWeapon('Particle Casters', { range: 12, attacks: '1', rules: rules('Piercing') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Rending') })],
          removeEquipment: ['Rods of Covenant (12”, A1)', 'Medium CCWs'],
        },
      ]),
    ]),
    group('F', [
      section('Take any', 'any', [
        { label: 'Fabricator Claw Array', cost: 5, adds: ['Fabricator Claw Array'] },
        { label: 'Particle Beamer', cost: 25, addEquipment: [customWeapon('Particle Beamer', { range: 24, attacks: '3', rules: rules('Piercing') })] },
        { label: 'Gloom Prism', cost: 65, adds: ['Gloom Prism'] },
      ]),
    ]),
    group('G', [
      section('Upgrade all models with one', 'one', [
        { label: 'Whip Coils (Fear)', cost: 10, adds: ['Fear'] },
        { label: 'Particle Casters', cost: 20, addEquipment: [customWeapon('Particle Casters', { range: 12, attacks: '1', rules: rules('Piercing') })] },
        {
          label: 'Transdimensional Beamers',
          cost: 20,
          addEquipment: [customWeapon('Transdimensional Beamers', { range: 12, attacks: '1', rules: rules('Rending') })],
        },
      ]),
    ]),
    group('H', [
      section('Replace any Gauss Cannon', 'any', [
        {
          label: 'Heavy Gauss Cannon',
          cost: 85,
          addEquipment: [customWeapon('Heavy Gauss Cannon', { range: 36, attacks: '6', rules: rules('Piercing, Single Target, Rending') })],
          removeOneEquipment: ['Gauss Cannons (24”, A2, Rending)'],
        },
      ]),
    ]),
    group('I', [
      section('Take up to two', 'upToTwo', [
        // Skipped (nested-parenthetical / no-inline-profile naming, same risk as
        // "Gauntlet of Fire" above): Gauntlet of the Conflagrator, Voidreaper.
        { label: 'Gauntlet of the Conflagrator (Heavy Flamer (Limited))', cost: 5 },
        { label: 'Nightmare Shroud', cost: 5, adds: ['Nightmare Shroud'] },
        { label: 'Veil of Darkness', cost: 5, adds: ['Veil of Darkness'] },
        { label: 'Voidreaper (Rending and Piercing in Melee)', cost: 5 },
        { label: 'Solar Staff', cost: 10, addEquipment: [customWeapon('Solar Staff', { range: 12, attacks: '3' })] },
      ]),
    ]),
    group('J', [
      section('Take up to two', 'upToTwo', [
        { label: 'Grand Illusion', cost: 10, adds: ['Grand Illusion'] },
        { label: 'Writhing Worldscape', cost: 10, adds: ['Writhing Worldscape'] },
        { label: 'Gaze of Death', cost: 35, adds: ['Gaze of Death'] },
        { label: 'Dread', cost: 45, adds: ['Dread'] },
      ]),
      section('Take one', 'one', [
        {
          label: 'Transdimensional Thunderbolt',
          cost: 85,
          addEquipment: [customWeapon('Transdimensional Thunderbolt', { range: 24, attacks: '6', rules: rules('Piercing, Single Target, Tesla') })],
        },
        { label: 'Time’s Arrow', cost: 115, addEquipment: [customWeapon('Time’s Arrow', { range: 24, attacks: '9', rules: rules('Piercing, Single Target') })] },
        { label: 'Antimatter Meteor', cost: 135, addEquipment: [customWeapon('Antimatter Meteor', { range: 24, attacks: '9', rules: rules('Piercing') })] },
        {
          label: 'Cosmic Fire',
          cost: 150,
          addEquipment: [customWeapon('Cosmic Fire', { range: 24, attacks: '9', rules: rules('Piercing, Ignores Cover') })],
        },
        { label: 'Seismic Assault', cost: 150, addEquipment: [customWeapon('Seismic Assault', { range: 24, attacks: '10', rules: rules('Piercing') })] },
        {
          label: 'Sky of Falling Stars',
          cost: 340,
          addEquipment: [customWeapon('Sky of Falling Stars', { range: 24, attacks: '18', rules: rules('Piercing, Indirect') })],
        },
      ]),
    ]),
    group('K', [
      section('Replace all Assault Rifles (Tesla)', 'one', [
        {
          label: 'Linked Assault Rifles (Rending)',
          cost: 5,
          addEquipment: [linked(weapon('assault-rifle', { rules: rules('Rending') }), { label: 'Linked Assault Rifles' })],
          removeEquipment: ['Linked Assault Rifles (Tesla)'],
        },
        {
          label: 'Particle Beamers',
          cost: 70,
          addEquipment: [customWeapon('Particle Beamers', { range: 24, attacks: '3', rules: rules('Piercing') })],
          removeEquipment: ['Linked Assault Rifles (Tesla)'],
        },
      ]),
      section('Equip all models with one', 'one', [
        { label: 'Shadowlooms', cost: 5, adds: ['Shadowloom'] },
        { label: 'Shield Vanes (Armored)', cost: 10, adds: ['Armored'] },
        // Ignores Cover has no precedent as a unit-wide rule anywhere in the dataset — it's
        // always attached to a specific weapon, so this re-issues the unit's Linked Assault
        // Rifles with the rule added, the same way the section above swaps that same weapon.
        {
          label: 'Nebuloscopes (Ignores Cover)',
          cost: 15,
          addEquipment: [linked(weapon('assault-rifle', { rules: rules('Tesla, Ignores Cover') }), { label: 'Linked Assault Rifles' })],
          removeEquipment: ['Linked Assault Rifles (Tesla)'],
        },
      ]),
    ]),
    group('L', [
      section('Replace Heat Ray', 'one', [
        {
          label: 'Particle Shredder',
          cost: 70,
          addEquipment: [customWeapon('Particle Shredder', { range: 24, attacks: '9', rules: rules('Piercing') })],
          removeEquipment: ['Heat Ray (24”, A3p)'],
        },
        {
          label: 'Linked Heavy Gauss Cannon',
          cost: 95,
          addEquipment: [customWeapon('Linked Heavy Gauss Cannon', { range: 36, attacks: '6', rules: rules('Piercing, Single Target, Rending, Linked') })],
          removeEquipment: ['Heat Ray (24”, A3p)'],
        },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Chronometron', 'The Hero and his unit may re-roll all failed blocks.'),
    armyRule('Dread', 'All enemy units within 12” must re-roll successful morale tests.'),
    armyRule('Fabricator Claw Array', 'Once per turn, if this unit is inside or within 2” of a Vehicle, it may try to repair it. Roll one die, on a 4+ the vehicle stops being immobile.'),
    armyRule('Gaze of Death', 'Whenever this unit is activated you may pick one enemy unit within 12” and inflict D3 automatic wounds.'),
    armyRule('Gloom Prism', 'The Hero, his unit and all friendly units within 12” get Fearless.'),
    armyRule('Grand Illusion', 'You may re-deploy D3 units within 12” of this unit after Scouts are deployed.'),
    armyRule('Hive', 'When this unit is activated you may target a friendly Scarab Swarm unit within 6”, add one Scarab Swarm model to it and roll one die. On a 1 this unit takes one automatic wound.'),
    armyRule('Hyperspace Hunter', 'On the round in which this unit arrives from Deep Strike this unit counts as having the Rending special rule when shooting.'),
    armyRule('Mindshackle Scarabs', 'The Hero gets the Fear special rule and enemies must re-roll successful morale tests from it.'),
    armyRule('Necrodermis', 'If this unit is killed any unit within D6” takes as many automatic hits as models in it.'),
    armyRule('Nightmare Shroud', 'Once per game, when this unit is activated, target enemy unit within 18” must take a morale test.'),
    armyRule('Resilient', 'Whenever this unit rolls a Shaken result roll one die, on a 4+ it is ignored.'),
    armyRule('Resurrection Orb', 'Once per game, when this model fails a Regeneration roll, you may re-roll it.'),
    armyRule('Robot', 'This unit has the Regeneration special rule and is Unwieldy in Melee.'),
    armyRule('Shadowloom', 'The Hero and his unit get the Stealth special rule.'),
    armyRule('Technomancer', 'The Hero and his unit may ignore wounds from Regeneration on 4+.'),
    armyRule('Tesla', 'For every 6 rolled when firing this weapon the target takes two additional automatic hits.'),
    armyRule('Veil of Darkness', 'Once per game, when the Hero is activated, he and his unit may immediately Deep Strike anywhere on the table.'),
    armyRule('Writhing Worldscape', 'All enemy units within 6” treat open ground as Difficult Terrain.'),
  ],
  psychicPowers: [],
})
