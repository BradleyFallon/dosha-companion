# Today Screen

> Demo update: the primary card is selected from the validated repository catalog. Mark complete, Dismiss, Show another, Why this was chosen, related reading, and linked check-in controls are functional. History is browser-local and used only to avoid immediate repetition.

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
8. Stable “Your guide” links for usual nature, food preferences, and local rhythms
9. Related learning content
10. Available-question indicator and Guided help entry point

## Content responsibility

- Editorial review status stays in structured content metadata and editor tooling rather than appearing as a repeated badge in the reader experience.
- Deterministic rules choose the underlying guidance from context, coverage, profile exclusions, and saved-time-zone time of day.
- Local conditions use the saved representative regional coordinate for current temperature, feels-like temperature, daily high/low, precipitation chance, sunrise, sunset, and a broad hemisphere-aware season. The card displays the saved regional name and never uses raw selection coordinates.
- Temperature display defaults from the saved country and can be overridden in Settings. Weather remains informational until separate editorial rules approve its use in guidance selection.
- “In season near you” uses the editor-owned seasonal produce catalog filtered by region, month, diet, allergies, and exclusions; it does not claim dosha compatibility.
- “Why this was chosen” exposes the exact matched rule and states that no dosha score was used.
- The limited MVP does not place automatically generated AI prose on Today.
- The AI entry opens a separate grounded chat experience.

## Core states

| State | Behavior |
| ----- | -------- |
| Fresh profile and guidance | Show complete daily hierarchy |
| Current balance aging | Show guidance with an “Update your balance” question action |
| Current coverage insufficient | Prefer the next current check-in over stronger personalization |
| No higher-priority rule | Show the clearly labeled provisional general fallback |
| Loading | Preserve card heights with meaningful labels where possible |
| Content unavailable | Keep balance summary and questions accessible; explain guidance is temporarily unavailable |
| AI unavailable | Keep the rest of Today intact and disable only the AI entry |
| No LLM available | Preserve Today guidance and link to deterministic Guided help content search |

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
