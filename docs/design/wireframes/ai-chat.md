# AI Chat Wireframe

> Current demo replacement: no AI chat is implemented. The route provides deterministic Guided help that searches published local articles, glossary terms, and recommendation rationales and can repeat the active Today explanation.

## Subscriber entry

```text
+--------------------------------------+
| < Today             AI assistant     |
|                                      |
| Uses approved educational content    |
| and a limited summary of your        |
| profile. It cannot diagnose or       |
| replace professional care.           |
| [How your context is used]           |
|                                      |
| TRY ASKING                            |
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

## Free-user gate

```text
+--------------------------------------+
| AI assistant                         |
|                                      |
| Ask questions about your profile     |
| and approved learning content.       |
|                                      |
| Included with one paid subscription. |
| [ View subscription                ] |
|                                      |
| You can still use Today, Questions,  |
| My Balance, and Learn for free.      |
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

- This is not part of the first prototype’s required vertical slice.
- Source links refer to approved internal content, not invented citations.
- AI failure never blocks the rest of the product.
- Conversation history, usage limits, deletion, and detailed escalation behavior require later specification.
