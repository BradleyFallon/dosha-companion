# Content editor guide

This directory is the editable source for the mobile demo. Editors change content here; they do not need to edit React components.

All current entries keep an internal `status: "provisional"` until the product's review process is complete. That editorial status is available in the source and editor tooling but is not repeated as a badge in the reader experience. Do not change an item to `approved` until the review and approval process is complete.

## Where content lives

- `content/learn/*.md`: long-form Learn articles.
- `content/recommendations/recommendations.json`: Today recommendations and their selection metadata.
- `content/glossary/glossary.json`: glossary terms used by Learn and Guided help.
- `content/check-ins/check-in-sets.json`: repeatable check-in sets referencing canonical current questions.
- `data/quiz/`: canonical question wording and answer options. Do not copy question text into content files.

Generated files under `app/src/generated/` are build output. Never edit them directly.

## Add or edit an article

Copy an existing file in `content/learn/`. The first block must contain valid JSON between `---` lines:

```md
---
{"id":"steady-routines","title":"Steady routines","summary":"A short list description.","category":"daily-practice","tags":["routine"],"status":"provisional","publicationStatus":"published","relatedArticleIds":["routine-and-consistency"]}
---

Article copy starts here.
```

Required fields:

- `id`: unique lowercase kebab-case ID. Changing it breaks links, so treat it as permanent.
- `title` and `summary`: visible in Learn and search.
- `category`: `foundations`, `doshas`, `assessment`, `daily-practice`, or `using-the-app`.
- `tags`: values already accepted by `app/scripts/generate-content.mjs`.
- `status`: `provisional` or `approved`.
- `publicationStatus`: `draft`, `published`, or `withdrawn`. Only `published` is shown.
- `relatedArticleIds`: valid article IDs; an empty array is allowed.

The simple renderer supports `##` headings, paragraphs, `-` lists, and `**bold text**`. Raw HTML is not rendered.

## Add or edit a recommendation

Edit the JSON array in `content/recommendations/recommendations.json`. Each recommendation requires:

- a stable unique `id`, `title`, `summary`, `guidance`, and practical `action`;
- a valid `category`, `contexts`, `times`, and `tags`;
- `status` and `publicationStatus`;
- a valid `relatedArticleId`;
- a valid `checkInSetId` or `null`;
- `dietaryApplicability` and `exclusionPolicy` safety metadata;
- a plain-language `rationale` shown in “Why this was chosen.”

Food content must use `requires-empty-allergies-and-exclusions` until ingredient-level review exists. Do not make disease, treatment, medication, efficacy, or diagnostic claims.

## Glossary and check-ins

Glossary terms require a stable ID, term, definition, aliases, related article, status, and publication status.

Check-in sets reference question IDs from `data/quiz/questions.csv`. The generator accepts only canonical `current` questions. Check-ins never define scoring and never overwrite initial-assessment answers.

## Preview and validation

From `app/`:

```sh
npm install
npm run generate:content
npm run dev
```

Open the Vite Local URL. In development, reach Settings and choose **Load seeded demo** for the fastest review path.

The generator stops with a `Content validation failed:` message for duplicate or malformed IDs, missing copy, invalid status/category/tag values, broken article or check-in references, missing recommendation safety fields, and invalid publication metadata. `npm run dev`, `npm test`, and `npm run build` all generate and validate content automatically.

Before proposing changes, run:

```sh
npm run generate
npm run lint
npm run typecheck
npm test
npm run build
```

## Safety and approval boundary

- Keep copy educational, general, and low risk.
- Do not infer a user's constitution or current dosha state.
- Do not add numerical answer weights or scoring rules.
- Do not provide diagnosis, treatment, medication changes, emergency assessment, or medical claims.
- Use `provisional` until a named expert approval process is completed.
- Use `draft` to keep incomplete content out of the application.
- Use `withdrawn` to remove previously visible content without deleting its source record.
