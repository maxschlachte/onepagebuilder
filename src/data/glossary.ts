// Global special-rule glossary, transcribed verbatim from
// `1p40k - Main Rulebook v3.3.1.pdf` (Rules page, "Special Rules" + "Unit Types").

import type { SpecialRule } from '../domain/types'

export const glossary: SpecialRule[] = [
  {
    id: 'armored',
    name: 'Armored',
    text: 'Whenever this unit takes hits roll one die for each hit, on a 4+ it is ignored. This rule only applies if at least half of the models in a unit have it.',
  },
  {
    id: 'deep-strike',
    name: 'Deep Strike',
    text: 'You may choose not to deploy this unit with your army, and instead keep it in reserve. After round 1 you may roll one die at the beginning of each round, and on a 4+ you may place the unit anywhere over 6” away from enemy units. Then roll one die, on a 1-2 the opponent may move the unit by up to 12” (must be in a valid position). On the last round the unit arrives automatically.',
  },
  {
    id: 'fast',
    name: 'Fast',
    text: 'This unit moves +3” when using Walk actions and +6” when using Run/Assault actions.',
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
    id: 'flying',
    name: 'Flying',
    text: 'This unit may move through other units and obstacles, and it may ignore terrain effects.',
  },
  {
    id: 'furious',
    name: 'Furious',
    text: 'This model has +1 Attack in melee when using Assault actions, and may use an Assault action at half its move to disembark from transports.',
  },
  {
    id: 'hero',
    name: 'Hero',
    text: 'Heroes may be deployed as part of friendly Infantry units of the same Quality. Each army may only have one Hero unit (more at higher points totals — see the army-composition table).',
  },
  {
    id: 'impact',
    name: 'Impact',
    hasParameter: true,
    isAdditive: true,
    text: 'This unit deals X automatic hits for each model with this rule when assaulting.',
  },
  {
    id: 'infantry',
    name: 'Infantry',
    text: 'Any non-Vehicle unit. You may deploy two copies of the same Infantry unit as one big unit; upgrades that affect all models must be bought for both.',
  },
  {
    id: 'indirect',
    name: 'Indirect',
    text: 'This weapon may be fired at enemies that are not within line of sight, however targets not within line of sight count as being in Cover.',
  },
  {
    id: 'ignores-cover',
    name: 'Ignores Cover',
    text: 'This weapon ignores the benefits of cover for its target.',
  },
  {
    id: 'limited',
    name: 'Limited',
    text: 'This weapon may only be used once.',
  },
  {
    id: 'linked',
    name: 'Linked',
    text: 'This weapon may re-roll failed hits.',
  },
  {
    id: 'piercing',
    name: 'Piercing',
    text: 'This weapon ignores the Armored special rule. If a unit without Armored is hit then it must re-roll successful blocks instead.',
  },
  {
    id: 'poison',
    name: 'Poison',
    text: 'Infantry must re-roll successful blocks.',
  },
  {
    id: 'psyker',
    name: 'Psyker',
    hasParameter: true,
    text: 'Every round all players get D6 power dice to use for that round. Psykers may manifest Powers at any point before attacking, and they require no line of sight. You may try to manifest any Power once per round by rolling any number of power dice and adding +X to the result. If you roll the same number or higher than the one in brackets you may resolve all effects. If a Psyker rolls two or more 6s it immediately takes D3 automatic wounds. Psykers may be deployed as part of friendly Infantry units of the same Quality.',
  },
  {
    id: 'regeneration',
    name: 'Regeneration',
    text: 'Whenever this unit takes wounds roll one die for each wound, on a 5+ it is ignored.',
  },
  {
    id: 'rending',
    name: 'Rending',
    text: 'Whenever this weapon hits on a roll of 6 it causes one automatic wound. Note that these hits can’t be ignored by the Armored special rule.',
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
    id: 'stealth',
    name: 'Stealth',
    text: 'This unit always counts as being in Cover.',
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
    isAdditive: true,
    text: 'This model must accumulate X wounds before being removed as a casualty. If a unit with the special rule joins a unit without it you must either accumulate wounds until all models with this rule have been killed, or remove regular models as casualties before starting to accumulate wounds. Note that you must first accumulate wounds on a single model with this special rule until it is killed before you start accumulating them on another.',
  },
  {
    id: 'transport',
    name: 'Transport',
    hasParameter: true,
    isAdditive: true,
    text: 'This unit may transport up to X Infantry models in its cargo. Infantry units may embark by moving into contact with a transport, and embarked units may use a Walk action to disembark. Units may also be deployed within a transport at the beginning of the game. If a unit is within a transport when it is destroyed it must take a Dangerous Terrain test, is Pinned, and surviving models must be placed within 6” of the transport.',
  },
  {
    id: 'unwieldy',
    name: 'Unwieldy',
    text: 'This weapon must re-roll hits.',
  },
  {
    // PDF weapon-table footnote: the `x` notation = Piercing + this single-target rule.
    id: 'single-target',
    name: 'Single Target',
    text: 'All wounds from this weapon must be assigned to a single model.',
  },
  {
    // From the "Melee" weapons mini-table.
    id: 'powersword',
    name: 'Powersword',
    text: 'Counts as Piercing.',
  },
  {
    id: 'powerfist',
    name: 'Powerfist',
    text: 'Counts as Piercing and Rending.',
  },
  {
    id: 'vehicle',
    name: 'Vehicle',
    text: 'Always has Armored and Impact(D6). Moves up to 12” when using Walk actions and 18” when using Run/Assault actions. When using Hold actions it may pivot by up to 180°, else it may pivot once by up to 90° at any point. When taking wounds roll one die and add the number of wounds taken: 2-5 Glanced, 6-7 Shaken (re-roll successful hits until end of next activation), 8+ Immobile.',
  },
]
