---
id: PROD-001
title: Define the purpose of My Balance
type: exploration
status: backlog
priority: P1
area: product
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - docs/design/balance-visualization.md
  - docs/design/wireframes/my-balance.md
  - app/src/screens/Secondary.tsx
---

# Define the purpose of My Balance

## Why

The current implementation is thoughtful, but the team does not yet have a clear shared answer for why a user opens My Balance, what they should understand, or what action the screen should support.

## Desired outcome

Define a primary job-to-be-done and information hierarchy before adding more visualization logic or visual polish.

## Questions to answer

- Is the user asking what is usually true, what changed, what to observe, or why guidance was selected?
- Is the screen primarily reflection, comparison, education, history, or action?
- Should it lead to a check-in, guidance, answer review, or chat?
- Is category coverage user-facing value or internal implementation detail?
- What should the user feel after viewing it?
- Does the timeline support a real decision?

## Tasks

- [ ] Write three candidate jobs-to-be-done.
- [ ] Create a low-fidelity concept for each.
- [ ] Test what users think the current rings and symbols mean.
- [ ] Ask what users expect after another check-in.
- [ ] Decide the MVP purpose and primary action.
- [ ] Update product and screen specifications.

## Constraints

Until this work is resolved, limit My Balance changes to bugs, accessibility, and necessary clarity. Do not add new decorative visualization logic.

## Acceptance criteria

- One primary job-to-be-done is selected.
- The intended user decision or action is explicit.
- The screen specification reflects the decision.
- Follow-up implementation work is separated into new items.
