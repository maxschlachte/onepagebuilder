## 1. Parser fix

- [x] 1.1 In `src/data/factions/helpers.ts`, detect a leading `Linked ` (case-insensitive) on `eqEntry`'s `baseName`, strip it to get the lookup name used for the known-global-weapon table match
- [x] 1.2 Inline-profile path: after `parseWeaponProfile(baseName, inner)`, if the name was Linked-prefixed, add a `{ ruleId: 'linked' }` rule reference to the returned weapon's `rules` (skip if a `linked` ruleId is already present, e.g. an explicit trailing `, Linked` token in the parens)
- [x] 1.3 Known-weapon-lookup path: when a match is found via the stripped lookup name, ensure the entry ends up with a `linked` rule reference (merged with any rules parsed from an inline parenthetical, e.g. `Linked Machinegun (Ignores Cover)` → `linked` + `ignores-cover`), deduplicated the same way
- [x] 1.4 Confirm the `s`-stripping pluralization handling still applies correctly after the `Linked ` prefix is stripped (e.g. `Linked Pistols` → strip prefix → `Pistols` → strip trailing s → `pistol`)

## 2. Tests

- [x] 2.1 `helpers.test.ts`: bare `Linked Carbine` (no inline profile) resolves the global `Carbine` profile and carries a `linked` rule reference
- [x] 2.2 `helpers.test.ts`: `Linked Machinegun (Ignores Cover)` (known weapon + parenthetical rules, no inline stats) resolves the global `Machinegun` profile and carries both `linked` and `ignores-cover` rule references
- [x] 2.3 `helpers.test.ts`: `Linked Autocannon (48”, A2)` (inline profile) parses range 48/attacks 2 and carries a `linked` rule reference alongside any rules already in the parenthetical
- [x] 2.4 `helpers.test.ts`: a weapon written the pre-existing correct way, e.g. `Hurricane Bolter (24”, A3, Linked)`, still resolves exactly one `linked` rule reference (no duplicate) — plus an explicit `Linked Autocannon (48”, A2, Linked)` case combining both conventions at once
- [x] 2.5 `helpers.test.ts`: a non-Linked entry (e.g. plain `Assault Rifle`) is unaffected — regression check; also added a shared-object-mutation guard (`Linked Carbine` then plain `Carbine` must not leak the injected rule)

## 3. Verification

- [x] 3.1 Run the full test suite and type-check; confirm no regressions (70/70 tests pass, clean type-check)
- [x] 3.2 Manually exercised the builder (Playwright against the dev server): Orks Meganobz (`Linked Carbines`, bare) now shows `Linked Carbines(18", A1) — Linked`; Space Marines Scout Bikers (`Linked Assault Rifles, Assault Rifles` baseline) shows the Linked entry with stats+rule and the non-Linked entry unaffected; Space Marines Land Raider (`Linked Minigun (Rending)` — known weapon + parenthetical rules, and `2x Hurricane Bolters (24”, A3, Linked)` — pre-existing inline convention) both render correctly with no duplicate `Linked` rule. Confirmed the rule chip's tooltip resolves the glossary text ("This weapon may re-roll failed hits."). Zero console errors.
- [x] 3.3 Spot-checked the print view (Orks Meganobz): renders `Linked Carbines (18", A1) [Linked]` — stats and rule both present, confirming the shared `eqEntry` output flows through `PrintView.vue` correctly. Verified directly rather than assumed.
