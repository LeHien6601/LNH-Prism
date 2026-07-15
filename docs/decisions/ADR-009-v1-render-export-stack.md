# ADR-009 — V1 Render and Export Stack

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-15 |
| Decision owner | 🛠️ Technical lead |
| Scope | M1 deterministic renderer and PNG export |

## Context

LNH Prism needs an editable, deterministic source representation for the V1 Primary Button, Panel, and Progress Bar, plus reproducible raster output for mobile-game handoff. The stack must support the approved Neon Core baseline, preserve independent layers, fit the existing Node-based contract validation workflow, and leave Unity metadata in versioned manifests.

## Decision

Use **TypeScript + SVG source + `@resvg/resvg-js` PNG export + JSON manifests** for V1.

```text
Versioned JSON specifications
          ↓
TypeScript layer/template builder
          ↓
Editable SVG source and layer-debug SVG
          ↓
@resvg/resvg-js (pinned version)
          ↓
PNG outputs + JSON export manifest
```

### Working rules

- SVG is the canonical editable visual source for compatible component layers.
- `@resvg/resvg-js` is the pinned headless rasterizer for PNG output; renderer version belongs in every export manifest.
- JSON remains the authority for IDs, state, dimensions, pivot, 9-slice border, source versions, hashes, and provenance. SVG does not replace contracts.
- Build V1 visual effects from explicit, named layers whenever practical: fill, stroke, outer shadow, inner shadow, highlight, and grain. This preserves debuggability and avoids hidden baked effects.
- SVG filters are allowed only after a golden-image test proves their output is stable on the pinned backend. Filter-heavy or raster-material components may be delivered as PNG while retaining their JSON/SVG source provenance.
- Unity-specific metadata is emitted in manifests now; a Unity importer adapter is deferred to M4.

## Consequences

### Benefits

- The repository keeps one TypeScript/Node toolchain for contracts and rendering.
- SVG is inspectable, reviewable in diffs, and separates geometry from material inputs.
- PNG production outputs can be generated headlessly and reproducibly from versioned inputs.
- The architecture preserves the project principle: AI materials may be inputs, but final asset structure is deterministic.

### Trade-offs and mitigations

| Trade-off | Mitigation |
|---|---|
| SVG renderer/filter behavior can vary | Pin `@resvg/resvg-js`; add golden-image coverage before relying on filters. |
| Some painterly materials are not good SVG candidates | Mask normalized raster materials in deterministic layers and bake final PNG. |
| SVG alone does not configure Unity imports | Keep manifest metadata complete; implement importer/configuration support in M4. |
| Two visual artifacts can drift | Generate SVG and PNG from the same render request; record hashes and renderer version in the manifest. |

## Required M1 proof

The first agent-ready renderer task must prove all of the following before additional templates or effects are added:

1. Render an approved Neon Core rounded Primary Button with independent fill, stroke, outer shadow, and top highlight layers.
2. Render the button at both approved V1 sizes and in normal, pressed, and disabled states from parameters—not fresh AI imagery.
3. Produce a PNG and a manifest containing stable IDs, dimensions, state, source references, output hash, and pinned renderer version.
4. Re-render the same pinned inputs and demonstrate byte-identical output or document a justified, testable exception.
5. Add a focused test or golden-image baseline for any SVG filter introduced by the proof.

## Alternatives considered

| Alternative | Why not selected for V1 |
|---|---|
| TypeScript + direct Canvas2D raster rendering | Useful later, but raster-first source is less inspectable and needs extra work to preserve editable vector structure. |
| C#/.NET + SkiaSharp | Capable 2D stack, but introduces a second implementation ecosystem before the Node contract workflow is proven. |

## Links

- [Component renderer module](../modules/03-component-renderer.md)
- [Unity export module](../modules/06-unity-export.md)
- [V1 Neon Core reference](../reference-briefs/V1_NEON_CORE.md)
- [V1 component acceptance briefs](../acceptance-briefs/V1_CORE_COMPONENTS.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-15 | Accepted TypeScript, SVG, resvg, and JSON-manifest stack for V1 | Project owner |
