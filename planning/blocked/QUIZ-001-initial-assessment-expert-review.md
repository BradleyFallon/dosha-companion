---
id: QUIZ-001
title: Complete expert review of the initial assessment
type: exploration
status: blocked
priority: P0
area: quiz
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on:
  - Ayurvedic expert availability
related:
  - docs/quiz/expert-review-guide.md
  - docs/quiz/initial-question-bank.md
  - data/quiz/questions.csv
  - data/quiz/answer-options.csv
  - data/quiz/answer-scores.csv
---

# Complete expert review of the initial assessment

## Why

Production scoring, profile labels, and dosha-specific claims cannot proceed responsibly until an Ayurvedic expert reviews the question set and qualitative mappings.

## Blocker

An appropriate Ayurvedic expert must review the canonical question, answer, and qualitative mapping data.

## Desired outcome

Every initial question has a reviewed concept, placement, reliability classification, confounders, and set decision. Every ordinary answer has an accepted or corrected qualitative direction. Numerical weights remain blank.

## Tasks

- [ ] Identify and onboard the reviewer.
- [ ] Review the files in the order defined by `docs/quiz/expert-review-guide.md`.
- [ ] Record reviewer, lifecycle status, notes, and accepted qualitative rationale.
- [ ] Review the complete assessment as a system.
- [ ] Resolve redundancy and missing-domain recommendations.
- [ ] Confirm readiness for scoring-model work.

## Acceptance criteria

Use the completion criteria in `docs/quiz/expert-review-guide.md`. This item does not approve numerical scoring.
