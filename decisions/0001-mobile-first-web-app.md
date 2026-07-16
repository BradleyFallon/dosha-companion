# 0001: Launch as a Mobile-First Web App

- Status: Proposed
- Date: 2026-07-15
- Decision owners: TODO

## Context

The first release needs to validate onboarding, repeated lightweight assessment, daily content, and subscription-gated AI guidance across common mobile devices without maintaining multiple native applications.

## Decision

Launch the MVP as a mobile-first responsive web app, designed primarily around a 390 px viewport and supporting widths down to 320 px.

## Reasoning

- One delivery surface reduces initial implementation and release overhead.
- A web app is broadly accessible through a link and supports rapid product iteration.
- The core MVP flows do not currently require native-only capabilities.
- Responsive design can support larger screens without changing the primary mobile interaction model.

## Alternatives considered

### Native iOS application

Could provide stronger platform integration and distribution, but would narrow initial reach and create native-specific delivery work.

### Native iOS and Android applications

Could offer the fullest platform-specific experience, but introduces the greatest implementation, testing, and release overhead before product value is validated.

### Desktop-first web application

Would under-prioritize the expected daily, on-the-go use pattern and make later mobile adaptation more costly.

## Consequences

- All critical actions must work with touch, keyboard, and assistive technologies.
- The product cannot depend on hover or desktop-sized layouts.
- Browser support and responsive behavior require explicit launch criteria. Installation, notifications, and offline support are deferred and require later decisions.
- Native integrations may be limited or deferred.

## Conditions for reconsidering a native app

- Validated demand for platform features unavailable or unreliable on the web
- Retention benefits that justify native investment
- App-store distribution becomes strategically important
- Offline, notification, sensor, or health-platform integrations become core requirements
- The team can support native release, accessibility, privacy, and maintenance obligations
