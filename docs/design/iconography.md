# Temporary iconography

The interactive prototype uses `@phosphor-icons/react` as its temporary icon source. Application screens normally import semantic names from `app/src/ui/icons.tsx`, never Phosphor components directly. This boundary keeps product intent separate from a particular icon drawing and makes later replacement straightforward.

Phosphor React 2.1.10 exports the requested designs without an `Icon` suffix (`Sun`, `Spiral`, and so on). The semantic layer deliberately exposes application names such as `TodayIcon`, `QuestionsIcon`, `NatureIcon`, and `CompleteIcon`; no requested design needed a visual substitution.

The temporary concept mappings are:

- Vata: `VataIcon` wrapping Phosphor `Spiral`
- Pitta: `PittaIcon` wrapping Phosphor `Fire`
- Kapha: `KaphaIcon` wrapping Phosphor `Drop`
- Welcome mark: `DoshaTrioMark`, composing the three wrappers

These symbols are navigation and educational aids, not expert-approved brand artwork and not calculated results. The dosha and brand wrappers are intended to move to custom SVG artwork later without changing screen imports.

The temporary CSS tokens are `--vata: #62569b` with `--vata-soft: #ebe7f4`, `--pitta: #b65035` with `--pitta-soft: #f4e3dc`, and `--kapha: #39705f` with `--kapha-soft: #dfebe6`. They are reserved for the corresponding concept marks and restrained educational accents. Neutral navigation and utility icons continue to inherit the surrounding neutral or accent color.

Use regular weight for ordinary navigation and controls, duotone for dosha marks and selected educational concepts, and fill only for active, selected, saved, or completed states. Keep visible labels on navigation and primary actions. An icon next to visible text is decorative: set `aria-hidden="true"` and `focusable="false"`. A genuinely icon-only control must instead have a precise accessible name, a visible focus state, and a target of at least 44 by 44 pixels. SVGs must never enter the tab order.
