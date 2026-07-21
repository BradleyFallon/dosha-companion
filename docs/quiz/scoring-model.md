# Prototype Scoring Model

> Status: Implemented prototype for product evaluation. The result is educational and has not received clinical or expert validation.

## Implemented model

The application reads the explicit numerical metadata in `data/quiz/answer-scores.csv`. Runtime code never infers a direction from answer wording or rationale text.

Model `0.1-draft` uses these deliberately simple rules:

- An ordinary directional answer contributes one point to exactly one of Vata, Pitta, or Kapha.
- A current answer that explicitly means “close to usual” contributes zero elevation points but still counts as a scored recent response.
- Fallback, uncertain, and context-only answers contribute zero points and have zero scoring reliability.
- Baseline answers contribute only to usual nature; current answers contribute only to the recent pattern.
- Each scored point is multiplied by its explicit reliability. The prototype uses reliability `1` for scored ordinary answers and `0` for non-scoring answers.

## Coverage gate

The estimate is shown only after `coverage-policy-0.1` is ready:

- 22 submitted answers overall, where explicit fallback answers count as submitted and skips do not
- 14 substantive baseline answers
- 4 substantive current-balance answers

Coverage remains separate from the estimate. It describes how much usable self-reported information is present, not diagnostic confidence.

## Labels and mixed profiles

Baseline and current totals are ranked independently. The leading dosha is included, and another dosha is included when its total is at least 75% of the leader. Ties use the stable Vata, Pitta, Kapha order only for deterministic presentation; all tied directions still appear.

If scored current answers all indicate “close to usual,” the recent label is **No recent dosha elevation detected**. If a supplied recent record contains no scored answers, the label is **Not enough recent information**.

## Repeat check-ins

My Balance uses one recent source: the latest completed check-in when one exists, otherwise the current section of the initial assessment. Records are never merged. No time decay is implemented in this prototype.

## Recommendation boundary

The estimate is visible on Results, Today, and My Balance, but it is not used to select Today recommendations. Those continue to use the documented deterministic context and safety rules.

## Versioning and auditability

Every calculated result reports scoring model `0.1-draft` and rule `prototype-unit-dominance-0.1`. Generated quiz data retains each answer’s target, weights, reliability, and model version. Generation fails for missing rows, invalid ranges, multi-direction weights, section-target mismatches, or scoring fallback/context answers.

## Before production use

- Ayurvedic domain-expert review of every answer direction and the 75% mixed threshold
- Sensitivity and bias analysis
- Test profiles for single, mixed, balanced, conflicting, sparse, and stale cases
- A reviewed approach to confidence, time decay, and answer changes
- Plain-language safety review and validation of all result claims
