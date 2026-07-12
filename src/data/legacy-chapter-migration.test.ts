import { describe, expect, it } from 'vitest'
import { LIST_SCHEMA_VERSION, type ArmyList } from '../domain/list'
import { remapLegacyChapterList } from './legacy-chapter-migration'

function legacyList(units: ArmyList['units']): ArmyList {
  return {
    schemaVersion: 1,
    id: 'legacy-1',
    name: 'Old Chapter List',
    factionId: 'space-marine-chapters',
    pointsCap: 750,
    units,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }
}

describe('remapLegacyChapterList', () => {
  it('passes through a non-legacy list unchanged', () => {
    const list: ArmyList = {
      schemaVersion: LIST_SCHEMA_VERSION,
      id: 'x',
      name: 'Plain SM',
      factionId: 'space-marines',
      pointsCap: 750,
      units: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    expect(remapLegacyChapterList(list)).toBe(list)
  })

  it('reassigns factionId to space-marines and infers the majority chapter', () => {
    const list = legacyList([
      { instanceId: 'u1', unitId: 'space-marine-chapters.sanguinary-priest', selectedUpgrades: [] },
      { instanceId: 'u2', unitId: 'space-marine-chapters.death-company', selectedUpgrades: [] },
    ])
    const migrated = remapLegacyChapterList(list)
    expect(migrated.factionId).toBe('space-marines')
    expect(migrated.chapterId).toBe('blood-angels')
  })

  it('remaps surviving unit ids and upgrade-option group ids to the new namespace', () => {
    const list = legacyList([
      { instanceId: 'u1', unitId: 'space-marine-chapters.sanguinary-priest', selectedUpgrades: ['A.0'] },
    ])
    const migrated = remapLegacyChapterList(list)
    expect(migrated.units[0].unitId).toBe('space-marines.sanguinary-priest')
    expect(migrated.units[0].selectedUpgrades).toEqual(['ba-a.0'])
  })

  it('drops a unit belonging to a different chapter than the inferred majority', () => {
    const list = legacyList([
      { instanceId: 'u1', unitId: 'space-marine-chapters.sanguinary-priest', selectedUpgrades: [] },
      { instanceId: 'u2', unitId: 'space-marine-chapters.death-company', selectedUpgrades: [] },
      { instanceId: 'u3', unitId: 'space-marine-chapters.deathwing-knights', selectedUpgrades: [] },
    ])
    const migrated = remapLegacyChapterList(list)
    expect(migrated.chapterId).toBe('blood-angels')
    expect(migrated.units).toHaveLength(2)
    expect(migrated.units.some((u) => u.unitId.includes('deathwing-knights'))).toBe(false)
  })
})
