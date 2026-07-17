# Calm Interface Principles

## One idea at a time

Each primary screen has one dominant purpose. Today centers the recommendation, Check In centers starting or continuing a recent-state check-in, My Balance centers a visual reflection of usual and recent information, Chat centers the question or conversation, Learn centers browsing, and Settings centers the selected section. Secondary destinations remain available without receiving equal visual weight.

## Reduce text before reducing meaning

Use one heading and, when needed, one short supporting line. Remove labels that repeat nearby context. Keep safety-critical allergy inputs and medical boundaries available, but move explanatory, provenance, storage, and selection detail behind a user-initiated disclosure when it is not needed for the immediate decision.

## Icon-first familiar actions

Icons may stand alone for familiar actions such as Back, Send, Settings, Chat, Expand, Collapse, and Open original. A compact group of recommendation actions uses quiet labels—Done, Another, and Ask—under the primary icons so a first-time user does not have to infer the whole set. Every icon control needs:

- an explicit accessible name;
- a visible focus state;
- an approximately 44 × 44 pixel target;
- decorative, unfocusable SVG content;
- a non-color indication of active, completed, disabled, or error state.

Use visible text for less familiar actions such as Add location, Start check-in, Export local data, and destructive commands.

## Progressive disclosure

The calm default shows what is necessary to understand and act. Disclosures hold recommendation reasoning, weather details, context summaries, boundary explanations, settings controls, detailed check-in choices, full answer history, assessment coverage, full balance responses, and visualization methodology. Only one Settings section is open at once. Disclosures must not conceal information required for a safe choice.

## Space and typography

Prefer whitespace, line length, and type hierarchy over nested cards. Shared screen, section, card, and item spacing tokens establish rhythm. Body text uses a comfortable line height and reading measure; borders and shadows are reserved for controls or surfaces that truly need separation.

Use three surface roles. A **primary surface** is the single filled feature area that carries the main task on a screen. A **contextual surface** may use a quiet tint for status, safety, or focused context when separation matters. A **plain section** is the default for supporting content: open page background, deliberate spacing, and thin rules between interactive rows. Avoid placing a filled supporting surface inside another filled surface. On Today, the recommendation is primary; weather, seasonal foods, and destination links are plain supporting sections. Learn results and Settings disclosures also use ruled rows or open sections.

## Color and motion

Keep the existing warm palette. Use semantic dosha colors selectively, not as decoration for every icon. Avoid generic AI gradients, glow, glass, and heavy shadows. Motion is brief and explanatory: a small disclosure reveal, gentle pending indication, smooth message scrolling, or a completion icon settling into a faint halo in 400ms or less. Completion motion runs only for the action the user just completed; restored completion states render their final appearance without replaying it. Reduced-motion preferences show that final state immediately.

Today may use the reviewed [local daylight and ambient theme](daylight-ambient-theme.md). Its phase palettes and static sundial wash reflect regional daylight only; they never communicate wellness, balance, diagnosis, or dosha meaning. Atmosphere must retain the same information hierarchy and interaction contrast as the neutral theme.

## Mobile first

The same interaction model works from 360-pixel phones through desktop. At 390 × 844, 390 × 667, and 360 × 640:

- focused chat owns the viewport and keeps its composer visible;
- quiz actions stay above safe-area insets;
- quiz progress and exit controls remain visible while only the variable question region scrolls;
- icon action rows remain on one usable line;
- weather values stay scannable;
- context titles truncate safely;
- Settings rows retain large targets;
- Learn rows remain concise.
- My Balance rings fit side by side, six domains retain a stable 3 × 2 grid, and the fixed navigation never covers its primary action.

Desktop adds breathing room and a comfortable reading width without introducing different navigation or behavior.
