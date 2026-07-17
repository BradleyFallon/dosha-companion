# Screen Specifications

> Contextual-chat demo update: Today actions, repeatable Questions check-ins, check-in-aware My Balance, Learn listing/detail/glossary, and a mock context-aware conversation interface are implemented. No dosha interpretation or real LLM provider is present.

## Current limited-MVP behavior

### Sign up and profile setup

The demo begins directly with a two-step core profile: preferred name and adult year of birth, followed by dietary pattern and explicit allergy/exclusion status. Allergy or exclusion details are required after Yes. Location is not required for core participation; it is requested contextually only when the user chooses localized weather, daylight, season, or food features.

Readiness distinguishes `coreReady` from `localizedContentReady`. Assessment and application routes require the core profile, while a regional location moves localized content from “not provided yet” to available.

### Initial questions and Results

The 27 canonical questions support selection, fallback answers, skip, back, immediate local persistence, exit, refresh, and resume. Results use `coverage-policy-0.1`, distinguish baseline/current/context, expose fallback/skip/unanswered counts, and route to the next useful repair question.

Normal Results never display a dosha label because weights and thresholds remain unapproved. Development builds provide an explicit fixture-only preview that is not calculated or persisted.

### Today

Today separates a rotating daily feed from stable links to usual nature, food preferences, and local rhythms. Without location it shows one contextual benefit card and makes no weather request; with location it shows regional weather and seasonal food content. It also shows one deterministically selected focus, one practical action, an optional filtered food prompt, coverage status, and an inspectable rule explanation. The recommendation and each eligible seasonal food expose distinct contextual chat actions. Recommendation selection remains deterministic; chat can only explain it.

### Questions and My Balance

Questions reports real baseline/current coverage and links to the next repair question. Unapproved refinement questions are visibly unavailable. My Balance reports coverage only and explains why scoring is unavailable.

### Learn and Ask Dosha Companion

Published article detail screens expose Ask about this article. `/chat` provides a general question entry and recent conversations, while `/chat/:threadId` provides a focused context card, scrollable messages, suggestions, citations, retry, and a fixed composer. The current client uses scripted mock responses grounded in deterministic local retrieval. `/assistant` redirects to the chat home.

Completed check-ins expose Talk through this check-in without changing their stored answers or usual-nature assessment.

### Settings

Settings edits profile fields without deleting assessment answers and links contextually to add or change the regional location. Automatic, Fahrenheit, and Celsius temperature preferences appear only after location is provided. A Conversations section reports browser-local thread count and can clear chat history independently. It displays local save status and browser-only persistence limitations.

## Deferred specifications

Real provider integration, server-side context verification, authentication, production safety review, rate limits, scoring, confidence, subscriptions, account recovery, and backend synchronization remain deferred.
