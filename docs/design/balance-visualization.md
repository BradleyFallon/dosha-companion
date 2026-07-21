# Balance Visualization

## Purpose

My Balance is a calm graphical reflection of information the person supplied. It includes a clearly labeled prototype dosha estimate, but it is not a clinical assessment, performance dashboard, or trend chart.

The top of the composition makes dosha identity explicit. Coverage-ready assessment data shows an answer-derived usual-nature and recent-pattern estimate using the draft unit-weight model. When coverage is insufficient, the same location asks for more information. Development builds can still show a controlled sample profile for reviewing the incomplete-assessment path. This identity summary remains visually and semantically separate from the coverage rings below it.

## Segmented rings

Usual and Recent each use a segmented ring. One segment corresponds to one question category in that source:

- filled means the category has an ordinary answer;
- muted means it is missing, skipped, fallback, or uncertain.

The rings have exact accessible labels such as “Usual pattern: 14 of 19 areas represented.” They do not show percentages, magnitude, overlap, or dosha colors. Usual opens assessment maintenance; Recent opens the latest completed check-in when one exists.

## Domain map

The primary domains are sleep, energy, appetite, digestion, routine, and stress. Each maps directly to reviewed baseline/current question categories. Body qualities remains represented in the recent ring but is not forced into the six-item primary grid.

The application selects one recent source: the latest completed check-in, or the initial current answers when no completed check-in exists. It never silently merges multiple check-ins.

## Editorial comparison metadata

Editors control three answer-option fields:

- `short_label`: concise display wording while full answer text remains authoritative;
- `icon_key`: an optional key from the controlled semantic icon vocabulary;
- `pattern_key`: a lowercase, domain-specific neutral relationship token.

Ordinary current answers require a short label. Pattern keys are never inferred from order or prose. Fallback answers use `uncertain` or no key. Every label and mapping remains draft until editorial/domain review.

When both ordinary answers have reviewed keys, equal keys mean **Close to usual** and different keys mean **Changed recently**. A `_usual` key is permitted only when the authored current answer explicitly says it is close to the person’s usual pattern. One-sided, fallback, missing, or metadata-incomplete states remain neutral and do not imply direction.

## Graphical states

Comparison states use shape as well as restrained color:

- Close to usual: stable filled center and even halo;
- Changed recently: offset companion ring;
- Recent information only: single filled mark;
- Usual information only: doubled outline;
- Not enough information: dotted or muted outline.

Selecting a domain opens `/balance/:domain`, shows short usual/recent labels and the neutral comparison, and keeps full source responses in a disclosure. Invalid domain routes return to `/balance`.

## Timeline

The timeline contains at most five equal-size completed-check-in dots in chronological order. Only a few dates are printed. The newest dot receives subtle emphasis, and every point opens its dated summary. Lines indicate sequence only—never magnitude, improvement, a streak, or a reward.

## Contextual chat

Ask about this passes the domain, editor labels, full authored responses, and deterministic comparison state to the existing grounded mock/API contract. It provides related approved learning sources but does not invent dosha weights, medical meaning, or arbitrary interpretation.

## Accessibility and responsive behavior

- Rings, domains, timeline points, info, and close actions have explicit accessible names.
- Decorative SVGs are hidden and unfocusable.
- State is communicated through fill, outline, shape, and text—not color alone.
- Domain controls remain at least 44 by 44 CSS pixels in a stable 3 × 2 grid.
- At 390 × 844, 390 × 667, and 360 × 640, the rings remain side by side, horizontal overflow is absent, and bottom navigation does not cover the primary action.
- Motion is limited to opening details and respects reduced-motion preferences.

## Why not a radar chart or dosha wheel?

Radar charts imply numeric magnitude. A three-part wheel implies dosha proportions. Neither measurement exists in the reviewed data, so both would invent precision. The current graphics describe representation and explicit answer relationships only.

The prototype estimate uses separately versioned answer weights and thresholds. It does not reinterpret these display keys as weights. Expert review and validation are still required before production use.
