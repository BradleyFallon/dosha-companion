---
id: EXP-008
title: Unify question flow presentation
type: implementation
status: done
priority: P1
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - docs/design/assessment-flow.md
  - docs/design/check-in-experience.md
  - app/src/screens/Assessment.tsx
  - app/src/screens/CheckIns.tsx
---

# Unify question flow presentation

## Why

The initial assessment and repeat check-ins share question behavior and data but independently render their prompt, answers, progress, and actions. Variant styling has made the two flows feel less related than intended.

## Desired outcome

Both flows use the same question viewport, answer choices, selection treatment, and visible primary action. Assessment-only context and quieter check-in progress remain deliberate variants.

## Tasks

- [x] Extract shared question-flow presentation components.
- [x] Use one answer-choice list and selected state treatment.
- [x] Use one visible primary-action treatment.
- [x] Retain assessment help, Skip, Back, and saving context.
- [x] Retain compact check-in progress and Finish later.
- [x] Verify keyboard, accessibility, short-height, and mobile behavior.

## Acceptance criteria

- Assessment and check-in questions visibly belong to the same interaction system.
- Shared presentation markup is not duplicated between screen controllers.
- Each flow preserves its distinct persistence, navigation, and supporting context.
- Question actions remain visible without document scrolling at supported mobile heights.

## Notes

- 2026-07-17: Added shared viewport, progress, answer-choice, and action components. Assessment and check-in controllers retain their own persistence and routing.
- 2026-07-17: Both flows now use open ruled radio rows with the same selection marker, typography, focus treatment, and visible primary button.
- 2026-07-17: Assessment retains bar progress, save state, help, Skip, and Back. Check-in retains progress dots, Finish later, the quiet first-question timeframe, and final Complete check-in wording.
- 2026-07-17: Component and browser tests verify shared presentation, native radio semantics, progress alternatives, keyboard behavior, mobile touch targets, fixed actions, and no document scrolling.
