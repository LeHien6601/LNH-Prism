# V4 Review Rubric — Unity Reward Claim Integration

## Purpose and status

Use this rubric to judge M4's real validation: a deterministic Frostbound export imported into a bounded uGUI project with exact Sprite settings, stable references, idempotent re-export, and readable Windows Editor/Android portrait behavior.

**Status:** 🟡 Draft — awaiting definition review.

**Review owner:** 🎮 Unity lead.

**Required reviewers:** 🧭 Product and 🛠️ Technical leads. ✦ UI reviews state hierarchy and target-device readability.

**Not evaluated:** gameplay/economy correctness, backend/persistence, localization, animation, URP/HDRP, UI Toolkit, Addressables, general-editor capability, or support beyond Unity `6000.3.18f1`.

Creating this rubric does not pass V4 or authorize implementation.

## Preconditions

- ADR-013, the [M4 implementation specification](../implementation/M4_UNITY_EXPORT_IMPLEMENTATION_SPEC.md), and this rubric have completed definition review.
- Unity `6000.3.18f1`, uGUI, Built-in Render Pipeline, Android portrait, and the `540 × 960` reference canvas are pinned in versioned project files.
- The Frostbound source specs/materials and renderer inputs remain approved and hash-verifiable.
- The M4 export-manifest extension, canonical fixtures, stable-ID registry, and importer version are committed.
- The bounded asset/state/value matrix, prefabs, scene, tests, and evidence index exist.

If a precondition is absent or differs from the approved baseline, record 🔴 Blocked and do not infer evidence.

## Evidence package

| ID | Artifact | Pass condition |
|---|---|---|
| V4-E01 | Approved ADR, implementation specification, rubric, and definition-review record | Scope, locked mapping, reviewers, slices, and gates are explicit and approved |
| V4-E02 | Contract extension, canonical manifests, naming/GUID rules, and migration tests | Legacy manifests pass; M4 manifests are typed; collisions, unsafe paths, and invalid settings fail |
| V4-E03 | Frostbound Unity bundle, source/output receipts, and stable-ID registry | Required PNG/state/part matrix is complete; IDs, GUIDs, paths, and hashes are unique and reproducible |
| V4-E04 | Importer receipt and TextureImporter/Sprite/atlas audit | PPU, pivot, border, mode, mesh, filter, wrap, mipmap, alpha, compression, and atlas exactly match manifests without manual correction |
| V4-E05 | 9-slice and layout evidence | Reward panel renders at `432 × 300` and `432 × 420` with fixed corners/borders, stretchable center, correct pivot/PPU, and no clipping |
| V4-E06 | Prefab, state, progress, and Play Mode evidence | Buttons cover normal/pressed/disabled; emblem covers normal/selected/approved locked mapping; independent progress frame/fill covers `10/50/75/90` |
| V4-E07 | Stable-reference, atlas, and re-export audit | Changed-source re-export preserves GUIDs and every prefab/scene reference; atlas membership is stable; unchanged rerun is a no-op |
| V4-E08 | Automated validation report | Contract, exporter, Edit Mode, and Play Mode suites pass in clean reproducible runs on the pinned baseline |
| V4-E09 | Android portrait build and readability record | Build succeeds and launches the bounded scene; `1080 × 1920` evidence shows readable hierarchy, safe layout, states, and progress |
| V4-E10 | Defect log, retrospective, corrections, and revalidation record | Every blocker/defect has severity, root cause, owner, disposition, correction proof, and append-only revalidation |

## Scoring

Score each dimension `0–5`; half points are allowed.

| Dimension | Weight | What a 5 means | Minimum |
|---|---:|---|---:|
| Manifest and importer correctness | 20 | Every declared setting and hash is validated/applied exactly; invalid input fails before writes; no Inspector correction is needed | 4 |
| 9-slice, pivot, PPU, and layout fidelity | 15 | Both panel bounds and all component layouts preserve intended geometry and pixels-to-canvas scale without clipping or distortion | 4 |
| State flow and mobile readability | 15 | All required action/emblem states and progress values are unambiguous in Play Mode and Android portrait without relying on labels alone | 4 |
| Stable identity, references, atlas, and re-export | 25 | IDs/GUIDs/paths are collision-safe; changed re-export preserves every reference; unchanged rerun is a true no-op | 5 |
| Automation and platform portability | 15 | Clean CLI contract/export/Unity suites and the pinned Android build are repeatable with complete machine-readable receipts | 4 |
| Traceability and reproducibility | 10 | Approved sources, manifests, bundle, registry, importer, Unity assets, tests, build, and evidence form one complete hash-verifiable chain | 5 |

**Weighted score:** `sum(score / 5 × weight)` out of `100`.

| Outcome | Requirement |
|---|---|
| 🟢 Pass | `≥ 90`, every dimension meets its minimum, all evidence exists, and no blocker remains |
| 🟡 Conditional pass | `87–89`, every dimension meets its minimum, no blocker remains, and corrective work is owned before M5 |
| 🔴 Fail | `< 87`, any minimum/evidence requirement is missed, or a blocker remains |

The mandatory minimums produce a mathematical floor of `87/100`. A Conditional pass cannot waive stable-reference or traceability requirements.

## Automatic blockers

- Unity Editor, uGUI, render pipeline, platform, orientation, or reference resolution differs from the approved baseline without a reviewed change request.
- A required asset/state/value, the independent progress frame/fill, or the approved locked-state mapping is absent.
- Locked behavior is implemented before its definition is explicitly approved.
- Any imported Sprite needs a manual Inspector correction to match its manifest or render correctly.
- A manifest/output hash is missing or does not match the imported file.
- PPU, pivot, border, Sprite mode, Full Rect mesh, alpha, filter, wrap, mipmap, compression, or atlas membership differs from the manifest.
- Border pairs collapse the center, 9-slice corners stretch, or either required panel size clips/distorts.
- Asset IDs, filenames, paths, or GUIDs collide under exact or case-folded comparison.
- A changed-source re-export changes a stable GUID/path unexpectedly or breaks any prefab/scene reference.
- An unchanged export/import mutates generated assets, importer settings, atlas membership, bindings, prefabs, or scene references.
- The importer deletes stale assets implicitly, writes outside its declared root, or edits hand-authored content.
- Required contract/export/Edit Mode/Play Mode validation fails or cannot be reproduced from a clean checkout.
- The Android portrait build fails, does not launch the bounded scene, or lacks target-resolution readability evidence.
- Evidence claims support for URP, UI Toolkit, other Unity versions, or production gameplay systems.

## Review procedure

1. Preflight V4-E01–V4-E10, baseline versions, hashes, statuses, and evidence-index completeness.
2. Run contract and exporter tests from a clean checkout; compare two clean bundles and audit declared volatile fields.
3. Open/import in Unity `6000.3.18f1`; compare importer settings and atlas membership against manifests without correction.
4. Inspect the sliced panel at both bounds, all button/emblem states, independent progress parts, and `10/50/75/90` values.
5. Capture serialized prefab/scene references, perform the changed-source re-export/import, and prove the same references resolve.
6. Repeat unchanged and require zero created/updated assets plus unchanged registry, GUIDs, settings, atlas, prefabs, and scene.
7. Run Edit Mode and Play Mode suites by command line, build Android portrait, launch the bounded scene, and inspect target-resolution evidence.
8. Score independently, classify defects, correct the smallest root cause, and append revalidation without overwriting the original record.

## Required review checklist

- [ ] Contract extension and legacy compatibility are approved.
- [ ] Naming, stable Unity asset ID, deterministic GUID algorithm, collision rules, and migration boundary are approved.
- [ ] Manifest-owned importer settings and stale-asset behavior are approved.
- [ ] Reward panel sizes/borders, component states, progress parts/values, atlas group, and locked mapping are approved.
- [ ] Bounded Unity project/runtime scope and M4-S1 through M4-S5 ordering are approved.
- [ ] V4-E01 through V4-E10, reviewers, scoring thresholds, mandatory minimums, and blockers are sufficient.
- [ ] Implementation remains prohibited until this definition checklist is explicitly confirmed.

## Scorecard template

| Dimension | Reviewer score | Weighted score | Evidence/notes |
|---|---:|---:|---|
| Manifest and importer correctness | — | — | |
| 9-slice, pivot, PPU, and layout fidelity | — | — | |
| State flow and mobile readability | — | — | |
| Stable identity, references, atlas, and re-export | — | — | |
| Automation and platform portability | — | — | |
| Traceability and reproducibility | — | — | |
| **Total** |  | **— / 100** | |

Final outcome: `Blocked / Fail / Conditional pass / Pass`

Open blockers: `—`

Required corrections and owners: `—`

Reviewers/date: `—`

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Drafted V4 evidence, scoring, blockers, review procedure, and definition checklist | Codex |
