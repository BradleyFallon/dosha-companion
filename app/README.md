# Dosha Companion web prototype

This directory contains a low-fidelity mobile-first prototype of the first product loop:

> Welcome → simulated account → profile setup → assessment → preliminary fixture result → Today

It is a usability artifact, not a production application. Authentication, scoring, recommendations, subscriptions, and AI are simulated.

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
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
npm run preview
```

`dev`, `test`, `test:e2e`, and `build` automatically run quiz generation first.

## Full and short-demo assessment modes

Full mode is the default and uses all 27 canonical initial-assessment questions.

During development only, open `/assessment?demo=short` or use the developer control on the assessment introduction. Short mode uses the first three baseline questions and first two current-balance questions so the vertical slice can be tested quickly. It omits the context question. Production builds ignore the short-mode query and do not render its control.

The “More information needed” result fixture is also development-only at `/results?coverage=missing` after a result has been reached.

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

## Testing

Unit and component tests cover generated data, ordering, answer selection/submission, Not sure and Skip behavior, the section transition, persistence boundaries, reload/resume, and navigation visibility.

```sh
npm test
```

Playwright covers the short-mode 390 × 844 vertical slice and save/reload/resume:

```sh
npx playwright install chromium
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
- **Skip for now** stores no coordinates or label and continues onboarding.

After onboarding, **My Balance → Edit or remove location** reopens the same chooser; selecting Skip removes the saved area.

The application never calls `watchPosition()` and does not track movement. Device coordinates remain precise only in live page memory. The versioned local snapshot rounds coordinates to two decimal places and stores an accuracy floor of 1 km. Map previews currently load OpenFreeMap's public `bright` style through MapLibre; a production tile/style provider, request privacy policy, and locality-label service remain undecided.

## Test on an iPhone

Browser geolocation requires a secure context. `http://localhost` is treated specially on the development computer, but a phone opening a LAN address such as `http://192.168.1.20:5173` should not be expected to receive location access.

For full phone testing, use one of these HTTPS options:

1. Deploy the static prototype to an HTTPS preview host.
2. Run Vite with a locally trusted HTTPS certificate.
3. Expose the local server through a trusted HTTPS development tunnel.

The plain Vite `Network` URL remains useful for checking layout and non-location flows on the same trusted Wi-Fi network. Open the printed LAN address in Safari, allow Node through the computer firewall if needed, and use **Choose on map** or **Skip for now**. Do not open `localhost` on the phone; there it refers to the phone itself.

## Prototype limitations

- Account creation and sign-in are visual simulations. Email and password fields are transient; passwords are never persisted.
- Profile and assessment progress are stored only in the current browser with a versioned allow-list. They are not secure account records and do not sync across devices.
- The Vata–Pitta result and “Vata is currently more prominent” state are static fixtures. Answers are not scored.
- Today guidance is safe placeholder copy selected by no recommendation engine and is not attributed to AI.
- The assistant and subscription state are static placeholders. There are no LLM, payment, or entitlement calls.
- There is no backend, database, CMS, analytics SDK, weather API, reverse-geocoding service, recipe system, notification system, or medical logic.
- Error, offline, account recovery, and production privacy behavior need dedicated implementation after product validation.
