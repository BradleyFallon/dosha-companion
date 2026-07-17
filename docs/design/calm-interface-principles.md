# Calm Interface Principles

## One idea at a time

Each primary screen has one dominant purpose. Today centers the recommendation, Chat centers the question or conversation, Learn centers browsing, and Settings centers the selected section. Secondary destinations remain available without receiving equal visual weight.

## Reduce text before reducing meaning

Use one heading and, when needed, one short supporting line. Remove labels that repeat nearby context. Keep safety-critical allergy inputs and medical boundaries available, but move explanatory, provenance, storage, and selection detail behind a user-initiated disclosure when it is not needed for the immediate decision.

## Icon-first familiar actions

Icons may stand alone for familiar actions such as Back, Send, Complete, Show another, Settings, Chat, Expand, Collapse, and Open original. Every icon-only control needs:

- an explicit accessible name;
- a visible focus state;
- an approximately 44 × 44 pixel target;
- decorative, unfocusable SVG content;
- a non-color indication of active, completed, disabled, or error state.

Use visible text for less familiar actions such as Add location, Start check-in, Export local data, and destructive commands.

## Progressive disclosure

The calm default shows what is necessary to understand and act. Disclosures hold recommendation reasoning, weather details, context summaries, boundary explanations, and settings controls. Only one Settings section is open at once. Disclosures must not conceal information required for a safe choice.

## Space and typography

Prefer whitespace, line length, and type hierarchy over nested cards. Shared screen, section, card, and item spacing tokens establish rhythm. Body text uses a comfortable line height and reading measure; borders and shadows are reserved for controls or surfaces that truly need separation.

## Color and motion

Keep the existing warm palette. Use semantic dosha colors selectively, not as decoration for every icon. Avoid generic AI gradients, glow, glass, and heavy shadows. Motion is brief and explanatory: a small disclosure reveal, gentle pending indication, and smooth message scrolling. Reduced-motion preferences shorten or remove those effects.

## Mobile first

The same interaction model works from 360-pixel phones through desktop. At 390 × 844, 390 × 667, and 360 × 640:

- focused chat owns the viewport and keeps its composer visible;
- quiz actions stay above safe-area insets;
- icon action rows remain on one usable line;
- weather values stay scannable;
- context titles truncate safely;
- Settings rows retain large targets;
- Learn rows remain concise.

Desktop adds breathing room and a comfortable reading width without introducing different navigation or behavior.
