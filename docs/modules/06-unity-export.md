# Module 06 — Unity Export and Integration

## Goal

Export generated UI assets with enough metadata to be imported and re-exported reliably in Unity.

**Status:** M4 definition approved; M4-S1 contract implementation is agent-ready.

## Approved V4 target

Use the Frostbound Reward Claim family in one self-contained sample project:

| Field | Approved value |
|---|---|
| Unity Editor | `6000.3.18f1` |
| UI system | uGUI |
| Render pipeline | Built-in Render Pipeline |
| Validation targets | Windows Editor and Android portrait |
| Reference scale | `540 × 960` logical / `1080 × 1920` presentation |

The sample owns only the reward-claim presentation and state transitions needed to verify manifest-driven import, 9-slicing, pivots, PPU, atlas grouping, stable IDs, prefab/scene references, Android readability, and idempotent re-export. Gameplay, backend, economy, save, animation, localization, URP, UI Toolkit, and general-editor concerns remain out of scope. See [ADR-013](../decisions/ADR-013-m4-unity-reward-claim-baseline.md).

The approved implementation contract, deterministic GUID algorithm, locked-emblem mapping, importer ownership, project boundary, and ordered slices are in the [M4 implementation specification](../implementation/M4_UNITY_EXPORT_IMPLEMENTATION_SPEC.md). Evidence IDs, scoring, blockers, and the human gate are in the [V4 integration rubric](../validation/V4_UNITY_INTEGRATION_RUBRIC.md). The recorded definition approval authorizes M4-S1 only; later slices remain ordered behind their dependencies.

## Scope

PNG/SVG selection, state naming, pivots, pixels per unit, 9-slice borders, atlas grouping, manifests, importer configuration, and reference-safe regeneration.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Rendered component states, component/export specs, target Unity settings | Asset files, manifest, importer configuration or instructions, integration report |

## Implementation steps

1. Use the approved canonical kebab-case convention: `{style-id}-{component-id}-{part}-{variant}-{state}-{width}x{height}`, omitting inapplicable segments.
2. Emit a manifest with dimensions, pivot, PPU, border, state, atlas group, source IDs, and hashes.
3. Keep SVG as the V1 editable source where compatible; use the approved resvg pipeline to bake PNG for production handoff, filter-heavy, or raster-material components. See [ADR-009](../decisions/ADR-009-v1-render-export-stack.md).
4. Implement 9-slice metadata and tests at minimum and maximum supported dimensions.
5. Create a Unity importer adapter or documented manifest reader.
6. Test re-export with unchanged IDs and verify no scene/prefab reference breaks.

## Dependencies

Module 01 contracts, Module 03 renderer, Unity target project, and Module 05 validation process.

## Acceptance criteria

- Assets import with documented defaults and correct slicing/pivot.
- All states are discoverable by convention/manifest.
- Re-export is idempotent for stable IDs.
- A small playable flow uses the exported assets successfully.

## Validation task

M4 V4: integrate a reward claim or shop purchase flow with normal/pressed/disabled/locked assets, a 9-sliced panel, and a progress bar.

## Risks

- Unity version/importer differences: pin supported versions and test each officially supported target.
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
