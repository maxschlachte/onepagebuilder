## Context

`EntryUpgradeControls.vue` renders one `<div>` per visible upgrade group (`EntryUpgradeControls.vue:112-116`), styled with a Tailwind top-border (`border-t border-gray-100 dark:border-gray-800`) as the divider above the group's sections. Inside, each section (`:117-119`) renders its own headline with the group id manually prefixed: `${group.displayId ?? group.id}. ${section.title}`, unless `group.hideId` is set. This is the only place in the codebase that renders upgrade sections (the print view uses separate components that don't render upgrade groups at all), so the change is confined to this one file plus its test.

## Goals / Non-Goals

**Goals:**
- Render the group id once per group, as a small circular badge overlaid on the group's top-divider line, instead of as a repeated text prefix on every section headline.
- Preserve existing `hideId` behavior (no badge, plain divider) for groups like the synthesized Chapter Tactics group.
- Keep the change scoped to markup/CSS in `EntryUpgradeControls.vue` — no data model or store changes.

**Non-Goals:**
- No change to `UpgradeGroup`/`UpgradeSection` types or to how `displayId`/`hideId` are computed upstream.
- No change to print view output (it doesn't render upgrade groups).
- No visual redesign of the rest of the upgrade panel (checkboxes, option rows, cost text).

## Decisions

**Badge-over-divider technique**: wrap the existing divider `<div>` in a `relative` positioning context and add a small absolutely-positioned `<span>` badge (circle: fixed width/height, `rounded-full`, centered text, small border/background) placed at `top-0 left-0 -translate-y-1/2` so it straddles the divider line, matching the `(Q)----` mock. Chosen over:
  - A pseudo-element (`::before`) — harder to style/center text inside from Tailwind utility classes in a Vue SFC without a `<style>` block; an explicit `<span>` keeps everything in the template consistent with the rest of the file (no scoped `<style>` block exists today).
  - `outline`/`clip-path` tricks on the border itself — more complex for no visual benefit over a simple overlaid circle.
- Badge only renders when the group has a visible id (`!group.hideId`), matching current logic — for `hideId` groups the divider renders exactly as it does today (plain top border, no badge, no reserved space).
- Section headline template becomes just `{{ section.title }}` unconditionally — the `group.hideId ? ... : ...` branch moves from the per-section headline to the one-time group badge.
- Badge content uses the same `group.displayId ?? group.id` expression that section headlines used before, just relocated and rendered once.
- Divider div needs a bit of extra top spacing/margin so the badge (which overhangs above the border) doesn't visually collide with the previous group's/section's last line — achieved by keeping the existing `mt-2` or nudging it slightly (`mt-3`) if the overlap looks cramped when implemented; this is a small visual-polish call made at implementation time, not a decision that needs to be pinned down now.

## Risks / Trade-offs

- [Badge circle could visually clip or overlap the last line of the preceding block on narrow layouts] → mitigation: verify in-browser at the mobile breakpoint alongside the desktop layout, since this is a UI-only change; adjust divider top margin if needed.
- [Dark mode contrast for the badge background/border/text] → mitigation: reuse the existing gray-scale/dark: pairing already used for the divider (`border-gray-100 dark:border-gray-800`) and headline text (`text-gray-500`) so the badge matches the surrounding palette rather than introducing new colors.
