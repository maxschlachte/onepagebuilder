## Why

Each upgrade group currently repeats its letter id as a text prefix on every section headline inside the group (e.g. "Q. Replace any Pistol", then "Q. Replace any Medium CCW", then "Q. Upgrade all models with"), which is redundant — the id is the same for every section in the group — and visually noisy. Moving the id into a single badge that overlays the group's divider line makes the id read as a label for the whole group rather than a repeated prefix, and declutters the section headlines.

## What Changes

- The group's letter id (e.g. "Q") is no longer prefixed to each section's headline text within the group. Section headlines show only their title (e.g. "Replace any Pistol").
- The group id instead renders once per group, as a small circular badge that overlays the start of the group's top divider line (visually: `(Q)----`).
- Groups with `hideId` set (e.g. the synthesized Chapter Tactics group) render the plain divider with no badge, same as today's "no id" behavior — only the badge placement changes for groups that do show an id.
- This affects both the interactive selected-unit upgrade panel and the read-only roster "Details" panel, since both render through `EntryUpgradeControls.vue`.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `army-builder-ui`: the requirement governing upgrade group headings changes — a lettered group's id is no longer shown as a text prefix on each section headline; it is shown once as a badge on the group's divider instead.

## Impact

- `src/components/EntryUpgradeControls.vue`: divider/heading markup and the id-prefix template expression change.
- `src/components/EntryUpgradeControls.test.ts`: existing assertions on the "id. title" heading text need updating.
- No data model changes — `UpgradeGroup.id`, `displayId`, and `hideId` are reused as-is, just rendered differently.
