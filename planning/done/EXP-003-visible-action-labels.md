---
id: EXP-003
title: Add visible action labels
type: implementation
status: done
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

- [x] Prototype labels under the three Today actions.
- [x] Test `Done` versus `Complete`.
- [x] Test `Another` versus `Show another`.
- [x] Audit remaining icon-only controls.
- [x] Check wrapping and zoom at 320px and 200%.

## Acceptance criteria

- A first-time user can predict each recommendation action.
- Labels remain quiet and readable.
- The action row fits supported mobile widths.

## Notes

- 2026-07-17: Chose `Done` over `Complete` and `Another` over `Show another` to keep the row calm and scannable at narrow widths. The longer, precise accessible names remain unchanged.
- 2026-07-17: Kept each icon in a 44 × 44 visual area inside a 64-pixel-wide labeled control. The complete action remains visually primary; labels use the existing muted theme token.
- 2026-07-17: Audited the remaining icon-only controls. Settings, disclosure, navigation, close, and focused chat controls remain familiar single-purpose actions with explicit accessible names; labeling them is outside this focused recommendation-row change.
- 2026-07-17: Verified the row at 320, 360, and 390 pixels, including 200% root text scaling at 320 pixels. Verified label contrast in midday, sunset, twilight, and night.
