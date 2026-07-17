# ADR 0002: Web Prototype Stack

- Status: Accepted for prototype
- Date: 2026-07-15
- Supersedes: None

## Context

The documentation-first repository now needs a working mobile-first prototype of the first-run product loop. The prototype must make the canonical assessment data reviewable in a real interaction, preserve progress locally, and support fast usability testing without implying that authentication, scoring, recommendations, subscriptions, or AI are production-ready.

The repository does not yet need server rendering, a backend, a database, a production design system, or platform-specific application code. The production architecture remains undecided.

## Decision

Build the prototype as a static single-page application under `app/` with:

- npm for package management and scripts;
- React with TypeScript in strict mode;
- the current stable Vite 8 line for development and static builds;
- Node.js 22.12 or newer, with a supported LTS release preferred for development;
- React Router for explicit routes, redirects, and completion guards;
- plain CSS and CSS custom properties for the low-fidelity responsive UI;
- typed reducer/context state with a versioned, allow-listed `localStorage` snapshot;
- a build-time generator that reads the canonical CSV files under `data/quiz/` and emits typed application data;
- Vitest and React Testing Library for unit and component tests;
- Playwright for the mobile vertical-slice browser tests;
- a deterministic, versioned assessment-coverage engine with an unavailable-scoring boundary;
- a small deterministic Today selector using clearly labeled provisional content;
- development-only result fixtures isolated behind an explicit adapter; and
- a static unavailable assistant entry with no API calls.

The application must never read `data/quiz/answer-scores.csv`. Numerical scoring is not approved. Authentication is simulated, passwords are transient, and all local progress is device/browser-local.

## Reasons

React and React Router fit the screen- and state-heavy prototype while keeping route behavior explicit. Vite provides a small, conventional static application scaffold and fast local iteration. TypeScript helps enforce the boundary between canonical generated quiz data, transient form values, and persisted prototype state.

Plain CSS keeps the first usability artifact easy to inspect and avoids prematurely selecting a visual system. A reducer and versioned local snapshot are sufficient to test save, exit, reload, resume, and navigation guards without creating a backend contract before the product behavior is validated.

Generating quiz data before development, tests, and builds keeps the CSV files canonical, catches broken references early, and prevents hand-copied questions from drifting.

## Alternatives considered

### Next.js

Deferred. Server rendering, server actions, and framework hosting conventions add decisions the static prototype does not need. Reconsider if production requires server-rendered public content, authenticated server routes, or an integrated backend-for-frontend.

### Vanilla TypeScript

Not selected. It would minimize framework code but require more custom work for routed screen composition, predictable state updates, and component testing.

### Svelte

Viable, but not selected for this prototype. React has a broader fit with the anticipated team workflow and the requested testing stack; there is no product requirement that makes a framework change valuable now.

### Tailwind or a component library

Not selected. Tokens and components are intentionally unsettled, and the milestone tests information hierarchy rather than brand execution. Plain CSS keeps the artifact low fidelity and avoids library-specific markup.

### Backend or backend-as-a-service

Deferred. Real accounts, cross-device persistence, security controls, analytics, scoring services, and content delivery require a deliberate production data and privacy design. Simulating those systems is enough for this prototype.

## Consequences

The repository gains a self-contained `app/` workspace and lockfile. Quiz CSV changes must pass generation before the app can start or build. Browser history and refresh can be tested against explicit URLs, and the static output can be hosted on any service that supports SPA fallback routing.

Production-facing result screens report answer coverage and explain that scoring is unavailable. A fixture remains only for explicit development previews and must never be stored as a calculated result. Today guidance is selected by fixed normal-code rules from provisional content and must remain labeled as unapproved until editorial and expert review is complete.

Local persistence is validated, migrated, and failure-aware, but remains intentionally single-browser and disposable. It is not an account record, secure storage, or a migration strategy for production data.

## Limitations

- No real authentication, authorization, backend API, or database.
- No approved dosha scoring, thresholds, or numerical balance visualization.
- No expert-approved daily content or publishing workflow; current deterministic guidance is provisional.
- No subscription enforcement or payment flow.
- No LLM call, grounded retrieval, or production AI safety implementation.
- No cross-device progress, account recovery, server audit trail, or production privacy controls.
- Static hosting needs a fallback to `index.html` for direct route loads.

## Production status

This decision is accepted only for the prototype. It does not select the production web framework, hosting platform, backend architecture, identity provider, content platform, analytics system, or AI architecture.

## Reconsider when

Revisit this decision when usability testing validates the flow and any of the following becomes necessary:

- real accounts or cross-device persistence;
- approved scoring and result recomputation;
- server-enforced privacy, consent, or subscription rules;
- published expert content and deterministic recommendation delivery;
- public content that benefits from server rendering;
- production AI grounding, usage controls, and auditability;
- native-device capabilities or an iOS/Android product commitment.
