## Context

`UpgradeGroup` today is `{ id, title, selection, options }` — one selection rule for the whole lettered group. But the rulebook (and the user's new structured reference, `one-page-40k-army-lists.html`) shows every lettered group is actually a stack of independent sub-choices, each with its own cap, e.g. group A on Tactical Marines:

```
A. Replace one Assault Rifle:      [Pistol, Stormbolter, Plasma Pistol...]   -- pick at most 1
   Replace one Medium CCW:         [Powersword, Powerfist]                   -- pick at most 1
   Take one Assault Rifle attachment: [Flamer, Meltagun, Plasmagun]          -- pick at most 1
   Upgrade one model with one:     [Jump Pack, Bike, Terminator Armor]       -- pick at most 1
```

Today all 13 of those options live in one flat array tagged `selection: 'any'`, so the builder lets a user check all 13 at once. Across the whole dataset, 196 of 204 groups are tagged `'any'` and 0 are tagged `'one'` — this is a systemic default used during the original transcription, not a handful of typos. The reference HTML consistently marks each sub-list with one of: `Take one` / `Take any` / `Take up to two` / `Take up to three` / `Take up to four` / `Replace one X` / `Replace any X` / `Replace all Xs` (single option) — giving a reliable per-section source to re-derive from.

## Goals / Non-Goals

**Goals:**
- Represent each lettered group as an ordered list of **sections**, each with its own title and `UpgradeSelection` cap.
- Enforce the cap at the store level (so it can't be bypassed) and reflect it in the UI (radio-style exclusivity for `one`, disabled checkboxes past the cap for `upToTwo/Three/Four`).
- Re-derive every section's correct selection limit from `one-page-40k-army-lists.html`, faction by faction, replacing the current blanket `'any'`.

**Non-Goals:**
- No migration of existing `localStorage` lists to new option ids — this is pre-1.0 hobby data; selections that no longer resolve are simply dropped by the existing "unknown id → skip" behavior in `applyUpgrades`/`validateImported`. Bump `LIST_SCHEMA_VERSION` is *not* required since the `ArmyList` shape itself is unchanged (only the option ids it references), but we call this out clearly so it isn't mistaken for silent data loss during development.
- No change to how equipment/rule effects are applied (`UpgradeEffect`) — only how many options in a group can be selected at once.
- No attempt to model "applies per-model" multiplicity (e.g. "Equip up to two models with any X" doesn't try to track *which* model got what) — the app already treats a unit as a single aggregate profile, so this stays a count-of-options cap, matching current behavior.

## Decisions

**Section-based `UpgradeGroup`, not a flag on `UpgradeOption`.**
Add:
```ts
export interface UpgradeSection {
  title: string                 // e.g. "Replace one Assault Rifle", "Take up to two"
  selection: UpgradeSelection
  options: UpgradeOption[]
}

export interface UpgradeGroup {
  id: string                    // letter, e.g. "A"
  sections: UpgradeSection[]
}
```
`UpgradeGroup.title`/`.selection`/`.options` are removed. Alternative considered: keep a flat `options` array and add a `sectionId`/cap per option — rejected because it duplicates the cap on every option (drift risk) and doesn't map cleanly onto the reference HTML's `up-sub` grouping, which is exactly the section boundary we want to transcribe against.

**`UpgradeSelection` values: `'one' | 'any' | 'upToTwo' | 'upToThree' | 'upToFour'`.**
Drop `'replace'` and `'all'` (both currently unused — 0 occurrences in the dataset). Their intended meaning is already fully covered: "replace" is just `'one'` plus the option's own `removeEquipment` effect; "all" (e.g. "Replace all Assault Rifles") is a single-option section where `'one'` and `'any'` are behaviorally identical (nothing to cap against). Add `'upToThree'` since the reference HTML has "Take up to four" and "Equip any model with up to three" alongside the existing "up to two". Alternative considered: a generic `{ max: number }` shape instead of named variants — rejected to keep the enum simple and grep-able, consistent with the existing string-literal style used throughout `helpers.ts`/`calc.ts`.

**Option id scheme: `${groupId}.${runningIndex}`, flattened across sections in authoring order.**
Keeps the existing id format (`"A.0"`, `"A.1"`, ...) and existing lookup code (`optionIndex()` in `calc.ts`) working with a one-line change (flatten `group.sections.flatMap(s => s.options)` instead of `group.options`). Alternative considered: `${groupId}.${sectionIdx}.${optionIdx}` — rejected as unnecessary; nothing needs to address a section directly by index, and the flat running index is shorter and matches current ids closely enough to ease the mechanical rewrite.

**Enforcement lives in the store (`toggleUpgrade`), not just the UI.**
`toggleUpgrade` looks up which section an option belongs to via a new `calc.ts` helper (`findSection(faction, optionId)`), then:
- Deselecting is always allowed.
- Selecting in a `'one'` section removes any other currently-selected sibling in that section before adding the new one (radio semantics — last click wins).
- Selecting in a capped section (`upToTwo`/`upToThree`/`upToFour`) is a no-op if the section is already at its cap.
- Selecting in an `'any'` section is unconstrained (current behavior).
Doing this in the store (rather than only disabling inputs in the UI) means JSON import and any future UI surface can't produce an over-selected section either — `validateImported` gains the same per-section cap check and rejects (with a clear message) an imported list that selects more options in a section than its cap allows, rather than silently accepting it.

**UI: radio inputs for `'one'` sections, checkboxes elsewhere.**
`BuilderView.vue` iterates `group.sections` and renders a sub-heading per section (its `title`) rather than one heading per letter. `'one'` sections render `<input type="radio" :name="`${instanceId}-${groupId}-${sectionIdx}`">` so exclusivity is also visually/semantically correct (not just enforced after the fact by the store). Capped sections render checkboxes disabled when unchecked and the section is at cap. Alternative considered: keep checkboxes everywhere and only rely on the store to auto-uncheck siblings for `'one'` — rejected because a checkbox that silently unchecks *other* boxes on click reads as a bug to a user; a radio control communicates the constraint for free.

## Risks / Trade-offs

- [Re-transcribing 204 groups across 16 factions by hand is large and error-prone] → Work faction-by-faction (one task per faction, mirroring the original transcription's task breakdown), diff each faction's section titles/caps directly against `one-page-40k-army-lists.html`'s `up-card`/`up-sub` blocks for that faction, and keep costs/effects unchanged from the current data (only the grouping/selection cap changes) to minimize the surface each task has to get right.
- [Existing saved lists reference now-dangling option ids] → Accepted (see Non-Goals); no users beyond the developer at this stage.
- [Reference HTML could itself contain transcription slips from the PDF] → Where the reference HTML and current in-repo data disagree on an effect/cost (not just the selection cap), keep the PDF as the tie-breaker for costs/effects and only take the *selection cap and section boundaries* from the HTML, per the proposal's framing of the HTML as "more structured," not "more authoritative on numbers."

## Open Questions

- None blocking — any faction-specific ambiguity in the reference HTML (e.g. a section with no explicit "one/any/up to N" wording) will default to `'one'` if it reads as an equipment replacement with multiple mutually exclusive options, or `'any'` if it reads as a set of independent add-on toggles, decided per-section during transcription.
