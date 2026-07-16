# Quiz Data Model

## Status

Working schema for implementation and expert review.

This document defines the canonical structure for assessment questions, answer choices, scoring, question sets, user answers, and calculated results.

Actual question records are stored as structured data. Markdown documents may explain or review questions, but they are not the canonical executable source.

## Design principles

* Question wording and scoring must be versioned separately.
* Every question and answer choice must have a stable permanent ID.
* Baseline constitution and current-balance scoring must remain separate.
* Context and feedback questions must be explicitly non-scoring.
* Question-set membership must not be embedded in the question itself.
* A question may belong to more than one question set.
* Historical user results must remain reproducible.
* No question or scoring rule may enter production without expert approval.
* Structured data should be editable in ordinary spreadsheet software.
* Production data must be validated before import or deployment.

# Authoring files

## `data/quiz/questions.csv`

Contains question wording and behavioral metadata.

### Columns

| Column               | Type     | Required | Description                                                    |
| -------------------- | -------- | -------: | -------------------------------------------------------------- |
| `question_id`        | String   |      Yes | Permanent human-readable question identifier                   |
| `question_version`   | Integer  |      Yes | Version of the wording and question metadata                   |
| `slug`               | String   |      Yes | Short unique machine-readable name                             |
| `text`               | Text     |      Yes | User-facing question                                           |
| `help_text`          | Text     |       No | Optional explanation shown to the user                         |
| `assessment_type`    | Enum     |      Yes | `baseline`, `current`, `context`, or `feedback`                |
| `category`           | Enum     |      Yes | Appetite, sleep, digestion, energy, routine, etc.              |
| `response_type`      | Enum     |      Yes | Initially `single_select`                                      |
| `time_window`        | Enum     |      Yes | Relevant period for the answer                                 |
| `expires_after_days` | Integer  |       No | Days before the answer stops affecting current calculations    |
| `repeat_after_days`  | Integer  |       No | Minimum period before the question may be offered again        |
| `skippable`          | Boolean  |      Yes | Whether the user can skip the question                         |
| `sensitive`          | Boolean  |      Yes | Whether special presentation or analytics handling is required |
| `randomize_answers`  | Boolean  |      Yes | Whether ordinary answer options may be shuffled                |
| `status`             | Enum     |      Yes | Editorial lifecycle status                                     |
| `expert_reviewer`    | String   |       No | Reviewer name or reviewer ID                                   |
| `approved_at`        | DateTime |       No | Date of expert approval                                        |
| `expert_notes`       | Text     |       No | Internal domain notes                                          |
| `created_at`         | DateTime |      Yes | Record creation timestamp                                      |
| `updated_at`         | DateTime |      Yes | Last modification timestamp                                    |

### Example

```csv
question_id,question_version,slug,text,help_text,assessment_type,category,response_type,time_window,expires_after_days,repeat_after_days,skippable,sensitive,randomize_answers,status,expert_reviewer,approved_at,expert_notes
q_baseline_appetite_001,1,usual-appetite,"When you are generally well, how would you describe your appetite?","Think about your usual adult pattern rather than only this week.",baseline,appetite,single_select,usual_adult_state,,,true,false,true,draft,,,"High-priority baseline appetite question"
```

## `data/quiz/answer-options.csv`

Contains the answer choices belonging to each question.

### Columns

| Column             | Type     | Required | Description                                                 |
| ------------------ | -------- | -------: | ----------------------------------------------------------- |
| `answer_id`        | String   |      Yes | Permanent answer-choice identifier                          |
| `question_id`      | String   |      Yes | Parent question                                             |
| `question_version` | Integer  |      Yes | Question version for which this wording is valid            |
| `answer_version`   | Integer  |      Yes | Version of the answer wording                               |
| `text`             | Text     |      Yes | User-facing answer text                                     |
| `default_order`    | Integer  |      Yes | Default display position                                    |
| `answer_kind`      | Enum     |      Yes | `ordinary`, `not_sure`, `none_fit`, `prefer_not`, or `skip` |
| `exclusive`        | Boolean  |      Yes | Whether selection excludes all other options                |
| `status`           | Enum     |      Yes | Editorial lifecycle status                                  |
| `expert_notes`     | Text     |       No | Internal notes                                              |
| `created_at`       | DateTime |      Yes | Record creation timestamp                                   |
| `updated_at`       | DateTime |      Yes | Last modification timestamp                                 |

### Example

```csv
answer_id,question_id,question_version,answer_version,text,default_order,answer_kind,exclusive,status,expert_notes
a_baseline_appetite_001_variable,q_baseline_appetite_001,1,1,"It is variable and can be unpredictable.",1,ordinary,true,draft,"Provisional Vata direction"
a_baseline_appetite_001_strong,q_baseline_appetite_001,1,1,"It is strong and arrives predictably.",2,ordinary,true,draft,"Provisional Pitta direction"
a_baseline_appetite_001_steady,q_baseline_appetite_001,1,1,"It is steady but not usually urgent.",3,ordinary,true,draft,"Provisional Kapha direction"
a_baseline_appetite_001_unsure,q_baseline_appetite_001,1,1,"I am not sure.",4,not_sure,true,draft,"No score"
```

## `data/quiz/answer-scores.csv`

Contains scoring separately from question and answer wording.

No production scores should be added until the Ayurvedic expert approves the weight scale and scoring model.

### Columns

| Column                  | Type     | Required | Description                           |
| ----------------------- | -------- | -------: | ------------------------------------- |
| `scoring_model_version` | String   |      Yes | Version of the complete scoring model |
| `answer_id`             | String   |      Yes | Answer choice being scored            |
| `score_target`          | Enum     |      Yes | `baseline`, `current`, or `none`      |
| `vata_weight`           | Decimal  |      Yes | Vata contribution                     |
| `pitta_weight`          | Decimal  |      Yes | Pitta contribution                    |
| `kapha_weight`          | Decimal  |      Yes | Kapha contribution                    |
| `reliability_weight`    | Decimal  |      Yes | Relative importance of this answer    |
| `rationale`             | Text     |      Yes | Expert explanation of the mapping     |
| `status`                | Enum     |      Yes | Approval status                       |
| `expert_reviewer`       | String   |       No | Scoring reviewer                      |
| `approved_at`           | DateTime |       No | Approval date                         |

### Example

```csv
scoring_model_version,answer_id,score_target,vata_weight,pitta_weight,kapha_weight,reliability_weight,rationale,status,expert_reviewer,approved_at
0.1-draft,a_baseline_appetite_001_variable,baseline,,,,,"Provisional mapping pending expert review",draft,,
0.1-draft,a_baseline_appetite_001_unsure,none,0,0,0,0,"Uncertain answers do not affect dosha scores",draft,,
```

### Scoring requirements

* `not_sure`, `none_fit`, `prefer_not`, and `skip` normally receive zero dosha weight.
* Zero-score answers are not equivalent to balanced answers.
* Baseline answers may only target `baseline`.
* Current answers may only target `current`.
* Context and feedback answers must target `none`.
* A scoring model must never silently combine baseline and current values.
* Every nonzero weight requires a written expert rationale.

## `data/quiz/question-sets.csv`

Defines collections of questions.

### Initial sets

* `initial_assessment`
* `early_refinement`
* `recurring_balance`
* `optional_deep_dive`

### Columns

| Column              | Type     | Required | Description                     |
| ------------------- | -------- | -------: | ------------------------------- |
| `question_set_id`   | String   |      Yes | Permanent set identifier        |
| `set_version`       | Integer  |      Yes | Version of the set composition  |
| `slug`              | String   |      Yes | Machine-readable name           |
| `label`             | String   |      Yes | Internal or user-facing label   |
| `description`       | Text     |      Yes | Purpose of the set              |
| `estimated_minutes` | Integer  |       No | Expected completion time        |
| `minimum_answered`  | Integer  |       No | Minimum scored answers required |
| `status`            | Enum     |      Yes | Set lifecycle status            |
| `created_at`        | DateTime |      Yes | Creation timestamp              |
| `updated_at`        | DateTime |      Yes | Modification timestamp          |

## `data/quiz/question-set-items.csv`

Connects questions to sets and defines their behavior within each set.

### Columns

| Column                      | Type    | Required | Description                                           |
| --------------------------- | ------- | -------: | ----------------------------------------------------- |
| `question_set_id`           | String  |      Yes | Parent question set                                   |
| `set_version`               | Integer |      Yes | Version of the set                                    |
| `question_id`               | String  |      Yes | Included question                                     |
| `question_version`          | Integer |      Yes | Required question version                             |
| `default_order`             | Integer |       No | Suggested order                                       |
| `priority`                  | Integer |      Yes | Selection priority                                    |
| `required_for_completion`   | Boolean |      Yes | Whether it is required to finish the set              |
| `required_for_result`       | Boolean |      Yes | Whether it contributes to the result-unlock threshold |
| `minimum_category_coverage` | Boolean |      Yes | Whether its category is mandatory                     |
| `active`                    | Boolean |      Yes | Whether the set currently offers the question         |

This separation allows the same question to appear in both the initial assessment and a later refinement set with different priority or required status.

## `data/quiz/controlled-values.csv`

Defines allowed enum values so spelling and terminology do not drift.

### Columns

| Column        | Description                           |
| ------------- | ------------------------------------- |
| `value_group` | Enum category                         |
| `value`       | Machine-readable value                |
| `label`       | Human-readable label                  |
| `description` | Definition                            |
| `active`      | Whether new records may use the value |

### Initial value groups

* `assessment_type`
* `question_category`
* `response_type`
* `time_window`
* `answer_kind`
* `editorial_status`
* `score_target`

# Controlled values

## Assessment types

| Value      | Meaning                                      |
| ---------- | -------------------------------------------- |
| `baseline` | Long-term constitution question              |
| `current`  | Time-bounded current-balance question        |
| `context`  | Recommendation context without dosha scoring |
| `feedback` | User feedback without dosha scoring          |

## Time windows

| Value               | Meaning                                |
| ------------------- | -------------------------------------- |
| `usual_adult_state` | Most of adult life when generally well |
| `past_7_days`       | Previous seven days                    |
| `past_3_days`       | Previous three days                    |
| `today`             | Current day                            |
| `current_context`   | Valid until the user’s context changes |
| `not_applicable`    | No time window                         |

## Editorial statuses

| Value           | Meaning                              |
| --------------- | ------------------------------------ |
| `draft`         | Being written                        |
| `expert_review` | Awaiting or undergoing domain review |
| `approved`      | Approved for use                     |
| `published`     | Available in production              |
| `retired`       | No longer offered to users           |

# Runtime data model

The authoring CSV files describe the assessment library. Production user data should be stored in application database tables.

## User answer record

Each submitted answer should store:

| Field                       | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `user_answer_id`            | Permanent answer-event identifier                            |
| `user_id`                   | User who answered                                            |
| `question_id`               | Stable question identity                                     |
| `question_version`          | Exact wording version shown                                  |
| `answer_id`                 | Selected answer                                              |
| `answer_version`            | Exact answer wording version shown                           |
| `question_set_id`           | Flow in which it was answered                                |
| `question_set_version`      | Exact set version                                            |
| `answered_at`               | Submission timestamp                                         |
| `valid_until`               | Date after which it no longer affects current scoring        |
| `scoring_model_version`     | Scoring rules applied                                        |
| `source`                    | Initial assessment, daily queue, deep dive, or manual review |
| `supersedes_user_answer_id` | Previous answer replaced by this answer                      |
| `deleted_at`                | Optional deletion marker                                     |

Answers should be append-only for auditability. Editing an answer should create a new record that supersedes the earlier one.

## Result snapshot

Each calculated profile should store:

| Field                   | Purpose                                 |
| ----------------------- | --------------------------------------- |
| `result_id`             | Permanent result identifier             |
| `user_id`               | Profile owner                           |
| `result_type`           | `baseline` or `current`                 |
| `scoring_model_version` | Model used                              |
| `calculated_at`         | Calculation timestamp                   |
| `vata_score`            | Normalized internal score               |
| `pitta_score`           | Normalized internal score               |
| `kapha_score`           | Normalized internal score               |
| `profile_label`         | User-facing result label                |
| `completeness`          | Assessment coverage                     |
| `consistency`           | Agreement among related answers         |
| `freshness`             | Recency of current information          |
| `status`                | Preliminary, developing, or established |

The contributing answer IDs should be connected through a separate result-contributions table rather than stored as one serialized field.

# Validation rules

The import process must reject records when:

* An ID is duplicated.
* A question references an unknown category.
* An answer references a missing question or wrong question version.
* A score references an unknown answer.
* A baseline question has current-balance scores.
* A current question has baseline scores.
* A context or feedback answer has nonzero dosha weights.
* An approved item lacks an expert reviewer or approval date.
* A published question has no active ordinary answer choices.
* A required question is not approved.
* A repeatable current question has no time window.
* An expiring question has no expiration period.
* Two active answers use the same ID.
* A set references a retired question.

# Canonical-source policy

* The CSV files are the canonical authoring source during the MVP.
* `initial-question-bank.md` is a readable review document.
* Question-bank Markdown should eventually be generated from the CSV data.
* Application code must not contain hardcoded question wording or scores.
* Production imports must record the source commit hash.
* All scoring changes require a new scoring-model version.
* Wording-only changes require a new question or answer version but not necessarily a new scoring-model version.
* Any semantic change to an answer requires expert scoring review.

# Migration from the current files

1. Create the six canonical files under `data/quiz/`.
2. Transfer the 27 draft questions into `questions.csv`.
3. Transfer each answer choice into `answer-options.csv`.
4. Add provisional rows to `answer-scores.csv`, leaving unapproved weights blank.
5. Define `initial_assessment` version 1 in `question-sets.csv`.
6. Add all 27 questions to `question-set-items.csv`.
7. Validate IDs, versions, categories, and relationships.
8. Review the resulting spreadsheet with the Ayurvedic expert.
9. Approve wording before approving numerical scoring.
10. Generate or update `initial-question-bank.md` from the canonical records.

# Decisions still requiring approval

* The numerical weight scale
* Relative reliability weights by domain
* Whether an answer may contribute to more than one dosha
* Result-label thresholds
* Required categories for preliminary-result unlock
* Current-answer decay function
* Profile completeness and consistency calculations
* Handling of major-life-change context
* Whether answer choices are randomized for every question or only selected questions

## What to decide now versus later

Finalize these now:

* File separation
* ID conventions
* Required columns
* Controlled enum values
* Versioning rules
* Approval states
* Baseline/current/context separation
* Runtime answer history behavior

Do **not** finalize these without expert review:

* Numerical dosha weights
* Relative importance of categories
* Single versus mixed-dosha thresholds
* Confidence formulas
* Decay formulas
* Interpretation language

