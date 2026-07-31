# Block Forge visual-quality improvement review — 2026-07-31

## Scope

This review assesses the technically validated `block-forge@1.0.0` package
against the approved Block Forge consistency board. It is a diagnostic control
record; it does not revise the roadmap or start implementation.

## Facts

- The package contains 22 promoted component families and 120 files.
- It is engine-neutral, reference-free, and package validation passes.
- The Block Forge project audit has zero technical findings.
- Eight bounded review outputs exist for puzzle, shared UI, gameplay HUD, Town,
  Workshop, Victory, Failure, and cross-screen consistency.
- Unity integration remains deferred.

## Visual-review inferences

- The system has coherent broad color roles and reusable geometry, but its
  construction reads as functional reconstruction rather than the approved
  tactile craft-village visual bar.
- The most material gaps are flat surface construction, thin typography,
  abstract/inconsistent iconography, incomplete puzzle presentation, and sparse
  review composition.
- A zero-finding technical audit establishes package correctness; it does not
  establish visual readiness.

## Ordered recommendations

| Priority | Recommendation | Classification | Eligibility | Acceptance summary |
|---|---|---|---|---|
| P0 | Define and approve a shared Block Forge construction recipe on one button and one small panel: navy silhouette, lower-right depth, wood/cream base, inset, upper-left highlight, restrained material accent, contained shadow, and content layer. | Asset system | Human decision | Editable layers, distinct wood/cream/enamel materials, consistent light/depth direction, bounded layer budget. |
| P0 | Replace the thin review typography direction with display and supporting UI roles while preserving text slots. | Asset system | Blocked by construction-recipe decision | Headings and values dominate at phone size; actions are centered and robust. |
| P0 | Rebuild puzzle review composition around visible 8×8 cells, pieces, targets, valid/invalid placement, and three bridge states. | Asset + review composition | Blocked by construction-recipe decision | Square cells, identical unit dimensions, non-color-only state cues, phone readability. |
| P0 | Create a shared semantic icon family: wood, clock, target, bridge, upgrade, settings, exit, check, warning, lock, and level marker. | Asset system | Blocked by construction-recipe decision | Consistent navy outline/stroke weight, chunked silhouettes, compact and normal sizes. |
| P0 | Complete tactile button roles/states and unify panel/modal construction levels. | Asset system | Blocked by construction-recipe decision | Shared construction, unchanged state bounds, real pressed-depth change, scalable frames. |
| P0 | Replace sparse review canvases with state, scale, light/dark, mobile, and consistency comparison sheets. | Review composition | Agent-ready after BF-V2.1 decision | Every relevant state visible at comparable scales; no family represented only by a label. |
| P1 | Normalize outline hierarchy, cream ramps, action/information hierarchy, Town anchoring, Workshop state overlays, result-modal composition, and restrained success/failure emphasis. | Asset + composition | Blocked by preceding P0 work | Cross-screen hierarchy and shared visual construction are demonstrably cohesive. |
| P2 | Add restrained texture, standardized fasteners, accessibility comparisons, localization stress surfaces, and shared effect presets. | Asset + review system | Blocked by P0/P1 work | Detail remains subordinate; critical states survive without hue or short English strings. |

## Proposed phased program

1. **BF-V2.1 — Shared construction tokens:** human-select and approve the
   recipe on one green button and one small panel.
2. **BF-V2.2 — Buttons, panels, typography:** expand approved construction to
   shared interactive and container families.
3. **BF-V2.3 — Semantic icon family:** approve core icons, then replace repeated
   inconsistent symbols.
4. **BF-V2.4 — Puzzle readability:** rebuild board/piece/bridge evidence around
   the actual square-cell system.
5. **BF-V2.5 — Town and Workshop hierarchy:** validate functional anchors and
   state comparisons.
6. **BF-V2.6 — Result-system composition:** compose Victory and Failure from
   shared modal, action, heading, and summary families.
7. **BF-V2.7 — Cross-system validation:** publish complete comparison,
   accessibility, localization, and drift evidence before promoting V2.

## BF-V2.1 decision

**Approved on 2026-07-31 by Hien, acting as Product, Art, and UI reviewer.**

The approved visual direction for one green primary button and one small
information panel is: navy silhouette; lower-right depth; wood or cream base;
one inset border; upper-left highlight; restrained material accent; contained
shadow; and content layer. The direction also approves a bold display-type
preview for headings/actions and a clear UI-type preview for supporting labels.
Final font licensing remains deferred.

## Next bounded task

**BF-V2.1a — Agent-ready:** implement the approved construction recipe on only
one green primary button and one small information panel; preserve editable
layers, stable IDs, existing contracts, and the reference-pixel boundary.
Generate native and phone evidence plus a recipe/layer comparison, then stop
for human review before any broader propagation.

## BF-V2.1a automated visual review

### Evidence inspected

- Native, phone, and thumbnail composition surfaces.
- Primary-action normal/pressed state sheet.
- Small-panel native state sheet.

### Facts

- Job validation passes for two editable component families and three states.
- The primary-action pressed state preserves its shared footprint.
- The review surfaces contain no reference pixels.
- Phone-scale text and primary action remain readable; thumbnail preserves the
  action silhouette and the panel/value grouping.

### Visual-review inferences

- **Pass:** The construction direction is materially stronger than the prior
  flat recipe. Navy silhouettes, lower-right depth, upper-left highlights,
  cream inset separation, and restrained wood grain are visually legible.
- **Pass:** The pressed action communicates physical compression through reduced
  depth and a downward face shift instead of color-only darkening.
- **Needs human assessment:** The display fallback remains narrow rather than
  convincingly bold/condensed, so it does not yet fully satisfy BF-V2.1's
  typography objective.
- **Needs human assessment:** The panel is coherent but its wood grain and
  highlight are still sparse; determine whether the current restraint is the
  desired production level before propagating it.
- **Needs human assessment:** The dark review background makes the cream panel
  readable but does not prove light-surface contrast or an in-context layout.

### Automated outcome

**Technical pass; visual direction promising but not approved.** The evidence
is sufficient for Hien's Product, Art, and UI review. Do not propagate the
recipe to other families until that decision is recorded.

## BF-V2.1a corrective evidence

Hien requested a bounded evidence correction before wider rollout. The revised
job retains the approved palette, typography hierarchy, cream inset, navy
silhouette, and construction direction. It now provides a same-footprint
normal/pressed action comparison with a larger face descent and exposed
lower-right depth; restrained rimmed-metal fasteners; wood-grain paths confined
to the wooden frame; normalized upper-left highlight/lower-right depth offsets;
and a review-only 320 x 568 mobile composition. Job validation again passes for
two families, three states, four geometry constraints, and the reference-pixel
boundary. This remains a human visual decision; nothing has been propagated.

## BF-V2.1a approval and BF-V2.2a rollout

**Approved on 2026-07-31 by Hien, acting as Product, Art, and UI reviewer.**
The construction recipe is locked for this improvement program: navy silhouette,
lower-right depth, upper-left highlight, restrained metal fasteners, contained
wood grain, cream inset construction, and heavier display typography.

**BF-V2.2a — Agent-ready execution:** applies that locked recipe only to
`primary-action`, `secondary-action`, `small-info-panel`,
`medium-modal-panel`, and `popup-panel`. The draft declares shared footprints
for every multi-state family, representative action/reward/upgrade copy, and
localization-safe expansion regions. It explicitly excludes puzzle, HUD, Town,
Workshop, result, and environment families. Generated phone evidence must keep
that representative text visible; a text-free scale composition is not
readability evidence.

## BF-V2.2a approval, promotion, and package

**Approved on 2026-07-31 by Hien, acting as Product, Art, and UI reviewer.**
The accepted limitation is that tertiary copy may not remain fully readable at
thumbnail scale; headings, values, action labels, and semantic hierarchy must
remain clear.

The immutable rollout approval is
`6dc4276a1b84b0670698b61b48bce42b75523b15661043ef6877237195a77ba8`.
The validated promotion plan is
`90dd96697893dddf5ab2d65a006d844f74d1c330092d5091428b7b3cd4609502`.
It promoted only `v2-primary-action`, `v2-secondary-action`,
`v2-small-info-panel`, `v2-medium-modal-panel`, and `v2-popup-panel`, all at
immutable `1.0.0`, with nine states and eighteen SVG/PNG modules.

`block-forge@1.1.0` validates with 27 components and 143 files. Its manifest
SHA-256 is
`01e3c7c1b778506869dd31e4d891a4cf52eef7d4b9ca195e8d78cfacf5bf00ac`.
The refreshed project audit has zero findings, the rollout approval remains
valid, and package validation confirms an engine-neutral, reference-free
delivery. Unity integration and runtime-font licensing remain consumer
responsibilities.

## BF-V2.3 icon calibration status

**Approved on 2026-07-31 by Hien, acting as Product, Art, and UI reviewer:**
Wood normal and compact variants; target normal and compact variants;
clock/turn; container construction; and the review-label axes. Wood,
clock/turn, and bridge target are now the locked semantic-family foundation.
The immutable Wood/target calibration approval is
`32ea6957d45f784ca18a87302814dfd4d6661fa73add6b586041511b06a202de`.

The bounded renderer task is complete. The optional component-level
`glyphGroupTransform` defaults to identity and accepts only finite positive
uniform scale with finite X/Y translation. SVG, PNG, review, and packaged
rendering share the same composition path. Transformed visual bounds must stay
inside the declared content-safe region; clipping, non-positive scale,
non-finite values, arbitrary transform fields, and non-contiguous glyph layer
groups are rejected. Tests prove deterministic SVG/PNG output, stable component
and layer IDs, and byte-identical SVG output for components that do not declare
the transform.

The refreshed calibration job validates two families and eight review views;
the Block Forge project audit reports zero findings. The existing
`block-forge@1.1.0` package remains valid at 27 components and 143 files, with
unchanged manifest SHA-256
`01e3c7c1b778506869dd31e4d891a4cf52eef7d4b9ca195e8d78cfacf5bf00ac`.
No icon promotion was authorized or performed.

**Next bounded task — Agent-ready:** draw only the bridge, upgrade, and settings
icons using the locked construction rules. Do not draw other semantic icons,
change the approved foundation, or promote any icon family without a separate
human approval.
