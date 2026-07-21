# Personalization Rules

> Demo implementation note: Today selects from `content/recommendations/recommendations.json`. The selector preserves the documented context precedence, filters unpublished and unsafe food content, considers recent local recommendation history, and makes a stable daily choice. Users may complete, dismiss, or replace an item. All current catalog content is provisional, and the visible prototype dosha estimate is not used for recommendation selection.

> Status: Limited-MVP provisional implementation; not expert-approved

The browser-local MVP selects one provisional Today focus through deterministic normal code. It does not use an LLM or the prototype dosha estimate.

Priority order:

1. Major physical-change context activates a safety boundary and suppresses stronger personalization.
2. Travel or schedule change selects one reliable routine anchor.
3. Significant stress or a major life event selects one manageable priority.
4. Fewer than four substantive current answers selects the next current check-in.
5. Saved-time-zone morning or evening selects a general time-of-day prompt.
6. A general routine anchor is the fallback.

Every item is labeled `Provisional · not expert-approved`. Its explanation identifies the matched rule and states that the prototype estimate was not used. A development fixture may be displayed, but it never affects selection.

Specific food prompts are withheld whenever allergies or exclusions are non-empty. When neither is present, the selector may show a generic, familiar-meal prompt compatible with the declared dietary pattern. No ingredient, recipe, medical, herb, or supplement guidance is produced.

These rules must be replaced or approved through the editorial and Ayurvedic expert workflow before production use.
