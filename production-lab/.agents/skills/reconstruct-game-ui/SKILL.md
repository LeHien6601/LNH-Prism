---
name: reconstruct-game-ui
description: Use Codex directly to analyze a game UI screenshot, reconstruct editable component assets, compose a matching screen, inspect visual comparisons, and iterate on a Production Lab job. Trigger for screenshot-to-UI requests, production or experiment asset creation, component extraction by reconstruction, screen matching, or requests to process or continue a job under production-lab.
---

# Reconstruct game UI

Keep all work inside `production-lab/workspace/jobs/<job-id>/`.

## Workflow

1. For supported work, initialize a project, register every approved reference
   with its authority role, and create a bounded multi-reference job. Use legacy
   `init` only for isolated compatibility experiments.
2. Run `npm run lab -- prepare --job <id>` to create the draft and reproducible
   authority task packet.
3. Read `job.json`, `analysis/CODEX_TASK.md`, and `analysis/draft.json`.
4. Inspect the screenshot with the available local image-viewing tool. Do not
   infer appearance from filenames or receipts.
5. Edit `analysis/draft.json` directly:
   - record observations separately from recommendations;
   - use screenshot pixel coordinates and source regions;
   - inventory reusable components, states, text slots, and icon slots;
   - model shared construction in `componentFamilies`, `baseLayers`, `states`,
     and state-specific `layerOverrides`;
   - declare native size, resize behavior, content-safe regions, effect padding,
     anchors, scalable regions, and applicable `geometryConstraints`;
   - create editable `rect`, `ellipse`, `path`, and `text` layers;
   - use stable semantic kebab-case IDs;
   - place uncertainty in `unresolved`.
6. Run `npm run lab -- validate-job --job <id>` and resolve every contract
   failure before visual review.
7. Run `npm run lab -- render-evidence --job <id>`. Inspect `review/index.html`,
   isolated alpha assets, slicing/state sheets, geometry overlays, and the
   native, phone, and thumbnail PNGs; iterate until layout, silhouettes, hierarchy,
   palette, typography, materials, and target-phone readability are close.
8. Record the inspected sizes and evidence-backed findings with
   `record-mobile-review`; this never grants artistic approval.
9. Stop for user review when consequential visual choices remain. Never remove
   an unresolved item by guessing.
10. After explicit user approval, run
   `npm run lab -- approve --job <id> --reviewer "<name>"`, verify
   `approval-status`, then run `build` and `compare`. Never invent a reviewer.
   Any draft, reference, or evidence change requires renewed approval.
11. Report outputs, remaining visual differences, and validation actually run.

## Boundaries

- Use Codex visual reasoning directly. Do not call a model API.
- Treat the screenshot as reference evidence only.
- Never crop, raster-trace, embed, or link screenshot pixels in production SVG.
- Preserve editable geometry, stable IDs, separate effects, and provenance.
- Written rules override generated references. Reject unregistered, rejected,
  superseded, or incompatible authorities rather than averaging styles.
- Do not mutate parent-project source, records, evidence, showcase, or exports.
- Do not claim pixel-perfect fidelity from geometry metrics alone; inspect it.
