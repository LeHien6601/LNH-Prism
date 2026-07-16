# V2 Validation Record — Neon Market Kit

Status: 🟢 Pass
Review date: 2026-07-17
Reference brief: `docs/reference-briefs/V2_NEON_MARKET.md`
Implementation specification: `docs/implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md`
Style/material/component versions: `neon-market@0.1.0`, `neon-alloy-materials@0.1.0`, six M2 specs at `0.1.0`
Renderer version: `0.1.0`

The automated evidence package is prepared at `docs/validation/evidence/v2-neon-market-kit/`. On 2026-07-17, the project owner confirmed each dimension through a guided evidence review. The weighted result is `93/100`; every mandatory minimum is met and no automatic blocker remains.

| Dimension | Weight | Score | Weighted result | Evidence | Reviewer | Notes |
|---|---:|---:|---:|---|---|---|
| Visual hierarchy and mobile readability | 15 | 4.0 | 12.0 | V2-E03, E04, E05 | 🎨 / ✦ | Readable action hierarchy; selected-tab distinction and sparse scenario content keep this below 5 |
| Cross-component consistency and material reuse | 25 | 4.5 | 22.5 | V2-E03, E05, E08 | 🎨 / ✦ | One approved pack serves all six specs; semantic button differentiation remains limited |
| Surface, edge, mask, and layer quality | 15 | 4.5 | 13.5 | V2-E03, E05, E07 | 🎨 / 🛠️ | Clean masked surfaces and edge proof; comprehensive golden-image coverage is deferred to M5 |
| State, size, and token-propagation behavior | 20 | 5.0 | 20.0 | V2-E03, E06, E07 | ✦ / 🛠️ | Complete matrix, bounded failures, independent progress parts, and six-component propagation proof |
| Editability, structure, and bounded reuse | 15 | 5.0 | 15.0 | V2-E02, E05, E08 | 🛠️ | Named layers/parts, editable slots, typed bindings, and bounded overrides remain inspectable |
| Traceability and reproducibility | 10 | 5.0 | 10.0 | V2-E02, E07, E08, E09 | 🛠️ | Approved ancestry, rights, source/dependency receipts, output hashes, and deterministic regeneration are complete |

Weighted score: `93/100`
Automatic blockers: None.
Decision: 🟢 Pass

| Issue ID | Category | Severity | Corrective action | Owner | Revalidation evidence |
|---|---|---|---|---|---|
| V2-P001 | spec | closed | Approved the versioned M2 style, material pack, and six component specs at `0.1.0` | Project owner | Regenerated V2-E02, V2-E08, and V2-E09 |
| V2-P002 | process | closed | A preview-tool display suggested black regions on the light surface; direct RGBA inspection confirmed the stored PNG is opaque and preserves the same component pixels as the dark surface. Added an automated surface-pixel regression to prevent future misclassification. | Agent | V2-E05 light PNG and V2-E07 surface-pixel-integrity test |

## Non-blocking observations

| ID | Observation | Owner | Target |
|---|---|---|---|
| V2-N001 | Strengthen selected-tab distinction and validate hierarchy with representative product content | 🎨 Art + ✦ UI | V3 target definition |
| V2-N002 | Define bounded semantic differentiation between primary and secondary buttons before reuse in a new theme | ✦ UI + 🛠️ Technical | M3 specification |
| V2-N003 | Expand full-matrix golden-image/pixel-diff coverage | 🛠️ Technical | M5 production hardening |

## Retrospective

- Shared typed tokens, material slots, and deterministic state/size recipes produced the six-component family without repainting.
- Restrained grain/pattern/decal treatment remained subordinate to labels and action hierarchy.
- V2-N001 and V2-N002 should inform the V3 target/specification; neither blocks the M2 gate. V2-N003 remains owned by M5.
