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

The active `MockChatClient` returns scripted context-aware responses. `ApiChatClient` defines the future `POST /api/chat` behavior but is inactive unless `VITE_CHAT_MODE=api` is explicitly selected. No provider key or provider-specific request is present in browser code.

## Modules

| Module | Responsibility |
| --- | --- |
| `chat/types.ts` | Context, thread, message, citation, boundary, source, and safe-profile types |
| `chat/context.ts` | Resolve recommendation, article, seasonal-food, check-in, and general references |
| `chat/retrieval.ts` | Reuse deterministic catalog search and add anchored sources |
| `chat/profile.ts` | Select only profile fields relevant to the active anchor |
| `chat/api.ts` | Provider-independent request/response contracts and runtime response validation |
| `chat/client.ts` | Mock client, future fetch client, and environment-based factory |
| `chat/returnTargets.ts` | Allowlisted source returns and safe contextual entry URLs |
| `prototype/state.ts` | Browser-local bounded thread persistence and sanitization |

Screens never build provider prompts. They resolve a known anchor, retrieve sources, build the safe summary, and submit the typed contract.

## Context and privacy

References contain a type, stable ID, and resolved in-app source path. Resolvers read approved local catalogs and current prototype state. Missing or withdrawn references do not fall through to arbitrary strings.

Safe profile context may include a preferred name, dietary pattern, parsed food exclusions, broad regional display label, current recommendation title, or one recent check-in summary when relevant. It excludes birth year when no age-specific chat behavior exists, coordinates, storage metadata, complete assessment answers, complete profile snapshots, unrelated check-ins, and unrelated conversations.

## Retrieval and citations

The existing deterministic content search remains intact. Retrieval prioritizes the anchor’s known recommendation, article, seasonal-food, or check-in source IDs, then adds scored article, glossary, and recommendation matches. It returns at most five excerpts.

The mock client can cite only sources included in the request. The UI performs a second exact ID/type/href comparison before persisting a citation. Persisted citations are sanitized against current local catalogs. External web citations are not supported.

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

## Connecting a real server later

Before enabling API mode:

1. implement a server-owned `/api/chat` endpoint;
2. keep provider credentials only on the server;
3. validate the request again and independently rebuild or verify authorized context;
4. enforce authentication, rate limits, abuse controls, retention, observability, and provider timeouts;
5. ground the model only in approved retrieved sources;
6. return the existing provider-independent response contract;
7. complete medical-safety and editorial review.

The browser-side `ApiChatClient` should remain a thin transport. Provider selection, model names, API keys, prompts, and sampling controls do not belong in normal Settings.
