---
id: ENG-002
title: Connect chat to the OpenAI API
type: implementation
status: done
priority: P1
area: engineering
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - app/src/chat/client.ts
  - app/server/chatApi.ts
  - app/vite.config.ts
  - docs/architecture/chat-integration.md
---

# Connect chat to the OpenAI API

## Why

The browser chat already constructs limited context, retrieves approved sources, and validates responses, but it can only use deterministic mock replies.

## Desired outcome

Local development can opt into a real grounded OpenAI conversation without exposing the API key to browser code, while mock mode remains reliable for ordinary development and CI.

## Scope

- A local-development Vite middleware endpoint for chat
- Official OpenAI server-side SDK and Responses API
- Strict structured output matching the existing chat response contract
- Shared deterministic safety boundaries and bounded request validation
- Grounding and citation filtering
- Automated tests with an injected model client
- Local setup documentation

## Out of scope

- Production hosting, authentication, rate limiting, streaming, analytics, or storage
- OpenAI conversation persistence
- Tools, web search, or a database

## Tasks

- [x] Add and configure the server-only OpenAI client.
- [x] Add bounded validation for the existing chat request.
- [x] Share deterministic boundary handling between mock and API paths.
- [x] Add strict structured output, grounding instructions, and citation filtering.
- [x] Normalize the newest user message so it is sent once.
- [x] Add handler and client tests without real API calls.
- [x] Document local API and mock setup.
- [x] Manually verify general and anchored conversations with a real project API key.
- [x] Confirm deterministic medication handling and valid citation navigation in the real local session.

## Acceptance criteria

- `VITE_CHAT_MODE=api` uses `POST /api/chat` during `npm run dev`.
- The API key is read only by Vite’s Node process.
- Model output is validated and cannot introduce unsupplied citations.
- Deterministic health boundaries do not spend a model request.
- Mock mode and CI do not require an OpenAI key.
- One real local conversation has been manually verified.

## Notes

### 2026-07-17

- Added a development-only Vite middleware route using the official OpenAI JavaScript SDK, `gpt-5-mini` by default, `store: false`, low reasoning effort, no tools, and strict JSON Schema output.
- Browser-local history remains the conversation source of record. The server sends only the current question, up to 12 history items, validated anchors, the purposefully limited profile context, and up to five approved source excerpts.
- The server returns deterministic emergency, medication-change, and diagnosis/treatment boundaries before checking API configuration or calling the model.
- Automated tests inject a fake Responses client; CI and Playwright remain in mock mode and make no OpenAI requests.
- A live local Vite middleware check confirmed `503` without a key, `405` for a non-POST request, and a `200` deterministic medication boundary without a model call.
- Loaded the ignored repository-root `apikey.txt` into the Vite process environment without printing, copying, or bundling it. Real general and Today-anchored requests both returned grounded `200` responses with filtered in-app citations.
- A headless browser completed the example-profile Today chat flow in API mode, rendered a visibly model-generated response, and opened its `/learn/provisional-guidance` citation successfully.
- The medication-change request returned the deterministic medication boundary with no citations, and secret scans confirmed that no key or server prompt entered the client build or Git changes.
- Follow-up: `npm run dev` now automatically reads the ignored repository-root `apikey.txt` and selects API mode when a key is available. `npm run dev:mock` is the explicit key-free path used by Playwright and CI.
