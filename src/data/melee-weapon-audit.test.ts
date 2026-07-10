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
  ['Rot Proboscis (Rending)', 'Chaos Daemons upgrade — grants Rending only, no printed attacks value'],
  ['Rot Proboscis', 'Chaos Daemons upgrade — grants Rending only, no printed attacks value (structured-equipment-model migration dropped the embedded rule text from the label)'],
  ['Venom Sting (Deadly)', 'Chaos Daemons upgrade — grants Deadly only, no printed attacks value'],
  ['Venom Sting', 'Chaos Daemons upgrade — grants Deadly only, no printed attacks value (structured-equipment-model migration dropped the embedded rule text from the label)'],
  ['Zephyrglaive (Impact(1))', 'Harlequins upgrade — grants Impact(1) only, no printed attacks value'],
  ['Zephyrglaive', 'Harlequins upgrade — grants Impact(1) only, no printed attacks value (structured-equipment-model migration dropped the embedded rule text from the label)'],
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
  ['Sporocyst (Mine Launcher)', "Aliases Biovore's Mine Launcher special rule — ranged, out of scope"],
  ['Sporocyst', "Aliases Biovore's Mine Launcher special rule — ranged, out of scope (structured-equipment-model migration dropped the embedded rule text from the label)"],
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
