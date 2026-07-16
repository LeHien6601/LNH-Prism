# M2 Implementation Specification — Neon Market Kit

## Document control

| Field | Value |
|---|---|
| Status | 🟢 Approved — Option A |
| Date | 2026-07-16 |
| Milestone | M2 — Design system and reusable materials |
| Validation target | V2 — Neon Market Kit |
| Decision source | [ADR-011](../decisions/ADR-011-v2-neon-market-kit.md) |
| Product/art reference | [V2 reference brief](../reference-briefs/V2_NEON_MARKET.md) |
| Implementation state | Complete — V2 passed at `93/100` on 2026-07-17 with every mandatory minimum met and no blockers. |

## 1. Intended outcome

M2 will prove that a versioned style, one reusable material pack, shared component templates, and deterministic state/size recipes can generate a coherent mobile shop family without component-specific repainting.

The production source remains named-layer SVG. PNG is a deterministic review derivative. AI may later supply reusable material sources, but it does not own component geometry, state generation, lighting, or final output.

## 2. Scope

### Required deliverables

- one inheritable `neon-market` style specification;
- one traceable `neon-alloy-materials` pack;
- six component specifications and deterministic renderers;
- shared tokens, material bindings, state recipes, and bounded size variants;
- one realistic portrait shop-popup scenario in the showcase;
- a reproducible V2 evidence package and completed human review record.

### Component inventory

| Spec ID | Template ID | Required variants/states | Baseline logical size | Secondary proof |
|---|---|---|---:|---:|
| `shop-panel` | `panel` | `normal` | `468 × 720` | `468 × 800` |
| `shop-category-tab` | `tab` | `normal`, `selected` | `128 × 48` | `160 × 48` |
| `shop-purchase-button` | `button` | `normal`, `pressed`, `disabled` | `196 × 64` | `260 × 64` |
| `shop-secondary-button` | `button` | `normal`, `pressed`, `disabled` | `148 × 52` | `196 × 52` |
| `currency-badge` | `badge` | `normal`, `highlighted` | `144 × 44` | `196 × 44` |
| `limited-offer-progress` | `progress-bar` | `normal`; values `10`, `50`, `90` | `320 × 24` | `400 × 24` |

All dimensions are review baselines, not arbitrary editor ranges. Widths between the baseline and secondary proof may be accepted only when the template's bounded sizing contract and tests cover them.

## 3. Explicit non-goals

- AI screenshot/style-board analysis or automatic token extraction (M3).
- AI-generated final components or a unique texture for any component/state.
- Unity import, slicing, prefab/runtime behavior, or Unity-readiness claims (M4).
- A node editor, free-form drawing surface, arbitrary material graph, or unbounded controls.
- A second theme, a theme marketplace, localization layout, inventory data, purchasing logic, animation, or game runtime integration.
- Raster painting tools, character/product illustration, shop-item art, or font-system selection.

Requests outside this boundary require `CHANGE_CONTROL.md` review.

## 4. Compatibility and version plan

### Contract compatibility

- Retain `schemaVersion: "1.0"` for M2.
- Contract-schema changes must be additive and optional so approved V1 documents remain valid unchanged.
- New required behavior belongs in new M2 data artifacts, renderer validation, and approval rules—not retroactive required fields on V1 specs.
- Removing, renaming, or changing an existing field's meaning requires a separately approved schema-version change and migration note.

### Planned artifact versions

| Artifact | Initial M2 version | Status flow |
|---|---:|---|
| `neon-market` style | `0.1.0` | `draft → reviewed → approved` |
| `neon-alloy-materials` pack | `0.1.0` | `draft → reviewed → approved` |
| Six component specs | `0.1.0` each | `draft → reviewed → approved` |
| Shared templates with M2 behavior | `0.2.0` for existing templates; `0.1.0` for new `tab` and `badge` | renderer-controlled |
| Renderer | next compatible `0.x` minor | pinned in every manifest |

Any approved data change increments its semantic version. Output manifests must bind the exact style, component, material, renderer, source-file, dependency-lock, and output hashes.

## 5. Planned additive contract requirements

These are requirements for the first M2 implementation slice; exact JSON Schema syntax must be reviewed by contract tests before approval.

### Style inheritance

Add an optional `extends` reference to the style contract:

```json
{
  "id": "neon-market",
  "version": "0.1.0",
  "extends": { "id": "neon-core", "version": "0.1.0" }
}
```

Resolver rules:

1. A root style without `extends` must retain the current complete token requirements.
2. An extending style may provide partial token maps; the updated schema must allow this only when a valid `extends` reference is present.
3. Resolve only repository-owned raw documents that pass their applicable root/overlay schema by exact ID and version.
4. Reject missing parents, version mismatches, duplicate IDs, and inheritance cycles.
5. Merge maps by key; child scalar values replace parent values; arrays replace rather than concatenate.
6. Validate the fully resolved document against the complete style requirements before rendering.
7. Include both child and ancestor files/hashes in provenance.

### Material tokens

Add an optional typed `tokens.material` object. The implementation must enforce these inclusive ranges:

| Token | Range | Neon Alloy default | Purpose |
|---|---:|---:|---|
| `grainOpacity` | `0–0.20` | `0.10` | Fine surface variation |
| `patternOpacity` | `0–0.18` | `0.08` | Hex/circuit visibility |
| `patternScale` | `16–64` logical px | `32` | Tile detail scale |
| `edgeLightOpacity` | `0–0.65` | `0.42` | Shared cyan rim strength |
| `bevelDepth` | `0–4` logical px | `2` | Deterministic metallic depth |
| `decalOpacity` | `0–0.30` | `0.18` | Optional accent visibility |

Values outside these bounds must fail validation or renderer preflight; they must not be silently clamped.

### Material normalization

Extend material normalization with optional, typed controls:

- uniform `scale`: `0.5–4.0`;
- normalized `offsetX` and `offsetY`: `0–1`;
- `contrast`: `0.5–1.5`;
- `saturation`: `0–1.5`.

Existing `tileMode`, `opacity`, and `blendMode` remain authoritative. Tileable sources use `tile`; decals use `clamp`. Material sources retain path, SHA-256, rights, type, and prompt/settings when AI-generated.

### Component material bindings

Add optional typed `materialBindings` entries that bind a layer slot to a material ID. A binding may override only the controls explicitly declared overrideable by its template. Overrides must remain inside the global bounds above.

Required slot IDs:

- `surface-grain`;
- `surface-pattern`;
- `accent-decal` (optional per component);
- `edge-light-profile`;
- `bevel-profile`.

Geometry, border, connected extrusion, content, and state offsets cannot be supplied by a texture or decal binding.

## 6. Neon Alloy source and layer model

### Versioned material sources

| Source ID | Type | Role | Required property |
|---|---|---|---|
| `alloy-grain` | procedural | `detail-overlay` | tile-safe and visually neutral |
| `alloy-circuit-pattern` | procedural | `pattern` | tile-safe at every supported scale |
| `alloy-holo-accent` | procedural or artist-provided | `decal` | transparent, clamp-safe, no component geometry |

Base gradient, edge illumination, bevel, shadow, and state lighting remain deterministic renderer/style recipes. They are not baked into the three material sources.

### Canonical top-to-bottom SVG layer order

1. `content`
2. `accent-decal`
3. `edge-highlight`
4. `bevel-highlight`
5. `surface-pattern`
6. `surface-grain`
7. `base-fill`
8. `border`
9. `connected-extrusion`
10. `outer-shadow`

Templates may omit inapplicable optional layers, but retained layers keep stable IDs and relative order. Progress frame and value fill remain independently renderable and each owns its applicable material layers.

## 7. State and hierarchy recipes

| Variant/state | Deterministic rule |
|---|---|
| Primary normal | Full edge light and bevel; primary action colors |
| Primary pressed | Content `y: +2`; reduced extrusion/highlight; increased inner shade |
| Primary disabled | Reduced saturation/contrast and edge light; no material regeneration |
| Secondary normal | Lower edge-light and pattern intensity than primary; same material family |
| Secondary pressed/disabled | Same recipe family as primary with secondary token values |
| Tab selected | Selected fill/edge-light tokens; geometry and content slot unchanged |
| Badge highlighted | Bounded edge-light/decal emphasis; value remains readable |
| Progress values | Frame unchanged; fill clipped at `10`, `50`, and `90` percent |

All content slots move with their owning component/state transform. Text and icons remain editable and are never baked into reusable surface sources.

## 8. Deterministic renderer requirements

- One pure SVG recipe must be shared by CLI generation and browser showcase preview.
- The same resolved inputs must produce byte-identical SVG and hash-identical PNG derivatives on the pinned stack.
- Every material layer must have a stable, inspectable SVG group ID.
- Masks and patterns must remain bounded to the component silhouette and protected edges.
- Unsupported sizes, states, material IDs, control names, and out-of-range values must fail with actionable errors.
- Rendering must not fetch remote resources or depend on nondeterministic timestamps/randomness.
- The showcase may expose only the approved bounded controls and must display the active style/material/spec versions read-only.

## 9. Implementation sequence and quality gates

| Slice | Work | Required exit evidence | Next dependency |
|---|---|---|---|
| M2-S1 | Add backward-compatible contract fields, examples, resolver, and validation | V1 examples still validate; invalid inheritance/bounds/bindings are rejected; resolved provenance includes ancestors | Human-approved specification |
| M2-S2 | Create Neon Alloy procedural sources and pack; implement masking/pattern/normalization primitives | Source preflight, tile/edge tests, deterministic hashes, isolated layer previews | M2-S1 |
| M2-S3 | Upgrade shared Panel/Button/Progress templates and add Tab/Badge templates | Focused state, size, layer-order, clipping, and deterministic-output tests | M2-S2 |
| M2-S4 | Create six approved component specs and assemble the Neon Market scenario/showcase | CLI/browser equivalence, complete family/state matrix, target-phone and light/dark previews | M2-S3 |
| M2-S5 | Prepare V2-E01 through V2-E09 and conduct the human V2 review | Completed scorecard, defect log, immediate blocker corrections, revalidation record | M2-S4 |

Each slice is a separate task. Do not start the next slice until the prior exit evidence is recorded. V2 cannot pass on showcase appearance alone.

## 10. Automated validation requirements

### Contract and resolver tests

- V1 approved examples remain valid unchanged.
- Valid one-level inheritance resolves deterministically.
- Missing parent, wrong parent version, and direct/indirect cycles fail.
- Out-of-range material tokens and normalization controls fail.
- Unknown material/slot bindings and disallowed overrides fail.
- AI material sources without prompt/settings fail.

### Renderer tests

- Named layer order is stable for every template.
- Each required state and size is deterministic.
- Pattern/grain masks cannot cross the surface silhouette.
- Tile seams and protected-edge distortion are absent at required sizes.
- Progress frame/fill independence and `10/50/90` clipping remain valid.
- Browser and CLI recipes are equivalent for the full approved control matrix.

### Propagation test

The evidence build must apply one approved token mutation—`edgeLightOpacity: 0.42 → 0.30`—to a separate review variant. All six components must change through the shared resolved style/material path, while geometry, content, unrelated layers, IDs, and canonical approved outputs remain unchanged.

## 11. V2 evidence deliverables

The implementation must prepare V2-E01 through V2-E09 exactly as defined in [the V2 rubric](../validation/V2_VISUAL_REVIEW_RUBRIC.md). Evidence includes the approved inputs, contract/resolver proof, family matrix, scenario previews, material-isolation views, token-propagation proof, structure/provenance audit, and defect/revalidation record.

## 12. Risks and controls

| Risk | Signal | Control |
|---|---|---|
| Procedural richness obscures content | Labels/icons lose priority at phone scale | Bounded opacity/scale plus V2 readability minimum |
| Inheritance hides the effective value | Reviewer cannot explain a rendered token | Resolved-spec debug output with source path per value |
| Material bindings become arbitrary parameters | Components diverge through overrides | Typed slots, allowlisted overrides, hard bounds, and cross-family audit |
| Decals become component-specific art | Base family is incoherent without decals | Decal optional; score consistency with decals disabled as an inspection view |
| M2 expands into editor/runtime work | Requests add free-form controls or Unity behavior | Enforce non-goals and change-control review |

## 13. Approval outcome

On 2026-07-16, the project owner approved Option A. The approval covers:

- the six-component inventory and proof sizes;
- the additive compatibility strategy;
- inheritance and material-binding rules;
- bounded material token defaults/ranges;
- implementation sequence;
- V2 evidence package, scoring thresholds, and automatic blockers.

The V2 rubric's Conditional-pass range is clarified to `82–84`, the mathematical range possible after every dimension meets its mandatory minimum. The project owner selected staged M2-S5 evidence preparation before the required human review. Approval does not waive the later V2 visual review or authorize work outside the ordered implementation slices.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Drafted M2 Neon Market contracts, controls, renderer requirements, implementation slices, validation, and scope boundaries | Codex |
| 2026-07-16 | Approved Option A and authorized M2-S1 with the V2 Conditional-pass range clarified to `82–84` | Project owner |
| 2026-07-16 | Completed M2-S1 contract extensions, overlay resolver, ancestor provenance, and focused failure coverage; M2-S2 may begin | Codex |
| 2026-07-16 | Completed M2-S2 Neon Alloy procedural sources, preflight, normalization/masking primitives, source hashes, and deterministic isolation evidence; M2-S3 may begin | Codex |
| 2026-07-16 | Completed M2-S3 shared Button, Panel, Progress, Tab, and Badge recipes with bounded state/size, layer-order, clipping, and determinism coverage; M2-S4 may begin | Codex |
| 2026-07-16 | Completed M2-S4 with six draft component specs, deterministic Neon Market scenario assets, and browser/CLI recipe equivalence; M2-S5 human review may begin | Codex |
| 2026-07-16 | Project owner selected staged M2-S5 evidence preparation and preflight before formal human V2 scoring | Project owner |
| 2026-07-16 | Completed M2-S5 automated preflight with V2-E01–V2-E09, matrix, propagation, progress-part, equivalence, and provenance proof; recorded draft-input blocker V2-P001 | Codex |
| 2026-07-16 | Approved all eight `0.1.0` review inputs, closed V2-P001, and opened formal V2 scoring without changing scores or the gate decision | Project owner / Codex |
| 2026-07-17 | Recorded the confirmed V2 scorecard and 🟢 Pass at `93/100`; M2 is complete | Project owner / Codex |
