# Quiz and Continuous Assessment Overview

## Purpose

The assessment system helps the app understand two separate aspects of a user:

1. **Baseline constitution** — the user’s relatively stable Ayurvedic nature.
2. **Current balance** — the user’s more changeable present condition.

The system begins with an initial assessment and continues through small batches of questions over time.

The assessment is intended for personalized wellness education. It is not a medical diagnostic tool and must not be presented as one.

## Product goals

The assessment system should:

* Produce a useful preliminary profile in approximately ten minutes.
* Separate long-term traits from recent experiences.
* Continue improving the profile after the initial result.
* Track changes in the user’s current balance.
* Avoid requiring users to repeatedly complete a long quiz.
* Explain why additional questions are useful.
* Support personalized content without collecting unnecessary information.
* Use deterministic, expert-approved scoring rather than LLM judgment.
* Allow scoring and questions to evolve through explicit versioning.

## Core concepts

### Baseline constitution

The baseline constitution represents the user’s relatively stable tendencies.

It is informed by questions about characteristics that have generally been true throughout adult life or during the user’s usual healthy state.

Examples include:

* Natural body frame
* Long-term weight tendency
* Skin and hair tendencies
* Typical appetite
* Typical digestion
* Natural sleep pattern
* Temperature preference
* Energy and endurance
* Learning and memory tendencies
* Typical response to stress
* Preference for routine or variety

Baseline answers should change rarely and should not expire quickly.

### Current balance

The current balance represents recent patterns that may change due to lifestyle, season, environment, stress, travel, routine, or other temporary factors.

It is informed by questions about a clearly stated recent period, such as today, the past three days, or the past week.

Examples include:

* Recent sleep quality
* Recent appetite
* Recent digestion
* Current energy
* Current mood
* Dryness, heat, heaviness, or other recent qualities
* Routine regularity
* Activity pattern
* Recent travel or schedule disruption

Current-balance answers lose influence over time and must not overwrite the baseline constitution.

### Context

Some questions improve the practicality of recommendations without changing either dosha calculation.

Examples include:

* Access to a kitchen today
* Available time for a practice
* Preferred form of guidance
* Whether the user is traveling
* Dietary preferences and exclusions

Context should affect content selection rather than dosha scoring.

## Assessment structure

The assessment system contains four question tiers.

### Tier 1: Initial assessment

The initial assessment provides enough information to generate the first useful profile.

Target:

* Approximately 20–30 questions
* Approximately ten minutes or less
* Mostly single-choice answers
* Focused on high-value baseline variables
* Includes a small set of recent current-balance questions

The initial assessment should be short enough to complete in one sitting, but the user’s progress must be saved if they leave.

The app should show an initial result only after the minimum required coverage has been reached.

### Tier 2: Early refinement

After the initial result, the app presents additional questions to improve confidence and resolve ambiguous areas.

These questions may:

* Distinguish between two closely scored doshas
* Add coverage to missing assessment categories
* Revisit uncertain answers
* Clarify whether a trait is lifelong or recent
* Improve food and lifestyle personalization

Early refinement questions should generally be prioritized during the first several days of use.

### Tier 3: Recurring current-balance check-ins

Recurring questions track recent changes.

These questions should be presented periodically based on:

* Time since the last answer
* Age of the current-balance profile
* Recent travel or seasonal change
* Missing information
* Changes reported by the user

The app should not ask the same current-balance question every day unless there is a clear reason.

### Tier 4: Optional deep dives

Users may voluntarily answer additional questions about areas they want to explore.

Possible categories include:

* Sleep
* Digestion
* Food
* Energy
* Stress
* Daily routine
* Seasonal balance
* Movement
* Mental and emotional tendencies

Optional deep dives may improve recommendations but should not be required to use the core app.

## Initial assessment composition

The first assessment should contain two distinct sections internally, even if the user experiences them as one continuous flow.

### Baseline section

Most initial questions should ask about long-term tendencies.

Recommended wording:

> Throughout most of your adult life, when you are generally well…

High-priority domains include:

* Body frame
* Weight tendency
* Skin tendency
* Hair tendency
* Appetite
* Digestion and bowel tendency
* Sleep
* Movement and speech
* Temperature preference
* Sweating
* Learning and memory
* Stress response
* Decision style
* Routine preference
* Physical endurance
* Response to delayed meals

### Current-balance section

A smaller group should ask about the recent past.

Recommended wording:

> Over the past seven days…

High-priority domains include:

* Sleep
* Appetite
* Digestion
* Energy
* Mood
* Body qualities
* Routine regularity
* Activity pattern

The initial result should clearly distinguish the output from these two sections.

## Question presentation

Questions should normally be displayed one at a time on mobile.

Each question may contain:

* Question text
* Time-window label
* Optional help text
* Answer choices
* Skip option
* Back button
* Progress indicator

Answer choices should use large touch targets and avoid requiring typing.

The user should be able to:

* Select an answer
* Change an answer
* Skip when permitted
* Leave and resume later
* Review completed answers when appropriate

## Question-writing rules

Every question must:

* Ask about one concept at a time.
* State or clearly imply the relevant time period.
* Distinguish long-term tendency from recent experience.
* Avoid medical diagnostic language.
* Avoid suggesting that one answer is healthier or more desirable.
* Use plain language.
* Avoid unnecessary Sanskrit terminology.
* Include balanced answer choices.
* Permit uncertainty when appropriate.
* Be reviewed by the Ayurvedic expert before publication.

Questions about mood or mental state must use general wellness language rather than clinical screening language.

## Question selection

Question selection should be deterministic.

The application should prioritize questions based on:

1. Required initial-assessment coverage
2. Missing high-value domains
3. Low-confidence or conflicting answers
4. Ambiguity between likely baseline types
5. Stale current-balance information
6. Recently changed context
7. User-selected deep-dive topics

The LLM must not independently decide which answers indicate a dosha or modify official scores.

The LLM may help explain a question, provided its explanation is grounded in approved content.

## Result availability

The app should provide a preliminary result once:

* The minimum number of required questions has been answered.
* Required assessment domains have adequate coverage.
* Each dosha has had a reasonable opportunity to receive evidence.
* No blocking scoring or data error exists.

A user should not have to answer every available question before receiving value.

Suggested user-facing profile stages:

* **Getting started** — insufficient information for a result
* **Preliminary** — enough information for an initial profile
* **Developing** — additional answers are refining the profile
* **Well established** — strong coverage and reasonable consistency

These labels represent assessment completeness and consistency, not medical certainty.

## Result structure

The initial result should contain:

### Your nature

The user’s baseline constitution, such as:

* Vata
* Pitta
* Kapha
* Vata–Pitta
* Vata–Kapha
* Pitta–Kapha
* Mixed or relatively balanced

### Your current balance

A separate recent-state description, such as:

* Vata currently elevated
* Pitta currently prominent
* Kapha currently elevated
* More than one dosha currently prominent
* Currently near baseline
* More recent answers needed

### Profile quality

The result may also show:

* Profile completeness
* Current-balance freshness
* Date last updated
* Suggested next question category

The app should avoid displaying unjustifiably precise percentages unless those values are clearly presented as internal estimates.

## Continuous Question Stream

After the initial assessment, the Questions screen should present a small queue of useful questions.

A typical daily visit may show:

> Three questions available

The user may answer:

* One question
* The suggested batch
* Additional available questions
* No questions that day

The system should not require daily participation.

The Question Stream should feel like gradual profile refinement, not an endless unfinished test.

## Repetition and answer freshness

Different answers require different update schedules.

### Baseline answers

Baseline questions:

* Remain valid indefinitely by default
* May be reviewed annually
* May be re-asked when answers conflict
* May be changed manually by the user
* Should record their original and latest answer dates

### Current-balance answers

Current-balance questions:

* Lose influence over time
* Become stale after a defined period
* May be asked again after the repeat interval
* Should specify whether they refer to today, three days, or seven days
* Should retain history even after their scoring influence expires

### Context answers

Context fields may remain valid for:

* One day
* One trip
* One season
* Until manually changed
* A defined number of days

The validity period must be specified in the question metadata.

## Conflicting answers

The app should not silently discard contradictory information.

When two baseline answers conflict, the application may:

* Reduce profile confidence
* Ask a clarification question
* Ask which answer better describes the user’s usual healthy state
* Show the user that the profile is still developing

Recent answers should not be treated as contradictions to lifelong answers when they measure different concepts.

For example:

* “I usually sleep deeply” may contribute to baseline.
* “My sleep was light this week” may contribute to current balance.

Both answers may be valid at the same time.

## Skipping and uncertainty

Users must be able to skip questions when:

* They do not understand the question
* None of the choices fit
* They prefer not to answer
* The information is sensitive
* They do not know their long-term tendency

Skipped answers should:

* Add no dosha weight
* Not be treated as a neutral or balanced answer
* Reduce coverage only for the relevant domain
* Remain eligible to be asked again later

Where useful, questions may offer:

* Not sure
* None of these
* Prefer not to answer

These options must have explicit scoring behavior.

## Versioning

The following must be versioned independently:

* Question wording
* Answer choices
* Dosha weights
* Question priority
* Question category
* Scoring algorithm
* Result-label thresholds

Each stored answer should retain:

* Question ID
* Question version
* Answer ID
* Answer timestamp
* Assessment type
* Scoring-model version used

Existing user results should remain reproducible after the assessment changes.

Major scoring changes may require:

* Recalculating existing profiles
* Asking affected questions again
* Showing that the profile methodology was updated

## Expert review

Every scored question must have:

* A documented purpose
* Defined dosha weights
* Defined assessment type
* Defined time window
* Defined expiration or repeat behavior
* Expert review status
* Version number

Questions must not be published until approved.

The expert should review the complete initial assessment as a system, not only each question independently.

## Safety boundaries

The assessment must not:

* Diagnose a medical condition
* Claim clinical certainty
* Recommend medication changes
* Prescribe herbs or supplements
* Replace professional medical care
* Interpret emergencies
* Use a dosha result to explain serious symptoms
* Suggest that a user caused an illness through imbalance

Results should be described as Ayurvedic wellness interpretations based on self-reported answers.

## Privacy principles

Assessment answers should be treated as sensitive wellness information.

The application should:

* Collect only fields with a defined use
* Let users view and correct their information
* Support deletion of assessment data
* Avoid sending raw answer history to the LLM
* Send the LLM only a limited structured profile summary
* Avoid exposing internal scoring details through logs or analytics
* Avoid using assessment information for advertising

## Related files

This document defines the overall system. More detailed specifications belong in:

* `docs/quiz/initial-assessment.md`

  * Exact initial-assessment requirements and domain coverage

* `docs/quiz/initial-question-bank.md`

  * Draft question wording and provisional mappings for expert review

* `docs/quiz/continuous-question-stream.md`

  * Queueing, repetition, and daily question behavior

* `docs/quiz/question-prioritization.md`

  * Selection priority and ambiguity-resolution rules

* `docs/quiz/scoring-model.md`

  * Dosha weights, normalization, time decay, confidence, and thresholds

* `docs/quiz/question-writing-guide.md`

  * Detailed editorial rules for question authors

* `docs/data/quiz-data-model.md`

  * Fields stored for questions, answers, and versions

* `data/quiz-questions/initial-questions.csv`

  * Canonical initial question records

* `data/quiz-questions/initial-answer-options.csv`

  * Canonical normalized answer-option records and expert-reviewed score weights

* `data/quiz-questions/refinement-questions.csv`

  * Early profile-refinement questions

* `data/quiz-questions/recurring-check-in-questions.csv`

  * Repeatable current-balance questions

## Open decisions

* What exact number of questions is required for the first result?
* Which domains are mandatory before showing a preliminary profile?
* How many current-balance questions belong in the initial assessment?
* How many questions should normally appear in the daily queue?
* Can users answer unlimited additional questions?
* How often should baseline questions be reviewed?
* What user-facing language should replace technical confidence percentages?
* Should users be able to review and edit all previous answers?
* Should a changed scoring model automatically recalculate historical profiles?
* At what age will the MVP permit account creation?
