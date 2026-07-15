# Module 06 — Unity Export and Integration

## Goal

Export generated UI assets with enough metadata to be imported and re-exported reliably in Unity.

## Scope

PNG/SVG selection, state naming, pivots, pixels per unit, 9-slice borders, atlas grouping, manifests, importer configuration, and reference-safe regeneration.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Rendered component states, component/export specs, target Unity settings | Asset files, manifest, importer configuration or instructions, integration report |

## Implementation steps

1. Establish a stable naming convention: `{style}_{component}_{variant}_{state}_{size}`.
2. Emit a manifest with dimensions, pivot, PPU, border, state, atlas group, source IDs, and hashes.
3. Decide SVG eligibility per template; bake PNG for filter-heavy or raster-material components.
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
