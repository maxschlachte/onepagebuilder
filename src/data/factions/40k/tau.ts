// Tau — transcribed from the rulebook PDF (page 10),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, linked, meleeWeapon, rules, section, weapon } from '../helpers.ts'

export const tau = faction({
  id: 'tau',
  name: 'Tau',
  units: [
    { name: 'Ethereal', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'CCW')], special: 'Hero, Inspirational, Tough(3)', upgrades: 'A, D', cost: 55 },
    { name: 'XV8 Commander', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Deep Strike, Flying, Hero, Tough(3)', upgrades: 'A, B', cost: 35 },
    { name: 'Cadre Fireblade', size: 1, quality: '5+', equipment: [weapon('rifle'), meleeWeapon('Heavy', 'CCW'), gear('Markerlight')], special: 'Hero, Optics, Tough(3)', upgrades: 'A', cost: 35 },
    { name: 'Kroot Shaper', size: 1, quality: '5+', equipment: [weapon('assault-rifle'), meleeWeapon('Heavy', 'CCW')], special: 'Hero, Scout, Strider, Tough(3)', upgrades: 'J', cost: 25 },
    { name: 'Kroot Carnivores', size: 5, quality: '5+', equipment: [weapon('assault-rifle')], special: 'Scout, Strider', upgrades: 'J', cost: 65 },
    { name: 'Kroot Hounds', size: 3, quality: '5+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Fast, Scout, Strider', upgrades: '-', cost: 65 },
    { name: 'Krootox', size: 1, quality: '5+', equipment: [weapon('autocannon'), meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Piercing') })], special: 'Scout, Strider, Tough(3)', upgrades: '-', cost: 45 },
    { name: 'Vespids', size: 5, quality: '5+', equipment: [weapon('carbine', { label: 'Carbines' })], special: 'Deep Strike, Flying', upgrades: '-', cost: 65 },
    { name: 'Fire Warriors', size: 5, quality: '5+', equipment: [weapon('carbine', { label: 'Carbines' })], special: 'Optics', upgrades: 'A, C, L', cost: 45 },
    { name: 'Pathfinders', size: 5, quality: '5+', equipment: [weapon('carbine', { label: 'Carbines' }), gear('Markerlights')], special: 'Optics, Scout', upgrades: 'A, F', cost: 115 },
    { name: 'Stealth Team', size: 3, quality: '5+', equipment: [customWeapon('Burst Cannons', { range: 18, attacks: '4' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Deep Strike, Flying, Optics, Scout, Stealth', upgrades: 'A, C, E', cost: 95 },
    { name: 'Gun Drone Squad', size: 5, quality: '5+', equipment: [linked(weapon('carbine'), { label: 'Linked Carbines' }), gear('Markerlights')], special: 'Deep Strike, Flying, Optics', upgrades: '-', cost: 130 },
    { name: 'Sniper Drone Team', size: 3, quality: '5+', equipment: [customWeapon('Longshot Rifles', { range: 48, attacks: '1', rules: rules('Piercing') }), gear('Markerlights')], special: 'Controller, Deep Strike, Flying, Optics', upgrades: '-', cost: 115 },
    { name: 'XV8 Crisis Suits', size: 3, quality: '4+', equipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Deep Strike, Flying, Tough(3)', upgrades: 'A, B', cost: 90 },
    { name: 'XV95 Ghostkeel', size: 1, quality: '4+', equipment: [customWeapon('Fusion Collider', { range: 18, attacks: '4', rules: rules('Piercing') }), linked(weapon('flamer')), meleeWeapon('Heavy', 'CCW', { rules: rules('Piercing') }), gear('Drones', { count: 2, rules: rules('Stealth') })], special: 'Deep Strike, Fear, Flying, Impact(D3), Tough(3)', upgrades: 'G', cost: 115 },
    { name: 'XV88 Broadside', size: 1, quality: '4+', equipment: [customWeapon('Linked Heavy Rail Rifle', { range: 48, attacks: '3', rules: rules('Piercing, Single Target, Linked') }), linked(weapon('plasmagun')), meleeWeapon('Medium', 'CCW')], special: 'Armored, Tough(3)', upgrades: 'A, M', cost: 130 },
    { name: 'XV104 Riptide', size: 1, quality: '4+', equipment: [customWeapon('Heavy Burst Cannon', { range: 36, attacks: '12', rules: rules('Piercing, Rending') }), linked(weapon('plasmagun')), meleeWeapon('Heavy', 'CCW', { rules: rules('Piercing') })], special: 'Armored, Deep Strike, Fear, Flying, Impact(D3), Tough(6)', upgrades: 'A, K', cost: 315 },
    { name: 'Piranha', size: 1, quality: '4+', equipment: [customWeapon('Burst Cannon', { range: 18, attacks: '4' }), linked(weapon('carbine'), { count: 2 })], special: 'Armored, Fast, Strider, Tough(3)', upgrades: 'E, H', cost: 65 },
    { name: 'Devilfish', size: 1, quality: '4+', equipment: [customWeapon('Burst Cannon', { range: 18, attacks: '4' }), linked(weapon('carbine'), { count: 2 })], special: 'Strider, Tough(6), Transport(11), Vehicle', upgrades: 'H', cost: 110 },
    { name: 'Hammerhead', size: 1, quality: '4+', equipment: [gear('Seeker Missiles', { count: 6 }), linked(weapon('carbine'), { count: 2 })], special: 'Strider, Tough(6), Vehicle', upgrades: 'H, I', cost: 125 },
    { name: 'Drone', size: 1, quality: '-', equipment: [], special: 'Drone', upgrades: '-', cost: 0 },
    { name: 'Support Turret', size: 1, quality: '-', equipment: [customWeapon('Missile Pod', { range: 36, attacks: '2', rules: rules('Piercing') })], special: 'Optics, Support Turret', upgrades: '-', cost: 0 },
  ],
  upgradeGroups: [
    group('A', [
      section('Take up to two', 'upToTwo', [
        { label: 'Drone (Linked Carbine)', cost: 10, addEquipment: [linked(weapon('carbine', { rules: rules('Drone') }), { label: 'Drone (Linked Carbine)' })] },
        { label: 'Drone (Markerlight)', cost: 15, addEquipment: [gear('Drone', { rules: rules('Markerlight, Drone') })] },
        { label: 'Drone (Shield)', cost: 25, addEquipment: [gear('Drone', { rules: rules('Shield, Drone') })] },
        { label: 'Drone (Missile Pod)', cost: 30, addEquipment: [customWeapon('Drone', { range: 36, attacks: '2', rules: rules('Piercing, Drone') })] },
      ]),
    ]),
    group('B', [
      section('Equip any model with up to three', 'upToThree', [
        { label: 'Flamer', cost: 20, addEquipment: [weapon('flamer')] },
        { label: 'Burst Cannon', cost: 20, addEquipment: [customWeapon('Burst Cannon', { range: 18, attacks: '4' })] },
        { label: 'Cyclic Ion Blaster', cost: 20, addEquipment: [customWeapon('Cyclic Ion Blaster', { range: 18, attacks: '3', rules: rules('Piercing') })] },
        { label: 'Missile Pod', cost: 25, addEquipment: [customWeapon('Missile Pod', { range: 36, attacks: '2', rules: rules('Piercing') })] },
        { label: 'Plasmagun', cost: 25, addEquipment: [weapon('plasmagun')] },
        { label: 'Fusion Blaster', cost: 35, addEquipment: [customWeapon('Fusion Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })] },
        {
          label: 'High Output Burst Cannon',
          cost: 35,
          addEquipment: [customWeapon('High Output Burst Cannon', { range: 18, attacks: '6', rules: rules('Linked') })],
        },
        {
          label: 'Airburst Fragmentation Projector',
          cost: 55,
          addEquipment: [customWeapon('Airburst Fragmentation Projector', { range: 18, attacks: '9', rules: rules('Indirect, Ignores Cover') })],
        },
      ]),
    ]),
    group('C', [
      section('Equip one model with one', 'one', [
        { label: 'Beacon', cost: 10, adds: ['Beacon'] },
        { label: 'Markerlight', cost: 10, addEquipment: [gear('Markerlight', { rules: rules('Markerlight') })] },
      ]),
    ]),
    group('D', [
      section('Replace Heavy CCW', 'one', [
        { label: 'Master CCW', cost: 5, addEquipment: [meleeWeapon('Master', 'CCW')], removeEquipment: ['Heavy CCW'] },
        { label: 'Heavy Powersword', cost: 5, addEquipment: [meleeWeapon('Heavy', 'Powersword')], removeEquipment: ['Heavy CCW'] },
      ]),
    ]),
    group('E', [
      section('Replace one Burst Cannon', 'one', [
        {
          label: 'Fusion Blaster',
          cost: 15,
          addEquipment: [customWeapon('Fusion Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })],
          removeOneEquipment: ['Burst Cannon (18”, A4)'],
        },
      ]),
    ]),
    group('F', [
      section('Replace one Carbine and Markerlight', 'one', [
        {
          label: 'Rail Rifle',
          cost: 0,
          addEquipment: [customWeapon('Rail Rifle', { range: 30, attacks: '1', rules: rules('Piercing') })],
          removeOneEquipment: ['Carbines', 'Markerlights'],
        },
        {
          label: 'Ion Rifle',
          cost: 20,
          addEquipment: [customWeapon('Ion Rifle', { range: 30, attacks: '3', rules: rules('Piercing') })],
          removeOneEquipment: ['Carbines', 'Markerlights'],
        },
      ]),
      section('Take one', 'one', [
        { label: 'Drone (Inhibitor)', cost: 10, addEquipment: [gear('Drone', { rules: rules('Inhibitor, Drone') })] },
        { label: 'Drone (Accelerator)', cost: 10, addEquipment: [gear('Drone', { rules: rules('Accelerator, Drone') })] },
        {
          label: 'Drone (Beacon, Burst Cannon)',
          cost: 30,
          addEquipment: [customWeapon('Drone', { range: 18, attacks: '4', rules: rules('Beacon, Drone') })],
        },
      ]),
    ]),
    group('G', [
      section('Replace Fusion Collider', 'one', [
        {
          label: 'Cyclic Ion Raker',
          cost: 55,
          addEquipment: [customWeapon('Cyclic Ion Raker', { range: 24, attacks: '9', rules: rules('Piercing') })],
          removeEquipment: ['Fusion Collider (18”, A4p)'],
        },
      ]),
      section('Replace Linked Flamer', 'one', [
        {
          label: 'Linked Burst Cannon',
          cost: 0,
          addEquipment: [customWeapon('Linked Burst Cannon', { range: 18, attacks: '4', rules: rules('Linked') })],
          removeEquipment: ['Linked Flamer'],
        },
        {
          label: 'Linked Fusion Blaster',
          cost: 20,
          addEquipment: [customWeapon('Linked Fusion Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target, Linked') })],
          removeEquipment: ['Linked Flamer'],
        },
      ]),
    ]),
    group('H', [
      // Baseline is `2x Linked Carbines` even on size-1 units (Piranha/Devilfish/Hammerhead) —
      // a single-model-multi-copy case (see design.md), so this only adds, never removes.
      section('Replace 2x Linked Carbines', 'one', [
        { label: 'Linked Burst Cannon', cost: 10, addEquipment: [customWeapon('Linked Burst Cannon', { range: 18, attacks: '4', rules: rules('Linked') })] },
        {
          label: 'Linked Smart Missiles',
          cost: 40,
          addEquipment: [customWeapon('Linked Smart Missiles', { range: 30, attacks: '4', rules: rules('Indirect, Linked') })],
        },
      ]),
      section('Take up to two', 'upToTwo', [
        { label: 'Seeker Missile', cost: 10, addEquipment: [gear('Seeker Missile', { rules: rules('Seeker Missile') })] },
        { label: 'Seeker Missile', cost: 10, addEquipment: [gear('Seeker Missile', { rules: rules('Seeker Missile') })] },
      ]),
      section('Upgrade with any', 'any', [
        { label: 'Automated Repair System', cost: 5, adds: ['Automated Repair System'] },
        { label: 'Flachette Discharger', cost: 25, adds: ['Flachette Discharger'] },
        { label: 'Disruption Pod (Tough(+3))', cost: 25, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('I', [
      // Section title names the exact baseline quantity ("6x Seeker Missile" = all of Hammerhead's
      // `6x Seeker Missiles`), so this is a full swap, not a partial "replace one of many".
      section('Replace 6x Seeker Missile', 'one', [
        {
          label: 'Railgun',
          cost: 55,
          addEquipment: [customWeapon('Railgun', { range: 48, attacks: '6', rules: rules('Piercing, Single Target, Rending') })],
          removeEquipment: ['6x Seeker Missiles'],
        },
        {
          label: 'Ion Cannon',
          cost: 110,
          addEquipment: [customWeapon('Ion Cannon', { range: 48, attacks: '9', rules: rules('Piercing') })],
          removeEquipment: ['6x Seeker Missiles'],
        },
      ]),
    ]),
    group('J', [
      section('Replace any Assault Rifle', 'any', [
        {
          label: 'Kroot Rifle',
          cost: 25,
          adds: ['Sniper'],
          addEquipment: [customWeapon('Kroot Rifle', { range: 24, attacks: '1', rules: rules('Piercing, Sniper') })],
          removeOneEquipment: ['Assault Rifle'],
        },
      ]),
    ]),
    group('K', [
      section('Replace Heavy Burst Cannon', 'one', [
        {
          label: 'Ion Accelerator',
          cost: 0,
          addEquipment: [customWeapon('Ion Accelerator', { range: 48, attacks: '9', rules: rules('Piercing, Rending') })],
          removeEquipment: ['Heavy Burst Cannon (36”, A12p, Rending)'],
        },
      ]),
      section('Replace Linked Plasmagun', 'one', [
        {
          label: 'Linked Fusion Blaster',
          cost: 10,
          addEquipment: [customWeapon('Linked Fusion Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target, Linked') })],
          removeEquipment: ['Linked Plasmagun'],
        },
        {
          label: 'Linked Smart Missiles',
          cost: 15,
          addEquipment: [customWeapon('Linked Smart Missiles', { range: 30, attacks: '4', rules: rules('Indirect, Linked') })],
          removeEquipment: ['Linked Plasmagun'],
        },
      ]),
    ]),
    group('L', [
      section('Replace all Carbines', 'one', [
        { label: 'Shotguns', cost: 10, addEquipment: [weapon('shotgun', { label: 'Shotguns' })], removeEquipment: ['Carbines'] },
        { label: 'Rifles', cost: 15, addEquipment: [weapon('rifle', { label: 'Rifles' })], removeEquipment: ['Carbines'] },
      ]),
      section('Take one', 'one', [
        { label: 'Support Turret', cost: 30, addEquipment: [customWeapon('Missile Pod', { range: 36, attacks: '2', rules: rules('Piercing, Support Turret') })] },
      ]),
      section(
        'Replace Missile Pod',
        'one',
        [
          {
            label: 'Smart Missiles',
            cost: 10,
            addEquipment: [customWeapon('Smart Missiles', { range: 30, attacks: '4', rules: rules('Indirect') })],
            removeEquipment: ['Missile Pod (36”, A2p)'],
          },
        ],
        {
          // No baseline unit in this group has a Missile Pod — one only exists via Support Turret.
          requiresOneOfSelected: ['Support Turret'],
        },
      ),
    ]),
    group('M', [
      section('Replace Heavy Rail Rifle', 'one', [
        {
          label: 'Linked High Yield Pod',
          cost: 10,
          addEquipment: [customWeapon('Linked High Yield Pod', { range: 36, attacks: '4', rules: rules('Piercing, Linked') })],
          removeEquipment: ['Linked Heavy Rail Rifle (48”, A3x)'],
        },
      ]),
      section('Replace Linked Plasmagun', 'one', [
        {
          label: 'Smart Missiles',
          cost: 0,
          addEquipment: [customWeapon('Smart Missiles', { range: 30, attacks: '4', rules: rules('Indirect') })],
          removeEquipment: ['Linked Plasmagun'],
        },
      ]),
      section('Take one', 'one', [{ label: 'Seeker Missile', cost: 10, addEquipment: [gear('Seeker Missile', { rules: rules('Seeker Missile') })] }]),
    ]),
  ],
  armyRules: [
    armyRule('Accelerator', 'All weapons of models this unit is part of extend their weapon range by +6”.'),
    armyRule('Automated Repair System', 'Once per turn, if this unit is immobile, then it may try to repair itself. Roll one die, on a 4+ the vehicle stops being immobile.'),
    armyRule('Beacon', 'Friendly units that Deep Strike fully within 6” of this unit don’t scatter.'),
    armyRule('Controller', 'Place a controller model next to this unit, which gives the unit the Sniper special rule. If this unit takes any wounds, then the controller model is removed (and the Sniper rule lost).'),
    armyRule('Drone', 'This model has the same Quality value as its unit, it has no Melee attacks and doesn’t take up transport space. If no models from the upgrading unit are left this model is killed.'),
    armyRule('Flachette Discharger', 'Whenever enemy Infantry assaults this unit, the assaulting unit counts as moving through Dangerous Terrain.'),
    armyRule('Inhibitor', 'Enemy units assaulting a unit this model is part of reduce their movement by -D3”.'),
    armyRule('Inspirational', 'Friendly Infantry units within 12” of this model get the Fearless special rule.'),
    armyRule('Markerlight', 'Models may fire a markerlight at an enemy unit within 36” instead of shooting their weapons by taking a Quality test. If successful place 1 markerlight counter on the target. Friendly units targeting an enemy with markerlight counters may remove 1 to either ignore Cover or to get the Linked rule. Note that units may not fire markerlights and remove markerlights as part of the same shooting.'),
    armyRule('Optics', 'This unit shoots at Quality 4+.'),
    armyRule('Seeker Missile', 'This weapon counts as a Missile Launcher (Limited) that may get the Indirect rule by removing 1 markerlight counter from the target.'),
    armyRule('Shield', 'All models this unit is part of count as having the Armored special rule.'),
    armyRule('Support Turret', 'This model has the same Quality value as its unit, it has no Melee attacks and doesn’t take up transport space. If all models from the upgrading unit are killed this model is removed.'),
  ],
  psychicPowers: [],
})
