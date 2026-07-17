# Contextual Chat

## Product principle

Conversation extends an item the user is already viewing. Today guidance, learning articles, regional foods, completed check-ins, and selected My Balance domains expose explicit chat actions; the app does not turn every label, metric, or sentence into an assistant entry point.

The current implementation is a functional interface prototype backed by deterministic, context-aware mock responses. It does not call an LLM. Existing catalog search remains the retrieval and fallback layer so the interface, persistence, and safety behavior can be reviewed before a paid provider is connected.

## Entry points

| Source | Action | Anchor |
| --- | --- | --- |
| Today focus | Ask about this recommendation | Recommendation content, practical action, selection reasons, related article |
| Learning article | Ask about this article | Article summary, body, tags, related articles |
| Regional seasonal food | Item-specific chat icon | Food, saved region label, current month, dietary pattern, related article |
| Completed check-in | Talk through this check-in | Completion date plus selected question and answer labels |
| My Balance domain | Ask about this | Domain, short and full usual/recent responses, and neutral deterministic comparison |
| Today or Learn assistant cards | Ask Dosha Companion | General catalog-grounded conversation |

Chat does not change profile data, assessment answers, check-ins, recommendation status, or deterministic selection results.

Balance-domain context may say that reviewed pattern keys match, differ, or are unavailable. It must not explain a difference as better, worse, balanced, imbalanced, diagnostic, or a dosha score. Suggested questions focus on what changed, supportive observation, and the relationship to the person’s own usual response.

## Routes and returns

- `/assistant` redirects to `/chat`.
- `/chat` contains the general question entry and recent browser-local conversations.
- `/chat/new` validates a context reference, creates a thread, and replaces itself with `/chat/:threadId`.
- `/chat/:threadId` is the focused conversation surface.

New-chat links use semantic return keys for Today, Learn, Check In, and My Balance. Article and other source paths are resolved from known catalog IDs rather than trusted from query strings. Invalid references show a recoverable state.

## Focused layout

The bottom navigation is hidden for new and active chat routes. The chat surface uses the available viewport with:

1. a compact context bar containing Back, semantic context, truncated title, and Open original;
2. an optional expanded source summary and New conversation action;
3. one independently scrollable message region;
4. at most two keyboard-reachable suggestions before the first user message or after the newest completed response;
5. a quiet composer that stays above the safe-area inset.

“Discussing,” the source subtitle, and the full summary are not permanently displayed. Messages use spacing, typography, and subtle alignment instead of heavy speech bubbles. Assistant plain text preserves line breaks with `white-space: pre-wrap`; arbitrary HTML is not rendered.

Enter sends, Shift+Enter inserts a newline, blank messages cannot be sent, and messages are limited to 2,000 characters. Pending, failure, and retry states remain in the message timeline.

## Accessibility

- The message region is labeled “Conversation messages.”
- A separate polite live region announces pending, completed, and failed response state without rereading the entire transcript.
- The composer and icon-only Send action have explicit accessible names.
- The compact context toggle states whether it will show or hide the named source; Back and Open original are named icon links.
- Icons adjacent to visible labels are decorative and unfocusable.
- Route focus moves to the conversation context heading.

## Product boundary

The normal user-facing boundary is:

> Dosha Companion uses the app’s learning content and your saved profile context. It provides educational wellness information, not diagnosis or medical treatment.

The mock client detects a small, testable set of emergency, medication, and diagnosis/treatment phrases. These scripted boundaries are prototype behavior, not a comprehensive medical-safety classifier.
