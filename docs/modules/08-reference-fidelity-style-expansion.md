# Module 08 — Reference-fidelity style expansion

## Goal

Prove that the asset pipeline can follow a sharper and more complex reference style without losing deterministic structure, reusable materials, stable IDs, or engine-neutral modular delivery.

**Status:** M7-A1 complete. The next task is human review of the draft reference brief, implementation specification, and validation rubric before any rendering work begins.

## Scope

The module covers the next production asset package track after M6. It focuses on reference fidelity, sharper geometry, expanded style complexity, and asset-only handoff.

In scope:

- Defining the target/reference requirements for the next production package.
- Replacing the current rounded-corner button direction with a sharper, wide-hexagon button language.
- Defining angular panel, container, badge, and supporting component rules where useful.
- Increasing material, ornament, lighting, edge, and state complexity while preserving editable layers.
- Producing engine-neutral assets and showroom/file-address handoff evidence.

Out of scope:

- Unity or other engine integration.
- Treating reference pixels as final production component sources.
- Starting renderer/template implementation before M7-A1 defines acceptance criteria.

## Inputs and outputs

| Inputs | Outputs |
|---|---|
| Project owner art-direction feedback, prior Frostbound package evidence, renderer/material contracts, M5 hardening controls | M7 implementation specification, visual-fidelity rubric, component inventory, evidence plan, and later an engine-neutral modular asset package |

## Implementation steps

1. Draft M7-A1 specification and rubric for the new reference-fidelity target.
2. Review the specification against the project mission, asset-only boundary, and style-complexity requirements.
3. Implement only the approved renderer/material/template changes needed for the M7 package.
4. Assemble the package as small reusable modules with stable IDs, SVG/PNG outputs, metadata, provenance, and showroom visibility.
5. Validate visual fidelity, deterministic reproduction, package integrity, and handoff evidence.

## Dependencies

M0–M6 controls, especially engine-neutral delivery in Module 06 and hardening controls in Module 07.

## Acceptance criteria

- The M7-A1 specification explicitly defines the sharper wide-hexagon button direction and the reference-fidelity rubric.
- The component inventory is bounded and practical for one production asset package.
- The plan preserves deterministic source geometry, independent effects, material provenance, stable IDs, and reproducible export metadata.
- Final outputs remain engine-neutral assets and are visible in the showroom or handed off with exact file/folder addresses.

## Validation task

M7 validation will be defined by M7-A1. It must include at least one reference-fidelity review surface comparing the approved target direction to deterministic outputs without extracting reference pixels as production sources.

## Risks

- Style complexity may invite ad hoc manual art fixes: require versioned geometry/material rules before rendering.
- Wider hexagonal components may break existing layout assumptions: define size and slot rules in the spec.
- Reference fidelity may conflict with modularity: keep part boundaries and source provenance mandatory.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-18 | Created module after project owner selected the next production asset package track and requested sharper wide-hexagon reference fidelity | Project owner / Codex |
| 2026-07-18 | Completed M7-A1 draft definition package and queued human definition review | Codex |
