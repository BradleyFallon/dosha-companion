---
id: ENG-001
title: Add continuous integration
type: implementation
status: done
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

- [x] Add a workflow for pull requests and main pushes.
- [x] Use the Node version required by the current Vite stack.
- [x] Run `npm ci`.
- [x] Install the required Playwright browser.
- [x] Run generation, typecheck, lint, tests, build, and end-to-end tests.
- [x] Document the workflow in `app/README.md`.

## Acceptance criteria

- Pull requests receive visible status checks.
- A clean checkout can run every required command.
- Generated files cannot silently drift from source data.

## Notes

- 2026-07-17: Added one Ubuntu job using Node.js 22, npm caching, and the existing Chromium-only Playwright project. No matrix, coverage gate, deployment, or third-party service was added.
- 2026-07-17: The workflow runs generation before a clean-tree diff check, followed by lint, type checking, unit/component tests, the production build, Chromium installation, and the full end-to-end suite.
- 2026-07-17: The complete workflow sequence passed locally: generated files were stable, 167 unit/component tests passed, 14 Playwright tests passed, and the production build completed with only its existing chunk-size warning.
- 2026-07-17: The GitHub-hosted run remains the final environment check after the workflow is pushed.
