## Context

`eqEntry` (`src/data/factions/helpers.ts`) parses one equipment token two ways:
- **Inline profile**: if the trailing parenthetical looks like a profile (contains a range or an `A`-attacks value), `parseWeaponProfile(baseName, inner)` parses range/attacks/rules directly from that text.
- **Known weapon**: otherwise, it looks up `baseName` (lowercased, trailing `s` stripped) in the global weapon table (`src/data/weapons.ts`) and, if found, attaches that weapon's profile; any parenthetical content is parsed as additional rules.

Neither path accounts for a `Linked ` prefix on the name. The rulebook prints "linked" weapon variants as distinct proper names (`Linked Lascannon`, `Linked Carbine`, …), which is how this codebase's faction data transcribes them — but the parser's own documented convention for the `Linked` rule (see `parseWeaponProfile`'s doc comment: `48”, A3p, Linked`) expects it as a trailing token inside the parens instead. The two conventions coexist in the data (confirmed by grepping the faction files) and only the second one currently works.

## Goals / Non-Goals

**Goals:**
- Any equipment entry whose name starts with `Linked ` shows the correct range/attacks (resolving against the global table when there's no inline profile) and carries a `linked` rule reference, so the UI's existing rule-chip/tooltip rendering picks it up automatically.
- Zero data file edits — fix the shared parser once.

**Non-Goals:**
- Reconciling the two authoring conventions in the data itself (rewriting `Hurricane Bolter (24”, A3, Linked)`-style entries to drop the redundant trailing token, or vice versa) — both will continue to work; this is purely additive.
- The unrelated nested-parenthetical parsing gap flagged as a follow-up in the `effective-equipment-display` change (e.g. `Hunter-Killer Missile (Missile Launcher (Limited))`) — different failure mode, out of scope here.

## Decisions

**Strip a leading `Linked ` (case-insensitive) from the lookup key, and inject a `linked` `RuleRef` into the resulting entry, in both `eqEntry` branches.**

```ts
export function eqEntry(token: string): EquipmentEntry {
  let label = token.trim()
  let count = 1
  const countM = label.match(/^(\d+)x\s+/)
  if (countM) {
    count = Number(countM[1])
    label = label.slice(countM[0].length)
  }

  const parenM = label.match(/^(.+?)\s*\((.+)\)\s*$/)
  const baseName = (parenM ? parenM[1] : label).trim()
  const inner = parenM?.[2]?.trim()

  const linkedMatch = baseName.match(/^linked\s+/i)
  const lookupName = linkedMatch ? baseName.slice(linkedMatch[0].length) : baseName

  const entry: EquipmentEntry = { label: token.trim(), count }

  if (inner && /(\d+\s*["“”]|(?:^|,\s*)A[\dD])/.test(inner)) {
    entry.weapon = parseWeaponProfile(baseName, inner)
    if (linkedMatch) addLinkedRule(entry.weapon)
    return entry
  }

  const known = weaponByName.get(lookupName.toLowerCase().replace(/s$/, ''))
  if (known) entry.weapon = linkedMatch ? { ...known, rules: known.rules } : known
  if (inner) entry.rules = rules(inner)
  else if (!known) entry.rules = []
  if (linkedMatch && known) addLinkedRuleToEntry(entry)
  return entry
}
```

(Illustrative — exact helper shape decided during implementation; the key behaviors are: (1) the global-table lookup uses the prefix-stripped name, (2) a `linked` `RuleRef` ends up in the weapon's `rules` array for the inline-profile path and in `entry.rules` for the known-weapon path, and (3) no duplicate `linked` entry if the parenthetical already spells it out explicitly.)

Alternatives considered:
- **Add `Linked X` variants directly to `src/data/weapons.ts` for every base weapon** (`Linked Carbine`, `Linked Lascannon`, …). Rejected: doubles the global table for a purely mechanical transformation (same stats + one extra rule), and still wouldn't cover the inline-profile case, where the name is fine but the parenthetical is missing the rule.
- **Rewrite the ~17 bare `Linked X` baseline strings to spell the rule out inline** (e.g. `Carbine (18”, A1, Linked)`), matching the "correct" convention. Rejected: touches faction data across multiple files for a problem that's entirely mechanical at the parser level, and doesn't fix the ~231 already-inline `Linked X (…)` entries, which would still need the same rule-injection logic anyway.

## Risks / Trade-offs

- [A weapon genuinely named starting with "Linked" that isn't the rulebook's Linked *rule* (none currently exist in `src/data/weapons.ts` or faction data, checked)] → No mitigation needed today; if one is ever added, the fix would incorrectly tag it — acceptable given the current data has no such case, and a future one would surface immediately in the print view.
- [Double-tagging if a future entry writes `Linked` both as a name prefix and inside the parens] → Deduplicated by checking for an existing `linked` ruleId before appending.
