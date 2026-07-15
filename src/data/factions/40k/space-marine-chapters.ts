// Space Marine Chapters — transcribed from the rulebook PDF (page 15).
// These are NOT a standalone faction: each chapter's units and upgrade groups
// extend the Space Marines faction (see `src/data/chapters.ts`), available only
// when that chapter is selected on a Space Marines list. Each chapter's own
// point-cost rule modifiers (e.g. "Blood Angels: Infantry get Furious for
// +10pts") are synthesized as Chapter Tactics upgrade options in chapters.ts,
// not encoded here — the four `'... Chapter'` prose-only glossary entries that
// used to describe them (with no way to actually select them) are gone.
// Section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import type { SpecialRule, UnitProfile, UpgradeGroup } from '../../../domain/types.ts'
import { armyRule, customWeapon, group, linked, meleeWeapon, rules, section, unit, weapon } from '../helpers.ts'

export interface ChapterBundle {
  units: UnitProfile[]
  upgradeGroups: UpgradeGroup[]
  /** Chapter-specific army rules baked onto this chapter's own units (deduped against the base Space Marines faction's armyRules by id at assembly time). */
  armyRules: SpecialRule[]
}

const SM = 'space-marines'

export const bloodAngelsBundle: ChapterBundle = {
  units: [
    unit(SM, { name: 'Sanguinary Priest', size: 1, quality: '3+', equipment: [meleeWeapon('Medium', 'CCW')], special: 'Blood Chalice, Furious, Fearless, Hero, Narthecium, Tough(3)', upgrades: 'ba-a', cost: 85 }),
    unit(SM, { name: 'Death Company', size: 5, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fearless, Rage, Regeneration', upgrades: 'ba-b', cost: 155 }),
    unit(SM, { name: 'Sanguinary Guard', size: 5, quality: '3+', equipment: [customWeapon('Angelus Boltgun', { range: 12, attacks: '2' }, { label: 'Angelus Boltguns' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Deep Strike, Fearless, Furious, Flying', upgrades: 'ba-c', cost: 190 }),
    unit(SM, { name: 'Furioso Dreadnought', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { count: 2, label: '2x Stormbolter' }), meleeWeapon('Force', 'Powerfist')], special: 'Armored, Fearless, Furious, Impact(D3), Tough(6)', upgrades: 'ba-g', cost: 155 }),
    unit(SM, { name: 'Baal Predator', size: 5, quality: '3+', equipment: [linked(weapon('minigun', { rules: rules('Rending') }))], special: 'Fast, Fearless, Tough(6), Vehicle', upgrades: 'ba-d', cost: 120 }),
  ],
  upgradeGroups: [
    group('ba-a', [
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
          requiresOneOfSelected: ['Assault Rifle'],
        },
      ),
    ]),
    group('ba-b', [
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
    group('ba-c', [
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
    group('ba-d', [
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
        { label: 'Dozer Blade', cost: 5, adds: ['Strider'] },
        { label: 'Hunter-Killer Missile (Missile Launcher (Limited))', cost: 10 },
        { label: 'Pintle Mount', cost: 15, addEquipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })] },
        { label: 'Extra Armor', cost: 35, adds: ['Tough(+3)'] },
      ]),
    ]),
    group('ba-g', [
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
        { label: 'Magna-Grapple', cost: 5, adds: ['Strider'] },
        { label: 'Extra Armor', cost: 35, adds: ['Tough(+3)'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Blood Chalice', 'The hero and his unit get the Linked special rule in Melee.'),
    armyRule('Narthecium', 'The hero and his unit get the Regeneration special rule.'),
    armyRule('Rage', 'This unit has the Furious special rule but gets +2 attacks when Assaulting.'),
  ],
}

export const darkAngelsBundle: ChapterBundle = {
  units: [
    unit(SM, { name: 'Jetbike Captain', size: 1, quality: '3+', equipment: [linked(weapon('assault-rifle')), weapon('plasma-cannon'), weapon('pistol'), meleeWeapon('Medium', 'Powersword')], special: 'Fast, Fearless, Hero, Scout, Strider, Tactics, Tough(3)', upgrades: '-', cost: 140 }),
    unit(SM, { name: 'Deathwing Knights', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Powerfist', { label: 'Medium Powerfists' })], special: 'Armored, Deep Strike, Deathwing, Fearless, Impact(1), Tough(3)', upgrades: '-', cost: 330 }),
    unit(SM, { name: 'Black Knights', size: 3, quality: '3+', equipment: [customWeapon('Plasma Talon', { range: 18, attacks: '1', rules: rules('Piercing, Linked') }, { label: 'Plasma Talons' }), weapon('pistol', { label: 'Pistols' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fast, Fearless, Scout', upgrades: 'da-e', cost: 130 }),
    unit(SM, { name: 'Darkshroud', size: 1, quality: '3+', equipment: [weapon('machinegun')], special: 'Armored, Deep Strike, Fast, Fearless, Shroud of Angels, Strider, Tough(3)', upgrades: 'da-f', cost: 105 }),
    unit(SM, { name: 'Vengeance', size: 1, quality: '3+', equipment: [weapon('machinegun'), customWeapon('Plasmastorm', { range: 24, attacks: '6', rules: rules('Piercing') })], special: 'Armored, Deep Strike, Fast, Fearless, Strider, Tough(3)', upgrades: 'da-f', cost: 155 }),
  ],
  upgradeGroups: [
    group('da-e', [
      // Black Knights is size 3 — no removal possible/needed, addition only.
      section('Replace one Plasma Talon', 'one', [
        { label: 'Linked Grenade Launcher', cost: 20, addEquipment: [linked(weapon('grenade-launcher'))], removeOneEquipment: ['Plasma Talons (18”, A1p, Linked)'] },
      ]),
    ]),
    group('da-f', [
      // Darkshroud and Vengeance are both single-model with baseline "Machinegun" (no count
      // prefix) — an unambiguous single-model swap.
      section('Replace Machinegun', 'one', [
        { label: 'Minigun (Rending)', cost: 5, adds: ['Rending'], addEquipment: [weapon('minigun', { rules: rules('Rending') })], removeOneEquipment: ['Machinegun'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Tactics', 'Once per game all friendly units may re-roll failed hits until the end of the round.'),
    armyRule('Deathwing', 'This unit arrives from Deep Strike automatically and can do so from round 1.'),
    armyRule('Shroud of Angels', 'This unit and all friendly units within 6” get the Stealth special rule.'),
  ],
}

export const greyKnightsBundle: ChapterBundle = {
  units: [
    unit(SM, { name: 'Brother Champion', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Medium', 'Powersword')], special: 'Aegis, Fearless, Hero, Psyker(1), Tough(3)', upgrades: '-', cost: 75 }),
    unit(SM, { name: 'Strike Squad', size: 5, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { label: 'Stormbolters' }), meleeWeapon('Light', 'Powersword', { label: 'Light Powerswords' })], special: 'Aegis, Brothers, Fearless', upgrades: 'gk-h', cost: 190 }),
    unit(SM, { name: 'Grey Knights Terminators', size: 5, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }, { label: 'Stormbolters' }), meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Aegis, Armored, Brothers, Deep Strike, Fearless', upgrades: 'gk-i', cost: 255 }),
    unit(SM, { name: 'Dreadknight', size: 1, quality: '3+', equipment: [meleeWeapon('Master', 'CCW', { rules: rules('Piercing, Rending') })], special: 'Aegis, Armored, Deep Strike, Fear, Fearless, Impact(D3), Psyker(1), Tough(3)', upgrades: 'gk-j', cost: 105 }),
  ],
  upgradeGroups: [
    group('gk-h', [
      section('Replace one Stormbolter', 'one', [
        { label: 'Incinerator (Heavy Flamer)', cost: 20, addEquipment: [weapon('heavy-flamer', { label: 'Incinerator' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psilencer', cost: 30, addEquipment: [customWeapon('Psilencer', { range: 24, attacks: '6' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psycannon', cost: 30, addEquipment: [customWeapon('Psycannon', { range: 24, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
      ]),
      section('Upgrade all models with', 'one', [{ label: 'Teleporter', cost: 15, adds: ['Teleporter'] }]),
    ]),
    group('gk-i', [
      section('Replace any Stormbolter', 'any', [
        { label: 'Incinerator (Heavy Flamer)', cost: 20, addEquipment: [weapon('heavy-flamer', { label: 'Incinerator' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psilencer', cost: 30, addEquipment: [customWeapon('Psilencer', { range: 24, attacks: '6' })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
        { label: 'Psycannon', cost: 30, addEquipment: [customWeapon('Psycannon', { range: 24, attacks: '3', rules: rules('Piercing, Rending') })], removeOneEquipment: ['Stormbolters (24”, A2)'] },
      ]),
    ]),
    group('gk-j', [
      section('Take up to two', 'upToTwo', [
        { label: 'Heavy Incinerator', cost: 55, addEquipment: [customWeapon('Heavy Incinerator', { range: 18, attacks: '6', rules: rules('Piercing') })] },
        { label: 'Gatling Psilencer', cost: 95, addEquipment: [customWeapon('Gatling Psilencer', { range: 24, attacks: '12' })] },
        { label: 'Heavy Psycannon', cost: 135, addEquipment: [customWeapon('Heavy Psycannon', { range: 24, attacks: '9', rules: rules('Piercing, Rending') })] },
      ]),
      section('Upgrade with', 'one', [{ label: 'Teleporter', cost: 5, adds: ['Teleporter'] }]),
    ]),
  ],
  armyRules: [
    armyRule('Aegis', 'This unit may re-roll results of 1 when denying Psychic Powers.'),
    armyRule('Brothers', 'This unit counts as having the Psyker(1) special rule, however only one model may manifest psychic powers with it per round.'),
    armyRule('Teleporter', 'This unit moves +2D6” and may move through units and obstacles, ignoring terrain effects.'),
  ],
}

export const spaceWolvesBundle: ChapterBundle = {
  units: [
    unit(SM, { name: 'Sled Captain', size: 1, quality: '3+', equipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' }), meleeWeapon('Master', 'Claws'), meleeWeapon('Medium', 'Powersword')], special: 'Counter-Attack, Fearless, Hero, Tactics, Tough(6), Vehicle', upgrades: '-', cost: 140 }),
    unit(SM, { name: 'Wulfen', size: 5, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs' })], special: 'Counter-Attack, Fast, Fearless, Rage, Regeneration, Tough(3)', upgrades: 'sw-k', cost: 295 }),
    unit(SM, { name: 'Thunderwolf Cavalry', size: 3, quality: '3+', equipment: [weapon('pistol', { label: 'Pistols' }), meleeWeapon('Master', 'CCW', { label: 'Master CCWs' })], special: 'Armored, Counter-Attack, Fast, Fearless, Impact(1), Tough(3)', upgrades: 'sw-l', cost: 200 }),
    unit(SM, { name: 'Fenrisian Wolves', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Claws')], special: 'Counter-Attack, Fast, Strider', upgrades: '-', cost: 120 }),
    unit(SM, { name: 'Wolf', size: 1, quality: '-', equipment: [meleeWeapon('Medium', 'Claws')], special: 'Counter-Attack, Fast, Strider, Wolf', upgrades: '-', cost: 0 }),
  ],
  upgradeGroups: [
    group('sw-k', [
      section('Any model may take one', 'one', [
        { label: 'Auto-Launcher', cost: 10, addEquipment: [customWeapon('Auto-Launcher', { range: 12, attacks: 'D3' })] },
        { label: 'Storm Shield (Tough(+3))', cost: 25, adds: ['Tough(+3)'] },
      ]),
      section('Replace any Heavy CCW', 'any', [
        { label: 'Master CCW', cost: 5, addEquipment: [meleeWeapon('Master', 'CCW')], removeOneEquipment: ['Heavy CCW'] },
        { label: 'Heavy Powerfist', cost: 15, addEquipment: [meleeWeapon('Heavy', 'Powerfist')], removeOneEquipment: ['Heavy CCW'] },
      ]),
    ]),
    group('sw-l', [
      section('Replace any Pistol', 'any', [
        { label: 'Assault Rifle', cost: 5, addEquipment: [weapon('assault-rifle')], removeOneEquipment: ['Pistol'] },
        { label: 'Plasma Pistol', cost: 15, addEquipment: [weapon('plasma-pistol')], removeOneEquipment: ['Pistol'] },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Counter-Attack', 'This unit gets +1A in Melee when Assaulted by an enemy.'),
    armyRule('Tactics', 'Once per game all friendly units may re-roll failed hits until the end of the round.'),
    armyRule('Rage', 'This unit has the Furious special rule but gets +2 attacks when Assaulting.'),
    armyRule('Wolf', 'This model has the same Quality value as its hero and doesn’t take up transport space. If the upgrading hero is killed this model is removed.'),
  ],
}
