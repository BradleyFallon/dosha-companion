# Assessment Wireframes

## Scope

Core low-fidelity question interaction for approximately 390 px width. One question appears per screen. Selection does not auto-advance.

## Assessment introduction

```text
+--------------------------------------+
| < Back                               |
|                                      |
| Your Ayurvedic wellness profile      |
|                                      |
| About 7–10 minutes                   |
|                                      |
| Part 1 — Your usual nature           |
| Tendencies across adult life when    |
| you are generally well.              |
|                                      |
| Part 2 — Your current balance        |
| How you have felt in the past week.  |
|                                      |
| ✓ Progress is saved                  |
| ✓ You may skip questions             |
| ✓ You can return later               |
|                                      |
| Results are educational, not a       |
| medical diagnosis. [Learn more]      |
|                                      |
| [ Begin assessment                 ] |
+--------------------------------------+
```

## Baseline question — no selection

```text
+--------------------------------------+
| Save and exit              Saved ✓   |
|                                      |
| YOUR USUAL NATURE                    |
| Question 8 of 27                     |
| [==========------------------------] |
|                                      |
| Before major changes in weight,      |
| fitness, illness, or lifestyle, how  |
| would you describe your natural      |
| body frame?                          |
|                                      |
| [ What does “usual nature” mean? ]   |
|                                      |
| [ Naturally light, narrow, or      ] |
| [ fine-boned.                      ] |
|                                      |
| [ Naturally medium, proportionate, ] |
| [ or moderately muscular.          ] |
|                                      |
| [ Naturally broad, solid, or       ] |
| [ substantial.                     ] |
|                                      |
| [ Not sure / changed too much      ] |
|                                      |
| Skip for now                         |
|                                      |
| < Back             [ Continue      ] |
|                       disabled       |
+--------------------------------------+
```

## Baseline question — selected

```text
+--------------------------------------+
| Save and exit             Saving…    |
|                                      |
| YOUR USUAL NATURE                    |
| Question 8 of 27                     |
| [==========------------------------] |
|                                      |
| Before major changes in weight,      |
| fitness, illness, or lifestyle, how  |
| would you describe your natural      |
| body frame?                          |
|                                      |
| [ Naturally light, narrow, or      ] |
| [ fine-boned.                      ] |
|                                      |
| [✓ Naturally medium, proportionate,] |
| [  or moderately muscular.         ] |
|                                      |
| [ Naturally broad, solid, or       ] |
| [ substantial.                     ] |
|                                      |
| [ Not sure / changed too much      ] |
|                                      |
| Skip for now                         |
|                                      |
| < Back             [ Continue      ] |
+--------------------------------------+
```

## Optional help expanded

```text
+--------------------------------------+
| ...question remains visible...       |
|                                      |
| +----------------------------------+ |
| | Your usual nature              x| |
| |                                  | |
| | Think about most of your adult   | |
| | life when generally well—not     | |
| | only how you feel this week.     | |
| +----------------------------------+ |
|                                      |
| ...selection and controls remain...  |
+--------------------------------------+
```

## Section transition

```text
+--------------------------------------+
|                              Saved ✓ |
|                                      |
|            Part 1 complete           |
|                                      |
| Now let’s look at how you’ve been    |
| feeling recently.                    |
|                                      |
| Think only about the past seven      |
| days. These answers help us          |
| understand your current balance      |
| separately from your usual nature.   |
|                                      |
| No scores are shown between parts.   |
|                                      |
| [ Continue                         ] |
|                                      |
| Save and exit                        |
+--------------------------------------+
```

## Current-balance question

```text
+--------------------------------------+
| Save and exit              Saved ✓   |
|                                      |
| YOUR CURRENT BALANCE                 |
| Past seven days                      |
| Question 20 of 27                    |
| [==========================--------] |
|                                      |
| During the past seven days, how      |
| has your sleep been?                 |
|                                      |
| [ Light, interrupted, irregular,   ] |
| [ or difficult to settle into.     ] |
|                                      |
| [ Shortened or disturbed by warmth,] |
| [ mental activity, or drive.       ] |
|                                      |
| [ Heavy or prolonged, with         ] |
| [ difficulty waking.               ] |
|                                      |
| [ Comfortable and close to normal. ] |
| [ Not sure                         ] |
|                                      |
| Skip for now                         |
| < Back             [ Continue      ] |
+--------------------------------------+
```

## Offline save state

```text
+--------------------------------------+
| ! Offline — answer not saved yet     |
|                                      |
| ...question and selection...         |
|                                      |
| Your selection is still on this      |
| device. Reconnect to continue.       |
|                                      |
| < Back             [ Retry save    ] |
+--------------------------------------+
```

## Interaction notes

- The selected state uses a checkmark, border, and programmatic selection—not color alone.
- Continue is disabled until a substantive or fallback answer is selected.
- Skip for now bypasses selection and remains visually separate.
- Save and exit is a persistent text action, not an icon-only control.
- The footer may become sticky only if it does not obscure answers at 320 px or with zoom.

