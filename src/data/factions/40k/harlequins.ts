// Harlequins — transcribed from the rulebook PDF (page 18),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, meleeWeapon, power, rules, section, weapon } from '../helpers.ts'

export const harlequins = faction({
  id: 'harlequins',
  name: 'Harlequins',
  units: [
    { name: 'Solitaire', size: 1, quality: '3+', equipment: [meleeWeapon('Force', 'CCW', { rules: rules('Deadly') })], special: 'Deep Strike, Fear, Fearless, Furious, Hero, Prismatic Blur, Strider, Tough(3)', upgrades: '-', cost: 110 },
    { name: 'Shadowseer', size: 1, quality: '3+', equipment: [customWeapon('Hallucinogen Launcher', { range: 18, attacks: '3', rules: rules('Hallucinogen') }), weapon('pistol', { rules: rules('Rending') }), meleeWeapon('Heavy', 'Powersword')], special: 'Fear, Furious, Hero, Psyker(1), Strider, Tough(3)', upgrades: 'A', cost: 100 },
    { name: 'Death Jester', size: 1, quality: '3+', equipment: [customWeapon('Shrieker Cannon', { range: 24, attacks: '1', rules: rules('Poison, Hallucinogen') }), meleeWeapon('Heavy', 'CCW')], special: 'Fear, Furious, Hero, Strider, Tough(3)', upgrades: '-', cost: 70 },
    { name: 'Troupe', size: 5, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols', rules: rules('Rending') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fear, Furious, Strider', upgrades: 'B', cost: 155 },
    { name: 'Skyweavers', size: 3, quality: '3+', equipment: [customWeapon('Shuriken Cannons', { range: 24, attacks: '3', rules: rules('Rending') }), meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs' })], special: 'Fast, Fear, Furious, Strider', upgrades: 'C', cost: 195 },
    { name: 'Voidweaver', size: 1, quality: '3+', equipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') }, { count: 2, label: '2x Shuriken Cannon' })], special: 'Armored, Fast, Fear, Strider, Tough(3)', upgrades: 'D', cost: 115 },
    { name: 'Starweaver', size: 1, quality: '3+', equipment: [customWeapon('Shuriken Cannon', { range: 24, attacks: '3', rules: rules('Rending') }, { count: 2, label: '2x Shuriken Cannon' })], special: 'Armored, Fast, Fear, Strider, Tough(3), Transport(6)', upgrades: '-', cost: 125 },
  ],
  upgradeGroups: [
    group('A', [
      section('Upgrade Psyker(1)', 'one', [{ label: 'Psyker(2)', cost: 5, adds: ['Psyker(2)'] }], {
        requiresBaselineRule: ['Psyker(1)'],
      }),
      section('Replace Pistol', 'one', [
        { label: 'Pistol (Piercing)', cost: 0, addEquipment: [weapon('pistol', { rules: rules('Piercing') })], removeOneEquipment: ['Pistol (Rending)'] },
      ]),
    ]),
    group('B', [
      section('Replace any Pistol', 'any', [
        { label: 'Neuro Disruptor', cost: 0, addEquipment: [customWeapon('Neuro Disruptor', { range: 12, attacks: '1', rules: rules('Piercing') })], removeOneEquipment: ['Pistols (Rending)'] },
        { label: 'Fusion Pistol', cost: 10, addEquipment: [customWeapon('Fusion Pistol', { range: 6, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistols (Rending)'] },
      ]),
      section('Replace any Medium CCW', 'any', [
        { label: 'Medium CCW (Impact(D3))', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Impact(D3)') })], removeOneEquipment: ['Medium CCWs'] },
        { label: 'Medium CCW (Rending)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Rending') })], removeOneEquipment: ['Medium CCWs'] },
        { label: 'Medium CCW (Deadly)', cost: 20, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Deadly') })], removeOneEquipment: ['Medium CCWs'] },
      ]),
      section('Replace one Medium CCW', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCWs'] },
      ]),
    ]),
    group('C', [
      section('Equip any model with', 'any', [
        { label: 'Zephyrglaive (Impact(1))', cost: 5, addEquipment: [gear('Zephyrglaive', { rules: rules('Impact(1)') })] },
        { label: 'Star Bolas', cost: 20, addEquipment: [customWeapon('Star Bolas', { range: 12, attacks: '3', rules: rules('Piercing') })] },
      ]),
      section('Replace any Shuriken Cannon', 'any', [
        {
          label: 'Haywire Cannon',
          cost: 15,
          addEquipment: [customWeapon('Haywire Cannon', { range: 24, attacks: '3', rules: rules('Haywire') })],
          removeOneEquipment: ['Shuriken Cannons (24”, A3, Rending)'],
        },
      ]),
    ]),
    group('D', [
      // Voidweaver's baseline is "2x Shuriken Cannon" — a single-model unit that
      // already carries two copies, so per design.md this is treated as a pure
      // addition (no removal) rather than assumed to fully replace both.
      section('Take one', 'one', [
        { label: 'Haywire Cannon', cost: 50, addEquipment: [customWeapon('Haywire Cannon', { range: 24, attacks: '3', rules: rules('Haywire') })] },
        { label: 'Prismatic Cannon', cost: 70, addEquipment: [customWeapon('Prismatic Cannon', { range: 24, attacks: 'D3*3', rules: rules('Piercing') })] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Hallucinogen', 'Whenever a unit is hit by this weapon it must take a morale test.'),
    armyRule('Haywire', 'When hitting Vehicles this weapon ignores Armored and is only blocked on rolls of 6.'),
    armyRule('Prismatic Blur', 'This unit always moves +6”.'),
  ],
  psychicPowers: [
    power('Dance of Shadows', 7, 'Target friendly unit within 18” gets Stealth until the end of the round.'),
    power('Peal of Discord', 8, 'All enemy units within 9” take D6 automatic hits.'),
    power('Veil of Tears', 9, 'The psyker and his unit may not be targeted by enemies over 12” away until the end of the round.'),
    power('Laugh of Sorrows', 12, 'Target enemy unit within 24” must take two morale tests. For each failed morale test it takes D3 automatic wounds.'),
    power('Fog of Dreams', 13, 'Target enemy unit within 24” only hits on 6s until the end of the round.'),
    power('Shards of Light', 13, 'Target enemy unit within 24” takes D6+4 automatic hits.'),
  ],
})
