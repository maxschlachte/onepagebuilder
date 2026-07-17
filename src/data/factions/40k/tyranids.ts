// Tyranids — transcribed from the rulebook PDF (page 12),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, linked, meleeWeapon, power, rules, section, weapon } from '../helpers.ts'

export const tyranids = faction({
  id: 'tyranids',
  name: 'Tyranids',
  units: [
    { name: 'Hive Tyrant', size: 1, quality: '3+', equipment: [meleeWeapon('Force', 'Claw', { label: 'Force Claws', rules: rules('Piercing') })], special: 'Hero, Monster, Psyker(2), Synapse, Tough(3)', upgrades: 'A, B, C, D, G', cost: 125 },
    { name: 'Tervigon', size: 1, quality: '3+', equipment: [gear('Spawn'), customWeapon('Stinger Salvo', { range: 18, attacks: '4' }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Hero, Monster, Psyker(1), Synapse, Tough(6)', upgrades: 'C, D, J', cost: 225 },
    { name: 'Tyranid Prime', size: 1, quality: '3+', equipment: [linked(weapon('pistol')), meleeWeapon('Master', 'Claw', { label: 'Master Claws' })], special: 'Hero, Synapse, Tough(3)', upgrades: 'B, E, C, K', cost: 75 },
    { name: 'Tyranid Warriors', size: 3, quality: '3+', equipment: [linked(weapon('pistol'), { label: 'Linked Pistols' }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Synapse, Tough(3)', upgrades: 'A, B, E, K, L, R', cost: 145 },
    { name: 'Genestealers', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Rending') })], special: 'Scout, Strider', upgrades: 'L, M', cost: 140 },
    { name: 'Termagants', size: 10, quality: '5+', equipment: [weapon('pistol', { label: 'Pistols' })], special: 'Strider', upgrades: 'L, N', cost: 90 },
    { name: 'Hormagaunts', size: 10, quality: '5+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Fast, Strider', upgrades: 'L', cost: 110 },
    { name: 'Gargoyles', size: 10, quality: '5+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Light', 'Claw', { label: 'Light Claws', rules: rules('Poison') })], special: 'Deep Strike, Flying', upgrades: 'L', cost: 115 },
    { name: 'Ripper Swarms', size: 3, quality: '6+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws' })], special: 'Fearless, Tough(3)', upgrades: 'L, O', cost: 35 },
    { name: 'Tyrant Guard', size: 3, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Rending') })], special: 'Armored, Tough(3)', upgrades: 'B, C', cost: 140 },
    { name: 'Hive Guard', size: 3, quality: '3+', equipment: [customWeapon('Impalers', { range: 24, attacks: '2', rules: rules('Piercing, Indirect') }), meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Armored, Tough(3)', upgrades: 'C, P', cost: 215 },
    { name: 'Zoanthropes', size: 3, quality: '3+', equipment: [meleeWeapon('Light', 'Claw', { label: 'Light Claws' })], special: 'Brothers, Synapse, Tough(3)', upgrades: '-', cost: 130 },
    { name: 'Venomthropes', size: 3, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Poison') }), gear('Lash Whips', { rules: rules('Fear') })], special: 'Spore Cloud, Tough(3)', upgrades: '-', cost: 145 },
    { name: 'Raveners', size: 3, quality: '3+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws' })], special: 'Deep Strike, Fast, Strider, Tough(3)', upgrades: 'Q', cost: 150 },
    { name: 'Lictor', size: 1, quality: '3+', equipment: [customWeapon('Flesh Hooks', { range: 6, attacks: '2' }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing, Rending') })], special: 'Deep Strike, Fast, Fear, Scout, Stealth, Strider, Tough(3)', upgrades: '-', cost: 75 },
    { name: 'Pyrovore', size: 1, quality: '4+', equipment: [weapon('flamer'), meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Poison') })], special: 'Acid Blood, Tough(3)', upgrades: '-', cost: 45 },
    { name: 'Biovore', size: 1, quality: '4+', equipment: [gear('Mine Launcher'), meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Tough(3)', upgrades: '-', cost: 85 },
    { name: 'Spore Mines', size: 3, quality: '6+', equipment: [gear('Explosive Head')], special: 'Deep Strike, Float', upgrades: '-', cost: 20 },
    { name: 'Mucolid Spore', size: 1, quality: '6+', equipment: [gear('Explosive Head')], special: 'Deep Strike, Float, Stealth, Tough(3)', upgrades: '-', cost: 20 },
    { name: 'Carnifex', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws', rules: rules('Piercing, Rending') })], special: 'Monster, Tough(3)', upgrades: 'A, C, I', cost: 70 },
    { name: 'Haruspex', size: 1, quality: '4+', equipment: [customWeapon('Grasping Tongue', { range: 12, attacks: '1', rules: rules('Piercing, Sniper') }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Acid Blood, Monster, Tough(6)', upgrades: 'C', cost: 100 },
    { name: 'Exocrine', size: 1, quality: '4+', equipment: [customWeapon('Bio-Cannon', { range: 24, attacks: '9', rules: rules('Piercing') }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Monster, Tough(6)', upgrades: '-', cost: 160 },
    { name: 'Mawloc', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Devour, Monster, Tough(6)', upgrades: 'C', cost: 90 },
    { name: 'Trygon', size: 1, quality: '4+', equipment: [customWeapon('Bio-Pulse', { range: 12, attacks: '6' }), meleeWeapon('Force', 'Claw', { label: 'Force Claws', rules: rules('Piercing') })], special: 'Deep Strike, Monster, Tough(6)', upgrades: 'C', cost: 110 },
    { name: 'Maleceptor', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Monster, Psyker(2), Synapse, Tough(6)', upgrades: '-', cost: 130 },
    { name: 'Toxicrene', size: 1, quality: '4+', equipment: [customWeapon('Choking Cloud', { range: 12, attacks: '9', rules: rules('Poison') }), meleeWeapon('Force', 'Claw', { label: 'Force Claws', rules: rules('Poison') })], special: 'Acid Blood, Monster, Stealth, Tough(6)', upgrades: '-', cost: 135 },
    { name: 'Tyrannofex', size: 1, quality: '4+', equipment: [customWeapon('Acid Spray', { range: 18, attacks: '6', rules: rules('Piercing') }), customWeapon('Stinger Salvo', { range: 18, attacks: '4' }), meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws', rules: rules('Piercing') })], special: 'Monster, Tough(6)', upgrades: 'C, D, F', cost: 140 },
    { name: 'Tyranid Cyst', size: 1, quality: '4+', equipment: [customWeapon('Deathspitters', { range: 18, attacks: '3', rules: rules('Piercing') }, { count: 5 })], special: 'Armored, Deep Strike, Fearless, Float, Tough(6)', upgrades: 'H', cost: 165 },
  ],
  upgradeGroups: [
    group('A', [
      section('Upgrade one model with one', 'one', [
        { label: 'Venom Cannon', cost: 55, addEquipment: [customWeapon('Venom Cannon', { range: 36, attacks: '3', rules: rules('Piercing') })] },
        { label: 'Barbed Strangler', cost: 110, addEquipment: [customWeapon('Barbed Strangler', { range: 36, attacks: '9' })] },
      ]),
    ]),
    group('B', [
      // Skipped: every option's parenthetical is a melee rule *phrase* ("Rending in
      // Melee", "Deadly in Melee", ...), not a weapon profile or a known weapon name —
      // no resolvable equipment effect to record.
      section('Upgrade any model with one', 'one', [
        { label: 'Rending Claws (Rending in Melee)', cost: 10 },
        { label: 'Boneswords (Deadly in Melee)', cost: 35 },
        { label: 'Lash Whip and Bonesword (Fear and Deadly in Melee)', cost: 40 },
      ]),
    ]),
    group('C', [
      section('Upgrade with any', 'any', [
        { label: 'Toxin Sacs (Poison in Melee)', cost: 5 },
        { label: 'Adrenal Glands (Furious)', cost: 5, adds: ['Furious'] },
        { label: 'Acid Blood', cost: 5, adds: ['Acid Blood'] },
        { label: 'Regeneration', cost: 20, adds: ['Regeneration'] },
      ]),
    ]),
    group('D', [
      // Skipped: nested-parenthetical naming ("Flamer (Rending)"/"Flamer (Haywire)"
      // inside the option's own parens) has the same non-resolving-rule risk as group B.
      section('Take one', 'one', [
        { label: 'Desiccator (Flamer (Rending))', cost: 40 },
        { label: 'Electroshock (Flamer (Haywire))', cost: 50 },
      ]),
    ]),
    group('E', [
      section('Replace any Linked Pistol', 'any', [
        { label: 'Scything Talons (+1A in Melee)', cost: 0 },
        {
          label: 'Devourer',
          cost: 15,
          addEquipment: [customWeapon('Devourer', { range: 18, attacks: '3' })],
          removeOneEquipment: ['Linked Pistol'],
        },
        {
          label: 'Deathspitter',
          cost: 20,
          addEquipment: [customWeapon('Deathspitter', { range: 18, attacks: '3', rules: rules('Piercing') })],
          removeOneEquipment: ['Linked Pistol'],
        },
      ]),
    ]),
    group('F', [
      section('Replace Acid Spray', 'one', [
        {
          label: 'Rupture Cannon',
          cost: 0,
          addEquipment: [customWeapon('Rupture Cannon', { range: 48, attacks: '2', rules: rules('Piercing, Rending') })],
          removeEquipment: ['Acid Spray (18”, A6p)'],
        },
        {
          label: 'Fleshborerer Hive',
          cost: 50,
          addEquipment: [customWeapon('Fleshborerer Hive', { range: 18, attacks: '20' })],
          removeEquipment: ['Acid Spray (18”, A6p)'],
        },
      ]),
    ]),
    group('G', [
      section('Upgrade with any', 'any', [
        { label: 'Wings (Flying)', cost: 5, adds: ['Flying'] },
        { label: 'Prehensile Pincer (+1A in Melee)', cost: 5 },
      ]),
    ]),
    group('H', [
      // Section title names the exact baseline quantity ("5x Deathspitters" = all of
      // Tyranid Cyst's `5x Deathspitters`), so this is a full swap despite size 1.
      section('Replace 5x Deathspitters', 'one', [
        {
          label: '5x Venom Cannons',
          cost: 100,
          addEquipment: [customWeapon('Venom Cannons', { range: 36, attacks: '3', rules: rules('Piercing') }, { count: 5 })],
          removeEquipment: ['5x Deathspitters (18”, A3p)'],
        },
        {
          label: '5x Barbed Stranglers',
          cost: 305,
          addEquipment: [customWeapon('Barbed Stranglers', { range: 36, attacks: '9' }, { count: 5 })],
          removeEquipment: ['5x Deathspitters (18”, A3p)'],
        },
      ]),
      section('Upgrade with one', 'one', [
        { label: 'Tyrannocyte (Transport(21))', cost: 40, adds: ['Transport(21)'] },
        { label: 'Sporocyst', cost: 60, addEquipment: [gear('Sporocyst', { rules: rules('Mine Launcher') })] },
      ]),
    ]),
    group('I', [
      section('Take one', 'one', [
        { label: 'Spine Banks', cost: 5, addEquipment: [customWeapon('Spine Banks', { range: 6, attacks: '3' })] },
        { label: 'Bio-Plasma', cost: 15, addEquipment: [customWeapon('Bio-Plasma', { range: 12, attacks: '3', rules: rules('Piercing') })] },
      ]),
    ]),
    group('J', [
      section('Upgrade with', 'one', [{ label: 'Crushing Claws (Piercing in Melee)', cost: 5 }]),
      section('Replace Stinger Salvo', 'one', [
        {
          label: 'Cluster Spines',
          cost: 30,
          addEquipment: [customWeapon('Cluster Spines', { range: 18, attacks: '9' })],
          removeEquipment: ['Stinger Salvo (18”, A4)'],
        },
      ]),
    ]),
    group('K', [
      section('Upgrade any model with', 'any', [
        { label: 'Flesh Hooks', cost: 5, addEquipment: [customWeapon('Flesh Hooks', { range: 6, attacks: '2' })] },
      ]),
    ]),
    group('L', [
      section('Upgrade all models with any', 'any', [
        { label: 'Toxin Sacs (Poison in Melee)', cost: 5 },
        { label: 'Adrenal Glands (Furious)', cost: 10, adds: ['Furious'] },
      ]),
    ]),
    group('M', [
      section('Upgrade any model with', 'any', [{ label: 'Scything Talons (+1A in Melee)', cost: 5 }]),
      section('Upgrade one model with', 'one', [
        { label: 'Broodlord (+2A in Melee, Psyker(1), Tough(3))', cost: 45 },
      ]),
    ]),
    group('N', [
      section('Replace one Pistol', 'one', [
        {
          label: 'Strangleweb',
          cost: 15,
          addEquipment: [customWeapon('Strangleweb', { range: 12, attacks: '1', rules: rules('Target takes Morale Test') })],
          removeOneEquipment: ['Pistols'],
        },
      ]),
      section('Replace any Pistol', 'any', [
        {
          label: 'Linked Pistol',
          cost: 5,
          addEquipment: [linked(weapon('pistol'))],
          removeOneEquipment: ['Pistols'],
        },
        {
          label: 'Spike Rifle',
          cost: 5,
          addEquipment: [customWeapon('Spike Rifle', { range: 18, attacks: '1' })],
          removeOneEquipment: ['Pistols'],
        },
        {
          label: 'Devourer',
          cost: 10,
          addEquipment: [customWeapon('Devourer', { range: 18, attacks: '3' })],
          removeOneEquipment: ['Pistols'],
        },
      ]),
    ]),
    group('O', [
      section('Upgrade all models with any', 'any', [
        { label: 'Deep Strike', cost: 5, adds: ['Deep Strike'] },
        { label: 'Linked Pistols', cost: 5, addEquipment: [linked(weapon('pistol'), { label: 'Linked Pistols' })] },
      ]),
    ]),
    group('P', [
      section('Replace any Impaler', 'any', [
        {
          label: 'Shockcannon',
          cost: 5,
          addEquipment: [customWeapon('Shockcannon', { range: 18, attacks: '3', rules: rules('Haywire') })],
          removeOneEquipment: ['Impalers (24”, A2p, Indirect)'],
        },
      ]),
    ]),
    group('Q', [
      section('Upgrade any model with', 'any', [{ label: 'Rending Claws (Rending in Melee)', cost: 10 }]),
      section('Upgrade any model with one', 'one', [
        { label: 'Linked Pistols', cost: 5, addEquipment: [linked(weapon('pistol'), { label: 'Linked Pistols' })] },
        { label: 'Devourer', cost: 20, addEquipment: [customWeapon('Devourer', { range: 18, attacks: '3' })] },
        { label: 'Deathspitter', cost: 25, addEquipment: [customWeapon('Deathspitter', { range: 18, attacks: '3', rules: rules('Piercing') })] },
      ]),
    ]),
    group('R', [
      section('Upgrade all models with', 'one', [
        { label: 'Shrikes (Deep Strike, Flying)', cost: 25, adds: ['Deep Strike', 'Flying'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Acid Blood', 'Whenever this model takes wounds in Melee the attacker takes 1 automatic hit.'),
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Devour', 'This unit may Deep Strike up to 1” away from enemy units. All enemy units within 3” when the unit is placed take D6 hits with Piercing.'),
    armyRule('Explosive Head', 'When engaged in Melee this model is immediately killed and the enemy takes D3 hits for Spore Mines or D3p hits for Mucolid Spores.'),
    armyRule('Float', 'This unit moves 3” when using Walk actions and 6” when using Run/Assault actions, and it has the Strider special rule.'),
    armyRule('Haywire', 'When hitting Vehicles this weapon ignores Armored and is only blocked on rolls of 6.'),
    armyRule('Mine Launcher', 'After this unit has moved, you may target one enemy unit within 48” and roll one die. On a 4+ the target takes D3+3 automatic hits, else you may Deep Strike a unit of 3 Spore Mines or 1 Mucolid Spore exactly 6” away from the target.'),
    armyRule('Monster', 'This unit has the Armored, Fear, Fearless and Impact(D3) special rules.'),
    armyRule('Spawn', 'After this unit has moved, you may place a new unit of 2D6 Termagants fully within 6” of it.'),
    armyRule('Spore Cloud', 'This unit and all friendly units within 6” get the Stealth special rule.'),
    armyRule('Synapse', 'When taking morale tests this unit and all friendly units within 12” roll one extra die and pick the highest result.'),
    armyRule('Target takes Morale Test', 'The unit hit by this weapon must take a morale test.'),
  ],
  psychicPowers: [
    power('Psychic Scream', 6, 'All enemy units within 6” must take a morale test. If failed they take D3 automatic wounds.'),
    power('Catalyst', 8, 'The psyker, his unit and one friendly unit within 12” get the Regeneration special rule until the end of the round.'),
    power('Warp Blast', 8, 'Target enemy unit within 24” takes D3p automatic hits.'),
    power('Horror', 9, 'Target enemy unit within 24” must take a morale test and re-roll if successful.'),
    power('Onslaught', 9, 'Target friendly unit within 24” may shoot after using Run actions until the end of the round.'),
    power('Paroxysm', 13, 'Target enemy unit within 24” must re-roll successful shooting and melee attacks until the end of the round.'),
  ],
})
