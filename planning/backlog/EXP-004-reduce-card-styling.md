---
id: EXP-004
title: Reduce dashboard and card styling
type: implementation
status: backlog
priority: P1
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - docs/design/calm-interface-principles.md
  - app/src/index.css
---

# Reduce dashboard and card styling

## Why

Repeated bordered white surfaces can make the experience feel like a dashboard rather than a calm personal publication.

## Desired outcome

Whitespace, typography, alignment, and thin separators carry most secondary hierarchy. One primary surface receives emphasis while supporting content remains quieter.

## Scope

- Define primary, contextual, and plain-page surface roles
- Simplify seasonal foods, Learn lists, Today shortcuts, and Settings panels
- Standardize when borders and shadows are allowed

## Out of scope

- Removing boundaries needed to identify controls
- A full brand redesign
- Additional My Balance visualization polish before PROD-001 is resolved

## Tasks

- [ ] Inventory visible cards and bordered surfaces.
- [ ] Identify the one primary surface on each major screen.
- [ ] Convert appropriate cards to ruled rows or open sections.
- [ ] Remove unnecessary nested backgrounds.
- [ ] Confirm interactive affordances remain clear.

## Acceptance criteria

- Today has one dominant visual surface.
- Secondary content does not compete with the recommendation.
- Interactive rows remain recognizable without card containers.
