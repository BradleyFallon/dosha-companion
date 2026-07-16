# Onboarding Wireframes

## Scope

Low-fidelity mobile layouts for welcome, account entry, profile setup, and the handoff into assessment. Target viewport: approximately 390 px wide.

## Welcome

```text
+--------------------------------------+
|                                      |
|          DOSHA COMPANION             |
|                                      |
|  Understand your nature.             |
|  Track your balance.                 |
|  Know what supports you today.       |
|                                      |
|  Personalized Ayurvedic wellness     |
|  education, daily guidance, and      |
|  a profile that develops over time.  |
|                                      |
|  [ Create account                  ] |
|                                      |
|  [ Sign in                         ] |
|                                      |
|  Wellness education, not medical     |
|  care.  [Read the wellness boundary] |
+--------------------------------------+
```

## Create account

```text
+--------------------------------------+
| < Back                               |
|                                      |
| Create your account                  |
|                                      |
| Email                                |
| [ name@example.com                 ] |
|                                      |
| Password                             |
| [ •••••••••••                     ] |
| [ ] Show password                    |
|                                      |
| [ ] I accept the Terms and Privacy   |
|     Notice.                          |
| [ ] I understand this is wellness    |
|     education, not medical care.     |
|                                      |
| [ Continue                         ] |
|                                      |
| Already have an account? Sign in     |
+--------------------------------------+
```

## Profile setup — 1 of 3

```text
+--------------------------------------+
| < Back                    Step 1 of 3 |
| [==========------------------------] |
|                                      |
| Let’s personalize the experience     |
|                                      |
| Preferred name                       |
| [ Alex                             ] |
|                                      |
| Age band                             |
| [ Select age band                 v] |
|                                      |
| We use age bands for appropriate     |
| content and safety—not dosha points. |
|                                      |
| [ Continue                         ] |
+--------------------------------------+
```

## Profile setup — 2 of 3

```text
+--------------------------------------+
| < Back                    Step 2 of 3 |
| [====================--------------] |
|                                      |
| Where are you generally located?     |
|                                      |
| Country                              |
| [ United States                   v] |
|                                      |
| Region                               |
| [ California                      v] |
|                                      |
| City or postal prefix (optional)     |
| [                                  ] |
|                                      |
| Units                                |
| (•) US        ( ) Metric             |
|                                      |
| [ Continue                         ] |
+--------------------------------------+
```

## Profile setup — 3 of 3

```text
+--------------------------------------+
| < Back                    Step 3 of 3 |
| [==============================----] |
|                                      |
| Food preferences and exclusions     |
|                                      |
| Dietary pattern                     |
| [ Vegetarian                      v] |
|                                      |
| Allergies                           |
| [ + Add allergy                    ] |
| [ Tree nuts  x ]                     |
|                                      |
| Other exclusions (optional)         |
| [ + Add exclusion                  ] |
|                                      |
| Allergies prevent incompatible       |
| suggestions before AI is involved.  |
|                                      |
| [ Save and continue                ] |
+--------------------------------------+
```

## Notes and states

- Profile progress is saved between steps.
- Validation appears below the relevant field without clearing other values.
- Allergies require an explicit “none” or skip path so an empty field is not misread.
- Sign-in recovery, verification, and legal-copy details remain outside this first vertical slice.

