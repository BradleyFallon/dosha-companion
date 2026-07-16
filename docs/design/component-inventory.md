# Component Inventory

## Purpose

This is a low-fidelity inventory of reusable interaction patterns. Names describe responsibility, not final code or visual styling.

## Global structure

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| App header | Product identity, back, close, or settings action | Default, focused flow, offline |
| Bottom navigation | Today, Questions, My Balance, Learn | Hidden during onboarding/assessment; active destination; badge |
| Page title block | Heading and concise orientation | Default, with status, with last-updated text |
| Primary action | Advance or complete the main task | Default, disabled, loading, success |
| Secondary action | Alternate path without competing with primary | Default, disabled |
| Text action | Back, skip, learn more, or dismiss | Default, destructive where appropriate |
| Inline status | Saved, saving, offline, error, last updated | Neutral, pending, error, recovered |

## Onboarding and forms

| Component | Purpose | Key states |
| --------- | ------- | ---------- |
| Step indicator | Show profile-setup step and total | Current, complete |
| Text field | Preferred name or constrained location entry | Empty, filled, error, disabled |
| Select field | Age band, region, dietary pattern, units | Closed, open, selected, error |
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
| Current-balance summary | Quick recent-state orientation | Fresh, stale, unavailable |
| Daily-focus card | Approved lesson and relevance explanation | Available, loading, fallback, error |
| Practical-action card | One bounded action | Available, alternative, not applicable |
| Food suggestion | Optional compatible suggestion | Available, excluded, not applicable |
| “Why chosen” disclosure | Explain deterministic selection signals | Collapsed, expanded |
| Question availability | Show useful questions without pressure | Count, none, stale-profile prompt |
| AI entry card | Open grounded assistant | Subscriber, free-user gate, unavailable |

## Feedback and system states

Every major surface needs:

- Skeleton/loading state that preserves layout
- Empty state with a useful next action
- Inline recoverable error
- Full-page unavailable state when required data cannot load
- Offline state that distinguishes cached reading from unsaved actions
- Unauthorized/session-expired state with a safe return path

