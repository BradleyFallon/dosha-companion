# Today Screen

> Calm-interface update: the validated recommendation remains fully functional, but the default view now shows one concept, one short action, and three compact controls. Guidance, reasons, related content, optional food, and Dismiss are available through one information disclosure.

## Purpose

Today is the post-assessment home and primary retention surface. It turns the latest approved profile state into one understandable focus and one practical action without requiring the user to interpret scores.

## Information hierarchy

1. Local date and greeting
2. Large recommendation icon, title, and one bounded action sentence
3. Complete, show-another, and contextual-chat icon controls
4. Visual weather summary and compact seasonal-food list when location exists
5. Two quiet shortcuts: Check in and Learn

The information control expands the full recommendation guidance, linked check-in, related article, compatible food when available, exact selection reasons, and Dismiss. Those elements do not compete with the daily focus by default.

## Content responsibility

- Editorial review status stays in structured content metadata and editor tooling rather than appearing as a repeated badge in the reader experience.
- Deterministic rules choose the underlying guidance from context, coverage, profile exclusions, and saved-time-zone time of day.
- Local conditions use the saved representative regional coordinate for current temperature, feels-like temperature, daily high/low, precipitation chance, sunrise, sunset, and a broad hemisphere-aware season. The default summary shows current conditions, high/low, and precipitation. Feels-like, daylight, season, and the saved regional name are disclosed on request. Raw selection coordinates are never used.
- Temperature display defaults from the saved country and can be overridden in Settings. Weather remains informational until separate editorial rules approve its use in guidance selection.
- “In season near you” uses the editor-owned seasonal produce catalog filtered by region, month, diet, allergies, and exclusions; it does not claim dosha compatibility.
- Without location, one benefit card explains weather, daylight, season, and nearby-food value and links to `/profile/location?return=today`. Today makes no weather call and renders no empty localized sections in this state.
- If a valid location has no mapped produce region, keep weather and show that regional food guidance is not available for the area yet.
- The recommendation information disclosure exposes the exact matched rule and states that no dosha score was used.
- The limited MVP does not place automatically generated AI prose on Today.
- The AI entry opens a separate grounded chat experience.

## Core states

| State | Behavior |
| ----- | -------- |
| Fresh profile and guidance | Show the compact recommendation hierarchy |
| Location not provided yet | Show one location-benefit card in place of all localized modules |
| Location provided | Show weather and regional-food modules |
| Current balance aging | Show guidance with an “Update your balance” question action |
| Current coverage insufficient | Prefer the next current check-in over stronger personalization |
| No higher-priority rule | Show the clearly labeled provisional general fallback |
| Loading | Keep the recommendation and shortcuts usable while local weather loads |
| Content unavailable | Keep the recommendation, seasonal content where possible, and shortcuts usable |
| AI unavailable | Keep the rest of Today intact and disable only the AI entry |
| Chat response unavailable | Preserve Today guidance and offer retry; deterministic content retrieval remains available to the mock or future client |

## Interaction details

- Complete and Show another remain direct 44 × 44 icon actions with accessible names.
- Ask about this opens a focused conversation anchored to the recommendation.
- The information icon expands secondary recommendation content inline and never exposes raw answers or numeric scoring.
- Dismiss remains functional inside the expanded details.
- Seasonal-food rows open related learning content; their separate chat icons use item-specific accessible names.
- Bottom navigation is visible on Today after the preliminary result.

## Content-length constraints for wireframing

- Today focus headline: one or two lines
- Visible action: one short bounded instruction
- Food suggestion: optional and no more prominent than the primary lifestyle action
- Relevance explanation: two to four plain-language signals

## Open prototype questions

- Is the recommendation action clear enough without the full guidance initially visible?
- Does the information control make the selection reasoning discoverable enough?
- Does the AI entry feel optional rather than required for value?
- Should completion feedback remain in the card or become even quieter?
