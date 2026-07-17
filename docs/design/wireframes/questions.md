# Check In Wireframe

> The user-facing destination is Check In while the stable route remains `/questions`.

```text
+--------------------------------------+
| Check In                             |
|                                      |
|                 ~                    |
|          PAST SEVEN DAYS             |
|                                      |
|       How have you felt lately?      |
|                                      |
|          [ Start check-in ]          |
|             More options             |
|                                      |
| LAST CHECK-IN                        |
| [✓] Jul 14                 [chat]  > |
|                                      |
| RECENT                               |
| [✓] Jul 6                          > |
| [✓] Jun 28                         > |
|                                      |
| [assessment] Initial assessment      |
|              Complete              > |
|                                      |
| [Today] [Check In] [Balance] [Learn]|
+--------------------------------------+
```

An unfinished record replaces the main prompt and action with “Continue where you left off,” its answered-count, and Continue. Quick check-in is the default; Detailed check-in appears only after More options is opened. Assessment coverage, full answers, methodology, and longer history remain in focused subviews or collapsed disclosures.
