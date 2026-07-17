# Component Inventory

## Purpose

This is a low-fidelity inventory of reusable interaction patterns. Names describe responsibility, not final code or visual styling.

## Global structure

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| App header | Product identity, back, close, or settings action | Default, focused flow, offline |
| Bottom navigation | Today, Check In, My Balance, Learn | Hidden during onboarding, assessment, and active check-ins; active destination |
| Page title block | One dominant heading with only essential orientation | Default, with compact status |
| Primary action | Advance or complete the main task | Default, disabled, loading, success |
| Secondary action | Alternate path without competing with primary | Default, disabled |
| Text action | Back, skip, learn more, or dismiss | Default, destructive where appropriate |
| Icon control | Familiar compact action with an explicit accessible name | Default, focus, active/completed, disabled |
| Disclosure control | Reveal secondary explanation without crowding the default view | Collapsed, expanded |
| Inline status | Saved, saving, offline, error, last updated | Neutral, pending, error, recovered |

## Onboarding and forms

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Step indicator | Show profile-setup step and total | Current, complete |
| Text field | Preferred name, year of birth, or optional manual locality backup | Empty, filled, error, disabled |
| Select field | Dietary pattern | Closed, open, selected, error |
| Location chooser | One-shot device lookup, map pin, or city search | Prompting, locating, permission denied, selected, adjusted |
| Multi-select chips/list | Allergies and exclusions | None selected, selected, expanded |
| Consent row | Terms, privacy, and wellness acknowledgment | Unchecked, checked, error |

## Assessment

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Section label | “Your usual nature” or “Your current balance” | Baseline, current, context |
| Question progress | “Question 8 of 27” plus progress bar | Normal, resumed, near complete |
| Question prompt | Time-aware question and optional help | Default, help expanded |
| Answer option | Large single-select choice | Default, pressed, selected, disabled |
| Fallback answer | “Not sure” or equivalent stored response | Default, selected |
| Skip action | Defer without answering | Available, confirmation for required coverage |
| Assessment footer | Back, Continue, save/exit | Continue disabled/enabled, saving, offline |
| Section transition | Reset time frame between sections | Baseline complete, current introduction |
| Assessment management row | Open focused initial-assessment maintenance from Check In | Complete, questions remaining |
| Coverage disclosure | Reveal plain-language assessment completeness details | Collapsed by default, expanded |

## Check In

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Primary check-in prompt | Start the quick recent-state check-in or resume unfinished work | Ready to start, incomplete with answer count |
| More-options disclosure | Reveal the detailed check-in without competing with the primary action | Collapsed, expanded |
| Completed check-in row | Open a dated summary or contextual chat | Latest, recent, history list |
| Check-in question header | Finish later and communicate progress with minimal chrome | Question position, final question |
| Check-in answer row | Preserve native radio behavior in a quiet, large target | Default, focused, selected |
| Check-in summary | Confirm persistence and offer one primary return action | Just completed, reopened |
| Answer disclosure | Reveal the stored question-and-answer list | Collapsed, expanded |
| Check-in information | Explain assessment separation and scoring boundary | Collapsed, expanded |

## Results and balance

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Profile-stage badge | Preliminary, Developing, Well established | Current stage with plain explanation |
| Nature card | Baseline label and explanation | Available, needs more baseline information |
| Current-balance card | Recent label, date, and freshness | Fresh, aging, stale, needs answers |
| Dosha comparison | Accessible three-part relative visualization | Baseline, current; data table/text fallback |
| Completeness summary | Coverage and next useful action | Preliminary, developing, established |

## Today and content

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Daily recommendation | One large concept, short action, and three compact actions | Available, completed, rotating, fallback |
| Recommendation details | Guidance, linked check-in/article, optional food, reasons, and dismiss | Collapsed by default, expanded |
| Weather summary | Visual current condition, high/low, and precipitation | Loading, available, unavailable |
| Weather details | Feels-like, sunrise, sunset, season, and forecast area | Collapsed by default, expanded |
| Seasonal food row | Open related learning content or ask about one regional item | Filtered item, no region, no matches |
| Today shortcut | Quiet route to Check in or Learn | Default, recent check-in |
| Chat entry action | Start a conversation anchored to the visible item | Recommendation, article, seasonal food, completed check-in |
| Chat context bar | Identify, expand, return to, or open the source | Collapsed, expanded, source unavailable |
| Chat message | Present user or grounded assistant content in an open layout | Pending, complete, boundary, error/retry |
| Chat citations | Link an answer to retrieved in-app sources | Article, glossary, recommendation, seasonal food |
| Chat composer | Send a question without moving off the source context | Blank, ready, pending, character limit |
| Conversation history | Reopen browser-local threads | Empty, recent threads, cleared |
| Learn row | Scan and open an article by semantic icon and title | Default, filtered |
| Settings row | Open exactly one focused settings section | Collapsed, expanded, value summary |

## Feedback and system states

Every major surface needs:

- Skeleton/loading state that preserves layout
- Empty state with a useful next action
- Inline recoverable error
- Full-page unavailable state when required data cannot load
- Offline state that distinguishes cached reading from unsaved actions
- Unauthorized/session-expired state with a safe return path
