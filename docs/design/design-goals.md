# Design Goals

## Status

Low-fidelity product-design direction for the first mobile prototype. This document defines flow and information hierarchy, not brand, visual style, or production components.

## Source hierarchy

- `docs/product/screen-specifications.md` defines the required product surfaces and states.
- Product, profile, safety, and quiz specifications define behavior and data boundaries.
- Files under `docs/design/wireframes/` make those requirements concrete for testing; they do not override upstream requirements.
- When a wireframe exposes an unresolved product decision, record and resolve it in the relevant specification before implementation.

## Primary milestone

Validate this complete vertical slice at approximately 390 px wide:

> Welcome → account setup → assessment introduction → baseline questions → section transition → current-balance questions → preliminary result → Today

The prototype may use representative questions rather than all 27, but it must preserve the real section boundaries, navigation, skip behavior, saving, and result hierarchy.

## Goals

1. Help a new user understand the product without presenting it as medical care.
2. Keep account creation and profile setup short enough that the assessment remains the main task.
3. Make baseline constitution and current balance feel related but unmistakably different.
4. Make a 27-question assessment feel finite, resumable, and respectful.
5. Show preliminary results without implying clinical certainty.
6. Turn the result into an immediately useful Today experience.
7. Keep approved expert content visibly primary and AI optional.
8. Work at 320 px and above with touch, keyboard, zoom, and screen readers.

## Non-goals for this milestone

- Visual branding, illustration, photography, or polished motion
- A production design system
- Full Learn information architecture
- Subscription checkout and account-management flows
- Complete AI chat behavior
- Numerical scoring or score visualization
- Historical balance trends
- Native-app conventions or push-notification design

## Success questions

- Can users explain the difference between “usual nature” and “current balance”?
- Can users answer, change, skip, exit, and resume without uncertainty?
- Do users understand that “Not sure” is an answer while “Skip” defers the question?
- Does progress feel finite without creating pressure to answer sensitive questions?
- Can users identify which result is stable and which reflects the recent period?
- Does the Today screen provide one useful action before requiring a scroll?
- Do users understand why guidance was selected and that AI did not invent it?

## Prototype decisions to validate

| Decision | First-prototype hypothesis | Why it is testable |
| -------- | -------------------------- | ------------------ |
| Navigation before completion | Hide primary bottom navigation until preliminary results | Tests whether a focused first-run flow is clearer |
| Question density | One question per screen | Tests comprehension and thumb-friendly interaction |
| Advancement | Select an answer, then tap Continue | Prevents accidental advancement and permits review |
| Not sure vs. Skip | “Not sure” is an answer option; “Skip for now” is a separate action | Preserves different data meanings |
| Completeness | Use stage labels and plain counts, not clinical percentages | Tests clarity without false precision |
| Result separation | Two separately titled cards with explicit time context | Does not rely on color to communicate meaning |
| Today above the fold | Show focus, explanation, and practical action first | Tests daily value before secondary content |
| AI on Today | Show an entry point to chat; do not auto-generate Today copy | Keeps the first prototype grounded, fast, and reviewable |
