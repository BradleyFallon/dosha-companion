# Dosha Companion web prototype

This directory contains a low-fidelity mobile-first prototype of the first product loop:

> Welcome → required profile setup → assessment → coverage → interactive Today → check-ins → Learn and guided content search

It is a content-driven browser-local demo, not a production application. Coverage, repeatable current check-ins, recommendation rotation/history, Learn, deterministic content search, Settings export/reset, and a development demo seed are functional. Authentication, dosha scoring, expert approval, subscriptions, AI, and synchronization remain unavailable or simulated.

## Stack

- React 19 and strict TypeScript
- Vite 8 static application build
- React Router with completion guards
- Plain CSS and CSS custom properties
- Typed reducer/context state with versioned `localStorage`
- Papa Parse for build-time canonical CSV ingestion
- MapLibre GL JS for optional map-based location selection
- Vitest, React Testing Library, and Playwright

The prototype stack decision is recorded in [`../decisions/0002-web-prototype-stack.md`](../decisions/0002-web-prototype-stack.md).

## Requirements

- Node.js 22.12 or newer; use a supported LTS release for normal development
- npm 10 or newer

The project was scaffolded with the official Vite React TypeScript template. Install packages from this directory:

```sh
cd app
npm install
```

## Development

```sh
npm run dev
```

The dev command first regenerates quiz data, then exposes Vite on all local interfaces. Open the Local URL printed by Vite in a desktop browser.

Available commands:

```sh
npm run generate:quiz
npm run generate:content
npm run generate
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
npm run preview
```

`dev`, `test`, `test:e2e`, and `build` automatically run quiz and content generation first. Editor-owned content lives in `../content/`; see [`../content/editor-guide.md`](../content/editor-guide.md). In a development session, Settings → **Load seeded demo** creates representative coverage and check-in history for fast review. The helper is excluded from production builds.

## Full and short-demo assessment modes

Full mode is the default and uses all 27 canonical initial-assessment questions.

During development only, open `/assessment?demo=short` or use the developer control on the assessment introduction. Short mode uses the first three baseline questions and first two current-balance questions so the vertical slice can be tested quickly. It omits the context question. Production builds ignore the short-mode query and do not render its control.

Short mode cannot satisfy the real coverage policy. After its honest “More information needed” state, development builds offer an explicit fixture adapter at `/results?fixture=profile`. Fixture labels are never persisted or presented as calculated output.

Use the always-visible **Reset prototype** control to remove the local prototype snapshot and return to Welcome.

## Canonical quiz generation

The executable authoring sources remain outside this app in:

- `../data/quiz/questions.csv`
- `../data/quiz/answer-options.csv`
- `../data/quiz/question-sets.csv`
- `../data/quiz/question-set-items.csv`
- `../data/quiz/controlled-values.csv`

Run:

```sh
npm run generate:quiz
```

The generator validates unique identifiers, controlled values, references, question versions, the 27 active ordered `initial_assessment` v1 items, boolean/integer fields, and answer associations. It writes `src/generated/initialAssessment.ts`, which has a generated-file notice and should not be edited manually.

The generator deliberately never reads `../data/quiz/answer-scores.csv`. No scoring weights are approved or included in the application bundle.

## Coverage and result behavior

The application implements `coverage-policy-0.1`:

- 22 submitted answers overall; explicit fallback answers count as submitted, while skips do not.
- 14 substantive usual-nature answers.
- 4 substantive current-balance answers.

Every canonical question is classified as substantive, fallback, skipped, or unanswered. Baseline, current, context, and category coverage remain separate. When coverage is insufficient, the application chooses the next useful repair question in canonical order, prioritizing baseline and then current requirements.

Coverage readiness is not a dosha result or medical confidence. The application does not read `answer-scores.csv`, calculate Vata/Pitta/Kapha weights, or assign a constitution/current-balance label. The typed outcome retains contributing IDs for audit tests; user-facing Results and My Balance expose the policy, counts, missing information, and the unapproved-scoring reason.

## Today recommendation selector

Today selects published content from `../content/recommendations/recommendations.json` with this precedence:

1. Major physical-change safety boundary
2. Travel or schedule-change routine anchor
3. Significant-life-event manageable priority
4. Missing current-answer coverage
5. Local morning or evening using the saved time zone
6. General fallback

Users can mark the daily focus complete, dismiss it, show another, open related reading, or start a linked check-in. Browser-local shown/completed/dismissed history avoids immediate repetition when alternatives exist. “Why this was chosen” names the exact catalog rationale and matched inputs. Today also loads weather/daylight for the saved regional coordinate and filters the editor-owned seasonal produce catalog by region, month, diet, allergies, and exclusions.

## Learn, Guided help, and check-ins

Learn lists nine editable Markdown articles, category/search filters, article detail routes, related reading, and an eight-term glossary. Guided help searches article titles, summaries, tags, bodies, glossary terms, and recommendation rationales. It is explicitly deterministic content search, not an LLM or chat simulation.

Questions can repair initial coverage or start a five- or seven-question repeatable current check-in. Check-ins reference canonical current questions, have their own start/completion dates and answers, and never overwrite baseline or initial current answers. My Balance summarizes both initial coverage and dated check-in history without dosha interpretation.

## Settings and local persistence

`/settings` edits preferred name, birth year, dietary pattern, explicit allergy/exclusion status, and details without removing assessment answers. Location and units reuse the location chooser and return to Settings.

Persisted state is version 7. It includes required profile readiness, normalized regional location, recommendation history, the active daily item, and dated check-ins. Restore logic validates the allow-listed shape and turns legacy skipped or unnormalized locations into incomplete setup. Corrupt or incompatible snapshots start safely with a visible notice. Settings displays storage status, exports the allow-listed snapshot as JSON, and confirms before clearing all local data.

## Testing

Unit and component tests cover generated data, coverage boundaries, result auditing, recommendation precedence and exclusions, answer behavior, settings, persistence validation/migration/failure, reload/resume, and navigation visibility.

```sh
npm test
```

Playwright covers the short fixture path, full 27-question coverage-ready path, settings recalculation, location privacy, and save/reload/resume at 390 × 844:

```sh
npx playwright install chromium
npm run test:e2e
```

## Continuous integration

GitHub Actions runs the app checks on every pull request and every push to `main`. The single Ubuntu job uses Node.js 22 with npm caching, verifies that generated files match their source data, then runs linting, type checking, unit and component tests, the production build, and Chromium Playwright tests.

Run the same sequence locally from `app/`:

```sh
npm ci
npm run generate
git diff --exit-code
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

## Static build

```sh
npm run build
npm run preview
```

The output is written to `dist/`. A deployment host must route unknown application paths back to `index.html` so direct loads such as `/assessment` or `/today` can reach React Router.

## Location prototype

Profile setup offers four paths:

- **Use my current location** calls `navigator.geolocation.getCurrentPosition()` once after an explicit click and permission prompt.
- **Choose on map** opens a MapLibre map with a draggable pin. Tapping the map also moves the pin.
- **Search manually instead** stores only the entered locality label; it does not call a geocoding service.
- A regional location is required before onboarding can continue.

After onboarding, **My Balance → Edit or remove location** reopens the same chooser; selecting Skip removes the saved area.

The application never calls `watchPosition()` and does not track movement. Device coordinates remain precise only in live page memory. The versioned local snapshot rounds coordinates to two decimal places and stores an accuracy floor of 1 km. Map previews currently load OpenFreeMap's public `bright` style through MapLibre; a production tile/style provider, request privacy policy, and locality-label service remain undecided.

## Test on an iPhone

Browser geolocation requires a secure context. `http://localhost` is treated specially on the development computer, but a phone opening a LAN address such as `http://192.168.1.20:5173` should not be expected to receive location access.

For full phone testing, use one of these HTTPS options:

1. Deploy the static prototype to an HTTPS preview host.
2. Run Vite with a locally trusted HTTPS certificate.
3. Expose the local server through a trusted HTTPS development tunnel.

The plain Vite `Network` URL remains useful for checking layout on the same trusted Wi-Fi network. Open the printed LAN address in Safari, allow Node through the computer firewall if needed, and use **Choose on map** when device location is unavailable. Do not open `localhost` on the phone; there it refers to the phone itself.

## Prototype limitations

- Account creation and sign-in are visual simulations. Email and password fields are transient; passwords are never persisted.
- Profile and assessment progress are stored only in the current browser with a validated, versioned allow-list. They are not secure account records and do not sync across devices.
- Dosha scoring remains unavailable because numerical weights and thresholds are blank and unapproved. Vata–Pitta labels exist only in the explicit development fixture adapter.
- Today guidance is deterministically selected provisional catalog copy. Completion history is a demo interaction, not adherence or outcome evidence.
- Guided help is literal catalog search, not a conversational assistant. There are no LLM, payment, or entitlement calls.
- There is no backend, database, CMS, analytics SDK, weather API, reverse-geocoding service, recipe system, notification system, or medical logic.
- Error, offline, account recovery, and production privacy behavior need dedicated implementation after product validation.
