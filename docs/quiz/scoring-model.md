# Scoring Model

> Status: Placeholder specification. No scoring logic is approved for production use.

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

