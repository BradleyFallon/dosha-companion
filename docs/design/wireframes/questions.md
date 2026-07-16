# Questions Wireframe

> Implemented demo update: Questions now combines initial coverage/repair with independent five- and seven-question current check-ins, incomplete-resume behavior, and a short dated history list. Check-ins do not overwrite the initial assessment.

```text
+--------------------------------------+
| ASSESSMENT COVERAGE                  |
| Questions                            |
|                                      |
| Another substantive answer would     |
| improve the most important gap.      |
|                                      |
| YOUR USUAL NATURE                    |
| 12 of 19 usable                      |
| 2 fallback · 3 skipped · 2 unanswered|
|                                      |
| YOUR CURRENT CHECK-IN                |
| 3 of 7 usable                        |
| 1 fallback · 1 skipped · 2 unanswered|
|                                      |
| [ How coverage was determined      ] |
| [ Answer next useful question      ] |
| [ Refinement unavailable           ] |
|                                      |
| [Today] [Questions] [Balance] [Learn]|
+--------------------------------------+
```

The next question is selected by the versioned coverage policy: unmet baseline requirement first, then current, then overall submission count. Within that group, skipped, unanswered, and fallback records are offered in canonical order. Refinement remains disabled until expert-reviewed questions exist.
