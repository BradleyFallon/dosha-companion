---
id: PROD-002
title: Run moderated usability sessions
type: exploration
status: active
priority: P1
area: product
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on:
  - EXP-002
related:
  - docs/design/design-goals.md
  - docs/research/moderated-usability-protocol.md
  - docs/research/usability-session-notes-template.md
  - app/e2e/prototype.spec.ts
---

# Run moderated usability sessions

## Why

The prototype now contains enough product surface to learn more from observation than from adding another feature.

## Desired outcome

Run five short moderated sessions and identify the highest-impact comprehension, trust, navigation, and value-loop problems.

## Core tasks for participants

1. Complete the normal production onboarding and full 27-question initial assessment, including regional location, and continue to Today.
2. Use the Today recommendation.
3. Complete a check-in.
4. Ask about a recommendation.
5. Explore My Balance without explanation.
6. Optionally compare daylight phases when time allows.

## Observe

- Hesitation and backtracking
- Understanding of usual nature versus recent balance
- Whether Today feels useful without explanation
- Whether Check In feels lightweight
- Whether location feels relevant or invasive
- What My Balance graphics are believed to mean
- Whether chat feels integrated or distracting
- What the user expects tomorrow

## Tasks

- [x] Write a neutral moderator script.
- [ ] Recruit five target users.
- [x] Define consent and note-taking process.
- [ ] Run sessions without coaching the interface.
- [ ] Summarize repeated findings.
- [ ] Convert validated findings into prioritized work items.

## Acceptance criteria

- Five sessions are completed.
- Findings distinguish observed behavior from opinion.
- Repeated issues are promoted into planning items.
- Product scope changes update the relevant specifications.

## Notes

- 2026-07-17: Added a repository-ready moderator protocol and session-notes template. The protocol includes neutral task prompts, consent and recording choices, participant-data minimization, daylight-phase questions, and a consistent observation taxonomy.
- 2026-07-17: Keep this item active until five participants are recruited, sessions are completed, and repeated findings are synthesized. Do not treat the protocol itself as completion of the research.
- 2026-07-17: Full production onboarding is the only research path. Sessions intentionally include all 27 initial-assessment questions so assessment pace, engagement, scanning, and abandonment behavior can be observed rather than hidden by a research-only shortcut.
- 2026-07-17: Regional location is evaluated inside onboarding, not as a standalone task. The first session is a pacing pilot and may run for up to 60 minutes. Shorten moderator follow-ups before removing any product step; the optional daylight comparison may be omitted when time is limited.
- 2026-07-17: Development short mode, seeded profiles, and fixture results remain developer tools and must not be shown or mentioned to participants.
