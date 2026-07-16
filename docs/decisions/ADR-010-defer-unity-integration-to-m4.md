# ADR-010 — Defer Unity Integration Validation to M4

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-16 |
| Decision owner | 🧭 Project owner |
| Scope | M1/V1 validation boundary |

## Context

The original M1 roadmap and draft V1 rubric required a Unity sample scene, while the Validation Lab assigned Unity sample-project work from M4 onward. The current product need is narrower: LNH Prism must first prove that it can produce reusable, high-quality SVG components with deterministic structure, independent parts, editable content boundaries, and traceable outputs.

Requiring Unity integration during M1 would mix renderer-quality validation with a later platform-integration concern and delay feedback on the canonical SVG output.

## Decision

M1 and Practical Validation V1 will evaluate:

- reusable, structurally layered SVG as the canonical compatible component output;
- named, inspectable layers and independent reusable parts;
- deterministic sizes and states without manual repainting;
- visual quality on light/dark backgrounds and at target-phone scale;
- source, renderer, manifest, provenance, and output-hash traceability.

Unity scenes, import behavior, slicing, pivots, runtime state wiring, atlas behavior, and re-export safety are not required for M1/V1. They remain owned by M4 and Practical Validation V4.

PNG remains a deterministic derivative for preview or raster handoff. Existing Unity-oriented manifest fields may remain as future-facing metadata, but V1 does not claim that they have been validated in Unity.

## Consequences

### Benefits

- M1 measures the component source quality the project currently needs.
- SVG structure and reuse receive greater weight in the V1 gate.
- Visual/structural defects can be reviewed and corrected before platform integration begins.
- M4 retains a clear, explicit Unity integration responsibility.

### Trade-offs and controls

| Trade-off | Control |
|---|---|
| Unity-specific defects will not be discovered in M1 | Do not claim Unity readiness; retain the full M4 integration gate |
| Existing manifests contain unvalidated Unity metadata | Treat it as future-facing metadata until M4 evidence exists |
| V1 no longer tests runtime import | Require inspectable SVG structure, deterministic derivatives, and complete traceability instead |

## Links

- [V1 visual-review rubric](../validation/V1_VISUAL_REVIEW_RUBRIC.md)
- [Phased roadmap](../ROADMAP.md)
- [Validation Lab](../modules/05-validation-lab.md)
- [Unity export module](../modules/06-unity-export.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Accepted reusable structured SVG as the M1/V1 target and deferred Unity integration validation to M4 | Project owner |
