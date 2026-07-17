// Regression coverage for the class of bug fixed by `fix-melee-attacks-display`
// and `fix-melee-weapon-parsing-gaps`: a melee equipment entry silently failing
// to resolve a weapon profile (and so never showing an attacks bracket), with
// no test catching it until a manual audit did. This walks every equipment
// token in the rules database and fails on any entry that doesn't resolve a
// weapon profile, unless it's on the allowlist below.
import { describe, expect, it } from 'vitest'
import { rulesDatabase } from './index'
import type { EquipmentEntry } from '../domain/types'

// Labels that legitimately have no `.weapon` profile: each is either defined
// as an army special rule (`armyRule(...)` in its faction file, with its own
// glossary-style text) rather than a standard (range, attacks) weapon, a
// melee "trait" upgrade with no attacks value printed anywhere in the
// rulebook, or a compound label representing an attached sub-model — not a
// parsing gap.
const NON_WEAPON_LABELS = new Map<string, string>([
  // Melee traits: grant only a special rule, no printed attacks value.
  ['Lasher Tendrils (Fear)', 'Chaos Space Marines Maulerfiend upgrade — grants Fear only, no printed attacks value'],
  ['Lasher Tendrils', 'Chaos Space Marines Maulerfiend upgrade — grants Fear only, no printed attacks value (structured-equipment-model migration dropped the embedded rule text from the label)'],
  ['Lash Whips (Fear)', 'Tyranids Venomthropes — grants Fear only, no printed attacks value'],
  ['Lash Whips', 'Tyranids Venomthropes — grants Fear only, no printed attacks value (structured-equipment-model migration dropped the embedded rule text from the label)'],
  ['Rot Proboscis', 'Chaos Daemons upgrade — grants Rending only, no printed attacks value'],
  ['Venom Sting', 'Chaos Daemons upgrade — grants Deadly only, no printed attacks value'],
  ['Zephyrglaive', 'Harlequins upgrade — grants Impact(1) only, no printed attacks value'],
  // Army special rules (defined via `armyRule`, with their own glossary text), not weapons.
  ['Markerlight', 'Tau army special rule — a targeting aid, not a weapon with attack dice'],
  ['Markerlights', 'Tau army special rule (plural) — a targeting aid, not a weapon with attack dice'],
  ['Digital Weapons', 'Inquisition army special rule — grants a choice of other weapons at activation'],
  ['Spawn', 'Tyranids Tervigon army special rule — deploys a new unit, not a weapon'],
  ['Mine Launcher', "Tyranids Biovore army special rule — a bespoke post-move attack, not a standard weapon profile"],
  ['Explosive Head', 'Tyranids army special rule — a melee death-trigger effect, not a weapon'],
  ['Spirit Probe', 'Dark Eldar army special rule — a passive aura effect, not a weapon'],
  // Ranged "alias to a known weapon" pattern — out of scope for this melee-focused fix
  // (resolving these needs a different parsing feature: an inner parenthetical naming
  // another weapon rather than a rule).
  ['Sporocyst', "Aliases Biovore's Mine Launcher special rule — ranged, out of scope"],
  ['Seeker Missile', 'Tau army special rule aliasing Missile Launcher (Limited) — ranged, out of scope'],
  ['6x Seeker Missiles', 'Tau Hammerhead baseline — same alias pattern as Seeker Missile, ranged, out of scope'],
  ['Hunter-Killer Missile (Missile Launcher (Limited))', 'Aliases the Missile Launcher profile — ranged, out of scope'],
  ['Hunter-Killer Missile', 'Aliases the Missile Launcher profile — ranged, out of scope (structured-equipment-model migration dropped the embedded profile text from the label)'],
  ['Incinerator (Heavy Flamer)', 'Aliases the Heavy Flamer profile — ranged, out of scope'],
  ['Incinerator', 'Aliases the Heavy Flamer profile — ranged, out of scope (structured-equipment-model migration dropped the embedded profile text from the label)'],
  // Attached sub-model compounds — the current EquipmentEntry model can't express a
  // profile-in-profile; out of scope (see design.md).
  ['Drone (Linked Carbine)', 'Tau attached-drone compound — nested sub-model equipment, out of scope'],
  ['Drone (Markerlight)', 'Tau attached-drone compound — nested sub-model equipment, out of scope'],
  ['Drone (Shield)', 'Tau attached-drone compound — nested sub-model equipment, out of scope'],
  ['Drone (Inhibitor)', 'Tau attached-drone compound — nested sub-model equipment, out of scope'],
  ['Drone (Accelerator)', 'Tau attached-drone compound — nested sub-model equipment, out of scope'],
  ['Drone', 'Tau attached-drone compound — nested sub-model equipment, out of scope (structured-equipment-model migration dropped the embedded rule text from the label; the drone type is still carried as a rule)'],
  ['2x Drones (Stealth)', 'Tau XV95 Ghostkeel attached-drone compound — nested sub-model equipment, out of scope'],
  ['2x Drones', 'Tau XV95 Ghostkeel attached-drone compound — nested sub-model equipment, out of scope (structured-equipment-model migration dropped the embedded rule text from the label)'],
  // Age of Fantasy: command-group and mount upgrades — non-weapon `gear()` entries per
  // `one-page-fantasy-rules.md`'s "Common Upgrades" section (Sergeant/Musician/Standard,
  // and named mounts), not weapons.
  ['Sergeant', 'Age of Fantasy common upgrade — grants +1 melee attack to one model, not a weapon'],
  ['Musician', 'Age of Fantasy common upgrade — grants +1 for melee results, not a weapon'],
  ['Standard', 'Age of Fantasy common upgrade — grants +1 for melee results, not a weapon'],
  ['Chaos Steed', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Steed of Slaanesh', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Disc of Tzeentch', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Daemonic Mount', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Juggernaut of Khorne', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Palanquin of Nurgle', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Manticore', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Chaos Dragon', 'Warriors of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Maelstrom', 'Warriors of Chaos Mutalith Beast — an activated ranged ability (own army rule), not a weapon'],
  ['Warhorse', 'Empire/Bretonnia mount — gear granting equipment/rules, not itself a weapon'],
  ['Imperial Pegasus', 'Empire mount — gear granting equipment/rules, not itself a weapon'],
  ['War Altar of Sigmar', 'Empire mount — gear granting equipment/rules, not itself a weapon'],
  ['Imperial Griffon', 'Empire mount — gear granting equipment/rules, not itself a weapon'],
  ['Imperial Dragon', 'Empire mount — gear granting equipment/rules, not itself a weapon'],
  ['Mechanical Steed', 'Empire mount — gear granting equipment/rules, not itself a weapon'],
  ['Fiery Breath', 'Empire Steam Tank equipment-granted rule (also a baseline unit rule elsewhere) — no printed attacks value as equipment'],
  ['Heavily Armed', 'Orcs Black Orc(s) equipment-granted army rule (choice of weapons) — no single printed attacks value'],
  ['Troll Vomit', 'Orcs Trolls equipment-granted army rule — no printed attacks value as equipment'],
  ['Giant Attack', 'Orcs Giant equipment-granted army rule — no printed attacks value as equipment'],
  ['War Boar', 'Orcs mount — gear granting equipment/rules, not itself a weapon'],
  ['Boar Chariot', 'Orcs mount — gear granting equipment/rules, not itself a weapon'],
  ['Wyvern', 'Orcs mount — gear granting equipment/rules, not itself a weapon'],
  ['Royal Pegasus', 'Bretonnia mount — gear granting equipment/rules, not itself a weapon'],
  ['Hippogryph', 'Bretonnia mount — gear granting equipment/rules, not itself a weapon'],
  ['Bretonnian Warhorse', 'Bretonnia mount — gear granting equipment/rules, not itself a weapon'],
  ['Tuskgor Chariot', 'Beastmen mount — gear granting equipment/rules, not itself a weapon'],
  ['Razorgor Chariot', 'Beastmen mount — gear granting equipment/rules, not itself a weapon'],
  ['Elven Steed', 'Wood Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Great Eagle', 'Wood Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Great Stag', 'Wood Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Forest Dragon', 'Wood Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Unicorn', 'Wood Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Tree Whack', 'Wood Elves Treeman/Treeman Ancient equipment-granted army rule — no printed attacks value as equipment'],
  ['Juggernaut', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Blood Throne', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Palanquin', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Disc', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Steed', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
  ['Slashing Attack', 'Daemons of Chaos Screamers equipment-granted army rule — no printed attacks value as equipment'],
  ['Explodin’ Spores', 'Goblins Snotlings/Pump Wagon equipment-granted army rule — no printed attacks value as equipment'],
  ['Out of Control', 'Goblins Mangler Squigs equipment-granted army rule — no printed attacks value as equipment'],
  ['Venom Surge', 'Goblins Arachnarok Spider equipment-granted army rule — no printed attacks value as equipment'],
  ['Giant Wolf', 'Goblins mount — gear granting equipment/rules, not itself a weapon'],
  ['Giant Spider', 'Goblins mount — gear granting equipment/rules, not itself a weapon'],
  ['Great Cave Squig', 'Goblins mount — gear granting equipment/rules, not itself a weapon'],
  ['Gigantic Spider', 'Goblins mount — gear granting equipment/rules, not itself a weapon'],
  ['Wolf Chariot', 'Goblins mount — gear granting equipment/rules, not itself a weapon'],
  ['Out-Rigga', 'Goblins movement-bonus gear upgrade — no printed attacks value as equipment'],
  ['Shieldbearers', 'Dwarfs mount — gear granting equipment/rules, not itself a weapon'],
  ['Oathstone', 'Dwarfs mount — gear granting equipment/rules, not itself a weapon'],
  ['Griffon', 'High Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Frostheart Phoenix', 'High Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Dragon of Ulthuan', 'High Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Flamespyre Phoenix', 'High Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Great Pox Rat', 'Skaven mount — gear granting equipment/rules, not itself a weapon'],
  ['War-Litter', 'Skaven mount — gear granting equipment/rules, not itself a weapon'],
  ['Ogre Bonebreaker', 'Skaven mount — gear granting equipment/rules, not itself a weapon'],
  ['Screaming Bell', 'Skaven mount — gear granting equipment/rules, not itself a weapon'],
  ['Plague Furnace', 'Skaven mount — gear granting equipment/rules, not itself a weapon'],
  ['Cold One', 'Lizardmen/Dark Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Carnosaur', 'Lizardmen mount — gear granting equipment/rules, not itself a weapon'],
  ['Terradon', 'Lizardmen mount — gear granting equipment/rules, not itself a weapon'],
  ['Ripperdactyl', 'Lizardmen mount — gear granting equipment/rules, not itself a weapon'],
  ['Stonehorn', 'Ogre Kingdoms mount — gear granting equipment/rules, not itself a weapon'],
  ['Dark Steed', 'Dark Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Dark Pegasus', 'Dark Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Black Dragon', 'Dark Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Cauldron of Blood', 'Dark Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Hydra Heads', 'Dark Elves War Hydra baseline army rule — variable "9-X melee attacks" mechanic, no fixed printed attacks value'],
  ['Skeletal Steed', 'Tomb Kings/Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Skeleton Chariot', 'Tomb Kings mount — gear granting equipment/rules, not itself a weapon'],
  ['Warsphinx', 'Tomb Kings mount — gear granting equipment/rules, not itself a weapon'],
  ['Nightmare', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Hellsteed', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Abyssal Terror', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Coven Throne', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Terrorgheist', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Zombie Dragon', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Corpse Cart', 'Vampire Counts mount — gear granting equipment/rules, not itself a weapon'],
  ['Shriek', 'Vampire Counts Banshee/Wraith/Terrorgheist/Mortis Engine baseline army rule — an activated ability, no printed attacks value as equipment'],
  ['Grasp', 'Vampire Counts Wraith/Mortis Engine baseline army rule — an activated ability, no printed attacks value as equipment'],
  ['Tiranoc Chariot', 'High Elves mount — gear granting equipment/rules, not itself a weapon'],
  ['Bell', 'Skaven Screaming Bell mount equipment-granted army rule — an activated random-effect table, no printed attacks value'],
  ['Noxious Wrecker', 'Skaven Plague Furnace mount equipment-granted army rule — no printed attacks value as equipment'],
  ['Seeker Chariot', 'Daemons of Chaos mount — gear granting equipment/rules, not itself a weapon'],
])

describe('melee weapon parsing audit', () => {
  it('every equipment entry resolves a weapon profile unless explicitly allowlisted', () => {
    const unexplained: string[] = []
    const seen = new Set<string>()

    function check(factionId: string, context: string, e: EquipmentEntry) {
      const key = `${factionId}|${context}|${e.label}`
      if (seen.has(key)) return
      seen.add(key)
      if (e.weapon) return
      if (NON_WEAPON_LABELS.has(e.label)) return
      unexplained.push(`${factionId} :: ${context} :: "${e.label}"`)
    }

    for (const faction of rulesDatabase.factions) {
      for (const unit of faction.units) {
        for (const e of unit.equipment) check(faction.id, `unit ${unit.name}`, e)
      }
      for (const group of faction.upgradeGroups) {
        for (const sec of group.sections) {
          for (const opt of sec.options) {
            for (const e of opt.effects?.addEquipment ?? []) {
              check(faction.id, `group ${group.id} opt "${opt.label}"`, e)
            }
          }
        }
      }
    }

    expect(unexplained).toEqual([])
  })
})
