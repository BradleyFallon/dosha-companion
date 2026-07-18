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
| [===========-----------------------] |
|                                      |
| Let’s personalize the experience     |
|                                      |
| Preferred name                       |
| [ Alex                             ] |
|                                      |
| Year of birth                        |
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
| [======================------------] |
|                                      |
| Choose your general area             |
|                                      |
| [ Use my current location          ] |
| [ Choose on map                    ] |
|                                      |
| Search for your city                 |
| [ City or region                  ] |
|                                      |
| Only a roughly 10 km region is       |
| saved.                               |
+--------------------------------------+
```

## Profile setup — 3 of 3

```text
+--------------------------------------+
| < Back                    Step 3 of 3 |
| [==================================] |
|                                      |
| Food preferences and exclusions     |
|                                      |
| Dietary pattern                     |
| [ Vegetarian                      v] |
|                                      |
| Do you have food allergies?         |
| ( ) No        (•) Yes               |
| [ Tree nuts                       ] |
|                                      |
| Do you avoid any other foods?        |
| (•) No        ( ) Yes               |
|                                      |
| [ Save and continue                ] |
+--------------------------------------+
```

## Later location editing

After onboarding, Settings or a localized surface can link back to the same location controls with an allowlisted return destination.

```text
+--------------------------------------+
| < Today                              |
|                                      |
| Choose your general area             |
|                                      |
| [ Use my current location          ] |
| [ Choose on map                    ] |
|                                      |
| Search for your city                 |
| [ City or region                  ] |
|                                      |
| Only a roughly 10 km region is       |
| saved.                               |
+--------------------------------------+
```

## Notes and states

- Profile progress is saved between steps.
- Normal onboarding requires a regional location before the food-safety step and assessment.
- Later location edits reuse the same controls and return to the requesting surface.
- Validation appears below the relevant field without clearing other values.
- Device location is requested only after an explicit action and uses a single lookup, not continuous tracking.
- Exact coordinates may position the live pin, but persistence and downstream context use only a coarse area.
- Allergies require an explicit “none” or skip path so an empty field is not misread.
- Sign-in recovery, verification, and legal-copy details remain outside this first vertical slice.
