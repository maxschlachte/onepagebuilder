## Context

`EntryUpgradeControls.vue`'s per-option weapon label (`src/components/EntryUpgradeControls.vue:152-163`) currently renders, for each weapon an upgrade option adds:

```html
<span class="ml-1 text-xs" :class="[...disabled dimming...]">
  <span>({{ formatWeaponProfile(w) }}</span>
  <span v-if="w.rules.length">, <RuleChips :rules="w.rules" :faction="faction" /></span>
  <span>)</span>
</span>
```

producing e.g. `(24", A1, Piercing)`. `EquipmentList.vue`'s weapon-entry rendering (`src/components/EquipmentList.vue:26-30`) shows the same underlying data — a weapon's `formatWeaponProfile(w)` range/attacks string plus its `rules` as `RuleChips` — but in the older, pre-existing format:

```html
<span v-if="e.weapon" class="ml-1 text-xs text-stone-600 dark:text-slate-400">({{ profile(e) }})</span>
<span v-if="e.weapon && e.weapon.rules.length" class="ml-1 text-xs">
  — <RuleChips :rules="e.weapon.rules" :faction="faction" />
</span>
```

producing `(24", A1) — Piercing`. `EquipmentList.vue` also has a second, unrelated case for equipment entries with no weapon profile at all but their own `rules` (e.g. a piece of gear that grants a rule without being a weapon) — `<span v-else-if="e.rules && e.rules.length">— <RuleChips ... /></span>`, still em-dash-separated, no brackets. That case has no `formatWeaponProfile` output to bracket and isn't part of this extraction.

Neither `openspec/specs/army-builder-ui/spec.md`'s "Edit units and upgrades in the builder" requirement, nor any test in `EquipmentList.test.ts`/`EntryUpgradeControls.test.ts`/`integration.test.ts`/`PrintView.test.ts`, pins down whether rules render inside or outside the stats bracket — the spec only says range/attacks are bracketed and rules are shown as tooltipped chips, and no test asserts on the em dash or bracket punctuation specifically (confirmed by inspection before writing this design). So this is a low-risk, mechanical extraction plus a small, previously-uncaptured visual consistency fix.

## Goals / Non-Goals

**Goals:**
- One component (`src/components/WeaponProfileLabel.vue`) rendering a weapon's `(range/attacks[, rule chips])` label, used by both `EntryUpgradeControls.vue`'s upgrade-option weapon display and `EquipmentList.vue`'s weapon-entry display.
- `EquipmentList.vue`'s weapon entries adopt the new bracket-inclusive format, matching `EntryUpgradeControls.vue` exactly.
- No change to `EntryUpgradeControls.vue`'s appearance (it's already on the new format) — this is a pure code move there.

**Non-Goals:**
- `EquipmentList.vue`'s non-weapon `e.rules`-only case (equipment with rules but no weapon profile) is untouched — there's no weapon stats string to put in a bracket, so it isn't the same pattern; it keeps its current em-dash rendering.
- No change to `formatWeaponProfile` itself, to `RuleChips`, or to how rule tooltips resolve.
- No change to the print views (`PrintUnitStats.vue`/`PrintGroupStats.vue`) — they render equipment/rules as plain table text, not through this bracket-label pattern, and are unaffected either way.

## Decisions

### 1. `WeaponProfileLabel.vue` — presentational, `weapon`/`faction` props

`src/components/WeaponProfileLabel.vue`, props `weapon: Weapon`, `faction?: Faction` (matching `RuleChips`' own optional `faction`). Renders:

```html
<span>
  <template>({{ formatWeaponProfile(weapon) }}</template>
  <template v-if="weapon.rules.length">, <RuleChips :rules="weapon.rules" :faction="faction" /></template>
  <template>)</template>
</span>
```

using `<template>` (not nested `<span>`s) since, unlike `EntryUpgradeControls.vue`'s current markup, none of the three segments need independent styling — the segments differed there only because of the disabled-dimming class applied to the *outer* span, which stays a caller concern (see Decision 2). Collapsing to `<template>` is a harmless simplification: it changes internal DOM nesting slightly but not the rendered text, and no test depends on the inner span structure (confirmed above).

*Alternative considered*: keep the exact three-`<span>` structure from `EntryUpgradeControls.vue` verbatim. Rejected — those inner spans carried no styling of their own even in the original (only the outer wrapper span did), so preserving them would just be extra unused markup moved into the new component.

**Found during implementation**: swapping the `<template v-for="(w, wi) in weaponsFor(opt)" :key="wi">` loop's child from a plain `<span>` to the `<WeaponProfileLabel>` component made `vue-tsc` report `wi` as unused (`TS6133`), even though `:key="wi"` is unchanged — apparently a quirk in how Volar's virtual-code generation handles a `:key` binding on a `<template v-for>` wrapping a single component child versus a plain element. Fixed (and slightly improved) by keying on the weapon's own stable `id` instead of the loop index — `v-for="w in weaponsFor(opt)" :key="w.id"` — which sidesteps the issue and is a better key than an index in general.

### 2. Styling/dimming stays at the call site via attrs fallthrough

`EntryUpgradeControls.vue`'s outer `ml-1 text-xs` wrapper plus its disabled-state color class (`text-stone-800 dark:text-slate-600` vs. `text-stone-600 dark:text-slate-400`, per whether the containing option is disabled) is call-site-specific state that doesn't belong in a presentational label component. `WeaponProfileLabel.vue`'s root renders no default classes of its own; each caller supplies `class="ml-1 text-xs …"` (with its own conditional dimming logic, unchanged) directly on the `<WeaponProfileLabel>` instance, which Vue's attrs fallthrough merges onto the component's root `<span>` — the same pattern already used for `AppButton`/`UnitHeadline` in `extract-shared-vue-components`.

- `EntryUpgradeControls.vue`: `<WeaponProfileLabel :weapon="w" :faction="faction" class="ml-1 text-xs" :class="[!readonly && isOptionDisabled(section, opt.id) ? 'text-stone-800 dark:text-slate-600' : 'text-stone-600 dark:text-slate-400']" />`
- `EquipmentList.vue`: `<WeaponProfileLabel v-if="e.weapon" :weapon="e.weapon" :faction="faction" class="ml-1 text-xs text-stone-600 dark:text-slate-400" />`

## Risks / Trade-offs

- **[Risk] `EquipmentList.vue`'s weapon-entry format visibly changes (em dash outside the bracket → comma inside it) everywhere it's used — the builder's "Equipment:" list for every card shape, and the read-only roster Details panel.** → Mitigation: no test currently pins the old format (verified), but do a manual pass after the change to confirm the new format reads correctly for both a single-rule and multi-rule weapon, and for a weapon with no rules (should show a plain `(range, attacks)` with no trailing comma).
- **[Trade-off] `EquipmentList.vue`'s two weapon/non-weapon-rules cases now look asymmetric — a weapon's rules sit inside a bracket, a non-weapon item's rules sit after a bare em dash.** Accepted per this change's Non-Goals: they're genuinely different shapes (one has a stats string to bracket, the other doesn't), and forcing them to match would mean inventing a bracket for information that isn't there — out of scope here, worth a separate look only if it starts to read as visually inconsistent in practice.
