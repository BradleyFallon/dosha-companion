---
id: EXP-005
title: Add joyful completion motion
type: implementation
status: active
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
- [ ] Storyboard the daily-action completion sequence.
- [x] Define duration, easing, and reduced-motion tokens.
- [x] Implement check-in completion first.
- [ ] Test repeated exposure for irritation.
- [x] Ensure screen-reader status is immediate.

## Acceptance criteria

- Completion feels acknowledged without becoming game-like.
- Primary motion completes in roughly 400ms or less.
- The final state is available immediately.
- Reduced-motion users receive equivalent information.

## Notes

- 2026-07-17: The check-in completion icon fades in while moving four pixels into place over 320ms. A semantic-accent halo resolves after a 60ms offset, keeping the full sequence under 400ms without changing layout.
- 2026-07-17: The saved heading, answer count, and actions render immediately. The heading is a polite live region, and reduced-motion CSS removes both completion animations so the fixed final mark appears at once.
- 2026-07-17: This slice intentionally leaves daily recommendation completion and repeated-exposure review unfinished, so EXP-005 remains active.
