# M10 Volcanic Forge Second-Style Transfer Specification

## Status

**Approved for M10-A4 implementation.** The M10-A3 definition review accepted Option B on 2026-07-19: retain the approved scope with explicit lava-and-ember emission limits.

## Objective and fixed boundaries

M10 must prove that the shared M9 systems produce a Volcanic Forge family visibly distinct from Frostbound without a parallel renderer or a palette-only reskin.

The transfer preserves the existing seven-component inventory: panel, primary hex button, secondary hex button, progress frame/fill, tab, badge, and icon container. It reuses versioned edge stacks, material-response channels, seeded variation, ornament anchors, focal presets, typography treatments, lighting, stable IDs, export manifests, receipts, and engine-neutral modular delivery.

It must not introduce concept pixels, unseeded randomness, a `styleId === "volcanic-forge"` renderer branch, flattened production structure, third-style work, engine integration, or authoring-tool scope.

## Approved art direction

| System | Volcanic Forge binding |
|---|---|
| Geometry | Existing angular wide-hex component geometry; no shape-template rewrite |
| Materials | Obsidian base, forged brass edge, restrained lava emission |
| Lighting | Warm bottom/inner key light with bounded bloom |
| Variation | Recorded-seed soot, crack, and hammered-surface channels localized to material regions |
| Ornaments | Rivets, runes, and sparse embers through shared anchors and clipping |
| Typography | Engraved-gold treatment with deterministic fit and state offsets |
| Focal | Molten-core preset with independently addressable core, rim, light, fracture, support, ember, and ground-glow layers |
| States | Heat-glow primary, compression pressed, dimmed disabled, and explicit secondary distinction |

## Ordered implementation slices

| ID | Execution | Scope and dependency | Acceptance criteria | Validation |
|---|---|---|---|---|
| M10-A3 | Human decision | Review and approve this specification and the V10 rubric. Depends on M10-A2. | Style direction, inventory, boundaries, evidence, scoring, and blockers are accepted. | Recorded decision. |
| M10-A4 | Agent-ready | Add versioned Volcanic Forge style, material, variation, ornament, focal, typography, and lighting bindings. Depends on M10-A3. | Data uses stable IDs and existing generalized contracts; no style-specific renderer branch; source provenance is complete. | Contract negatives, resolver/provenance checks, same/different/zero-seed tests. |
| M10-A5 | Agent-ready | Render the seven-component state/size matrix through shared templates and assemble the portrait composition. Depends on M10-A4. | All required material, lighting, ornament, focal, and action-state rules are visible while content bounds remain valid. | Focused renderer tests, source/phone/thumbnail surfaces, clipping and readability checks. |
| M10-A6 | Agent-ready | Produce engine-neutral package, receipts, showroom, comparison, and unscored technical preflight. Depends on M10-A5. | Modular SVG/PNG outputs, manifests, recorded seeds, provenance, and Frostbound comparison reproduce without changing approved M7–M9 outputs. | Package, receipt, clean-reproduction, and source-boundary validation. |
| M10-A7 | Human decision | Conduct the V10 Volcanic Forge transfer review. Depends on M10-A6. | Technical hard gates pass and reviewers score the visual transfer against the rubric. | Signed review record. |

## Required evidence

- Source-scale layer/material/focal/isolation board and matching editable SVGs.
- Target-phone portrait showing title, molten focal, progress, primary action, and secondary action.
- Thumbnail comparison against Frostbound proving distinct silhouette, temperature, material, focal, and hierarchy.
- Seven-component normal/pressed/disabled/selected matrix as applicable, with minimum/maximum sizes and progress values.
- Three recorded nonzero seeds plus a zero-variation baseline.
- Package manifest, hashes, output receipts, provenance audit, renderer version, and clean-workspace reproduction record.

## Complexity and readability bounds

- Emission, ember count, glow spread, crack density, and ornament density must remain within versioned M9 budgets.
- At the portrait-composition level, the molten focal may emit at most eight ember particles; individual controls may not emit embers.
- Lava emission opacity may not exceed `0.55`, and its glow radius may not exceed `12%` of the smaller rendered component dimension.
- No lava or ember layer may overlap a button label/content slot or obscure the progress fill; violations are validation failures rather than aesthetic warnings.
- Lava, embers, and runes must not obscure labels, content slots, progress values, or state distinction.
- Primary and secondary actions must remain distinct at target-phone and thumbnail scale.
- The molten focal must remain dominant without becoming a substitute for functional hierarchy.

## Exit gate

M10 passes only after M10-A7 records a review at `85/100` or above, every hard gate passes, no visual dimension is below `3/5`, and no automatic blocker is open. The package must prove data-driven reuse of M9 systems and be visibly different from Frostbound at all three review distances.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-19 | Drafted the bounded M10 implementation sequence from ADR-021 and M9 generalized-system contracts. | Codex |
| 2026-07-19 | M10-A3 approved Option B: the Volcanic Forge definition is accepted with explicit lava-and-ember emission limits; M10-A4 may begin. | Project owner / Codex |
| 2026-07-19 | Completed M10-A4: added schema-validated Volcanic Forge style/material/edge/variation/ornament/focal data and a versioned system-binding manifest for typography, lighting, and emission limits; M10-A5 rendering is next. | Codex |
| 2026-07-19 | Completed M10-A5: rendered deterministic Volcanic Forge component matrix and portrait outputs through the shared M8/M9 template seam with M10 warm palette bindings; M10-A6 is next. | Codex |
| 2026-07-19 | Completed M10-A6 and M10-A7 Option A returned the package unscored for M10-R001 remediation: complete evidence surfaces and clean reproduction, repair canonical inventory mapping, and make the shared-system transfer visibly non-palette-only before re-review. | Project owner / Codex |
