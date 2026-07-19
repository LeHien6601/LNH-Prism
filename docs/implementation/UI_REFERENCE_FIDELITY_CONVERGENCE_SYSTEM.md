# UI reference-fidelity convergence system

## Purpose

This operating system closes the gap between a generated concept image and deterministic SVG/PNG components without copying concept pixels. It translates a review-only reference into a versioned visual grammar, then proves that grammar survives modularization, resizing, state changes, and target-phone viewing.

The reference remains evidence only: no source raster, crop, palette sample, embedded `<image>`, or traced contour may enter production assets.

## Current diagnosis: Enchanted Forest

The M11 concept reads as a crafted ancient-grove object: structural stone slabs frame the screen; wood has directional volume and occluded joints; moss attaches at damp seams; roots support the seed; and its light changes nearby materials. The deterministic output is technically clean and materially separated, but its stone chips, grain, lichen, roots, and glow mostly read as independently placed vector motifs over flat faces.

This is a **construction-grammar gap**, not a missing-color or missing-detail gap. Adding more isolated motifs will increase noise without closing it. Each family must instead contribute a connected, scale-aware layer stack, and the focal/state system must affect those layers in controlled ways.

## Reference grammar capture

Before a new family or substantial remediation, create a concise `reference-grammar` record beside the style definition. Describe, in original words and diagrams rather than copied pixels:

| Scale | Capture | Required decision |
|---|---|---|
| Macro | silhouette, frame rhythm, focal/action path, quiet zones | Which surfaces contain content and where is visual weight allowed? |
| Meso | material joins, border stacks, root/vine paths, light pools | Which named layers touch, overlap, or cast/receive depth? |
| Micro | chips, grain, lichen, seams, specks | Which primitives are allowed, at what density/orientation, and which are absent on compact controls? |
| State | normal, pressed, disabled, highlighted contrast/motion | What player-visible change proves the state without hiding semantic content? |

Name at least one positive and one prohibited behavior for each material family. Example: moss may bridge damp stone/wood joints and grow from corners; it may not float as a centered repeated sticker.

## Deterministic material construction profiles

Every production material family needs independently editable layers below. A named SVG group or isolated glyph alone does not qualify as a material.

| Family | Required construction profile |
|---|---|
| Stone | clipped structural plate; edge-following seeded fracture/join field; selective contact occlusion and light-facing bevel; sparse wear at exposed corners/joins |
| Wood | declared growth-vector body; tapered/overlapping relief bands; limited knot/split at a structural anchor; termination behind or into stone/moss masks |
| Moss / lichen | declared seam, recess, lower-edge, or damp-corner substrate; irregular coverage transition from that anchor; limited silhouette detail only where size supports it; subtle nearby living-light receiver tint |
| Living light / focal | bounded emitter and falloff; roots/cradle that partly occlude and support it; named stone, wood, moss, and edge/typography receiver channels; containment outside semantic slots |

At least one full-size panel and one compact control must be inspected with all profiles composited. The material-isolate board must invoke the same helpers and masks as the production components.

## Complexity budget and scaling rules

| Surface class | Allowed construction | Prohibited failure mode |
|---|---|---|
| Hero panel / focal container | all profile stages; two to three depth tiers; one connected focal-to-frame path | even detail distribution that competes with title, reward, or actions |
| Primary action | one dominant material body plus one restrained secondary family; state receiver permitted | miniature portrait, repeated decals, or unreadable state glow |
| Secondary action / tab / badge | one structural cue plus one family accent; quiet semantic slot | knots, vines, chips, and moss competing in the same compact face |
| Progress frame/fill | material at frame/ends; fill owns readable energy | texture/ornament that obscures percentage or creates false boundaries |
| Icon container | frame relief and focal receiver; icon owns centre contrast | background treatment that competes with icon silhouette |

Express these constraints as component-class density and mask budgets, not per-output hand edits. Seeded variation may change declared positions, variants, and opacity only inside those budgets.

## State-language contract

State is a perceptual contract, not a raw token change. Evidence must show a side-by-side normal comparison at source and target-phone scale, and a reviewer must identify the state without reading a label or relying on color alone.

| State | Required cue | Material response | Guardrail |
|---|---|---|---|
| Normal | stable living presence | low receiver response, readable relief | passive glow does not overwhelm labels |
| Pressed | contained energy/compression | focal plus nearby moss/wood receiver intensify; relief shifts consistently | preserve label contrast and border silhouette |
| Disabled | dormant unavailable object | emitter and receivers desaturate/dim together; relief remains | not merely lower global opacity |
| Highlighted / selected | active attunement | localized edge/focal response plus a small material cue | not fire, ice, or a generic hover outline |

## Two-loop convergence workflow

1. **Grammar loop:** capture reference grammar; bind construction profiles; set complexity/state contracts; render only hero panel, primary action, compact control, and focal isolate.
2. **Craft loop:** inspect those four surfaces at source, target-phone, thumbnail, and isolate scale. Correct joins, depth ordering, receiver behavior, and density before full-matrix generation.
3. **Delivery loop:** regenerate matrix, modules, manifests, seed receipts, and technical preflight only after the craft loop passes.
4. **Scoring loop:** apply the approved rubric independently of technical correctness. A failure returns the smallest layer/profile owner, not a broad palette or detail pass.

### Craft-loop checklist

- Can a reviewer identify where stone meets wood and where moss is anchored without labels?
- Do light-facing and occluded faces differ selectively rather than through uniform outlines?
- Does the focal visibly affect at least two named receiver families while semantic slots remain quiet?
- Do compact controls show fewer visual events than the hero panel while retaining family identity?
- Can all required states be distinguished at target-phone size without semantic text?
- Does the isolate explain the production surface instead of showing a separate demonstration grammar?

## Required evidence and regression controls

- `reference-grammar` record with material/profile and state contracts;
- four-surface craft board at source and target-phone scales;
- normal/pressed, normal/disabled, and normal/highlighted state-pair boards;
- layer/mask provenance proving the isolate uses production helpers;
- deterministic density receipts per component class and seed;
- focused assertions for compact-control budgets and declared state-receiver deltas.

These supplement—not replace—package, provenance, clean-workspace, shared-seam, and review-reference-boundary validation.

## M11-R015 execution order

1. Write the Enchanted Forest grammar record and state contract from V11-B008.
2. Upgrade existing stone, wood, moss, and living-light helpers into the profiles above; retain family IDs and seed ownership.
3. Apply component-class budgets, reducing compact-control layers before adding hero-panel depth.
4. Bind state changes through focal/receiver channels and produce the state-pair board.
5. Run the craft loop, then regenerate full M11 evidence/package and technical validation.
6. Score only after joins, focal interaction, and state changes are independently reviewable.

## Non-goals

- No reference-image extraction, tracing, raster embedding, or pixel-derived production source.
- No style-specific renderer/template fork, new component type, unseeded randomness, or flattened monolithic asset.
- No assumption that higher procedural density alone equals higher visual quality.
