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

## Profile setup — 1 of 2

```text
+--------------------------------------+
| < Back                    Step 1 of 2 |
| [=================-----------------] |
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

## Profile setup — 2 of 2

```text
+--------------------------------------+
| < Back                    Step 2 of 2 |
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

## Contextual location setup

Localized surfaces first explain the benefit and link here with an allowlisted return destination.

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
- Core onboarding does not ask for location; localized surfaces explain the benefit before linking to the contextual flow.
- Validation appears below the relevant field without clearing other values.
- Device location is requested only after an explicit action and uses a single lookup, not continuous tracking.
- Exact coordinates may position the live pin, but persistence and downstream context use only a coarse area.
- Allergies require an explicit “none” or skip path so an empty field is not misread.
- Sign-in recovery, verification, and legal-copy details remain outside this first vertical slice.
