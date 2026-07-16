# User Profile Fields

## Purpose

This document defines information stored about a user, how each field is used, whether it affects dosha calculations, and whether it may be included in LLM context.

The profile is divided into:

1. Account fields
2. Stable onboarding fields
3. Baseline assessment variables
4. Current-balance variables
5. Context and preference variables
6. Derived fields

The application should collect only information that has a defined product use.

## General principles

* Keep account creation and onboarding short.
* Do not ask assessment questions during account creation unless they are required for basic safety or content filtering.
* Keep baseline constitution separate from current balance.
* Stable characteristics may affect the baseline constitution.
* Recent experiences may affect current balance.
* Context fields may select recommendations without changing dosha scores.
* The LLM receives a small, structured profile summary rather than the complete questionnaire history.
* Every scored field must be reviewed by the Ayurvedic expert.
* Every scoring-model change must have a version number.

## Account fields

These fields operate the account. They do not affect dosha calculations.

| Field                      | Required | How it is used                                                   | Dosha effect | LLM access |
| -------------------------- | -------: | ---------------------------------------------------------------- | ------------ | ---------- |
| `user_id`                  |      Yes | Internal identifier connecting account records                   | None         | Never      |
| `email`                    |      Yes | Authentication, recovery, account communication                  | None         | Never      |
| `auth_provider`            |      Yes | Identifies password, magic-link, or external login method        | None         | Never      |
| `preferred_name`           |      Yes | Greeting, conversational personalization, account display        | None         | Yes        |
| `locale`                   |      Yes | Selects language, terminology, dates, and localized content      | None         | Yes        |
| `time_zone`                |      Yes | Determines the user’s current day and when daily content changes | None         | Yes        |
| `subscription_status`      |      Yes | Controls access to paid LLM chat and future premium content      | None         | Never      |
| `created_at`               |      Yes | Account administration and analytics                             | None         | Never      |
| `terms_version_accepted`   |      Yes | Records the terms and wellness disclosures accepted by the user  | None         | Never      |
| `privacy_version_accepted` |      Yes | Records the privacy notice accepted by the user                  | None         | Never      |

### Account-creation recommendation

The initial account form should require only:

* Email or authentication provider
* Preferred name
* Acceptance of terms and privacy disclosures

Locale and time zone should be detected automatically and remain editable.

## Stable onboarding fields

These fields do not usually need to be asked repeatedly. Most support personalization, safety filtering, and localization rather than dosha scoring.

| Field                   |    Required | Suggested type             | How it is used                                                    | Dosha effect   | LLM access             |
| ----------------------- | ----------: | -------------------------- | ----------------------------------------------------------------- | -------------- | ---------------------- |
| `age_band`              | Recommended | Enum                       | Adjusts content tone, life-stage relevance, and safety handling   | None initially | Summary only           |
| `location_profile`      |    Optional | Structured coarse location | Seasonal, time-of-day, climate, and measurement defaults           | None           | Generalized value only |
| `dietary_pattern`       | Recommended | Enum                       | Filters food suggestions and articles                             | None           | Yes                    |
| `food_allergies`        | Recommended | Multi-select               | Hard exclusion against unsafe food recommendations                | None           | Yes, as exclusions     |
| `food_intolerances`     |    Optional | Multi-select               | Filters food and recipe recommendations                           | None           | Yes, as exclusions     |
| `major_food_exclusions` |    Optional | Multi-select               | Respects ethical, religious, cultural, or personal restrictions   | None           | Yes                    |
| `units_preference`      |         Yes | Enum                       | Displays temperature, weight, quantity, and recipe units          | None           | Yes                    |

### `age_band`

Suggested values:

* 18–24
* 25–34
* 35–44
* 45–54
* 55–64
* 65+
* Prefer not to say

**Use in this app:**

* Choose age-appropriate language and examples.
* Avoid inappropriate recommendations for older or younger users.
* Support future life-stage content.
* Apply safety restrictions if certain content is not suitable for an age group.

Age should not directly add points to Vata, Pitta, or Kapha in the MVP. Age may affect Ayurvedic interpretation, but it should initially be treated as context rather than as proof of a constitution.

Use an age band instead of an exact birth date unless a future feature has a concrete need for the date.

### `sex_assigned_at_birth`

**MVP recommendation: do not collect during initial onboarding.**

It could eventually be an optional field when there is a specific expert-approved use, such as:

* Reproductive or menstrual-cycle content
* Pregnancy or postpartum safety exclusions
* Life-stage educational material
* Research expressly consented to by the user

It should not automatically change the dosha score, and it should not be sent to the LLM by default.

Collecting it without a defined use adds sensitivity and privacy risk without improving the initial experience.

### Location fields

Location is optional. The onboarding flow should prioritize a single permission-gated device lookup, then map selection, skipping, and manual locality search as a backup. It must not require typing country, region, and city fields.

The client may use exact coordinates briefly to position an adjustable map pin, but persistent records should retain only the coarse location or locality needed to derive:

* Current season
* General climate
* Current weather category
* Daylight or temperature context
* Regional produce suggestions
* Appropriate measurement units

Derived weather should use broad categories such as:

* Cold and dry
* Cold and damp
* Hot and dry
* Hot and humid
* Mild or temperate

Location and weather should influence content selection rather than baseline dosha scoring.

The structured profile should record the selection source (`device`, `map`, or `skipped`), coarse latitude and longitude when applicable, generalized accuracy, time zone, units, and an optional locality label. Do not request continuous location tracking. Let users edit or remove location later, and do not send exact coordinates to the LLM.

### Dietary fields

Suggested dietary patterns:

* Omnivore
* Vegetarian
* Vegan
* Pescatarian
* Other
* No preference

These fields are used to filter recommendations. They do not determine a dosha.

Allergies should function as hard exclusions. For example, a nut allergy must prevent retrieval of any recommendation containing nuts before the content reaches the LLM.

## Baseline constitution assessment variables

These fields are collected through the Question Stream, not the signup form.

Questions should refer to the user’s long-term or generally healthy state. Suggested wording includes:

> Throughout most of your adult life, when you are generally well…

Prakriti is traditionally treated as relatively stable, while temporary conditions can obscure a person’s baseline characteristics. The application should therefore distinguish long-term tendency from recent experience.

### High-priority baseline variables

| Variable                      | How it is used                                                                                  | Initial priority | Baseline effect | Current effect |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ---------------: | --------------: | -------------: |
| `body_frame_trait`            | Distinguishes naturally light, medium, or broad structural tendencies                           |             High |          Strong |           None |
| `weight_change_tendency`      | Captures whether weight is naturally difficult to maintain, relatively stable, or easily gained |             High |          Strong |           None |
| `skin_tendency`               | Captures long-term dry, warm/reactive, oily, cool, soft, or thick qualities                     |             High |          Strong |           None |
| `hair_tendency`               | Adds information about dryness, fineness, oiliness, thickness, and early graying tendencies     |           Medium |        Moderate |           None |
| `appetite_trait`              | Distinguishes variable, strong, or slower and steadier appetite patterns                        |             High |          Strong |           None |
| `digestion_trait`             | Captures long-term tendencies toward irregularity, heat, looseness, heaviness, or slowness      |             High |          Strong |           None |
| `bowel_tendency`              | Adds specificity to the digestive profile                                                       |             High |          Strong |           None |
| `sleep_trait`                 | Distinguishes light or interrupted, moderate, and deep or prolonged sleep tendencies            |             High |          Strong |           None |
| `movement_pace_trait`         | Captures quick, intense, or steady movement patterns                                            |           Medium |        Moderate |           None |
| `speech_trait`                | Captures quick, focused, forceful, slow, or measured communication patterns                     |           Medium |        Moderate |           None |
| `temperature_tolerance_trait` | Captures long-term sensitivity to cold, heat, dryness, or dampness                              |             High |        Moderate |           None |
| `sweating_trait`              | Adds information about heat and moisture tendencies                                             |           Medium |        Moderate |           None |
| `physical_endurance_trait`    | Distinguishes short bursts, moderate endurance, or sustained stamina                            |             High |        Moderate |           None |
| `learning_memory_trait`       | Captures speed of learning and durability of recall                                             |           Medium |        Moderate |           None |
| `stress_response_trait`       | Captures tendencies toward worry, irritability, withdrawal, or inertia                          |             High |        Moderate |           None |
| `decision_style_trait`        | Adds behavioral differentiation among quick-changing, decisive, and deliberate tendencies       |           Medium |        Moderate |           None |
| `routine_preference_trait`    | Captures preference for variety, goals and structure, or familiarity and steadiness             |             High |        Moderate |           None |
| `meal_delay_response_trait`   | Captures the user’s typical reaction when a meal is delayed                                     |             High |        Moderate |           None |

### How baseline fields should be used

Baseline fields may be used to:

* Calculate internal Vata, Pitta, and Kapha constitution scores.
* Determine whether a profile is predominantly single-dosha, dual-dosha, or mixed.
* Select foundational learning material.
* Explain the user’s durable tendencies.
* Compare the current state against the person’s normal baseline.
* Give context to the LLM when answering questions about the user’s constitution.

The app should not treat any single answer as decisive. Each result should come from multiple independent domains.

### Avoid exact current weight as a primary baseline variable

The official CCRAS procedure notes that present weight can be confounded by illness or major life changes and may not reflect a person’s earlier healthy state.

For the consumer MVP, prefer questions such as:

* Have you generally gained weight easily?
* Has your natural build usually been light, medium, or broad?
* Has your body shape changed substantially because of illness, medication, pregnancy, or another major event?

Exact weight and BMI are not necessary for the first assessment.

## Early refinement variables

These can appear after the user receives an initial result.

| Variable                | How it is used                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `usual_food_quantity`   | Clarifies appetite and digestive tendencies                                        |
| `eating_speed`          | Adds information about pace, intensity, and steadiness                             |
| `thirst_tendency`       | Adds context about heat, dryness, and fluid tendencies                             |
| `taste_preferences`     | Supports future food-content selection; should have limited scoring weight         |
| `voice_characteristics` | Refines physical and behavioral assessment                                         |
| `social_style`          | Adds lower-priority behavioral context                                             |
| `competitiveness_trait` | May refine Pitta-related interpretation but can be culturally biased               |
| `adaptation_to_change`  | Distinguishes flexibility, stress under change, and resistance to change           |
| `healthy_state_history` | Helps detect whether current physical traits differ from the user’s usual baseline |

Psychological and social traits should generally receive less scoring weight than stronger physical and physiological domains because wording and cultural context can substantially affect answers.

## Current-balance variables

These questions describe recent experiences. They must not overwrite the baseline constitution.

Each question should specify a time window, such as:

* Today
* During the past three days
* During the past seven days

| Variable                         | How it is used                                                                                    | Suggested lifetime |
| -------------------------------- | ------------------------------------------------------------------------------------------------- | -----------------: |
| `sleep_last_7d`                  | Detects recent restlessness, shortened sleep, oversleeping, or difficulty waking                  |          7–14 days |
| `appetite_last_7d`               | Detects recent variability, excessive sharpness, dullness, or heaviness                           |          7–14 days |
| `digestion_last_7d`              | Detects recent gas, constipation, heat, reflux-like discomfort, looseness, heaviness, or slowness |          7–14 days |
| `energy_last_7d`                 | Detects scattered, driven, depleted, or sluggish energy                                           |          7–14 days |
| `mood_last_7d`                   | Supports non-diagnostic wellness guidance related to worry, irritability, dullness, or motivation |          7–14 days |
| `body_qualities_last_7d`         | Detects prominent dryness, coldness, heat, redness, heaviness, moisture, or congestion            |          7–14 days |
| `routine_regularity_last_7d`     | Measures whether the user’s recent schedule has been irregular, overly intense, or inactive       |          7–14 days |
| `activity_pattern_last_7d`       | Detects overextension, overexertion, or inactivity                                                |          7–14 days |
| `stress_level_last_7d`           | Adjusts the relevance of calming, cooling, or activating content                                  |          7–14 days |
| `travel_status`                  | Detects schedule, climate, meal, and time-zone disruption                                         |           3–7 days |
| `recent_illness_or_major_change` | Reduces confidence that current physical answers represent baseline                               |     Until resolved |

### How current-balance fields should be used

Current fields may be used to:

* Calculate separate current Vata, Pitta, and Kapha loads.
* Identify the largest deviation from baseline.
* Select the daily guidance topic.
* Determine when the current profile has become stale.
* Decide which follow-up questions to ask.
* Explain why a particular article or practice was selected.
* Provide a concise, recent-state summary to the LLM.

Recent answers should lose weight over time. An answer from six months ago should not determine today’s current balance.

## Context and recommendation-preference fields

These fields improve practicality without changing the dosha profile.

| Field                           | How it is used                                                           | Dosha effect   |
| ------------------------------- | ------------------------------------------------------------------------ | -------------- |
| `season`                        | Selects seasonally relevant guidance                                     | None           |
| `weather_band`                  | Selects guidance appropriate to current heat, cold, dryness, or humidity | None initially |
| `kitchen_access_today`          | Avoids suggesting cooking when the user cannot cook                      | None           |
| `time_available_today`          | Selects a five-minute, fifteen-minute, or longer practice                | None           |
| `preferred_guidance_mode`       | Chooses among food, routine, reflection, movement, or meditation         | None           |
| `current_location_mode`         | Distinguishes home, traveling, or temporarily relocated                  | None           |
| `work_schedule_pattern`         | Supports guidance around conventional, irregular, or overnight schedules | None           |
| `content_difficulty_preference` | Chooses simple introductory guidance or deeper educational material      | None           |
| `content_feedback`              | Improves future recommendations based on relevance and usefulness        | None           |

### Weather and season

Ayurvedic educational materials place importance on daily and seasonal routine. Weather and season are therefore useful recommendation signals, but they should initially select content rather than directly manipulate the user’s official constitution score.

For example:

* Cold and dry weather may increase the priority of approved warming or grounding content.
* Hot weather may increase the priority of approved cooling content.
* Cold and damp conditions may increase the priority of approved movement or lightness-oriented content.

These are recommendation rules, not medical conclusions.

## Derived fields

These fields are calculated by the application.

| Field                       | How it is used                                                  | LLM access              |
| --------------------------- | --------------------------------------------------------------- | ----------------------- |
| `baseline_vata_score`       | Internal constitution calculation                               | Summary only            |
| `baseline_pitta_score`      | Internal constitution calculation                               | Summary only            |
| `baseline_kapha_score`      | Internal constitution calculation                               | Summary only            |
| `prakriti_label`            | User-facing baseline constitution                               | Yes                     |
| `current_vata_load`         | Internal current-state calculation                              | Summary only            |
| `current_pitta_load`        | Internal current-state calculation                              | Summary only            |
| `current_kapha_load`        | Internal current-state calculation                              | Summary only            |
| `current_balance_label`     | User-facing description of current state                        | Yes                     |
| `top_current_signals`       | Explains which recent answers most influenced current guidance  | Yes                     |
| `baseline_confidence`       | Indicates assessment coverage and consistency                   | Yes                     |
| `current_balance_freshness` | Indicates whether the user should answer new check-in questions | Yes                     |
| `assessment_version`        | Makes results reproducible after scoring changes                | Never                   |
| `content_exclusion_flags`   | Prevents unsafe or incompatible recommendations                 | Yes, as exclusions      |
| `recommendation_history`    | Prevents repetitive daily content                               | No raw history          |
| `content_interest_profile`  | Prioritizes relevant learning topics                            | Summary only            |
| `llm_profile_summary`       | Whitelisted summary sent to the AI assistant                    | This is the LLM payload |

## LLM profile summary

The LLM should not receive:

* Email address
* Exact location
* Authentication information
* Raw questionnaire history
* Every past current-balance answer
* Internal scoring details
* Billing information
* Fields unrelated to the current conversation

A suitable payload may resemble:

```json
{
  "preferred_name": "Example",
  "age_band": "35-44",
  "dietary_pattern": "vegetarian",
  "food_exclusions": ["tree_nuts"],
  "baseline_profile": "Vata-Pitta",
  "current_balance": "Vata currently elevated",
  "top_current_signals": [
    "irregular sleep",
    "variable appetite",
    "dryness"
  ],
  "season": "autumn",
  "weather_band": "cool-dry",
  "available_time": "15_minutes"
}
```

## Fields to defer or avoid in the MVP

| Field                           | Recommendation                                  | Reason                                                                      |
| ------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Exact birth date                | Defer                                           | Age band provides most immediate value with less identity risk              |
| Exact GPS location              | Avoid                                           | City or regional climate is sufficient                                      |
| Exact weight and BMI            | Defer                                           | Sensitive, changeable, and potentially misleading for baseline constitution |
| Face or body photographs        | Avoid                                           | Adds bias, consent, storage, and privacy concerns                           |
| Skin-complexion classification  | Avoid                                           | Difficult to standardize and may overlap with ethnicity                     |
| Pulse analysis                  | Defer                                           | Requires expertise, hardware, or clinically appropriate methodology         |
| Tongue or nail photographs      | Defer                                           | Encourages medical interpretation and introduces image privacy issues       |
| Medication list                 | Avoid in MVP                                    | Creates high-stakes interaction and safety obligations                      |
| Diagnosed medical conditions    | Avoid unless required for a defined safety rule | Moves the app toward clinical decision support                              |
| Pregnancy and postpartum status | Defer                                           | Requires dedicated, high-stakes safety logic                                |
| Free-text symptom diary         | Defer                                           | Difficult to score safely and invites diagnosis-like AI behavior            |
| Supplement and herb usage       | Defer                                           | Requires interaction and toxicity safeguards                                |
| Race or ethnicity               | Avoid in MVP                                    | No necessary launch use has been established                                |
| Family medical history          | Avoid in MVP                                    | Sensitive and unnecessary for the core wellness experience                  |

## Recommended MVP onboarding form

Collect immediately after account creation:

1. Preferred name
2. Age band
3. Optional location through device, map, manual locality backup, or skip
4. Preferred measurement units
5. Dietary pattern
6. Food allergies
7. Food intolerances or exclusions

Do not collect sex assigned at birth, weight, height, medical conditions, medication use, or detailed symptoms during MVP onboarding.

After onboarding, begin the initial assessment with the high-priority baseline fields and a small set of current-balance questions.

## Recommended field-use rule

Every proposed field must answer all of the following before being added:

1. What user-facing feature uses it?
2. Does it affect baseline, current balance, content selection, safety filtering, or presentation?
3. Has the Ayurvedic expert approved that use?
4. Can the same feature work with less sensitive information?
5. Does the LLM need the field, or can the application process it before AI involvement?
6. How long should the value remain valid?
7. Can the user view, edit, and delete it?
