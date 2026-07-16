# Balance Visualization

## Goal

Help users compare baseline constitution and current balance without presenting the result as a medical measurement or implying unjustified numeric precision.

## First-prototype approach

Use two separate cards and a simple three-row relative display. Each card includes its own heading, time frame, plain-language label, and accessible text summary.

### Baseline card

- Heading: **Your nature**
- Time frame: “Your usual adult tendencies when generally well”
- Label example: **Vata–Pitta**
- Visualization: three named horizontal tracks with qualitative emphasis
- Supporting text: stable-pattern explanation and Preliminary/Developing stage

### Current-balance card

- Heading: **Your current balance**
- Time frame: “Based on answers from the past seven days”
- Label example: **Vata is currently more prominent**
- Visualization: the same three named tracks, visually separated from baseline
- Supporting text: last-updated date, freshness, and next check-in action

## Low-fidelity pattern

```text
Your nature
Vata–Pitta

Vata   [==========----]  prominent
Pitta  [========------]  prominent
Kapha  [====----------]  present

Your current balance
Vata is currently more prominent

Vata   [===========---]  more prominent
Pitta  [======--------]  near your recent baseline
Kapha  [===-----------]  less prominent
```

Track lengths are illustrative in wireframes. Production lengths, labels, and thresholds depend on the approved scoring model.

## Accessibility requirements

- Always name Vata, Pitta, and Kapha in text.
- Pair every graphic with a plain-language summary.
- Do not communicate meaning by hue alone; use labels, order, patterns, or markers.
- Use the same dosha order in both cards.
- Expose an accessible table or list rather than treating the graphic as a single unlabeled image.
- Avoid animated transitions by default and respect reduced-motion settings.
- Do not announce raw percentages unless product and expert review later approves them.

## Completeness and freshness

Keep these concepts separate from dosha display:

- **Profile stage:** Preliminary, Developing, or Well established
- **Current freshness:** Updated today, Updated recently, Update recommended, or More recent answers needed

Do not label either measure “diagnostic confidence.” A short count such as “22 of 27 initial questions answered” may be used in a details view, but the primary result should use plain-language stages.

## Alternatives not used in the first prototype

- Pie or donut charts: imply a precise whole and are difficult to compare
- Radar charts: cognitively heavy and accessibility-poor on mobile
- Three percentages: imply validation and precision not yet established
- A single blended graphic: obscures baseline/current separation
- Animated body or elemental metaphors: premature branding and potentially misleading

## Decisions deferred until scoring review

- Track-length calculation
- Single-, dual-, and mixed-label thresholds
- Whether “near baseline” compares current loads with baseline proportions
- Minimum coverage required to render each track
- How stale current answers change or suppress the visualization

