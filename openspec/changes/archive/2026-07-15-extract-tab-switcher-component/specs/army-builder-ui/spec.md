## MODIFIED Requirements

### Requirement: Mobile tab switcher for Roster and Selected Units

Below a mobile-width breakpoint, the system SHALL show a tab switcher letting the user view either the Roster or the Selected Units panel, one at a time, instead of both stacked in sequence. At and above that breakpoint, the system SHALL continue to show both panels side by side, with no tab switcher, exactly as without this requirement. The tab switcher SHALL use the same segmented-control tab pattern as the game-system switcher on the saved-lists screen — a shared bordered container marked `role="tablist"`, with each option rendered as a `role="tab"` control whose `aria-selected` state reflects whether its panel is the one currently shown.

#### Scenario: Tab switcher shown below the breakpoint

- **WHEN** the builder is viewed at a mobile-width viewport
- **THEN** a tab switcher for "Roster" and "Selected Units" is shown, and only the active tab's panel is visible

#### Scenario: Switching tabs changes the visible panel

- **WHEN** the user activates the other tab in the mobile tab switcher
- **THEN** the previously-hidden panel becomes visible and the previously-visible panel becomes hidden

#### Scenario: No tab switcher at desktop width

- **WHEN** the builder is viewed at desktop width
- **THEN** no tab switcher is shown, and both the Roster and Selected Units panels are visible side by side

#### Scenario: Tab switcher exposes tab semantics

- **WHEN** the builder's mobile tab switcher is shown
- **THEN** its container has `role="tablist"`, each of its two options has `role="tab"`, and the option matching the currently visible panel has `aria-selected="true"` while the other has `aria-selected="false"`
