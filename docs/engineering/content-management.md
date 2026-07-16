# Content Management

> Status: Repository-backed demo workflow implemented.

Editors author Markdown and JSON under `content/`. A generator validates references and controlled fields, then writes `app/src/generated/contentCatalog.ts`. Screens access it only through `app/src/content/repository.ts`, which provides article loading, search, recommendation loading, glossary access, and check-in sets.

This is intentionally not a CMS. Git provides review and version history. `draft` hides unfinished work, `published` exposes it, and `withdrawn` removes it from the application without deleting history. `provisional` and `approved` are separate from publication state; current catalog entries are provisional.

Local preview is `cd app && npm run dev`. Generation runs before development, tests, E2E, and builds. Invalid IDs, metadata, controlled values, dietary/safety fields, or internal references stop generation with a file/item-specific error.

Production roles, named approval records, scheduled publishing, localization, media management, emergency withdrawal operations, and a remote delivery API remain future work.
