# V1 Evidence Package — Neon Core Core Components

**Status:** 🟣 V1-D004 corrected on 2026-07-16; human re-scoring of Traceability and reproducibility is pending. This package remains evidence, not the gate decision.

## Frozen validation target

| Field | Value |
|---|---|
| Feature ID | `neon-core-core-components` |
| Logical reference canvas | `540 × 960` portrait |
| Output inspection scale | `2×` (`1080 × 1920` reference) |
| Style | `neon-core@0.1.0` |
| Components | `primary-button@0.1.0`, `primary-panel@0.1.0`, `primary-progress-bar@0.1.0` |
| Material pack | `neon-core-materials@0.1.0` |
| Renderer | `lnh-prism-renderer@0.1.0+resvg.2.6.2` |
| Renderer correction baseline | `6eaffa6` — Progress highlight clipped to fill silhouette |
| Approved rubric baseline | `a596225` — SVG-focused V1 rubric |

Generated SVG/PNG files under `showcase/generated/` are reproducible review output and are intentionally ignored by Git. Run `npm run prepare:showcase` before opening the evidence page.

## Evidence map

### V1-E01 — Approved visual reference

- [Neon Core reference brief](../../../reference-briefs/V1_NEON_CORE.md)
- [Focused V1 component acceptance briefs](../../../acceptance-briefs/V1_CORE_COMPONENTS.md)
- Fixed target: `540 × 960` logical portrait, reviewed at `2×` output.

### V1-E02 — Versioned specifications and provenance

| Source | Version | Path |
|---|---|---|
| Style | `neon-core@0.1.0` | `specs/examples/style-neon-core.json` |
| Button | `primary-button@0.1.0` | `specs/examples/primary-button.json` |
| Panel | `primary-panel@0.1.0` | `specs/examples/primary-panel.json` |
| Progress Bar | `primary-progress-bar@0.1.0` | `specs/examples/primary-progress-bar.json` |
| Material pack | `neon-core-materials@0.1.0` | `specs/examples/neon-core-materials.json` |

Every prepared width/state set includes a JSON export manifest with source IDs/versions, renderer version, output dimensions, hashes, and deterministic derivative paths. `npm run validate` validates schemas, manifest hashes, deterministic rendering, and evidence structure.

### V1-E03 — Baseline and secondary-size renders

Open [the local V1 evidence page](../../../../showcase/v1-evidence.html) after running `npm run prepare:showcase`.

| Component | Baseline | Secondary | Structural evidence |
|---|---|---|---|
| Primary Button | `160 × 56` | `240 × 56` | Five named SVG layers including empty editable label slot |
| Primary Panel | `432 × 240` | `432 × 360` | Six named SVG layers including empty editable content slot |
| Primary Progress Bar | `320 × 24` | `432 × 24` | Independent frame/fill SVG files; `10%`, `50%`, `90%` fill |

The page supplies 100% and 200% inspection controls. Generated SVG files contain no `<text>` elements.

#### SVG layer inventory — top to bottom

| Component/part | Layers |
|---|---|
| Primary Button | Content slot; Highlight; Border; Fill; Shadow |
| Primary Panel | Content slot; Highlight; Border; Grain; Fill; Shadow |
| Progress fill | Fill highlight; Value fill |
| Progress frame | Frame border; Track fill; Frame shadow |

### V1-E04 — Button state evidence

Normal, pressed, and disabled SVGs are prepared at both accepted widths. The pressed state uses the deterministic `y: +2` content-slot offset; disabled removes the top highlight through renderer parameters. Labels shown in the component showcase are HTML and are not baked into the SVG.

### V1-E05 — Light and dark composites

The [V1 evidence page](../../../../showcase/v1-evidence.html) renders every accepted component size/state/fill over solid dark and light review surfaces. CSS supplies only review backgrounds, spacing, captions, and scaling; it does not recreate or modify component artwork.

Human reviewers must inspect at 100%, 200%, and a narrow mobile viewport for halos, clipped edges, background spill, inconsistent caps, and unreadable low-progress fill.

### V1-E06 — Defect and revalidation log

| Issue | Category | Severity | Status | Corrective evidence | Revalidation |
|---|---|---|---|---|---|
| `V1-D001` Progress highlight cap extended beyond the rounded value fill | renderer | blocker before correction | 🟢 Closed | `6eaffa6 fix(renderer): clip progress highlight to fill` | All six width/percentage variants use the exact fill-shape clip; focused regression and deterministic renderer tests pass |
| `V1-D002` Initial evidence grid clipped 432-pixel Progress Bars at 100% inspection | process | medium | 🟢 Closed | Use a two-column Progress grid and scale grid cells with the 100%/200% control | Desktop light/dark surfaces show complete end caps; 200% specimen and 320-pixel layout visually checked in Chromium |
| `V1-D003` Shadow reads as a detached duplicate silhouette rather than a connected 3D extrusion | renderer | medium | 🟡 Open | Design a connected, parameterized side-wall/extrusion treatment that remains independently editable | Re-render and inspect all affected accepted sizes/states on light and dark surfaces |
| `V1-D004` Traceability score missed the mandatory V1 minimum | process | gate failure | 🟢 Corrected; re-score pending | Bind approved inputs, real material source, renderer/dependency sources, and outputs by path and SHA-256; expose the chain to reviewers | [Traceability audit](TRACEABILITY_AUDIT.md); 13 tests and full validation pass; desktop/mobile browser QA complete |

No automatic blocker was reported. The rubric still produces a Fail when any dimension misses its minimum.

## Reproduction and review commands

```text
npm ci
npm run validate
```

Then open:

```text
showcase/v1-evidence.html
docs/validation/records/v1-neon-core-core-components.md
```

## Corrective handoff

1. Review the [V1-D004 audit](TRACEABILITY_AUDIT.md) and Traceability chain in `showcase/v1-evidence.html`.
2. Inspect at least one generated manifest for its approved source paths/hashes, source-tree receipt, renderer version, and output hashes.
3. Ask the same review authority to append a new score for Traceability and reproducibility only.
4. Address V1-D003 with a connected, independently editable 3D shadow treatment and repeat its affected visual evidence.
5. Do not mark M1 complete until the retained original scorecard and appended revalidation produce a rubric-compliant Pass.
