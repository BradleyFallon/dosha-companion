# Recommendation Data Model

> Status: Limited-MVP provisional interface

The current application uses a typed in-code catalog with:

- Stable recommendation ID
- Provisional review label
- Headline, general guidance, and one practical action
- Optional action route
- Deterministic rule explanation
- Food-prompt state (`shown` or `withheld`), copy, and filtering reason

Selector inputs are assessment coverage, the non-scoring major-change context answer, dietary pattern, allergies, exclusions, saved time zone, local date/time, and the explicit development-fixture flag. The flag is recorded only to explain that it was ignored.

The selector does not accept raw dosha scores because none exist. It does not use precise location, weather, generated prose, medical information, herbs, or supplements.

Before production, move catalog records and rules into a versioned expert-reviewed content source with effective dates, safety metadata, withdrawal status, and approval records. Add recommendation history only when repetition behavior is defined.
