---
id: EXP-007
title: Evaluate and refine daylight phases
type: exploration
status: backlog
priority: P2
area: experience
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on:
  - EXP-002
  - PROD-002
related:
  - docs/design/daylight-ambient-theme.md
  - planning/done/EXP-002-local-daylight-ambient-theme.md
---

# Evaluate and refine daylight phases

## Why

The four-phase prototype already provides meaningful daylight range. Adding sunrise, morning, and late-afternoon palettes before evaluation could create distinctions users do not notice or value.

## Desired outcome

Use usability findings to decide whether the daylight system needs more phases, broader route coverage, or an explicit appearance override.

## Scope

- Evaluate whether users distinguish sunset from twilight.
- Assess whether the four phases provide sufficient emotional and environmental range.
- Evaluate comfort and legibility during night use.
- Decide whether sunrise, morning, and late afternoon add meaningful value.
- Decide whether the atmosphere should extend beyond Today.
- Determine whether Settings needs an appearance override.

## Out of scope

- Implementing additional palettes before the evaluation.
- Treating daylight as wellness, dosha, or emotional guidance.
- Replacing the saved regional-location privacy model.

## Open questions

- Do sunset and twilight feel distinct without becoming theatrical?
- Is the static sundial wash noticeable at an appropriate level?
- Should a user be able to override the automatic appearance?
- Which routes, if any, should inherit Today’s atmosphere?
- Are provider-supplied civil-twilight times worth adding?

## Tasks

- [ ] Include daylight-phase questions in moderated usability sessions.
- [ ] Review the four phases in realistic morning, midday, evening, and dark-room contexts.
- [ ] Record whether additional phases solve an observed problem.
- [ ] Decide route scope and appearance-override behavior.
- [ ] Update the design specification with the decision.

## Acceptance criteria

- The team has evidence for retaining four phases or adding specific new phases.
- Any expansion has a user-facing rationale and reviewed contrast targets.
- Route scope and appearance override are explicitly decided.
