# Today Screen

## Purpose

Today is the post-assessment home and primary retention surface. It turns the latest approved profile state into one understandable focus and one practical action without requiring the user to interpret scores.

## Information hierarchy

### Before the first scroll at approximately 390 px

1. Greeting and local date
2. Compact current-balance summary with freshness
3. Today’s focus headline
4. Two or three lines of expert-authored guidance
5. One practical action

### Below the first scroll

6. Optional compatible food suggestion
7. “Why this was chosen” disclosure
8. Related approved learning content
9. Available-question indicator
10. AI assistant entry point

## Content responsibility

- Expert-authored published content supplies the lesson and action.
- Deterministic rules choose the underlying guidance.
- “Why this was chosen” exposes understandable selection signals such as current balance, recent sleep, season, or stated constraints.
- The first prototype does not place automatically generated AI prose on Today.
- The AI entry opens a separate grounded chat experience.

## Core states

| State | Behavior |
| ----- | -------- |
| Fresh profile and guidance | Show complete daily hierarchy |
| Current balance aging | Show guidance with an “Update your balance” question action |
| Current balance stale | Avoid strong personalization; show general approved guidance and request check-in |
| No matching guidance | Show a general approved daily item; do not invent a recommendation |
| Loading | Preserve card heights with meaningful labels where possible |
| Content unavailable | Keep balance summary and questions accessible; explain guidance is temporarily unavailable |
| AI unavailable | Keep the rest of Today intact and disable only the AI entry |
| Free user | Show AI entry with clear subscription label; do not obscure free daily guidance |

## Interaction details

- Tapping current balance opens My Balance.
- Tapping the daily focus opens its full content or expands it in place; prototype both only if needed.
- Tapping the practical action may mark it useful or saved later, but habit tracking is out of MVP.
- “Why this was chosen” expands inline and never exposes raw answers or numeric scoring.
- The question indicator opens Questions and distinguishes refinement from a current check-in.
- Bottom navigation is visible on Today after the preliminary result.

## Content-length constraints for wireframing

- Today focus headline: one or two lines
- Introductory guidance: two or three short sentences before scroll
- Practical action: one bounded instruction, usually one to three lines
- Food suggestion: optional and no more prominent than the primary lifestyle action
- Relevance explanation: two to four plain-language signals

## Open prototype questions

- Does the practical action remain visible before scrolling on a small device?
- Is current-balance freshness understandable without a score?
- Does “Why this was chosen” build trust or add cognitive load?
- Does the AI entry feel optional rather than required for value?
- Should the daily focus open a full article or remain a self-contained card?

