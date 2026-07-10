## 1. Resolve melee tier weapons in `eqEntry`

- [x] 1.1 In `src/data/factions/helpers.ts`, add a melee-tier lookup fallback: when the exact `weaponByName` match for `lookupName` misses, check whether the first word of `lookupName` matches one of the melee tier ids (`light`, `medium`, `heavy`, `master`, `force`) in the global weapon table, and use that tier's `Weapon` if so.
- [x] 1.2 Wire the fallback into the existing `known` lookup (the branch at `eqEntry` around line 148) so both the plain-`known` and `known && linkedM` paths pick it up unchanged.

## 2. Tests

- [x] 2.1 Add `eqEntry` unit tests in `src/data/factions/helpers.test.ts` covering: a bare tier+suffix name (`Medium CCW`), a pluralized suffix (`Heavy CCWs`), a `Claws` suffix (`Light Claws`), and a suffix the fallback must also support generically (`Force Powersword`).
- [x] 2.2 Add a test confirming an inline-profile ranged weapon that happens to start with a tier word (e.g. `Heavy Grav-Cannon (30", A2p)`) still parses its own inline profile and is unaffected by the tier fallback.
- [x] 2.3 Add a test confirming an exact full-name match (e.g. `Heavy Flamer`) still resolves via the existing exact-match path, not the new fallback.
- [x] 2.4 Update the stale comment in `src/data/index.test.ts`'s `'every addEquipment label is not a fabricated weapon name'` test, which currently states labels like `Medium CCW` never resolve via `eqEntry` — this is no longer true after this fix.
- [x] 2.5 Run the full test suite (`npm test` / `vitest run`) and confirm no existing test (including the full-dataset tests in `src/data/index.test.ts`) regresses.

## 3. Manual verification

- [x] 3.1 Run the app, add a unit with close-combat equipment (e.g. a Space Marines unit with `Medium CCW`) in the army builder, and confirm the equipment list shows `(Melee, A2)` next to the weapon name, matching the ranged-weapon bracket style.
- [x] 3.2 Check the print view for the same unit and confirm the same bracket appears there too.
