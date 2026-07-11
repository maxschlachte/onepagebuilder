// Adeptus Mechanicus / Skitarii — transcribed from the rulebook PDF (page 19),
// section/selection structure cross-checked against `one-page-40k-army-lists.html`.
import { armyRule, customWeapon, faction, group, linked, meleeWeapon, rules, section, weapon } from './helpers'

export const adeptusMechanicus = faction({
  id: 'adeptus-mechanicus',
  name: 'Adeptus Mechanicus / Skitarii',
  units: [
    { name: 'Skitarii Alpha', size: 1, quality: '5+', equipment: [weapon('pistol', { rules: rules('Ignores Cover') }), meleeWeapon('Medium', 'CCW')], special: 'Doctrines, Hero, Tough(3)', upgrades: 'A', cost: 20 },
    { name: 'Sicarian Princeps', size: 1, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { rules: rules('Rending') })], special: 'Doctrines, Fast, Furious, Hero, Regeneration, Tough(3)', upgrades: 'B', cost: 65 },
    { name: 'Tech-Priest', size: 1, quality: '3+', equipment: [customWeapon('Eradication Ray', { range: 24, attacks: '3', rules: rules('Piercing') }), weapon('carbine', { rules: rules('Ignores Cover') }), meleeWeapon('Medium', 'Powersword')], special: 'Armored, Doctrines, Hero, Machine Master, Regeneration, Tough(3)', upgrades: 'C', cost: 125 },
    { name: 'Skitarii Rangers', size: 5, quality: '5+', equipment: [weapon('rifle', { label: 'Rifles' })], special: 'Doctrines, Strider', upgrades: 'D', cost: 80 },
    { name: 'Skitarii Vanguard', size: 5, quality: '5+', equipment: [customWeapon('Radium Carbines', { range: 18, attacks: '3', rules: rules('Radium') })], special: 'Doctrines', upgrades: 'D', cost: 150 },
    { name: 'Sicarian Rustalkers', size: 5, quality: '3+', equipment: [meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Rending') })], special: 'Doctrines, Fast, Furious, Regeneration', upgrades: 'E', cost: 165 },
    { name: 'Sicarian Infiltrators', size: 5, quality: '3+', equipment: [customWeapon('Stubcarbines', { range: 18, attacks: '3' }), meleeWeapon('Medium', 'Powersword', { label: 'Medium Powerswords' })], special: 'Doctrines, Fast, Regeneration, Scout, Stealth', upgrades: 'F', cost: 295 },
    { name: 'Corpuscarii Priests', size: 5, quality: '5+', equipment: [customWeapon('Gauntlets', { range: 12, attacks: '2', rules: rules('Linked') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Shock') })], special: 'Doctrines, Furious, Regeneration', upgrades: '-', cost: 120 },
    { name: 'Fulgurite Priests', size: 5, quality: '5+', equipment: [customWeapon('Gauntlets', { range: 12, attacks: '2', rules: rules('Linked') }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Deadly') })], special: 'Doctrines, Furious, Regeneration', upgrades: '-', cost: 190 },
    { name: 'Destroyers', size: 3, quality: '4+', equipment: [customWeapon('Plasma Culverines', { range: 24, attacks: '6', rules: rules('Piercing') }), weapon('carbine', { label: 'Carbines', rules: rules('Ignores Cover') })], special: 'Armored, Doctrines, Tough(3)', upgrades: 'G', cost: 330 },
    { name: 'Breachers', size: 3, quality: '4+', equipment: [customWeapon('Heavy Arc Rifles', { range: 36, attacks: '2', rules: rules('Piercing, Haywire') }), meleeWeapon('Light', 'CCW', { label: 'Light CCWs', rules: rules('Piercing, Haywire') })], special: 'Armored, Doctrines, Tough(3)', upgrades: 'H', cost: 335 },
    { name: 'Kastelan Robots', size: 2, quality: '4+', equipment: [weapon('assault-rifle', { label: 'Assault Rifles', rules: rules('Ignores Cover') }), meleeWeapon('Heavy', 'Powerfist', { label: 'Heavy Powerfists' })], special: 'Armored, Datasmith, Doctrines, Fear, Fearless, Impact(D3), Repulsor, Tough(3)', upgrades: 'I', cost: 150 },
    { name: 'Dragoon', size: 1, quality: '3+', equipment: [meleeWeapon('Heavy', 'CCW', { rules: rules('Joust, Piercing, Taser') })], special: 'Armored, Doctrines, Fast, Impact(D3), Tough(3)', upgrades: 'J', cost: 70 },
    { name: 'Ballistrarius', size: 1, quality: '3+', equipment: [linked(weapon('autocannon')), meleeWeapon('Medium', 'CCW')], special: 'Armored, Doctrines, Fast, Impact(D3), Tough(3)', upgrades: 'K', cost: 115 },
    { name: 'Dunecrawler', size: 1, quality: '3+', equipment: [linked(weapon('machinegun', { rules: rules('Ignores Cover') }))], special: 'Armored, Doctrines, Strider, Tough(6)', upgrades: 'L', cost: 125 },
  ],
  upgradeGroups: [
    group('A', [
      // Section title reads "Radium Carbine" but Skitarii Alpha's actual baseline
      // is a Pistol — pre-existing title/baseline naming mismatch, not addressed
      // here; equipment effects target the real baseline label.
      section('Replace Radium Carbine', 'one', [
        { label: 'Pistol (Radium)', cost: 5, addEquipment: [weapon('pistol', { rules: rules('Radium') })], removeOneEquipment: ['Pistol (Ignores Cover)'] },
        { label: 'Pistol (Haywire)', cost: 5, addEquipment: [weapon('pistol', { rules: rules('Haywire') })], removeOneEquipment: ['Pistol (Ignores Cover)'] },
        {
          label: 'Radium Carbine',
          cost: 20,
          addEquipment: [customWeapon('Radium Carbine', { range: 18, attacks: '3', rules: rules('Radium') })],
          removeOneEquipment: ['Pistol (Ignores Cover)'],
        },
      ]),
      section('Replace Medium CCW', 'one', [
        { label: 'Medium Powersword', cost: 5, addEquipment: [meleeWeapon('Medium', 'Powersword')], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium CCW (Taser)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Taser') })], removeOneEquipment: ['Medium CCW'] },
        { label: 'Medium CCW (Haywire)', cost: 5, addEquipment: [meleeWeapon('Medium', 'CCW', { rules: rules('Haywire') })], removeOneEquipment: ['Medium CCW'] },
      ]),
    ]),
    group('B', [
      section('Take one', 'one', [
        { label: 'Dataspike', cost: 10, addEquipment: [customWeapon('Dataspike', { range: null, attacks: '1', rules: rules('Haywire') })] },
      ]),
    ]),
    group('C', [
      section('Replace Eradication Ray', 'one', [
        {
          label: 'Volkite Blaster',
          cost: 10,
          addEquipment: [customWeapon('Volkite Blaster', { range: 24, attacks: '3', rules: rules('Piercing, Deflagrate') })],
          removeOneEquipment: ['Eradication Ray (24”, A3p)'],
        },
      ]),
      section('Replace Carbine', 'one', [
        {
          label: 'Macrostubber',
          cost: 15,
          addEquipment: [customWeapon('Macrostubber', { range: 12, attacks: '5' })],
          removeOneEquipment: ['Carbine (Ignores Cover)'],
        },
      ]),
    ]),
    group('D', [
      // Shared by Skitarii Rangers (baseline "Rifles") and Skitarii Vanguard
      // (baseline "Radium Carbines (...)") — both multi-model, so the
      // single-model removal never actually triggers; listed for both anyway.
      section('Replace one Radium Carbine or Rifle', 'one', [
        {
          label: 'Assault Rifle (Haywire)',
          cost: 5,
          addEquipment: [weapon('assault-rifle', { rules: rules('Haywire') })],
          removeOneEquipment: ['Rifles', 'Radium Carbines (18”, A3, Radium)'],
        },
        {
          label: 'Plasma Caliver',
          cost: 15,
          addEquipment: [customWeapon('Plasma Caliver', { range: 18, attacks: '3', rules: rules('Piercing') })],
          removeOneEquipment: ['Rifles', 'Radium Carbines (18”, A3, Radium)'],
        },
        {
          label: 'Arquebus',
          cost: 145,
          addEquipment: [customWeapon('Arquebus', { range: 48, attacks: '3', rules: rules('Piercing, Single Target, Sniper') })],
          removeOneEquipment: ['Rifles', 'Radium Carbines (18”, A3, Radium)'],
        },
      ]),
    ]),
    group('E', [
      section('Replace all Medium CCWs', 'one', [
        {
          label: 'Heavy CCWs (Rending)',
          cost: 40,
          addEquipment: [meleeWeapon('Heavy', 'CCW', { label: 'Heavy CCWs', rules: rules('Rending') })],
          removeEquipment: ['Medium CCWs (Rending)'],
        },
      ]),
    ]),
    group('F', [
      section('Replace all Stubcarbines and Medium Powerswords', 'one', [
        {
          label: 'Flechette Blasters, Medium CCWs (Taser)',
          cost: 0,
          addEquipment: [customWeapon('Flechette Blasters', { range: 12, attacks: '5' }), meleeWeapon('Medium', 'CCW', { label: 'Medium CCWs', rules: rules('Taser') })],
          removeEquipment: ['Stubcarbines (18”, A3)', 'Medium Powerswords'],
        },
      ]),
    ]),
    group('G', [
      section('Replace any Plasma Culverin', 'any', [
        {
          label: 'Heavy Grav-Cannon',
          cost: 0,
          addEquipment: [customWeapon('Heavy Grav-Cannon', { range: 30, attacks: '5', rules: rules('Piercing') })],
          removeOneEquipment: ['Plasma Culverines (24”, A6p)'],
        },
      ]),
      section('Replace any Carbine', 'any', [
        {
          label: 'Flamer',
          cost: 15,
          addEquipment: [weapon('flamer')],
          removeOneEquipment: ['Carbines (Ignores Cover)'],
        },
      ]),
    ]),
    group('H', [
      section('Replace any Heavy Arc Rifle', 'any', [
        {
          label: 'Torsion Cannon',
          cost: 0,
          addEquipment: [customWeapon('Torsion Cannon', { range: 24, attacks: '3', rules: rules('Piercing, Single Target, Contortion') })],
          removeOneEquipment: ['Heavy Arc Rifles (36”, A2p, Haywire)'],
        },
      ]),
      section('Replace any Light CCW', 'any', [
        {
          label: 'Light Powerfist (Haywire)',
          cost: 5,
          addEquipment: [meleeWeapon('Light', 'Powerfist', { rules: rules('Haywire') })],
          removeOneEquipment: ['Light CCWs (Piercing, Haywire)'],
        },
      ]),
    ]),
    group('I', [
      section('Replace any Heavy Powerfist', 'any', [
        {
          label: 'Linked Machinegun (Ignores Cover)',
          cost: 25,
          addEquipment: [linked(weapon('machinegun', { rules: rules('Ignores Cover') }))],
          removeOneEquipment: ['Heavy Powerfists'],
        },
      ]),
      section('Replace any Assault Rifle', 'any', [
        {
          label: 'Incendine Combustor',
          cost: 25,
          addEquipment: [customWeapon('Incendine Combustor', { range: 18, attacks: '6' })],
          removeOneEquipment: ['Assault Rifles (Ignores Cover)'],
        },
      ]),
    ]),
    group('J', [
      section('Replace Heavy CCW', 'one', [
        {
          label: 'Jezzail',
          cost: 25,
          addEquipment: [customWeapon('Jezzail', { range: 30, attacks: '2', rules: rules('Piercing, Sniper, Radium') })],
          removeOneEquipment: ['Heavy CCW (Joust, Piercing, Taser)'],
        },
      ]),
      section('Upgrade with', 'one', [
        { label: 'Carbine (Ignores Cover)', cost: 5, addEquipment: [weapon('carbine', { rules: rules('Ignores Cover') })] },
      ]),
    ]),
    group('K', [
      section('Replace Linked Autocannon', 'one', [
        {
          label: 'Linked Lascannon',
          cost: 90,
          addEquipment: [linked(weapon('lascannon'))],
          removeOneEquipment: ['Linked Autocannon'],
        },
      ]),
    ]),
    group('L', [
      // Section title reads "Eradication Beamer" but Dunecrawler's actual
      // baseline is "Linked Machinegun (Ignores Cover)" — same pre-existing
      // title/baseline mismatch pattern as group A above.
      section('Replace Eradication Beamer', 'one', [
        {
          label: 'Neutron Laser, Machinegun',
          cost: 95,
          addEquipment: [customWeapon('Neutron Laser', { range: 48, attacks: '3', rules: rules('Piercing, Rending') }), weapon('machinegun')],
          removeOneEquipment: ['Linked Machinegun (Ignores Cover)'],
        },
        {
          label: 'Eradication Beamer',
          cost: 150,
          addEquipment: [customWeapon('Eradication Beamer', { range: 36, attacks: '9', rules: rules('Piercing') })],
          removeOneEquipment: ['Linked Machinegun (Ignores Cover)'],
        },
        {
          label: 'Icarus Array',
          cost: 190,
          addEquipment: [customWeapon('Icarus Array', { range: 48, attacks: '8', rules: rules('Piercing') })],
          removeOneEquipment: ['Linked Machinegun (Ignores Cover)'],
        },
      ]),
      section('Take one', 'one', [{ label: 'Machinegun', cost: 45, addEquipment: [weapon('machinegun')] }]),
    ]),
  ],
  armyRules: [
    armyRule('Datasmith', 'Place a datasmith model next to this unit, which gives the unit the Regeneration special rule. If this unit fails to ignore any Wounds, then the datasmith model is removed.'),
    armyRule('Deadly', 'Whenever this weapon hits an Infantry model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.'),
    armyRule('Deflagrate', 'Whenever this weapon causes one or more wounds the target immediately takes as many automatic hits as wounds. This rule does not apply to wounds generated by these hits.'),
    armyRule('Doctrines', 'Whenever this unit is activated you may pick one of the following doctrines, which gives a special rule to all models: Protector (Linked in Melee); Conqueror (Linked in Shooting).'),
    armyRule('Contortion', 'This weapon causes D3 wounds instead of just 1.'),
    armyRule('Haywire', 'When hitting Vehicles this weapon ignores Armored and is only blocked on rolls of 6.'),
    armyRule('Joust', 'This unit gets Impact(+1).'),
    armyRule('Machine Master', 'Once per turn, if this unit is inside or within 2” of a Kastelan Robot, Dragoon, Ballistrarius or Dunecrawler, it may try to repair it. Roll one die, on a 2+ it may re-gain one wound.'),
    armyRule('Radium', 'For every 6 rolled when firing this weapon the target takes one additional automatic wound if it fails to block any hits.'),
    armyRule('Repulsor', 'For every 6 rolled when blocking ranged attacks the shooting unit takes one automatic hit.'),
    armyRule('Shock', 'For every 6 rolled when attacking with this weapon the target takes two additional hits.'),
    armyRule('Taser', 'For every 6 rolled when firing this weapon the target takes one additional automatic hit.'),
  ],
  psychicPowers: [],
})
