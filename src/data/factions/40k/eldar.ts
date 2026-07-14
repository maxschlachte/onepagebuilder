// Eldar — transcribed from the rulebook PDF (page 8),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, power, rules, section, weapon } from '../helpers.ts'

export const eldar = faction({
  id: 'eldar',
  name: 'Eldar',
  units: [
    { name: 'Autarch', size: 1, quality: '3+', equipment: [weapon('shotgun', { rules: rules('Rending') })], special: 'Focus, Hero, Tough(3)', upgrades: 'E', cost: 45 },
    { name: 'Exarch', size: 1, quality: '4+', equipment: [weapon('shotgun', { rules: rules('Rending') })], special: 'Focus, Hero, Tough(3)', upgrades: 'E', cost: 35 },
    { name: 'Farseer', size: 1, quality: '3+', equipment: [weapon('pistol', { rules: rules('Rending') }), meleeWeapon('Light', 'Powersword')], special: 'Focus, Hero, Psyker(3), Tough(3)', upgrades: 'P', cost: 60 },
    { name: 'Warlocks', size: 3, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols', rules: rules('Rending') }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Brothers, Focus', upgrades: 'P', cost: 85 },
    { name: 'Avatar', size: 1, quality: '2+', equipment: [weapon('meltagun'), meleeWeapon('Force', 'Powersword', { rules: rules('Rending') })], special: 'Armored, Fear, Fearless, Hero, Impact(D3), Tough(6)', upgrades: '-', cost: 185 },
    { name: 'Guardians', size: 5, quality: '4+', equipment: [weapon('shotgun', { label: 'Shotguns', rules: rules('Rending') })], special: 'Focus', upgrades: 'E, S', cost: 115 },
    { name: 'Dire Avengers', size: 5, quality: '4+', equipment: [weapon('carbine', { label: 'Carbines' })], special: 'Focus', upgrades: 'H', cost: 75 },
    { name: 'Rangers', size: 5, quality: '4+', equipment: [customWeapon('Sniper Rifles', { range: 36, attacks: '1', rules: rules('Piercing, Sniper') })], special: 'Focus, Scout, Strider', upgrades: '-', cost: 300 },
    { name: 'Scorpions', size: 5, quality: '4+', equipment: [weapon('pistol', { label: 'Pistols', rules: rules('Rending') }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Focus, Scout, Strider', upgrades: '-', cost: 115 },
    { name: 'Banshees', size: 5, quality: '4+', equipment: [weapon('pistol', { label: 'Pistols', rules: rules('Rending') }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Fast, Fear, Focus', upgrades: '-', cost: 120 },
    { name: 'Fire Dragons', size: 5, quality: '4+', equipment: [weapon('meltagun', { label: 'Meltaguns' })], special: 'Focus', upgrades: 'R', cost: 165 },
    { name: 'Hawks', size: 5, quality: '4+', equipment: [weapon('minigun', { label: 'Miniguns' })], special: 'Deep Strike, Flying, Focus', upgrades: 'G', cost: 175 },
    { name: 'Warp Spiders', size: 5, quality: '4+', equipment: [weapon('shotgun', { label: 'Shotguns', rules: rules('Rending') })], special: 'Deep Strike, Focus, Teleporter', upgrades: 'I', cost: 175 },
    { name: 'Dark Reapers', size: 5, quality: '4+', equipment: [weapon('missile-launcher', { label: 'Missile Launchers' })], special: '-', upgrades: 'N', cost: 225 },
    { name: 'Wraithguard', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Armored, Fearless', upgrades: 'K', cost: 135 },
    { name: 'Support Gun', size: 1, quality: '4+', equipment: [customWeapon('Vibro cannon', { range: 48, attacks: '3', rules: rules('Piercing, Single Target, Vibro') })], special: 'Armored, Focus, Tough(3)', upgrades: 'M', cost: 85 },
    { name: 'Windriders', size: 3, quality: '4+', equipment: [linked(weapon('shotgun', { rules: rules('Rending') }), { label: 'Linked Shotguns' })], special: 'Fast, Focus, Strider', upgrades: 'B, Q', cost: 85 },
    { name: 'Vyper', size: 1, quality: '4+', equipment: [linked(weapon('shotgun', { rules: rules('Rending') })), customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })], special: 'Armored, Fast, Strider, Tough(3)', upgrades: 'A, B, C', cost: 75 },
    { name: 'War Walker', size: 1, quality: '4+', equipment: [linked(weapon('shotgun', { rules: rules('Rending') }))], special: 'Armored, Impact(D3), Tough(3)', upgrades: 'C, O', cost: 50 },
    { name: 'Wraithlord', size: 1, quality: '3+', equipment: [weapon('shotgun', { count: 2, label: '2x Shotgun', rules: rules('Rending') }), meleeWeapon('Heavy', 'CCW')], special: 'Armored, Fear, Fearless, Impact(D3), Tough(3)', upgrades: 'F, O', cost: 90 },
    { name: 'Wraithknight', size: 1, quality: '3+', equipment: [customWeapon('Wraithcannons', { range: 12, attacks: '1', rules: rules('Piercing, Rending') }, { count: 2 }), meleeWeapon('Master', 'Powersword', { rules: rules('Rending') })], special: 'Armored, Fear, Fearless, Impact(D3), Tough(6)', upgrades: 'J, O', cost: 135 },
    { name: 'Wave Serpent', size: 1, quality: '3+', equipment: [customWeapon('Linked Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending, Linked') }), linked(weapon('shotgun', { rules: rules('Rending') }))], special: 'Fast, Strider, Transport(11), Tough(6), Vehicle', upgrades: 'D, C', cost: 150 },
    { name: 'Falcon', size: 1, quality: '3+', equipment: [linked(weapon('shotgun', { rules: rules('Rending') })), weapon('autocannon'), customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })], special: 'Fast, Strider, Transport(6), Tough(6), Vehicle', upgrades: 'A, B, C, L', cost: 185 },
    { name: 'Gun Platform', size: 1, quality: '-', equipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })], special: 'Focus, Gun Platform', upgrades: 'A', cost: 0 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace Shuriken Cannon', 'one', [
        {
          label: 'Starcannon',
          cost: 5,
          addEquipment: [customWeapon('Starcannon', { range: 36, attacks: '2', rules: rules('Piercing') })],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Missile Launcher',
          cost: 15,
          addEquipment: [weapon('missile-launcher')],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Bright Lance',
          cost: 55,
          addEquipment: [customWeapon('Bright Lance', { range: 36, attacks: '6', rules: rules('Piercing, Single Target') })],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Scatter Laser',
          cost: 55,
          addEquipment: [customWeapon('Scatter Laser', { range: 36, attacks: '4', rules: rules('Piercing, Linked') })],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)'],
        },
      ]),
    ]),
    group('B', [
      section('Replace one Linked Shotgun', 'one', [
        {
          label: 'Shuriken Cannon',
          cost: 15,
          addEquipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })],
          removeOneEquipment: ['Linked Shotgun (Rending)'],
        },
      ]),
    ]),
    group('C', [
      section('Upgrade with any', 'any', [
        { label: 'Star Engine', cost: 5, adds: ['Star Engine'] },
        { label: 'Vector Engine (Focus)', cost: 5, adds: ['Focus'] },
        { label: 'Spirit Stones (Resilient)', cost: 10, adds: ['Resilient'] },
        { label: 'Power-Field (Tough(+3))', cost: 35, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('D', [
      section('Replace Linked Shuriken Cannon', 'one', [
        {
          label: 'Linked Starcannon',
          cost: 5,
          addEquipment: [customWeapon('Linked Starcannon', { range: 36, attacks: '2', rules: rules('Piercing, Linked') })],
          removeOneEquipment: ['Linked Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Linked Missile Launcher',
          cost: 20,
          addEquipment: [linked(weapon('missile-launcher'))],
          removeOneEquipment: ['Linked Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Scatter Laser',
          cost: 50,
          addEquipment: [customWeapon('Scatter Laser', { range: 36, attacks: '4', rules: rules('Piercing, Linked') })],
          removeOneEquipment: ['Linked Shuriken Cannon (24”, A3, Rending)'],
        },
        {
          label: 'Linked Bright Lance',
          cost: 75,
          addEquipment: [customWeapon('Linked Bright Lance', { range: 36, attacks: '6', rules: rules('Piercing, Single Target, Linked') })],
          removeOneEquipment: ['Linked Shuriken Cannon (24”, A3, Rending)'],
        },
      ]),
    ]),
    group('E', [
      section('Replace one Shotgun', 'one', [
        {
          label: 'Pistol (Rending), Medium CCW',
          cost: 0,
          addEquipment: [weapon('pistol', { rules: rules('Rending') }), meleeWeapon('Medium', 'CCW')],
          removeOneEquipment: ['Shotgun (Rending)'],
        },
        { label: 'Flamer', cost: 10, addEquipment: [weapon('flamer')], removeOneEquipment: ['Shotgun (Rending)'] },
        { label: 'Meltagun', cost: 10, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Shotgun (Rending)'] },
      ]),
      section('Replace all Shotguns', 'one', [
        {
          label: 'Pistols (Rending), Medium CCWs',
          cost: 0,
          addEquipment: [weapon('pistol', { label: 'Pistols', rules: rules('Rending') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })],
          removeEquipment: ['Shotgun (Rending)', 'Shotguns (Rending)'],
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
        ],
        {
          // No group-E unit has a baseline Medium CCW — one only exists if produced above.
          requiresOneOfSelected: ['Pistol (Rending), Medium CCW', 'Pistols (Rending), Medium CCWs'],
        },
      ),
    ]),
    group('F', [
      // Wraithlord is single-model but carries 2 copies of this weapon — additions only, no removal.
      section('Replace any Shotgun', 'any', [{ label: 'Flamer', cost: 10, addEquipment: [weapon('flamer')] }]),
      // "Rending in Melee" is a melee rule *phrase*, not a weapon profile or a known
      // weapon name — no resolvable equipment effect to record.
      section('Upgrade with', 'one', [{ label: 'Ghost Glaive (Rending in Melee)', cost: 10 }]),
    ]),
    group('G', [
      section('Replace one Minigun', 'one', [
        { label: 'Minigun (Piercing)', cost: 10, adds: ['Piercing'], addEquipment: [weapon('minigun', { rules: rules('Piercing') })], removeOneEquipment: ['Minigun'] },
        { label: 'Minigun (Blind)', cost: 10, adds: ['Blind'], addEquipment: [weapon('minigun', { rules: rules('Blind') })], removeOneEquipment: ['Minigun'] },
      ]),
    ]),
    group('H', [
      section('Replace one Carbine', 'one', [
        { label: 'Linked Carbine', cost: 5, addEquipment: [linked(weapon('carbine'))], removeOneEquipment: ['Carbine'] },
        { label: 'Pistol and Medium CCW (Rending)', cost: 10, addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW', { rules: rules('Rending') })], removeOneEquipment: ['Carbine'] },
        { label: 'Pistol and Medium Powersword', cost: 10, addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Carbine'] },
        // "Shield" isn't a stat-carrying weapon (its Tough(3) is already granted via `adds`) —
        // only the Medium Powersword half is added.
        {
          label: 'Shield (Tough(3)) and Medium Powersword',
          cost: 15,
          adds: ['Tough(3)'],
          addEquipment: [meleeWeapon('Medium', 'Powersword')],
          removeOneEquipment: ['Carbine'],
        },
      ]),
    ]),
    group('I', [
      section('Replace one Shotgun', 'one', [
        { label: 'Carbine (Piercing, Rending)', cost: 0, addEquipment: [weapon('carbine', { rules: rules('Piercing, Rending') })], removeOneEquipment: ['Shotguns (Rending)'] },
        { label: 'Linked Shotgun (Rending)', cost: 5, addEquipment: [linked(weapon('shotgun', { rules: rules('Rending') }))], removeOneEquipment: ['Shotguns (Rending)'] },
      ]),
      // Same "(X in Melee)" nested-parenthetical parsing pitfall as Ghost Glaive above.
      section('Upgrade one model with one', 'one', [
        { label: 'Powerblades (Piercing in Melee)', cost: 5 },
      ]),
    ]),
    group('J', [
      // Wraithknight is single-model but carries 2 copies of this weapon — additions only, no
      // removal. "Ghostglaive ... and Scattershield ..." is a two-part compound label with no
      // single resolvable weapon profile — left without an equipment effect entirely.
      // "Scattershield" isn't a stat weapon (Tough(+3) already granted via `adds`).
      section('Replace 2x Wraithcannons', 'one', [
        { label: 'Ghostglaive (Linked in Melee) and Scattershield (Tough(+3))', cost: 20, adds: ['Tough(+3)'] },
        {
          label: 'Suncannon and Scattershield (Tough(+3))',
          cost: 230,
          adds: ['Tough(+3)'],
          addEquipment: [customWeapon('Suncannon', { range: 48, attacks: '9', rules: rules('Piercing') })],
        },
      ]),
    ]),
    group('K', [
      section('Replace all Medium Powerswords', 'one', [
        {
          label: 'Wraithcannons',
          cost: 0,
          addEquipment: [customWeapon('Wraithcannons', { range: 12, attacks: '1', rules: rules('Piercing, Rending') })],
          removeEquipment: ['Medium Powerswords'],
        },
        // "Force Shields" isn't a stat weapon (Tough(3) already granted via `adds`).
        {
          label: 'Medium Powerfists and Force Shields (Tough(3))',
          cost: 140,
          adds: ['Tough(3)'],
          addEquipment: [meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })],
          removeEquipment: ['Medium Powerswords'],
        },
        {
          label: 'Flamers (Rending)',
          cost: 150,
          addEquipment: [weapon('flamer', { label: 'Flamers', rules: rules('Rending') })],
          removeEquipment: ['Medium Powerswords'],
        },
      ]),
    ]),
    group('L', [
      section('Replace Shuriken Cannon and Autocannon', 'one', [
        {
          label: 'Prism Cannon',
          cost: 65,
          addEquipment: [customWeapon('Prism Cannon', { range: 48, attacks: 'D3*3', rules: rules('Piercing') })],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)', 'Autocannon'],
        },
        {
          label: 'Doomweaver',
          cost: 215,
          addEquipment: [customWeapon('Doomweaver', { range: 48, attacks: '9', rules: rules('Piercing, Indirect, Rending') })],
          removeOneEquipment: ['Shuriken Cannon (24”, A3, Rending)', 'Autocannon'],
        },
      ]),
    ]),
    group('M', [
      section('Replace Vibro Cannon', 'one', [
        {
          label: 'D-Cannon',
          cost: 0,
          addEquipment: [customWeapon('D-Cannon', { range: 24, attacks: '3', rules: rules('Piercing, Indirect, Deadly') })],
          removeOneEquipment: ['Vibro cannon (48”, A3x, Vibro)'],
        },
        {
          label: 'Shadow Weaver',
          cost: 25,
          addEquipment: [customWeapon('Shadow Weaver', { range: 48, attacks: '3', rules: rules('Piercing, Indirect, Rending') })],
          removeOneEquipment: ['Vibro cannon (48”, A3x, Vibro)'],
        },
      ]),
    ]),
    group('N', [
      section('Replace one Missile Launcher', 'one', [
        { label: 'Shuriken Cannon', cost: 0, addEquipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })], removeOneEquipment: ['Missile Launcher'] },
        { label: 'Tempest launcher', cost: 30, addEquipment: [customWeapon('Tempest launcher', { range: 36, attacks: '6', rules: rules('Indirect') })], removeOneEquipment: ['Missile Launcher'] },
      ]),
    ]),
    group('O', [
      section('Take up to two', 'upToTwo', [
        { label: 'Shuriken Cannon', cost: 35, addEquipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') })] },
        { label: 'Starcannon', cost: 35, addEquipment: [customWeapon('Starcannon', { range: 36, attacks: '2', rules: rules('Piercing') })] },
        { label: 'Missile Launcher', cost: 50, addEquipment: [weapon('missile-launcher')] },
        { label: 'Bright Lance', cost: 90, addEquipment: [customWeapon('Bright Lance', { range: 36, attacks: '6', rules: rules('Piercing, Single Target') })] },
        { label: 'Scatter Laser', cost: 90, addEquipment: [customWeapon('Scatter Laser', { range: 36, attacks: '4', rules: rules('Piercing, Linked') })] },
      ]),
    ]),
    group('P', [
      section('Replace any Light Powersword', 'any', [
        {
          label: 'Light Powersword (Rending)',
          cost: 5,
          addEquipment: [meleeWeapon('Light', 'Powersword', { rules: rules('Rending') })],
          removeOneEquipment: ['Light Powersword'],
        },
      ]),
      section('Upgrade any model with', 'any', [
        { label: 'Jetbike (Fast, Strider)', cost: 5, adds: ['Fast', 'Strider'] },
      ]),
    ]),
    group('Q', [
      section('Upgrade all models', 'one', [
        { label: 'Laser Lances (+2A when Assaulting)', cost: 10 },
      ]),
    ]),
    group('R', [
      section('Replace one Meltagun', 'one', [
        { label: 'Heavy Flamer', cost: 5, addEquipment: [weapon('heavy-flamer')], removeOneEquipment: ['Meltagun'] },
        { label: 'Firepike', cost: 10, addEquipment: [customWeapon('Firepike', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Meltagun'] },
      ]),
    ]),
    group('S', [section('Upgrade with one', 'one', [{ label: 'Gun Platform', cost: 30, adds: ['Gun Platform'] }])]),
  ],
  armyRules: [
    armyRule('Blind', 'Whenever this weapon deals one or more hits roll one die. On a 4+ the target must re-roll successful hits until the end of its next activation.'),
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Focus', 'This unit may move up to 3” in any direction after shooting. Vehicles with this rule may pivot to face any direction after shooting.'),
    armyRule('Gun Platform', 'This model has the same Quality value as its unit, it has no Melee attacks and doesn’t take up transport space. If all models from the upgrading unit are killed this model is removed.'),
    armyRule('Resilient', 'Whenever this unit rolls a Shaken result roll one die, on a 4+ it is ignored.'),
    armyRule('Star Engine', 'This unit moves +3” when using Walk and +6” when using Run/Assault actions.'),
    armyRule('Teleporter', 'This unit moves +2D6” and may move through units and obstacles, ignoring terrain effects.'),
    armyRule('Vibro', 'Whenever you roll 6 to hit with this weapon you may immediately roll one more attack die. This rule does not apply to attack dice generated by this.'),
  ],
  psychicPowers: [
    power('Reveal', 6, 'Target enemy unit within 18” doesn’t get benefits from cover until the end of the round.'),
    power('Conceal', 6, 'The psyker and his unit get the Stealth special rule until the end of the round.'),
    power('Destructor', 7, 'Target enemy unit within 12” takes D6 automatic hits.'),
    power('Renewer', 7, 'Target friendly model within 18” removes 1 Wound from its Tough count.'),
    power('Guide', 9, 'Target friendly unit within 24” gets Linked shooting until the end of the round.'),
    power('Executioner', 10, 'Target enemy unit within 24” takes 3p automatic hits.'),
  ],
})
