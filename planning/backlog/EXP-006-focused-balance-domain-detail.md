---
id: EXP-006
title: Explore focused balance-domain detail
type: exploration
status: backlog
priority: P2
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on:
  - PROD-001
related:
  - app/src/screens/Secondary.tsx
---

# Explore focused balance-domain detail

## Why

Domain details currently open inline beneath the My Balance grid. A focused page or bottom sheet might reduce layout movement and improve concentration, but the right interaction depends on the unresolved purpose of My Balance.

## Options

1. Focused full page with Back to My Balance
2. Mobile bottom sheet preserving the domain grid behind it
3. Retain inline disclosure

## Questions

- Is domain detail important enough for a route?
- Does a sheet preserve useful spatial context?
- Does a full page feel calmer and more accessible?
- How should browser Back behave?
- Is comparison itself a supported user need?

## Tasks

- [ ] Wait for PROD-001.
- [ ] Prototype the viable options.
- [ ] Test route, focus, scroll, and Back behavior.
- [ ] Select one presentation or retain inline detail.

## Acceptance criteria

- The chosen pattern supports the defined My Balance job.
- It avoids surprising layout shifts.
- Keyboard, screen-reader, and browser navigation behavior is clear.
