## 1. Unit boxes in two columns

- [x] 1.1 In `src/views/PrintView.vue`, change the unit-box container (`section.space-y-3`) from a vertical stack to a two-column CSS multi-column layout (`columns-2 gap-3`)
- [x] 1.2 Add `break-inside-avoid` (plus any needed `mb-3`/spacing replacement now that `space-y-3` no longer applies between flowed boxes) to each `.print-unit` unit box so a box is never split across the column break

## 2. Rule Reference in two flowing columns

- [x] 2.1 Change the Rule Reference `<dl>` from a CSS grid (`grid gap-x-6 gap-y-1 sm:grid-cols-2`) to a two-column CSS multi-column layout (`columns-2 gap-x-6`), keeping each rule's `<div>` markup unchanged
- [x] 2.2 Adjust vertical spacing between rule entries as needed now that `gap-y-1` (a grid-only property) no longer applies in a multi-column layout (replaced with `mb-1` per entry; also added `break-inside-avoid-column` per entry for cleaner column flow)

## 3. Verification

- [x] 3.1 Run the app, open the print view for a list with several units of varying size (e.g. a 1-line Troop and a multi-weapon-table vehicle), and confirm the unit boxes render in two columns with no box visibly split across the column break (verified via Playwright screenshot: 8 units of varying size split cleanly into two 4-box columns, no box split)
- [x] 3.2 Confirm the Rule Reference section renders in two columns that flow independently (a short entry does not leave dead space aligned to a longer entry in the other column) (verified: long entries like Tough/Deep Strike/Transport sit alongside independently-packed short entries with no forced row alignment)
- [x] 3.3 Check the browser print preview ("Print / Save as PDF") to confirm both two-column layouts hold up in the print/PDF output, not just on screen (verified via a real headless-Chromium print-media PDF export: both layouts hold up, `.no-print` chrome is correctly hidden)
- [x] 3.4 Run the existing test suite (`npm test`) and confirm `src/views/PrintView.test.ts` still passes unchanged (this is a layout-only change; no test content should need updating)
