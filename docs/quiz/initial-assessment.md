# Initial Assessment

## Purpose

The initial assessment collects enough information to produce:

* A preliminary baseline dosha profile
* An initial current-balance result
* A useful starting point for personalized daily guidance

The assessment should be useful without claiming medical or clinical certainty.

## Experience goal

The initial assessment should:

* Take approximately ten minutes or less
* Work comfortably on a mobile screen
* Use mostly single-choice questions
* Save progress automatically
* Allow users to leave and resume
* Produce value before the complete question bank is exhausted
* Clearly distinguish lifelong tendencies from recent experiences

## Target length

Current expert-review draft:

* 27 total questions
* 19 baseline questions
* 7 current-balance questions
* 1 unscored major-change context question
* Expected completion time of 7–10 minutes

This composition is preliminary and should be validated through expert review and usability testing. The draft question wording and provisional mappings are in `initial-question-bank.md`.

The initial assessment may contain between 20 and 30 questions, but it should not exceed ten minutes for a typical user.

## Assessment sections

The user may experience the assessment as one continuous flow, but questions should be classified internally into separate sections.

### Baseline constitution

Baseline questions describe traits that have generally been true throughout the user’s adult life or usual healthy state.

Suggested introduction:

> First, we’ll ask about tendencies that have generally been true for you over time. Think about your usual healthy state rather than how you feel only today.

### Current balance

Current-balance questions describe recent experiences.

Suggested introduction:

> Next, we’ll ask a few questions about how you have been feeling recently. These answers help us understand your current balance separately from your underlying nature.

## Baseline domain coverage

The initial assessment should cover multiple independent physical, physiological, and behavioral domains.

No single answer should determine a dosha result.

### Required baseline domains

| Domain                    | Target questions | Purpose                                                      |
| ------------------------- | ---------------: | ------------------------------------------------------------ |
| Body frame and build      |              1–2 | Captures long-term structural tendency                       |
| Weight tendency           |                1 | Distinguishes ease of gaining, maintaining, or losing weight |
| Skin tendency             |                1 | Captures dryness, heat, oiliness, softness, and thickness    |
| Appetite                  |                1 | Distinguishes variable, strong, or steady appetite           |
| Digestion                 |              1–2 | Captures irregularity, heat, speed, heaviness, or slowness   |
| Bowel tendency            |                1 | Adds digestive-pattern specificity                           |
| Sleep                     |                1 | Distinguishes light, moderate, or deep sleep tendencies      |
| Temperature tolerance     |                1 | Captures sensitivity to heat or cold                         |
| Energy pattern            |                1 | Distinguishes fluctuating, intense, or steady energy         |
| Endurance                 |                1 | Captures short-burst versus sustained stamina                |
| Movement or speech        |                1 | Adds information about pace and intensity                    |
| Learning and memory       |              1–2 | Captures speed of learning and retention                     |
| Stress response           |                1 | Captures worry, irritability, withdrawal, or inertia         |
| Decision style            |                1 | Adds behavioral differentiation                              |
| Routine preference        |                1 | Captures preference for variety, structure, or steadiness    |
| Response to delayed meals |                1 | Adds appetite and temperament information                    |

The initial question set does not need every possible Ayurvedic variable. It should prioritize variables that strongly differentiate the doshas and are understandable through self-report.

### Early-refinement domain

Hair tendency is supporting physical evidence, but it is not required in the initial 27-question assessment. Ask it during early refinement after the preliminary result rather than expanding the initial set.

## Current-balance domain coverage

The initial current-balance section should focus on recent, high-value signals.

### Required current domains

| Domain                    | Target questions | Time window |
| ------------------------- | ---------------: | ----------- |
| Sleep                     |                1 | Past 7 days |
| Appetite                  |                1 | Past 7 days |
| Digestion                 |                1 | Past 7 days |
| Energy                    |                1 | Past 7 days |
| Mood or stress response   |                1 | Past 7 days |
| Routine or body qualities |                1 | Past 7 days |

Possible recent body qualities include:

* Dryness
* Coldness
* Heat
* Irritability
* Heaviness
* Sluggishness
* Congestion
* Restlessness

These questions must use general wellness language rather than diagnostic symptom language.

## Question ordering

The assessment should begin with questions that are:

* Easy to understand
* Low sensitivity
* Clearly answerable
* Useful for scoring

Do not begin with questions about digestion, bowel habits, weight, or emotional state.

A recommended order is:

1. General body and energy tendencies
2. Temperature and skin
3. Appetite and digestion
4. Sleep
5. Movement, speech, and endurance
6. Learning, memory, and decision style
7. Stress response and routine
8. Recent current-balance questions

Questions should be mixed enough that the answer pattern is not obviously assigning the user to a particular dosha.

## Question format

Most questions should use three or four answer options.

Example structure:

> Throughout most of your adult life, how would you describe your appetite?

* It changes frequently and can be unpredictable.
* It is usually strong, and delayed meals affect me quickly.
* It is usually steady, and I can comfortably delay a meal.
* I am not sure.

Answer choices should:

* Describe observable experiences
* Avoid explicitly naming doshas
* Avoid implying that one answer is healthier
* Use comparable levels of detail
* Avoid combining multiple unrelated traits
* Include uncertainty where appropriate

## Time-window wording

Every scored question must identify whether it refers to a baseline or recent state.

### Baseline wording

Use wording such as:

* Throughout most of your adult life…
* When you are generally well…
* Under ordinary circumstances…
* Before recent major changes…

### Current-balance wording

Use wording such as:

* During the past seven days…
* Over the past three days…
* Today…

Avoid vague words such as “usually” when it is unclear whether the question is about baseline or current state.

## Progress display

The assessment should show:

* Current question number
* Approximate total
* Progress bar
* Save-and-exit behavior
* Clear indication when the current-balance section begins

Example:

> Question 8 of 27

The app should not display dosha scores while the user is answering questions.

## Save and resume behavior

Every answer should be saved immediately.

If the user leaves the assessment:

* Progress remains available
* The next visit resumes at the next unanswered high-priority question
* Previously answered questions remain editable
* No partial profile is shown until the minimum result threshold is met

## Skipping questions

Users should be able to skip most questions.

A skipped answer:

* Adds no dosha score
* Is not treated as a neutral answer
* Reduces coverage for that domain
* May be offered again later
* Does not block progress unless the domain is required for initial results

Suggested skip options:

* Not sure
* None of these fit
* Prefer not to answer
* Skip for now

These responses should be stored separately because they have different meanings.

## Result unlock requirements

A preliminary result should be available when all of the following are true:

* At least 80% of the initial assessment has been answered
* At least 14 baseline questions have valid scored answers
* At least 4 current-balance questions have valid scored answers
* Every required high-priority baseline domain has reasonable coverage
* No scoring error prevents calculation

The limited browser-local MVP implements these thresholds as `coverage-policy-0.1-provisional`. They remain product-testing thresholds and should be adjusted after expert review and user testing. They do not unlock a dosha label while scoring weights remain unapproved.

A user who skips too many required domains should receive a message such as:

> We need a little more information before we can prepare your initial profile.

The app should then present the highest-priority missing questions.

## Preliminary result

The first result should include:

### Your nature

A baseline profile label, such as:

* Vata
* Pitta
* Kapha
* Vata–Pitta
* Vata–Kapha
* Pitta–Kapha
* Mixed or relatively balanced

### Your current balance

A separate recent-state label, such as:

* Vata currently elevated
* Pitta currently elevated
* Kapha currently elevated
* Multiple doshas currently elevated
* Currently close to baseline
* More recent information needed

### Profile status

The initial result should be labeled:

> Preliminary profile

It should explain:

> Your profile will become more refined as you answer additional questions over time.

### Initial explanation

The result should provide:

* Short explanation of the baseline result
* Short explanation of the current balance
* Key qualities associated with the result
* One introductory learning article
* One initial daily guidance item
* Invitation to continue refining the profile

## Confidence and completeness

The initial assessment should measure profile quality based on:

* Domain coverage
* Number of valid answers
* Consistency among related answers
* Strength of score separation
* Amount of missing information

Suggested user-facing states:

* Getting started
* Preliminary
* Developing
* Well established

Do not describe these states as diagnostic confidence or medical certainty.

## Scoring requirements

The initial assessment must use a deterministic, versioned scoring model.

Each answer option must have:

* Vata weight
* Pitta weight
* Kapha weight
* Assessment type
* Domain
* Question version
* Expert approval status

Baseline and current-balance scores must be calculated separately.

The LLM must not:

* Assign answer weights
* Calculate official results
* Override official results
* Reinterpret a user’s constitution independently

Detailed formulas belong in `docs/quiz/scoring-model.md`.

## Handling conflicting information

Conflicting answers should not block the initial result unless the conflict makes the result unreliable.

The application may:

* Reduce profile completeness
* Prioritize a refinement question
* Ask whether one answer reflects recent change
* Ask which answer better reflects the user’s usual healthy state

For example:

* A user may report naturally deep sleep as a baseline trait.
* The same user may report light sleep during the past week.

These answers are not contradictory because they describe different time periods.

## Major life changes

The assessment should include an optional question asking whether the user’s current body or habits differ substantially from their usual state due to:

* Recent illness
* Medication
* Pregnancy or postpartum changes
* Major weight change
* Injury
* Significant stress
* Shift work
* Travel
* Another major life event

For the MVP, this answer should:

* Reduce reliance on current physical traits when estimating baseline
* Trigger clarification questions when needed
* Not invite medical interpretation
* Not ask for unnecessary clinical details

## Accessibility and mobile behavior

The assessment should:

* Work at widths of 320 pixels and above
* Use large tap targets
* Support keyboard navigation
* Support screen readers
* Avoid horizontal scrolling
* Avoid answer choices that rely only on color
* Keep help text concise
* Preserve the selected answer when navigating backward
* Keep controls visible above the mobile keyboard

Most assessment questions should not require text entry.

## Safety language

Before showing results, the app should state that:

* Results are based on self-reported information
* The profile is intended for Ayurvedic wellness education
* It is not a medical diagnosis
* It should not replace professional medical advice

The result screen should not use language such as:

* You have a disorder
* Your symptoms prove an imbalance
* This explains your medical condition
* You need treatment
* This recommendation will cure or prevent illness

## Analytics

The team may track:

* Assessment started
* Question answered
* Question skipped
* Assessment resumed
* Assessment completed
* Time to completion
* Drop-off question
* Result viewed
* Refinement question started

Analytics should not include raw sensitive answer text when aggregate event data is sufficient.

## Initial launch targets

Before launch:

* Every question has been reviewed by the Ayurvedic expert.
* Every answer has documented score weights.
* The assessment has been tested with at least 10–20 representative test profiles.
* Typical completion time is ten minutes or less.
* No individual question disproportionately controls the result.
* Results remain stable when low-value questions are changed.
* Missing and skipped answers are handled predictably.
* Baseline and current-balance results are clearly separated in the interface.

## Data location

The canonical authoring records are stored in the normalized CSV files under `data/quiz/`, including `questions.csv`, `answer-options.csv`, `answer-scores.csv`, and `question-set-items.csv`.

This document defines the assessment structure but should not duplicate the full question bank.

## Open decisions

* Is the current 27-question draft the correct launch composition?
* Is seven current-balance questions the correct launch target?
* Which baseline domains are mandatory before results unlock?
* Should users review all answers before submitting?
* Should the initial assessment reveal section labels?
* Should users be allowed to immediately answer refinement questions?
* How should “mixed or relatively balanced” be determined?
* How should major life changes affect baseline scoring?
* Should users be able to manually restart the initial assessment?
