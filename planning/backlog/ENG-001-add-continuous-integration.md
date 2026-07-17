---
id: ENG-001
title: Add continuous integration
type: implementation
status: backlog
priority: P1
area: engineering
created: 2026-07-17
updated: 2026-07-17
owner:
depends_on: []
related:
  - app/package.json
  - app/playwright.config.ts
---

# Add continuous integration

## Why

The prototype has substantial generation, unit, component, build, and browser coverage, but pushes currently have no repository status checks.

## Desired outcome

Every pull request and main-branch push proves that generated data, type checking, linting, tests, the production build, and the core Playwright flow succeed.

## Scope

- GitHub Actions workflow
- Node dependency caching
- Quiz and content generation
- Typecheck, lint, unit tests, build, and Playwright
- Useful failure output

## Tasks

- [ ] Add a workflow for pull requests and main pushes.
- [ ] Use the Node version required by the current Vite stack.
- [ ] Run `npm ci`.
- [ ] Install the required Playwright browser.
- [ ] Run generation, typecheck, lint, tests, build, and end-to-end tests.
- [ ] Document the workflow in `app/README.md`.

## Acceptance criteria

- Pull requests receive visible status checks.
- A clean checkout can run every required command.
- Generated files cannot silently drift from source data.
