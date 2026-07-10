import { describe, expect, it } from 'vitest'
import { customWeapon, gear, linked, meleeWeapon, option, parseRule, rules, unit, weapon } from './helpers'

describe('parseRule', () => {
  it('parses a plain rule', () => {
    expect(parseRule('Fearless')).toEqual({ ruleId: 'fearless' })
  })
  it('parses a numeric parameter', () => {
    expect(parseRule('Tough(3)')).toEqual({ ruleId: 'tough', param: 3 })
  })
  it('parses a dice parameter', () => {
    expect(parseRule('Impact(D3)')).toEqual({ ruleId: 'impact', param: 'D3' })
  })
  it('parses a +N parameter', () => {
    expect(parseRule('Tough(+3)')).toEqual({ ruleId: 'tough', param: '+3' })
  })
  it('kebab-cases multi-word names', () => {
    expect(parseRule('Deep Strike')).toEqual({ ruleId: 'deep-strike' })
  })
})

describe('rules list', () => {
  it('splits respecting parentheses and parses each', () => {
    expect(rules('Armored, Impact(D3), Tough(6)')).toEqual([
      { ruleId: 'armored' },
      { ruleId: 'impact', param: 'D3' },
      { ruleId: 'tough', param: 6 },
    ])
  })
  it('returns empty for "-"', () => {
    expect(rules('-')).toEqual([])
  })
})

describe('weapon', () => {
  it('references a global weapon by id', () => {
    const e = weapon('assault-rifle')
    expect(e.key).toBe('assault-rifle')
    expect(e.label).toBe('Assault Rifle')
    expect(e.weapon?.range).toBe(24)
    expect(e.weapon?.attacks).toBe('1')
    expect(e.weapon?.rules).toEqual([])
  })
  it('keeps the global weapon’s own innate rules', () => {
    const e = weapon('battle-cannon')
    expect(e.weapon?.rules).toEqual([{ ruleId: 'piercing' }])
  })
  it('merges additional declared rules with the weapon’s own innate rules', () => {
    const e = weapon('heavy-flamer', { rules: rules('Rending') })
    expect(e.weapon?.rules).toEqual(
      expect.arrayContaining([{ ruleId: 'piercing' }, { ruleId: 'rending' }]),
    )
    expect(e.weapon?.rules).toHaveLength(2)
  })
  it('does not mutate the shared global weapon table entry', () => {
    weapon('carbine', { rules: rules('Rending') })
    const plain = weapon('carbine')
    expect(plain.weapon?.rules).toEqual([])
  })
  it('applies a count prefix and pluralizes the label', () => {
    const e = weapon('lascannon', { count: 2 })
    expect(e.count).toBe(2)
    expect(e.label).toBe('2x Lascannons')
  })
  it('supports explicit label/key overrides', () => {
    const e = weapon('assault-rifle', { label: 'Assault Rifles', key: 'custom-key' })
    expect(e.label).toBe('Assault Rifles')
    expect(e.key).toBe('custom-key')
  })
})

describe('meleeWeapon', () => {
  it('resolves tier range/attacks with no innate rules for CCW/Claws', () => {
    const e = meleeWeapon('Medium', 'CCW')
    expect(e.weapon?.range).toBeNull()
    expect(e.weapon?.attacks).toBe('2')
    expect(e.weapon?.rules).toEqual([])
    expect(e.key).toBe('medium-ccw')
    expect(e.label).toBe('Medium CCW')
  })
  it('resolves a Claws type with no innate rules', () => {
    const e = meleeWeapon('Light', 'Claws')
    expect(e.weapon?.range).toBeNull()
    expect(e.weapon?.attacks).toBe('1')
    expect(e.weapon?.rules).toEqual([])
  })
  it.each([
    ['Medium', '2'],
    ['Heavy', '3'],
    ['Force', '5'],
  ] as const)('a %s Powersword carries its innate Piercing rule regardless of tier', (tier, attacks) => {
    const e = meleeWeapon(tier, 'Powersword')
    expect(e.weapon?.range).toBeNull()
    expect(e.weapon?.attacks).toBe(attacks)
    expect(e.weapon?.rules).toEqual([{ ruleId: 'piercing' }])
  })
  it.each([
    ['Medium', '2'],
    ['Master', '4'],
  ] as const)('a %s Powerfist carries its innate Piercing and Rending rules regardless of tier', (tier, attacks) => {
    const e = meleeWeapon(tier, 'Powerfist')
    expect(e.weapon?.range).toBeNull()
    expect(e.weapon?.attacks).toBe(attacks)
    expect(e.weapon?.rules).toEqual([{ ruleId: 'piercing' }, { ruleId: 'rending' }])
  })
  it('merges an additional declared rule with the type’s innate Piercing rule', () => {
    const e = meleeWeapon('Force', 'Powersword', { rules: rules('Rending') })
    expect(e.weapon?.attacks).toBe('5')
    expect(e.weapon?.rules).toEqual(
      expect.arrayContaining([{ ruleId: 'piercing' }, { ruleId: 'rending' }]),
    )
    expect(e.weapon?.rules).toHaveLength(2)
  })
  it('merges an additional declared rule with a Powerfist’s innate Piercing/Rending rules', () => {
    const e = meleeWeapon('Master', 'Powerfist', { rules: rules('Shake') })
    expect(e.weapon?.attacks).toBe('4')
    expect(e.weapon?.rules).toEqual(
      expect.arrayContaining([{ ruleId: 'piercing' }, { ruleId: 'rending' }, { ruleId: 'shake' }]),
    )
    expect(e.weapon?.rules).toHaveLength(3)
  })
})

describe('customWeapon', () => {
  it('builds an explicit profile with range, attacks and rules', () => {
    const e = customWeapon('Vanquisher Cannon', {
      range: 48,
      attacks: '6',
      rules: [{ ruleId: 'piercing' }, { ruleId: 'single-target' }],
    })
    expect(e.key).toBe('vanquisher-cannon')
    expect(e.label).toBe('Vanquisher Cannon')
    expect(e.weapon?.range).toBe(48)
    expect(e.weapon?.attacks).toBe('6')
    expect(e.weapon?.rules).toEqual([{ ruleId: 'piercing' }, { ruleId: 'single-target' }])
  })
  it('supports a null (melee) range', () => {
    const e = customWeapon('Siege Drills', { range: null, attacks: '2', rules: rules('Piercing, Rending') })
    expect(e.weapon?.range).toBeNull()
  })
  it('depluralizes the key but keeps the label as given', () => {
    const e = customWeapon('Disintegrator Cannons', { range: 36, attacks: '3' }, { count: 3 })
    expect(e.key).toBe('disintegrator-cannon')
    expect(e.label).toBe('3x Disintegrator Cannons')
  })
})

describe('gear', () => {
  it('builds non-weapon equipment with no weapon profile', () => {
    const e = gear('Servo Arm')
    expect(e.key).toBe('servo-arm')
    expect(e.label).toBe('Servo Arm')
    expect(e.weapon).toBeUndefined()
    expect(e.rules).toEqual([])
  })
  it('attaches declared rules', () => {
    const e = gear('Lasher Tendrils', { rules: rules('Fear') })
    expect(e.rules).toEqual([{ ruleId: 'fear' }])
  })
  it('depluralizes the key', () => {
    const e = gear('Seeker Missiles', { count: 6 })
    expect(e.key).toBe('seeker-missile')
    expect(e.label).toBe('6x Seeker Missiles')
  })
})

describe('linked', () => {
  it('adds the Linked rule and label prefix to a weapon reference', () => {
    const e = linked(weapon('carbine'))
    expect(e.key).toBe('linked-carbine')
    expect(e.label).toBe('Linked Carbine')
    expect(e.weapon?.range).toBe(18)
    expect(e.weapon?.rules).toEqual([{ ruleId: 'linked' }])
  })
  it('does not duplicate the Linked rule when the wrapped entry already declares it', () => {
    const e = linked(customWeapon('Hurricane Bolter', { range: 24, attacks: '3', rules: rules('Linked') }))
    expect(e.weapon?.rules.filter((r) => r.ruleId === 'linked')).toHaveLength(1)
  })
  it('adds the Linked rule to non-weapon gear too', () => {
    const e = linked(gear('Something'))
    expect(e.rules).toEqual([{ ruleId: 'linked' }])
  })
  it('applies count/pluralization to the full "Linked X" phrase, not the inner builder', () => {
    const e = linked(weapon('lascannon'), { count: 2 })
    expect(e.count).toBe(2)
    expect(e.label).toBe('2x Linked Lascannons')
  })
  it('supports a label override', () => {
    const e = linked(weapon('assault-rifle'), { label: 'Linked Assault Rifles' })
    expect(e.label).toBe('Linked Assault Rifles')
  })
})

describe('duplicate equipment keys', () => {
  it('throws when a unit’s equipment list has two entries with the same key', () => {
    expect(() =>
      unit('test', {
        name: 'Bad Unit',
        size: 1,
        quality: '4+',
        equipment: [weapon('pistol'), weapon('pistol')],
        special: '-',
        upgrades: '-',
        cost: 0,
      }),
    ).toThrow(/duplicate equipment key/)
  })
  it('does not throw when an explicit key override disambiguates a collision', () => {
    expect(() =>
      unit('test', {
        name: 'Fine Unit',
        size: 1,
        quality: '4+',
        equipment: [weapon('pistol'), weapon('pistol', { key: 'pistol-2' })],
        special: '-',
        upgrades: '-',
        cost: 0,
      }),
    ).not.toThrow()
  })
})

describe('option', () => {
  it('builds addEquipment/removeEquipment effects', () => {
    const opt = option('A', 0, {
      label: 'Carbines',
      cost: 10,
      addEquipment: [weapon('carbine')],
      removeEquipment: ['Pistols'],
    })
    expect(opt.effects?.addEquipment).toEqual([expect.objectContaining({ label: 'Carbine' })])
    expect(opt.effects?.removeEquipment).toEqual(['pistol'])
  })

  it('builds a removeOneEquipment effect', () => {
    const opt = option('A', 0, {
      label: 'Stormbolter (24”, A2)',
      cost: 10,
      addEquipment: [customWeapon('Stormbolter', { range: 24, attacks: '2' })],
      removeOneEquipment: ['Assault Rifle'],
    })
    expect(opt.effects?.removeOneEquipment).toEqual(['assault-rifle'])
    expect(opt.effects?.removeEquipment).toBeUndefined()
  })

  it('omits effects entirely when no effect fields are set', () => {
    const opt = option('A', 0, { label: 'Medium Powersword', cost: 5 })
    expect(opt.effects).toBeUndefined()
  })
})

describe('unit', () => {
  it('flags heroes and builds ids', () => {
    const u = unit('space-marines', {
      name: 'Captain',
      size: 1,
      quality: '3+',
      equipment: [weapon('assault-rifle')],
      special: 'Fearless, Hero, Tactics, Tough(3)',
      upgrades: 'A, H',
      cost: 65,
    })
    expect(u.id).toBe('space-marines.captain')
    expect(u.isHero).toBe(true)
    expect(u.upgradeGroups).toEqual(['A', 'H'])
    expect(u.specialRules).toContainEqual({ ruleId: 'tough', param: 3 })
    expect(u.equipment).toEqual([expect.objectContaining({ key: 'assault-rifle' })])
  })
})
