# Check In Experience

## Purpose

The bottom-navigation destination formerly labeled Questions is called **Check In** because its everyday purpose is to help someone reflect on how they have felt recently. The `/questions` route remains stable for existing links and persisted flows. “Questions” remains valid only when referring to actual assessment questions.

Check In owns:

- starting or continuing a recent-state check-in;
- reviewing compact dated records;
- opening contextual chat for a completed record;
- maintaining the initial assessment.

My Balance is reserved for future approved interpretation and comparison of usual nature with current state. It should not duplicate check-in history or assessment-maintenance controls.

## One primary action

The landing screen presents one dominant task. With no unfinished record it asks “How have you felt lately?” and starts the quick past-seven-days set. When an unfinished record exists, Continue replaces Start check-in and shows only the number answered.

The detailed check-in remains available through a collapsed More options control. This preserves capability without making two check-in lengths look equally recommended.

## History

The landing screen shows the latest completed check-in and at most two additional recent rows. Rows use a short date, completion icon, optional record-specific chat action, and chevron. More than three records reveals View all, which opens a focused compact history screen.

A completed record opens a stable summary. The just-completed state confirms “Check-in saved” and gives Done primary emphasis. Contextual chat is secondary. Stored answers and the explanation that check-ins are separate from the initial assessment are collapsed until requested.

## Initial assessment

A compact Initial assessment row reports Complete or the remaining-question count. It opens a focused management screen where the user can continue the next useful question or review answers. Entering an assessment question from this screen returns to assessment management.

Coverage details are collapsed by default and use plain labels such as Answered clearly, Not sure, Skipped, and Remaining. Internal coverage policy and stored meanings remain unchanged.

## Focused question layout

An active check-in owns the viewport and suppresses global bottom navigation. The layout contains:

1. a fixed icon-only Finish later action and minimal progress dots;
2. an independently scrollable prompt-and-answer region;
3. a fixed safe-area-aware action region.

Only the first question quietly states the past-seven-days timeframe. Set titles, persistent save-success text, keyboard hints, and repeated methodology boundaries are absent. Prompt typography, answer rows, selection treatment, and the visible primary action match the initial assessment so both flows feel like one question system. Progress dots and the icon-only Finish later action keep the check-in chrome quieter. Arrow keys change selection and Enter advances on keyboard-capable browsers.

## Progressive disclosure

The following stay outside the default landing hierarchy:

- detailed check-in choice;
- full history;
- full stored answers;
- assessment coverage;
- scoring and methodology boundaries;
- baseline/current-state explanations.

The information remains reachable in focused screens and native disclosures without adding an internal tab bar.

## Accessibility

- Icon-only actions have explicit accessible names and decorative SVGs.
- Interactive targets are approximately 44 by 44 pixels or larger.
- Native link, button, radio, and details semantics are retained.
- Focus indicators remain visible.
- Progress dots have a hidden “Question n of total” equivalent.
- Completed-row review and chat names include the record date.
- At short mobile heights, only the variable question region scrolls; the document, exit control, progress, and action do not.
