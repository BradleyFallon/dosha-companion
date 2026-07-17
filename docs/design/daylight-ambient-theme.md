# Local Daylight and Ambient Theme

## Purpose

Today should feel quietly related to the user’s local daylight without becoming a weather animation, literal clock, or wellness interpretation. The atmosphere changes the page’s light; it does not classify the user, their health, or their dosha.

The first implementation uses a hybrid system:

- reviewed, discrete palettes preserve predictable contrast;
- a static directional wash reflects progress through local daylight;
- no element moves continuously;
- the rest of the application retains the neutral warm theme during this prototype phase.

## Initial phases

The first pass deliberately limits the visual range to four phases.

### Midday

The existing warm paper palette remains authoritative. A low-opacity golden wash moves across the top of Today according to daylight progress.

### Sunset

Paper and supporting surfaces become warmer, with muted clay light and softened separators. Sunset begins before the saved sunset time so the change feels atmospheric rather than like a clock alarm.

### Twilight

Surfaces shift to warm charcoal, plum, and deep green. Text remains warm cream rather than pure white. Twilight is used shortly before sunrise and after the sunset interval.

### Night

The page uses deep warm charcoal, restrained green accents, and the lowest ambient-light opacity. Night avoids pure black, pure white, bright blue surfaces, and luminous gradients.

Sunrise, morning, and late-afternoon palettes may be added after the four-state prototype is evaluated.

## Phase calculation

`app/src/daylight/model.ts` is the pure source of phase selection. It receives the current instant, saved time zone, and optional sunrise and sunset strings.

With solar data:

- twilight begins 45 minutes before sunrise;
- midday begins at sunrise;
- sunset begins 60 minutes before sunset;
- twilight begins 30 minutes after sunset;
- night begins 90 minutes after sunset.

These boundaries are presentation rules rather than astronomical or health claims. They can be revised without changing weather retrieval.

The ambient position is clamped between 12% and 88% of the page width. It represents where the soft light source is placed, not a measured value shown to the user.

## Data and privacy

The environment uses the same saved regional location and the same forecast response as Today’s weather card. It never reads raw device coordinates or map-pin coordinates.

Fallback order:

1. Saved regional time zone with forecast sunrise and sunset
2. Saved regional time zone with broad clock phases
3. Browser-local time
4. Static neutral midday when the supplied clock is invalid

Weather failure does not disable Today. The time-zone or browser fallback remains available, and the recommendation, navigation, and seasonal content continue to work.

## Runtime behavior

The app calculates the atmosphere when Today opens. It recalculates when:

- sunrise and sunset finish loading;
- the page returns to the foreground;
- the browser window regains focus;
- the next phase boundary is reached.

One timeout is scheduled for the next boundary. There is no animation loop or continuously moving sun. CSS transitions only soften palette replacement, and reduced-motion preferences effectively remove them.

## Styling contract

The app frame exposes:

```text
data-daylight-phase="midday | sunset | twilight | night"
data-daylight-source="solar | timezone | browser | neutral"
--ambient-x
```

Phase selectors override semantic variables such as:

```text
--paper
--ink
--muted
--line
--accent
--surface-raised
--surface-feature
--surface-shortcut
--supporting-ink
--weather-ink
--nav-background
```

Components must use semantic variables rather than phase-specific colors. The decorative wash is a CSS pseudo-element behind Today’s content and has no accessibility semantics.

## Accessibility

- Primary text, secondary text, controls, and focus indicators require contrast review in every phase.
- Phase is never communicated as user-facing status and is not required to understand content.
- Color does not encode recommendation meaning, success, danger, balance, or dosha.
- The page remains complete when the wash is absent or custom properties are unsupported.
- Reduced-motion preferences suppress meaningful transition duration.
- The theme does not request location permission solely for appearance.

## Testing

Pure tests cover solar phases, daylight positioning, time-zone fallback, browser fallback, invalid input, and next-boundary scheduling.

Component tests verify that:

- Today receives the daylight theme;
- the completed regional forecast becomes the solar source;
- the ambient position is passed through a CSS variable;
- users without a saved location receive the browser-time fallback;
- weather loading and failure leave Today usable.

Visual checks should cover the four phase classes at 390 × 844, 390 × 667, and 360 × 640, plus browser zoom and reduced motion.

## Future evaluation

Before extending the theme across all routes, evaluate:

- whether users notice a suitable time-of-day difference without distraction;
- whether night mode is comfortable in a dark room;
- whether sunset and twilight feel distinct;
- whether the ambient wash is too subtle or too decorative;
- whether the same atmosphere should persist into Check In, Learn, and My Balance;
- whether an explicit appearance override is needed in Settings.
