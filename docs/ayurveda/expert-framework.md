# Ayurvedic Expert Framework

> Status: Working specification. This document must be owned and approved by the project's Ayurvedic expert before it is treated as authoritative.

## What Ayurveda means in this product

Ayurveda is presented as a traditional wellness framework for self-reflection, education, and supportive daily habits. The product must distinguish tradition-informed guidance from medical evidence and must not position its assessment as diagnosis or treatment.

## Baseline constitution

Define the relatively stable pattern of tendencies the product estimates from long-term questions.

- TODO: Approve the user-facing definition.
- TODO: Define what evidence may change a baseline result.
- TODO: Define appropriate uncertainty language.

## Current balance

Define the recent, changeable pattern estimated from time-bounded answers and context. Current balance must remain separate from baseline constitution.

- TODO: Approve lookback windows and stale-data behavior.
- TODO: Define “balanced,” “elevated,” or other approved result language.

## Dosha characteristics

TODO: Define Vata, Pitta, Kapha, mixed constitutions, and common qualities in `dosha-definitions.md` or an approved successor document. Separate descriptive tendencies from health claims.

## Interpreting context

Document how the framework interprets each of the following, including limits and counterexamples:

- Food and dietary compatibility
- Season and seasonal transitions
- Local climate
- Daily routine and time of day
- Sleep, movement, work, and other lifestyle context

## Expert judgment required

An Ayurvedic expert must approve:

- Foundational definitions and terminology
- Quiz categories, question wording, answer weights, and scoring versions
- Recommendation rules and contraindications
- User-facing educational content and safety metadata
- Claims about expected relevance or benefit
- Any expansion into herbs, supplements, clinical conditions, pregnancy, or children

## LLM personalization allowed

Within approved source material and explicit rules, the LLM may:

- Adjust explanation length, ordering, and reading level
- Summarize an approved profile without changing its scores
- Retrieve and connect relevant approved content
- Adapt practical suggestions to stated preferences and context when permitted
- State uncertainty and ask a clarifying question

The LLM may not invent Ayurvedic rules, alter scores, diagnose, treat, prescribe, or bypass safety restrictions.

## Approval record

- Owner: TODO
- Expert reviewer: TODO
- Safety reviewer: TODO
- Version: `0.1-draft`
- Last approved: Not yet approved

