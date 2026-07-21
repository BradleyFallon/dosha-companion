# Screen Specifications

> Prototype update: answer-derived dosha estimates, Today actions, repeatable Check In records, assessment maintenance, Learn, and a mock context-aware conversation interface are implemented. No clinical interpretation or real LLM provider is present.

## Current limited-MVP behavior

### Sign up and profile setup

The demo begins directly with a three-step profile: preferred name and adult year of birth, regional location, then dietary pattern and explicit allergy/exclusion status. Allergy or exclusion details are required after Yes. The location step offers device, map, and city-search paths and persists only a coarse region.

Readiness distinguishes identity-and-food `coreReady`, `locationReady`, combined `onboardingReady`, and `localizedContentReady`. Assessment and application routes require the combined onboarding state. Location remains editable or removable later through allowlisted return paths without altering assessment answers.

### Initial questions and Results

The 27 canonical questions support selection, fallback answers, skip, back, immediate local persistence, exit, refresh, and resume. Results use `coverage-policy-0.1`, distinguish baseline/current/context, expose fallback/skip/unanswered counts, and route to the next useful repair question.

Coverage-ready Results display a clearly labeled prototype estimate calculated from explicit unit weights, with usual nature kept separate from the recent pattern. The screen discloses its `0.1-draft` model and 75% mixed-profile threshold. Development builds retain an explicit fixture-only preview for reviewing the incomplete-assessment path.

### Today

Today makes the person’s answer-derived prototype dosha estimate visible immediately below the greeting, then centers one deterministically selected recommendation: concept icon, title, one action sentence, and compact Complete, Show another, and Ask controls. The recommendation disclosure explicitly states that this estimate was not used for selection. A development sample may still show its controlled Vata–Pitta/current-Vata fixture with a sample-data label. Two secondary shortcuts lead to Check in and Learn.

With the onboarding location, Today shows a visual weather summary and up to four compact seasonal-food rows. The weather default contains current conditions, high/low, and precipitation; feels-like, daylight, season, and forecast area are disclosed on request. If a safely restored legacy state has no location, Today shows one benefit card and makes no weather request. Recommendation selection remains deterministic; chat can only explain it.

### Check In and My Balance

The `/questions` route is labeled **Check In** in the interface. Its default state has one dominant task: resume the newest unfinished check-in or start the quick past-seven-days check-in. The detailed check-in is available under More options and does not receive equal visual weight.

The screen shows the latest completed record, at most two additional recent records, a View all history route when needed, and one compact Initial assessment row. Completed records open a focused dated summary; answers and scoring boundaries are collapsed by default. Contextual chat remains available with record-specific context.

Initial-assessment maintenance lives at `/questions/assessment`. It reports Complete or the remaining-question count, continues at the next useful question, and returns there after assessment editing. Plain-language coverage details remain available in a disclosure rather than on the Check In landing screen.

Active repeat check-ins use a focused, no-document-scroll layout. A minimal exit control and progress dots remain fixed above the independently scrollable question region, while the fixed action stays visible above the safe area. Native radio semantics and arrow/Enter keyboard controls are retained.

Check In owns operational tasks and dated records. My Balance begins with the same explicit prototype estimate shown on Today, with calculated, sample, and insufficient-information states clearly distinguished. A latest completed check-in can replace the initial current answers for the recent estimate without changing usual nature. Below it, My Balance is a visual reflection rather than a coverage report: two segmented rings communicate represented categories, six domain controls compare the latest recent record with the user’s usual responses, and a five-point timeline opens dated summaries without plotting values. It uses only editor-authored display labels and neutral pattern keys. Same keys display Close to usual; different keys display Changed recently. Missing, fallback, one-sided, or unreviewed metadata never becomes an inferred comparison.

`/balance/:domain` opens a validated focused detail within the visual composition. Full source responses and the prototype-estimate boundary are disclosed on request. My Balance has one Check In/Continue action and does not repeat Settings, location, Learn, coverage repair, or full history controls.

### Learn and Ask Dosha Companion

The Learn index uses one search field, one compact category selector, and title-only article rows with semantic icons. Article detail screens retain summary, body, related reading, and Ask about this article.

`/chat` presents one dominant question prompt, a compact composer, at most two initial suggestions, and recent conversations only when they exist. `/chat/:threadId` provides a compact expandable context bar, open message layout, conditional suggestions, citations, retry, and a fixed composer. The current client uses scripted mock responses grounded in deterministic local retrieval. `/assistant` redirects to the chat home.

Completed check-ins expose Talk through this check-in without changing their stored answers or usual-nature assessment. Balance-domain details expose Ask about this with short and full authored response text plus the deterministic neutral comparison; chat does not interpret the prototype score or provide medical meaning.

### Settings

Settings begins with compact Profile, Location, Units, Conversations, and Local data rows. Only one section can be expanded at a time, so profile inputs, temperature controls, storage actions, and destructive actions are not exposed simultaneously. Profile edits preserve assessment answers; location links retain their return target; Units appears only after location is provided; conversation history and all local data can still be cleared independently.

## Deferred specifications

Real provider integration, server-side context verification, authentication, production safety review, rate limits, expert-validated scoring, confidence, time decay, subscriptions, account recovery, and backend synchronization remain deferred.
