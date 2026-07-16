# Initial Assessment Expert Review Guide

## Purpose

This guide prepares the 27-question initial assessment for Ayurvedic expert review. The goal is to validate concepts, placement, wording, answer directions, relative reliability, and initial-set membership before designing numerical scoring.

The review must not assign numerical dosha weights, reliability weights, score thresholds, confidence formulas, or decay formulas.

## Source hierarchy and review order

Review these files in order:

1. `docs/quiz/initial-question-bank.md`
2. `data/quiz/questions.csv`
3. `data/quiz/answer-options.csv`
4. `data/quiz/answer-scores.csv`

The Markdown question bank is easier to read and shows the intent and context of each draft question. The CSV files under `data/quiz/` are the canonical executable source. Record approved changes in the CSV files, then bring the Markdown review document back into alignment or regenerate it from the structured data.

## Review sequence for every question

Review each question and all its answers together, in this order.

### 1. Concept validity

Does the question measure something meaningfully associated with Ayurvedic constitution or current balance?

- Identify the Ayurvedic concept or quality being assessed.
- Note whether the concept is strong evidence, supporting evidence, or unsuitable for self-report.
- Mark concepts that require a source, definition, or narrower claim.

### 2. Assessment placement

Should the question be classified as:

- Baseline constitution
- Current balance
- Context
- Early refinement
- Optional deep dive
- Excluded

Confirm that baseline questions describe a durable tendency and current questions state an appropriate recent time window. Context questions must not affect dosha scores.

### 3. Wording quality

Is the question clear, neutral, understandable, and answerable through self-report?

Check that it:

- Asks about one concept at a time
- Uses the intended time window
- Avoids diagnostic or clinical language
- Avoids signaling a preferred or healthier answer
- Avoids unnecessary Sanskrit terminology
- Works across reading levels and common cultural contexts
- Provides an appropriate uncertainty or skip path

### 4. Answer validity

For every answer, decide whether it appropriately represents:

- A Vata direction
- A Pitta direction
- A Kapha direction
- No current elevation
- Neutral or uncertain
- Non-scoring context
- An invalid or misleading option

Review the qualitative hypothesis in `answer-scores.csv`. Correct its `rationale` when necessary, but do not enter numerical weights.

### 5. Mixed mappings

Could an answer meaningfully contribute to more than one dosha rather than mapping exclusively to one?

Record the possible mixed direction and reasoning in the scoring row’s `rationale`. Do not express the relationship numerically during this review.

### 6. Importance

Classify the question’s expected reliability as:

- High: strong, understandable evidence with limited confounding
- Medium: useful supporting evidence or moderately confounded
- Low: weak, culturally contingent, highly variable, or difficult to self-report

Record the classification and explanation in the question’s `expert_notes`. Leave `reliability_weight` blank.

### 7. Redundancy

Does the question duplicate or strongly overlap another question?

- Identify the overlapping question IDs.
- Recommend keeping one, combining them, moving one to refinement, or retaining both for a stated reason.
- Consider whether repeated concepts add independent evidence or merely repeat the same signal.

### 8. Confounders

Could the answer be made unreliable by:

- Age or life stage
- Culture or learned behavior
- Climate or season
- Illness or injury
- Medication
- Pregnancy or postpartum change
- Diet or lifestyle change
- Occupation, training, or shift work
- Recent travel or significant stress
- Ambiguous interpretation

Record relevant confounders and any required clarification, exclusion, or safety handling in `expert_notes`.

### 9. Initial-set decision

Choose one outcome:

- Keep in the initial 27
- Move to early refinement
- Move to another question set
- Remove

Record the recommendation in `expert_notes`. Update `question-set-items.csv` only after the complete assessment has been reviewed as a system.

## Recording the first review

### `data/quiz/questions.csv`

Update:

- `expert_notes` with concept, placement, reliability, redundancy, confounders, and set recommendation
- `status` to `expert_review` while review is underway
- `expert_reviewer` with the reviewer name or stable reviewer ID
- `approved_at` only when the wording and metadata are actually approved

Do not mark a question `published` during this review.

### `data/quiz/answer-options.csv`

Update:

- `expert_notes` with wording issues, cultural concerns, overlap, or fallback-option concerns
- `status` to reflect the answer wording’s review state

This file does not carry separate reviewer or approval-date columns; approval is associated with the parent question and the corresponding scoring review record.

### `data/quiz/answer-scores.csv`

Update:

- `rationale` with the accepted or corrected qualitative direction
- `status` to `expert_review` while mappings are being reviewed
- `expert_reviewer` with the reviewer name or stable reviewer ID
- `approved_at` only when the qualitative mapping and rationale are approved

Leave these fields blank throughout the first review:

- `vata_weight`
- `pitta_weight`
- `kapha_weight`
- `reliability_weight`

An approved qualitative direction does not approve a numerical score.

## Whole-assessment review

After reviewing individual questions, evaluate the complete set:

- Does it cover enough independent physical, physiological, and behavioral domains?
- Are baseline, current, and context questions clearly separated?
- Is any dosha systematically easier to select or recognize?
- Are answer directions balanced across the full set?
- Are important domains missing?
- Are too many questions based on culturally contingent behavior?
- Are sensitive questions necessary and appropriately placed?
- Can the draft reasonably fit the ten-minute target?
- Should any question move to refinement without replacing it?

Hair tendency is currently assigned to early refinement and should not be added to the initial set unless the expert recommends replacing another question.

## Review completion criteria

The assessment is ready for scoring-model work only when:

- Every question has a recorded concept and placement decision
- Every ordinary answer has an accepted or corrected qualitative direction
- Mixed-direction candidates are documented
- Every question has a high, medium, or low reliability classification
- Redundancies and confounders are documented
- Every question has an initial-set decision
- Wording and qualitative mappings have identified reviewers and review states
- The complete assessment has been reviewed as a system
- Numerical weight fields remain blank

## After expert review

Use the reviewed decisions to complete `docs/quiz/scoring-model.md`. That later work may define the numerical weight scale, reliability weights, multi-dosha contributions, normalization, result thresholds, minimum coverage, expiration, completeness, consistency, and result labels.

Only after the scoring model is approved should numerical values be added to `data/quiz/answer-scores.csv`.
