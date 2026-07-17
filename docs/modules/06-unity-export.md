# Module 06 — Modular Asset Delivery

## Goal

Deliver generated UI assets as independently extractable, engine-neutral modules with enough metadata to be used and traced without a Unity project.

**Status:** Refocused by ADR-014. Previous Unity evidence is retained as historical, non-gating evidence. M4-A1 modular package definition and assembly is agent-ready.

## Superseded Unity target

Use the Frostbound Reward Claim family in one self-contained sample project:

| Field | Approved value |
|---|---|
| Unity Editor | `6000.3.18f1` |
| UI system | uGUI |
| Render pipeline | Built-in Render Pipeline |
| Validation targets | Windows Editor and Android portrait |
| Reference scale | `540 × 960` logical / `1080 × 1920` presentation |

This sample is historical evidence only. It does not gate final delivery. See [ADR-013](../decisions/ADR-013-m4-unity-reward-claim-baseline.md) and superseding [ADR-014](../decisions/ADR-014-engine-neutral-modular-asset-delivery.md).

The approved implementation contract, deterministic GUID algorithm, locked-emblem mapping, importer ownership, project boundary, and ordered slices are in the [M4 implementation specification](../implementation/M4_UNITY_EXPORT_IMPLEMENTATION_SPEC.md). Evidence IDs, scoring, blockers, and the human gate are in the [V4 integration rubric](../validation/V4_UNITY_INTEGRATION_RUBRIC.md). The recorded definition approval authorizes M4-S1 only; later slices remain ordered behind their dependencies.

## Scope

PNG/SVG selection, state naming, dimensions, 9-slice guidance where useful, manifests, stable IDs, module boundaries, provenance, and engine-neutral extraction/use guidance. Unity importers, atlas grouping, prefabs, scenes, and builds are out of scope.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Rendered component states, component/export specs, material receipts | Independently usable asset modules, source/derivative manifests, and engine-neutral extraction/use guidance |

## Implementation steps

1. Use the approved canonical kebab-case convention: `{style-id}-{component-id}-{part}-{variant}-{state}-{width}x{height}`, omitting inapplicable segments.
2. Emit a module manifest with dimensions, state/part identity, applicable border guidance, source IDs, and hashes.
3. Keep SVG as editable deterministic source where compatible; include PNG only as an approved production derivative where needed. See [ADR-009](../decisions/ADR-009-v1-render-export-stack.md).
4. Package each module so it can be extracted and understood without an engine project.
5. Validate stable IDs, byte-stable output, provenance, and package completeness.

## Dependencies

Module 01 contracts, Module 03 renderer, and Module 05 validation process.

## Acceptance criteria

- Each asset part/state is independently discoverable and extractable by convention/manifest.
- Editable source and approved derivatives have stable IDs and complete provenance.
- Re-export is byte-stable for unchanged inputs.
- Package use does not depend on Unity-specific configuration or a playable flow.

## Validation task

M4-A: inspect and extract normal/pressed/disabled/locked asset modules, a panel, and independent progress frame/fill from the package without an engine project.

## Risks

- Package coupling: ensure no module requires a Unity-only path, importer setting, prefab, atlas, or scene to be usable.
- Asset path churn: IDs live in manifests, not only filenames.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Initial module definition | Codex |
| 2026-07-15 | Aligned V1 source/output policy with approved SVG/resvg stack | Project owner |
| 2026-07-17 | Opened M4 definition after V3 passed; queued Unity validation-flow and supported-version selection | Project owner / Codex |
| 2026-07-17 | Approved Frostbound Reward Claim on Unity `6000.3.18f1`, uGUI, Built-in pipeline, Editor and Android portrait as the bounded V4 target | Project owner / Codex |
| 2026-07-17 | Drafted the M4 contract/importer/re-export implementation specification and V4 evidence/scoring rubric; queued human definition review | Codex |
| 2026-07-17 | Approved Option A with manifest `1.1`/legacy `1.0` compatibility and authoritative kebab-case naming; opened M4-S1 | Project owner / Codex |
| 2026-07-17 | Completed M4-S1 with dual-version manifest validation, a Unity registry contract, deterministic naming/GUID semantics, collision/drift rejection, fixtures, tests, and migration notes | Codex |
| 2026-07-17 | Completed M4-S2 with 28 deterministic Frostbound PNGs, five Unity manifests, full source/output receipts, a stable-ID registry, zero-collision audit, and byte-identical repeat-export proof | Codex |
| 2026-07-17 | Completed M4-S3 on Unity `6000.3.18f1` with exact 28-Sprite importer settings/GUIDs, 28-member atlas, deterministic bindings, seven prefabs, scene, unchanged rerun receipt, and four passing Edit Mode tests | Codex |
| 2026-07-17 | Completed M4-S4 with the bounded local state/progress driver, four Play Mode tests, changed-source reference survival, a strict byte-stable no-op, editor captures, and a launched readable Android portrait build | Codex |
| 2026-07-17 | Superseded the Unity integration gate through ADR-014; this module now defines engine-neutral modular asset delivery | Project owner / Codex |
