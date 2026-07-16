# Screen Specifications

> Content-driven demo update: Today actions, repeatable Questions check-ins, check-in-aware My Balance, Learn listing/detail/glossary, deterministic Guided help, and Settings export/reset/demo seed are implemented. All editorial content is provisional. No dosha interpretation or LLM is present.

## Current limited-MVP behavior

### Sign up and profile setup

The demo begins directly with profile setup. Preferred name, adult year of birth, regional location, dietary pattern, explicit allergy status, and explicit other-exclusion status are required. Allergy or exclusion details are required after Yes. Settings uses the same readiness rules for later edits.

### Initial questions and Results

The 27 canonical questions support selection, fallback answers, skip, back, immediate local persistence, exit, refresh, and resume. Results use `coverage-policy-0.1`, distinguish baseline/current/context, expose fallback/skip/unanswered counts, and route to the next useful repair question.

Normal Results never display a dosha label because weights and thresholds remain unapproved. Development builds provide an explicit fixture-only preview that is not calculated or persisted.

### Today

Today separates a rotating daily feed from stable links to usual nature, food preferences, and local rhythms. It shows one deterministically selected focus, one practical action, an optional filtered food prompt, coverage status, and an inspectable rule explanation. Editorial approval metadata remains in the content source rather than appearing as repeated user-facing badges. No LLM or dosha score participates.

### Questions and My Balance

Questions reports real baseline/current coverage and links to the next repair question. Unapproved refinement questions are visibly unavailable. My Balance reports coverage only and explains why scoring is unavailable.

### Learn and AI assistant

Unapproved article placeholders are non-interactive and labeled unavailable. The AI assistant is an explicit unavailable placeholder with safety boundaries.

### Settings

Settings edits profile fields without deleting assessment answers and links to the existing location/units chooser. It displays local save status and browser-only persistence limitations.

## Deferred specifications

Production empty/loading/network behavior, published articles, scoring, confidence, history, subscriptions, data export/deletion, account recovery, grounded AI, and backend synchronization remain TODO after their underlying systems are approved.
