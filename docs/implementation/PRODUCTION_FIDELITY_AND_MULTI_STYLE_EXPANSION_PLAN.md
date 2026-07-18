# LNH Prism â€” Production Fidelity and Multi-Style Expansion Plan

## Document status

**Status:** Approved strategic direction from the project owner  
**Primary audience:** Codex agents working inside the LNH Prism repository  
**Purpose:** Upgrade LNH Prism from a technically successful deterministic UI pipeline into a production-quality, multi-style game UI asset system.

This document extends the current Frostbound refinement work and defines the roadmap for renderer generalization, second-style transfer, third-style contrast testing, and a later bounded style-authoring workflow.

This document does not replace:

- `AGENTS.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP.md`
- `docs/CHANGE_CONTROL.md`
- Existing module specifications
- Existing validation rubrics
- Existing architectural decisions

Those documents remain the projectâ€™s operational source of truth.

---

# 1. Mission

LNH Prism follows this principle:

> AI creates concepts and reusable materials; deterministic tools create structure and final assets.

The project has already proven the following capabilities:

- Deterministic SVG generation
- Deterministic PNG export
- Structured and editable layers
- Stable component IDs
- Stable asset IDs
- Versioned component specifications
- Versioned material packs
- Material provenance
- Engine-neutral modular packaging
- Showroom integration
- Contract validation
- Regression validation
- Clean-workspace reproduction
- Export receipts
- Package recovery
- Release controls

The next challenge is no longer proving that deterministic UI generation works.

The next challenge is:

> Make deterministic and modular assets feel authored, premium, materially rich, irregular, and production-ready instead of merely clean and procedural.

The system must first solve this problem with the Frostbound style.

After Frostbound reaches a production-quality visual bar, the successful techniques must be generalized so that substantially different styles can be produced without:

- Rewriting component templates
- Adding component-specific hacks
- Creating a parallel renderer
- Flattening editable structure
- Abandoning deterministic reproduction

---

# 2. Strategic development order

The system must be developed in this order:

```text
Frostbound production fidelity
â†’ renderer capability generalization
â†’ Volcanic Forge transfer test
â†’ third-style contrast test
â†’ bounded style-authoring workflow
```

Do not optimize for producing many styles quickly.

Optimize for proving that:

1. One premium-quality style can be generated deterministically.
2. Its quality comes from reusable systems.
3. Those systems can transfer to materially different styles.
4. The outputs remain modular, editable, traceable, and engine-neutral.

---

# 3. Non-negotiable constraints

All work under this plan must preserve the following constraints.

## 3.1 Deterministic output

The same versioned inputs must reproduce the same outputs.

Where variation is required:

- Variation must use an explicit seed.
- The seed must be versioned or recorded.
- The seed must be written into manifests and receipts.
- The same seed must reproduce the same result.
- Variation must remain within documented bounds.
- Variation must not break layout, readability, or component bounds.

Unseeded randomness is prohibited.

---

## 3.2 Editable structure

Complexity must remain structurally editable.

Geometry, effects, ornaments, materials, lighting, focal elements, and variation masks must remain independently addressable.

Do not replace structured components with:

- Flattened screenshots
- Single baked component images
- Reference image crops
- Component-specific texture paintings
- Untraceable raster overlays

Raster exports may exist only as deterministic derived outputs unless an approved change request explicitly defines another source type.

---

## 3.3 No reference-pixel extraction

Reference images are art-direction and comparison evidence only.

Reference image pixels must not enter:

- Production SVG files
- Production PNG sources
- Material textures
- Masks
- Decals
- Normalized material sources
- Component source layers
- Focal-object sources

All generated materials and effects must be:

- Procedural
- Source-neutral
- Independently created
- Properly licensed
- Versioned and traceable

---

## 3.4 Reusable materials

Visual treatment must be represented through reusable material systems rather than component-specific decoration.

Examples include:

- Ice
- Crystal
- Dark stone
- Silver metal
- Gold
- Brass
- Obsidian
- Lava
- Wood
- Leaves
- Moss
- Magical glass
- Arcane energy

A material must describe how a surface behaves visually, not only which colors it uses.

---

## 3.5 Stable IDs and provenance

All new systems must preserve stable identification and traceability.

This includes:

- Components
- Component states
- Component parts
- Edge-stack presets
- Material responses
- Lighting models
- Ornament assets
- Ornament anchors
- Variation presets
- Variation seeds
- Focal presets
- Typography treatments
- Output files
- Manifests
- Receipts

Every final output must remain traceable to:

- Source specification
- Style specification
- Material pack
- Renderer version
- Dependency versions
- Seed
- Output hash

---

## 3.6 Engine-neutral delivery

The final production deliverable remains an engine-neutral asset package.

Required outputs include:

- Canonical SVG
- Deterministic PNG derivatives
- Export manifests
- Stable asset IDs
- Dimensions
- State and part metadata
- Material provenance
- Output hashes
- Extraction guidance
- Exact folder locations

Do not introduce Unity-specific or engine-specific implementation unless a future approved change request explicitly changes the project boundary.

---

## 3.7 Human-controlled art direction

Human-decision tasks must remain human-decision tasks.

Codex may:

- Inspect evidence
- Identify gaps
- Prepare alternatives
- Recommend an option
- Generate comparison surfaces
- Prepare unscored review records

Codex must not:

- Approve aesthetic direction
- Assign final human review scores without authorization
- Mark a human decision complete
- Change project direction silently
- Treat its own recommendation as approval

---

## 3.8 One coherent task per execution

Codex must follow the workflow in `AGENTS.md`.

Each execution must:

- Select one eligible task
- Confirm scope
- Implement only that task
- Validate it
- Review the diff
- Update required project records
- Commit
- Push
- Report the next task

Do not combine several roadmap tasks into one uncontrolled change.

---

# 4. Current visual-quality assessment

The current system is structurally strong but visually underdeveloped relative to the approved Frostbound target.

## 4.1 Existing strengths

The current implementation already provides:

- Clear component hierarchy
- Consistent angular geometry
- Wide-hexagonal component language
- Reusable component boundaries
- Practical deterministic templates
- Clear content slots
- Stable renderer output
- Modular asset exports
- Strong technical validation
- Strong source and output traceability

These strengths must be preserved.

---

## 4.2 Main visual gap: material depth

The target reference contains multiple clearly differentiated material responses.

These include:

- Dark carved internal substrate
- Bright crystalline outer surfaces
- Metallic internal borders
- Translucent ice
- Frost accumulation
- Internal light scattering
- Edge bloom
- Surface cracks
- Scratches
- Local reflected highlights
- Different primary and secondary material emphasis

The current output relies too heavily on:

- Flat gradients
- Uniform cyan outlines
- Repeated geometric patterns
- Similar treatments across components
- Limited surface differentiation
- Limited internal depth

As a result, the output reads closer to a clean vector HUD than a premium frozen fantasy interface.

---

## 4.3 Main visual gap: edge hierarchy

A premium border must not be represented as only one stroke.

The target style requires an edge construction similar to:

```text
outer separation shadow
â†’ structural silhouette
â†’ ice or metal body
â†’ dark bevel
â†’ bright bevel
â†’ inner shadow
â†’ inner rim
â†’ accent highlight
â†’ optional glow
â†’ content-surface boundary
```

The current output often behaves closer to:

```text
outer polygon
â†’ cyan stroke
â†’ dark fill
```

This is a major reason the current result feels drafted rather than dimensional.

---

## 4.4 Main visual gap: focal-object quality

The central reward object is the visual anchor of the target composition.

It requires:

- A distinctive silhouette
- Large readable facets
- Internal color variation
- Bright central illumination
- Rim lighting
- Refraction-like highlights
- Fracture lines
- Support ornaments
- Floating shards
- Magical rings
- Particles
- Ground glow
- Strong scale and hierarchy

The focal object must become a first-class reusable system.

It must not remain:

- A placeholder polygon
- A single static icon
- A flattened one-off illustration
- A component-specific raster image

---

## 4.5 Main visual gap: composition and scale

The target composition uses strong visual-weight contrast.

It includes:

- A large title
- A dominant reward object
- A heavy primary action
- A clearly subordinate secondary action
- A strong outer frame
- Large top and bottom anchors
- Supporting ornaments that reinforce the focal path

The current composition keeps many elements at similar visual weight.

The result is orderly but not dramatic.

The upgraded system must support deliberate visual hierarchy rather than only correct layout.

---

## 4.6 Main visual gap: controlled irregularity

The reference includes deliberate non-uniformity:

- Asymmetrical cracks
- Uneven frost
- Variable shard shapes
- Irregular highlight placement
- Localized scratches
- Organic particle placement
- Different edge-wear areas
- Non-uniform translucency

Determinism must not force perfect visual repetition.

The project needs deterministic, seeded irregularity.

---

## 4.7 Main visual gap: typography

Typography must be treated as part of the style system.

Required treatment may include:

- Face gradient
- Thin dark outline
- Upper bevel highlight
- Lower shadow
- Controlled glow
- Engraved appearance
- Embossed appearance
- Letter spacing
- Width-fit rules
- State-specific treatment
- Hierarchy-specific treatment

Typography effects must remain independent from component geometry.

---

# 5. Target style architecture

A style must be assembled from independent systems.

```text
Style
â”œâ”€â”€ Shape Language
â”œâ”€â”€ Material Family
â”œâ”€â”€ Edge Language
â”œâ”€â”€ Lighting Model
â”œâ”€â”€ Ornament Language
â”œâ”€â”€ Surface Variation
â”œâ”€â”€ Typography Treatment
â”œâ”€â”€ Focal Treatment
â””â”€â”€ State Treatment
```

A style must not be represented as one monolithic theme object containing arbitrary renderer behavior.

Example:

```yaml
styleId: frostbound-premium

shapeLanguage: angular-wide-hex
materialFamily: ice-silver-darkstone
edgeLanguage: multi-bevel-crystalline
lightingModel: cold-top-rim-inner-glow
ornamentLanguage: crystal-runes-shards
surfaceVariation: frost-cracks-scratches
typographyTreatment: fantasy-silver-embossed
focalTreatment: faceted-crystal-reward
stateTreatment: glow-compression-frost-dim
```

A later style should be able to reuse the same structural geometry while replacing other style axes.

Example:

```yaml
styleId: volcanic-forge

shapeLanguage: angular-wide-hex
materialFamily: obsidian-brass-lava
edgeLanguage: forged-metal-inset
lightingModel: warm-bottom-inner-glow
ornamentLanguage: rivets-runes-embers
surfaceVariation: soot-cracks-hammering
typographyTreatment: engraved-gold
focalTreatment: molten-core
stateTreatment: heat-glow-compression-dim
```

---

# 6. Required renderer systems

# 6.1 Layered edge-stack system

Introduce a reusable edge-stack system.

Illustrative TypeScript contract:

```ts
export interface EdgeLayer {
  id: string;
  inset: number;
  thickness: number;
  opacity: number;
  blendMode?: string;
  materialBinding?: string;
  effectBinding?: string;
}

export interface EdgeStack {
  id: string;
  outerShadow?: EdgeLayer;
  outerRim?: EdgeLayer;
  bodyMaterial?: EdgeLayer;
  bevelDark?: EdgeLayer;
  bevelLight?: EdgeLayer;
  innerShadow?: EdgeLayer;
  innerRim?: EdgeLayer;
  accentHighlight?: EdgeLayer;
  accentGlow?: EdgeLayer;
}
```

The exact contract must follow existing repository conventions.

## Minimum edge-stack preset families

- `ice-heavy`
- `metal-heavy`
- `dark-inset`
- `glowing-primary`
- `muted-secondary`
- `ornamental-frame`

## Required behavior

- Every edge layer has a stable ID.
- Every edge layer can be independently inspected.
- Layer ordering is defined by contract.
- Layer ordering is validated.
- Inset and thickness values are bounded.
- Invalid self-intersecting geometry is rejected.
- Existing M7 geometry remains compatible.
- Edge stacks may be shared by several components.
- A change to a shared edge preset propagates to all bound components.
- Component-specific hardcoded edge behavior is prohibited.

## Required validation

- Contract validation
- Invalid thickness rejection
- Invalid inset rejection
- Invalid ordering rejection
- Determinism testing
- Layer-isolation rendering
- Target-size clipping validation
- M7 backward-compatibility validation

---

# 6.2 Structural geometry and ornament separation

Each component must separate these concepts:

```text
structural silhouette
functional content region
edge stack
corner ornaments
center ornaments
material overlays
local variation masks
lighting accents
```

## Structural requirements

- Structural geometry must remain valid without ornaments.
- Functional content bounds must remain independent.
- Ornament placement must not silently change hit or content bounds.
- Ornaments must be anchored deterministically.
- Ornament clipping must be explicit.
- Ornament mirroring must be configurable.
- Symmetry must not be assumed.
- Ornament density must be style-controlled.
- Ornaments must have stable IDs.
- Ornament assets must be reusable across components.

Illustrative contracts:

```ts
export interface OrnamentAnchor {
  id: string;
  position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "left-center"
    | "center"
    | "right-center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "custom";
  offsetX: number;
  offsetY: number;
  rotation: number;
  mirrorGroup?: string;
}

export interface OrnamentBinding {
  ornamentId: string;
  anchorId: string;
  scale: number;
  opacity: number;
  materialBinding?: string;
}
```

The actual schema must align with existing naming and versioning conventions.

---

# 6.3 Material-response system

Materials must describe visual behavior rather than only palette and texture.

Illustrative contract:

```ts
export interface MaterialResponse {
  id: string;
  baseTone: GradientSpec;
  roughnessPattern?: PatternSpec;
  highlightResponse?: HighlightSpec;
  edgeTransmission?: EdgeTransmissionSpec;
  internalGlow?: GlowSpec;
  crackResponse?: CrackSpec;
  frostResponse?: FrostSpec;
  scratchResponse?: ScratchSpec;
  opacityResponse?: OpacitySpec;
}
```

## Minimum Frostbound material responses

- `frostbound-dark-substrate`
- `frostbound-silver-metal`
- `frostbound-clear-ice`
- `frostbound-blue-crystal`
- `frostbound-cold-glow`

## Required behavior

- Material response can be bound to structural regions.
- Edge response may differ from center response.
- Highlight direction binds to a lighting model.
- Internal glow remains independently editable.
- Frost, crack, and scratch channels are optional.
- Material response supports a zero-detail baseline.
- Surface variation is seed-driven.
- Material sources remain reusable.
- Material provenance is recorded.
- No reference pixels enter the material pack.

## Required isolation evidence

For every material response, render:

- Base tone only
- Highlight response only
- Edge response only
- Internal glow only
- Surface variation only
- Combined response
- Target-size appearance

---

# 6.4 Deterministic seeded variation

Introduce a reusable variation contract.

Example:

```json
{
  "variationSeed": 14821,
  "frostCoverage": 0.34,
  "crackDensity": 0.17,
  "highlightScatter": 0.22,
  "particleCount": 18,
  "shardVariance": 0.15,
  "asymmetry": 0.08
}
```

## Required variation channels

At minimum:

- Frost coverage
- Crack density
- Scratch density
- Highlight scatter
- Particle count
- Particle placement
- Shard variance
- Local asymmetry
- Surface-wear distribution

## Requirements

- Same seed and same inputs produce the same output.
- Different seeds produce bounded differences.
- Every channel has documented minimum and maximum values.
- Every channel supports zero.
- Variation can be localized to a region.
- Variation must not change functional content bounds.
- Variation must not cause clipping.
- Variation must not reduce text readability below the accepted threshold.
- Seed is written into output manifests.
- Seed is written into validation receipts.

## Required tests

- Same-seed reproducibility
- Different-seed bounded-difference test
- Zero-variation test
- Minimum-value test
- Maximum-value test
- Invalid-value rejection
- Clean-workspace reproduction
- At least three golden seeds

---

# 6.5 Focal-object framework

Create a first-class focal-object framework.

The first production implementation is the Frostbound crystal.

## Required independently addressable layers

```text
focal-core
focal-facets
focal-rim
focal-inner-light
focal-fractures
focal-support-frame
focal-back-ring
focal-floating-shards
focal-particles
focal-ground-glow
```

## Crystal generator requirements

- Versioned silhouette preset
- Versioned facet topology
- Per-face gradient control
- Facet-level material binding
- Rim light
- Internal core light
- Optional fracture lines
- Optional translucent overlays
- Optional floating shard field
- Optional support frame
- Optional backplate rings
- Optional ground glow
- Seeded particle placement
- Seeded shard placement
- Small preset
- Medium preset
- Large preset
- Canonical SVG
- Deterministic PNG derivative
- Stable layer IDs
- Output provenance
- Manifest lineage

## Focal-object acceptance criteria

- The object remains recognizable at target mobile scale.
- Large facets remain readable at target mobile scale.
- Internal glow does not destroy silhouette.
- The focal object dominates the intended visual hierarchy.
- Individual focal layers can be toggled in the showroom.
- The focal framework is not hardcoded specifically to crystals.
- A later style can implement a molten core, jewel, orb, seed, or magical artifact through the same framework.
- No component-specific raster painting is required.

---

# 6.6 Typography-treatment system

Create reusable typography treatments.

Illustrative contract:

```ts
export interface TypographyTreatment {
  id: string;
  faceGradient?: GradientSpec;
  outline?: StrokeSpec;
  upperBevel?: HighlightSpec;
  lowerShadow?: ShadowSpec;
  glow?: GlowSpec;
  embossDepth?: number;
  tracking?: number;
  widthFitRule?: "scale" | "wrap" | "truncate" | "alternate-size";
  stateOverrides?: Record<string, Partial<TypographyTreatment>>;
}
```

## Minimum Frostbound typography presets

- `frostbound-title`
- `frostbound-primary-action`
- `frostbound-secondary-action`
- `frostbound-progress-label`
- `frostbound-supporting-label`

## Requirements

- Text effects remain separate from button and panel geometry.
- Width fitting is deterministic.
- Text state changes do not move unrelated component geometry.
- Pressed text offset is explicit.
- Disabled treatment is explicit.
- Title hierarchy differs clearly from supporting text.
- Primary action differs clearly from secondary action.
- Font provenance and licensing are recorded.
- Font files must not be included in distributable output unless explicitly approved and legally permitted.

## Validation

- Small-width label
- Long-width label
- Target mobile scale
- Disabled state
- Pressed state
- High-contrast surface
- Low-contrast surface
- Width-overflow handling
- Deterministic layout

---

# 6.7 Lighting-model system

Introduce a style-level lighting model.

Illustrative contract:

```ts
export interface LightingModel {
  id: string;
  keyDirection: number;
  keyIntensity: number;
  rimDirection?: number;
  rimIntensity?: number;
  innerGlowIntensity?: number;
  ambientTone: string;
  bloomBudget?: number;
}
```

## Frostbound baseline

- Cold top key light
- Bright upper bevel
- Dark lower bevel
- Blue internal glow
- Controlled rim light
- Limited bloom
- Stronger focal illumination than component illumination
- Consistent light direction across all components

## Requirements

- All materials reference a shared lighting model.
- Components do not invent unrelated light directions.
- Focal objects may use a documented intensity multiplier.
- Bloom has an explicit budget.
- Disabled states reduce lighting without losing readability.
- Pressed states change lighting according to a defined state recipe.
- Lighting settings are versioned.

---

# 6.8 Composition hierarchy system

The composition must explicitly define visual hierarchy.

Recommended hierarchy:

```text
1. Reward focal object
2. Main title
3. Primary action
4. Progress or reward state
5. Secondary action
6. Supporting copy
7. Decorative ornaments
```

## Requirements

- Element sizes are not chosen only from equal spacing rules.
- Visual weight is evaluated at thumbnail scale.
- Primary and secondary actions must not compete equally.
- The focal object must not be visually weaker than the progress bar or secondary button.
- Ornament density must support the focal path.
- Outer frame detail must not compete with the focal object.
- Empty space must be used deliberately.
- Mobile safe areas remain respected.

---

# 7. Visual-review framework

Technical correctness remains mandatory but must not inflate the visual-quality score.

A technically perfect but visually weak package must not receive a high fidelity score.

## 7.1 Visual score

| Dimension | Weight |
|---|---:|
| Silhouette fidelity | 10 |
| Material separation | 15 |
| Edge depth and bevel hierarchy | 15 |
| Lighting coherence | 10 |
| Focal-object strength | 15 |
| Ornament density and placement | 10 |
| Controlled surface variation | 10 |
| Composition and visual hierarchy | 10 |
| Mobile-scale readability | 5 |
| **Total** | **100** |

## 7.2 Suggested dimension guidance

### Silhouette fidelity â€” 10

Evaluate:

- Shape readability
- Angular language
- Wide-hex consistency
- Component distinction
- Target-style recognition

### Material separation â€” 15

Evaluate:

- Ice versus metal
- Metal versus substrate
- Crystal versus frame
- Primary versus secondary treatment
- Surface behavior at mobile scale

### Edge depth and bevel hierarchy â€” 15

Evaluate:

- Layered construction
- Depth
- Separation
- Highlight coherence
- Inner and outer rim distinction

### Lighting coherence â€” 10

Evaluate:

- Shared light direction
- Consistent highlights
- Controlled bloom
- Focal illumination
- State treatment

### Focal-object strength â€” 15

Evaluate:

- Silhouette
- Facets
- Internal light
- Supporting effects
- Hierarchy
- Mobile readability

### Ornament density and placement â€” 10

Evaluate:

- Purposeful decoration
- Anchor quality
- Balance
- Controlled asymmetry
- Lack of clutter

### Controlled surface variation â€” 10

Evaluate:

- Frost
- Cracks
- Scratches
- Highlight scatter
- Shard variance
- Deterministic irregularity

### Composition and visual hierarchy â€” 10

Evaluate:

- Visual path
- Scale contrast
- Primary action strength
- Secondary action subordination
- Focal dominance

### Mobile-scale readability â€” 5

Evaluate:

- Text
- State clarity
- Border density
- Focal clarity
- Progress readability

---

## 7.3 Automatic blockers

Any of the following blocks a pass regardless of visual score:

- Non-deterministic output
- Missing stable IDs
- Missing provenance
- Reference-pixel contamination
- Flattened source with no editable structure
- Broken component bounds
- Unreadable target-mobile output
- Missing modular asset package
- Missing exact folder handoff
- Existing approved M7 outputs overwritten without versioning
- Unrecorded random seed
- Invalid manifests
- Missing output receipts
- Agent self-approval of a human-decision gate
- Showroom output differing from packaged renderer output
- Focal object implemented as an untraceable one-off raster

---

## 7.4 Required review distances

Every component and composition must be reviewed at three distances.

### Source scale

Use this to inspect:

- Material details
- Edge hierarchy
- Layer quality
- Artifacts
- Clipping
- Facets
- Cracks
- Frost masks
- Highlight behavior

### Target mobile scale

Use this to inspect:

- Text readability
- State readability
- Border density
- Focal clarity
- Primary and secondary hierarchy
- Progress readability
- Particle clutter

### Thumbnail scale

Use this to inspect:

- Silhouette
- Overall composition
- Visual path
- Focal dominance
- Primary action visibility
- Style recognition

---

# 8. Roadmap

# M8 â€” Frostbound production-fidelity pass

## Goal

Upgrade the current seven-component Frostbound-aligned family into a production-quality package while preserving:

- M7 geometry
- M7 component boundaries
- Determinism
- Stable IDs
- Modular delivery
- Engine-neutral exports
- Provenance
- Existing M7 evidence

---

## M8-A4R â€” Reconcile current M8 scope with production-fidelity requirements

**Execution:** Human decision  
**Owner:** Project owner, Art lead, UI lead, Technical lead  
**Agent role:** Inspect, compare, prepare options, recommend

## Purpose

Before rendering the approved M8 contracts, determine whether the current M8 implementation specification and V8 rubric already cover the required production-fidelity systems.

The review must compare the current M8 documents against:

- Layered edge stacks
- Material-response behavior
- Strong focal-object treatment
- Seeded variation
- Ornament separation
- Typography treatment
- Shared lighting model
- Composition hierarchy
- Three-distance review
- Visual scoring separated from technical correctness

## Required Codex output

Codex must produce a gap matrix containing:

| Requirement | Present in M8 | Partially present | Missing | Evidence | Recommended milestone |
|---|---|---|---|---|---|

Codex must prepare two options.

### Option A â€” Expand M8-A4 before rendering

Use when:

- Missing systems are contract-compatible.
- Missing work is bounded.
- The work can be validated coherently.
- Existing approved M7 outputs remain unchanged.
- M8 will otherwise produce another incremental draft-quality result.

### Option B â€” Keep M8-A4 bounded

Use when:

- Adding the systems would invalidate approved M8 contracts.
- The task would become too broad.
- The renderer needs a separate architectural milestone.
- Current M8 provides a useful intermediate baseline.

In Option B:

- Complete current M8-A4.
- Conduct V8 review honestly.
- Record remaining visual gaps.
- Start missing fidelity systems in M9.

## Recommendation rule

Prefer Option A when the change is bounded and avoids knowingly producing another visually limited package.

Prefer Option B when expanding M8 would create uncontrolled scope or invalidate approved contracts.

## Exit condition

The project owner explicitly selects Option A or Option B.

The selected direction must be recorded in:

- `docs/PROJECT_OVERVIEW.md`
- Relevant M8 specification
- Relevant M8 rubric
- Relevant decision record if required

Codex must not make this decision autonomously.

---

## M8-A4 â€” Render the M8 family, package, and showroom

**Execution:** Agent-ready after required scope decision  
**Owner:** Agent

## Required component inventory

- Primary panel
- Primary button
- Secondary button
- Progress frame
- Progress fill
- Badge or container
- Reward focal crystal or emblem

## Required deliverables

- Versioned seven-component render matrix
- Portrait composition
- Target-phone composition
- Source-scale review sheet
- Target-mobile review sheet
- Thumbnail review sheet
- Independent progress parts
- Focal-object variants
- Layer-isolation views
- Material-isolation views
- Variation-seed comparison
- Canonical SVG assets
- Deterministic PNG derivatives
- Engine-neutral modular package
- Export manifests
- Hash receipts
- Seed receipts
- Exact output folder addresses
- Showroom integration
- Preserved M7 lineage

## Acceptance criteria

- Existing M7 assets are not overwritten.
- Every M8 output has a versioned ID.
- All required components are independently extractable.
- Material responses are visibly differentiated.
- Edge stacks show clear depth.
- Primary and secondary actions have different visual emphasis.
- Focal crystal dominates the intended hierarchy.
- Seeded variation reproduces deterministically.
- Target-mobile readability passes.
- Thumbnail composition remains clear.
- Showroom and package use the same renderer outputs.
- All output receipts validate.
- No reference pixels enter production outputs.

---

## M8-A5 â€” Human V8 production-fidelity review

**Execution:** Human decision  
**Owner:** Product, Art, UI, and Technical leads

## Required evidence

- Target reference
- Current output
- Source-scale comparison
- Target-phone comparison
- Thumbnail comparison
- Layer isolation
- Material-response isolation
- Edge-stack isolation
- Focal-object isolation
- Seed reproducibility
- Source-boundary audit
- Package receipts
- Exact folder handoff
- Unscored review form
- Visual score sheet

## Pass conditions

- Total score meets the approved threshold.
- Every mandatory minimum is met.
- No automatic blocker remains.
- Technical validation passes.
- Accepted visual debt is explicitly recorded.
- Every accepted debt has an owner and next task.

---

# M9 â€” Fidelity tooling and renderer generalization

## Goal

Convert successful Frostbound-specific techniques into reusable renderer capabilities.

The generalized renderer must reproduce Frostbound without Frostbound-specific conditional branches.

---

## M9-A1 â€” Generalize edge stacks

### Deliverables

- Versioned edge-stack schema
- Edge preset registry
- Renderer integration
- Layer-order validation
- Geometry bounds validation
- Existing Frostbound migration
- Showroom edge-layer inspection
- Golden tests
- Documentation

### Acceptance criteria

- Frostbound uses general edge-stack contracts.
- No `styleId === "frostbound"` renderer branch is introduced.
- At least two edge presets are reused by multiple components.
- Invalid stacks fail validation.
- Existing approved outputs remain versioned.
- Rendering is deterministic.

---

## M9-A2 â€” Generalize material responses

### Deliverables

- Versioned material-response schema
- Material-response resolver
- Region bindings
- Edge and center response separation
- Lighting-model bindings
- Isolation previews
- Frostbound migration
- Invalid-input tests
- Provenance integration

### Acceptance criteria

- Frostbound materials run through the generalized material resolver.
- Materials are reusable across component types.
- Material behavior does not depend on component-specific code.
- Source-neutral provenance is complete.
- Isolation previews match combined output behavior.

---

## M9-A3 â€” Generalize seeded variation

### Deliverables

- Seed contract
- Deterministic pseudo-random utility
- Variation-channel registry
- Bounds enforcement
- Region-local variation
- Receipt integration
- Multi-seed golden tests
- Zero-variation baseline

### Acceptance criteria

- Same seed reproduces identical output.
- Different seeds produce bounded variation.
- No variation breaks component bounds.
- Seeds are visible in manifests and showroom traceability.
- Variation channels can be reused by future styles.

---

## M9-A4 â€” Generalize ornament anchors

### Deliverables

- Ornament-anchor schema
- Ornament-binding schema
- Mirroring rules
- Symmetry controls
- Density controls
- Clipping rules
- Reusable ornament library
- Frostbound migration
- Anchor inspection in showroom

### Acceptance criteria

- Ornaments remain separate from structural geometry.
- At least one ornament is reused across multiple components.
- Asymmetry is deterministic.
- Invalid anchors fail validation.
- Ornament changes do not alter functional content bounds.

---

## M9-A5 â€” Generalize focal-object framework

### Deliverables

- Focal-object schema
- Required and optional focal layers
- Focal preset registry
- Crystal implementation as first preset
- Extension API for future focal objects
- Showroom focal-layer toggles
- Mobile readability tests
- Provenance and receipts

### Acceptance criteria

- Frostbound crystal uses the generalized focal framework.
- The framework does not assume every focal object is a crystal.
- Optional layers can be disabled.
- Focal scaling remains deterministic.
- A second placeholder focal preset can be defined without renderer changes.

---

## M9-A6 â€” Generalize typography treatment

### Deliverables

- Typography-treatment schema
- Width-fit rules
- State overrides
- Layout integration
- Mobile-scale readability tests
- Font provenance policy
- Showroom typography inspection

### Acceptance criteria

- Typography effects remain separate from geometry.
- Long and short text behave deterministically.
- Existing content slots remain stable.
- State changes do not create unexpected layout drift.

---

## M9-A7 â€” Complexity and readability budgets

Create explicit limits for:

- Maximum edge-stack depth
- Maximum ornament density
- Maximum particle count
- Maximum bloom
- Maximum glow spread
- Minimum content region
- Minimum text contrast
- Minimum text size
- Maximum SVG file size
- Maximum PNG file size
- Maximum render time
- Maximum package size

### Acceptance criteria

- Budgets are defined in contracts or validation configuration.
- Violations fail or warn according to documented severity.
- Frostbound remains inside the approved limits.
- Target-phone evidence demonstrates readability.

---

## M9 exit gate

M9 passes only when:

- Frostbound reproduces through generalized systems.
- No Frostbound-only renderer branch is required.
- Existing visual quality is preserved.
- Determinism remains intact.
- All receipts remain valid.
- General contracts are ready for a second style.
- Style transfer can begin without rewriting component templates.

---

# M10 â€” Second-style transfer test: Volcanic Forge

## Goal

Prove that the generalized renderer can support a materially different style without rewriting component templates.

## Style definition

```yaml
styleId: volcanic-forge

shapeLanguage: angular-wide-hex
materialFamily: obsidian-brass-lava
edgeLanguage: forged-metal-inset
lightingModel: warm-bottom-inner-glow
ornamentLanguage: rivets-runes-embers
surfaceVariation: soot-cracks-hammering
typographyTreatment: engraved-gold
focalTreatment: molten-core
stateTreatment: heat-glow-compression-dim
```

## Required visual proof

- Obsidian material
- Brass or forged-metal material
- Lava emission
- Warm internal light
- Soot variation
- Crack variation
- Hammered surface response
- Ember particles
- Rivet or rune ornaments
- Molten focal object
- Strong primary and secondary action distinction

## Required structural proof

- Same component inventory
- Shared structural geometry
- Shared edge-stack renderer
- Shared material-response renderer
- Shared seeded variation system
- Shared ornament-anchor system
- Shared focal-object framework
- Shared typography-treatment framework
- No Frostbound-specific code path
- Engine-neutral package
- Full provenance

## M10 exit gate

The style must be clearly distinguishable from Frostbound at thumbnail scale.

The repository must prove:

- Shared templates
- Shared renderer systems
- Different style data
- Different materials
- Different lighting
- Different ornaments
- Different focal treatment

A palette-only reskin does not pass.

---

# M11 â€” Third-style contrast test

Select one of the following.

---

## Option A â€” Enchanted Forest

This style tests:

- Organic ornament overlays
- Wood material
- Leaf material
- Moss material
- Soft magical light
- Curved ornament over deterministic structure
- Controlled asymmetry
- Bioluminescent focal object
- Non-metal edge treatment
- Organic surface variation

Example:

```yaml
styleId: enchanted-forest

shapeLanguage: structured-organic
materialFamily: wood-leaf-moss-magic
edgeLanguage: carved-wood-living-vine
lightingModel: soft-green-biological-glow
ornamentLanguage: leaves-vines-seeds-runes
surfaceVariation: bark-moss-veins-speckles
typographyTreatment: carved-ivory-glow
focalTreatment: luminous-seed
stateTreatment: bloom-compression-wilt-dim
```

This option provides the strongest architecture stress test.

---

## Option B â€” Royal Arcane

This style tests:

- Gold trim
- Polished stone
- Magical glass
- Jewel focal object
- Luxury visual treatment
- Clean premium hierarchy
- Controlled high-value ornament
- Arcane light
- Reduced surface damage

Example:

```yaml
styleId: royal-arcane

shapeLanguage: angular-regal
materialFamily: gold-stone-glass-jewel
edgeLanguage: polished-gold-inset
lightingModel: cool-arcane-key-jewel-glow
ornamentLanguage: crowns-glyphs-filigree
surfaceVariation: polished-veins-sparkles
typographyTreatment: royal-gold-embossed
focalTreatment: arcane-jewel
stateTreatment: jewel-glow-compression-dim
```

This option is lower risk and commercially useful for premium mobile UI.

---

## Recommendation

Choose Enchanted Forest when the goal is maximum renderer flexibility testing.

Choose Royal Arcane when the goal is faster commercial-style validation.

The project owner must make the final choice.

---

## M11 exit gate

The third style must:

- Use the generalized renderer
- Preserve deterministic output
- Preserve modular delivery
- Preserve provenance
- Avoid a parallel renderer
- Avoid flattening
- Be clearly different from both Frostbound and Volcanic Forge
- Pass target-mobile readability
- Pass package validation

---

# M12 â€” Bounded style-authoring workflow

## Start condition

Do not start M12 until all of the following have passed:

- Frostbound production-fidelity review
- Renderer generalization
- Volcanic Forge transfer
- Third-style contrast test

## Goal

Create an authoring workflow around abstractions proven by real production styles.

## Allowed capabilities

- Style preset browser
- Material-response controls
- Lighting controls
- Edge-stack inspector
- Ornament-anchor inspector
- Seed controls
- Focal preset inspector
- Typography-treatment preview
- Reference comparison
- Layer visibility toggles
- Render-matrix generation
- Export packaging
- Receipt inspection
- Provenance inspection
- Validation-state display

## Non-goals

Do not build:

- A general-purpose vector editor
- A Photoshop replacement
- A Figma replacement
- A freeform painting system
- An arbitrary node graph
- A full shader editor
- A fully autonomous UI layout generator
- A full-screen automatic UI design tool

The workflow must remain bounded to proven production needs.

---

# 9. Proposed repository changes

The exact filenames must follow current repository conventions.

## New primary document

```text
docs/implementation/PRODUCTION_FIDELITY_AND_MULTI_STYLE_EXPANSION_PLAN.md
```

## Existing files likely requiring updates after approval

```text
docs/PROJECT_OVERVIEW.md
docs/ROADMAP.md
docs/modules/08-reference-fidelity-style-expansion.md
docs/implementation/M8_FROSTBOUND_ALIGNED_REFINEMENT_SPEC.md
docs/validation/M8_FROSTBOUND_ALIGNED_REFINEMENT_RUBRIC.md
```

## Recommended future module documents

```text
docs/modules/09-fidelity-tooling-generalization.md
docs/modules/10-volcanic-forge-transfer.md
docs/modules/11-third-style-contrast.md
docs/modules/12-style-authoring-workflow.md
```

## Recommended future implementation documents

```text
docs/implementation/M9_FIDELITY_TOOLING_SPEC.md
docs/implementation/M10_VOLCANIC_FORGE_SPEC.md
docs/implementation/M11_THIRD_STYLE_CONTRAST_SPEC.md
docs/implementation/M12_STYLE_AUTHORING_WORKFLOW_SPEC.md
```

## Recommended future validation documents

```text
docs/validation/V8_PRODUCTION_FIDELITY_RUBRIC.md
docs/validation/V9_GENERALIZATION_RUBRIC.md
docs/validation/V10_STYLE_TRANSFER_RUBRIC.md
docs/validation/V11_STYLE_CONTRAST_RUBRIC.md
```

Do not create duplicate M8 documents when an existing document should be updated.

## Possible schema files

```text
specs/edge-stack.schema.json
specs/material-response.schema.json
specs/variation.schema.json
specs/ornament-anchor.schema.json
specs/focal-object.schema.json
specs/typography-treatment.schema.json
specs/lighting-model.schema.json
```

Codex must inspect existing schema naming, organization, and versioning before choosing final paths.

---

# 10. Codex execution protocol

For every task in this plan, Codex must follow this protocol.

## 10.1 Read source-of-truth documents

Before editing, read:

1. `AGENTS.md`
2. `docs/PROJECT_OVERVIEW.md`
3. `docs/ROADMAP.md`
4. `docs/CHANGE_CONTROL.md`
5. Relevant module document
6. Relevant implementation specification
7. Relevant validation rubric
8. Latest applicable validation record
9. Current Git status
10. Recent Git history

---

## 10.2 Confirm task eligibility

Before implementation, state:

- Task ID
- Task title
- Owner
- Execution status
- Why it is eligible
- Dependencies
- Acceptance criteria
- Expected files to change

Do not start a human-decision task as implementation work.

---

## 10.3 Implement one task only

- Preserve unrelated user changes.
- Keep backward compatibility unless an approved migration permits a break.
- Version changed contracts.
- Do not overwrite approved assets.
- Keep generated files scoped.
- Do not begin the next task automatically.

---

## 10.4 Validate proportionally to risk

Validation may include:

- Schema tests
- Unit tests
- Integration tests
- Determinism tests
- Golden-render tests
- Visual-diff tests
- Package validation
- Receipt validation
- Source-boundary audit
- Clean-workspace reproduction
- Showroom equivalence
- Mobile readability review
- Source-scale inspection
- Thumbnail inspection

Do not claim validation that was not run.

---

## 10.5 Review the final diff

Before committing, inspect:

- Changed source files
- Changed generated files
- New schemas
- Version changes
- IDs
- Manifests
- Receipts
- Output paths
- Accidental deletions
- Unexpected M7 asset changes
- Untracked files
- Unrelated modifications

---

## 10.6 Update project control

Update `docs/PROJECT_OVERVIEW.md` when:

- Task status changes
- Milestone status changes
- A new material risk appears
- A new decision is accepted
- The next task changes
- A blocker is discovered

Update detailed reasoning in the relevant module, implementation, validation, or decision document.

---

## 10.7 Commit and push

For every mutating task:

- Create one cohesive Conventional Commit.
- Push the current branch to its configured upstream.
- Do not force-push.
- Do not rewrite history.
- Do not switch branches only to complete the task.
- Preserve the working tree if push fails.
- Report the exact blocker if push fails.

---

## 10.8 Required final handoff

Every final Codex task response must include:

1. Completed outcome
2. Validation actually run
3. Exact next task
4. Next task execution color
5. Next task owner
6. Current branch
7. Working-tree status
8. Commit hash
9. Commit subject
10. Push target
11. Push result
12. Any blocker or remaining debt

---

# 11. Testing strategy

# 11.1 Contract tests

New contracts must reject:

- Missing edge-layer IDs
- Duplicate edge-layer IDs
- Invalid edge ordering
- Negative thickness
- Invalid inset
- Invalid material binding
- Missing variation seed
- Out-of-range variation values
- Invalid ornament anchor
- Unknown ornament asset
- Invalid focal-layer bounds
- Invalid focal topology
- Unsupported typography width behavior
- Invalid lighting intensity
- Missing provenance
- Missing version
- Missing stable ID
- Invalid state override

---

# 11.2 Determinism tests

For every new rendering system:

- Same input and same seed produce the same output.
- Same input and different seed produce bounded differences.
- Zero variation produces a stable baseline.
- Canonicalized property ordering produces the same output.
- Clean-workspace rendering reproduces receipts.
- Renderer dependency versions are recorded.
- Seed values are recorded.
- Output hashes are recorded.

---

# 11.3 Golden-render tests

Required render surfaces include:

- Dark background
- Light background
- Source scale
- Target mobile scale
- Thumbnail scale
- Normal state
- Pressed state
- Disabled state
- Selected state where applicable
- Minimum supported size
- Maximum supported size
- At least three variation seeds
- Zero-variation baseline
- Layer isolation
- Material isolation
- Focal isolation
- Ornament isolation

---

# 11.4 Package tests

Verify:

- Unique stable IDs
- Unique paths
- Valid SVG
- Valid PNG
- Correct dimensions
- SVG and PNG consistency
- Hash receipts
- Manifest provenance
- Exact source bindings
- Recorded seeds
- No concept-image dependencies
- No reference-image dependencies
- No untracked package files
- No accidental M7 output mutation
- Exact extraction paths
- Engine-neutral package structure

---

# 11.5 Visual-regression policy

Visual diffs must distinguish between:

- Expected material change
- Expected seed variation
- Unexpected geometry drift
- Unexpected clipping
- Unexpected text movement
- Unexpected brightness increase
- Unexpected bloom increase
- Missing layer
- Incorrect layer order
- Unexpected ornament displacement
- Incorrect focal scaling
- Incorrect state treatment

Seeded variation must always be compared using the same seed.

---

# 12. Art-quality guardrails

## 12.1 Avoid procedural flatness

Do not attempt to solve quality only by:

- Adding more strokes
- Adding more noise
- Increasing glow
- Increasing ornament count
- Increasing gradient count
- Adding random particles
- Adding arbitrary cracks

Quality must come from:

- Coherent material response
- Consistent lighting
- Edge hierarchy
- Focal strength
- Visual hierarchy
- Controlled irregularity
- Mobile readability

---

## 12.2 Avoid style-specific hardcoding

Do not add logic such as:

```ts
if (styleId === "frostbound") {
  // one-off renderer behavior
}
```

Use:

- Contracts
- Presets
- Registries
- Bindings
- Resolvers
- Versioned style data

A temporary migration branch must be explicitly documented and removed before the relevant milestone exits.

---

## 12.3 Avoid unreadable complexity

At target-mobile scale:

- Text must remain readable.
- Content regions must remain clear.
- Borders must not overpower controls.
- Particles must not obscure labels.
- Ornaments must not compete with functional hierarchy.
- Focal details must simplify gracefully.
- Disabled states must remain recognizable.
- Primary and secondary actions must remain distinct.

---

## 12.4 Avoid accidental editor scope

Do not add:

- Arbitrary drawing tools
- General-purpose node graphs
- Freeform painting
- Full design-canvas editing
- General vector manipulation
- Unbounded shader authoring

Any such feature requires a reviewed change request tied to production evidence.

---

## 12.5 Preserve existing successful controls

Do not weaken:

- Stable IDs
- Export manifests
- Provenance
- Determinism
- Asset modularity
- Engine-neutral delivery
- Clean-workspace reproduction
- Package recovery
- Release procedures
- Human approval boundaries

Visual quality must be added without sacrificing technical trustworthiness.

---

# 13. Definition of success

This plan succeeds when all of the following are true.

## Frostbound

- Frostbound reaches a visibly premium production-quality bar.
- The focal object is strong and reusable.
- Materials are visibly distinct.
- Borders have layered depth.
- Surface detail feels controlled rather than repetitive.
- Composition has a clear focal path.
- Mobile readability remains strong.

## Generalization

- Frostbound runs through generalized systems.
- No Frostbound-only renderer branch is required.
- Edge stacks are reusable.
- Material responses are reusable.
- Variation is reusable.
- Ornaments are reusable.
- Focal objects are extensible.
- Typography treatments are reusable.
- Lighting is style-level.

## Multi-style proof

- Volcanic Forge is materially different from Frostbound.
- A third style is materially different from both.
- Neither requires a parallel renderer.
- Neither requires flattened source art.
- All outputs remain deterministic and modular.

## Authoring workflow

- A bounded authoring workflow is created only after abstractions are proven.
- The workflow does not become a general editor.
- The workflow reads and writes project source contracts.
- The workflow does not become a second source of truth.

---

# 14. Immediate next action

Before implementation begins, Codex must compare the current approved M8 specification and V8 rubric against this document.

Use this command:

```text
Guide: Review whether M8-A4 should be expanded to include the production-fidelity requirements defined in docs/implementation/PRODUCTION_FIDELITY_AND_MULTI_STYLE_EXPANSION_PLAN.md, or remain bounded with missing systems moved into M9.

Read AGENTS.md, docs/PROJECT_OVERVIEW.md, docs/ROADMAP.md, the current M8 implementation specification, the current M8 validation rubric, and the latest M8/M7 validation evidence.

Prepare a detailed gap matrix covering:
- layered edge stacks
- material-response channels
- seeded controlled variation
- structural and ornament separation
- focal-object framework
- typography treatments
- lighting model
- composition hierarchy
- three-distance review
- visual scoring separated from technical correctness

Provide:
1. evidence for each finding
2. impact of each missing or partial capability
3. Option A: expand M8-A4 before rendering
4. Option B: keep M8-A4 bounded and move missing systems to M9
5. benefits, risks, dependencies, and downstream impact of each option
6. a recommendation

Do not modify code, specifications, status, roadmap, or decisions until I explicitly approve an option.
```

After the project owner selects an option, use:

```text
Next:
```

Codex must then start only the next eligible agent-ready task recorded in `docs/PROJECT_OVERVIEW.md`.

---

# 15. Final strategic summary

The highest-value capabilities are:

1. Layered edge stacks
2. Material-response channels
3. First-class focal-object framework
4. Seeded controlled variation
5. Structural and ornament separation
6. Typography treatments
7. Shared lighting models
8. Composition hierarchy
9. Three-distance visual review

The required expansion order is:

```text
Frostbound quality
â†’ generalized renderer systems
â†’ Volcanic Forge
â†’ Enchanted Forest or Royal Arcane
â†’ bounded authoring workflow
```

Do not expand into many styles while the current style still looks procedural.

First prove premium quality.

Then prove reuse.

Then prove variation.
