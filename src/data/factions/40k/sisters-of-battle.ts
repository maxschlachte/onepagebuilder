// Sisters of Battle / Adepta Sororitas — transcribed from the rulebook PDF (page 16),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, rules, section, weapon } from '../helpers.ts'

export const sistersOfBattle = faction({
  id: 'sisters-of-battle',
  name: 'Sisters of Battle / Adepta Sororitas',
  units: [
    { name: 'Canoness', size: 1, quality: '3+', equipment: [weapon('assault-rifle')], special: 'Faith(Passion), Hero, Martyr, Tough(3)', upgrades: 'A, B', cost: 45 },
    { name: 'Ministorum Priest', size: 1, quality: '4+', equipment: [weapon('assault-rifle')], special: 'Armored, Hero, Hymns, Zealot', upgrades: 'A, E', cost: 45 },
    { name: 'Crusader', size: 1, quality: '4+', equipment: [meleeWeapon('Light', 'Powersword')], special: 'Armored, Conclave', upgrades: '-', cost: 15 },
    { name: 'Cult Assassin', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'Powersword')], special: 'Conclave', upgrades: '-', cost: 20 },
    { name: 'Arco Flagellant', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'CCW')], special: 'Conclave, Regeneration', upgrades: '-', cost: 20 },
    { name: 'Battle Sisters', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Faith(Light)', upgrades: 'A, C, D, F', cost: 85 },
    { name: 'Retributors', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Faith(Guidance)', upgrades: 'A, F, G', cost: 85 },
    { name: 'Dominions', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Faith(Fusillade), Scout', upgrades: 'A, C, F', cost: 100 },
    { name: 'Celestians', size: 5, quality: '3+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles' })], special: 'Faith(Hand)', upgrades: 'A, C, D, F', cost: 110 },
    { name: 'Seraphim', size: 5, quality: '3+', equipment: [linked(weapon('pistol'), { label: 'Linked Pistols' })], special: 'Deep Strike, Faith(Deliverance), Flying', upgrades: 'H', cost: 135 },
    { name: 'Sisters Repentia', size: 5, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs', rules: rules('Piercing') })], special: 'Faith(Spirit), Fearless, Furious', upgrades: '-', cost: 170 },
    { name: 'Penitent Engine', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'Powerfist'), weapon('heavy-flamer', { count: 2 })], special: 'Armored, Furious, Impact(D3), Tough(3)', upgrades: '-', cost: 120 },
    { name: 'Sororitas Rhino', size: 1, quality: '4+', equipment: [linked(weapon('assault-rifle'))], special: 'Tough(3), Transport(11), Vehicle', upgrades: 'I', cost: 60 },
    { name: 'Immolator', size: 1, quality: '4+', equipment: [linked(weapon('heavy-flamer'))], special: 'Tough(3), Transport(6), Vehicle', upgrades: 'I, J', cost: 85 },
    { name: 'Exorcist', size: 1, quality: '4+', equipment: [customWeapon('Exorcist Missile Launcher', { range: 48, attacks: 'D6', rules: rules('Piercing') })], special: 'Tough(6), Vehicle', upgrades: 'I', cost: 120 },
  ],
  upgradeGroups: [
    group('A', [
      // Shared by single-model (Canoness, Ministorum Priest — baseline "Assault Rifle") and
      // multi-model (Battle Sisters etc. — baseline "Assault Rifles") units; the single-model
      // removal label only ever matches the singular baseline entry.
      section('Replace one Assault Rifle', 'one', [
        { label: 'Shotgun', cost: 0, addEquipment: [weapon('shotgun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Pistol and Medium CCW', cost: 0, addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Pistol and Powersword', cost: 5, addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'Powersword', { label: 'Powersword' })], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Linked Assault Rifle', cost: 5, addEquipment: [linked(weapon('assault-rifle'))], removeOneEquipment: ['Assault Rifle'] },
      ]),
      section(
        'Replace Pistol',
        'one',
        [
          { label: 'Inferno Pistol', cost: 5, addEquipment: [customWeapon('Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistol'] },
          { label: 'Plasma Pistol', cost: 15, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] },
        ],
        {
          // The unit's baseline has no Pistol at all — one only exists if produced above.
          requiresOneOfSelected: ['Pistol and Medium CCW', 'Pistol and Powersword'],
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
            'Shotgun',
            'Pistol and Medium CCW',
            'Pistol and Powersword',
          ],
        },
      ),
    ]),
    group('B', [
      section('Upgrade with', 'one', [{ label: 'Rosarius', cost: 10, adds: ['Armored'] }]),
    ]),
    group('C', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Linked Assault Rifle', cost: 5, addEquipment: [linked(weapon('assault-rifle'))], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Flamer', cost: 10, addEquipment: [weapon('flamer')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Meltagun', cost: 15, addEquipment: [weapon('meltagun')], removeOneEquipment: ['Assault Rifle'] },
      ]),
    ]),
    group('D', [
      section('Replace one Assault Rifle', 'one', [
        { label: 'Heavy Flamer', cost: 20, addEquipment: [weapon('heavy-flamer')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Machinegun', cost: 20, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Multi-Melta', cost: 40, addEquipment: [weapon('multi-melta')], removeOneEquipment: ['Assault Rifle'] },
      ]),
    ]),
    group('E', [
      // Ministorum Priest only — single-model, baseline "Assault Rifle" (no count prefix).
      section('Replace Assault Rifle', 'one', [
        { label: 'Plasmagun', cost: 20, addEquipment: [weapon('plasmagun')], removeOneEquipment: ['Assault Rifle'] },
      ]),
    ]),
    group('F', [
      // All options are Faith/re-roll/morale abilities, not weapons — left untouched.
      section('Equip one model with one', 'one', [
        { label: 'Simulacrum Imperialis', cost: 5, adds: ['Simulacrum Imperialis'] },
        { label: 'Laud Hailer', cost: 15, adds: ['Laud Hailer'] },
        { label: 'Chirurgeon’s Tools', cost: 25, adds: ['Chirurgeon’s Tools'] },
        { label: 'Battle Standard', cost: 65, adds: ['Battle Standard'] },
      ]),
    ]),
    group('G', [
      section('Replace any Assault Rifle', 'any', [
        { label: 'Heavy Flamer', cost: 20, addEquipment: [weapon('heavy-flamer')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Machinegun', cost: 20, addEquipment: [weapon('machinegun')], removeOneEquipment: ['Assault Rifle'] },
        { label: 'Multi-Melta', cost: 40, addEquipment: [weapon('multi-melta')], removeOneEquipment: ['Assault Rifle'] },
      ]),
    ]),
    group('H', [
      section('Replace one Linked Pistol', 'one', [
        { label: 'Linked Inferno Pistol', cost: 5, addEquipment: [customWeapon('Linked Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target, Linked') })], removeOneEquipment: ['Linked Pistol'] },
        { label: 'Linked Hand Flamer', cost: 15, addEquipment: [customWeapon('Linked Hand Flamer', { range: 12, attacks: '4', rules: rules('Linked') })], removeOneEquipment: ['Linked Pistol'] },
      ]),
      section('Replace one Linked Pistol', 'one', [
        { label: 'Pistol and Medium CCW', cost: 5, addEquipment: [weapon('pistol'), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Linked Pistol'] },
        { label: 'Plasma Pistol and Medium CCW', cost: 20, addEquipment: [weapon('plasma-pistol'), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Linked Pistol'] },
      ]),
      section('Replace Medium CCW', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('I', [
      // Sororitas Rhino / Immolator / Exorcist — "Upgrade with any" is a pure addition.
      section('Upgrade with any', 'any', [
        { label: 'Dozer Blade (Strider)', cost: 5, adds: ['Strider'] },
        { label: 'Linked Assault Rifle', cost: 10, addEquipment: [linked(weapon('assault-rifle'))] },
        // Nested-parenthetical compound label ("X (Y (Limited))") has no single resolvable weapon profile — left without equipment effects (matches space-marines.ts/imperial-guard.ts).
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Laud Hailer', cost: 10, adds: ['Laud Hailer'] },
        { label: 'Extra Armor (Tough(+3))', cost: 25, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('J', [
      // Immolator only — single-model, baseline "Linked Heavy Flamer" (no count prefix).
      section('Replace Linked Heavy Flamer', 'one', [
        { label: 'Linked Machinegun', cost: 0, addEquipment: [linked(weapon('machinegun'))], removeOneEquipment: ['Linked Heavy Flamer'] },
        { label: 'Linked Multi-Melta', cost: 25, addEquipment: [linked(weapon('multi-melta'))], removeOneEquipment: ['Linked Heavy Flamer'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Battle Standard', 'When taking morale tests this unit and all friendly Infantry units within 12” roll one extra die and pick the highest result.'),
    armyRule('Chirurgeon’s Tools', 'The unit gets Regeneration.'),
    armyRule('Conclave', 'You may deploy up to 10 models with this rule together to form a single unit.'),
    armyRule('Faith', 'When this unit is activated you may try to use its act of faith. Roll one die, on a 4+ the unit gets a bonus until the end of the round: Deliverance (all weapons get Piercing), Fusillade (all weapons Ignore Cover), Guidance (all weapons get Rending), Hand (all models get Furious), Light (all weapons get Linked), Spirit (all models get Regeneration), Passion (the model gets Zealot).'),
    armyRule('Hymns', 'Whenever this unit uses an Assault action roll one die, on a 4+ you may pick one of the following special rules for that Melee: Protection (all models get Armored), Strength (all models get Piercing), Righteousness (all models get Linked).'),
    armyRule('Laud Hailer', 'This unit and all friendly units within 12” may re-roll failed act of faith rolls.'),
    armyRule('Martyr', 'If this model is killed all friendly units may use their act of faith without having to roll for it until the end of the round.'),
    armyRule('Simulacrum Imperialis', 'This unit may re-roll failed act of faith rolls.'),
    armyRule('Zealot', 'The hero and his unit get Furious.'),
  ],
  psychicPowers: [],
})
