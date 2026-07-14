## 1. Schema foundations

- [x] 1.1 Add `GameSystem` enum (`'system-40k' | 'system-fantasy'`) to `src/domain/types.ts` and add `system: GameSystem` to the `Faction` interface.
- [x] 1.2 ~~Add a `terminologyOverrides` table~~ — superseded: split `RulesDatabase.glossary` into `glossaries: Record<GameSystem, SpecialRule[]>` instead (see design.md's addendum to Decision 3). `createResolver` now picks the glossary for the referencing faction's own `system`.
- [x] 1.3 Added `src/data/glossary-fantasy.ts`, Age of Fantasy's own glossary sourced from `one-page-fantasy-rules.md` (Unit Types + Common Special Rules), including a real `wizard` entry — not a `psyker` alias, since the two rules' sourced text differs.
- [x] 1.4 Tag all 15 existing Grimdark Future faction modules with `system: 'system-40k'` (in `faction()`/`FactionInput` — extend `helpers.ts`'s `faction()` to accept and pass through `system`). Implemented as a default (`system: input.system ?? 'system-40k'` in `faction()`) rather than editing all 15 files, since the default is behaviorally identical and lower-risk.
- [x] 1.5 Update `src/data/index.ts` to merge the 16 fantasy factions into `rulesDatabase.factions`, each tagged `system: 'system-fantasy'`.

## 2. Fix Age of Fantasy faction data (per `one-page-fantasy-army-lists.md`)

For each file below: reconstruct `armyRules` (name + full text) and `psychicPowers` (name + castValue + full text) directly from that faction's "Army Special Rules"/"Magic Spells" text block in the source doc; add any standalone unit present in the source table but missing from `units`; fix every `Wizard(N)` upgrade option that added a bare numeral (`adds: ["N"]`) instead of `adds: ["Wizard(N)"]`. Flag any genuinely ambiguous text split as a comment rather than guessing.

- [x] 2.1 `empire.ts` — armyRules/psychicPowers rebuilt; missing units added.
- [x] 2.2 `orcs.ts` — armyRules rebuilt from empty; psychicPowers split into real spells; units verified.
- [x] 2.3 `goblins.ts` — armyRules/psychicPowers rebuilt; units verified.
- [x] 2.4 `high-elves.ts` — armyRules/psychicPowers rebuilt; added 7 missing standalone units (Sisters of Avelorn, Shadow Warriors, Frostheart Phoenix, Flamespyre Phoenix, Lion Chariot, Tiranoc Chariots, Bolt Thrower); fixed `Wizard(N)` bug; stripped embedded weapon-profile text from an option label (label-profile-audit).
- [x] 2.5 `warriors-of-chaos.ts` — armyRules/psychicPowers rebuilt; added missing upgrade group S (Dragon Shaggoth referenced a group letter that didn't exist in the file).
- [x] 2.6 `dwarfs.ts` — armyRules/psychicPowers rebuilt; removed an unreachable "Replace all Light Swords" sub-section under group J (its only unit, Thunderers, has no Light Swords — likely PDF column-bleed; flagged with a comment rather than guessed); stripped embedded weapon-profile text from 5 option labels; added Shieldbearers/Oathstone mount gear to the melee-weapon-audit allowlist.
- [x] 2.7 `skaven.ts` — armyRules/psychicPowers rebuilt; fixed `Wizard(N)` bug; stripped embedded profiles from 2 option labels; fixed Poisoned Wind Mortar/Windlaunchers' equipment profiles (were placeholder range/attacks, now match the source).
- [x] 2.8 `lizardmen.ts` — armyRules/psychicPowers rebuilt; added 9 missing standalone units (Slann Mage-Priest, Skink Priest, Chameleon Skinks, Ripperdactyl Riders, Kroxigors, Jungle Swarms, Razordon Pack, Salamander Pack, Troglodon); added missing upgrade group H; fixed Skinks' Throwing Weapons range (was melee-only `null`, should be 12"); stripped embedded profiles from 5 option labels.
- [x] 2.9 `ogre-kingdoms.ts` — units verified; Stonehorn mount added to melee-weapon-audit allowlist.
- [x] 2.10 `dark-elves.ts` — removed an unreachable "Replace all Light Swords" group H (its only unit, Shades, has no Light Swords — likely PDF column-bleed; flagged with a comment); fixed a `customWeapon` call that misplaced `count` inside the profile object instead of the opts argument; added Dark Steed/Dark Pegasus/Black Dragon/Cauldron of Blood/Hydra Heads to the melee-weapon-audit allowlist.
- [x] 2.11 `tomb-kings.ts` — fixed a `customWeapon` call that misplaced `count` inside the profile object; added Skeletal Steed/Skeleton Chariot/Warsphinx mounts to the melee-weapon-audit allowlist. Liche Priest's caster ability is printed as `Wizard(1)` in the source, same as elsewhere.
- [x] 2.12 `vampire-counts.ts` — added Shriek/Grasp (baseline army-rule equipment) and 8 mount gear entries to the melee-weapon-audit allowlist.
- [x] 2.13 `bretonnia.ts` — verified (batch D fork completed before the session limit).
- [x] 2.14 `beastmen.ts` — verified (batch D fork completed before the session limit).
- [x] 2.15 `wood-elves.ts` — verified (batch D fork completed before the session limit).
- [x] 2.16 `daemons-of-chaos.ts` — verified (batch D fork completed before the session limit).

## 3. Data-quality guardrails

- [x] 3.1 Added `src/data/fantasy-data-quality-audit.test.ts`: asserts every `system-fantasy` faction has a non-empty `armyRules` array, and that no `armyRules`/`psychicPowers` text contains a stray `+\d+pts` fragment (contamination smell test).
- [x] 3.2 Same file: asserts no upgrade option adds a bare-numeral rule id, catching regressions of the `Wizard(N)` → `adds: ["2"]` bug class. (A broader "every `addRules` id resolves to a real glossary/armyRule entry" version was tried first but rejected — it flagged ~24 pre-existing decorative rule tags like "Swift as the Wind"/"Rune of Battle" that are a separate, out-of-scope style issue, not bare-numeral bugs.)
- [x] 3.3 Full suite green: 221/221 tests passing, `vue-tsc --noEmit` clean.

## 4. System-switching UI

- [x] 4.1 Add a `GameSystem` ref/store (persisted via the same mechanism `useListsStore` already uses) with a default of `'system-40k'`.
- [x] 4.2 Add a system-switcher control to `ListsView.vue` (e.g. two tabs/buttons for Grimdark Future / Age of Fantasy).
- [x] 4.3 Filter `store.lists.value` shown in `ListsView.vue` to only those whose `getFaction(list.factionId)?.system` matches the active system.
- [x] 4.4 Filter the `factions` prop passed to `CreateListDialog` to only the active system's factions.
- [x] 4.5 Update the roster Psyker/Wizard badge in `BuilderView.vue` (and the psychic-powers/spells panel heading in `BuilderView.vue`/`PrintView.vue`) to show "Wizard" for Age of Fantasy units. Implemented as separate real glossary entries (`psyker` vs `wizard`, each in its own per-system glossary — see design.md addendum) rather than a display-name override table, since the two rules have distinct sourced text, not just different names.

## 5. Verification

- [x] 5.1 Verified in a real browser (Playwright against the Vite dev server): created an Empire (Age of Fantasy) list, added Battle Wizard — badge reads "Wizard" (not "Psyker"), `Special: Tough(3), Wizard(1)` resolves, the "Spells" panel (renamed from "Psychic powers") lists Fireball, and the Wizard rule tooltip shows Age of Fantasy's own text ("...cast Spells...") rather than Grimdark Future's ("...manifest Powers..."). Points total (35/750pts) correct; no console errors.
- [x] 5.2 Verified switching back to Grimdark Future after using Age of Fantasy still renders the saved-lists view correctly with no errors (existing GF data path unaffected).
- [x] 5.3 Verified: the Create Army List dialog's faction dropdown showed exactly the 16 Age of Fantasy factions with `Age of Fantasy` active (no Grimdark Future factions present), and the system switcher UI renders and toggles correctly.
- [x] 5.4 Full suite green: 221/221 tests passing; `vue-tsc --noEmit` clean.
