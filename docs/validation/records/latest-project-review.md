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

## BF-V2.3b bridge, upgrade, and settings evidence

**Technical preparation complete on 2026-07-31.** The bounded
`block-forge-v2-semantic-icons-r2` job adds only three editable families:
bridge, upgrade, and settings. Each family provides uncontained, cream-container,
colored-container, and compact colored-container review views while preserving
the locked rounded-square container, navy outline weight, upper-left highlight,
lower-right depth, restrained palette, stable IDs, and component-level compact
glyph transform.

Job validation passes for three families, twelve states, and three shared
footprint constraints. Native, phone, thumbnail, state, isolated, geometry,
and safe-area evidence was regenerated and inspected. The compact glyph groups
remain within their declared content-safe regions with visible padding on all
four sides. The Block Forge project audit continues to report zero findings,
and no reference pixels enter the editable production geometry.

**Visual preflight:** bridge reads as a timber span with separated piers and an
open arch; upgrade uses a chunky gold upward action silhouette; settings uses a
restrained wood/cream gear. All three remain distinct at compact mobile scale.
This is an evidence-backed Codex preflight, not Product/Art/UI approval.

**Next human decision:** Hien should approve the three-family evidence or
request a targeted correction. Do not promote these icons or continue to exit,
check, warning, lock, level marker, or other semantic families before that
decision.

## BF-V2.3b partial approval and upgrade correction

**Bridge and settings approved and locked on 2026-07-31 by Hien, acting as
Product, Art, and UI reviewer.** Approval covers all four reviewed presentation
and size variants. Their regenerated state-sheet SHA-256 values remain
`F6A9F177CC2825E5F92C4807530BBBB0E3220B36F116B2D0B21A4FE6E55D31B1`
for bridge and
`7192D808596A62148C85CB137C9637055F7E81AD8E81C16DA1923920D269C09F`
for settings, proving the targeted correction did not modify either family.

Only the upgrade glyph was revised: its horizontal baseline was removed and
the existing chunky upward arrow group was vertically recentered. Colors,
outline, highlight, containers, state IDs, family/state bounds, and the compact
transform are unchanged. Job validation and regenerated evidence pass. Upgrade
remains a human visual decision; no icon was promoted and no other semantic
family was modified.

## BF-V2.3b final approval and BF-V2.3c evidence

**Bridge, corrected upgrade, and settings approved and locked on 2026-07-31 by
Hien, acting as Product, Art, and UI reviewer.** The approval covers all twelve
validated presentation and size views and preserves glyph geometry, container
treatments, compact transforms, content-safe bounds, stable IDs, and
provenance. The immutable approval receipt is
`19179cde525e151a17e86d5e52adb3e7935e985c326f03f746749679e31f33b8`.
No promotion was authorized or performed.

**BF-V2.3c technical preparation complete.** The bounded
`block-forge-v2-semantic-icons-r3` job adds only exit, check, and warning. Exit
uses the reserved red warning/exit role with a door-and-right-arrow silhouette;
check uses the approved green success role; warning uses a red triangular
silhouette with a cream inset and non-color-only exclamation cue. Each family
provides uncontained, cream-container, colored-container, and compact
colored-container views using the locked construction and production-level
compact transform.

Job validation passes for three families, twelve states, and three shared
footprint constraints. Native, phone, thumbnail, state, isolated, geometry,
and safe-area evidence was regenerated and inspected. The project audit has
zero findings. Lock, level marker, and every other semantic icon remain
uncreated in this task; no promotion occurred.

**Next human decision:** approve the exit/check/warning evidence or request a
targeted correction. Do not continue to lock or level marker before that
decision.

## BF-V2.3c automated visual review

### Facts

- All twelve isolated SVG/PNG outputs have transparent padding and no opaque
  edge pixels.
- Shared family/state bounds, stable IDs, content-safe compact transforms, and
  reference-pixel exclusion validate.
- Native, phone, thumbnail, state-sheet, isolation, and geometry-overlay
  evidence was inspected.
- Lock and level marker are absent, and no icon promotion has occurred.

### Visual-review inferences

- **Pass:** Exit reads immediately as leaving through a doorway; the red arrow
  remains distinct on the red container because the navy outline and cream door
  preserve figure separation.
- **Pass:** Check has the strongest compact recognition of the group. The cream
  tick, navy ring, and green success field remain distinct without relying on
  the container silhouette.
- **Pass:** Warning preserves a conventional triangle and exclamation cue, so
  its meaning is not color-only. The revised normal triangle leaves the
  container rim and lower-right depth visible, and the compact form is centered
  with four-side padding.
- **Pass:** Outline weight, upper-left highlight, lower-right depth, palette
  discipline, and optical scale are consistent with the locked semantic-family
  foundation.
- **Non-blocking observation:** On colored containers, the semantic fill and
  container face intentionally share red or green. Navy internal outlines keep
  the glyphs readable at the reviewed phone and thumbnail scales.

### Automated outcome

**Recommend visual approval with no correction.** No technical or visual
blocker was found in the reviewed evidence. Final locking remains Hien's
Product/Art/UI decision; promotion and the lock/level-marker group remain out
of scope.

## BF-V2.3c approval

**Approved and locked on 2026-07-31 by Hien, acting as Product, Art, and UI
reviewer.** Exit, check, and warning are accepted across all twelve validated
presentation and size views. The lock preserves approved glyph geometry,
semantic colors, container treatments, compact transforms, content-safe bounds,
stable IDs, and provenance. The immutable approval receipt is
`3501f18851b135a91c121feb113853fed71817e93aab6e6a008776bc599dcaf4`.

No promotion was authorized or performed. Lock and level marker remain
unstarted and require a separately authorized bounded task.

## BF-V2.3d lock and level-marker evidence

**Technical preparation complete on 2026-07-31.** The bounded
`block-forge-v2-semantic-icons-r4` job adds only lock and level marker. Lock
uses the approved desaturated cream/gray role with a clear shackle, inset body,
and non-color-only keyhole. Level marker uses the approved gold emphasis role
with a shield-and-star rank silhouette that remains distinct from the upgrade
arrow and bridge-target diamond.

Each family provides uncontained, cream-container, colored-container, and
compact colored-container views using the locked navy outline, upper-left
highlight, lower-right depth, stable layers, glyph/container separation, and
production-level compact transform. Job validation passes for two families,
eight states, and two shared-footprint constraints. Native, phone, thumbnail,
state, isolated, geometry, and safe-area evidence was regenerated and
inspected. The Block Forge project audit reports zero findings.

**Visual preflight:** both meanings remain recognizable at compact mobile
scale; the complete rounded-square containers and four-side glyph padding stay
visible. This is a Codex preflight, not Product/Art/UI approval. No promotion
or unrelated semantic-icon work occurred.

**Next human decision:** approve lock and level marker across the eight reviewed
views or request a targeted correction. Do not promote the semantic family
before that decision.

## BF-V2.3d automated visual review

### Facts

- All eight isolated SVG/PNG outputs preserve transparent padding with no
  opaque edge pixels.
- Shared footprints, stable IDs, reference-free editable geometry, and compact
  content-safe transforms validate.
- Native, phone, thumbnail, state-sheet, isolation, and geometry-overlay
  evidence was inspected.
- No icon promotion or unrelated semantic-family work occurred.

### Visual-review inferences

- **Pass:** Lock is immediately recognizable through its shackle, body, and
  keyhole. Its desaturated cream/gray construction communicates locked or
  unavailable status without weakening the navy silhouette.
- **Pass:** The compact lock remains optically centered with a complete
  rounded-square container and visible padding on every side.
- **Pass:** Level marker reads as rank/current-level emphasis through its gold
  shield and cream inset star. It remains distinct from the upgrade arrow and
  bridge-target diamond at normal, phone, and thumbnail scales.
- **Pass:** The compact shield keeps the outer crest as the primary silhouette;
  the star remains recognizable without excessive internal detail.
- **Pass:** Both families preserve the locked outline weight, lighting
  direction, depth, palette discipline, and glyph/container separation.

### Automated outcome

**Recommend visual approval with no correction.** No technical or visual
blocker was found. Final locking remains Hien's Product/Art/UI decision, and
promotion remains separately gated.

## BF-V2.3d approval

**Approved and locked on 2026-07-31 by Hien, acting as Product, Art, and UI
reviewer.** Lock and level marker are accepted across all eight validated
presentation and size views. The lock preserves glyph geometry, semantic
colors, container treatments, compact transforms, content-safe bounds, stable
IDs, and provenance. The immutable approval receipt is
`60441d88de8e87fd72a7f674de0987dbcc7d807cad092a284b65f98f81f42c25`.

This completes visual calibration and approval for the requested semantic-icon
list: Wood, clock/turn, bridge target, bridge, upgrade, settings, exit, check,
warning, lock, and level marker. No semantic icon has been promoted; promotion
remains a separately authorized bounded task.

## BF-V2.3 semantic-family promotion and package

**Complete on 2026-07-31.** The previously approved clock/turn family was
isolated unchanged into a one-family job so its immutable approval boundary
does not include the rejected first-pass Wood and target families. Its approval
receipt is
`d1d446671e40d3cf029aacca96c0c86d76471560613bcc5e2004a0dee2c4ea49`.

Five approved snapshots rebuilt 88 deterministic SVG/PNG modules. Their dry-run
promotion plans validated before execution:

- Wood and bridge target: `8004b075e79823835aeb6448bdad121a630aa3e2a5f4246e31fb8ff3b4f21e55`.
- Clock/turn: `fc636a831f2202088c0b7eb1144e379a4757d81c30c371318b8a1cc60926fa90`.
- Bridge, upgrade, and settings: `f6d155c6947fa6a0550270196f3a8ef78ed9043e1eeca6076490e2f2bfd9c976`.
- Exit, check, and warning: `2703d9d7fe05fc3cda7b92179306123fa51bec96a3268470bc0a8e60deccad8b`.
- Lock and level marker: `7a4991c51d1f4c639042fdfda0678c6086476ff4af5ac03f7f7ccfc5ff5a2b12`.

Only the eleven approved semantic families were promoted as immutable `1.0.0`
components. The regenerated engine-neutral `block-forge@1.2.0` package
validates with 38 components and 242 files. Its manifest SHA-256 is
`cdab6f99bcfe1305cd655c05e3e6d7a978581cd64e1e60a4aa2cadd6101285c4`.
The package contains no reference pixels, and the refreshed project audit has
zero findings. Unity integration and runtime-font licensing remain consumer
responsibilities; the accepted tertiary-thumbnail-copy limitation is retained.

## BF-V2.4 puzzle-readability evidence

**Technical preparation complete on 2026-08-01.** The bounded
`block-forge-v2-puzzle-readability` job changes only the puzzle board, puzzle
unit placement feedback, target presentation, and bridge-condition evidence.
Town, Workshop, result systems, unrelated semantic icons, promotion, and Unity
remain excluded.

The gameplay geometry is unchanged: the board is exactly `640 x 640`, declares
an `8 x 8` square grid with `80`-unit cells, puzzle units remain exactly
`80 x 80`, and all bridge conditions share one `640 x 160` footprint and
anchor. The visible frame was corrected after preflight so all eight rows and
columns read at equal size instead of allowing inset edges to make the outer
cells appear narrower.

The board now shows explicit grid lines, aligned sample pieces, and two approved
diamond target markers. Placement evidence includes normal, valid, and invalid
units; valid and invalid states use check and X silhouettes in addition to
green/red color. Bridge evidence shows broken, damaged, and repaired states
through distinct gap, crack, brace, and success-check construction rather than
color-only changes.

Job validation passes for three editable families, eight states, and nine
geometry constraints. Native, phone, thumbnail, state, isolation, geometry,
safe-area, and deterministic light/dark comparison evidence was generated and
inspected. The light/dark PNG SHA-256 is
`db28627b15ce9c21ffe08c12603c8fb3e2ad6c963e1e6c957bbe8f8d9a470af0`.
The Block Forge project audit reports zero findings and no reference pixels
enter production geometry.

**Next human decision:** approve the BF-V2.4 puzzle-readability evidence or
request a targeted correction. Do not promote it or begin BF-V2.5 Town and
Workshop work before that decision.

## BF-V2.4 automated visual review

### Facts

- The exact `8 x 8`/`80`-unit grid, fixed puzzle-unit size, shared bridge
  footprint, stable IDs, transparent padding, and reference-pixel boundary all
  validate.
- Native, phone, thumbnail, state, isolated, geometry, safe-area, and
  light/dark comparison evidence was inspected.
- Valid and invalid puzzle units use check and X silhouettes in addition to
  green and red.
- The completed board currently preserves the same pieces, target markers, and
  placement-preview check as the normal board; its principal change is the
  outer border treatment.
- Broken and damaged bridges share the same central gap and zigzag crack
  silhouette; their principal visible difference is color.

### Visual-review inferences

- **Pass:** All eight rows and columns now read at equal size. Grid lines,
  aligned pieces, and diamond targets remain clear at phone scale and survive
  thumbnail reduction.
- **Pass:** Normal, valid, and invalid unit states are immediately distinct and
  do not depend on hue alone.
- **Pass:** Repaired bridge is clearly different through the crossed brace and
  green check, with the original shared footprint preserved.
- **Blocker:** Completed-board recognition is too weak and potentially
  misleading because unresolved-looking targets and the placement preview
  remain visible while only the border changes. Completion requires a clear
  non-color structural cue and resolved target treatment.
- **Blocker:** Broken versus damaged bridge recognition is color-dependent.
  Broken should keep the open gap; damaged should retain a visibly continuous
  deck with localized cracks or partial reinforcement.
- **Non-blocking observation:** The standalone normal unit above the board is
  useful calibration evidence but reads as detached in the composition. State
  sheets already provide the clearer unit comparison.

### Automated outcome

**Request targeted correction before approval.** Preserve all validated
dimensions, board grid, normal/valid/invalid units, targets, repaired bridge,
palette, IDs, and reference boundary. Correct only completed-board semantics
and broken/damaged bridge structural separation, then rerender the board and
bridge state comparisons plus phone/thumbnail evidence. Do not promote or begin
BF-V2.5.

## BF-V2.4 corrective evidence

**Targeted correction prepared on 2026-08-01.** The completed board now retains
the approved grid, pieces, placement preview, target paths, dimensions, and IDs
while adding checked target resolution and a separate green completion badge
with a cream check. Completion therefore has an explicit non-color silhouette
cue instead of relying on the gold frame treatment.

The broken bridge retains its open central gap and red break mark. The damaged
bridge now has a visibly continuous deck across the same footprint with a
localized brown crack, while the repaired bridge remains unchanged with its
gold crossed brace and green check. This makes broken, damaged, and repaired
structurally distinct without changing their shared bounds or anchor.

The corrected job validates with three editable families, eight states, nine
geometry constraints, stable IDs, shared footprints, and a clean
reference-pixel boundary. Board and bridge state comparisons plus native,
phone, and thumbnail evidence were rebuilt and inspected. Normal/valid/invalid
units, target geometry, the repaired bridge, palette, and unrelated output were
not revised.

**Next human decision:** visually approve the corrected BF-V2.4 evidence or
request another targeted correction. Promotion and BF-V2.5 remain unauthorized.
