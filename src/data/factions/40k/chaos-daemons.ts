// Chaos Daemons — transcribed from the rulebook PDF (page 14),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, meleeWeapon, power, rules, section, weapon } from '../helpers.ts'

export const chaosDaemons = faction({
  id: 'chaos-daemons',
  name: 'Chaos Daemons',
  units: [
    { name: 'Bloodthirster', size: 1, quality: '2+', equipment: [customWeapon('Lash', { range: 12, attacks: '1', rules: rules('Piercing') }), customWeapon('Axe', { range: null, attacks: '6', rules: rules('Piercing, Deadly') })], special: 'Armored, Deep Strike, Fear, Flying, Furious, Hero, Impact(D3), Tough(6)', upgrades: '-', cost: 205 },
    { name: 'Lord of Change', size: 1, quality: '2+', equipment: [meleeWeapon('Force', 'CCW', { rules: rules('Piercing') })], special: 'Armored, Deep Strike, Fear, Flying, Hero, Impact(D3), Psyker(2), Tough(6)', upgrades: 'A', cost: 160 },
    { name: 'Great Unclean One', size: 1, quality: '2+', equipment: [meleeWeapon('Force', 'CCW', { rules: rules('Poison') })], special: 'Armored, Deep Strike, Fear, Hero, Impact(D3), Psyker(1), Stealth, Tough(6)', upgrades: 'A', cost: 155 },
    { name: 'Keeper of Secrets', size: 1, quality: '2+', equipment: [meleeWeapon('Force', 'CCW', { rules: rules('Piercing') })], special: 'Armored, Deep Strike, Fast, Fear, Hero, Impact(D3), Psyker(1), Tough(6)', upgrades: 'A', cost: 150 },
    { name: 'Daemon Prince', size: 1, quality: '2+', equipment: [meleeWeapon('Force', 'Powersword')], special: 'Armored, Deep Strike, Fear, Hero, Impact(D3), Tough(3)', upgrades: 'M, N', cost: 90 },
    { name: 'Herald of Khorne', size: 1, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW')], special: 'Deep Strike, Furious, Hero, Tough(3)', upgrades: 'B', cost: 40 },
    { name: 'Herald of Tzeentch', size: 1, quality: '5+', equipment: [meleeWeapon('Medium', 'CCW')], special: 'Deep Strike, Hero, Horrors, Psyker(1), Tough(3)', upgrades: 'C', cost: 35 },
    { name: 'Herald of Nurgle', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'CCW', { rules: rules('Poison') })], special: 'Deep Strike, Hero, Psyker(1), Stealth, Tough(3)', upgrades: 'D', cost: 55 },
    { name: 'Herald of Slaanesh', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Deep Strike, Fast, Hero, Psyker(1), Tough(3)', upgrades: 'G', cost: 55 },
    { name: 'Bloodletters', size: 5, quality: '3+', equipment: [meleeWeapon('Light', 'CCW', { label: 'Light CCWs' })], special: 'Deep Strike, Furious', upgrades: 'E, H', cost: 90 },
    { name: 'Pink Horrors', size: 5, quality: '5+', equipment: [meleeWeapon('Light', 'Claw', { label: 'Light Claws' })], special: 'Deep Strike, Horrors', upgrades: 'E, I', cost: 45 },
    { name: 'Plaguebearers', size: 5, quality: '4+', equipment: [meleeWeapon('Light', 'CCW', { label: 'Light CCWs', rules: rules('Poison') })], special: 'Deep Strike, Stealth', upgrades: 'E, J', cost: 75 },
    { name: 'Daemonettes', size: 5, quality: '4+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Deep Strike, Fast', upgrades: 'E, K', cost: 90 },
    { name: 'Nurglings', size: 3, quality: '5+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws' })], special: 'Deep Strike, Scout, Stealth, Tough(3)', upgrades: '-', cost: 85 },
    { name: 'Bloodcrushers', size: 3, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs' })], special: 'Deep Strike, Fast, Furious, Impact(1), Tough(3)', upgrades: 'E, H', cost: 145 },
    { name: 'Flamers', size: 3, quality: '3+', equipment: [weapon('flamer', { label: 'Flamers' }), meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Deep Strike, Flying, Tough(3)', upgrades: '-', cost: 190 },
    { name: 'Nurgle Beast', size: 1, quality: '4+', equipment: [customWeapon('Tongue', { range: null, attacks: 'D6+1', rules: rules('Poison') })], special: 'Deep Strike, Fast, Regeneration, Stealth, Strider, Tough(3)', upgrades: '-', cost: 60 },
    { name: 'Fiends', size: 3, quality: '3+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Deep Strike, Fast, Fear, Strider, Tough(3)', upgrades: '-', cost: 150 },
    { name: 'Flesh Hounds', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws' })], special: 'Deep Strike, Fast, Furious, Scout, Strider, Tough(3)', upgrades: '-', cost: 220 },
    { name: 'Screamers', size: 3, quality: '4+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Deep Strike, Fast, Impact(D3), Strider, Tough(3)', upgrades: '-', cost: 120 },
    { name: 'Plague Drones', size: 3, quality: '4+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs', rules: rules('Poison') })], special: 'Deep Strike, Fast, Flying, Impact(1), Stealth, Tough(3)', upgrades: 'E, J, L', cost: 140 },
    { name: 'Chaos Furies', size: 5, quality: '4+', equipment: [meleeWeapon('Light', 'Claw', { label: 'Light Claws' })], special: 'Deep Strike, Flying', upgrades: 'M', cost: 75 },
    { name: 'Seekers', size: 5, quality: '4+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Deep Strike, Fast, Impact(1), Scout', upgrades: 'E, K', cost: 120 },
    { name: 'Soul Grinder', size: 1, quality: '4+', equipment: [customWeapon('Harvester Cannon', { range: 48, attacks: '3', rules: rules('Piercing') }), meleeWeapon('Master', 'Powerfist')], special: 'Armored, Deep Strike, Impact(D3), Tough(6)', upgrades: 'M, O', cost: 145 },
    { name: 'Blood Throne', size: 1, quality: '3+', equipment: [], special: 'Deep Strike, Tough(6), Transport(1), Vehicle', upgrades: '-', cost: 75 },
    { name: 'Skull Cannon', size: 1, quality: '3+', equipment: [customWeapon('Skull Cannon', { range: 36, attacks: '9', rules: rules('Piercing') })], special: 'Deep Strike, Tough(6), Vehicle', upgrades: '-', cost: 235 },
    { name: 'Burning Chariot', size: 1, quality: '3+', equipment: [customWeapon('Fire of Tzeentch', { range: 18, attacks: '6', rules: rules('Piercing') })], special: 'Deep Strike, Fast, Tough(3), Vehicle', upgrades: 'F', cost: 100 },
    { name: 'Seeker Chariot', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Deep Strike, Fast, Tough(3), Vehicle', upgrades: 'P', cost: 45 },
  ],
  upgradeGroups: [
    group('A', [
      section(
        'Upgrade Psyker(1)',
        'one',
        [
          { label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] },
          { label: 'Psyker(3)', cost: 10, adds: ['Psyker(3)'] },
        ],
        { prerequisite: { requiresBaselineRule: ['Psyker(1)'] } },
      ),
      section('Upgrade Psyker(2)', 'one', [{ label: 'Psyker(3)', cost: 5, adds: ['Psyker(3)'] }], {
        prerequisite: { requiresBaselineRule: ['Psyker(2)'] },
      }),
    ]),
    group('B', [
      section('Take one', 'one', [
        { label: 'Locus of Fury (+1A in Melee when assaulting)', cost: 15 },
        { label: 'Locus of Wrath (Linked)', cost: 25, adds: ['Linked'] },
        { label: 'Locus of Abjuration (Fearless)', cost: 35, adds: ['Fearless'] },
      ]),
    ]),
    group('C', [
      section('Take one', 'one', [
        { label: 'Locus of Conjuration (Psychic Powers get Piercing)', cost: 10 },
        { label: 'Locus of Transmogrification (place D3 Horrors markers)', cost: 10 },
        { label: 'Locus of Change (Piercing in Melee on 4+)', cost: 15 },
      ]),
    ]),
    group('D', [
      section('Take one', 'one', [
        { label: 'Locus of Virulence (Rending)', cost: 25, adds: ['Rending'] },
        { label: 'Locus of Contagion (Impact(1))', cost: 25, adds: ['Impact(1)'] },
        { label: 'Locus of Fecundity (Regeneration)', cost: 30, adds: ['Regeneration'] },
      ]),
    ]),
    group('E', [section('Take one', 'one', [{ label: 'Chaos Icon (Beacon)', cost: 10, adds: ['Beacon'] }])]),
    group('F', [
      section('Upgrade with', 'one', [
        { label: 'Horror Crew', cost: 25 },
      ]),
    ]),
    group('G', [
      section('Take one', 'one', [
        { label: 'Locus of Grace (Strider)', cost: 15, adds: ['Strider'] },
        { label: 'Locus of Beguilement (Linked)', cost: 25, adds: ['Linked'] },
        { label: 'Locus of Swiftness (Fear)', cost: 25, adds: ['Fear'] },
      ]),
    ]),
    group('H', [
      section('Take one', 'one', [{ label: 'Blood Banner', cost: 10 }]),
    ]),
    group('I', [
      section('Take one', 'one', [
        { label: 'Blasted Standard (targets of Psychic Powers take D3 hits)', cost: 10 },
        { label: 'Brothers', cost: 15, adds: ['Brothers'] },
      ]),
    ]),
    group('J', [
      section('Take one', 'one', [{ label: 'Plague Banner (Rending in Melee)', cost: 15 }]),
    ]),
    group('K', [
      section('Take one', 'one', [
        { label: 'Rapturous Standard (enemies get Unwieldy in Melee)', cost: 40 },
      ]),
    ]),
    group('L', [
      // "Equip all models with" is unconditional (every model in the unit swaps), like a
      // "Replace all X" section, regardless of unit size.
      section('Equip all models with one', 'one', [
        { label: 'Death’s Heads', cost: 25, addEquipment: [customWeapon('Death’s Heads', { range: 12, attacks: '2', rules: rules('Poison') })], removeEquipment: ['Heavy CCWs (Poison)'] },
        { label: 'Rot Proboscis', cost: 25, addEquipment: [gear('Rot Proboscis', { rules: rules('Rending') })], removeEquipment: ['Heavy CCWs (Poison)'] },
        { label: 'Venom Sting', cost: 80, addEquipment: [gear('Venom Sting', { rules: rules('Deadly') })], removeEquipment: ['Heavy CCWs (Poison)'] },
      ]),
    ]),
    group('M', [
      section('Upgrade all models with one', 'one', [
        { label: 'Khorne (Furious)', cost: 10, adds: ['Furious'] },
        { label: 'Nurgle (Stealth)', cost: 10, adds: ['Stealth'] },
        { label: 'Slaneesh (Fast)', cost: 15, adds: ['Fast'] },
        { label: 'Tzeentch (Brothers)', cost: 15, adds: ['Brothers'] },
      ]),
    ]),
    group('N', [
      section('Upgrade with', 'one', [{ label: 'Wings (Fast, Flying)', cost: 10, adds: ['Fast', 'Flying'] }]),
      section('Take one', 'one', [
        { label: 'Psyker(1)', cost: 15, adds: ['Psyker(1)'] },
        { label: 'Psyker(2)', cost: 25, adds: ['Psyker(2)'] },
        { label: 'Psyker(3)', cost: 30, adds: ['Psyker(3)'] },
      ]),
    ]),
    group('O', [
      section('Take one', 'one', [
        { label: 'Baleful Torrent', cost: 40, addEquipment: [customWeapon('Baleful Torrent', { range: 18, attacks: '6', rules: rules('Piercing') })] },
        { label: 'Warp Gaze', cost: 45, addEquipment: [customWeapon('Warp Gaze', { range: 24, attacks: '6', rules: rules('Piercing, Single Target') })] },
        { label: 'Phlegm Bombardment', cost: 120, addEquipment: [customWeapon('Phlegm Bombardment', { range: 36, attacks: '9', rules: rules('Piercing') })] },
      ]),
      section('Take one', 'one', [{ label: 'Warpsword (Linked in Melee)', cost: 5 }]),
    ]),
    group('P', [
      section('Upgrade with', 'one', [
        { label: 'Shredder (Impact(+D3))', cost: 5, adds: ['Impact(+D3)'] },
        { label: 'Flyer (Impact(+D6))', cost: 10, adds: ['Impact(+D6)'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Beacon', 'Friendly units that Deep Strike fully within 6” of this unit don’t scatter.'),
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Horrors', 'If this model is killed in Melee place a marker next to the unit that killed it. Once both sides have attacked the target takes as many hits as markers, and all markers are removed.'),
  ],
  psychicPowers: [
    power('Corruption', 7, 'Target enemy unit within 12” takes D6 automatic hits with Poison.'),
    power('Acquiescence', 8, 'Target enemy unit within 18” can’t attack in Melee until the end of the round.'),
    power('Choir', 8, 'All enemy units within 12” must take a morale test. If failed they take D3 wounds.'),
    power('Flickering Fire', 9, 'Target enemy unit within 24” takes D6 automatic hits.'),
    power('Plague Wind', 9, 'Target enemy unit within 12” takes D6+3 automatic hits with Poison.'),
    power('Bolt of Change', 12, 'Target enemy unit within 24” takes D3 automatic wounds.'),
  ],
})
