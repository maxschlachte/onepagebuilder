// Dark Eldar — transcribed from the rulebook PDF (page 13),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, gear, group, linked, meleeWeapon, rules, section, weapon } from './helpers'

export const darkEldar = faction({
  id: 'dark-eldar',
  name: 'Dark Eldar',
  units: [
    { name: 'Archon', size: 1, quality: '4+', equipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW')], special: 'Hero, Pain, Tough(3)', upgrades: 'A, D, I, J', cost: 30 },
    { name: 'Succubus', size: 1, quality: '4+', equipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW')], special: 'Dodge, Hero, Pain, Tough(3)', upgrades: 'A, G, I, J', cost: 35 },
    { name: 'Haemonculus', size: 1, quality: '4+', equipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW', { rules: rules('Poison') })], special: 'Hero, Pain, Regeneration, Tough(3)', upgrades: 'E, I, M', cost: 45 },
    { name: 'Ur-Ghul', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'CCW')], special: 'Court, Fear, Furious, Regeneration', upgrades: '-', cost: 20 },
    { name: 'Lhamaean', size: 1, quality: '4+', equipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Light', 'CCW', { rules: rules('Deadly') })], special: 'Court, Pain', upgrades: '-', cost: 25 },
    { name: 'Medusae', size: 1, quality: '4+', equipment: [customWeapon('Eyeburst', { range: 12, attacks: '6' })], special: 'Court, Pain', upgrades: '-', cost: 30 },
    { name: 'Sslyth', size: 1, quality: '4+', equipment: [customWeapon('Shardcarbine', { range: 18, attacks: '3', rules: rules('Poison') }), weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Heavy', 'CCW')], special: 'Court, Regeneration', upgrades: '-', cost: 40 },
    { name: 'Beastmaster', size: 1, quality: '4+', equipment: [customWeapon('Splinter Pods', { range: 18, attacks: '2', rules: rules('Poison') })], special: 'Beastmaster, Fast, Strider', upgrades: 'T', cost: 25 },
    { name: 'Khymera', size: 1, quality: '4+', equipment: [meleeWeapon('Heavy', 'Claw', { label: 'Heavy Claws' })], special: 'Beastmaster, Fast, Fear, Regeneration, Strider', upgrades: '-', cost: 25 },
    { name: 'Razorwing Flock', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws', rules: rules('Rending') })], special: 'Beastmaster, Fast, Strider, Tough(3)', upgrades: '-', cost: 45 },
    { name: 'Clawed Fiend', size: 1, quality: '4+', equipment: [meleeWeapon('Master', 'Claw', { label: 'Master Claws' })], special: 'Armored, Beastmaster, Fast, Furious, Strider, Tough(3)', upgrades: '-', cost: 45 },
    { name: 'Warriors', size: 5, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Poison') })], special: 'Pain', upgrades: 'A, B, N', cost: 100 },
    { name: 'Wyches', size: 5, quality: '4+', equipment: [weapon('pistol', { label: 'Pistols', rules: rules('Poison') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Dodge, Drugs, Pain', upgrades: 'A, G, J, O', cost: 115 },
    { name: 'Scourges', size: 5, quality: '4+', equipment: [customWeapon('Shardcarbines', { range: 18, attacks: '3', rules: rules('Poison') })], special: 'Deep Strike, Flying, Pain', upgrades: 'B, S', cost: 175 },
    { name: 'Hellions', size: 5, quality: '4+', equipment: [customWeapon('Splinter Pods', { range: 18, attacks: '2', rules: rules('Poison') })], special: 'Deep Strike, Drugs, Flying, Pain', upgrades: 'T', cost: 160 },
    { name: 'Wracks', size: 5, quality: '4+', equipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Poison') })], special: 'Pain, Regeneration', upgrades: 'E, R', cost: 100 },
    { name: 'Incubi', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Pain', upgrades: 'P', cost: 115 },
    { name: 'Mandrakes', size: 5, quality: '3+', equipment: [customWeapon('Baleblasts', { range: 18, attacks: '2' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs' })], special: 'Fear, Pain, Scout, Stealth, Strider', upgrades: '-', cost: 215 },
    { name: 'Grotesques', size: 3, quality: '4+', equipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs', rules: rules('Deadly') })], special: 'Armored, Pain, Regeneration, Rampage, Tough(3)', upgrades: 'Q', cost: 235 },
    { name: 'Reavers', size: 3, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Poison') }), weapon('pistol', { label: 'Pistols', rules: rules('Poison') })], special: 'Drugs, Fast, Impact(1), Pain, Strider', upgrades: 'U', cost: 100 },
    { name: 'Venom', size: 1, quality: '4+', equipment: [customWeapon('Splinter Cannon', { range: 36, attacks: '5', rules: rules('Poison') }), linked(weapon('assault-rifle', { rules: rules('Poison') }))], special: 'Armored, Deep Strike, Fast, Stealth, Strider, Tough(3), Transport(6)', upgrades: 'H, K', cost: 120 },
    { name: 'Cronos', size: 1, quality: '4+', equipment: [customWeapon('Spirit Syphon', { range: 12, attacks: '6' }), meleeWeapon('Heavy', 'CCW')], special: 'Armored, Fear, Fearless, Impact(D3), Regeneration, Tough(3)', upgrades: 'C', cost: 80 },
    { name: 'Talos', size: 1, quality: '4+', equipment: [customWeapon('Linked Haywire Blaster', { range: 24, attacks: '1', rules: rules('Haywire, Linked') }), meleeWeapon('Master', 'CCW', { rules: rules('Piercing') })], special: 'Armored, Fear, Fearless, Impact(D3), Regeneration, Tough(3)', upgrades: 'F', cost: 80 },
    { name: 'Raider', size: 1, quality: '4+', equipment: [customWeapon('Disintegrator Cannon', { range: 36, attacks: '3', rules: rules('Piercing') })], special: 'Deep Strike, Fast, Strider, Tough(3), Transport(11), Vehicle', upgrades: 'H, L', cost: 100 },
    { name: 'Ravager', size: 1, quality: '4+', equipment: [customWeapon('Disintegrator Cannons', { range: 36, attacks: '3', rules: rules('Piercing') }, { count: 3 })], special: 'Deep Strike, Fast, Strider, Tough(3), Vehicle', upgrades: 'H, L', cost: 160 },
  ],
  upgradeGroups: [
    group('A', [
      section('Replace one Medium CCW', 'one', [
        { label: 'Medium CCW (Poison)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Poison') })], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium Powersword', cost: 10, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('B', [
      // Warriors/Scourges are both size 5 with different baseline labels (Assault Rifles vs
      // Shardcarbines) — only one is ever present on a given unit, so listing both exact
      // labels here safely decrements whichever one actually applies.
      section('Replace one Assault Rifle or Shardcarbine', 'one', [
        { label: 'Shredder (12”, A3p)', cost: 5, addEquipment: [customWeapon('Shredder', { range: 12, attacks: '3', rules: rules('Piercing') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
        { label: 'Haywire Blaster (24”, A1, Haywire)', cost: 5, addEquipment: [customWeapon('Haywire Blaster', { range: 24, attacks: '1', rules: rules('Haywire') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
        { label: 'Blaster (18”, A6x)', cost: 25, addEquipment: [customWeapon('Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
        { label: 'Heat Lance (18”, A7x)', cost: 30, addEquipment: [customWeapon('Heat Lance', { range: 18, attacks: '7', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
        { label: 'Splinter Cannon (36”, A5, Poison)', cost: 50, addEquipment: [customWeapon('Splinter Cannon', { range: 36, attacks: '5', rules: rules('Poison') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
        { label: 'Dark Lance (36”, A6x)', cost: 60, addEquipment: [customWeapon('Dark Lance', { range: 36, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Assault Rifles (Poison)', 'Shardcarbines (18”, A3, Poison)'] },
      ]),
    ]),
    group('C', [
      section('Take one', 'one', [
        { label: 'Spirit Probe', cost: 10, addEquipment: [gear('Spirit Probe', { rules: rules('Spirit Probe') })] },
        { label: 'Spirit Vortex (18”, A9)', cost: 40, addEquipment: [customWeapon('Spirit Vortex', { range: 18, attacks: '9' })] },
      ]),
    ]),
    group('D', [
      section('Take any', 'any', [
        { label: 'Clone Field (Armored)', cost: 10, adds: ['Armored'] },
        { label: 'Phantasm Launcher (18”, A3, Fright)', cost: 30, addEquipment: [customWeapon('Phantasm Launcher', { range: 18, attacks: '3', rules: rules('Fright') })] },
      ]),
      section('Replace Medium CCW', 'one', [
        { label: 'Medium CCW (Deadly)', cost: 20, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Deadly') })], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('E', [
      section('Replace one Medium CCW', 'one', [
        { label: 'Medium CCW (Deadly)', cost: 20, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Deadly') })], removeOneEquipment: ['Medium CCW (Poison)'] },
      ]),
      // "Pistol or Medium CCW" — which of the two baseline items is replaced is unspecified
      // per option, so removal is left unset (addition only); the cost-0 "Pistol (Poison)"
      // option duplicates Haemonculus's existing baseline pistol and is left with no effects.
      section('Replace one Pistol or Medium CCW', 'one', [
        { label: 'Pistol (Poison)', cost: 0 },
        { label: 'Liqifier Gun (12”, A6p)', cost: 25, addEquipment: [customWeapon('Liqifier Gun', { range: 12, attacks: '6', rules: rules('Piercing') })] },
        { label: 'Hexrifle (36”, A1p, Sniper, Deadly)', cost: 50, addEquipment: [customWeapon('Hexrifle', { range: 36, attacks: '1', rules: rules('Piercing, Sniper, Deadly') })] },
      ]),
    ]),
    group('F', [
      section('Replace Master CCW', 'one', [
        { label: 'Ichor Injector (A1, Deadly)', cost: 0, addEquipment: [customWeapon('Ichor Injector', { range: null, attacks: '1', rules: rules('Deadly') })], removeOneEquipment: ['Master CCW (Piercing)'] },
        { label: 'Linked Liqifier Gun (12”, A6p)', cost: 10, addEquipment: [customWeapon('Linked Liqifier Gun', { range: 12, attacks: '6', rules: rules('Piercing, Linked') })], removeOneEquipment: ['Master CCW (Piercing)'] },
      ]),
      section('Replace Linked Haywire Blaster', 'one', [
        { label: 'Stinger Pod (24”, A6)', cost: 25, addEquipment: [customWeapon('Stinger Pod', { range: 24, attacks: '6' })], removeOneEquipment: ['Linked Haywire Blaster (24”, A1, Haywire)'] },
        { label: 'Linked Heat Lance (18”, A7x)', cost: 40, addEquipment: [customWeapon('Linked Heat Lance', { range: 18, attacks: '7', rules: rules('Piercing, Single Target, Linked') })], removeOneEquipment: ['Linked Haywire Blaster (24”, A1, Haywire)'] },
        { label: 'Linked Splinter Cannon (36”, A5, Poison)', cost: 65, addEquipment: [customWeapon('Linked Splinter Cannon', { range: 36, attacks: '5', rules: rules('Poison, Linked') })], removeOneEquipment: ['Linked Haywire Blaster (24”, A1, Haywire)'] },
      ]),
    ]),
    group('G', [
      section('Replace one Pistol and Medium CCW', 'one', [
        { label: 'Medium CCW (Linked)', cost: 0, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Linked') })], removeOneEquipment: ['Pistol (Poison)', 'Medium CCW'] },
        { label: 'Medium CCW (Piercing)', cost: 0, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Piercing') })], removeOneEquipment: ['Pistol (Poison)', 'Medium CCW'] },
        { label: 'Medium CCW (Linked, Piercing)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Linked, Piercing') })], removeOneEquipment: ['Pistol (Poison)', 'Medium CCW'] },
      ]),
    ]),
    group('H', [
      section('Upgrade with any', 'any', [
        { label: 'Chain-Snares (Impact(+D3))', cost: 5 },
        { label: 'Aeathersails', cost: 5 },
        { label: 'Night Shields (Stealth)', cost: 5 },
        { label: 'Torment Launcher (24”, A3, Fright)', cost: 30, addEquipment: [customWeapon('Torment Launcher', { range: 24, attacks: '3', rules: rules('Fright') })] },
      ]),
    ]),
    group('I', [
      section('Upgrade with', 'one', [
        { label: 'Webway Portal (the hero’s unit gets Deep Strike)', cost: 25, adds: ['Deep Strike'] },
      ]),
    ]),
    group('J', [
      section('Replace one Pistol', 'one', [
        { label: 'Blast Pistol (6”, A6x)', cost: 10, addEquipment: [customWeapon('Blast Pistol', { range: 6, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistol (Poison)'] },
        { label: 'Blaster (18”, A6x)', cost: 30, addEquipment: [customWeapon('Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Pistol (Poison)'] },
      ]),
    ]),
    group('K', [
      section('Replace Linked Assault Rifle', 'one', [
        { label: 'Splinter Cannon (36”, A5, Poison)', cost: 45, addEquipment: [customWeapon('Splinter Cannon', { range: 36, attacks: '5', rules: rules('Poison') })], removeOneEquipment: ['Linked Assault Rifle (Poison)'] },
      ]),
    ]),
    group('L', [
      // Shared by Raider (1x Disintegrator Cannon, no count prefix) and Ravager (baseline
      // label is "3x Disintegrator Cannons (36”, A3p)", plural+prefixed) — the singular
      // removal label below only ever matches Raider's exact baseline entry, so Ravager's
      // 3x entry is correctly left untouched by the size check *and* the label mismatch.
      section('Replace any Disintegrator Cannon', 'any', [
        { label: 'Dark Lance (36”, A6x)', cost: 30, addEquipment: [customWeapon('Dark Lance', { range: 36, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Disintegrator Cannon (36”, A3p)'] },
      ]),
    ]),
    group('M', [
      section('Take one', 'one', [
        { label: 'Crucible of Malediction (3D6”, A3x, Limited)', cost: 5, addEquipment: [customWeapon('Crucible of Malediction', { range: '3D6', attacks: '3', rules: rules('Piercing, Single Target, Limited') })] },
      ]),
    ]),
    group('N', [
      // Warriors only (size 5); compound labels split into their parts.
      section('Replace one Assault Rifle', 'one', [
        { label: 'Pistol (Poison), Medium CCW', cost: 0, addEquipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Assault Rifles (Poison)'] },
        { label: 'Blast Pistol (6”, A6x), Medium CCW', cost: 10, addEquipment: [customWeapon('Blast Pistol', { range: 6, attacks: '6', rules: rules('Piercing, Single Target') }), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Assault Rifles (Poison)'] },
        { label: 'Phantasm Launcher (18”, A3, Fright)', cost: 25, addEquipment: [customWeapon('Phantasm Launcher', { range: 18, attacks: '3', rules: rules('Fright') })], removeOneEquipment: ['Assault Rifles (Poison)'] },
      ]),
      section('Upgrade all models', 'one', [{ label: 'Trueborn (+1A in Melee)', cost: 15 }]),
    ]),
    group('O', [
      section('Replace one Pistol', 'one', [
        { label: 'Phantasm Launcher (18”, A3, Fright)', cost: 25, addEquipment: [customWeapon('Phantasm Launcher', { range: 18, attacks: '3', rules: rules('Fright') })], removeOneEquipment: ['Pistols (Poison)'] },
      ]),
      section('Upgrade all models', 'one', [{ label: 'Bloodbrides (+1A in Melee)', cost: 15 }]),
    ]),
    group('P', [
      section('Replace one Medium Powersword', 'one', [
        { label: 'Heavy Powersword', cost: 5, addEquipment: [meleeWeapon('Heavy', 'Powersword')], removeOneEquipment: ['Medium Powersword'] },
      ]),
    ]),
    group('Q', [
      // Compound label keeps the existing Heavy CCW and adds a ranged weapon — only the new
      // part is added, since "Heavy CCW" in the label is the (unremoved) baseline reprinted.
      section('Replace any Heavy CCW', 'any', [
        { label: 'Liqifier Gun (12”, A6p), Heavy CCW', cost: 0, addEquipment: [customWeapon('Liqifier Gun', { range: 12, attacks: '6', rules: rules('Piercing') })] },
      ]),
    ]),
    group('R', [
      section('Upgrade one model with', 'one', [
        { label: 'Ossefactor (24”, A1p, Calcific)', cost: 20, addEquipment: [customWeapon('Ossefactor', { range: 24, attacks: '1', rules: rules('Piercing, Calcific') })] },
        { label: 'Liqifier Gun (12”, A6p)', cost: 25, addEquipment: [customWeapon('Liqifier Gun', { range: 12, attacks: '6', rules: rules('Piercing') })] },
      ]),
    ]),
    group('S', [
      // Scourges only (size 5); compound labels split into their parts.
      section('Replace one Shardcarbine', 'one', [
        { label: 'Pistol (Poison), Medium CCW', cost: 0, addEquipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Shardcarbines (18”, A3, Poison)'] },
        { label: 'Blast Pistol (6”, A6x), Medium CCW', cost: 5, addEquipment: [customWeapon('Blast Pistol', { range: 6, attacks: '6', rules: rules('Piercing, Single Target') }), meleeWeapon('Medium', 'CCW')], removeOneEquipment: ['Shardcarbines (18”, A3, Poison)'] },
      ]),
      section('Replace one Medium CCW', 'one', [
        { label: 'Medium CCW (Poison)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Poison') })], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium CCW (Piercing)', cost: 10, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Piercing') })], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('T', [
      // "Upgrade one model with one" is a pure addition (Beastmaster/Hellions keep their
      // Splinter Pods); the follow-on "Replace Medium CCW" section requires the Pistol/CCW
      // option above to have been picked first (see its prerequisite).
      section('Upgrade one model with one', 'one', [
        { label: 'Pistol (Poison), Medium CCW', cost: 10, addEquipment: [weapon('pistol', { rules: rules('Poison') }), meleeWeapon('Medium', 'CCW')] },
        { label: 'Phantasm Launcher (18”, A3, Fright)', cost: 30, addEquipment: [customWeapon('Phantasm Launcher', { range: 18, attacks: '3', rules: rules('Fright') })] },
      ]),
      section(
        'Replace Medium CCW',
        'one',
        [
          { label: 'Medium CCW (Poison)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Poison') })], removeOneEquipment: ['Medium CCW'] },
          { label: 'Medium CCW (Piercing)', cost: 10, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Piercing') })], removeOneEquipment: ['Medium CCW'] },
          { label: 'Medium CCW (Deadly)', cost: 20, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Deadly') })], removeOneEquipment: ['Medium CCW'] },
        ],
        {
          // No group-T unit has a baseline Medium CCW — one only exists if produced above.
          requiresOneOfSelected: ['Pistol (Poison), Medium CCW'],
        },
      ),
    ]),
    group('U', [
      // Reavers only (size 3).
      section('Replace one Assault Rifle', 'one', [
        { label: 'Blaster (18”, A6x)', cost: 25, addEquipment: [customWeapon('Blaster', { range: 18, attacks: '6', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Assault Rifles (Poison)'] },
        { label: 'Heat Lance (18”, A7x)', cost: 30, addEquipment: [customWeapon('Heat Lance', { range: 18, attacks: '7', rules: rules('Piercing, Single Target') })], removeOneEquipment: ['Assault Rifles (Poison)'] },
      ]),
      section('Upgrade one model with one', 'one', [
        { label: 'Cluster Caltrops (Impact(+D6))', cost: 10 },
      ]),
    ]),
  ],
  armyRules: [
    armyRule('Aethersails', 'This unit moves +3” when using Walk and +6” when using Run/Assault actions.'),
    armyRule('Beastmaster', 'You may deploy up to 10 models with this rule together to form a single unit.'),
    armyRule('Court', 'You may deploy up to 10 models with this rule together to form a single unit.'),
    armyRule('Calcific', 'Whenever an Infantry model is killed by this weapon its unit takes D6 automatic hits.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Dodge', 'This unit gets Armored when in Melee.'),
    armyRule('Drugs', 'Whenever this unit fights in Melee, roll one die: 1-2 Hypex (Fear); 3-4 Adrenalight (+1A in Melee); 5-6 Serpenting (Linked in Melee).'),
    armyRule('Fright', 'Whenever a unit takes hits from this weapon it must take a morale test. If failed the unit immediately takes D3 automatic wounds.'),
    armyRule('Haywire', 'When hitting Vehicles this weapon ignores Armored and is only blocked on rolls of 6.'),
    armyRule('Pain', 'This unit gains new special rules based on the current game round: Round 1 n/a; Round 2 Regeneration; Round 3 Furious; Round 4 Fearless.'),
    armyRule('Rampage', 'This model gets +D3 Attacks in Melee if it is fighting a unit with more models.'),
    armyRule('Spirit Probe', 'Friendly units within 6” may ignore wounds from Regeneration on 4+.'),
  ],
  psychicPowers: [],
})
