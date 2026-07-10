// Imperial Guard / Astra Militarum — transcribed from the rulebook PDF (page 6),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, power, rules, section, weapon } from './helpers'

export const imperialGuard = faction({
  id: 'imperial-guard',
  name: 'Imperial Guard / Astra Militarum',
  units: [
    { name: 'Commander', size: 1, quality: '4+', equipment: [weapon('assault-rifle')], special: 'Hero, Officer, Tough(3)', upgrades: 'A', cost: 40 },
    { name: 'Command Assistants', size: 4, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'B, C, E', cost: 60 },
    { name: 'Tank Commander', size: 1, quality: '4+', equipment: [customWeapon('Vanquisher Cannon', { range: 48, attacks: '6', rules: rules('Piercing, Single Target') }), weapon('heavy-flamer')], special: 'Hero, Officer, Tough(9), Vehicle', upgrades: 'H, N', cost: 220 },
    { name: 'Commissar', size: 1, quality: '5+', equipment: [weapon('assault-rifle')], special: 'Executioner, Tough(3)', upgrades: 'A', cost: 20 },
    { name: 'Priest', size: 1, quality: '5+', equipment: [weapon('assault-rifle')], special: 'Spiritual Leader, Tough(3)', upgrades: 'A', cost: 45 },
    { name: 'Psyker', size: 1, quality: '5+', equipment: [weapon('assault-rifle')], special: 'Psyker(1), Tough(3)', upgrades: 'A', cost: 30 },
    { name: 'Conscripts', size: 10, quality: '6+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: '-', cost: 50 },
    { name: 'Guardsmen', size: 5, quality: '5+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'A, B, D', cost: 50 },
    { name: 'Veterans', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'A, B, C, O', cost: 75 },
    { name: 'Storm Troopers', size: 5, quality: '4+', equipment: [weapon('carbine', { label: 'Carbines', rules: rules('Piercing') })], special: 'Deep Strike, Strider', upgrades: 'A, B', cost: 100 },
    { name: 'Weapon Teams', size: 3, quality: '5+', equipment: [weapon('machinegun', { label: 'Machineguns' })], special: '-', upgrades: 'D', cost: 70 },
    { name: 'Ogryns', size: 3, quality: '4+', equipment: [customWeapon('Ripper Guns', { range: 12, attacks: '3' }), meleeWeapon('Heavy', 'Powersword', { label: 'Heavy Powerswords' })], special: 'Armored, Impact(1), Tough(3)', upgrades: 'L', cost: 160 },
    { name: 'Ratlings', size: 3, quality: '6+', equipment: [customWeapon('Sniper Rifles', { range: 36, attacks: '1', rules: rules('Piercing, Sniper') })], special: 'Scout', upgrades: '-', cost: 145 },
    { name: 'Rough Riders', size: 5, quality: '5+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Fast, Impact(1)', upgrades: 'J', cost: 70 },
    { name: 'Sentinel', size: 1, quality: '4+', equipment: [weapon('heavy-flamer')], special: 'Impact(D3), Tough(3)', upgrades: 'F, I', cost: 55 },
    { name: 'Taurox', size: 1, quality: '4+', equipment: [linked(weapon('assault-rifle'))], special: 'Strider, Tough(3), Transport(11), Vehicle', upgrades: 'H, I, M', cost: 60 },
    { name: 'Chimera', size: 1, quality: '4+', equipment: [weapon('machinegun')], special: 'Tough(3), Transport(11), Vehicle', upgrades: 'H, I', cost: 80 },
    { name: 'Hellhound', size: 1, quality: '4+', equipment: [customWeapon('Chem Cannon', { range: 12, attacks: '6', rules: rules('Poison') }), weapon('heavy-flamer')], special: 'Tough(3), Vehicle', upgrades: 'G, H, I', cost: 80 },
    { name: 'Artillery Tank', size: 1, quality: '4+', equipment: [customWeapon('Hydra Autocannons', { range: 48, attacks: '2', rules: rules('Piercing, Linked') }, { count: 2 }), weapon('machinegun')], special: 'Tough(3), Vehicle', upgrades: 'H, I, K', cost: 155 },
    { name: 'Leman Russ', size: 1, quality: '4+', equipment: [customWeapon('Vanquisher Cannon', { range: 48, attacks: '6', rules: rules('Piercing, Single Target') }), weapon('heavy-flamer')], special: 'Tough(9), Vehicle', upgrades: 'H, I, N', cost: 205 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace one Assault Rifle/Carbine', 'one', [
        {
          label: 'Pistol and Medium CCW',
          cost: 0,
          addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')],
          removeOneEquipment: ['Assault Rifle'],
        },
        {
          label: 'Plasma Pistol and Medium CCW',
          cost: 10,
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
          requiresOneOfSelected: ['Pistol and Medium CCW', 'Plasma Pistol and Medium CCW'],
        },
      ),
      section('Upgrade Psyker(1)', 'one', [{ label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] }]),
    ]),
    group('B', [
      section('Replace up to two Assault Rifles/Carbines', 'upToTwo', [
        { label: 'Flamer', cost: 10, addEquipment: [weapon('flamer')], removeOneEquipment: ['Assault Rifle', 'Carbines (Piercing)'] },
        { label: 'Grenade Launcher', cost: 10, addEquipment: [weapon('grenade-launcher')], removeOneEquipment: ['Assault Rifle', 'Carbines (Piercing)'] },
        { label: 'Meltagun', cost: 15, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Assault Rifle', 'Carbines (Piercing)'] },
        { label: 'Heavy Flamer', cost: 20, addEquipment: [weapon('heavy-flamer')], removeOneEquipment: ['Assault Rifle', 'Carbines (Piercing)'] },
        { label: 'Plasmagun', cost: 20, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Assault Rifle', 'Carbines (Piercing)'] },
      ]),
    ]),
    group('C', [
      section('Replace up to two Assault Rifles', 'upToTwo', [
        { label: 'Shotgun', cost: 0, addEquipment: [weapon('shotgun')], removeOneEquipment: ['Assault Rifle'] },
        {
          label: 'Sniper Rifle (36”, A1p, Sniper)',
          cost: 40,
          adds: ['Sniper'],
          addEquipment: [customWeapon('Sniper Rifle', { range: 36, attacks: '1', rules: rules('Piercing, Sniper') })],
          removeOneEquipment: ['Assault Rifle'],
        },
      ]),
    ]),
    group('D', [
      // "Weapons Team (Machinegun)" is a compound alias, not a distinct weapon profile —
      // left without an equipment effect.
      section('Take one', 'one', [{ label: 'Weapons Team (Machinegun)', cost: 25 }]),
      section('Replace any Machinegun', 'any', [
        { label: 'Autocannon', cost: 5, addEquipment: [weapon('autocannon')], removeOneEquipment: ['Machinegun'] },
        { label: 'Missile Launcher', cost: 5, addEquipment: [weapon('missile-launcher')], removeOneEquipment: ['Machinegun'] },
        { label: 'Mortar (48”, A3, Indirect)', cost: 10, addEquipment: [customWeapon('Mortar', { range: 48, attacks: '3', rules: rules('Indirect') })], removeOneEquipment: ['Machinegun'] },
        { label: 'Lascannon', cost: 40, addEquipment: [weapon('lascannon')], removeOneEquipment: ['Machinegun'] },
      ]),
    ]),
    group('E', [
      section('Equip up to two models with any', 'upToTwo', [
        { label: 'Vox-Caster', cost: 10, adds: ['Vox-Caster'] },
        { label: 'Medipack', cost: 25, adds: ['Medipack'] },
        { label: 'Battle Standard', cost: 45, adds: ['Battle Standard'] },
      ]),
    ]),
    group('F', [
      section('Replace Heavy Flamer', 'one', [
        { label: 'Machinegun', cost: 0, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Heavy Flamer'] },
        { label: 'Autocannon', cost: 10, addEquipment: [weapon('autocannon')], removeOneEquipment: ['Heavy Flamer'] },
        {
          label: 'Missile Launcher',
          cost: 10,
          addEquipment: [weapon('missile-launcher')],
          removeOneEquipment: ['Heavy Flamer'],
        },
        {
          label: 'Plasma Cannon',
          cost: 15,
          addEquipment: [weapon('plasma-cannon')],
          removeOneEquipment: ['Heavy Flamer'],
        },
        { label: 'Lascannon', cost: 65, addEquipment: [weapon('lascannon')], removeOneEquipment: ['Heavy Flamer'] },
      ]),
      section('Upgrade with', 'one', [
        { label: 'Scout Sentinel (Scout, Strider)', cost: 5, adds: ['Scout', 'Strider'] },
      ]),
    ]),
    group('G', [
      section('Replace Heavy Flamer', 'one', [
        { label: 'Machinegun', cost: 0, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Heavy Flamer'] },
        {
          label: 'Multi-Melta',
          cost: 20,
          addEquipment: [weapon('multi-melta')],
          removeOneEquipment: ['Heavy Flamer'],
        },
      ]),
      section('Replace Chem Cannon', 'one', [
        {
          label: 'Inferno Cannon (18”, A6p)',
          cost: 20,
          addEquipment: [customWeapon('Inferno Cannon', { range: 18, attacks: '6', rules: rules('Piercing') })],
          removeOneEquipment: ['Chem Cannon (12”, A6, Poison)'],
        },
        {
          label: 'Melta Cannon (24”, A5p)',
          cost: 25,
          addEquipment: [customWeapon('Melta Cannon', { range: 24, attacks: '5', rules: rules('Piercing') })],
          removeOneEquipment: ['Chem Cannon (12”, A6, Poison)'],
        },
      ]),
    ]),
    group('H', [
      // All three: pure rule grant, or a nested-parenthetical compound alias
      // ("Missile Launcher (Limited)" nested inside "Hunter-Killer Missile"; "Machinegun"
      // nested inside "Pintle Mount") that isn't a distinct weapon profile.
      section('Take any', 'any', [
        { label: 'Dozer Blade (Strider)', cost: 5, adds: ['Strider'] },
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Pintle Mount (Machinegun)', cost: 25 },
      ]),
    ]),
    group('I', [
      section('Upgrade with', 'one', [{ label: 'Extra Armor (Tough(+3))', cost: 25, adds: ['Tough(+3)'] }]),
    ]),
    group('J', [
      section('Replace one Pistol', 'one', [{ label: 'Plasma Pistol', cost: 5, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] }]),
      section('Replace one Light Powersword', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Light Powersword'] },
      ]),
      section('Replace up to two Pistols', 'upToTwo', [
        { label: 'Flamer', cost: 10, addEquipment: [weapon('flamer')], removeOneEquipment: ['Pistol'] },
        { label: 'Grenade Launcher', cost: 10, addEquipment: [weapon('grenade-launcher')], removeOneEquipment: ['Pistol'] },
        { label: 'Meltagun', cost: 15, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Pistol'] },
        { label: 'Plasmagun', cost: 15, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Pistol'] },
      ]),
    ]),
    group('K', [
      section('Replace 2x Hydra Autocannons', 'one', [
        // Artillery Tank is single-model but carries 2 copies of this weapon — additions
        // only, no removal (Deff Dred-shaped edge case). "Deathstrike Missile" names an
        // army rule (see armyRules below), not a stat weapon, so it's left without an
        // equipment effect but declares that army rule; "Eagle Rockets" uses a "D3*9p"
        // attacks notation the weapon-profile parser doesn't recognize (only handles an
        // "A" prefix) — also left without an equipment effect.
        { label: 'Deathstrike Missile', cost: 0, adds: ['Deathstrike Missile'] },
        {
          label: 'Earthshaker Cannon (48”, A9p, Indirect, Rending)',
          cost: 135,
          addEquipment: [customWeapon('Earthshaker Cannon', { range: 48, attacks: '9', rules: rules('Piercing, Indirect, Rending') })],
        },
        {
          label: '2x Stormshield Mortars (48”, A6p, Indirect, Linked)',
          cost: 265,
          addEquipment: [customWeapon('Stormshield Mortars', { range: 48, attacks: '6', rules: rules('Piercing, Indirect, Linked') }, { count: 2 })],
        },
        { label: 'Eagle Rockets (48”, D3*9p, Indirect, Rending)', cost: 365 },
      ]),
    ]),
    group('L', [
      section('Upgrade any model with', 'any', [{ label: 'Slabshield (Tough(+3))', cost: 20, adds: ['Tough(+3)'] }]),
    ]),
    group('M', [
      section('Replace Linked Assault Rifle', 'one', [
        {
          label: 'Linked Autocannon',
          cost: 40,
          addEquipment: [linked(weapon('autocannon'))],
          removeOneEquipment: ['Linked Assault Rifle'],
        },
      ]),
      section('Take one', 'one', [
        { label: 'Linked Minigun', cost: 25, addEquipment: [linked(weapon('minigun'))] },
        { label: 'Autocannon', cost: 35, addEquipment: [weapon('autocannon')] },
        { label: 'Linked Missile Launcher', cost: 50, addEquipment: [linked(weapon('missile-launcher'))] },
      ]),
    ]),
    group('N', [
      section('Replace Heavy Flamer', 'one', [
        { label: 'Machinegun', cost: 0, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Heavy Flamer'] },
        { label: 'Lascannon', cost: 65, addEquipment: [weapon('lascannon')], removeOneEquipment: ['Heavy Flamer'] },
      ]),
      section('Replace Vanquisher Cannon', 'one', [
        {
          label: 'Exterminator Cannon (48”, A4p, Linked)',
          cost: 5,
          addEquipment: [customWeapon('Exterminator Cannon', { range: 48, attacks: '4', rules: rules('Piercing, Linked') })],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
        {
          label: 'Demolisher Cannon (24”, A9p, Rending)',
          cost: 20,
          addEquipment: [customWeapon('Demolisher Cannon', { range: 24, attacks: '9', rules: rules('Piercing, Rending') })],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
        {
          label: 'Punisher Cannon (24”, A20)',
          cost: 30,
          addEquipment: [customWeapon('Punisher Cannon', { range: 24, attacks: '20' })],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
        {
          label: 'Executioner Cannon (36”, A9p)',
          cost: 30,
          addEquipment: [customWeapon('Executioner Cannon', { range: 36, attacks: '9', rules: rules('Piercing') })],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
        {
          label: 'Eradicator Cannon (36”, A9p, Ignores Cover)',
          cost: 45,
          addEquipment: [customWeapon('Eradicator Cannon', { range: 36, attacks: '9', rules: rules('Piercing, Ignores Cover') })],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
        {
          label: 'Battle Cannon',
          cost: 70,
          addEquipment: [weapon('battle-cannon')],
          removeOneEquipment: ['Vanquisher Cannon (48”, A6x)'],
        },
      ]),
      section('Take one', 'one', [
        { label: '2x Heavy Flamers', cost: 55, addEquipment: [weapon('heavy-flamer', { count: 2 })] },
        { label: '2x Machineguns', cost: 55, addEquipment: [weapon('machinegun', { count: 2 })] },
        { label: '2x Plasma Cannons', cost: 80, addEquipment: [weapon('plasma-cannon', { count: 2 })] },
        { label: '2x Multi-Meltas', cost: 90, addEquipment: [weapon('multi-melta', { count: 2 })] },
      ]),
    ]),
    group('O', [
      section('Upgrade all models with one', 'one', [
        { label: 'Demolitions (Demo Charge)', cost: 5 },
        { label: 'Sentries (Stealth)', cost: 10, adds: ['Stealth'] },
        { label: 'Grenadiers (Armored)', cost: 15, adds: ['Armored'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Battle Standard', 'This unit and all friendly Infantry units within 12” roll one extra die and pick the highest result when taking morale tests.'),
    armyRule('Deathstrike Missile', 'After round 1 you may roll one die at the beginning of each round, and on a 4+ the missile is fired and you may place a marker anywhere on the table. Then roll one die, on a 1-2 the opponent may move the marker by up to 6” (must be in a valid position). All units within 6” of the marker take 2D6 hits with Piercing and Rending. The missile may only be fired once per game, and on the last round the missile is fired automatically.'),
    armyRule('Demo Charge', 'Once per game, when this unit is activated, it may throw an Explosive (6”, A9p).'),
    armyRule('Executioner', 'This model may be deployed as part of an Infantry unit of same Quality. Whenever a unit this model is part of fails a morale test you may sacrifice one model and re-roll the morale test.'),
    armyRule('Medipack', 'The unit gets Regeneration.'),
    armyRule('Officer', 'When this model is activated you may pick one friendly Infantry unit within 12” and roll one die. On a 4+ the target unit may use any action, even if it had been activated already (this does not count as its activation).'),
    armyRule('Spiritual Leader', 'This model may be deployed as part of an Infantry unit of same Quality. Whenever this unit uses an Assault action roll on this table: 1-2 All models get Armored; 3-4 All models get Linked; 5-6 All models get Piercing.'),
    armyRule('Vox-Caster', 'If this unit is joined by a Commander, then the range of its Officer special rule is extended from 12” to 24”.'),
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
