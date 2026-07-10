// Assembles the full typed RulesDatabase from the global tables and all 16
// faction modules. All content is sourced from `1p40k - Main Rulebook v3.3.1.pdf`.

import type { RulesDatabase } from '../domain/types'
import { glossary } from './glossary'
import { weapons } from './weapons'
import { composition } from './composition'

import { spaceMarines } from './factions/space-marines'
import { imperialGuard } from './factions/imperial-guard'
import { orks } from './factions/orks'
import { eldar } from './factions/eldar'
import { chaosSpaceMarines } from './factions/chaos-space-marines'
import { tau } from './factions/tau'
import { necrons } from './factions/necrons'
import { tyranids } from './factions/tyranids'
import { darkEldar } from './factions/dark-eldar'
import { chaosDaemons } from './factions/chaos-daemons'
import { spaceMarineChapters } from './factions/space-marine-chapters'
import { sistersOfBattle } from './factions/sisters-of-battle'
import { inquisition } from './factions/inquisition'
import { harlequins } from './factions/harlequins'
import { adeptusMechanicus } from './factions/adeptus-mechanicus'
import { genestealerCult } from './factions/genestealer-cult'

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
    spaceMarineChapters,
    sistersOfBattle,
    inquisition,
    harlequins,
    adeptusMechanicus,
    genestealerCult,
  ],
  glossary,
  weapons,
  composition,
}

export function getFaction(id: string) {
  return rulesDatabase.factions.find((f) => f.id === id)
}

export function getUnit(factionId: string, unitId: string) {
  return getFaction(factionId)?.units.find((u) => u.id === unitId)
}
