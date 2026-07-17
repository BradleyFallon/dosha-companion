# Project Planning

This directory is the repo-native work board for Dosha Companion. It tracks work that is not yet part of the accepted product, design, data, or engineering specification.

## Source hierarchy

- `docs/notes/inbox.md` is quick, unstructured capture.
- `planning/` contains prioritized work, exploration, bugs, and dependencies.
- `docs/` contains the current accepted specification.
- `decisions/` contains durable architectural or product decisions and their rationale.

A planning item is temporary. When work resolves a product or technical question, update the appropriate source-of-truth document before closing the item.

## Board structure

- `active/`: work currently being pursued; keep this list small.
- `backlog/`: understood work and exploration that is not active yet.
- `blocked/`: valuable work that cannot proceed because a named dependency is unresolved.
- `done/`: completed items retained for history and implementation links.
- `templates/`: reusable work-item templates.

Moving a file between these folders changes its status. Update its frontmatter at the same time.

## Work-item IDs

- `EXP`: experience, interaction, visual design, and accessibility
- `PROD`: product behavior, scope, and validation
- `ENG`: implementation, architecture, tooling, and operations
- `QUIZ`: assessment, scoring, and expert-review work
- `CONTENT`: editorial content and publishing
- `RESEARCH`: evidence gathering or unresolved investigation
- `BUG`: demonstrably incorrect behavior

Use the next available number within a prefix. IDs remain stable when files move.

## Types

- `implementation`: sufficiently understood to build
- `exploration`: requires research, prototyping, or user testing before a decision
- `decision`: should conclude with a decision record or specification update
- `bug`: incorrect behavior with an expected result
- `idea`: worth preserving but not yet evaluated

## Priority

- `P0`: current, urgent, or blocking
- `P1`: important next work
- `P2`: valuable but not next
- `P3`: possible future work
- `icebox`: preserved without an expectation of scheduling

Avoid making every item `P1`. Prefer one or two `P0` items and three to five `P1` items.

## Workflow

1. Capture ideas quickly in `docs/notes/inbox.md`.
2. During triage, delete noise, merge duplicates, and promote meaningful work into a file based on `templates/work-item.md`.
3. Assign a type and priority. Put only work being actively pursued in `active/`.
4. Add dated notes, discoveries, relevant commits, and changed assumptions while working.
5. Before moving an item to `done/`, verify acceptance criteria, update source-of-truth documentation, and create separate follow-up items for unresolved work.

## Current board

### Active

No implementation item is currently active.

### Next

- [PROD-002 — Run moderated usability sessions](backlog/PROD-002-moderated-usability-sessions.md)
- [EXP-004 — Reduce dashboard and card styling](backlog/EXP-004-reduce-card-styling.md)

### Product exploration

- [PROD-001 — Define the purpose of My Balance](backlog/PROD-001-define-my-balance-purpose.md)
- [EXP-006 — Explore focused balance-domain detail](backlog/EXP-006-focused-balance-domain-detail.md)
- [EXP-007 — Evaluate and refine daylight phases](backlog/EXP-007-evaluate-refine-daylight-phases.md)

### Blocked

- [QUIZ-001 — Complete expert review of the initial assessment](blocked/QUIZ-001-initial-assessment-expert-review.md)

### Recently completed

- [EXP-005 — Add joyful completion motion](done/EXP-005-joyful-completion-motion.md)
- [ENG-001 — Add continuous integration](done/ENG-001-add-continuous-integration.md)
- [EXP-003 — Add visible action labels](done/EXP-003-visible-action-labels.md)
- [EXP-002 — Four-phase local daylight prototype](done/EXP-002-local-daylight-ambient-theme.md)
- [EXP-001 — Add expressive typography](done/EXP-001-expressive-typography.md)

## Triage rhythm

Review the inbox and board once or twice per week. Update this index only with the small set of active, next, blocked, and recently completed items; detailed notes belong in work-item files.
