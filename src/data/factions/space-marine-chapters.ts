// Space Marine Chapters — transcribed from the rulebook PDF (page 15).
// These units extend the Space Marines army; the per-chapter modifiers are
// captured as army-rule notes below.
// Section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, rules, section, weapon } from './helpers'

export const spaceMarineChapters = faction({
  id: 'space-marine-chapters',
  name: 'Space Marine Chapters',
  units: [
    { name: 'Sanguinary Priest', size: 1, quality: '3+', equipment: [meleeWeapon('Medium', 'CCW')], special: 'Blood Chalice, Furious, Fearless, Hero, Narthecium, Tough(3)', upgrades: 'A', cost: 85 },
    { name: 'Death Company', size: 5, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Rage, Regeneration', upgrades: 'B', cost: 155 },
    { name: 'Sanguinary Guard', size: 5, quality: '3+', equipment: [customWeapon('Angelus Boltgun', { range: 12, attacks: '2' }, { label: 'Angelus Boltguns' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Deep Strike, Fearless, Furious, Flying', upgrades: 'C', cost: 190 },
    { name: 'Furioso Dreadnought', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { count: 2, label: '2x Stormbolter' }), meleeWeapon('Force', 'Powerfist')], special: 'Armored, Fearless, Furious, Impact(D3), Tough(6)', upgrades: 'G', cost: 155 },
    { name: 'Baal Predator', size: 5, quality: '3+', equipment: [linked(weapon('minigun', { rules: rules('Rending') }))], special: 'Fast, Fearless, Tough(6), Vehicle', upgrades: 'D', cost: 120 },
    { name: 'Jetbike Captain', size: 1, quality: '3+', equipment: [linked(weapon('assault-rifle')), weapon('plasma-cannon'), weapon('pistol'), meleeWeapon('Medium', 'Powersword')], special: 'Fast, Fearless, Hero, Scout, Strider, Tactics, Tough(3)', upgrades: '-', cost: 140 },
    { name: 'Deathwing Knights', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })], special: 'Armored, Deep Strike, Deathwing, Fearless, Impact(1), Tough(3)', upgrades: '-', cost: 330 },
    { name: 'Black Knights', size: 3, quality: '3+', equipment: [customWeapon('Plasma Talon', { range: 18, attacks: '1', rules: rules('Piercing, Linked') }, { label: 'Plasma Talons' }), weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fast, Fearless, Scout', upgrades: 'E', cost: 130 },
    { name: 'Darkshroud', size: 1, quality: '3+', equipment: [weapon('machinegun')], special: 'Armored, Deep Strike, Fast, Fearless, Shroud of Angels, Strider, Tough(3)', upgrades: 'F', cost: 105 },
    { name: 'Vengeance', size: 1, quality: '3+', equipment: [weapon('machinegun'), customWeapon('Plasmastorm', { range: 24, attacks: '6', rules: rules('Piercing') })], special: 'Armored, Deep Strike, Fast, Fearless, Strider, Tough(3)', upgrades: 'F', cost: 155 },
    { name: 'Brother Champion', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Medium', 'Powersword')], special: 'Aegis, Fearless, Hero, Psyker(1), Tough(3)', upgrades: '-', cost: 75 },
    { name: 'Strike Squad', size: 5, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { label: 'Stormbolters' }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Aegis, Brothers, Fearless', upgrades: 'H', cost: 190 },
    { name: 'Grey Knights Terminators', size: 5, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { label: 'Stormbolters' }), meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Aegis, Armored, Brothers, Deep Strike, Fearless', upgrades: 'I', cost: 255 },
    { name: 'Dreadknight', size: 1, quality: '3+', equipment: [meleeWeapon('Master', 'CCW', { rules: rules('Piercing, Rending') })], special: 'Aegis, Armored, Deep Strike, Fear, Fearless, Impact(D3), Psyker(1), Tough(3)', upgrades: 'J', cost: 105 },
    { name: 'Sled Captain', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Master', 'Claws'), meleeWeapon('Medium', 'Powersword')], special: 'Counter-Attack, Fearless, Hero, Tactics, Tough(6), Vehicle', upgrades: '-', cost: 140 },
    { name: 'Wulfen', size: 5, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs' })], special: 'Counter-Attack, Fast, Fearless, Rage, Regeneration, Tough(3)', upgrades: 'K', cost: 295 },
    { name: 'Thunderwolf Cavalry', size: 3, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Master', 'CCW', { label: 'Master CCWs' })], special: 'Armored, Counter-Attack, Fast, Fearless, Impact(1), Tough(3)', upgrades: 'L', cost: 200 },
    { name: 'Fenrisian Wolves', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Claws')], special: 'Counter-Attack, Fast, Strider', upgrades: '-', cost: 120 },
    { name: 'Wolf', size: 1, quality: '-', equipment: [meleeWeapon('Medium', 'Claws')], special: 'Counter-Attack, Fast, Strider, Wolf', upgrades: '-', cost: 0 },
  ],
  upgradeGroups: [
    group('A', [
      section('Take one', 'one', [
        { label: 'Pistol', cost: 5, addEquipment: [weapon('pistol')] },
        { label: 'Assault Rifle', cost: 10, addEquipment: [weapon('assault-rifle')] },
        { label: 'Inferno Pistol', cost: 10, addEquipment: [customWeapon('Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target') })] },
        { label: 'Hand Flamer', cost: 15, addEquipment: [customWeapon('Hand Flamer', { range: 12, attacks: '4' })] },
        { label: 'Stormbolter', cost: 15, addEquipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })] },
        { label: 'Plasma Pistol', cost: 20, addEquipment: [weapon('plasma-pistol')] },
      ]),
      section('Replace Medium CCW', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium Powerfist', cost: 10, addEquipment: [meleeWeapon('Medium', 'Powerfist')], removeOneEquipment: ['Medium CCW'] },
      ]),
      section(
        'Take one Assault Rifle attachment',
        'one',
        [
          { label: 'Flamer (Limited)', cost: 5, addEquipment: [weapon('flamer', { rules: rules('Limited') })] },
          { label: 'Meltagun (Limited)', cost: 5, addEquipment: [weapon('meltagun', { rules: rules('Limited') })] },
          { label: 'Plasmagun (Limited)', cost: 5, addEquipment: [weapon('plasmagun', { rules: rules('Limited') })] },
        ],
        {
          // Baseline is just a Medium CCW — an Assault Rifle only exists if taken above.
          requiresOneOfSelected: ['Assault Rifle'],
        },
      ),
    ]),
    group('B', [
      section('Replace any Pistol', 'any', [
        { label: 'Assault Rifle', cost: 5, addEquipment: [weapon('assault-rifle')], removeOneEquipment: ['Pistol'] },
        { label: 'Inferno Pistol', cost: 10, addEquipment: [customWeapon('Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistol'] },
        { label: 'Hand Flamer', cost: 15, addEquipment: [customWeapon('Hand Flamer', { range: 12, attacks: '4' })], removeOneEquipment: ['Pistol'] },
        { label: 'Plasma Pistol', cost: 20, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] },
      ]),
      section('Replace any Medium CCW', 'any', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium Powerfist', cost: 10, addEquipment: [meleeWeapon('Medium', 'Powerfist')], removeOneEquipment: ['Medium CCW'] },
      ]),
      section('Upgrade all models with', 'one', [
        { label: 'Jump Packs (Deep Strike, Flying)', cost: 40, adds: ['Deep Strike', 'Flying'] },
      ]),
    ]),
    group('C', [
      section('Replace any Angelus Boltgun', 'any', [
        { label: 'Inferno Pistol', cost: 0, addEquipment: [customWeapon('Inferno Pistol', { range: 6, attacks: '3', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Angelus Boltguns (12”, A2)'] },
        { label: 'Plasma Pistol', cost: 10, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Angelus Boltguns (12”, A2)'] },
      ]),
      section('Replace any Medium CCW', 'any', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium Powerfist', cost: 10, addEquipment: [meleeWeapon('Medium', 'Powerfist')], removeOneEquipment: ['Medium CCW'] },
      ]),
      section('Upgrade all models with', 'one', [{ label: 'Death Masks (Fear)', cost: 20, adds: ['Fear'] }]),
    ]),
    group('D', [
      // Baal Predator is size 5 (squadron-priced); "Replace Linked Minigun" is singular/definite
      // but the only user is multi-model, so — consistent with the multi-model rule — additions
      // only, no removal (flagged: genuinely ambiguous whether this means "on one vehicle" or
      // "on the squadron", the size-based mechanism can't distinguish those here).
      section('Replace Linked Minigun', 'one', [{ label: 'Heavy Flamer', cost: 0, addEquipment: [weapon('heavy-flamer')] }]),
      section('Take one', 'one', [
        { label: '2x Machineguns', cost: 70, addEquipment: [weapon('machinegun', { count: 2 })] },
        { label: '2x Heavy Flamers', cost: 70, addEquipment: [weapon('heavy-flamer', { count: 2 })] },
      ]),
      section('Upgrade with any', 'any', [
        { label: 'Dozer Blade (Strider)', cost: 5, adds: ['Strider'] },
        // Nested-parenthetical compound label ("X (Y (Limited))") has no single resolvable weapon profile — left without equipment effects (matches space-marines.ts/imperial-guard.ts).
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Pintle Mount (Stormbolter)', cost: 15, addEquipment: [customWeapon('Pintle Mount', { range: 24, attacks: '2' })] },
        { label: 'Extra Armor (Tough(+3))', cost: 35, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('E', [
      // Black Knights is size 3 — no removal possible/needed, addition only.
      section('Replace one Plasma Talon', 'one', [
        { label: 'Linked Grenade Launcher', cost: 20, addEquipment: [linked(weapon('grenade-launcher'))], removeOneEquipment: ['Plasma Talons (18”, A1p, Linked)'] },
      ]),
    ]),
    group('F', [
      // Darkshroud and Vengeance are both single-model with baseline "Machinegun" (no count
      // prefix) — an unambiguous single-model swap.
      section('Replace Machinegun', 'one', [
        { label: 'Minigun (Rending)', cost: 5, adds: ['Rending'], addEquipment: [weapon('minigun', { rules: rules('Rending') })], removeOneEquipment: ['Machinegun'] },
      ]),
    ]),
    group('G', [
      // Furioso Dreadnought's baseline is "2x Stormbolter (24”, A2)" — a single-model unit that
      // nonetheless carries 2 copies (Deff-Dred-shaped edge case) — addition only, no removal.
      section('Replace any Stormbolter', 'any', [
        { label: 'Meltagun', cost: 15, addEquipment: [weapon('meltagun')] },
        { label: 'Heavy Flamer', cost: 20, addEquipment: [weapon('heavy-flamer')] },
      ]),
      // "Replace all equipment with" is unconditional and unambiguous regardless of size.
      section('Replace all equipment with', 'one', [
        {
          label: 'Heavy Powerfist, Stormbolter, Frag Cannon',
          cost: 75,
          addEquipment: [meleeWeapon('Heavy', 'Powerfist'), customWeapon('Stormbolter', { range: 24, attacks: '2' }), customWeapon('Frag Cannon', { range: 12, attacks: '12', rules: rules('Piercing, Rending') })],
          removeEquipment: ['2x Stormbolter (24”, A2)', 'Force Powerfist'],
        },
      ]),
      section('Upgrade with any', 'any', [
        { label: 'Magna-Grapple (Strider)', cost: 5, adds: ['Strider'] },
        { label: 'Extra Armor (Tough(+3))', cost: 35, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('H', [
      section('Replace one Stormbolter', 'one', [
        { label: 'Incinerator (Heavy Flamer)', cost: 20, addEquipment: [weapon('heavy-flamer', { label: 'Incinerator' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psilencer', cost: 30, addEquipment: [customWeapon('Psilencer', { range: 24, attacks: '6' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psycannon', cost: 30, addEquipment: [customWeapon('Psycannon', { range: 24, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
      ]),
      section('Upgrade all models with', 'one', [{ label: 'Teleporter', cost: 15, adds: ['Teleporter'] }]),
    ]),
    group('I', [
      section('Replace any Stormbolter', 'any', [
        { label: 'Incinerator (Heavy Flamer)', cost: 20, addEquipment: [weapon('heavy-flamer', { label: 'Incinerator' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psilencer', cost: 30, addEquipment: [customWeapon('Psilencer', { range: 24, attacks: '6' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psycannon', cost: 30, addEquipment: [customWeapon('Psycannon', { range: 24, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
      ]),
    ]),
    group('J', [
      section('Take up to two', 'upToTwo', [
        { label: 'Heavy Incinerator', cost: 55, addEquipment: [customWeapon('Heavy Incinerator', { range: 18, attacks: '6', rules: rules('Piercing') })] },
        { label: 'Gatling Psilencer', cost: 95, addEquipment: [customWeapon('Gatling Psilencer', { range: 24, attacks: '12' })] },
        { label: 'Heavy Psycannon', cost: 135, addEquipment: [customWeapon('Heavy Psycannon', { range: 24, attacks: '9', rules: rules('Piercing, Rending') })] },
      ]),
      section('Upgrade with', 'one', [{ label: 'Teleporter', cost: 5, adds: ['Teleporter'] }]),
    ]),
    group('K', [
      section('Any model may take one', 'one', [
        { label: 'Auto-Launcher', cost: 10, addEquipment: [customWeapon('Auto-Launcher', { range: 12, attacks: 'D3' })] },
        { label: 'Storm Shield (Tough(+3))', cost: 25, adds: ['Tough(+3)'] },
      ]),
      section('Replace any Heavy CCW', 'any', [
        { label: 'Master CCW', cost: 5, addEquipment: [meleeWeapon('Master', 'CCW')], removeOneEquipment: ['Heavy CCW'] },
        { label: 'Heavy Powerfist', cost: 15, addEquipment: [meleeWeapon('Heavy', 'Powerfist')], removeOneEquipment: ['Heavy CCW'] },
      ]),
    ]),
    group('L', [
      section('Replace any Pistol', 'any', [
        { label: 'Assault Rifle', cost: 5, addEquipment: [weapon('assault-rifle')], removeOneEquipment: ['Pistol'] },
        { label: 'Plasma Pistol', cost: 15, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Aegis', 'This unit may re-roll results of 1 when denying Psychic Powers.'),
    armyRule('Blood Chalice', 'The hero and his unit get the Linked special rule in Melee.'),
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Counter-Attack', 'This unit gets +1A in Melee when Assaulted by an enemy.'),
    armyRule('Deathwing', 'This unit arrives from Deep Strike automatically and can do so from round 1.'),
    armyRule('Narthecium', 'The hero and his unit get the Regeneration special rule.'),
    armyRule('Rage', 'This unit has the Furious special rule but gets +2 attacks when Assaulting.'),
    armyRule('Shroud of Angels', 'This unit and all friendly units within 6” get the Stealth special rule.'),
    armyRule('Tactics', 'Once per game all friendly units may re-roll failed hits until the end of the round.'),
    armyRule('Teleporter', 'This unit moves +2D6” and may move through units and obstacles, ignoring terrain effects.'),
    armyRule('Wolf', 'This model has the same Quality value as its hero and doesn’t take up transport space. If the upgrading hero is killed this model is removed.'),
    armyRule('Blood Angels Chapter', 'Modifiers for Space Marine armies: Infantry get Furious for +10pts; Vehicles get Fast for +5pts.'),
    armyRule('Dark Angels Chapter', 'Modifiers for Space Marine armies: Terminators get Deathwing for +20pts; Bike Squads get Scout for +10pts; Assault Bikes get Scout for +5pts.'),
    armyRule('Grey Knights Chapter', 'Modifiers for Space Marine armies: Infantry get Aegis for +5pts; Vehicles get Aegis for +5pts.'),
    armyRule('Space Wolves Chapter', 'Modifiers for Space Marine armies: Heroes may take one Wolf for +30pts; Infantry get Counter-Attack for +10pts.'),
  ],
  psychicPowers: [],
})
