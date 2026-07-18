# Moderated Usability Protocol

## Status and purpose

This protocol supports five formative sessions with the real Dosha Companion production onboarding and full initial assessment. The study is intended to identify comprehension, trust, navigation, pacing, and daily-value problems. It is not a clinical study, an assessment of the participant, or a test of Ayurvedic efficacy.

The interface is being tested, not the participant. Findings should describe observed behavior separately from participant opinion and researcher interpretation.

## Research questions

1. Can a new user complete the full setup and 27-question assessment while distinguishing usual patterns from recent patterns?
2. Does Today provide an understandable and worthwhile action without explanation?
3. Does Check In feel lightweight, and is completion satisfying without pressure?
4. Does requesting a broad regional location during onboarding feel relevant and appropriately private once Today shows localized value?
5. Can participants explain what My Balance represents without assuming scores, diagnosis, or improvement?
6. Does contextual chat feel connected to the selected content?
7. Do the four daylight phases feel distinct, comfortable, and useful enough to retain?
8. What does the participant expect to find when returning tomorrow?

## Participant profile

Recruit five adults who:

- use a smartphone regularly;
- have some interest in everyday wellbeing, routines, food, or reflective tools;
- represent a mix of familiarity and unfamiliarity with Ayurveda;
- are willing to think aloud while using a prototype.

Avoid recruiting only designers, developers, Ayurvedic practitioners, or people already familiar with the product. Record relevant experience as context, not as a screening score.

Participants do not need to disclose real health information. They may answer using a fictional or approximate profile and may skip any question.

## Session setup

- Duration: approximately 45 minutes; allow up to 60 minutes for the first pilot.
- Device: participant’s phone when practical, otherwise a mobile viewport at approximately 390 pixels wide.
- Build: latest validated `main` build.
- Starting state: cleared browser-local data at Welcome, with no seeded profile, fixture result, or saved progress.
- Product path: normal production onboarding followed by the complete 27-question initial assessment.
- Recording: optional and separately consented; notes are sufficient.
- Observation: one moderator and, when available, one silent note-taker.
- Reset: clear the browser-local profile after each session.

Prepare:

- the prototype URL;
- this protocol;
- a fresh copy of the [session notes template](usability-session-notes-template.md);
- a timer;
- the four reviewed daylight phase views for an optional final comparison.

Do not expose query parameters, development short mode, seeded data, fixture results, implementation notes, expected paths, or test assertions to the participant. Do not tell participants the expected onboarding or assessment duration before Task 1.

## Consent and privacy process

Read this before recording or beginning tasks:

> Thank you for helping us evaluate an early wellbeing prototype. We are testing the interface, not you, and there are no right or wrong answers. The prototype is educational and is not medical care. You can use made-up or approximate answers, skip any question, take a break, or stop at any time. We will take notes about how the interface works for you. We will not put your name or personal health details in the research summary.

Ask and record a clear response to each:

1. Do you agree to participate in this usability session?
2. Is it okay for us to take anonymous notes?
3. If recording is planned: may we record the screen and conversation for research review?

If recording permission is declined, continue with notes only. If participation or note-taking permission is declined, stop the session.

Data-handling rules:

- Identify sessions as `S01` through `S05`, not by participant name.
- Do not request diagnoses, medications, exact address, birth date, or other unnecessary personal data.
- Do not commit participant identifiers, raw recordings, or sensitive disclosures to this repository.
- Store only anonymized repeated findings in repository documentation.
- Follow the team’s approved deletion process for recordings and raw notes; if no process has been approved, do not record.

## Moderator conduct

- Ask the participant to think aloud, but allow silence while they read.
- Use neutral prompts such as “What are you thinking?” or “What did you expect?”
- Do not name controls, explain terminology, point to a target, or confirm that an interpretation is correct during a task.
- If the participant asks for help, first ask what they would try. After a sustained block, end the task and provide only enough help to continue the study.
- Do not defend the design.
- Do not turn one participant’s suggestion directly into a requirement.
- Note hesitation, rereading, backtracking, accidental taps, and recovery—not only task completion.

## Opening questions — 3 minutes

Ask:

1. What kinds of wellbeing, routine, food, or reflection tools do you currently use, if any?
2. Before today, what did the word “Ayurveda” mean to you?
3. When an app personalizes wellbeing guidance, what makes that feel trustworthy or untrustworthy?

Do not explain Dosha Companion beyond: “This is an early prototype for personalized, educational Ayurvedic guidance.”

## Core tasks — approximately 30–35 minutes

Give one task at a time. Read only the task prompt initially.

Do not shorten the product flow to keep the session on schedule. Reduce or omit moderator follow-up questions before removing a product step.

### Task 1: Complete onboarding and the initial assessment

Prompt:

> Imagine you have just found this app and want to see what it offers. Set it up for yourself and continue until you reach the main daily experience.

This task includes Welcome, the account/setup simulation, required profile information, regional location, food-safety information, all 27 initial-assessment questions, the honest assessment completion or coverage result, and arrival at Today. Do not coach a separate location task later.

Observe:

- whether the product boundary is understood;
- time from Welcome to the first assessment question;
- time spent on all 27 assessment questions;
- total time from Welcome to Today;
- questions or sections where the participant slows down;
- whether the number of questions feels reasonable;
- whether answer choices are easy to scan;
- understanding of usual versus recent questions;
- whether progress feels motivating, neutral, or discouraging;
- whether the participant attempts to abandon, skip, rush, or repeat the same answer pattern;
- use of Back, keyboard, and progress cues;
- which location entry method they choose;
- what location precision they believe is stored;
- whether the location explanation feels private enough;
- whether weather and seasonal content later justify the location request;
- hesitation at the assessment summary;
- whether the participant can explain what is and is not calculated.

After the participant reaches Today, ask:

> How did the length of that setup feel?

Then ask:

> In your own words, what did the app learn, and what did it not determine?

### Task 2: Use Today

Prompt:

> You have opened the app today. Show me what you would do first.

Observe:

- whether the recommendation is visually primary;
- understanding of Done, Another, Ask, and the information disclosure;
- whether completion feels acknowledged;
- what supporting content competes for attention;
- whether the participant understands why this recommendation appears.

Neutral follow-ups:

> What would marking this Done mean to you?

> What would you expect Another to do?

### Task 3: Complete a Check In

Prompt:

> A few days have passed and you want to record how things have been recently. Show me how you would do that.

Observe:

- discovery of Check In;
- perceived effort before starting;
- understanding of timeframe and answer choices;
- visibility of Continue and completion actions;
- reaction to the completion moment;
- expected effect on Today and My Balance.

Neutral follow-up:

> What do you expect this check-in to change?

### Task 4: Ask about a recommendation

Prompt:

> You want to understand the recommendation more deeply. Show me how you would ask about it.

Observe:

- whether Ask is understood as contextual;
- whether the chat retains the recommendation context;
- whether approved content and limitations remain credible;
- whether returning to Today is predictable.

Neutral follow-up:

> What information do you think the assistant used for that answer?

### Task 5: Explore My Balance

Prompt:

> Open My Balance and tell me what you think this screen is showing. Explore anything that interests you.

Do not explain the rings, icons, comparison labels, timeline, or missing scoring.

Observe and quote:

- what the two rings are believed to measure;
- whether participants infer percentages, doshas, health, or improvement;
- meaning assigned to domain symbols and comparison states;
- whether the timeline supports a question or decision;
- what action the participant expects to take next;
- what they expect after another check-in.

Neutral follow-ups:

> What is the difference between Usual and Recent here?

> What would you expect to happen after another check-in?

> Is there anything here that looks like a score or judgment?

## Task 6: Optional daylight comparison — up to 5 minutes

Run this only after the primary tasks so atmospheric comparisons do not prime the main study. It may be omitted when the session is running long, especially during the first pilot.

Show midday, sunset, twilight, and night in a rotated order across sessions. Keep content identical.

For each view, ask:

> How would you describe this version?

After all four, ask:

1. Which versions felt meaningfully different?
2. Did sunset and twilight feel distinct?
3. Which view would be most comfortable in a dark room?
4. Did any view reduce readability or make the product feel theatrical?
5. Would you expect this appearance only on Today or throughout the app?
6. Would you look for a setting to override the automatic appearance?

Record observed readability issues separately from stated preference.

## Closing questions — 5 minutes

1. What, if anything, felt useful?
2. What felt confusing, invasive, or untrustworthy?
3. What would you expect to see if you returned tomorrow?
4. What would make you stop using this?
5. If you could change one thing, what would it be?

Then disclose any help withheld during tasks and thank the participant.

After the first pilot only, the moderator should record which moderator questions or tasks should be shortened before the remaining sessions. Refine pacing without replacing or shortening the production onboarding or 27-question assessment.

## Note-taking taxonomy

Every important note should be marked as one of:

- **Observed:** directly visible action or behavior.
- **Said:** participant’s words; use a short exact quote when useful.
- **Inferred:** researcher interpretation that requires validation.
- **Opportunity:** possible response, not yet an accepted requirement.

Use these task outcomes:

- `completed-unassisted`
- `completed-with-recovery`
- `completed-after-help`
- `not-completed`

Use impact labels only after the session:

- `blocker`: prevents task completion or creates a serious trust/safety misunderstanding;
- `high`: repeated or consequential misunderstanding with no easy recovery;
- `medium`: noticeable friction with recovery;
- `low`: cosmetic or isolated preference.

## Synthesis after five sessions

1. Build an issue table grouped by product question, not by participant.
2. Count participants showing the same behavior; do not count repeated comments from one session as separate evidence.
3. Attach an anonymized observation or short quote to each finding.
4. Distinguish comprehension failures from preferences and feature requests.
5. Promote repeated high-impact findings into planning items.
6. Update product or design specifications only when the finding changes accepted behavior.
7. Record unresolved My Balance questions in PROD-001 and daylight decisions in EXP-007.

Do not declare a finding validated from one participant unless it exposes a direct accessibility, safety, privacy, or task-blocking defect.
