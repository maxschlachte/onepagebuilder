// Inquisition — transcribed from the rulebook PDF (page 17),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, linked, meleeWeapon, power, rules, section, weapon } from './helpers'

export const inquisition = faction({
  id: 'inquisition',
  name: 'Inquisition',
  units: [
    { name: 'Inquisitor', size: 1, quality: '4+', equipment: [weapon('pistol'), meleeWeapon('Heavy', 'CCW')], special: 'Hero, Tough(3)', upgrades: 'A, B', cost: 30 },
    { name: 'Acolyte', size: 1, quality: '4+', equipment: [weapon('pistol')], special: 'Warband', upgrades: 'A, C', cost: 10 },
    { name: 'Daemonhost', size: 1, quality: '4+', equipment: [meleeWeapon('Light', 'CCW')], special: 'Daemonic, Warband', upgrades: '-', cost: 10 },
    { name: 'Servitor', size: 1, quality: '4+', equipment: [meleeWeapon('Light', 'Powerfist')], special: 'Warband', upgrades: 'D', cost: 15 },
    { name: 'Cult Assassin', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'Powersword')], special: 'Warband', upgrades: '-', cost: 15 },
    { name: 'Banisher', size: 1, quality: '4+', equipment: [weapon('pistol'), meleeWeapon('Light', 'Powesword')], special: 'Warband', upgrades: '-', cost: 15 },
    { name: 'Crusader', size: 1, quality: '4+', equipment: [meleeWeapon('Light', 'Powersword')], special: 'Armored, Warband', upgrades: '-', cost: 15 },
    { name: 'Mystic', size: 1, quality: '4+', equipment: [weapon('pistol')], special: 'Beacon, Warband', upgrades: '-', cost: 20 },
    { name: 'Arco Flagellant', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Regeneration, Warband', upgrades: '-', cost: 20 },
    { name: 'Psyker', size: 1, quality: '4+', equipment: [weapon('pistol')], special: 'Psyker(1), Warband', upgrades: '-', cost: 25 },
    { name: 'Jokaero', size: 1, quality: '4+', equipment: [gear('Digital Weapons')], special: 'Warband', upgrades: '-', cost: 45 },
    { name: 'Eversor Assassin', size: 1, quality: '3+', equipment: [customWeapon('Executioner Pistol', { range: 12, attacks: '4', rules: rules('Poison') }), meleeWeapon('Master', 'Powersword')], special: 'Bio-Meltdown, Fearless, Frenzon, Regeneration, Scout, Strider, Tough(3)', upgrades: '-', cost: 100 },
    { name: 'Callidus Assassin', size: 1, quality: '3+', equipment: [customWeapon('Shredder', { range: 12, attacks: '6', rules: rules('Poison') }), meleeWeapon('Force', 'CCW', { rules: rules('Poison, Rending') })], special: 'Fearless, Polymorphine, Strider, Tough(3)', upgrades: '-', cost: 110 },
    { name: 'Culexus Assassin', size: 1, quality: '3+', equipment: [customWeapon('Animus Speculum', { range: 18, attacks: '3' }), meleeWeapon('Master', 'CCW', { rules: rules('Deadly') })], special: 'Etherium, Fear, Fearless, Scout, Strider, Tough(3)', upgrades: '-', cost: 125 },
    { name: 'Vindicare Assassin', size: 1, quality: '3+', equipment: [customWeapon('Exitus Rifle', { range: 48, attacks: '3', rules: rules('Piercing, Single Target, Sniper') }), meleeWeapon('Master', 'CCW')], special: 'Fearless, Scout, Stealth, Strider, Tough(3)', upgrades: '-', cost: 205 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace Pistol', 'one', [
        { label: 'Assault Rifle', cost: 5, addEquipment: [weapon('assault-rifle')], removeOneEquipment: ['Pistol'] },
        { label: 'Linked Assault Rifle', cost: 10, addEquipment: [linked(weapon('assault-rifle'))], removeOneEquipment: ['Pistol'] },
        { label: 'Plasma Pistol', cost: 10, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] },
      ]),
      section(
        'Take one Assault Rifle attachment',
        'one',
        [
          { label: 'Flamer (Limited)', cost: 5, addEquipment: [weapon('flamer', { rules: rules('Limited') })] },
          { label: 'Meltagun (Limited)', cost: 5, addEquipment: [weapon('meltagun', { rules: rules('Limited') })] },
          { label: 'Plasmagun (Limited)', cost: 5, addEquipment: [weapon('plasmagun', { rules: rules('Limited') })] },
        ],
        {
          // Baseline is a Pistol only — an Assault Rifle only exists if produced above.
          requiresOneOfSelected: ['Assault Rifle', 'Linked Assault Rifle'],
        },
      ),
    ]),
    group('B', [
      section('Replace Pistol', 'one', [
        { label: 'Inferno Pistol (6”, A3x)', cost: 5, addEquipment: [customWeapon('Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistol'] },
        { label: 'Pistol (Poison)', cost: 5, addEquipment: [weapon('pistol', { rules: rules('Poison') })], removeOneEquipment: ['Pistol'] },
        { label: 'Hellrifle (36”, A1p, Rending)', cost: 15, addEquipment: [customWeapon('Hellrifle', { range: 36, attacks: '1', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Pistol'] },
        { label: 'Heavy Flamer', cost: 25, addEquipment: [weapon('heavy-flamer')], removeOneEquipment: ['Pistol'] },
        { label: 'Psycannon (24”, A3p, Rending)', cost: 35, addEquipment: [customWeapon('Psycannon', { range: 24, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Pistol'] },
        { label: 'Conversion Beamer (48”, A3p, Rending)', cost: 60, addEquipment: [customWeapon('Conversion Beamer', { range: 48, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Pistol'] },
      ]),
      section('Replace Heavy CCW', 'one', [
        { label: 'Heavy Powersword', cost: 5, addEquipment: [meleeWeapon('Heavy', 'Powersword')], removeOneEquipment: ['Heavy CCW'] },
        { label: 'Heavy Powerfist', cost: 15, addEquipment: [meleeWeapon('Heavy', 'Powerfist')], removeOneEquipment: ['Heavy CCW'] },
      ]),
      section('Upgrade with', 'any', [
        { label: 'Terminator Armor (Deep Strike, Armored)', cost: 10, adds: ['Deep Strike', 'Armored'] },
        { label: '3x Servo Skull', cost: 15 },
        { label: 'Psyker(1)', cost: 15, adds: ['Psyker(1)'] },
      ]),
    ]),
    group('C', [
      section('Replace Pistol', 'one', [
        { label: 'Flamer', cost: 15, addEquipment: [weapon('flamer')], removeOneEquipment: ['Pistol'] },
        { label: 'Meltagun', cost: 20, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Pistol'] },
        { label: 'Plasmagun', cost: 25, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Pistol'] },
      ]),
      section('Take one', 'one', [
        { label: 'Light Powersword', cost: 5, addEquipment: [meleeWeapon('Light', 'Powersword')] },
        { label: 'Storm Shield (Armored)', cost: 5, adds: ['Armored'] },
        { label: 'Light Powerfist', cost: 10, addEquipment: [meleeWeapon('Light', 'Powerfist')] },
      ]),
    ]),
    group('D', [
      section('Take one', 'one', [
        { label: 'Machinegun', cost: 25, addEquipment: [weapon('machinegun')] },
        { label: 'Plasma Cannon', cost: 40, addEquipment: [weapon('plasma-cannon')] },
        { label: 'Multi-Melta', cost: 45, addEquipment: [weapon('multi-melta')] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Beacon', 'Friendly units that Deep Strike fully within 6” of this unit don’t scatter.'),
    armyRule('Bio-Meltdown', 'When this unit is killed all units within 3” take D6 automatic hits.'),
    armyRule('Daemonic', 'Whenever this model is activated roll one die: 1-2 Gets the Piercing rule; 3-4 Gets the Rending rule; 5-6 Gets the Regeneration rule.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Digital Weapons', 'Whenever this unit is activated it may use one of the following weapons: Heavy Flamer; Multi-Melta.'),
    armyRule('Etherium', 'Enemy units attacking this model in melee or shooting only hit on rolls of 6.'),
    armyRule('Frenzon', 'This model has +3 Attacks in melee when using Assault actions.'),
    armyRule('Polymorphine', 'This model counts as having the Scout special rule, but may be deployed up to 1” away from enemy units.'),
    armyRule('Servo-Skull', 'This model may be placed anywhere on the table outside of the enemy deployment zone before deploying either force. The model counts as having the Beacon rule and enemy scouts may not deploy within 12” of it. If an enemy unit moves within 6” of this model it is removed from the game.'),
    armyRule('Warband', 'You may deploy up to 10 models with this rule together to form a single unit.'),
  ],
  psychicPowers: [
    power('Warp Speed', 5, 'The psyker gets +3A in Melee until the end of the round.'),
    power('Telekine Dome', 6, 'The psyker and his unit count as being in Cover until the end of the round.'),
    power('Flame Breath', 7, 'Target enemy unit within 12” takes D6 automatic hits.'),
    power('Banishment', 7, 'Target enemy unit within 12” must re-roll blocks until the end of the round.'),
    power('Prescience', 7, 'Target friendly unit within 12” gets Linked until the end of the round.'),
    power('Psychic Shriek', 7, 'Target enemy unit within 18” must take a morale test. If failed the unit takes D3 automatic wounds.'),
  ],
})
