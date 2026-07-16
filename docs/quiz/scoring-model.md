# Scoring Model

> Status: Unapproved placeholder. No dosha scoring logic is implemented or approved.

## Limited-MVP implementation boundary

The application deliberately does not read `data/quiz/answer-scores.csv` because all numerical weight and reliability fields remain blank. It does not infer weights from the directional rationale text.

The limited MVP implements `coverage-policy-0.1-provisional` around this future scoring boundary:

- 22 submitted answers overall, where explicit fallback answers count as submitted and skips do not
- 14 substantive baseline answers
- 4 substantive current-balance answers
- Descriptive category coverage, with no category acting as a gate because canonical set items mark none as required

Coverage readiness means enough self-reported information is present for the draft workflow. It is not a dosha result, expert confidence, or clinical certainty. Normal result screens return an explicit unavailable-scoring state until this document, numerical weights, and thresholds are approved.

## Goals

- Estimate baseline constitution separately from current balance.
- Make results reproducible, explainable, and versioned.
- Express uncertainty rather than forcing a definitive type.
- Allow recent signals to expire without rewriting stable history.

## Answer weights

Each scored answer will define explicit Vata, Pitta, and Kapha weights. Context-only and feedback questions must be marked as non-scoring.

TODO: Define the weight scale, expert review method, and rules for multi-select answers.

## Score normalization

TODO: Define normalization across unequal category coverage, skipped answers, and questions with different weight ranges.

## Baseline and current-balance separation

Baseline answers contribute only to baseline scores. Time-bounded recent answers contribute only to current-balance scores. Recommendation context must not silently change either score.

## Confidence calculation

TODO: Define how completeness, category coverage, answer consistency, question reliability, and recency contribute to confidence.

## Time decay and expiration

TODO: Define which answers decay, their time windows, repeat intervals, and the behavior when current-balance data becomes stale. Baseline answers should not decay unless the expert-approved model explicitly requires it.

## Conflicting answers

TODO: Define whether conflicts lower confidence, trigger clarification questions, or are retained as valid mixed tendencies.

## Versioning and auditability

Every result must reference a scoring algorithm version and the versions of contributing questions. Model changes must be testable against approved example profiles and must not silently overwrite historical results.

## Validation before launch

- Expert review and sign-off
- Test cases for single, mixed, balanced, conflicting, sparse, and stale profiles
- Sensitivity analysis for individual answers
- Plain-language review of result claims
- Safety and bias review
