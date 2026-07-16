# V3 Reference Brief — Frostbound Reward Popup

## Decision

**Status:** 🟢 Selected by the project owner on 2026-07-17.

**Purpose:** authoritative product/art boundary for M3 implementation planning and Practical Validation V3.

The AI-generated concept is a primary visual reference only. Its pixels must never become component geometry, masks, textures, borders, shadows, or final production assets.

## Primary reference and provenance

| Field | Value |
|---|---|
| Concept | [Frostbound Reward Popup](assets/v3-frostbound-reward-concept.png) |
| Generation receipt | [Exact prompt, settings, dimensions, and hash](assets/v3-frostbound-reward-concept.receipt.json) |
| Generation method | OpenAI image generation, prompted by Codex after project-owner selection |
| Generation date | 2026-07-17 |
| Stored raster | `941 × 1672` PNG; portrait composition reference |
| SHA-256 | `19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383` |
| Intended scale | `540 × 960` logical / `1080 × 1920` presentation |
| Usage | analysis, annotation, comparison, and human review only |
| Rights status | project-generated reference; project usage permitted |

The immutable generation receipt retains the exact prompt and available settings. It requested an icy-fantasy reward popup with reusable frost/crystal material language, a dominant `CLAIM` action, subordinate `LATER` action, and an independently readable `75%` progress indicator. It explicitly prohibited asset-sheet extraction, baked component textures, device frames, trademarks, and component-specific material effects.

## Reconstruction target

| Component | Required proof |
|---|---|
| Reward panel | Deterministic frame, inset surface, header/content slots, border, lighting, ornament, and shadow layers |
| Primary claim button | Normal, pressed, and disabled states; clearly dominant through deterministic size, fill, edge light, and contrast |
| Secondary later button | Normal, pressed, and disabled states; visibly subordinate while sharing the same material family |
| Reward progress | Independent frame and fill; values `10`, `50`, `75`, and `90`; readable filled/unfilled distinction |

At least four component types must reuse the approved material pack. For V3, the primary and secondary button variants count as one Button component type; the fourth proof type is the panel's reusable reward-emblem container, implemented as an icon container rather than extracted crystal pixels.

## Analysis priorities

- Separate directly observed properties from recommendations and unresolved decisions.
- Annotate every critical palette, spacing, silhouette, lighting, hierarchy, and material proposal with source evidence and confidence.
- Strengthen selected/active distinction without relying on text alone.
- Preserve the concept's primary/secondary action hierarchy at target-phone scale.
- Convert frost, crystal grain, rune geometry, and edge glints into reusable material or deterministic layer recipes; do not crop them from the concept.
- Preserve editable content slots and protect them from decorative detail.

## Acceptance boundary

- Human reviewers approve the style specification, material pack, and component inventory before deterministic reconstruction begins.
- Every accepted critical token links to a source annotation or explicit human decision.
- Low-confidence proposals remain unresolved until a reviewer decides them.
- No concept pixels appear in final component or material sources.
- Comparison evidence measures hierarchy and family resemblance, not pixel-perfect imitation.
- Unity integration remains deferred to M4.

## Links

- Decision: [ADR-012](../decisions/ADR-012-v3-frostbound-reward.md)
- Design analysis: [Module 02](../modules/02-design-analysis.md)
- Materials: [Module 04](../modules/04-materials-textures.md)
- Validation: [Module 05](../modules/05-validation-lab.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Recorded approved Option A, concept provenance, target scale, and bounded reconstruction family | Project owner / Codex |
