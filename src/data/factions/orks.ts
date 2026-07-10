// Orks — transcribed from the rulebook PDF (page 7),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, power, rules, section, weapon } from './helpers'

export const orks = faction({
  id: 'orks',
  name: 'Orks',
  units: [
    { name: 'Warboss', size: 1, quality: '4+', equipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], special: 'Fearless, Furious, Hero, Tough(3), Waagh!', upgrades: 'A', cost: 60 },
    { name: 'Boss', size: 1, quality: '5+', equipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], special: 'Fearless, Furious, Hero, Tough(3), Waagh!', upgrades: 'A', cost: 50 },
    { name: 'Big Mek', size: 1, quality: '5+', equipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], special: 'Fearless, Furious, Hero, Mek Tools, Tough(3)', upgrades: 'A, N', cost: 25 },
    { name: 'Weirdboy', size: 1, quality: '5+', equipment: [meleeWeapon('Heavy', 'Powersword')], special: 'Fearless, Furious, Psyker(1), Tough(3)', upgrades: 'B', cost: 40 },
    { name: 'Painboy', size: 1, quality: '5+', equipment: [meleeWeapon('Heavy', 'CCW', { rules: rules('Poison') })], special: 'Dok Tools, Fearless, Furious', upgrades: '-', cost: 60 },
    { name: 'Runtherd', size: 1, quality: '6+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Furious, Runtherd, Tough(3)', upgrades: '-', cost: 25 },
    { name: 'Gretchin', size: 10, quality: '6+', equipment: [weapon('pistol', { label: 'Pistols' })], special: 'Git Shootaz', upgrades: '-', cost: 50 },
    { name: 'Boyz', size: 10, quality: '5+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Furious', upgrades: 'A, H', cost: 130 },
    { name: 'Kommandos', size: 5, quality: '5+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Furious, Scout, Strider', upgrades: 'A, H', cost: 80 },
    { name: 'Specialist Boyz', size: 5, quality: '5+', equipment: [weapon('flamer', { label: 'Flamers' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Furious', upgrades: 'A, F', cost: 115 },
    { name: 'Nobz', size: 5, quality: '4+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Furious', upgrades: 'A, E', cost: 100 },
    { name: 'Meganobz', size: 3, quality: '4+', equipment: [linked(weapon('carbine'), { label: 'Linked Carbines' }), meleeWeapon('Heavy', 'Powerfist', { label: 'Heavy Powerfists' })], special: 'Armored, Fearless, Furious', upgrades: 'A', cost: 125 },
    { name: 'Warbikers', size: 3, quality: '5+', equipment: [linked(weapon('carbine'), { label: 'Linked Carbines' }), weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fast, Fearless, Furious', upgrades: 'A', cost: 60 },
    { name: 'Nob Bikers', size: 3, quality: '4+', equipment: [linked(weapon('carbine'), { label: 'Linked Carbines' }), weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fast, Fearless, Furious', upgrades: 'A', cost: 85 },
    { name: 'Mek Gun', size: 1, quality: '5+', equipment: [customWeapon('Kannon', { range: 36, attacks: 'D3', rules: rules('Piercing') })], special: 'Armored, Git Shootaz, Tough(3)', upgrades: 'I', cost: 50 },
    { name: 'Deffkopta', size: 1, quality: '5+', equipment: [weapon('plasmagun'), meleeWeapon('Medium', 'CCW')], special: 'Armored, Fast, Fearless, Flying, Furious, Scout', upgrades: 'L', cost: 35 },
    { name: 'Warbuggy', size: 1, quality: '4+', equipment: [linked(weapon('grenade-launcher'))], special: 'Armored, Fast, Fearless, Tough(3)', upgrades: 'G, K', cost: 60 },
    { name: 'Killa Kan', size: 1, quality: '5+', equipment: [weapon('grenade-launcher'), meleeWeapon('Medium', 'CCW', { rules: rules('Piercing') })], special: 'Armored, Git Shootaz, Impact(D3), Tough(3)', upgrades: 'J, K', cost: 50 },
    { name: 'Deff Dred', size: 1, quality: '4+', equipment: [meleeWeapon('Light', 'Powerfist', { count: 4 })], special: 'Armored, Fearless, Impact(D3), Tough(6)', upgrades: 'D, K', cost: 95 },
    { name: 'Gorkanaut', size: 1, quality: '4+', equipment: [weapon('plasma-cannon'), linked(weapon('machinegun'), { count: 4 }), meleeWeapon('Master', 'Powerfist', { rules: rules('Shake') })], special: 'Armored, Fearless, Impact(D3), Tough(9), Transport(6)', upgrades: 'M', cost: 330 },
    { name: 'Trukk', size: 1, quality: '4+', equipment: [weapon('machinegun')], special: 'Fearless, Tough(3), Transport(11), Vehicle', upgrades: 'K', cost: 85 },
    { name: 'Battlewagon', size: 1, quality: '4+', equipment: [], special: 'Fearless, Tough(6), Transport(21), Vehicle', upgrades: 'C, K', cost: 105 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace one Medium CCW', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium Powerfist', cost: 10, addEquipment: [meleeWeapon('Medium', 'Powerfist')], removeOneEquipment: ['Medium CCW'] },
      ]),
      section('Replace one Pistol', 'one', [
        { label: 'Carbine', cost: 5, addEquipment: [weapon('carbine')], removeOneEquipment: ['Pistol'] },
        { label: 'Linked Carbine', cost: 10, addEquipment: [linked(weapon('carbine'))], removeOneEquipment: ['Pistol'] },
      ]),
      section(
        'Take one Carbine attachment',
        'one',
        [
          { label: 'Heavy Flamer (Limited)', cost: 5, addEquipment: [weapon('heavy-flamer', { rules: rules('Limited') })] },
          { label: 'Grenade Launcher (Limited)', cost: 5, addEquipment: [weapon('grenade-launcher', { rules: rules('Limited') })] },
        ],
        {
          requiresOneOfSelected: ['Carbine', 'Linked Carbine', 'Mega Armor (Armored, Linked Carbine, Medium Powerfist)'],
          satisfiedByEquipment: ['Linked Carbines'],
        },
      ),
      // Warbike/Mega Armor's parentheticals are descriptive flavor (already captured via
      // `adds`), not clean weapon-profile labels — left without equipment effects.
      section('Equip one model with any', 'any', [
        { label: 'Attack Squig (+1A in Melee)', cost: 5 },
        { label: 'Ammo Runt (may take three)', cost: 5, adds: ['Ammo Runt'] },
        { label: '‘Eavy Armor (Armored)', cost: 10, adds: ['Armored'] },
        { label: 'Cybork Body (Tough(+3))', cost: 10, adds: ['Tough(+3)'] },
        { label: 'Warbike (Fast, Linked Carbine)', cost: 10, adds: ['Fast'] },
        { label: 'Mega Armor (Armored, Linked Carbine, Medium Powerfist)', cost: 20, adds: ['Armored'] },
      ]),
    ]),
    group('B', [
      section('Upgrade Psyker(1)', 'one', [{ label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] }]),
    ]),
    group('C', [
      section('Take one', 'one', [
        { label: 'Kannon (36”, AD3p)', cost: 25, addEquipment: [customWeapon('Kannon', { range: 36, attacks: 'D3', rules: rules('Piercing') })] },
        { label: 'Lobba (48”, A3, Indirect)', cost: 45, addEquipment: [customWeapon('Lobba', { range: 48, attacks: '3', rules: rules('Indirect') })] },
        { label: 'Zzap Gun (36”, AD6x, Shake)', cost: 50, addEquipment: [customWeapon('Zzap Gun', { range: 36, attacks: 'D6', rules: rules('Piercing, Single Target, Shake') })] },
      ]),
      section('Take up to four', 'upToFour', [
        { label: 'Grenade Launcher', cost: 20, addEquipment: [weapon('grenade-launcher')] },
        { label: 'Machinegun', cost: 25, addEquipment: [weapon('machinegun')] },
      ]),
      section('Take one', 'one', [{ label: 'Killkannon (24”, A9x)', cost: 70, addEquipment: [customWeapon('Killkannon', { range: 24, attacks: '9', rules: rules('Piercing, Single Target') })] }]),
      // "Deff Rolla" grants the Reinforced Ram army rule/Impact(+D6) — an ability, not a weapon.
      section('Upgrade with', 'one', [
        { label: 'Deff Rolla (Reinforced Ram, Impact(+D6))', cost: 25 },
      ]),
    ]),
    group('D', [
      // Deff Dred is single-model but carries 4 copies of this weapon — additions only, no
      // removal (the canonical single-model-multi-copy edge case from the design doc).
      section('Replace up to two Light Powerfists', 'upToTwo', [
        { label: 'Grenade Launcher', cost: 10, addEquipment: [weapon('grenade-launcher')] },
        { label: 'Heavy Flamer', cost: 10, addEquipment: [weapon('heavy-flamer')] },
        { label: 'Plasmagun', cost: 20, addEquipment: [weapon('plasmagun')] },
        { label: 'Machinegun', cost: 20, addEquipment: [weapon('machinegun')] },
      ]),
    ]),
    group('E', [
      section('Upgrade all models with', 'one', [
        { label: '‘Eavy Armor (Armored)', cost: 15, adds: ['Armored'] },
      ]),
    ]),
    group('F', [
      section('Replace all Flamers', 'one', [
        { label: 'Grenade Launchers', cost: 0, addEquipment: [weapon('grenade-launcher', { label: 'Grenade Launchers' })], removeEquipment: ['Flamers'] },
        { label: 'Snazzguns (24”, AD6)', cost: 10, addEquipment: [customWeapon('Snazzguns', { range: 24, attacks: 'D6' })], removeEquipment: ['Flamers'] },
        { label: 'Deffguns (48”, AD3p)', cost: 60, addEquipment: [customWeapon('Deffguns', { range: 48, attacks: 'D3', rules: rules('Piercing') })], removeEquipment: ['Flamers'] },
      ]),
      section('Upgrade with one', 'one', [
        { label: 'Ammo Runt (may take five)', cost: 5, adds: ['Ammo Runt'] },
        { label: 'Bomb Squig (18”, A6x, Limited)', cost: 5, addEquipment: [customWeapon('Bomb Squig', { range: 18, attacks: '6', rules: rules('Piercing, Single Target, Limited') })] },
      ]),
      section('Replace up to two Grenade Launchers and Medium CCWs', 'upToTwo', [
        // Only "Medium CCW" is decremented here: a "Grenade Launchers" target would only
        // exist after a separate, earlier "Replace all Flamers: Grenade Launchers" swap in
        // this same group, which this section's single option can't distinguish from the
        // baseline "Medium CCWs" case without double-decrementing when both are present.
        { label: 'Tankhammer (A6x, Unwieldy)', cost: 0, addEquipment: [customWeapon('Tankhammer', { range: null, attacks: '6', rules: rules('Piercing, Single Target, Unwieldy') })], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('G', [
      section('Replace Linked Grenade Launcher', 'one', [
        {
          label: 'Heavy Flamer',
          cost: 5,
          addEquipment: [weapon('heavy-flamer')],
          removeOneEquipment: ['Linked Grenade Launcher'],
        },
        {
          label: 'Linked Machinegun',
          cost: 10,
          addEquipment: [linked(weapon('machinegun'))],
          removeOneEquipment: ['Linked Grenade Launcher'],
        },
      ]),
      section('Upgrade with', 'one', [{ label: 'Trakked (Strider)', cost: 5, adds: ['Strider'] }]),
    ]),
    group('H', [
      section('Replace all Pistols', 'one', [
        { label: 'Carbines', cost: 10, addEquipment: [weapon('carbine', { label: 'Carbines' })], removeEquipment: ['Pistols'] },
      ]),
      section('Replace one Pistol', 'one', [
        { label: 'Grenade Launcher', cost: 10, addEquipment: [weapon('grenade-launcher')], removeOneEquipment: ['Pistol'] },
        { label: 'Machinegun', cost: 15, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Pistol'] },
      ]),
      section('Upgrade all models with any', 'any', [
        { label: '‘Eavy Armor (Armored)', cost: 30, adds: ['Armored'] },
        { label: 'Rokkit Packs (Deep Strike, Flying)', cost: 40, adds: ['Deep Strike', 'Flying'] },
      ]),
    ]),
    group('I', [
      section('Replace Kannon', 'one', [
        {
          label: 'Smasha Gun (36”, AD6x)',
          cost: 10,
          addEquipment: [customWeapon('Smasha Gun', { range: 36, attacks: 'D6', rules: rules('Piercing, Single Target') })],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
        {
          label: 'Plasma Cannon',
          cost: 15,
          addEquipment: [weapon('plasma-cannon')],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
        {
          label: 'Traktor Kannon (36”, A3x, Shake)',
          cost: 15,
          addEquipment: [customWeapon('Traktor Kannon', { range: 36, attacks: '3', rules: rules('Piercing, Single Target, Shake') })],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
        {
          label: 'Zzap Gun (36”, AD6x, Shake)',
          cost: 20,
          addEquipment: [customWeapon('Zzap Gun', { range: 36, attacks: 'D6', rules: rules('Piercing, Single Target, Shake') })],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
        {
          label: 'Lobba (48”, A3, Indirect)',
          cost: 20,
          addEquipment: [customWeapon('Lobba', { range: 48, attacks: '3', rules: rules('Indirect') })],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
        {
          label: 'Bubblechukka (36”, AD6+6)',
          cost: 60,
          addEquipment: [customWeapon('Bubblechukka', { range: 36, attacks: 'D6+6' })],
          removeOneEquipment: ['Kannon (36”, AD3p)'],
        },
      ]),
    ]),
    group('J', [
      section('Replace Grenade Launcher', 'one', [
        {
          label: 'Heavy Flamer',
          cost: 10,
          addEquipment: [weapon('heavy-flamer')],
          removeOneEquipment: ['Grenade Launcher'],
        },
        {
          label: 'Plasmagun',
          cost: 10,
          addEquipment: [weapon('plasmagun')],
          removeOneEquipment: ['Grenade Launcher'],
        },
        {
          label: 'Machinegun',
          cost: 10,
          addEquipment: [weapon('machinegun')],
          removeOneEquipment: ['Grenade Launcher'],
        },
        {
          label: 'Grotzooka (18”, A6p)',
          cost: 25,
          addEquipment: [customWeapon('Grotzooka', { range: 18, attacks: '6', rules: rules('Piercing') })],
          removeOneEquipment: ['Grenade Launcher'],
        },
      ]),
    ]),
    group('K', [
      // All utility/ability grants (army rules or unmodeled abilities), not weapons.
      section('Upgrade with any', 'any', [
        { label: 'Red Paint Job (Fast)', cost: 5, adds: ['Fast'] },
        { label: 'Grot Riggers (Mek Tools)', cost: 5 },
        { label: 'Boarding Plank', cost: 10, adds: ['Boarding Plank'] },
        { label: 'Grabbin Klaw (Shake in Melee)', cost: 10 },
        { label: 'Reinforced Ram', cost: 10, adds: ['Reinforced Ram'] },
        { label: 'Wreckin’ Ball (Impact(+D6))', cost: 10 },
        { label: '‘Ard Case (Tough(+3))', cost: 25, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('L', [
      section('Replace Plasmagun', 'one', [
        {
          label: 'Linked Grenade Launcher',
          cost: 0,
          addEquipment: [linked(weapon('grenade-launcher'))],
          removeOneEquipment: ['Plasmagun'],
        },
        {
          label: 'Linked Machinegun',
          cost: 10,
          addEquipment: [linked(weapon('machinegun'))],
          removeOneEquipment: ['Plasmagun'],
        },
      ]),
      section('Replace Medium CCW', 'one', [
        {
          label: 'Medium Powerfist',
          cost: 10,
          addEquipment: [meleeWeapon('Medium', 'Powerfist')],
          removeOneEquipment: ['Medium CCW'],
        },
      ]),
      // "Bigbomm" is a once-per-game dropped-bomb ability (see armyRules), not carried equipment.
      section('Take one', 'one', [{ label: 'Bigbomm', cost: 5, adds: ['Bigbomm'] }]),
    ]),
    group('M', [
      section('Replace Plasma Cannon', 'one', [
        {
          label: 'Mega-Shoota (36”, A3D6p)',
          cost: 100,
          addEquipment: [customWeapon('Mega-Shoota', { range: 36, attacks: '3D6', rules: rules('Piercing') })],
          removeOneEquipment: ['Plasma Cannon'],
        },
      ]),
      // Gorkanaut is single-model but carries 4 copies of this weapon — additions only, no removal.
      section('Replace 2x Linked Machineguns', 'one', [
        { label: '2x Linked Grenade Launchers', cost: 0, addEquipment: [linked(weapon('grenade-launcher'), { count: 2 })] },
      ]),
      section('Take one', 'one', [
        { label: 'Heavy Flamer', cost: 25, addEquipment: [weapon('heavy-flamer')] },
        { label: 'Plasmagun', cost: 25, addEquipment: [weapon('plasmagun')] },
      ]),
      // References the Kustom Force Field army rule (ability), not a weapon.
      section('Upgrade with', 'one', [{ label: 'Kustom Force Field', cost: 75, adds: ['Kustom Force Field'] }]),
    ]),
    group('N', [
      section('Replace Pistol', 'one', [
        { label: 'Plasmagun', cost: 15, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Pistol'] },
        // Kustom Force Field / Shokk Attack Gun are army-rule-driven abilities, not plain
        // stat-carrying weapons as authored — left without an equipment effect, but declare
        // the army rule they grant.
        { label: 'Kustom Force Field', cost: 55, adds: ['Kustom Force Field'] },
        { label: 'Shokk Attack Gun', cost: 80, adds: ['Shokk Attack Gun'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Ammo Runt', 'Place an Ammo Runt model next to this model. Once per game you may remove the Ammo Runt to give this model the Linked rule.'),
    armyRule('Bigbomm', 'When this unit flies over enemy units it may drop a Bigbomm (0”, A9, Limited).'),
    armyRule('Boarding Plank', 'If this unit Assaults an enemy whilst transporting units it gets Impact(+D6).'),
    armyRule('Dok Tools', 'This model may be deployed as part of a unit of same Quality. The unit gets Regeneration.'),
    armyRule('Git Shootaz', 'This unit shoots at Quality 4+.'),
    armyRule('Kustom Force Field', 'This model and all friendly Infantry units within 6” get Regeneration.'),
    armyRule('Mek Tools', 'Once per turn, if this unit is inside or within 2” of a Vehicle, it may try to repair it. Roll one die, on a 4+ the vehicle stops being immobile.'),
    armyRule('Reinforced Ram', 'This unit gets Strider and when using Assault actions it may re-roll all failed blocks.'),
    armyRule('Runtherd', 'This model may be deployed as part of a Gretchin unit. This model and its unit take morale tests at Quality 5+.'),
    armyRule('Shake', 'Whenever this weapon hits an enemy unit roll one die. On a 4+ the target may not move until the end of its next activation.'),
    armyRule('Shokk Attack Gun', 'When shooting the Shokk Attack Gun (48”, A2D6p), if you roll double 1 the Big Mek and his unit is removed from play, if you roll double 2 the target unit is removed from play.'),
    armyRule('Waagh!', 'Once per game you may declare Waagh! during your turn. All friendly Infantry units move +3” when using Walk actions or +6” when using Run/Assault actions until the end of the round.'),
  ],
  psychicPowers: [
    power('‘Eadbanger', 7, 'Target enemy model within 24” takes D3x automatic hits.'),
    power('Power Vomit', 8, 'Target enemy unit within 12” takes D6p automatic hits.'),
    power('Frazzle', 8, 'Target enemy unit within 18” takes D6 automatic hits.'),
    power('Da Jump', 8, 'The psyker and his unit may immediately Deep Strike anywhere on the table.'),
    power('Warpath', 8, 'The psyker and his unit get +1A in Melee until the end of the round.'),
    power('Da Krunch', 13, 'Target enemy unit within 24” takes D6+3p automatic hits.'),
  ],
})
