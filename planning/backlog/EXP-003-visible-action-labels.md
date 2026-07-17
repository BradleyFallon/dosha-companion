---
id: EXP-003
title: Add visible action labels
type: implementation
status: backlog
priority: P1
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - app/src/screens/Today.tsx
  - docs/design/calm-interface-principles.md
---

# Add visible action labels

## Why

Several calm icon-only actions are accessible but still require first-time users to infer their meaning.

## Desired outcome

Low-contrast visible labels clarify less familiar icon actions while preserving the simple visual hierarchy.

## Scope

- Label Today recommendation actions such as Complete, Another, and Ask
- Audit other unfamiliar icon-only controls
- Preserve 44 × 44 targets and explicit accessible names

## Out of scope

- Labeling every familiar navigation icon twice
- Tooltip-dependent explanations
- Replacing destructive or consequential text actions with icons

## Tasks

- [ ] Prototype labels under the three Today actions.
- [ ] Test `Done` versus `Complete`.
- [ ] Test `Another` versus `Show another`.
- [ ] Audit remaining icon-only controls.
- [ ] Check wrapping and zoom at 320px and 200%.

## Acceptance criteria

- A first-time user can predict each recommendation action.
- Labels remain quiet and readable.
- The action row fits supported mobile widths.
