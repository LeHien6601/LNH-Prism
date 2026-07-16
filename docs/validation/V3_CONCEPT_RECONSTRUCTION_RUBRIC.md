# V3 Review Rubric — Frostbound Concept Reconstruction

## Purpose and status

Use this rubric to judge M3's real validation: a human-controlled concept-to-spec workflow and deterministic Frostbound Reward family built without extracting pixels from the concept.

**Status:** 🟡 Draft — human approval required.

**Review owner:** ✦ UI lead.

**Required reviewers:** 🧭 Product, 🎨 Art, and 🛠️ technical leads.

**Not evaluated:** Unity integration (M4) or production-hardening scale (M5).

Creating this rubric does not pass V3.

## Preconditions

- ADR-012, V3 reference brief, M3 implementation specification, and this rubric are approved.
- Concept receipt, raw analysis, review disposition record, and approved style/material/component specs are versioned.
- Every critical mapped field has proposal evidence and human approval.
- The required component/state/value matrix and target-phone comparison view exist.
- Manifests and audits prove no concept pixels enter production sources or outputs.

If any precondition is absent, record 🔴 Blocked and do not infer missing evidence.

## Evidence package

| ID | Artifact | Pass condition |
|---|---|---|
| V3-E01 | Approved decision, brief, specification, and rubric | Scope and review controls are unambiguous |
| V3-E02 | Concept receipt and immutable raw analysis | Hash/dimensions/provenance match; observations have source evidence/confidence |
| V3-E03 | Human review disposition and proposal-to-spec lineage | Every critical proposal is decided; edits/rejections retain rationale |
| V3-E04 | Approved style, material pack, and five component specs | IDs/versions/statuses validate; accepted mappings are traceable |
| V3-E05 | Full component/state/value matrix at two bounded sizes where applicable | Required outputs are deterministic and inspectable |
| V3-E06 | Portrait reconstruction and concept/render comparison | Hierarchy, composition, material language, and known intentional differences are reviewable |
| V3-E07 | Target-phone, light/dark, selected-state, and primary/secondary comparison views | Readability and semantic distinctions are clear without text alone |
| V3-E08 | Material isolation, reuse, seam/mask, and no-pixel-extraction audit | One pack serves at least four types; sources contain no concept pixels/component effects |
| V3-E09 | Contract, mapping, renderer, determinism, and provenance test report | All approved automated checks pass |
| V3-E10 | Defect log, retrospective, correction, and revalidation record | Every blocker has a root cause, owner, fix, and proof |

## Scoring

Score each dimension `0–5`; half points are allowed.

| Dimension | Weight | What a 5 means | Minimum |
|---|---:|---|---:|
| Human control and proposal correctness | 20 | Observation/recommendation separation is clear; proposals are efficiently corrected; every critical mapping is explicitly reviewed | 4 |
| Visual hierarchy and mobile readability | 15 | Reward, progress, selected state, and primary/secondary actions read immediately at target-phone scale | 4 |
| Style fidelity and intentional interpretation | 15 | Approved palette, silhouette, lighting, and frost/crystal language match the reference intent without pixel imitation | 4 |
| Material reuse and source quality | 15 | One traceable, seam-safe pack serves at least four types without component-specific baked effects | 4 |
| Deterministic structure, states, and editability | 20 | Named layers, content slots, independent progress parts, bounded sizes/states, and reviewer edits propagate without repainting | 4 |
| Traceability and reproducibility | 15 | Concept, analysis, review decisions, approved inputs, renderer, materials, and outputs form a complete reproducible chain | 5 |

**Weighted score:** `sum(score / 5 × weight)` out of `100`.

| Outcome | Requirement |
|---|---|
| 🟢 Pass | `≥ 85`, every dimension meets its minimum, all evidence exists, and no blocker remains |
| 🟡 Conditional pass | `83–84`, every dimension meets its minimum, no blocker remains, and corrective tasks are owned before M4 |
| 🔴 Fail | `< 83`, any minimum/evidence requirement is missed, or a blocker remains |

The mandatory minimums produce a mathematical floor of `83/100`.

## Automatic blockers

- Concept/screenshot pixels, crops, traces, hashes, or embedded raster references appear in a production component or material source.
- AI analysis or a confidence threshold approves a proposal or production artifact without explicit human action.
- A critical mapped token lacks source evidence or an explicit human-decision record.
- A critical proposal remains pending/unresolved when reconstruction starts.
- Reviewer edits cannot be propagated through versioned specs without manual repainting.
- Fewer than four component types reuse the approved material pack.
- A component/state requires its own AI-generated texture or baked component-specific border/shadow/lighting.
- Primary and secondary actions are not semantically distinct at target-phone scale.
- Selected state relies on text alone or is not visually distinguishable.
- Progress frame/fill are not independent or required values clip incorrectly.
- Required outputs are nondeterministic or manifest provenance cannot reproduce them.
- Evidence claims Unity readiness without the M4 gate.

## Review procedure

1. Preflight V3-E01–V3-E10, statuses, hashes, tests, and matrix completeness.
2. Audit raw observations separately from recommendations; sample high/medium/low confidence items.
3. Trace every critical accepted/edited item through review disposition into approved specs.
4. Inspect matrix, reconstruction, target-phone, hierarchy, selected-state, and material-isolation evidence.
5. Audit sources and outputs for concept-pixel leakage and component-specific material effects.
6. Score independently, classify defects, correct the smallest blocker root cause, and append revalidation without overwriting the original review.

## Approval checklist

- [ ] Proposal evidence, confidence, disposition, and human-control rules are accepted.
- [ ] Reconstruction inventory and material-reuse counting are accepted.
- [ ] V3-E01–V3-E10 and reviewer ownership are sufficient.
- [ ] `≥85` Pass, `83–84` Conditional Pass, dimension minimums, and blockers are accepted.
- [ ] Pixel extraction, automatic approval, Unity claims, and general-editor scope remain prohibited.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Drafted V3 evidence, scoring, blocker, review, and revalidation requirements | Codex |
