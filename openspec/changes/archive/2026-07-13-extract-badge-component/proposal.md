## Why

`BuilderView.vue` renders five small colored status tags (Hero, Psyker, Group, Combined, Attached) as inline `<span class="rounded ... px-1 text-xs ...">` markup, each with its own duplicated set of Tailwind classes. A shared `Badge` component removes that duplication and gives the five tags one place to read and adjust their styling, instead of five near-identical inline spans scattered across the file.

## What Changes

- Add a `Badge` component (`src/components/Badge.vue`) with a `variant` prop (`hero`, `psyker`, `group`, `combined`, `attached`), each variant mapping to that badge's current color classes exactly as they are today.
- Replace all five inline badge spans in `BuilderView.vue` with `<Badge variant="...">`, preserving each badge's exact current visual appearance (including two small pre-existing inconsistencies: the `hero`/`attached` variants currently have no `dark:` color override, and the `psyker` variant's base classes are already dark-toned even outside dark mode) — this change does not alter any badge's color, only where the classes live.
- No behavior change: the same five badges appear in the same places under the same conditions.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

(none — this is an internal component-structure refactor; no behavior or visual output changes, so no requirement in `army-builder-ui` or `visual-theme` needs updating)

## Impact

- `src/components/Badge.vue`: new file.
- `src/views/BuilderView.vue`: five inline badge spans replaced with `<Badge>` usages.
