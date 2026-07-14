// Assembles the full typed RulesDatabase from the global tables and all 15
// faction modules. All content is sourced from `1p40k - Main Rulebook v3.3.1.pdf`.
// Space Marine Chapters is not one of these — its data extends the Space
// Marines faction as an optional specialization (see `./chapters.ts`).

import type { RulesDatabase } from '../domain/types'
import { glossary } from './glossary'
import { fantasyGlossary } from './glossary-fantasy'
import { weapons } from './weapons'
import { composition } from './composition'

import { spaceMarines } from './factions/40k/space-marines.ts'
import { imperialGuard } from './factions/40k/imperial-guard.ts'
import { orks } from './factions/40k/orks.ts'
import { eldar } from './factions/40k/eldar.ts'
import { chaosSpaceMarines } from './factions/40k/chaos-space-marines.ts'
import { tau } from './factions/40k/tau.ts'
import { necrons } from './factions/40k/necrons.ts'
import { tyranids } from './factions/40k/tyranids.ts'
import { darkEldar } from './factions/40k/dark-eldar.ts'
import { chaosDaemons } from './factions/40k/chaos-daemons.ts'
import { sistersOfBattle } from './factions/40k/sisters-of-battle.ts'
import { inquisition } from './factions/40k/inquisition.ts'
import { harlequins } from './factions/40k/harlequins.ts'
import { adeptusMechanicus } from './factions/40k/adeptus-mechanicus.ts'
import { genestealerCult } from './factions/40k/genestealer-cult.ts'

import { empire } from './factions/fantasy/empire'
import { orcs } from './factions/fantasy/orcs'
import { goblins } from './factions/fantasy/goblins'
import { highelves } from './factions/fantasy/high-elves'
import { warriorsofchaos } from './factions/fantasy/warriors-of-chaos'
import { dwarfs } from './factions/fantasy/dwarfs'
import { skaven } from './factions/fantasy/skaven'
import { lizardmen } from './factions/fantasy/lizardmen'
import { ogrekingdoms } from './factions/fantasy/ogre-kingdoms'
import { darkelves } from './factions/fantasy/dark-elves'
import { tombkings } from './factions/fantasy/tomb-kings'
import { vampirecounts } from './factions/fantasy/vampire-counts'
import { bretonnia } from './factions/fantasy/bretonnia'
import { beastmen } from './factions/fantasy/beastmen'
import { woodelves } from './factions/fantasy/wood-elves'
import { daemonsofchaos } from './factions/fantasy/daemons-of-chaos'

export const rulesDatabase: RulesDatabase = {
  factions: [
    spaceMarines,
    imperialGuard,
    orks,
    eldar,
    chaosSpaceMarines,
    tau,
    necrons,
    tyranids,
    darkEldar,
    chaosDaemons,
    sistersOfBattle,
    inquisition,
    harlequins,
    adeptusMechanicus,
    genestealerCult,
    empire,
    orcs,
    goblins,
    highelves,
    warriorsofchaos,
    dwarfs,
    skaven,
    lizardmen,
    ogrekingdoms,
    darkelves,
    tombkings,
    vampirecounts,
    bretonnia,
    beastmen,
    woodelves,
    daemonsofchaos,
  ],
  glossaries: {
    'system-40k': glossary,
    'system-fantasy': fantasyGlossary,
  },
  weapons,
  composition,
}

export function getFaction(id: string) {
  return rulesDatabase.factions.find((f) => f.id === id)
}

export function getUnit(factionId: string, unitId: string) {
  return getFaction(factionId)?.units.find((u) => u.id === unitId)
}
