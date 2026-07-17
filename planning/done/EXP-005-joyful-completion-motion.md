---
id: EXP-005
title: Add joyful completion motion
type: implementation
status: done
priority: P1
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - docs/design/calm-interface-principles.md
  - app/src/screens/CheckIns.tsx
  - app/src/screens/Today.tsx
---

# Add joyful completion motion

## Why

Completion should provide a small emotional reward and sense of closure without pressure, streaks, points, or confetti.

## Desired outcome

Check-in and daily-action completion use a brief signature motion that feels calm, satisfying, and recognizable.

## Scope

- Check-in completion sequence
- Daily recommendation completion transition
- Shared motion tokens
- Reduced-motion equivalents

## Out of scope

- Streaks, scores, badges, levels, or points
- Animation on every ordinary interaction
- Motion that delays navigation
- Celebration for sensitive disclosures

## Tasks

- [x] Storyboard the check-in completion sequence.
- [x] Storyboard the daily-action completion sequence.
- [x] Define duration, easing, and reduced-motion tokens.
- [x] Implement check-in completion first.
- [x] Test repeated exposure for irritation.
- [x] Ensure screen-reader status is immediate.

## Acceptance criteria

- Completion feels acknowledged without becoming game-like.
- Primary motion completes in roughly 400ms or less.
- The final state is available immediately.
- Reduced-motion users receive equivalent information.

## Notes

- 2026-07-17: The check-in completion icon fades in while moving four pixels into place over 320ms. A semantic-accent halo resolves after a 60ms offset, keeping the full sequence under 400ms without changing layout.
- 2026-07-17: The saved heading, answer count, and actions render immediately. The heading is a polite live region, and reduced-motion CSS removes both completion animations so the fixed final mark appears at once.
- 2026-07-17: Today reuses the icon-settle and delayed-halo sequence, softly reveals the immediate completion status, and moves the recommendation onto the semantic status surface. `Another` and `Ask` remain available.
- 2026-07-17: A component-local `justCompleted` flag activates motion only after the current Done interaction. A completed recommendation restored from storage receives the durable final treatment without replaying motion; switching recommendations also clears the flag.
- 2026-07-17: Reduced-motion CSS removes the Today icon, halo, and status animations. Revisit and daylight-theme tests cover repeated exposure and contrast in the durable state.
