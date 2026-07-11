// Space Marines — transcribed from `1p40k - Main Rulebook v3.3.1.pdf` (page 5),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, power, rules, section, weapon } from './helpers'

export const spaceMarines = faction({
  id: 'space-marines',
  name: 'Space Marines',
  units: [
    { name: 'Captain', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Fearless, Hero, Tactics, Tough(3)', upgrades: 'A, H', cost: 65 },
    { name: 'Chaplain', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Fearless, Hero, Tough(3), Zealot', upgrades: 'A', cost: 55 },
    { name: 'Librarian', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Fearless, Psyker(1), Tough(3)', upgrades: 'A, H', cost: 55 },
    { name: 'Techmarine', size: 1, quality: '3+', equipment: [weapon('pistol'), meleeWeapon('Medium', 'Powersword')], special: 'Armored, Fearless, Servo Arm, Tough(3)', upgrades: '-', cost: 60 },
    { name: 'Scout Squad', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Fearless, Scout, Strider', upgrades: 'A, C, F', cost: 115 },
    { name: 'Tactical Marines', size: 5, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Fearless', upgrades: 'A, D, E, F', cost: 120 },
    { name: 'Terminators', size: 5, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { label: 'Stormbolters' }), meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })], special: 'Armored, Deep Strike, Fearless', upgrades: 'H', cost: 265 },
    { name: 'Centurions', size: 3, quality: '3+', equipment: [linked(weapon('flamer'), { label: 'Linked Flamers' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Armored, Fearless, Tough(3)', upgrades: 'J', cost: 225 },
    { name: 'Scout Bikers', size: 3, quality: '4+', equipment: [linked(weapon('assault-rifle'), { label: 'Linked Assault Rifles' }), weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Fast, Fearless, Scout', upgrades: 'A, F', cost: 95 },
    { name: 'Bike Squad', size: 3, quality: '3+', equipment: [linked(weapon('assault-rifle'), { label: 'Linked Assault Rifles' }), weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Fast, Fearless', upgrades: 'A, D, F', cost: 115 },
    { name: 'Attack Bike', size: 1, quality: '3+', equipment: [linked(weapon('assault-rifle')), weapon('machinegun')], special: 'Fast, Fearless', upgrades: 'G', cost: 65 },
    { name: 'Thunderfire', size: 1, quality: '3+', equipment: [customWeapon('Thunderfire Cannon', { range: 48, attacks: '12', rules: rules('Indirect') })], special: 'Fearless, Tough(3)', upgrades: '-', cost: 270 },
    { name: 'Land Speeder', size: 1, quality: '3+', equipment: [weapon('minigun', { rules: rules('Rending') })], special: 'Armored, Deep Strike, Fast, Fearless, Strider, Tough(3)', upgrades: 'M, O', cost: 85 },
    { name: 'Dreadnought', size: 1, quality: '3+', equipment: [linked(weapon('heavy-flamer')), customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Master', 'Powerfist')], special: 'Armored, Fearless, Impact(D3), Tough(6)', upgrades: 'K, M', cost: 175 },
    { name: 'Drop Pod', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })], special: 'Armored, Drop Pod, Fearless, Tough(6), Transport(11)', upgrades: '-', cost: 60 },
    { name: 'Rhino', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })], special: 'Fearless, Tough(3), Transport(11), Vehicle', upgrades: 'B, M', cost: 80 },
    { name: 'Razorback', size: 1, quality: '3+', equipment: [linked(weapon('minigun', { rules: rules('Rending') }))], special: 'Fearless, Tough(3), Transport(6), Vehicle', upgrades: 'B, M, L', cost: 95 },
    { name: 'Predator', size: 1, quality: '3+', equipment: [weapon('autocannon')], special: 'Fearless, Tough(6), Vehicle', upgrades: 'B, M, N', cost: 125 },
    { name: 'Land Raider', size: 1, quality: '3+', equipment: [linked(weapon('minigun', { rules: rules('Rending') })), customWeapon('Hurricane Bolter', { range: 24, attacks: '3', rules: rules('Linked') }, { count: 2 })], special: 'Fearless, Tough(9), Transport(11), Vehicle', upgrades: 'B, I, M', cost: 230 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace one Assault Rifle', 'one', [
        {
          label: 'Pistol, Medium CCW',
          cost: 0,
          addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')],
          removeOneEquipment: ['Assault Rifle'],
        },
        {
          label: 'Stormbolter',
          cost: 10,
          addEquipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })],
          removeOneEquipment: ['Assault Rifle'],
        },
        {
          label: 'Plasma Pistol, Medium CCW',
          cost: 15,
          addEquipment: [weapon('plasma-pistol'), meleeWeapon('Medium', 'CCW')],
          removeOneEquipment: ['Assault Rifle'],
        },
      ]),
      section(
        'Replace one Medium CCW',
        'one',
        [
          {
            label: 'Medium Powersword',
            cost: 5,
            addEquipment: [meleeWeapon('Medium', 'Powersword')],
            removeOneEquipment: ['Medium CCW'],
          },
          {
            label: 'Medium Powerfist',
            cost: 10,
            addEquipment: [meleeWeapon('Medium', 'Powerfist')],
            removeOneEquipment: ['Medium CCW'],
          },
        ],
        {
          // No group-A unit has a baseline Medium CCW — one only exists if produced above.
          requiresOneOfSelected: ['Pistol, Medium CCW', 'Plasma Pistol, Medium CCW'],
        },
      ),
      section(
        'Take one Assault Rifle attachment',
        'one',
        [
          { label: 'Flamer (Limited)', cost: 5, addEquipment: [weapon('flamer', { rules: rules('Limited') })] },
          { label: 'Meltagun (Limited)', cost: 5, addEquipment: [weapon('meltagun', { rules: rules('Limited') })] },
          { label: 'Plasmagun (Limited)', cost: 5, addEquipment: [weapon('plasmagun', { rules: rules('Limited') })] },
        ],
        {
          // On a single-model unit, replacing its one Assault Rifle leaves nothing to attach to.
          blockedBySelectingOnSingleModel: [
            'Pistol, Medium CCW',
            'Stormbolter',
            'Plasma Pistol, Medium CCW',
          ],
          // Replacing ALL Assault Rifles (group F) removes them regardless of unit size.
          blockedBySelecting: ['Pistols and Medium CCWs'],
        },
      ),
      section('Upgrade one model with one', 'one', [
        { label: 'Jump Pack (Deep Strike, Flying)', cost: 10, adds: ['Deep Strike', 'Flying'] },
        { label: 'Bike (Linked Assault Rifle, Fast)', cost: 15, adds: ['Fast'], addEquipment: [linked(weapon('assault-rifle'))] },
        { label: 'Terminator Armor (Armored, Deep Strike)', cost: 15, adds: ['Armored', 'Deep Strike'] },
      ]),
      section('Upgrade Psyker(1)', 'one', [{ label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] }]),
    ]),
    group('B', [
      section('Upgrade with any', 'any', [
        { label: 'Dozer Blade (Strider)', cost: 5, adds: ['Strider'] },
        // Nested-parenthetical compound labels ("X (Y (Limited))") have no single resolvable weapon profile — left without equipment effects.
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Pintle Mount (Stormbolter)', cost: 15 },
      ]),
    ]),
    group('C', [
      section('Replace any Assault Rifle', 'any', [
        { label: 'Shotgun', cost: 0, addEquipment: [weapon('shotgun')], removeOneEquipment: ['Assault Rifle'] },
        {
          label: 'Sniper Rifle',
          cost: 40,
          adds: ['Sniper'],
          addEquipment: [customWeapon('Sniper Rifle', { range: 36, attacks: '1', rules: rules('Piercing, Sniper') })],
          removeOneEquipment: ['Assault Rifle'],
        },
      ]),
      section('Replace one Assault Rifle', 'one', [
        { label: 'Machinegun', cost: 20, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Missile Launcher', cost: 30, addEquipment: [weapon('missile-launcher')], removeOneEquipment: ['Assault Rifle'] },
      ]),
    ]),
    group('D', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Flamer', cost: 15, addEquipment: [weapon('flamer')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Meltagun', cost: 20, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Plasmagun', cost: 30, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Assault Rifle'] },
      ]),
      section('Upgrade all models with any', 'any', [
        { label: 'Veterans (+1A in Melee)', cost: 20 },
        { label: 'Jump Packs (Deep Strike, Flying)', cost: 40, adds: ['Deep Strike', 'Flying'] },
      ]),
    ]),
    group('E', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Machinegun', cost: 30, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Missile Launcher', cost: 40, addEquipment: [weapon('missile-launcher')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Plasma Cannon', cost: 45, addEquipment: [weapon('plasma-cannon')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Multi-Melta', cost: 50, addEquipment: [weapon('multi-melta')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Lascannon', cost: 110, addEquipment: [weapon('lascannon')], removeOneEquipment: ['Assault Rifle'] },
      ]),
      section('Upgrade one model with one', 'one', [
        { label: 'Narthecium', cost: 25, adds: ['Narthecium'] },
        { label: 'Battle Standard', cost: 90, adds: ['Battle Standard'] },
      ]),
    ]),
    group('F', [
      section('Replace all Assault Rifles', 'one', [
        {
          label: 'Pistols and Medium CCWs',
          cost: 0,
          addEquipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })],
          removeEquipment: ['Assault Rifles'],
        },
      ]),
    ]),
    group('G', [
      section('Replace Machinegun', 'one', [
        { label: 'Multi-Melta', cost: 25, addEquipment: [weapon('multi-melta')], removeEquipment: ['Machinegun'] },
      ]),
    ]),
    group('H', [
      section(
        'Replace one Stormbolter',
        'one',
        [
          { label: 'Storm Shield (Tough(3))', cost: 5, adds: ['Tough(3)'] },
          {
            label: 'Minigun (Rending)',
            cost: 15,
            adds: ['Rending'],
            addEquipment: [weapon('minigun', { rules: rules('Rending') })],
            removeOneEquipment: ['Stormbolter (24”, A2)'],
          },
          {
            label: 'Heavy Flamer',
            cost: 20,
            addEquipment: [weapon('heavy-flamer')],
            removeOneEquipment: ['Stormbolter (24”, A2)'],
          },
        ],
        {
          // Captain/Librarian (group A + H) have no baseline Stormbolter — only group A's
          // "Stormbolter" option produces one. Terminators (group H only) already
          // carry Stormbolters at baseline, so satisfiedByEquipment covers them directly.
          requiresOneOfSelected: ['Stormbolter'],
          satisfiedByEquipment: ['Stormbolters (24”, A2)'],
        },
      ),
      section('Replace all Stormbolters', 'one', [
        { label: 'Storm Shields (Tough(3))', cost: 30, adds: ['Tough(3)'] },
      ]),
      section('Equip one model with', 'one', [
        { label: 'Missile Launcher', cost: 50, addEquipment: [weapon('missile-launcher')] },
      ]),
    ]),
    group('I', [
      section('Replace 2x Hurricane Bolters', 'one', [
        // Land Raider is single-model but carries 2 copies of this weapon — a partial swap
        // can't be a full removal, so these are additions only (Deff Dred-shaped edge case).
        { label: '2x Heavy Flamers', cost: 10, addEquipment: [weapon('heavy-flamer', { count: 2 })] },
        { label: '2x Linked Lascannons', cost: 240, addEquipment: [linked(weapon('lascannon'), { count: 2 })] },
      ]),
      section('Replace Linked Minigun', 'one', [
        {
          label: 'Linked Machinegun',
          cost: 5,
          addEquipment: [linked(weapon('machinegun'))],
          removeOneEquipment: ['Linked Minigun (Rending)'],
        },
      ]),
      section('Take one', 'one', [{ label: 'Multi-Melta', cost: 60, addEquipment: [weapon('multi-melta')] }]),
    ]),
    group('J', [
      section('Replace all Medium CCWs', 'one', [
        {
          label: 'Siege Drills',
          cost: 30,
          adds: ['Piercing', 'Rending'],
          addEquipment: [customWeapon('Siege Drills', { range: null, attacks: '2', rules: rules('Piercing, Rending') })],
          removeEquipment: ['Medium CCWs'],
        },
      ]),
      section('Replace any Linked Flamer', 'any', [
        { label: 'Linked Meltagun', cost: 10, addEquipment: [linked(weapon('meltagun'))], removeOneEquipment: ['Linked Flamer'] },
        { label: 'Linked Machinegun', cost: 15, addEquipment: [linked(weapon('machinegun'))], removeOneEquipment: ['Linked Flamer'] },
        { label: 'Linked Lascannon', cost: 120, addEquipment: [linked(weapon('lascannon'))], removeOneEquipment: ['Linked Flamer'] },
      ]),
      section('Upgrade any model with one', 'one', [
        { label: 'Hurricane Bolter', cost: 30, addEquipment: [customWeapon('Hurricane Bolter', { range: 24, attacks: '3', rules: rules('Linked') })] },
        { label: 'Missile Launcher', cost: 50, addEquipment: [weapon('missile-launcher')] },
      ]),
    ]),
    group('K', [
      section('Replace Stormbolter', 'one', [
        {
          label: 'Meltagun',
          cost: 15,
          addEquipment: [weapon('meltagun')],
          removeOneEquipment: ['Stormbolter (24”, A2)'],
        },
        {
          label: 'Heavy Flamer',
          cost: 20,
          addEquipment: [weapon('heavy-flamer')],
          removeOneEquipment: ['Stormbolter (24”, A2)'],
        },
      ]),
      section('Replace Stormbolter and Master Powerfist', 'one', [
        {
          label: 'Missile Launcher',
          cost: 0,
          addEquipment: [weapon('missile-launcher')],
          removeOneEquipment: ['Stormbolter (24”, A2)', 'Master Powerfist'],
        },
        {
          label: 'Linked Autocannon',
          cost: 10,
          addEquipment: [linked(weapon('autocannon'))],
          removeOneEquipment: ['Stormbolter (24”, A2)', 'Master Powerfist'],
        },
      ]),
      section('Replace Linked Heavy Flamer', 'one', [
        {
          label: 'Hurricane Bolter',
          cost: 0,
          addEquipment: [customWeapon('Hurricane Bolter', { range: 24, attacks: '3', rules: rules('Linked') })],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Minigun (Rending)',
          cost: 0,
          adds: ['Rending'],
          addEquipment: [weapon('minigun', { rules: rules('Rending') })],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Linked Machinegun',
          cost: 0,
          addEquipment: [linked(weapon('machinegun'))],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Stormbolter and Master Powerfist',
          cost: 5,
          addEquipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Master', 'Powerfist')],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Plasma Cannon',
          cost: 10,
          addEquipment: [weapon('plasma-cannon')],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Multi-Melta',
          cost: 15,
          addEquipment: [weapon('multi-melta')],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Linked Autocannon',
          cost: 15,
          addEquipment: [linked(weapon('autocannon'))],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
        {
          label: 'Linked Lascannon',
          cost: 105,
          addEquipment: [linked(weapon('lascannon'))],
          removeOneEquipment: ['Linked Heavy Flamer'],
        },
      ]),
      section('Take up to two', 'upToTwo', [
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
      ]),
    ]),
    group('L', [
      section('Replace Linked Minigun', 'one', [
        {
          label: 'Linked Heavy Flamer',
          cost: 5,
          addEquipment: [linked(weapon('heavy-flamer'))],
          removeOneEquipment: ['Linked Minigun (Rending)'],
        },
        {
          label: 'Linked Machinegun',
          cost: 5,
          addEquipment: [linked(weapon('machinegun'))],
          removeOneEquipment: ['Linked Minigun (Rending)'],
        },
        {
          label: 'Linked Lascannon',
          cost: 110,
          addEquipment: [linked(weapon('lascannon'))],
          removeOneEquipment: ['Linked Minigun (Rending)'],
        },
        {
          label: 'Lascannon, Linked Plasmagun',
          cost: 125,
          addEquipment: [weapon('lascannon'), linked(weapon('plasmagun'))],
          removeOneEquipment: ['Linked Minigun (Rending)'],
        },
      ]),
    ]),
    group('M', [
      section('Upgrade with', 'one', [{ label: 'Extra Armor (Tough(+3))', cost: 35, adds: ['Tough(+3)'] }]),
    ]),
    group('N', [
      section('Replace Autocannon', 'one', [
        {
          label: 'Icarus Stormcannon',
          cost: 40,
          addEquipment: [customWeapon('Icarus Stormcannon', { range: 48, attacks: '3', rules: rules('Piercing, Linked') })],
          removeOneEquipment: ['Autocannon'],
        },
        {
          label: 'Demolisher Cannon',
          cost: 85,
          addEquipment: [customWeapon('Demolisher Cannon', { range: 24, attacks: '9', rules: rules('Piercing, Rending') })],
          removeOneEquipment: ['Autocannon'],
        },
        {
          label: 'Linked Lascannon',
          cost: 100,
          addEquipment: [linked(weapon('lascannon'))],
          removeOneEquipment: ['Autocannon'],
        },
        {
          label: 'Skyspear Missile Launcher',
          cost: 100,
          addEquipment: [customWeapon('Skyspear Missile Launcher', { range: 48, attacks: '6', rules: rules('Piercing, Single Target, Linked') })],
          removeOneEquipment: ['Autocannon'],
        },
        {
          label: 'Whirlwind Missile Launcher',
          cost: 130,
          addEquipment: [customWeapon('Whirlwind Missile Launcher', { range: 48, attacks: '9', rules: rules('Indirect') })],
          removeOneEquipment: ['Autocannon'],
        },
      ]),
      section('Take one', 'one', [
        { label: '2x Machineguns', cost: 70, addEquipment: [weapon('machinegun', { count: 2 })] },
        { label: '2x Lascannons', cost: 240, addEquipment: [weapon('lascannon', { count: 2 })] },
      ]),
    ]),
    group('O', [
      section('Replace Minigun', 'one', [
        {
          label: 'Heavy Flamer',
          cost: 5,
          addEquipment: [weapon('heavy-flamer')],
          removeOneEquipment: ['Minigun (Rending)'],
        },
        {
          label: 'Machinegun',
          cost: 5,
          addEquipment: [weapon('machinegun')],
          removeOneEquipment: ['Minigun (Rending)'],
        },
        {
          label: 'Multi-Melta',
          cost: 25,
          addEquipment: [weapon('multi-melta')],
          removeOneEquipment: ['Minigun (Rending)'],
        },
      ]),
      section('Take one', 'one', [
        { label: 'Heavy Flamer', cost: 35, addEquipment: [weapon('heavy-flamer')] },
        { label: 'Minigun (Rending)', cost: 35, adds: ['Rending'], addEquipment: [weapon('minigun', { rules: rules('Rending') })] },
        { label: 'Machinegun', cost: 35, addEquipment: [weapon('machinegun')] },
        { label: 'Missile Launcher', cost: 50, addEquipment: [weapon('missile-launcher')] },
        { label: 'Multi-Melta', cost: 60, addEquipment: [weapon('multi-melta')] },
      ]),
      section('Upgrade with', 'one', [{ label: 'Open Sides (Transport(5))', cost: 10, adds: ['Transport(5)'] }]),
    ]),
  ],
  armyRules: [
    armyRule('Battle Standard', 'When taking morale tests this unit and all friendly Infantry units within 12” roll one extra die and pick the highest result.'),
    armyRule('Drop Pod', 'This unit must Deep Strike to enter the game and may only use Hold actions. It may use all of its transport slots to carry one Dreadnought.'),
    armyRule('Narthecium', 'The unit gets Regeneration.'),
    armyRule('Servo Arm', 'This model may be deployed as part of an Infantry unit of same Quality. Once per turn, if this unit is inside or within 2” of a Vehicle, then it may try to repair it. Roll one die, on a 4+ the vehicle stops being immobile.'),
    armyRule('Tactics', 'Once per game all friendly units may re-roll failed hits until the end of the round.'),
    armyRule('Zealot', 'The hero and his unit get Furious.'),
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
