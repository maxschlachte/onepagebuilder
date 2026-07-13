## 1. Divider badge markup

- [x] 1.1 In `EntryUpgradeControls.vue`, add `relative` to the group divider div's classes so the badge can be positioned against it.
- [x] 1.2 Add a circular badge `<span>` inside the divider div, rendered only when `!group.hideId`, showing `group.displayId ?? group.id`, absolutely positioned to overlay the start of the top-border line (matching the `(Q)----` mock).
- [x] 1.3 Style the badge to match the existing divider/heading palette (`border-gray-100`/`dark:border-gray-800` for the ring, `text-gray-500` for the digit/letter) and size it as a small fixed-size circle (e.g. `h-5 w-5` with centered text).
- [x] 1.4 Adjust the divider div's top spacing (`mt-2`/`pt-2`) if needed so the overhanging badge doesn't visually collide with the previous group's or section's last line.

## 2. Section headline change

- [x] 2.1 Change the section headline template expression (`EntryUpgradeControls.vue:119`) to render `section.title` unconditionally, removing the `group.hideId ? ... : `${group.displayId ?? group.id}. ${section.title}`` branch (that id logic now lives only in the group badge from task 1.2).

## 3. Verify across surfaces

- [x] 3.1 Run the dev server and visually check a multi-section lettered group (e.g. a unit with Weapon/Wargear replace options) in both the selected-unit upgrade panel and the read-only roster "Details" panel, in light and dark mode.
- [x] 3.2 Visually check the synthesized Chapter Tactics group still renders with no badge and no id prefix, unaffected by the divider/badge change.
- [x] 3.3 Check a combined-pair card's whole-unit and per-entry upgrade panels still render correctly (each group's badge appears once per panel it's shown in).

## 4. Tests

- [x] 4.1 Update `EntryUpgradeControls.test.ts` assertions that check for the "id. title" heading text to instead check for the plain `section.title` text plus the presence of the group id in the new badge element.
- [x] 4.2 Run the full test suite and fix any other snapshot/text assertions elsewhere (e.g. integration tests) that depended on the old "id. title" heading format.
