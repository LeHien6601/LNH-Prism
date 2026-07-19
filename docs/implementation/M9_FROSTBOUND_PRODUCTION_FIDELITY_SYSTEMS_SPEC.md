# M9 Frostbound Production-Fidelity Systems Specification

## Status

**Current implementation status: M9-A1 through M9-A9 complete; integrated evidence assembly is next.**

**M9-A1 complete — implementation sequence defined.** This specification turns the approved strategic direction in [ADR-020](../decisions/ADR-020-stage-production-fidelity-as-m9.md) into bounded renderer and validation tasks. It does not approve a visual gate or authorize multi-style transfer.

## Objective and fixed boundaries

M9 makes the reviewed Frostbound package reproduce through reusable deterministic systems for material depth, edge hierarchy, focal quality, controlled irregularity, typography, lighting, and visual evaluation.

The work must preserve M7/M8 lineage, stable IDs, editable SVG structure, source-neutral material provenance, deterministic PNG derivatives, engine-neutral delivery, and recorded seeds. It must not use concept pixels, unseeded randomness, flattened production sources, engine integration, Volcanic Forge transfer, third-style testing, or a style-authoring workflow.

`V8-O001` is the starting observation: preserve the readable crystal focal while reducing competing panel-pattern prominence through systemic, not component-specific, controls.

## Ordered implementation slices

| ID | Execution | Scope and dependency | Acceptance criteria | Validation |
|---|---|---|---|---|
| M9-A2 | Agent-ready | Define and render versioned layered edge stacks; migrate Frostbound structural borders. Depends on M9-A1 only. | Stable layer order and bounded inset/thickness rules; at least two presets are reused; no Frostbound renderer branch; M7/M8 outputs remain versioned. | Contract negatives, determinism, layer isolation, clipping, and compatibility tests. |
| M9-A3 | Agent-ready | Add source-neutral material-response channels and structural-region bindings. Depends on M9-A2. | Base, edge, highlight, glow, and optional surface channels remain independently editable and reusable across component types; complete provenance. | Per-channel isolation and combined renders, invalid-input tests, target-size inspection. |
| M9-A4 | Agent-ready | Add explicit seeded variation channels localized to material regions. Depends on M9-A3. | Same input/seed is identical; different seeds stay within documented bounds; zero variation is available; functional bounds and readability are unchanged. | Same/different/zero seed tests, three golden seeds, receipt and manifest seed checks. |
| M9-A5 | Agent-ready | Separate structural geometry from reusable ornament anchors and bindings. Depends on M9-A2 and M9-A4. | Ornaments have stable IDs, deterministic anchors, explicit clipping, configurable mirroring/asymmetry, and do not alter content bounds. | Anchor negative tests, structural-only renders, reuse and isolation evidence. |
| M9-A6 | Agent-ready | Generalize the Frostbound crystal into a focal-object framework. Depends on M9-A3 through M9-A5. | Core, facets, rim, light, fractures, support, shard, particle, and ground-glow layers are independently addressable; optional layers can be disabled; a non-crystal placeholder preset needs no renderer change. | Layer toggles, preset/scale determinism, mobile readability, provenance and receipt checks. |
| M9-A7 | Agent-ready | Add reusable typography treatments and deterministic width/state behavior. Depends on M9-A2 and M9-A3. | Typography effects are separate from geometry; content slots stay stable; long/short labels and states have deterministic fit and no unexpected drift. | Width/state matrix, target-phone readability, font-provenance and showroom inspection. |
| M9-A8 | Agent-ready | Introduce a shared lighting model consumed by edge, material, focal, ornament, and typography systems. Depends on M9-A3 and M9-A6. | One versioned direction/intensity model drives compatible highlights and glows without component-specific light branches; budgeted bloom preserves readability. | Cross-component coherence board, invalid-value tests, target-size and isolation renders. |
| M9-A9 | Agent-ready | Define the three-distance review surfaces and visual-quality scoring independent of technical correctness. Depends on M9-A2 through M9-A8. | Source, target-phone, and thumbnail evidence each cover required checks; visual score cannot be inflated by technical checks; blockers remain hard gates. | Review-surface preflight, score-sheet validation, composition/hierarchy evidence including V8-O001. |
| M9-A10 | Agent-ready | Produce the integrated Frostbound production-fidelity package and technical evidence. Depends on M9-A2 through M9-A9. | Seven-component package, manifests, receipts, showroom, and modular handoff reproduce cleanly with all systems enabled; no M7/M8 overwrite. | Full package/reproduction validation and unscored M9 evidence package. |
| M9-A11 | Human decision | Conduct the M9 production-fidelity review. Depends on M9-A10. | Human reviewers apply the M9 rubric; all automatic blockers are absent; a pass is required before any multi-style transfer. | Signed review record using [M9 rubric](../validation/M9_PRODUCTION_FIDELITY_RUBRIC.md). |

## Cross-slice controls

- All schemas, presets, bindings, seeds, and layers require versioned stable IDs and manifest/receipt provenance.
- A change must be additive or use an explicit migration; approved M7/M8 sources and receipts cannot be overwritten.
- Complexity budgets cover edge depth, ornament/particle density, bloom/glow, content region, text contrast/size, SVG/PNG size, render time, and package size. Each implementation slice must either enforce its applicable budget or record why enforcement belongs to a later dependency.
- Each renderer slice adds focused tests; M9-A10 is the only slice that assembles the full production package.

## Exit gate

M9 passes only after M9-A11 records a human-approved visual result with valid technical evidence. Frostbound must reproduce through the general systems without a Frostbound-only renderer branch, remain deterministic and modular, preserve valid receipts, and be ready for—but not yet begin—second-style transfer.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Defined bounded M9 renderer, validation, integration, and human-review slices from ADR-020 and V8-O001. | Codex |
| 2026-07-19 | Completed M9-A2 edge-stack migration and M9-A3 material-response/region-binding implementation; opened M9-A4 seeded variation. | Codex |
| 2026-07-19 | Completed M9-A4 bounded seeded variation, typed receipts, zero baseline, and renderer trace metadata; opened M9-A5 structural/ornament separation. | Codex |
| 2026-07-19 | Completed M9-A5 through M9-A8 reusable ornament, focal, typography, and lighting systems; opened the three-distance review definition. | Codex |
| 2026-07-19 | Completed M9-A9 with a versioned source/phone/thumbnail review plan, 100-point visual-score contract, V8-O001 coverage, and technical hard-gate separation; opened M9-A10 integrated evidence assembly. | Codex |
