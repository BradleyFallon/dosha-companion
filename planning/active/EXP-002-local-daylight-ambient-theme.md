---
id: EXP-002
title: Local daylight ambient theme
type: implementation
status: active
priority: P0
area: experience
created: 2026-07-17
updated: 2026-07-17
owner: Bradley
depends_on:
  - EXP-001
related:
  - docs/design/calm-interface-principles.md
  - app/src/screens/Today.tsx
  - app/src/components/LocalizedTodayContent.tsx
---

# Local daylight ambient theme

## Why

The app should feel subtly connected to the person's local world. Its light, warmth, and atmosphere can reflect sunrise, daylight, sunset, twilight, and night without becoming theatrical or implying health meaning.

## Desired outcome

Today and the application shell adapt gradually to local daylight. Sunrise feels warm and emerging, midday feels neutral and warm, sunset feels softly colored, twilight reduces blue-white light, and night uses a comfortable dark appearance.

## Scope

- Deterministic daylight phase calculation
- Sunrise, morning, midday, late-afternoon, sunset, twilight, and night tokens
- A subtle sundial-style ambient light position
- Saved regional location and sunrise/sunset when available
- Time-zone, browser-time, and neutral fallbacks
- Night appearance with warm charcoal and cream
- Contrast and reduced-motion handling

## Out of scope

- Requiring location permission for appearance
- Weather animations
- Dosha or health interpretation
- Bright gradients, glow, or a literal animated sun
- A full user theme-preference system unless required for accessibility

## Open questions

- Should an explicit appearance override be included now?
- Should civil twilight come from the weather provider or a fixed offset?
- How should polar day, polar night, and missing sunrise data fall back?
- Which surfaces receive ambient treatment beyond Today?

## Tasks

- [ ] Write the daylight phase and fallback specification.
- [ ] Define semantic tokens for every phase.
- [ ] Implement a pure, tested phase-selection function.
- [ ] Prototype the sundial treatment on Today.
- [ ] Add twilight and night appearances.
- [ ] Prevent a bright flash before theme initialization.
- [ ] Verify WCAG contrast in every phase.
- [ ] Test Northern and Southern Hemisphere dates.
- [ ] Add reduced-motion behavior.
- [ ] Test at 320px, 360px, and 390px.

## Acceptance criteria

- Time-of-day differences are noticeable but not distracting.
- Night appearance is comfortable in a dark room.
- Theme changes do not imply emotional, medical, or dosha meaning.
- The app remains usable without location or weather access.
- There are no abrupt phase changes or initial bright flashes.
- Text, focus states, and controls retain appropriate contrast.

## Notes

### 2026-07-17

Typography was completed first in commit `43fee8c`. This is the next experience-polish package.
