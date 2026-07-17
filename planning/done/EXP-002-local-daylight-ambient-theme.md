---
id: EXP-002
title: Four-phase local daylight prototype
type: implementation
status: done
priority: P0
area: experience
created: 2026-07-17
updated: 2026-07-17
owner: Bradley
depends_on:
  - EXP-001
related:
  - docs/design/daylight-ambient-theme.md
  - app/src/daylight/model.ts
  - app/src/components/Layout.tsx
  - app/src/components/LocalizedTodayContent.tsx
---

# Four-phase local daylight prototype

## Outcome

Today now reflects local daylight through four reviewed phases:

- midday;
- sunset;
- twilight;
- night.

Discrete semantic palettes preserve predictable contrast while a static sundial wash follows progress between the saved regional sunrise and sunset. The atmosphere is presentation-only and never implies health, emotional, diagnostic, or dosha meaning.

## Implementation

- A pure phase model selects solar, saved-time-zone, browser-time, or neutral behavior.
- Today’s weather and theme share one regional forecast request.
- The app frame receives its broad phase during render.
- A layout effect synchronizes the desktop background and mobile browser theme color before paint.
- One timeout updates the next phase boundary; there is no animation loop.
- Stale forecast data refreshes when Today regains focus on a new local date.
- Implausibly short or long solar windows use the predictable time-zone fallback.
- Semantic status, notice, and error surfaces adapt to dark phases.
- A development-only `?daylight=` override supports review of all four palettes.

## Completed tasks

- [x] Write the daylight phase and fallback specification.
- [x] Define semantic tokens for the four prototype phases.
- [x] Implement a pure, tested phase-selection function.
- [x] Prototype the sundial treatment on Today.
- [x] Add twilight and night appearances.
- [x] Prevent a bright application-shell and outer-background flash.
- [x] Verify representative WCAG contrast in every phase.
- [x] Test Northern and Southern Hemisphere dates, half-hour zones, DST, and solar boundaries.
- [x] Add reduced-motion behavior.
- [x] Test at 320px, 360px, and 390px.

## Acceptance results

- Time-of-day differences are visible without continuous movement.
- Night uses warm charcoal, cream text, and restrained accents.
- The app remains usable without location or weather access.
- CSS transitions soften phase replacement and reduced-motion preferences remove meaningful duration.
- Representative text, controls, notices, errors, completion states, and focus indicators meet their automated contrast thresholds.
- Today retains usable actions, weather, navigation, and horizontal containment at supported mobile sizes.

## Validation

- Lint
- TypeScript
- Unit and component tests
- Production build
- Mobile Playwright suite
- Automated four-phase contrast sampling

## Follow-up

Whether to add sunrise, morning, and late-afternoon phases—or extend the atmosphere beyond Today—is an exploration rather than unfinished implementation. It is tracked in EXP-007.

## Notes

### 2026-07-17

Typography was completed first in commit `43fee8c`.

The original seven-phase scope was intentionally narrowed after review. The four-phase prototype provides enough range for usability evaluation without pre-optimizing subtle distinctions.
