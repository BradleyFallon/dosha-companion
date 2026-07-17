clean up the learn tab to have horizontal scrolling cards with topical rows, such as a row about the doshas and a row about nutrition

make some sort of sundial effect and adjust the brigntess based on the where we are at in the sunrise/sunset. If we are around sunset, we can use sunset color theme, if we are at twilight, do that and use low blue light. At night we want dark mode. In the morning resemble sunrise. Mid day should be neutral and warm. we want to make the app feel like it connects you to the world around you.

# Experience Polish Backlog

## Purpose

This backlog tracks design work intended to make Dosha Companion feel calm, connected to the natural world, emotionally rewarding, and pleasant to use even before considering its functional value.

The desired experience is:

* Quiet rather than empty
* Warm rather than clinical
* Connected to the user’s local time and surroundings
* Simple without becoming ambiguous
* Gently responsive without becoming distracting
* Joyful without relying on pressure, streaks, confetti, or excessive gamification

Guiding principle:

> Nothing should demand attention, but everything should reward attention.

## Backlog conventions

### Priority

* **P0:** Current or next work package
* **P1:** High-value follow-up
* **P2:** Requires additional product or design exploration
* **Deferred:** Intentionally not planned yet

### Status

* `ready`
* `in_progress`
* `needs_design`
* `needs_product_definition`
* `blocked`
* `deferred`
* `complete`

---

# Work package 1: Typography

* **Priority:** P0
* **Status:** `in_progress`

## Goal

Give the interface a more authored, warm, and reflective character while preserving clarity and usability.

## Direction

Use two complementary typography roles:

* A highly readable sans-serif for controls, questions, forms, navigation, metadata, and safety language
* A restrained editorial or humanist display typeface for selected emotional and content-focused moments

## Candidate uses for display typography

* Welcome headline or tagline
* Today greeting
* Daily recommendation title
* Learning article titles
* Selected result or reflection headings
* Possibly the My Balance page title

## Keep in sans-serif

* Assessment questions and answers
* Buttons and links
* Navigation
* Forms
* Check-in controls
* Status messages
* Explanatory metadata
* Safety and privacy language

## Tasks

* [ ] Select the display typeface.
* [ ] Confirm licensing and web-delivery requirements.
* [ ] Add typography design tokens.
* [ ] Define mobile type scale.
* [ ] Define line-height and letter-spacing rules.
* [ ] Apply display typography to Welcome.
* [ ] Apply display typography to Today.
* [ ] Apply display typography to Learn article titles.
* [ ] Test at 320px, 360px, and 390px.
* [ ] Test browser zoom at 200%.
* [ ] Confirm that long titles wrap gracefully.
* [ ] Confirm no layout shifts while fonts load.
* [ ] Respect system fallback when the font fails to load.

## Acceptance criteria

* The interface feels more personal and editorial without looking decorative or themed.
* Questions and controls remain immediately readable.
* No screen depends on a specific font successfully loading.
* Font loading does not cause disruptive movement.
* The app uses no more than two primary type families.

---

# Work package 2: Local daylight and ambient theme

* **Priority:** P0
* **Status:** `needs_design`
* **Dependency:** Typography work package should be substantially complete first.

## Goal

Make the app feel subtly connected to the user’s physical world by adapting its atmosphere to local daylight, sunrise, sunset, twilight, and night.

This should feel like ambient light entering the interface rather than a conventional theme switch.

## Core states

### Pre-dawn

* Very dark, warm-neutral interface
* Minimal blue light
* Muted amber or deep rose accent
* Low decorative contrast
* No bright white surfaces

### Sunrise

* Warm peach, pale gold, and muted rose atmosphere
* Gradual increase in surface brightness
* Soft directional light effect near the top of the screen
* Avoid saturated orange gradients

### Morning

* Warm, clear paper tones
* Subtle golden or cream light
* Fresh but not bright or energetic

### Midday

* Neutral warm daylight
* Highest overall brightness
* Minimal atmospheric tint
* Clear paper and natural green accents

### Late afternoon

* Slightly warmer and softer than midday
* Gentle reduction in contrast
* Subtle amber tint

### Sunset

* Muted gold, clay, rose, or lavender atmosphere
* Directional sundial-style light or shadow effect
* Warm surfaces without reducing legibility

### Twilight

* Darkening violet, muted plum, deep green, and warm gray
* Reduced blue-heavy whites
* Lower visual intensity
* Transition toward night appearance

### Night

* Full dark appearance
* Deep warm charcoal rather than pure black
* Warm cream text rather than pure white
* Low-saturation accents
* No glowing gradients or high-intensity blue

## Sundial concept

The interface may include a subtle ambient light position based on the user’s progress through the local daylight period.

Possible implementation:

* Represent the sun as an off-screen light source.
* Move a very soft radial wash horizontally across the upper page during daylight.
* Adjust its vertical position around sunrise and sunset.
* Allow a faint opposing shadow or warm edge to suggest direction.
* Keep all ambient treatment behind content and below the threshold of conscious distraction.

The visual must not resemble a literal weather animation or an interactive clock.

## Data and fallback behavior

Preferred source order:

1. Saved regional location and current sunrise/sunset information
2. Saved time zone with broad clock-based states
3. Browser-local time
4. Static neutral warm theme

The app must remain usable when weather or daylight data is unavailable.

## Theme calculation

Define a deterministic function based on:

* Local current time
* Sunrise
* Sunset
* Optional civil-twilight boundaries
* Reduced-motion preference
* User appearance override, if later introduced

Avoid abrupt state changes at exact clock boundaries. Use gradual interpolation where practical.

## Tasks

* [ ] Write a daylight-theme design specification.
* [ ] Define named theme phases.
* [ ] Define color tokens for each phase.
* [ ] Define how surface brightness changes.
* [ ] Define how text contrast is maintained.
* [ ] Prototype the sundial light treatment on Today.
* [ ] Add night appearance.
* [ ] Add twilight appearance with reduced blue light.
* [ ] Add sunrise and sunset appearances.
* [ ] Add midday neutral appearance.
* [ ] Add a data-unavailable fallback.
* [ ] Avoid requesting location solely for appearance.
* [ ] Use existing saved regional location when available.
* [ ] Test transitions around sunrise and sunset.
* [ ] Test very short winter days and long summer days.
* [ ] Test Northern and Southern Hemisphere locations.
* [ ] Test polar-day or polar-night fallback behavior.
* [ ] Verify contrast in every state.
* [ ] Respect `prefers-reduced-motion`.
* [ ] Avoid continuous animation or timers that waste power.
* [ ] Add unit and visual-regression tests for theme-phase selection.

## Acceptance criteria

* Users can feel a time-of-day difference without the interface becoming theatrical.
* Text and controls retain appropriate contrast in every phase.
* Night mode is comfortable in a dark room.
* The app does not require location permission to function.
* Theme changes do not imply health or dosha meaning.
* No abrupt flash occurs when opening or refreshing the app.
* Sunrise and sunset states are clearly related but visually distinct.
* Midday remains simple and neutral.

---

# Work package 3: Small visible action labels

* **Priority:** P1
* **Status:** `ready`

## Goal

Keep icon-based controls visually light while providing low-contrast text that helps users understand unfamiliar actions without experimentation.

## Initial targets

### Today recommendation actions

Add subtle labels for:

* Complete
* Another
* Ask

Possible presentation:

```text
✓
Done

↻
Another

◌
Ask
```

The icon remains visually primary. The label is small, quiet, and always visible.

### Other possible targets

* Weather details
* Balance-domain actions
* Check-in completion controls
* Chat-context actions
* Less familiar icon-only settings controls

## Rules

* Familiar navigation icons may remain icon plus standard navigation label.
* Destructive or consequential actions must use visible text.
* Labels must not reduce touch targets.
* Labels must remain legible at 200% zoom.
* Accessible names must not depend on the visible label alone.
* Avoid tooltips as the primary explanation on touch devices.

## Tasks

* [ ] Add labels beneath Today action icons.
* [ ] Evaluate whether `Done` or `Complete` is clearer.
* [ ] Evaluate whether `Another` or `Show another` is clearer.
* [ ] Review all icon-only controls for familiarity.
* [ ] Add labels only where they reduce uncertainty.
* [ ] Test action-row width at 320px.
* [ ] Confirm labels do not wrap awkwardly.
* [ ] Add usability test question: “What do you expect each action to do?”

## Acceptance criteria

* A first-time user can identify the recommendation actions without tapping them.
* The action row remains visually quiet.
* The three actions fit comfortably at supported mobile widths.
* No action relies on hover or tooltip behavior.

---

# Work package 4: Reduce dashboard and card styling

* **Priority:** P1
* **Status:** `needs_design`

## Goal

Make the app feel like a calm, responsive page rather than a collection of bordered widgets.

## Direction

Use fewer explicit cards and rely more on:

* Whitespace
* Typography
* Thin separators
* Background tone
* Alignment
* Section rhythm

## Surface hierarchy

### Primary feature surface

Reserved for one dominant item, such as:

* Today’s recommendation

### Soft contextual surface

Used selectively for:

* Current weather
* Opened recommendation details
* Selected detail or explanation
* Important safety or error information

### Plain page content

Use for:

* Seasonal foods
* Check-in history
* Learning lists
* Settings rows
* Secondary destinations
* Metadata and supporting information

## Initial targets

* [ ] Remove or soften the border around “In season near you.”
* [ ] Present seasonal foods as a simple ruled list.
* [ ] Review Today shortcuts for unnecessary card treatment.
* [ ] Review Learn results for excessive repeated rectangles.
* [ ] Review Settings panels for nested backgrounds.
* [ ] Review location-benefit presentation.
* [ ] Standardize when shadows are permitted.
* [ ] Standardize when a border is permitted.
* [ ] Limit the number of distinct surfaces visible at once.

## Acceptance criteria

* Today has one clear primary visual surface.
* Secondary sections do not compete with the daily recommendation.
* The page remains scannable without enclosing every section.
* Interactive elements remain visually identifiable.

---

# Work package 5: Joyful completion motion

* **Priority:** P1
* **Status:** `needs_design`

## Goal

Create small, emotionally rewarding moments that acknowledge effort and provide closure without introducing pressure or game mechanics.

## Initial moments

### Check-in completion

Possible sequence:

1. Progress marks settle or softly converge.
2. A completion ring or line resolves.
3. The completion icon appears.
4. “Check-in saved” fades into place.
5. Review and Done actions remain available.

### Daily recommendation completion

Possible sequence:

1. Completion icon transitions from outline to filled.
2. Recommendation surface becomes slightly quieter.
3. “Complete for today” appears.
4. Undo remains available when practical.

### Initial assessment completion

Possible sequence:

1. Repeated question rhythm pauses.
2. A calm transition acknowledges completion.
3. The result or summary is introduced without confetti.

## Motion principles

* Reward completion, not usage volume.
* Avoid streaks, points, levels, badges, or urgency.
* Keep primary motion under approximately 400ms.
* Do not delay navigation or completion.
* Do not animate every ordinary tap.
* Avoid bounce-heavy or spring-heavy motion.
* Never use visual celebration for sensitive disclosures.
* Respect reduced-motion preferences.
* Use opacity and small positional changes before scaling or rotation.
* Preserve the final layout throughout the animation.

## Tasks

* [ ] Storyboard check-in completion.
* [ ] Storyboard recommendation completion.
* [ ] Create reduced-motion equivalents.
* [ ] Define shared motion tokens.
* [ ] Implement the check-in completion moment first.
* [ ] Test whether the animation feels calming rather than childish.
* [ ] Add visual tests for final state.
* [ ] Ensure screen-reader announcements are not delayed by animation.

## Acceptance criteria

* Completion feels acknowledged and satisfying.
* The animation never blocks the next action.
* Repeating the action does not become irritating.
* Reduced-motion users receive the same information without unnecessary movement.
* No completion treatment resembles a productivity streak or game reward.

---

# Product exploration: My Balance purpose

* **Priority:** P2
* **Status:** `needs_product_definition`

## Reason for pause

Do not continue styling or substantially changing My Balance until the product purpose is clearer.

The current implementation is thoughtful, but the team does not yet have a sufficiently clear answer to:

* What does the user need to understand here?
* Why would the user open this screen?
* What decisions or actions should it support?
* What should change after a check-in?
* What information is useful without approved dosha scoring?
* What belongs on My Balance versus Check In or Today?
* How much history is meaningful?
* Is the primary value reflection, comparison, education, or action?
* What should the user feel after viewing the screen?

## Discovery questions

### User intent

* Is the user asking, “How am I doing?”
* Are they asking, “What has changed?”
* Are they asking, “What is usually true for me?”
* Are they asking, “What should I pay attention to?”
* Are they asking, “Why did the app recommend this?”
* Are they asking, “What have I told the app?”

### Product action

* Should the screen lead to a check-in?
* Should it lead to supporting guidance?
* Should it support reviewing or correcting answers?
* Should it support discussing one area in chat?
* Should it summarize change over time?
* Should it remain primarily informational?

### Information hierarchy

* Is usual versus recent the primary distinction?
* Are sleep, appetite, energy, digestion, routine, and stress the correct primary domains?
* Is category coverage useful to users or mainly an internal concept?
* Are segmented rings understandable without resembling progress meters?
* Are comparison states meaningful enough to deserve a graphical system?

## Research tasks

* [ ] Conduct internal product workshop.
* [ ] Write three possible My Balance jobs-to-be-done.
* [ ] Create low-fidelity alternatives for each job.
* [ ] Test the current screen with users before further polish.
* [ ] Ask users what they believe the rings mean.
* [ ] Ask users what they expect to happen after another check-in.
* [ ] Determine whether timeline history supports a real user need.
* [ ] Decide whether My Balance is an MVP feature or prototype experiment.
* [ ] Update product and screen specifications after the purpose is resolved.

## Constraint during discovery

Only make necessary accessibility, bug, and clarity fixes. Avoid further decorative polish or new visualization logic until the screen’s purpose is defined.

---

# Design note: focused domain detail

* **Priority:** P2
* **Status:** `needs_product_definition`

## Idea being recorded

When a user selects a domain such as Sleep, the detailed information could appear as either:

1. A focused full page, or
2. A mobile bottom sheet

The current experience opens detail below the domain grid. A focused presentation could reduce layout shifting and let the user concentrate on one area.

## Full-page concept

```text
< My Balance

          Sleep icon

             Sleep

Recent
Light and interrupted

Usual
Light and variable

≈ Close to usual

Ask about this

View original responses
```

## Bottom-sheet concept

The current page remains visible behind a panel that rises from the bottom and contains the selected domain information.

## Questions to resolve

* Is domain detail important enough to deserve a full route?
* Should selecting another domain require returning to the grid?
* Does a sheet preserve useful spatial context?
* Does a full page feel calmer and more accessible?
* How should browser Back behave?
* Is comparison itself actually a supported user need?

No implementation should begin until the broader My Balance purpose has been clarified.

---

# Deferred items

## Welcome mark redesign

* **Status:** `deferred`

The temporary welcome mark is acceptable for the current prototype. Do not invest in custom brand artwork until typography, ambient theme, and primary product testing provide a clearer visual direction.

## Broader balance-dashboard polish

* **Status:** `deferred`

Do not refine rings, domain symbols, timeline visuals, or comparison graphics beyond required clarity and accessibility work until the My Balance discovery is complete.

---

# Suggested sequence

## Current

1. Finish typography.
2. Test typography on Welcome, Today, and Learn.
3. Record typography decisions and tokens.

## Next

4. Design the daylight and sundial theme system.
5. Implement time-of-day atmosphere on Today.
6. Add dark night appearance and twilight state.
7. Validate contrast and location-independent fallback behavior.

## Follow-up polish

8. Add small visible labels to recommendation actions.
9. Reduce unnecessary card and border styling.
10. Design and implement check-in completion motion.

## Parallel discovery

11. Pause My Balance visual development.
12. Define its jobs-to-be-done and intended interactions.
13. Test the current concept with users.
14. Decide whether domain detail should use a focused page, sheet, or remain inline.

---

# Success measures

The experience-polish work is successful when:

* Users describe the app as calming, warm, or pleasant without being prompted.
* Users understand primary actions without experimentation.
* Opening the app at different times feels subtly appropriate to the surrounding world.
* Night use feels comfortable and avoids harsh blue-white surfaces.
* Animation provides closure without introducing pressure.
* Secondary information remains available without competing for attention.
* The interface feels less like a dashboard and more like a calm personal publication.
* Visual atmosphere never implies medical, dosha, or emotional conclusions.
