# Chat Integration Architecture

## Current flow

```text
User question
→ resolve known context anchor
→ retrieve 3–5 approved local sources
→ build a purpose-limited profile summary
→ send a provider-independent ChatApiRequest
→ validate ChatApiResponse
→ render answer, known in-app citations, and follow-ups
```

`MockChatClient` remains the default and returns scripted context-aware responses. When local development explicitly selects `VITE_CHAT_MODE=api`, `ApiChatClient` posts the same provider-independent contract to Vite’s development-only `POST /api/chat` middleware. The middleware owns the OpenAI SDK, model configuration, grounding instructions, and API key; none of those provider details are included in browser code.

## Modules

| Module | Responsibility |
| --- | --- |
| `chat/types.ts` | Context, thread, message, citation, boundary, source, and safe-profile types |
| `chat/context.ts` | Resolve recommendation, article, seasonal-food, check-in, and general references |
| `chat/retrieval.ts` | Reuse deterministic catalog search and add anchored sources |
| `chat/profile.ts` | Select only profile fields relevant to the active anchor |
| `chat/api.ts` | Provider-independent request/response contracts and runtime response validation |
| `chat/client.ts` | Mock client, thin API transport, and environment-based factory |
| `chat/boundaries.ts` | Shared deterministic emergency, medication-change, and medical boundaries |
| `chat/request.ts` | Bounded runtime request validation and history normalization |
| `chat/returnTargets.ts` | Allowlisted source returns and safe contextual entry URLs |
| `prototype/state.ts` | Browser-local bounded thread persistence and sanitization |
| `server/chatApi.ts` | Local Vite middleware, OpenAI Responses request, strict output, and server-side citation filtering |

Screens never build provider prompts. They resolve a known anchor, retrieve sources, build the safe summary, and submit the typed contract.

## Context and privacy

References contain a type, stable ID, and resolved in-app source path. Resolvers read approved local catalogs and current prototype state. Missing or withdrawn references do not fall through to arbitrary strings.

Safe profile context may include a preferred name, dietary pattern, parsed food exclusions, broad regional display label, current recommendation title, or one recent check-in summary when relevant. It excludes birth year when no age-specific chat behavior exists, coordinates, storage metadata, complete assessment answers, complete profile snapshots, unrelated check-ins, and unrelated conversations.

## Retrieval and citations

The existing deterministic content search remains intact. Retrieval prioritizes the anchor’s known recommendation, article, seasonal-food, or check-in source IDs, then adds scored article, glossary, and recommendation matches. It returns at most five excerpts.

The mock client can cite only sources included in the request. In API mode, the server replaces model citations with the matching supplied source record and removes unknown or duplicate citations. The UI performs a second exact ID/type/href comparison before persisting a citation. Persisted citations are sanitized against current local catalogs. External web citations are not supported.

## Persistence

Storage schema version 9 adds `chatThreads`. Migration from version 8 initializes an empty collection. Sanitization validates:

- thread, message, and context IDs;
- supported context types and current catalog/check-in references;
- ISO dates and message roles/statuses;
- known citation IDs, types, and in-app paths;
- boundary values and follow-up length.

The newest 20 threads and newest 40 messages per thread are retained. A pending message restored after interruption becomes a retryable error. Raw provider payloads, prompts, hidden instructions, token counts, and profile snapshots are never stored.

## Deterministic product authority

Chat explains product results but does not select or modify them. Assessment coverage, future scoring, recommendation eligibility and selection, food safety filtering, readiness, weather, regional seasonality, and check-in completion remain deterministic application logic.

## Local model boundary

The current real-model path exists only inside `npm run dev`. The development launcher loads an existing `OPENAI_API_KEY` or the raw value from the ignored repository-root `apikey.txt`, then selects API chat automatically. Without a key it falls back to mock chat; `npm run dev:mock` always forces mock behavior and is the Playwright/CI startup path.

The API path uses the OpenAI Responses API with response storage disabled, low reasoning effort, no tools or web search, and strict structured output matching `ChatApiResponse`. Deterministic emergency, medication-change, and clear diagnosis/treatment messages return before any model call.

The route limits body size, context collections, history, messages, and excerpts. Browser-local messages remain the conversation source of record; no OpenAI conversation is created or retained by the app.

## Production server later

Before deploying real chat:

1. replace development middleware with a deployed server-owned endpoint;
2. independently rebuild or verify authorized context rather than trusting browser-supplied content;
3. enforce authentication, rate limits, abuse controls, retention, observability, and provider timeouts;
4. define operational secret management and provider data controls;
5. complete medical-safety, privacy, and editorial review.

The browser-side `ApiChatClient` should remain a thin transport. Provider selection, model names, API keys, prompts, and sampling controls do not belong in normal Settings.
