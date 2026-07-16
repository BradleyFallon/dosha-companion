# Mobile Web Design

## Platform decision

The MVP is a mobile-first responsive web app. See `decisions/0001-mobile-first-web-app.md`.

## Responsive targets

- Primary design viewport: approximately 390 px wide
- Minimum supported width: 320 px
- Maximum desktop content width: TODO after layout testing
- Content should reflow without horizontal scrolling at supported widths.

## Interaction principles

- Use large tap targets; target at least 44 by 44 CSS pixels unless an approved accessibility standard requires more.
- Minimize typing, especially during onboarding and daily check-ins.
- Use persistent bottom navigation for primary mobile destinations.
- Do not make any action depend on hover.
- Keep primary actions reachable and visually stable during loading.
- Preserve user answers when navigating or recovering from an error.

## Accessibility

- Support keyboard and assistive-technology navigation.
- Maintain readable type, contrast, zoom, and reflow.
- Do not communicate dosha, confidence, errors, or subscription status through color alone.
- Respect reduced-motion preferences.
- Provide explicit labels and instructions for quiz controls.

## Initial navigation

The proposed primary destinations are Today, Questions, My Balance, and Learn, with a clear entry point to the AI assistant.

## Validation

- TODO: Define supported browsers and devices.
- TODO: Test at 320 px, 390 px, large mobile, tablet, and desktop widths.
- TODO: Set the desktop content-width token.
- TODO: Run accessibility and one-handed-use reviews on critical flows.

