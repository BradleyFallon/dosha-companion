# Initial Question Bank

## Status

Draft for Ayurvedic expert review.

This Markdown file supports discussion and review. The six normalized files under `data/quiz/` are the canonical executable source for wording, answer choices, provisional scoring records, controlled values, and question-set membership. Application code must not parse this document, and approved structured records should eventually generate the corresponding review documentation.

These questions are intended to create:

* A preliminary baseline constitution profile
* An initial current-balance profile
* A starting point for continuing assessment

The questions and scoring directions in this document are provisional. They must be reviewed as a complete assessment before implementation.

## General instructions shown to the user

> This assessment has two parts. First, we’ll ask about tendencies that have generally been true for you over time. Then we’ll ask how you have been feeling recently.
>
> Choose the answer that fits you best. You can select “Not sure” or skip a question when none of the choices feel accurate.

---

# Part 1: Your usual nature

## Introduction

> For the following questions, think about most of your adult life when you are generally well—not only how you have felt recently.

## Q01: Natural pace

**Question**

How would you describe your natural pace when moving through everyday activities?

**Answers**

* `q01_a`: Quick and changeable; I often move rapidly between things.
* `q01_b`: Purposeful and efficient; I tend to move with a clear objective.
* `q01_c`: Steady and unhurried; I prefer to move at a consistent pace.
* `q01_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q01_a`: Vata
* `q01_b`: Pitta
* `q01_c`: Kapha

**How it is used**

Provides behavioral evidence about the user’s characteristic pace and activity style.

---

## Q02: Energy pattern

**Question**

Which description best matches your usual energy pattern?

**Answers**

* `q02_a`: My energy comes in bursts and can change quickly.
* `q02_b`: My energy is strong and focused, but I may push too hard.
* `q02_c`: My energy builds gradually and tends to last once I get going.
* `q02_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q02_a`: Vata
* `q02_b`: Pitta
* `q02_c`: Kapha

**How it is used**

Helps distinguish fluctuating, intense, and sustained energy tendencies.

---

## Q03: Preference for routine

**Question**

What is your natural relationship with routine?

**Answers**

* `q03_a`: I enjoy variety, but my routines can be inconsistent.
* `q03_b`: I like organized routines that help me accomplish goals.
* `q03_c`: I prefer familiar, dependable routines and dislike sudden changes.
* `q03_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q03_a`: Vata
* `q03_b`: Pitta
* `q03_c`: Kapha

**How it is used**

Adds behavioral information about variety, structure, and stability.

---

## Q04: Decision-making style

**Question**

How do you generally make everyday decisions?

**Answers**

* `q04_a`: I decide quickly but may change my mind afterward.
* `q04_b`: I evaluate the options and make a firm decision.
* `q04_c`: I take my time and prefer to feel certain before deciding.
* `q04_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q04_a`: Vata
* `q04_b`: Pitta
* `q04_c`: Kapha

**How it is used**

Provides supporting behavioral evidence. This should have less scoring weight than major physiological traits.

---

## Q05: Learning new information

**Question**

When learning something new, which pattern fits you best?

**Answers**

* `q05_a`: I understand new ideas quickly, especially when they are interesting.
* `q05_b`: I learn best through logic, structure, and clear explanations.
* `q05_c`: I may take longer to learn, but the knowledge becomes deeply established.
* `q05_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q05_a`: Vata
* `q05_b`: Pitta
* `q05_c`: Kapha

**How it is used**

Provides psychological and cognitive context for the baseline profile.

---

## Q06: Long-term memory

**Question**

How would you describe your memory over time?

**Answers**

* `q06_a`: I learn quickly but may forget details just as quickly.
* `q06_b`: I remember information that is useful, important, or connected to a goal.
* `q06_c`: Once I learn something thoroughly, I tend to remember it for a long time.
* `q06_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q06_a`: Vata
* `q06_b`: Pitta
* `q06_c`: Kapha

**How it is used**

Complements the learning-style question and helps identify conflicting cognitive answers.

---

## Q07: Physical endurance

**Question**

During physical activity, what is your usual endurance pattern?

**Answers**

* `q07_a`: I can start energetically, but my stamina varies.
* `q07_b`: I can sustain intense effort, especially when motivated by a challenge.
* `q07_c`: I warm up slowly, but I can continue steadily for a long time.
* `q07_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q07_a`: Vata
* `q07_b`: Pitta
* `q07_c`: Kapha

**How it is used**

Adds physiological information about variable, intense, and sustained energy.

---

## Q08: Natural body frame

**Question**

Before major changes in weight, fitness, illness, or lifestyle, how would you describe your natural body frame?

**Answers**

* `q08_a`: Naturally light, narrow, or fine-boned.
* `q08_b`: Naturally medium, proportionate, or moderately muscular.
* `q08_c`: Naturally broad, solid, or substantial.
* `q08_unsure`: Not sure or my body has changed too much to tell.

**Provisional scoring direction**

* `q08_a`: Vata
* `q08_b`: Pitta
* `q08_c`: Kapha

**How it is used**

Provides baseline structural information.

Current weight should not be assumed to represent natural constitution when it has been affected by major life or health changes.

---

## Q09: Weight tendency

**Question**

Throughout most of your adult life, what has been your natural tendency with weight?

**Answers**

* `q09_a`: I tend to lose weight easily or have difficulty maintaining it.
* `q09_b`: My weight responds fairly quickly to changes in eating and activity.
* `q09_c`: I tend to gain weight easily and lose it gradually.
* `q09_unsure`: Not sure or major changes make this difficult to answer.

**Provisional scoring direction**

* `q09_a`: Vata
* `q09_b`: Pitta
* `q09_c`: Kapha

**How it is used**

Provides long-term metabolic and structural context without requiring an exact weight or BMI.

---

## Q10: Skin tendency

**Question**

When your skin is in its usual state, which description fits best?

**Answers**

* `q10_a`: It tends to be dry, thin, cool, or rough.
* `q10_b`: It tends to be warm, sensitive, flushed, or easily irritated.
* `q10_c`: It tends to be soft, smooth, thicker, or naturally moist.
* `q10_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q10_a`: Vata
* `q10_b`: Pitta
* `q10_c`: Kapha

**How it is used**

Provides physical evidence based on enduring skin qualities.

The question should not be used to evaluate skin color or ethnicity.

---

## Q11: Temperature tolerance

**Question**

Which type of weather or temperature is naturally hardest for you?

**Answers**

* `q11_a`: Cold, windy, or dry conditions.
* `q11_b`: Hot weather or strong direct sun.
* `q11_c`: Cold, damp, or heavy weather.
* `q11_unsure`: Not sure or none affects me consistently.

**Provisional scoring direction**

* `q11_a`: Vata
* `q11_b`: Pitta
* `q11_c`: Kapha

**How it is used**

Provides baseline information about sensitivity to environmental qualities.

It may also help select climate-related educational content.

---

## Q12: Sweating tendency

**Question**

Under similar levels of heat or activity, how much do you naturally tend to sweat?

**Answers**

* `q12_a`: Usually little or irregularly.
* `q12_b`: Easily and often noticeably.
* `q12_c`: Moderately, often with some moisture or clamminess.
* `q12_unsure`: Not sure.

**Provisional scoring direction**

* `q12_a`: Vata
* `q12_b`: Pitta
* `q12_c`: Kapha

**How it is used**

Provides supporting physiological evidence.

Climate, exercise, medications, and health conditions can affect sweating, so this question should have limited weight.

---

## Q13: Usual appetite

**Question**

When you are generally well, how would you describe your appetite?

**Answers**

* `q13_a`: It is variable; I may be very hungry at one meal and uninterested at another.
* `q13_b`: It is strong and arrives predictably.
* `q13_c`: It is steady but not urgent, and I can comfortably wait to eat.
* `q13_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q13_a`: Vata
* `q13_b`: Pitta
* `q13_c`: Kapha

**How it is used**

Provides high-value physiological evidence about long-term appetite patterns.

---

## Q14: Delayed meals

**Question**

What usually happens when a meal is delayed?

**Answers**

* `q14_a`: I may forget about eating, then suddenly feel depleted, shaky, or unsettled.
* `q14_b`: I become intensely hungry, impatient, or irritable.
* `q14_c`: I notice the hunger but can usually wait without much difficulty.
* `q14_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q14_a`: Vata
* `q14_b`: Pitta
* `q14_c`: Kapha

**How it is used**

Adds evidence about appetite intensity and the behavioral response to hunger.

---

## Q15: Usual digestion

**Question**

When eating foods that normally agree with you, which digestive pattern is most typical?

**Answers**

* `q15_a`: Unpredictable digestion, often with gas, bloating, or irregular comfort.
* `q15_b`: Fast or intense digestion, sometimes with heat or burning discomfort.
* `q15_c`: Slow or heavy digestion, especially after a large meal.
* `q15_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q15_a`: Vata
* `q15_b`: Pitta
* `q15_c`: Kapha

**How it is used**

Provides high-value physiological evidence.

The app must present these as general experiences, not signs of a diagnosed digestive disorder.

---

## Q16: Usual bowel pattern

**Question**

When your digestion is in its usual state, which pattern fits best?

**Answers**

* `q16_a`: Irregular timing, with a tendency toward dryness or difficulty.
* `q16_b`: Frequent or urgent movements, with a tendency toward looseness.
* `q16_c`: Regular but slower movements, sometimes with a sense of heaviness.
* `q16_unsure`: Not sure or prefer not to answer.

**Provisional scoring direction**

* `q16_a`: Vata
* `q16_b`: Pitta
* `q16_c`: Kapha

**How it is used**

Adds specificity to the digestive profile.

This question should be skippable and should appear after less sensitive questions.

---

## Q17: Natural sleep pattern

**Question**

When life is relatively stable, what is your natural sleep pattern?

**Answers**

* `q17_a`: Light or easily interrupted, and the amount I sleep may vary.
* `q17_b`: Moderate and fairly regular, though heat or mental activity may disturb it.
* `q17_c`: Deep and long, and I may find it difficult to wake.
* `q17_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q17_a`: Vata
* `q17_b`: Pitta
* `q17_c`: Kapha

**How it is used**

Provides high-value baseline physiological information.

---

## Q18: Natural speaking style

**Question**

How would you describe your natural speaking style?

**Answers**

* `q18_a`: Fast, animated, and sometimes changing direction quickly.
* `q18_b`: Clear, direct, precise, and sometimes forceful.
* `q18_c`: Calm, measured, and sometimes slow to respond.
* `q18_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q18_a`: Vata
* `q18_b`: Pitta
* `q18_c`: Kapha

**How it is used**

Provides supporting behavioral evidence.

Because communication style is affected by culture and situation, this question should carry less weight than physiological questions.

---

## Q19: Response to pressure

**Question**

When under ordinary stress, which response is most typical for you?

**Answers**

* `q19_a`: I become worried, scattered, uncertain, or restless.
* `q19_b`: I become impatient, critical, frustrated, or intensely focused.
* `q19_c`: I withdraw, resist change, hold onto the issue, or lose motivation.
* `q19_unsure`: Not sure or none of these fit.

**Provisional scoring direction**

* `q19_a`: Vata
* `q19_b`: Pitta
* `q19_c`: Kapha

**How it is used**

Provides behavioral context about the user’s characteristic response to stress.

This is a wellness question and must not be interpreted as a mental-health diagnosis.

---

# Part 2: Your current balance

## Introduction

> Now think only about the past seven days. These answers help us understand how your current state may differ from your usual nature.

## Q20: Recent sleep

**Question**

During the past seven days, how has your sleep been?

**Answers**

* `q20_a`: Light, interrupted, irregular, or difficult to settle into.
* `q20_b`: Shortened or disturbed by feeling warm, mentally active, or driven.
* `q20_c`: Heavy or prolonged, with difficulty waking or getting started.
* `q20_d`: Comfortable and close to my normal sleep.
* `q20_unsure`: Not sure.

**Provisional scoring direction**

* `q20_a`: Current Vata signal
* `q20_b`: Current Pitta signal
* `q20_c`: Current Kapha signal
* `q20_d`: No elevation signal

**How it is used**

Contributes only to the current-balance calculation and should lose influence over time.

---

## Q21: Recent appetite

**Question**

During the past seven days, how has your appetite compared with your usual pattern?

**Answers**

* `q21_a`: More irregular or unpredictable than usual.
* `q21_b`: More intense or urgent than usual.
* `q21_c`: Weaker, slower, or less interested than usual.
* `q21_d`: Close to my usual pattern.
* `q21_unsure`: Not sure.

**Provisional scoring direction**

* `q21_a`: Current Vata signal
* `q21_b`: Current Pitta signal
* `q21_c`: Current Kapha signal
* `q21_d`: No elevation signal

**How it is used**

Measures deviation from the user’s baseline rather than treating one appetite style as universally balanced.

---

## Q22: Recent digestion

**Question**

During the past seven days, which digestive pattern has been most noticeable?

**Answers**

* `q22_a`: Gas, bloating, irregularity, or dryness.
* `q22_b`: Heat, burning discomfort, urgency, or looseness.
* `q22_c`: Heaviness, sluggishness, or feeling full for a long time.
* `q22_d`: Digestion has felt comfortable and close to normal.
* `q22_unsure`: Not sure or prefer not to answer.

**Provisional scoring direction**

* `q22_a`: Current Vata signal
* `q22_b`: Current Pitta signal
* `q22_c`: Current Kapha signal
* `q22_d`: No elevation signal

**How it is used**

Contributes to recent balance and helps prioritize appropriate expert-approved educational content.

It must not be used to diagnose or explain a medical condition.

---

## Q23: Recent energy

**Question**

During the past seven days, how has your energy felt?

**Answers**

* `q23_a`: Scattered, inconsistent, depleted, or difficult to sustain.
* `q23_b`: Intense, driven, restless, or difficult to switch off.
* `q23_c`: Heavy, slow, sleepy, or difficult to activate.
* `q23_d`: Stable and close to my normal energy.
* `q23_unsure`: Not sure.

**Provisional scoring direction**

* `q23_a`: Current Vata signal
* `q23_b`: Current Pitta signal
* `q23_c`: Current Kapha signal
* `q23_d`: No elevation signal

**How it is used**

Contributes to current-balance scoring and selection of practical daily guidance.

---

## Q24: Recent response to stress

**Question**

During the past seven days, what has been your most common response to pressure?

**Answers**

* `q24_a`: Worry, uncertainty, restlessness, or feeling scattered.
* `q24_b`: Irritation, impatience, frustration, or feeling overly driven.
* `q24_c`: Withdrawal, heaviness, resistance, or low motivation.
* `q24_d`: My response has felt manageable and close to normal.
* `q24_unsure`: Not sure or prefer not to answer.

**Provisional scoring direction**

* `q24_a`: Current Vata signal
* `q24_b`: Current Pitta signal
* `q24_c`: Current Kapha signal
* `q24_d`: No elevation signal

**How it is used**

Supports non-diagnostic wellness recommendations concerning routine, rest, activity, and reflection.

---

## Q25: Recent routine

**Question**

During the past seven days, how has your daily routine felt?

**Answers**

* `q25_a`: Unpredictable, disrupted, or constantly changing.
* `q25_b`: Overly scheduled, demanding, or focused on productivity.
* `q25_c`: Inactive, repetitive, or difficult to get moving within.
* `q25_d`: Consistent and supportive.
* `q25_unsure`: Not sure.

**Provisional scoring direction**

* `q25_a`: Current Vata signal
* `q25_b`: Current Pitta signal
* `q25_c`: Current Kapha signal
* `q25_d`: No elevation signal

**How it is used**

Connects the user’s current circumstances to daily routine guidance.

---

## Q26: Recent body qualities

**Question**

During the past seven days, which group of physical qualities has been most noticeable?

**Answers**

* `q26_a`: Dryness, coldness, tension, or lightness.
* `q26_b`: Heat, redness, sensitivity, or sharpness.
* `q26_c`: Heaviness, dampness, congestion, or sluggishness.
* `q26_d`: None of these has been particularly noticeable.
* `q26_unsure`: Not sure.

**Provisional scoring direction**

* `q26_a`: Current Vata signal
* `q26_b`: Current Pitta signal
* `q26_c`: Current Kapha signal
* `q26_d`: No elevation signal

**How it is used**

Provides a broad current-quality signal and helps choose relevant follow-up questions.

Because each answer contains several qualities, this question should have lower weight than more specific questions.

---

# Major-change context question

## Q27: Changes from usual state

**Question**

Is there anything currently making your body, habits, or energy substantially different from your usual state?

**Answers**

* `q27_a`: No major change.
* `q27_b`: Recent travel or a major schedule change.
* `q27_c`: Significant stress or a major life event.
* `q27_d`: Recent illness, injury, medication change, pregnancy, or another physical change.
* `q27_e`: Another reason.
* `q27_skip`: Prefer not to answer.

**Scoring**

No direct dosha score.

**How it is used**

* Helps distinguish baseline characteristics from temporary changes.
* May reduce confidence in baseline answers affected by the change.
* May trigger a small number of clarification questions.
* May activate safety exclusions.
* Must not prompt the LLM to diagnose or interpret the cause.

The MVP should not request detailed medical information in response.

---

# Review requirements

Before publication, the expert should review:

* Whether each question reflects an accepted Ayurvedic concept
* Whether each answer maps appropriately to Vata, Pitta, or Kapha
* Whether some answers should contribute to more than one dosha
* Relative weight of physical, physiological, psychological, and behavioral domains
* Whether any question is redundant
* Whether any answer contains too many traits
* Whether wording works across cultures
* Whether sex, age, climate, health changes, or medications could confound an answer
* Whether the question belongs in the initial assessment or later refinement

# Product-testing requirements

Test the draft with users to determine:

* Average completion time
* Questions that require explanation
* Questions users frequently skip
* Answer choices users find overlapping
* Questions that feel judgmental or invasive
* Whether users understand the difference between usual nature and recent state
* Whether the assessment works comfortably on a phone
* Whether answer patterns produce excessive ties or unstable profiles

# Implementation note

The production question order should not always present Vata, Pitta, and Kapha choices in the same position.

Answer ordering may be varied, but each answer must retain a stable answer ID and scoring mapping.

This is intentionally **27 questions**, with 19 baseline questions, seven current-balance questions, and one unscored context question. It should still fit near the ten-minute target because each question is a single tap, but completion time needs to be measured rather than assumed.
