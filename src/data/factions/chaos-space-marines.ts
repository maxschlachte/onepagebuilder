// Chaos Space Marines — transcribed from the rulebook PDF (page 9),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, linked, meleeWeapon, power, rules, section, weapon } from './helpers'

export const chaosSpaceMarines = faction({
  id: 'chaos-space-marines',
  name: 'Chaos Space Marines',
  units: [
    { name: 'Chaos Lord', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Hero, Tough(3)', upgrades: 'A, B', cost: 35 },
    { name: 'Sorcerer', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Psyker(1), Tough(3)', upgrades: 'A, B', cost: 50 },
    { name: 'Daemon Prince', size: 1, quality: '2+', equipment: [meleeWeapon('Force', 'Powersword')], special: 'Armored, Fear, Hero, Impact(D3), Tough(3)', upgrades: 'A, I', cost: 90 },
    { name: 'Zombies', size: 10, quality: '5+', equipment: [meleeWeapon('Light', 'Claw', { label: 'Light Claws' })], special: 'Fearless, Regeneration, Slow', upgrades: '-', cost: 90 },
    { name: 'Cultists', size: 10, quality: '5+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'F', cost: 100 },
    { name: 'Chaos Marines', size: 5, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'A, B, D, E', cost: 100 },
    { name: 'Possessed', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Mutations', upgrades: '-', cost: 115 },
    { name: 'Raptors', size: 5, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Deep Strike, Fear, Flying', upgrades: 'A, B, C, D', cost: 160 },
    { name: 'Chaos Terminators', size: 5, quality: '3+', equipment: [linked(weapon('assault-rifle'), { label: 'Linked Assault Rifles' }), meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Armored, Deep Strike', upgrades: 'A, B, G', cost: 185 },
    { name: 'Noise Marines', size: 5, quality: '3+', equipment: [customWeapon('Sonic Blasters', { range: 24, attacks: '2', rules: rules('Ignores Cover') })], special: 'Fast, Fearless', upgrades: 'K', cost: 190 },
    { name: 'Chaos Bikers', size: 3, quality: '3+', equipment: [linked(weapon('assault-rifle'), { label: 'Linked Assault Rifles' }), weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Fast', upgrades: 'A, B, D', cost: 100 },
    { name: 'Mutilators', size: 3, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Piercing') })], special: 'Armored, Deep Strike, Tough(3)', upgrades: 'A, H', cost: 145 },
    { name: 'Chaos Spawn', size: 3, quality: '4+', equipment: [customWeapon('Mutated Limbs', { range: null, attacks: 'D6' })], special: 'Fast, Fear, Fearless, Furious, Mutations, Tough(3)', upgrades: 'A', cost: 130 },
    { name: 'Helbrute', size: 1, quality: '3+', equipment: [meleeWeapon('Medium', 'Powerfist')], special: 'Armored, Impact(D3), Tough(6)', upgrades: 'M', cost: 90 },
    { name: 'Maulerfiend', size: 1, quality: '4+', equipment: [meleeWeapon('Medium', 'Powerfist'), gear('Lasher Tendrils', { rules: rules('Fear'), key: 'lasher-tendrils-fear' })], special: 'Armored, Impact(D3), Regeneration, Strider, Tough(6)', upgrades: 'N', cost: 100 },
    { name: 'Defiler', size: 1, quality: '4+', equipment: [weapon('battle-cannon'), linked(weapon('heavy-flamer')), meleeWeapon('Master', 'Powerfist')], special: 'Armored, Impact(D3), Regeneration, Tough(6)', upgrades: 'L', cost: 305 },
    { name: 'Chaos Rhino', size: 1, quality: '3+', equipment: [linked(weapon('assault-rifle'))], special: 'Tough(3), Transport(11), Vehicle', upgrades: 'O', cost: 70 },
    { name: 'Chaos Predator', size: 1, quality: '3+', equipment: [weapon('autocannon')], special: 'Tough(6), Vehicle', upgrades: 'J, O', cost: 120 },
    { name: 'Chaos Land Raider', size: 1, quality: '3+', equipment: [linked(weapon('lascannon'), { count: 2 }), linked(weapon('machinegun'))], special: 'Tough(9), Transport(11), Vehicle', upgrades: 'O', cost: 470 },
  ],
  upgradeGroups: [
    group('A', [
      section('Upgrade all models with one', 'one', [
        { label: 'Khorne (Furious)', cost: 10, adds: ['Furious'] },
        { label: 'Nurgle (Regeneration)', cost: 15, adds: ['Regeneration'] },
        { label: 'Tzeentch (Brothers)', cost: 15, adds: ['Brothers'] },
        { label: 'Slaneesh (Fast)', cost: 20, adds: ['Fast'] },
      ]),
    ]),
    group('B', [
      section('Replace one Assault Rifle', 'one', [
        {
          label: 'Pistol and Medium CCW',
          cost: 0,
          addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')],
          removeOneEquipment: ['Assault Rifle'],
        },
        {
          label: 'Linked Assault Rifle',
          cost: 5,
          addEquipment: [linked(weapon('assault-rifle'))],
          removeOneEquipment: ['Assault Rifle'],
        },
        {
          label: 'Plasma Pistol and Medium CCW',
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
          // No group-B unit has a baseline Medium CCW — one only exists if produced above.
          requiresOneOfSelected: ['Pistol and Medium CCW', 'Plasma Pistol and Medium CCW'],
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
          blockedBySelectingOnSingleModel: [
            'Pistol and Medium CCW',
            'Linked Assault Rifle',
            'Plasma Pistol and Medium CCW',
          ],
        },
      ),
      section('Equip one model with one', 'one', [
        {
          label: 'Bike (Linked Assault Rifle, Fast)',
          cost: 15,
          adds: ['Fast'],
          addEquipment: [linked(weapon('assault-rifle'))],
          removeOneEquipment: ['Assault Rifle'],
        },
        { label: 'Terminator Armor (Armored, Deep Strike)', cost: 15, adds: ['Armored', 'Deep Strike'] },
      ]),
      section(
        'Upgrade Psyker(1)',
        'one',
        [
          { label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] },
          { label: 'Psyker(3)', cost: 10, adds: ['Psyker(3)'] },
        ],
        { requiresBaselineRule: ['Psyker(1)'] },
      ),
    ]),
    group('C', [
      section('Replace all Assault Rifles', 'one', [
        {
          label: 'Pistols and Medium CCWs',
          cost: 0,
          addEquipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })],
          removeEquipment: ['Assault Rifles'],
        },
        { label: 'Medium Powerfists', cost: 30, addEquipment: [meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })], removeEquipment: ['Assault Rifles'] },
      ]),
    ]),
    group('D', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Flamer', cost: 15, addEquipment: [weapon('flamer')], removeOneEquipment: ['Assault Rifles'] },
        { label: 'Meltagun', cost: 20, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Assault Rifles'] },
        { label: 'Plasmagun', cost: 30, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Assault Rifles'] },
      ]),
    ]),
    group('E', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Machinegun', cost: 30, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifles'] },
        { label: 'Autocannon', cost: 40, addEquipment: [weapon('autocannon')], removeOneEquipment: ['Assault Rifles'] },
        {
          label: 'Missile Launcher',
          cost: 40,
          addEquipment: [weapon('missile-launcher')],
          removeOneEquipment: ['Assault Rifles'],
        },
        { label: 'Lascannon', cost: 110, addEquipment: [weapon('lascannon')], removeOneEquipment: ['Assault Rifles'] },
      ]),
      section('Replace all Assault Rifles', 'one', [
        {
          label: 'Pistols and Medium CCWs',
          cost: 0,
          addEquipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })],
          removeEquipment: ['Assault Rifles'],
        },
      ]),
      section('Upgrade all models with', 'one', [{ label: 'Veterans (Fearless)', cost: 20, adds: ['Fearless'] }]),
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
      section('Replace one Assault Rifle', 'one', [
        { label: 'Shotgun', cost: 0, addEquipment: [weapon('shotgun')], removeOneEquipment: ['Assault Rifles'] },
        { label: 'Flamer', cost: 15, addEquipment: [weapon('flamer')], removeOneEquipment: ['Assault Rifles'] },
        { label: 'Machinegun', cost: 15, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifles'] },
      ]),
    ]),
    group('G', [
      section('Replace one Linked Assault Rifle', 'one', [
        {
          label: 'Heavy Flamer',
          cost: 15,
          addEquipment: [weapon('heavy-flamer')],
          removeOneEquipment: ['Linked Assault Rifles'],
        },
        {
          label: 'Linked Autocannon',
          cost: 50,
          addEquipment: [linked(weapon('autocannon'))],
          removeOneEquipment: ['Linked Assault Rifles'],
        },
      ]),
    ]),
    group('H', [
      section('Equip any model with one', 'one', [
        { label: 'Linked Flamer', cost: 30, addEquipment: [linked(weapon('flamer'))] },
        { label: 'Heavy Flamer', cost: 35, addEquipment: [weapon('heavy-flamer')] },
        { label: 'Minigun (Rending)', cost: 35, adds: ['Rending'], addEquipment: [weapon('minigun', { rules: rules('Rending') })] },
        { label: 'Linked Meltagun', cost: 40, addEquipment: [linked(weapon('meltagun'))] },
        { label: 'Linked Plasmagun', cost: 45, addEquipment: [linked(weapon('plasmagun'))] },
        { label: 'Plasma Cannon', cost: 55, addEquipment: [weapon('plasma-cannon')] },
        { label: 'Multi-Melta', cost: 60, addEquipment: [weapon('multi-melta')] },
        { label: 'Lascannon', cost: 120, addEquipment: [weapon('lascannon')] },
      ]),
    ]),
    group('I', [
      section('Upgrade with', 'one', [{ label: 'Wings (Flying)', cost: 5, adds: ['Flying'] }]),
      section('Upgrade with one', 'one', [
        { label: 'Psyker(1)', cost: 15, adds: ['Psyker(1)'] },
        { label: 'Psyker(2)', cost: 20, adds: ['Psyker(2)'] },
        { label: 'Psyker(3)', cost: 25, adds: ['Psyker(3)'] },
      ]),
    ]),
    group('J', [
      section('Replace Autocannon', 'one', [
        {
          label: 'Demolisher Cannon',
          cost: 85,
          addEquipment: [customWeapon('Demolisher Cannon', { range: 24, attacks: '9', rules: rules('Piercing, Rending') })],
          removeEquipment: ['Autocannon'],
        },
        { label: 'Linked Lascannon', cost: 100, addEquipment: [linked(weapon('lascannon'))], removeEquipment: ['Autocannon'] },
      ]),
      section('Take one', 'one', [
        { label: '2x Machineguns', cost: 70, addEquipment: [weapon('machinegun', { count: 2 })] },
        { label: '2x Lascannons', cost: 240, addEquipment: [weapon('lascannon', { count: 2 })] },
      ]),
    ]),
    group('K', [
      section('Replace one Sonic Blaster', 'one', [
        {
          label: 'Doom Siren',
          cost: 10,
          addEquipment: [customWeapon('Doom Siren', { range: 12, attacks: '6', rules: rules('Ignores Cover') })],
          removeOneEquipment: ['Sonic Blasters (24”, A2, Ignores Cover)'],
        },
        {
          label: 'Blastmaster',
          cost: 10,
          addEquipment: [customWeapon('Blastmaster', { range: 36, attacks: '2', rules: rules('Ignores Cover') })],
          removeOneEquipment: ['Sonic Blasters (24”, A2, Ignores Cover)'],
        },
      ]),
    ]),
    group('L', [
      section('Replace Linked Heavy Flamer', 'one', [
        { label: 'Flail', cost: 0, addEquipment: [customWeapon('Flail', { range: null, attacks: '3', rules: rules('Piercing, Single Target') })], removeEquipment: ['Linked Heavy Flamer'] },
        {
          label: 'Havoc Launcher',
          cost: 10,
          addEquipment: [customWeapon('Havoc Launcher', { range: 48, attacks: '3', rules: rules('Linked') })],
          removeEquipment: ['Linked Heavy Flamer'],
        },
      ]),
      section('Take one', 'one', [
        { label: 'Extra Powerfist (+1A in Melee)', cost: 10 },
        { label: 'Linked Machinegun', cost: 35, addEquipment: [linked(weapon('machinegun'))] },
        { label: 'Linked Autocannon', cost: 50, addEquipment: [linked(weapon('autocannon'))] },
        { label: 'Linked Lascannon', cost: 120, addEquipment: [linked(weapon('lascannon'))] },
      ]),
    ]),
    group('M', [
      section('Take one', 'one', [
        { label: 'Extra Powerfist (+1A in Melee)', cost: 10 },
        { label: 'Linked Machinegun', cost: 45, addEquipment: [linked(weapon('machinegun'))] },
        { label: 'Multi-Melta', cost: 60, addEquipment: [weapon('multi-melta')] },
        { label: 'Linked Autocannon', cost: 60, addEquipment: [linked(weapon('autocannon'))] },
        { label: 'Plasma Cannon', cost: 55, addEquipment: [weapon('plasma-cannon')] },
        { label: 'Linked Lascannon', cost: 150, addEquipment: [linked(weapon('lascannon'))] },
      ]),
      section('Take up to two Powerfist attachments', 'upToTwo', [
        { label: 'Linked Assault Rifle', cost: 10, addEquipment: [linked(weapon('assault-rifle'))] },
        { label: 'Heavy Flamer', cost: 35, addEquipment: [weapon('heavy-flamer')] },
      ]),
    ]),
    group('N', [
      section('Replace Lasher Tendrils', 'one', [
        {
          label: 'Magma Cutters',
          cost: 20,
          addEquipment: [customWeapon('Magma Cutters', { range: null, attacks: '3', rules: rules('Piercing, Single Target, Rending') })],
          removeEquipment: ['Lasher Tendrils (Fear)'],
        },
        {
          label: '2x Ectoplasma Cannons',
          cost: 70,
          addEquipment: [customWeapon('Ectoplasma Cannons', { range: 24, attacks: '3', rules: rules('Piercing') }, { count: 2 })],
          removeEquipment: ['Lasher Tendrils (Fear)'],
        },
        {
          label: '2x Hades Autocannons',
          cost: 140,
          addEquipment: [customWeapon('Hades Autocannons', { range: 36, attacks: '4', rules: rules('Piercing') }, { count: 2 })],
          removeEquipment: ['Lasher Tendrils (Fear)'],
        },
      ]),
      section('Take one', 'one', [
        { label: 'Ectoplasma Cannon', cost: 35, addEquipment: [customWeapon('Ectoplasma Cannon', { range: 24, attacks: '3', rules: rules('Piercing') })] },
      ]),
    ]),
    group('O', [
      section('Take any', 'any', [
        { label: 'Dozer Blade (Strider)', cost: 5, adds: ['Strider'] },
        { label: 'Pintle Mount (Linked Assault Rifle)', cost: 10, addEquipment: [linked(weapon('assault-rifle'))] },
        { label: 'Havoc Launcher', cost: 60, addEquipment: [customWeapon('Havoc Launcher', { range: 48, attacks: '3', rules: rules('Linked') })] },
      ]),
      section(
        'Equip with one Pintle Mount attachment',
        'one',
        [
          { label: 'Flamer (Limited)', cost: 5, addEquipment: [weapon('flamer', { rules: rules('Limited') })] },
          { label: 'Meltagun (Limited)', cost: 5, addEquipment: [weapon('meltagun', { rules: rules('Limited') })] },
          { label: 'Plasmagun (Limited)', cost: 5, addEquipment: [weapon('plasmagun', { rules: rules('Limited') })] },
        ],
        { requiresOneOfSelected: ['Pintle Mount (Linked Assault Rifle)'] },
      ),
      section('Upgrade with', 'one', [{ label: 'Extra Armor (Tough(+3))', cost: 35, adds: ['Tough(+3)'] }]),
    ]),
  ],
  armyRules: [
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Mutations', 'Whenever this unit fights in Melee, roll one die on the following table: 1-2 All models get Rending; 3-4 All models get Piercing; 5-6 All models get +1 Attack.'),
    armyRule('Slow', 'This unit moves 3” when using Walk actions and 6” when using Run/Assault actions.'),
  ],
  psychicPowers: [
    power('Virus', 6, 'Target enemy unit within 24” takes one automatic hit for every 1 it rolls when shooting until the end of the round.'),
    power('Rot', 7, 'All enemy units within 6” take D3+1 automatic hits with Poison.'),
    power('Frenzy', 7, 'Target friendly unit within 12” gets Piercing Melee or +1A in Melee until the end of the round (pick one).'),
    power('Doombolt', 8, 'Target enemy model within 18” takes D3x automatic hits.'),
    power('Firestorm', 8, 'Target enemy unit within 24” takes D3p automatic hits.'),
    power('Overload', 10, 'Target enemy unit within 24” takes D3+1 automatic hits and must take a morale test, regardless of casualties.'),
  ],
})
