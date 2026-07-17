---
id: EXP-001
title: Add expressive typography
type: implementation
status: done
priority: P0
area: experience
created: 2026-07-17
updated: 2026-07-17
owner: Bradley
depends_on: []
related:
  - app/src/index.css
  - app/src/screens/Learn.tsx
---

# Add expressive typography

## Outcome

The interface now separates UI and display typography through `--font-ui` and `--font-display`.

The display serif is applied selectively to:

- Welcome heading
- Today greeting
- Daily recommendation title
- Learn article and card titles
- My Balance heading

Questions, forms, controls, navigation, metadata, and safety language remain in the UI sans-serif stack.

## Validation

The implementation uses system and platform serif fallbacks, so no external font request or custom font file is required.

## Implementation

Completed in commit `43fee8c2503ecd376bfd347aad610adb42e93cc2` (`add expressive typography`).

## Follow-up

The daylight ambient theme is tracked in EXP-002.
