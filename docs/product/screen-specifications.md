# Screen Specifications

> Contextual-chat demo update: Today actions, repeatable Check In records, assessment maintenance, Learn listing/detail/glossary, and a mock context-aware conversation interface are implemented. No dosha interpretation or real LLM provider is present.

## Current limited-MVP behavior

### Sign up and profile setup

The demo begins directly with a two-step core profile: preferred name and adult year of birth, followed by dietary pattern and explicit allergy/exclusion status. Allergy or exclusion details are required after Yes. Location is not required for core participation; it is requested contextually only when the user chooses localized weather, daylight, season, or food features.

Readiness distinguishes `coreReady` from `localizedContentReady`. Assessment and application routes require the core profile, while a regional location moves localized content from “not provided yet” to available.

### Initial questions and Results

The 27 canonical questions support selection, fallback answers, skip, back, immediate local persistence, exit, refresh, and resume. Results use `coverage-policy-0.1`, distinguish baseline/current/context, expose fallback/skip/unanswered counts, and route to the next useful repair question.

Normal Results never display a dosha label because weights and thresholds remain unapproved. Development builds provide an explicit fixture-only preview that is not calculated or persisted.

### Today

Today is centered on one deterministically selected recommendation: concept icon, title, one action sentence, and compact Complete, Show another, and Ask controls. One information disclosure contains longer guidance, related actions, optional filtered food, exact rule reasons, and Dismiss. Two secondary shortcuts lead to Check in and Learn.

Without location Today shows one contextual benefit card and makes no weather request. With location it shows a visual weather summary and up to four compact seasonal-food rows. The weather default contains current conditions, high/low, and precipitation; feels-like, daylight, season, and forecast area are disclosed on request. Recommendation selection remains deterministic; chat can only explain it.

### Check In and My Balance

The `/questions` route is labeled **Check In** in the interface. Its default state has one dominant task: resume the newest unfinished check-in or start the quick past-seven-days check-in. The detailed check-in is available under More options and does not receive equal visual weight.

The screen shows the latest completed record, at most two additional recent records, a View all history route when needed, and one compact Initial assessment row. Completed records open a focused dated summary; answers and scoring boundaries are collapsed by default. Contextual chat remains available with record-specific context.

Initial-assessment maintenance lives at `/questions/assessment`. It reports Complete or the remaining-question count, continues at the next useful question, and returns there after assessment editing. Plain-language coverage details remain available in a disclosure rather than on the Check In landing screen.

Active repeat check-ins use a focused, no-document-scroll layout. A minimal exit control and progress dots remain fixed above the independently scrollable question region, while the fixed action stays visible above the safe area. Native radio semantics and arrow/Enter keyboard controls are retained.

Check In owns operational tasks and dated records. My Balance is reserved for interpretation or comparison of usual nature and current state; while scoring is unavailable it remains deliberately limited and links back to Check In rather than duplicating history.

### Learn and Ask Dosha Companion

The Learn index uses one search field, one compact category selector, and title-only article rows with semantic icons. Article detail screens retain summary, body, related reading, and Ask about this article.

`/chat` presents one dominant question prompt, a compact composer, at most two initial suggestions, and recent conversations only when they exist. `/chat/:threadId` provides a compact expandable context bar, open message layout, conditional suggestions, citations, retry, and a fixed composer. The current client uses scripted mock responses grounded in deterministic local retrieval. `/assistant` redirects to the chat home.

Completed check-ins expose Talk through this check-in without changing their stored answers or usual-nature assessment.

### Settings

Settings begins with compact Profile, Location, Units, Conversations, and Local data rows. Only one section can be expanded at a time, so profile inputs, temperature controls, storage actions, and destructive actions are not exposed simultaneously. Profile edits preserve assessment answers; location links retain their return target; Units appears only after location is provided; conversation history and all local data can still be cleared independently.

## Deferred specifications

Real provider integration, server-side context verification, authentication, production safety review, rate limits, scoring, confidence, subscriptions, account recovery, and backend synchronization remain deferred.
