# AI Chat Wireframe

> Current prototype: contextual chat routes, browser-local history, grounded citations, and scripted mock responses are implemented. Deterministic catalog search supplies retrieval and fallback sources; no real LLM is connected.

## Contextual conversation

```text
+--------------------------------------+
| < Today          New conversation    |
|                                      |
| DISCUSSING                           |
| Today's focus                        |
| Keep your morning steady             |
| [Open original]                      |
|                                      |
| TRY ASKING                           |
| [ Explain my current balance       ] |
| [ Why was today’s guidance chosen? ] |
| [ Find an article about routine    ] |
|                                      |
| ------------------------------------ |
| You                                  |
| Why was today’s guidance chosen?     |
|                                      |
| Assistant                            |
| Based on your recent check-in and    |
| today’s approved guidance...         |
| [View source content]                |
|                                      |
| [ Ask a question...                ] |
| [ Send ]                             |
|                                      |
| If you may be experiencing an        |
| emergency, contact local emergency   |
| services.                            |
+--------------------------------------+
```

## General chat home

```text
+--------------------------------------+
| Ask Dosha Companion                  |
|                                      |
| Ask about Ayurveda, Today guidance,  |
| check-ins, or learning content.      |
|                                      |
| [ Ask a question...                ] |
| [ Start conversation               ] |
|                                      |
| Recent conversations                 |
| Morning consistency          Today   |
+--------------------------------------+
```

## Unavailable state

```text
+--------------------------------------+
| The assistant is temporarily         |
| unavailable.                         |
|                                      |
| Your profile, Today guidance, and    |
| learning content are still available.|
|                                      |
| [ Return to Today                  ] |
| [ Browse Learn                     ] |
+--------------------------------------+
```

## Safety/refusal state

```text
+--------------------------------------+
| I can’t assess symptoms, diagnose a  |
| condition, or recommend medication   |
| changes. A qualified clinician can   |
| help with that question.             |
|                                      |
| I can explain the product’s general  |
| educational content if that helps.   |
+--------------------------------------+
```

## Notes

- Source links refer to retrieved internal content, not invented or external citations.
- Chat failure never blocks the rest of the product.
- Conversation history is limited and browser-local.
- Provider integration, authentication, production usage limits, and detailed escalation review remain deferred.
