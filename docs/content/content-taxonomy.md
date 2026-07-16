# Content Taxonomy

Use controlled tags so editorial discovery, deterministic recommendations, and LLM retrieval share the same vocabulary. Tags require definitions and approval before use.

> Demo implementation note: the small provisional allowed-tag list currently lives in `app/scripts/generate-content.mjs` and validates article and recommendation JSON/metadata at generation time. This is a practical demo allow-list, not the final expert-owned taxonomy.

## Tag dimensions

| Dimension | Purpose | Initial values |
| --------- | ------- | -------------- |
| Dosha | Relate content to baseline tendencies | `vata`, `pitta`, `kapha`, `mixed`, `all` |
| Current balance | Relate content to recent prominence | TODO: expert-approved controlled values |
| Topic | Describe the subject | TODO: e.g. sleep, digestion, energy, stress, routine |
| Season | Identify seasonal relevance | TODO: map Ayurvedic and local-season language |
| Climate | Identify environmental relevance | TODO: e.g. hot, cold, dry, humid, windy |
| Time of day | Identify timing relevance | TODO: controlled time bands |
| Dietary compatibility | Filter food-related content | TODO: approved preferences and restrictions |
| Content type | Describe format and intent | `learning_article`, `daily_post`, `glossary_entry` |

## Rules

- Use stable machine-readable slugs and separate user-facing labels.
- Define whether each dimension is single-select or multi-select.
- Avoid creating near-duplicate synonyms.
- Record deprecated tags and migration rules.
- Safety metadata is required where advice could be inappropriate for some users.

## Open work

- TODO: Add definitions, allowed combinations, ownership, and review status.
- TODO: Define a process for adding and retiring tags.
