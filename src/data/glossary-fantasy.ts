// Age of Fantasy's own special-rule glossary, transcribed verbatim from
// `one-page-fantasy-rules.md` ("Unit Types" + "Common Special Rules" + "Common
// Upgrades" sections). Kept separate from `glossary.ts` (Grimdark Future's)
// rather than merged: several rules share a name with a Grimdark Future rule
// but differ in exact wording or mechanic (e.g. `Poison`, `Fast`, `Furious`),
// so a single shared id would have to pick one system's text over the other's.

import type { SpecialRule } from '../domain/types'

export const fantasyGlossary: SpecialRule[] = [
  {
    id: 'infantry',
    name: 'Infantry',
    text: 'Any unit that is not a Special unit counts as Infantry. You may deploy two copies of the same Infantry unit as one big unit, however upgrades that affect all models must be bought for both.',
  },
  {
    id: 'hero',
    name: 'Hero',
    text: 'May be deployed as part of friendly Infantry units of same Quality and have the Nimble special rule (not when Mounted).',
  },
  {
    id: 'wizard',
    name: 'Wizard',
    hasParameter: true,
    text: 'May be deployed as part of friendly Infantry units of same Quality and have the Nimble special rule (not when Mounted). Every round all players get D6 power dice to use for that round. Wizards may cast Spells at any point before attacking, and they require no line of sight. You may try to cast any Spell once per round by rolling any number of power dice and adding +X to the result. If you roll the same number or higher than the one in brackets you may resolve all effects. If a Wizard rolls two or more 6s it immediately takes D3 automatic wounds.',
  },
  {
    id: 'sergeant',
    name: 'Sergeant',
    text: 'One model gets +1 melee attack.',
  },
  {
    id: 'musician',
    name: 'Musician',
    text: 'Adds +1 for melee results.',
  },
  {
    id: 'standard',
    name: 'Standard',
    text: 'Adds +1 for melee results.',
  },
  {
    id: 'ordnance',
    name: 'Ordnance',
    text: 'May not use March/Charge actions, and may only fire when using Hold actions.',
  },
  {
    id: 'armored',
    name: 'Armored',
    text: 'Whenever this unit takes hits roll one die for each hit, on a 4+ it is ignored. This rule only applies if at least half of the models in a unit have it.',
  },
  {
    id: 'deadly',
    name: 'Deadly',
    text: 'Whenever this weapon hits an enemy model on a roll of 6 it takes D3+1 automatic wounds. Note that these hits can’t be ignored by the Armored special rule.',
  },
  {
    id: 'fast',
    name: 'Fast',
    text: 'This unit moves +3” when using Advance actions and +6” when using March/Charge actions.',
  },
  {
    id: 'fear',
    name: 'Fear',
    text: 'Enemy units without the Fear special rule must take a morale test before fighting melee with this unit. If failed they get Unwieldy for that melee.',
  },
  {
    id: 'fearless',
    name: 'Fearless',
    text: 'When taking morale tests roll one extra die and pick the highest result.',
  },
  {
    id: 'fiery-breath',
    name: 'Fiery Breath',
    text: 'Once per game this unit may deal 2D6 automatic hits in Melee or to an enemy unit within 12” in the Shooting phase.',
  },
  {
    id: 'flying',
    name: 'Flying',
    text: 'This unit may move through other units and obstacles, and it may ignore terrain effects.',
  },
  {
    id: 'furious',
    name: 'Furious',
    text: 'This model has +1 Attack in melee when using Charge actions.',
  },
  {
    id: 'impact',
    name: 'Impact',
    hasParameter: true,
    text: 'This unit deals X automatic hits for each model with this special rule in the two front rows when charging.',
  },
  {
    id: 'indirect',
    name: 'Indirect',
    text: 'This weapon may be fired at enemies that are not within line of sight, however targets not within line of sight count as being in Cover.',
  },
  {
    id: 'nimble',
    name: 'Nimble',
    text: 'This unit may pivot twice by up to 90° each when using Advance, March or Charge actions.',
  },
  {
    id: 'piercing',
    name: 'Piercing',
    text: 'This weapon ignores the Armored special rule. If a unit without Armored is hit then it must re-roll successful blocks instead.',
  },
  {
    id: 'poison',
    name: 'Poison',
    text: 'Whenever this weapon hits on a roll of 6 it causes one automatic wound. Note that these hits can’t be ignored by the Armored special rule.',
  },
  {
    id: 'rapid',
    name: 'Rapid',
    text: 'This weapon may re-roll failed hits.',
  },
  {
    id: 'regeneration',
    name: 'Regeneration',
    text: 'Whenever this unit takes Wounds roll one die for each, on a 5+ it is ignored.',
  },
  {
    id: 'resistance',
    name: 'Resistance',
    text: 'This unit ignores Spell effects on 4+.',
  },
  {
    // Weapons table footnote: `x` notation = Piercing + this single-target rule.
    id: 'single-target',
    name: 'Single Target',
    text: 'All wounds from this weapon must be assigned to a single model.',
  },
  {
    id: 'scout',
    name: 'Scout',
    text: 'This unit is deployed after all other non-scout units have been deployed. You may place this unit anywhere on the table over 12” away from enemy units (if both players have Scout units roll-off to see who deploys first).',
  },
  {
    id: 'sniper',
    name: 'Sniper',
    text: 'Models firing this weapon always hit on 2+ and ignore cover. The attacker may pick which model from the target unit is hit.',
  },
  {
    id: 'strider',
    name: 'Strider',
    text: 'This unit treats difficult terrain as open terrain for the purpose of movement.',
  },
  {
    id: 'tough',
    name: 'Tough',
    hasParameter: true,
    text: 'This model must accumulate X wounds before being removed as a casualty. If a unit with the special rule joins a unit without it you must either accumulate wounds until all models with this rule have been killed, or remove regular models as casualties before starting to accumulate wounds. Note that you must first accumulate wounds on a single model with this special rule until it is killed before you start accumulating them on another.',
  },
  {
    id: 'unwieldy',
    name: 'Unwieldy',
    text: 'This weapon must re-roll hits.',
  },
  {
    id: 'vanguard',
    name: 'Vanguard',
    text: 'After all other non-vanguard units have been deployed this unit may immediately move by up to 12” (if both players have Vanguard units roll-off to see who starts moving first).',
  },
]
