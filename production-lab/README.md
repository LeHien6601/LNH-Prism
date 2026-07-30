# LNH Prism Production Lab

A supported private package inside LNH Prism for controlled screenshot-to-UI
reconstruction. Version `0.4.0` is owned by LNH Prism and supported for project
intake, registered reference provenance, bounded job preparation, editable SVG
reconstruction, human approval, build, and comparison. The package remains
isolated from the parent renderer, milestone evidence, and production assets.

Component-family/state inheritance, shared footprints, replaceable text/icon
slots, scalable-region metadata, effect padding, and declarative geometry
constraints are supported and validated. Deterministic transparent PNG state
assets and native/phone/thumbnail review evidence are supported. Promotion,
project-library versioning, and engine-neutral package assembly remain planned.

Reference screenshots are evidence only. Production output is reconstructed
from editable geometry and declared materials; screenshot pixels are never
cropped, traced, or embedded into component assets.

## Workflow

1. `project-init` creates a generic project manifest.
2. `reference-add` registers managed reference evidence with hash, authority,
   approval status, version, permitted use, and provenance.
3. `job-create` creates a bounded multi-reference job.
4. `prepare` creates a reproducible Codex task packet and reviewable draft.
5. Codex directly inspects the screenshot using `$reconstruct-game-ui`, edits
   the draft, creates previews, visually inspects comparisons, and iterates.
6. `approve` validates the reviewed draft and records human approval.
7. `build` emits independently editable component SVGs and a composed screen.
8. `compare` creates an overlay surface and a machine-readable geometry report.
9. `validate-job` creates a machine-readable state-and-constraint report.
10. `render-evidence` emits isolated SVG/PNG states, slicing/state sheets,
    geometry overlays, comparison HTML, and target-size review surfaces.
11. After inspecting every required size, `record-mobile-review` records
    evidence-backed findings without granting artistic approval.

## Commands

From this directory:

```powershell
npm run lab -- project-init --project block-forge --name "Block Forge"
npm run lab -- reference-add --project block-forge --reference puzzle-system --input D:\references\puzzle.png --role primary-geometry --version 1.0.0 --note "Approved puzzle geometry"
npm run lab -- reference-add --project block-forge --reference ui-system --input D:\references\ui.png --role style-authority --version 1.0.0 --note "Approved UI style"
npm run lab -- reference-list --project block-forge
npm run lab -- reference-validate --project block-forge
npm run lab -- job-create --project block-forge --job puzzle-board --references puzzle-system,ui-system --scope "Puzzle board cells and fixed-orientation pieces"
npm run lab -- prepare --job puzzle-board
npm run lab -- validate-job --job puzzle-board
npm run lab -- render-evidence --job puzzle-board
npm run lab -- record-mobile-review --job puzzle-board --reviewer "UI reviewer" --findings "Evidence-backed native, phone, and thumbnail findings"
npm run lab -- preview --job puzzle-board
npm run lab -- approve --job puzzle-board --reviewer "Art Lead"
npm run lab -- build --job puzzle-board
npm run lab -- compare --job puzzle-board
npm run lab -- project-status --project block-forge
npm run lab -- project-audit --project block-forge
```

Then ask Codex:

```text
Use $reconstruct-game-ui to process the puzzle-board job, inspect its registered
references, reconstruct editable components, and iterate on the comparison.
```

No API key or external model provider is used. Codex performs visual reasoning
inside the active task; the CLI handles deterministic storage and rendering.

Project manifests and managed review references are written beneath
`workspace/projects/`; jobs remain beneath `workspace/jobs/`. The whole
workspace is ignored. Registered source pixels never enter parent production
assets or generated component SVG.

The canonical state-and-constraint example is
`examples/block-forge-state-constraints.json`. It demonstrates an exact 8x8
square puzzle grid, shared broken/damaged/repaired bridge footprints, inherited
layer overrides, replaceable text and icon slots, mobile touch targets, safe
areas, effect padding, and engine-neutral scalable regions.

Isolated PNG dimensions include declared effect padding. Evidence rendering
fails when alpha is absent, output dimensions drift, an outer edge is occupied
(indicating clipped effects), or SVG contains an image layer. `review/index.html`
provides side-by-side, adjustable overlay, difference, reconstruction-only,
component-isolation, state, target-size, transparency-background, geometry,
safe-area, grid, and anchor views.

## Draft component format

Components use canvas coordinates and simple editable layers:

```json
{
  "id": "primary-action",
  "role": "button",
  "bounds": { "x": 110, "y": 780, "width": 320, "height": 68 },
  "layers": [
    {
      "id": "base",
      "kind": "rect",
      "x": 0,
      "y": 0,
      "width": 320,
      "height": 68,
      "radius": 16,
      "fill": "#315be8",
      "stroke": "#9fb5ff",
      "strokeWidth": 3
    }
  ]
}
```

Supported layer kinds in the MVP are `rect`, `ellipse`, `path`, and `text`.
All layer and component IDs must be stable and unique.

## Editable materials

Drafts may declare source-neutral named materials in a top-level `materials`
array. Supported material kinds are `linear-gradient`, `radial-gradient`,
`glow`, and `shadow`. Layers bind them with `fillMaterial`,
`strokeMaterial`, or `filter`; supported `blendMode` values are `normal`,
`screen`, `multiply`, `overlay`, `lighten`, and `color-dodge`.

The renderer writes deterministic SVG `<defs>` into both standalone component
files and the composed screen. Material references are validated, arbitrary
style injection is rejected, and no material may reference source pixels.

## Isolation contract

- No imports from `../src`, `../scripts`, or parent generated output.
- No commands mutate the parent repository.
- Every job stays under this package's `workspace/jobs` directory.
- Approved inputs and generated files carry SHA-256 receipts.
- Reference images may appear only in `input/` and `comparison/`.
- Promotion is intentionally absent until its approval, hash, destination, and
  receipt contract is implemented and validated.
