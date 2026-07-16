# Screen Specifications

## Current limited-MVP behavior

### Sign up and profile setup

Account entry is simulated and passwords are never persisted. Profile setup collects preferred name, optional age band, optional coarse location/units, dietary pattern, allergies, and exclusions. Settings permits later edits.

### Initial questions and Results

The 27 canonical questions support selection, fallback answers, skip, back, immediate local persistence, exit, refresh, and resume. Results use `coverage-policy-0.1-provisional`, distinguish baseline/current/context, expose fallback/skip/unanswered counts, and route to the next useful repair question.

Normal Results never display a dosha label because weights and thresholds remain unapproved. Development builds provide an explicit fixture-only preview that is not calculated or persisted.

### Today

Today shows one deterministically selected provisional focus, one practical action, an optional filtered food prompt, coverage status, and an inspectable rule explanation. Each content item is labeled as not expert-approved. No LLM or dosha score participates.

### Questions and My Balance

Questions reports real baseline/current coverage and links to the next repair question. Unapproved refinement questions are visibly unavailable. My Balance reports coverage only and explains why scoring is unavailable.

### Learn and AI assistant

Unapproved article placeholders are non-interactive and labeled unavailable. The AI assistant is an explicit unavailable placeholder with safety boundaries.

### Settings

Settings edits profile fields without deleting assessment answers and links to the existing location/units chooser. It displays local save status and browser-only persistence limitations.

## Deferred specifications

Production empty/loading/network behavior, published articles, scoring, confidence, history, subscriptions, data export/deletion, account recovery, grounded AI, and backend synchronization remain TODO after their underlying systems are approved.
