## 1. Faction data: close the missing-`addRules` gap

- [x] 1.1 Audit all 16 faction files for an upgrade option whose `label` exactly equals (or is the text before a trailing ` (` in) an entry in that faction's `armyRules`, but whose `effects` has no matching `addRules`/`adds` — starting with every faction's "Battle Standard" option — and add the missing `adds: ['<Rule Name>']` declaration — 54 gaps found across 10 faction files. 41 were pure point-cost options with no equipment effect at all (added `adds: [...]`, e.g. Battle Standard/Narthecium/Kustom Force Field). 13 already `addEquipment`ed a piece of wargear named after the rule (e.g. Tau "Drone (Markerlight)", "Seeker Missile") — for these, the rule id was attached to the added equipment/weapon's own `rules` array instead of the unit's, since the ability describes that item, not the whole unit (see `rule-grant-audit.test.ts` for the distinction)
- [x] 1.2 Extend the audit to special-rule-granting options too (not just army rules) using the same label-match heuristic, in case any exist with the same gap — 0 gaps found against the glossary
- [x] 1.3 Add a database-wide audit test (style of `melee-weapon-audit`/`infantry-audit`) asserting every current option whose label exactly equals an `armyRules` or glossary entry's name declares that rule as an `addRules` effect — regression guard for future faction-file additions — `src/data/rule-grant-audit.test.ts`, checks both the unit-level `addRules` and the equipment/weapon-level `rules` pathway

## 2. Domain: group-deployment eligibility and aggregation

- [x] 2.1 Add `groupDeployRuleIds(faction): Map<string, number>` (or `Set` + a separate cap lookup) in `src/domain/calc.ts`, deriving eligible rule ids and their model cap from `faction.armyRules` text matching `/deploy up to (\d+) models .* (?:single|one) unit/i`
- [x] 2.2 Add `sharedGroupDeployRuleId(a: UnitProfile, b: UnitProfile, faction: Faction): string | undefined` — the common group-deploy rule id between two profiles' special rules, if any
- [x] 2.3 Add `groupEffectiveUnit(members: { profile: UnitProfile; eff: EffectiveUnit }[]): GroupUnit` in `src/domain/calc.ts`: a new type with a per-distinct-member roster (`{ profile: UnitProfile; count: number }[]`), summed size/cost, and equipment/special-rules merged by key (same merge approach as `combinedEffectiveUnit`, not a reuse of it — see design.md decision 6)
- [x] 2.4 Unit tests for `groupDeployRuleIds` (asserts `conclave`, `warband`, `beastmaster`, `court` are all detected with cap 10), `sharedGroupDeployRuleId`, and `groupEffectiveUnit` (including a synthetic multi-model profile to exercise the model-count cap, per design.md's noted current-data blind spot) — the cap-*rejection* behavior itself is tested at the store layer (task 4.6), since `groupEffectiveUnit` only aggregates and doesn't enforce the cap

## 3. Domain: list model

- [x] 3.1 Add `groupId?: string` to `ListUnit` in `src/domain/list.ts`

## 4. Store: group actions

- [x] 4.1 Add `joinGroup(listId, instanceId, otherInstanceId)`: validates both entries share a `sharedGroupDeployRuleId`, that joining wouldn't exceed the rule's model cap (summed across all current+joining members), and sets a shared `groupId` on both (generating a fresh one if neither already has one, otherwise adopting the existing group's id)
- [x] 4.2 Add `leaveGroup(listId, instanceId)`: clears `groupId` on that entry only, leaving other members linked
- [x] 4.3 Update `removeUnit` to clear no other member's `groupId` (removal from the list already drops the entry itself; remaining members' shared `groupId` stays valid since it doesn't reference the removed instance directly)
- [x] 4.4 Update `duplicateList` to remap `groupId` consistently (a fresh id per distinct source `groupId`, shared by all remapped members of that group) alongside the existing `combinedWith`/`joinedInfantryUnit` remapping
- [x] 4.5 Update list-load sanitization (`sanitizeLinks`) to drop a `groupId` down to a single-member "no group" state if fewer than 2 of its members still resolve to valid, rule-sharing, cap-respecting entries (e.g. after a JSON import edits members incompatibly)
- [x] 4.6 Store tests for join/leave, cap enforcement, cross-rule rejection, cleanup on remove, remap on duplicate, and drop-invalid-on-load

## 5. Builder UI: roster stat preview

- [x] 5.1 Add `RosterUnitPreview.vue` (or inline into the roster row) — a `RuleTooltip`-style CSS-only hover/focus popover rendering the unit's baseline `equipment` (via `EquipmentList`) and `specialRules` (via `RuleChips`)
- [x] 5.2 Wire it onto each roster row in `BuilderView.vue`, anchored on hover/focus of the row, without changing the existing one-line `[size] · Qquality · cost` summary

## 6. Builder UI: roster badges

- [x] 6.1 In `BuilderView.vue`'s roster row, add a "Psyker" badge (same visual style as the existing "Hero" badge) shown when `unit.specialRules` includes `psyker` and `unit.isHero` is false

## 7. Builder UI: upgrade option tooltips

- [x] 7.1 In `EntryUpgradeControls.vue`, for each option, check whether any of its `effects.addRules` resolves to a name equal to the option's full label or the label's prefix before `" ("`; if so, render that portion of the label via `RuleTooltip` instead of plain text (design.md decision 3)
- [x] 7.2 Component test asserting a "Battle Standard"-labeled option renders a hover tooltip with the Battle Standard rule text, while a "Jump Pack (Deep Strike, Flying)"-shaped option's label renders unchanged (no duplicated chip)

## 8. Builder UI: group-deployment combine controls

- [x] 8.1 Add a "Combine…" control to a list entry's card when another list entry shares a group-deploy rule and the combined group wouldn't exceed the cap (mirrors the existing Infantry "Combine…" control's shape) — implemented as a "Group…" select alongside the existing "Combine…"/"Attach to…" controls, mutually exclusive with `combinedWith`
- [x] 8.2 Render a group as a single card: combined model count, combined cost, a roster line per distinct member unit and count, and each member's own upgrade controls shown independently underneath (no whole-unit synchronization — see design.md decision 5)
- [x] 8.3 Add a "Remove from group" control per member on a group's card — implemented as "Leave group"

## 9. Print view: Psychic Powers section

- [x] 9.1 In `PrintView.vue`, split the `reference` computed into two: one for special/army/weapon rule ids (unchanged walk), and a new one for psychic-power ids (same `hasPsyker` gate as today)
- [x] 9.2 Render the psychic-power set in a new `<section>` titled "Psychic Powers", same `dl`/`dt`/`dd` markup as Rule Reference, placed after it; omit the section entirely when the set is empty

## 10. Print view: group rendering

- [x] 10.1 In `PrintView.vue`'s `printRows` grouping, render a group of `groupId`-linked entries as one box using `groupEffectiveUnit` (task 2.3), showing the member roster line per distinct member unit and count — via a new `PrintGroupStats.vue` component (mirrors `PrintUnitStats.vue`'s weapon-table rendering but for a member roster instead of a single profile)
- [x] 10.2 Ensure a group member that is also individually attached (`joinedInfantryUnit`) via a Hero/Psyker still nests correctly under the group box — implemented (`attached: members.flatMap((m) => attachedTo(m.instanceId))`, mirroring the combined-pair case), not just documented as out of scope

## 11. Tests & verification

- [x] 11.1 Integration test: combine two different Inquisition Warband units (e.g. Acolyte + Psyker) in the builder, confirm one card with summed model count/cost and independent per-member upgrade panels, then remove one member and confirm the other stays valid
- [x] 11.2 Integration test: print view renders a Warband group as one box with a member roster line, and a list with a Psyker shows a separate "Psychic Powers" section distinct from "Rule Reference"
- [x] 11.3 Manually run the app: hover a roster unit and confirm the stat preview; select a "Battle Standard" upgrade and confirm its tooltip pre-selection, its appearance on the unit's special rules once selected, and its text present in the print view's Rule Reference; combine a Warband group and print it; confirm a Psyker-only roster unit shows the "Psyker" badge — verified via Playwright against the running dev server; all scenarios confirmed visually (roster preview popover, Battle Standard tooltip + Special-line update + Rule Reference text, Warband group card + print box + separate Psychic Powers section, Psyker badge), no console errors
- [x] 11.4 Run the full test suite, `tsc`, and `npm run build`; confirm no regressions — 166/166 tests pass, `vue-tsc --noEmit` clean, `npm run build` succeeds
