# MVP Scope

## Goal

Validate that users find ongoing value in:

- An expert-grounded Ayurvedic profile
- Short, practical daily guidance
- A profile that becomes more accurate and current over time
- Optional personalized conversation grounded in approved content

The MVP should establish whether users complete the initial assessment, understand their results, return for daily guidance, answer continuing questions, and find the personalized guidance useful.

## Core product loop

1. The user creates an account and provides basic profile information.
2. The user completes an initial assessment of approximately ten minutes.
3. The app presents a baseline dosha profile and an initial current-balance result.
4. The user receives short daily guidance selected from expert-approved content.
5. The user answers additional questions over time.
6. The app updates the user's current balance and refines its understanding of the user.
7. A subscriber may ask the AI assistant questions about their profile and guidance.

## Included in the MVP

### Accounts and onboarding

- Account creation
- Authentication
- Password recovery or equivalent sign-in recovery
- Basic user profile
- Consent and required wellness disclaimers
- Account and data deletion

### Assessment and profile

- Initial assessment targeting ten minutes or less
- Preliminary result after the required initial questions are complete
- Continuous Question Stream after the initial result
- Separate baseline constitution and current-balance calculations
- Versioned, deterministic scoring model
- Profile completeness or confidence indicator
- Date and freshness of the current-balance result

### User experience

- Mobile-first responsive web application
- Today screen
- Check In screen
- My Balance screen
- Learn screen
- Article view
- Account and subscription settings

### Daily guidance

- One primary daily guidance item
- Short expert-authored lesson or reflection
- One practical lifestyle suggestion when applicable
- One food-related suggestion when applicable
- Explanation of why the content is relevant to the user
- Protection against showing the same content too frequently

The underlying recommendation must come from approved content and deterministic selection rules. The LLM may personalize the explanation and presentation but must not independently invent health guidance.

### Educational content

- Foundational introduction to Ayurveda
- Explanation of doshas
- Individual explanations of Vata, Pitta, and Kapha
- Explanation of baseline constitution and current balance
- Basic food, routine, seasonal, and lifestyle concepts
- Searchable or browsable glossary
- Related-content links

### AI assistant

- Subscription-gated LLM chat
- Answers grounded in approved expert content
- Access to a limited, relevant summary of the user's profile
- Ability to explain profile results and daily recommendations
- Ability to suggest relevant approved articles
- Clear safety boundaries and refusal behavior
- Usage limits appropriate to subscription cost
- Conversation error and unavailable states

The AI assistant may launch as a clearly labeled beta feature.

### Editorial workflow

- Create and edit content
- Save drafts
- Review and approve content
- Schedule publication
- Publish and unpublish content
- Tag content by dosha, balance, topic, season, climate, and other supported categories
- Record author and expert reviewer
- Maintain basic revision history

A custom editorial application is not required. The workflow may use an existing content-management system, database administration interface, or repository-based process.

### Subscription

- One paid subscription offering
- Subscription checkout and management
- Access control for AI chat
- Clear handling of expired, canceled, and failed subscriptions
- Basic AI usage metering

## Explicitly excluded from the MVP

### Health and practitioner services

- Medical diagnosis
- Medical treatment
- Emergency guidance
- Medication recommendations or changes
- Personalized herbal or supplement prescriptions
- Condition-specific treatment plans
- Human coaching
- Practitioner messaging
- Practitioner appointments
- Practitioner marketplace

### Food and activity tracking

- Food logging
- Calorie or nutrient tracking
- Meal-photo analysis
- Grocery inventory integrations
- Exercise logging
- Habit streaks
- Detailed wellness journals

Food suggestions and general lifestyle practices are included, but behavioral tracking is not.

### Platforms and integrations

- Native iOS application
- Native Android application
- Apple Health or HealthKit
- Wearable integrations
- Electronic health-record integrations
- Precise background location tracking
- Offline application support

### Engagement systems

- Native push notifications
- Browser push notifications
- Social feeds
- Community groups
- Messaging between users
- Gamification
- Competitive streaks or leaderboards

The app may show unanswered questions and new guidance when the user opens it. Email reminders may be evaluated as a post-MVP enhancement.

### Content expansion

- Large recipe library
- Guided meditation library
- Courses
- Structured multi-week programs
- Audio lessons
- Live events
- User-generated content
- Automatically published, unreviewed AI-generated content

## Recommended initial content set

The MVP should not launch until the following content has been reviewed and approved:

- 8–12 foundational learning articles
- 25–40 glossary entries
- 20–30 initial assessment questions
- 30–50 profile-refinement questions
- 15–25 recurring current-balance questions
- At least 30 days of daily guidance
- A minimum of 10 guidance items relevant to each primary elevated dosha
- Standard safety, uncertainty, and medical-boundary language
- AI grounding material covering every topic the assistant is expected to discuss

Daily guidance may reuse evergreen content when the recommendation system prevents excessive repetition.

## Release criteria

### Assessment readiness

- The initial assessment can normally be completed in ten minutes or less.
- Every scored question has been reviewed and approved by the Ayurvedic expert.
- The scoring model has a version number.
- Baseline and current-balance scoring are kept separate.
- Skipped, missing, conflicting, and outdated answers are handled predictably.
- A set of test profiles produces results approved by the expert.
- The application can explain the general basis of a result without exposing confusing internal calculations.

### Content readiness

- The minimum initial content set is complete.
- Every published item has an identified author and reviewer.
- Every item has the required taxonomy and safety metadata.
- No unapproved draft can appear in the user application.
- Content can be corrected or unpublished without deploying a new version of the web application.
- Recently viewed content is not immediately repeated without a clear reason.

### Core user-flow readiness

A user can successfully:

- Create an account
- Complete onboarding
- Complete the initial assessment
- View their initial result
- Read daily guidance
- Answer continuing questions
- See their current balance update
- Browse foundational learning content
- Start and manage a subscription
- Use the premium AI assistant
- Delete their account and associated personal data

### AI readiness

- The assistant uses only approved retrieved content for Ayurvedic guidance.
- The assistant does not calculate or override official dosha scores.
- Medical, emergency, medication, pregnancy, pediatric, supplement, and mental-health safety cases have defined behavior.
- A documented evaluation set has been run against the production prompt and content library.
- Unsafe or unsupported responses can be reported and reviewed.
- AI failure does not prevent access to the rest of the application.
- Usage limits and cost monitoring are enabled.

### Privacy and safety readiness

- The product's wellness boundary has been reviewed.
- Required consent and disclaimer language is present.
- The privacy policy accurately describes data collection and AI processing.
- Only necessary user information is collected.
- Sensitive data is protected in transit and at rest.
- Account deletion removes or irreversibly de-identifies applicable personal data.
- The application does not use wellness-profile data for advertising.

### Quality and reliability readiness

- Primary screens work at widths from 320px through standard desktop sizes.
- The experience has been tested on current iPhone Safari and common desktop browsers.
- Keyboard navigation and basic screen-reader behavior have been reviewed.
- Loading, empty, offline, unauthorized, and error states are implemented.
- Automated tests cover scoring, access control, content publication, and subscription gating.
- Production errors and AI failures are logged without unnecessarily exposing private user information.
- The team can restore service and content after a failed deployment.

## Post-MVP candidates

- Email reminders
- Browser or native push notifications
- Personalized weekly summaries
- Balance history and trends
- Seasonal local-food recommendations
- Recipes
- Guided meditations
- Courses and learning paths
- Saved practices and lightweight goals
- Progressive Web App installation
- Native mobile applications
- Human practitioner services

## Open scope decision

Decide whether LLM-generated personalized text appears automatically on the Today screen or only after a subscriber opens the chat. This distinction materially affects cost, latency, safety review, and the shape of the free daily experience.
