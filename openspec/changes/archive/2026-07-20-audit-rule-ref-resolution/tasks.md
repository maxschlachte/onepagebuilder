## 1. Audit test

- [x] 1.1 Create `src/data/rule-ref-resolution-audit.test.ts` with a header comment explaining the id-fallback failure mode and why uppercase-presence is the signal
- [x] 1.2 Implement the traversal: for each faction build a per-faction resolver, then walk unit `specialRules`, `equipment[].rules`, `equipment[].weapon.rules`, and upgrade-option `effects.addRules`, `effects.addEquipment[].rules`, `effects.addEquipment[].weapon.rules`
- [x] 1.3 Collect failures as `faction/location → id` strings and assert the collected array equals `[]`, so one run reports every offender
- [x] 1.4 Run the test and confirm it reports exactly the 22 known offenders (red baseline before any data fix)

## 2. Glossary entries for missing and compound rules

- [x] 2.1 Add a commented block to `src/data/glossary-fantasy.ts` marking derived/compound modifiers as transcription conveniences, matching the file's existing header-comment style
- [x] 2.2 Add entries for the true-rule gaps: `ignores-cover`, `ignore-piercing`, `poison-in-melee`, `deadly-in-melee`, sourcing text from `one-page-fantasy-rules.md`
- [x] 2.3 Add entries for the stat-modifier pseudo-rules: `1a-in-melee`, `2a-in-melee`, `1-attack`, `1-melee-attack`, `d3-melee-attacks`
- [x] 2.4 Re-run the audit and confirm the glossary-category offenders are gone

## 3. Faction army rules

- [x] 3.1 Add Dwarf rune army rules: `rune-of-battle`, `rune-of-slowness`, `rune-of-disguise`, `rune-of-immolation` in `src/data/factions/fantasy/dwarfs.ts`
- [x] 3.2 Add Empire `swift-as-the-wind` and `bloodroar` in `src/data/factions/fantasy/empire.ts`
- [x] 3.3 Add Lizardmen `blood-roar` in `src/data/factions/fantasy/lizardmen.ts`, kept separate from Empire's `bloodroar` per design
- [x] 3.4 Re-run the audit and confirm the army-rule-category offenders are gone

## 4. Misparsed weapon references

- [x] 4.1 Fix Skaven `ratling-gun` (option `E.0`) and `fire-thrower` (option `I.3`) to emit equipment rather than a `RuleRef`
- [x] 4.2 Verify the two options' resulting equipment lines and costs are unchanged in the UI

## 5. Verification

- [x] 5.1 Run the full suite (`npm test`) and confirm the new audit passes with no regressions in existing audits
- [x] 5.2 Run `npm run build` to confirm `vue-tsc` type-checks clean
- [x] 5.3 Spot-check two fixed options in the running app (one glossary-category, one army-rule-category) and confirm the tooltip shows a capitalized name with real rule text instead of the raw id
