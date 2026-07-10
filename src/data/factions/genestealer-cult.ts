// Genestealer Cult — transcribed from the rulebook PDF (page 20),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, meleeWeapon, power, rules, section, weapon } from './helpers'

export const genestealerCult = faction({
  id: 'genestealer-cult',
  name: 'Genestealer Cult',
  units: [
    { name: 'Patriarch', size: 1, quality: '3+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws', rules: rules('Piercing, Rending') })], special: 'Armored, Fear, Fearless, Hero, Psyker(2), Scout, Stealth, Strider, Tough(3)', upgrades: 'A', cost: 110 },
    { name: 'Magus', size: 1, quality: '5+', equipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], special: 'Hero, Psyker(2), Tough(3)', upgrades: 'B', cost: 40 },
    { name: 'Primus', size: 1, quality: '5+', equipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Heavy', 'CCW', { rules: rules('Deadly') })], special: 'Hero, Tough(3), Zealot', upgrades: '-', cost: 60 },
    { name: 'Neophytes', size: 5, quality: '5+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: '-', upgrades: 'C', cost: 50 },
    { name: 'Acolytes', size: 5, quality: '4+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Rending') })], special: 'Fearless', upgrades: '-', cost: 120 },
    { name: 'Purebreeds', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Claw', { label: 'Medium Claws', rules: rules('Rending') })], special: 'Scout, Stealth, Strider', upgrades: '-', cost: 150 },
    { name: 'Aberrant', size: 3, quality: '3+', equipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Rending') })], special: 'Fearless, Regeneration, Tough(3)', upgrades: 'D', cost: 155 },
  ],
  upgradeGroups: [
    group('A', [
      section('Take one', 'one', [{ label: 'Genestealer Familiar (+2A in Melee)', cost: 20 }]),
    ]),
    group('B', [
      section('Take one', 'one', [{ label: 'Genestealer Familiar (+2A in Melee)', cost: 5 }]),
    ]),
    group('C', [
      section('Replace up to two Assault Rifles with any', 'upToTwo', [
        { label: 'Grenade Launcher', cost: 10, addEquipment: [weapon('grenade-launcher')], removeOneEquipment: ['Assault Rifles'] },
        {
          label: 'Mining Laser (24”, A6x)',
          cost: 25,
          addEquipment: [customWeapon('Mining Laser', { range: 24, attacks: '6', rules: rules('Piercing, Single Target') })],
          removeOneEquipment: ['Assault Rifles'],
        },
      ]),
    ]),
    group('D', [
      section('Replace any Medium CCW', 'any', [
        {
          label: 'Medium Powerfist',
          cost: 5,
          addEquipment: [meleeWeapon('Medium', 'Powerfist')],
          removeOneEquipment: ['Medium CCWs (Rending)'],
        },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Zealot', 'The hero and his unit get Furious.'),
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
