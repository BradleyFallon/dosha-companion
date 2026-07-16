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
| Year of birth · optional             |
| [ YYYY                             ] |
|                                      |
| We use the year for age-appropriate  |
| content and do not need a full date. |
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
| Use your location                    |
|                                      |
| This helps adjust guidance for your  |
| local season, time, and climate.     |
|                                      |
| [ Use my current location          ] |
|                                      |
|                  or                  |
|                                      |
| [ Choose on map                    ] |
|                                      |
| We will not make your location       |
| public or track it continuously.     |
|                                      |
| Search manually instead              |
| Skip for now                         |
+--------------------------------------+
```

## Profile setup — location selected

```text
+--------------------------------------+
| < Back                    Step 2 of 3 |
| [====================--------------] |
|                                      |
| LOCATION SELECTED                    |
| Approximate device location          |
|                                      |
| [ map with movable pin             ] |
|                                      |
| Drag the pin or tap the map if this  |
| is not correct.                      |
|                                      |
| Units                                |
| (•) US        ( ) Metric             |
|                                      |
| [ Use this location                ] |
| [ Choose again                     ] |
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
- Device location is requested only after an explicit action and uses a single lookup, not continuous tracking.
- Exact coordinates may position the live pin, but persistence and downstream context use only a coarse area.
- Allergies require an explicit “none” or skip path so an empty field is not misread.
- Sign-in recovery, verification, and legal-copy details remain outside this first vertical slice.
