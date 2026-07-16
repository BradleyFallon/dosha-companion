# Content Data Model

> Status: Implemented for the browser-local demo; schema remains provisional.

The editor-owned source is under `content/`. Learn articles use Markdown with a JSON metadata block. Recommendations, glossary entries, and check-in sets use JSON arrays. `app/scripts/generate-content.mjs` validates the catalog and generates typed application data.

Every item has a stable unique ID, `status` (`provisional` or `approved`), and `publicationStatus` (`draft`, `published`, or `withdrawn`). Only published items are returned by the application content repository. Provisional published items remain clearly labeled.

Articles require title, summary, category, controlled tags, body, and valid related-article IDs. Recommendations additionally require guidance, a practical action, context/time eligibility, safety/exclusion metadata, dietary applicability, rationale, and valid article/check-in references. Check-in sets reference canonical current-question IDs rather than copying wording.

The current schemas deliberately exclude scoring, inferred dosha fields, diagnosis, medical advice, scheduling, localization, rich media, and production approval audit history. See `content/editor-guide.md` for exact formats and commands.
