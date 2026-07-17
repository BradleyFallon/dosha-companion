---
id: EXP-004
title: Reduce dashboard and card styling
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

- [x] Inventory visible cards and bordered surfaces.
- [x] Identify the one primary surface on each major screen.
- [x] Convert appropriate cards to ruled rows or open sections.
- [x] Remove unnecessary nested backgrounds.
- [x] Confirm interactive affordances remain clear.

## Acceptance criteria

- Today has one dominant visual surface.
- Secondary content does not compete with the recommendation.
- Interactive rows remain recognizable without card containers.

## Notes

- 2026-07-17: Defined primary, contextual, and plain surface roles in the calm-interface principles. Filled surfaces are reserved for the main task or necessary context; supporting content defaults to open sections and thin rules.
- 2026-07-17: Today keeps the recommendation as its single filled feature surface. Weather, the missing-location prompt, seasonal foods, and destination shortcuts now sit directly on the page with spacing and rules.
- 2026-07-17: Learn results and seasonal foods use ruled rows with a closing rule. Settings keeps its disclosure rows and active marker while removing the nested active-row and panel fills.
- 2026-07-17: Browser coverage verifies the surface hierarchy and confirms all converted interactive rows remain at least 44 pixels tall.
