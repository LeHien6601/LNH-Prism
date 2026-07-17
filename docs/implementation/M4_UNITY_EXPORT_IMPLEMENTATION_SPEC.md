# M4 Implementation Specification — Unity Export and Integration

## Document control

| Field | Value |
|---|---|
| Status | 🟢 Approved — Option A with versioning and naming clarifications |
| Date | 2026-07-17 |
| Milestone | M4 — Unity export and integration |
| Validation target | V4 — Frostbound Reward Claim |
| Decision source | [ADR-013](../decisions/ADR-013-m4-unity-reward-claim-baseline.md) |
| Validation rubric | [V4 Unity Integration Rubric](../validation/V4_UNITY_INTEGRATION_RUBRIC.md) |
| Implementation state | 🟢 M4-S1 complete; M4-S2 Unity bundle generation is agent-ready |

## 1. Intended outcome

M4 will turn the approved Frostbound PNG outputs and export manifests into a reference-safe uGUI handoff. A bounded Unity project will prove that manifest metadata—not manual Inspector correction—controls Sprite import, slicing, pivots, pixels per unit (PPU), atlas membership, state binding, prefab/scene references, and idempotent re-export in Unity `6000.3.18f1`.

The implementation remains faithful to the project principle: deterministic tools create final structure and assets. Unity consumes versioned outputs and metadata; it does not become an undocumented source of visual truth.

## 2. Required deliverables

- a backward-compatible export-manifest contract extension and canonical Frostbound fixtures;
- deterministic, collision-safe logical IDs, filenames, Unity asset IDs, and `.meta` GUIDs;
- a reproducible Frostbound Unity export bundle containing PNGs, manifests, hashes, and a stable-ID registry;
- one bounded Unity `6000.3.18f1` uGUI/Built-in sample project and manifest importer;
- imported Sprite settings, one Sprite Atlas, prefabs, and a reward-claim validation scene;
- Edit Mode and Play Mode validation plus an Android portrait build/readability receipt;
- before/after re-export proof that stable prefab and scene references survive unchanged IDs;
- V4-E01 through V4-E10 evidence and a human integration review.

## 3. Fixed baseline and explicit non-goals

| Field | Fixed value |
|---|---|
| Editor | Unity `6000.3.18f1` |
| UI | uGUI |
| Rendering | Built-in Render Pipeline; no SRP asset |
| Validation | Windows Editor Play Mode and Android portrait build |
| Canvas | `540 × 960` logical reference resolution, `1080 × 1920` presentation evidence |
| Content | Frostbound Reward Claim only |

Out of scope: gameplay, backend, reward/economy rules, persistence, localization, navigation, animation, audio, Addressables, URP/HDRP, UI Toolkit, a general-purpose editor, and support claims for any Unity version other than the pinned baseline. The sample may use deterministic placeholder text and a local state driver only where required to expose the approved UI states.

## 4. Compatibility and contract strategy

The existing export manifest `1.0` already defines output path, dimensions, hash, state, PPU, pivot, border, and atlas group. M4 must extend that contract as version `1.1` while preserving backward compatibility:

1. Updated validators accept existing valid `1.0` manifests without migration and new `1.1` manifests.
2. A manifest using M4 Unity integration fields declares `schemaVersion: "1.1"`. Version `1.1` requires the root `unityIntegration` object and complete Unity fields inside each PNG `outputs[].unity` object.
3. The JSON Schema keeps unknown fields closed with `additionalProperties: false`; every extension is typed and tested.
4. Existing asset IDs, approved component versions, source hashes, and renderer provenance remain unchanged.
5. Unity-specific data cannot override source identity, output dimensions, or output SHA-256.

The proposed root object is:

| Field | Requirement |
|---|---|
| `profileId` | `unity-6000-ugui-builtin-android-portrait` |
| `editorVersion` | Exact value `6000.3.18f1` |
| `uiSystem` | `ugui` |
| `renderPipeline` | `built-in` |
| `referenceResolution` | Integer width `540`, height `960` |
| `targetPlatform` | `android` |
| `orientation` | `portrait` |
| `importerVersion` | Semver for the repository-owned importer |

For each Unity-targeted PNG, `outputs[].unity` must carry:

| Field | Requirement |
|---|---|
| `assetId` | Stable Unity logical ID defined below |
| `metaGuid` | Stable 32-character lowercase hexadecimal Unity GUID |
| `pixelsPerUnit` | Positive number; Frostbound default `100` unless an approved fixture states otherwise |
| `pivot` | Normalized `x/y` in `0–1`; default center `{0.5, 0.5}` |
| `border` | Integer left/right/top/bottom pixels; each pair must leave at least one center pixel |
| `atlasGroup` | `ui-frostbound-reward` |
| `spriteMode` | `single` |
| `meshType` | `full-rect` for predictable sliced uGUI geometry |
| `filterMode` | `bilinear` |
| `wrapMode` | `clamp` |
| `mipmaps` | `false` |
| `alphaIsTransparency` | `true` |
| `compression` | `uncompressed` for V4 evidence consistency |

SVG remains the editable source and PNG is the Unity production handoff. Importer platform overrides must not silently alter the manifest-owned geometry or identity settings.

## 5. Stable naming, IDs, and GUIDs

### Canonical forms

- Export logical ID: `{style-id}-{component-id}-{part}-{variant}-{state}-{width}x{height}` with inapplicable segments omitted.
- File stem: the same lowercase kebab-case value as the export logical ID.
- Unity asset path: `Assets/LNHPrism/Generated/{style-id}/{component-id}/{file-stem}.png`.
- Unity asset ID: `lnh-prism:{export-logical-id}` stored in the manifest/registry; it is independent of the asset path.
- Unity `.meta` GUID: the first 128 bits of SHA-256 over UTF-8 `lnh-prism-unity-guid-v1\n{unity-asset-id}`, serialized as 32 lowercase hex characters.

These kebab-case forms are authoritative for M4 and supersede Module 06's earlier illustrative underscore pattern.

The registry maps `unityAssetId → metaGuid → path → outputSha256`. Generation must sort entries by Unity asset ID, reject duplicate IDs, duplicate GUIDs, path collisions, case-folding collisions, or one ID moving to another GUID, and write atomically. A deliberate rename or identity change requires a reviewed migration record; the importer must never guess.

Timestamps such as `generatedAt` may change between runs, but they are excluded from content-identity comparisons. Stable IDs, GUIDs, paths, source hashes, importer-owned settings, prefab/scene references, and unchanged PNG bytes must remain stable.

## 6. Required asset and state matrix

| Artifact | Required Unity proof |
|---|---|
| Reward panel | One sliced Sprite used at `432 × 300` and `432 × 420`; corners/borders remain fixed and the center stretches |
| Primary claim | Normal, pressed, and disabled at `240 × 64` and `288 × 64`; uGUI `Selectable` transitions bind the exact state sprites |
| Secondary later | Normal, pressed, and disabled at `160 × 52` and `200 × 52`; hierarchy remains subordinate without label dependence |
| Progress | Independent frame and fill at widths `320` and `432`; state driver proves `10/50/75/90` without merging the parts |
| Reward emblem | Normal and selected at `104 × 104` and `144 × 144`, plus the locked mapping below |

### Approved locked mapping

The locked emblem is a deterministic Unity presentation mapping, not a new AI or baked raster asset. It reuses the normal emblem Sprite and applies manifest-owned uGUI color `#6F8798AD` (`RGBA 111,135,152,173`), sets the enclosing `Selectable.interactable` to `false`, and displays a repository-owned vector-derived lock badge as a separate centered child Image. The badge has its own stable asset ID, source provenance, manifest entry, and Sprite settings. Selected lighting is absent while locked; no text is needed to distinguish the state.

The M4 definition review explicitly accepted this additive mapping.

## 7. Importer behavior

The importer runs from an explicit Editor command and in batch mode. It must:

1. preflight the pinned Unity profile, manifest schema/semantics, source/output hashes, registry, allowed root, and collision rules before writing;
2. copy or update only manifest-declared files below `Assets/LNHPrism/Generated`;
3. create a missing `.meta` with the declared GUID or preserve an existing matching GUID; reject a mismatch;
4. apply `TextureImporterType.Sprite`, single mode, PPU, pivot, border, Full Rect mesh, alpha, filter, wrap, mipmap, and compression settings exactly;
5. create/update only the declared `ui-frostbound-reward` Sprite Atlas membership;
6. generate/update deterministic binding assets used by the bounded prefabs and scene;
7. delete nothing implicitly; stale generated assets produce a report and require an explicit reviewed cleanup action;
8. emit a machine-readable receipt with importer version, Unity version, manifest/source/output hashes, created/updated/unchanged/rejected counts, and diagnostics;
9. make a second identical run a no-op apart from receipt time and logs.

Manual Inspector edits to importer-owned settings are drift, not corrections. Validation must fail and the importer must restore the declared value only when the user explicitly reruns import.

## 8. Unity sample boundary and reference safety

The bounded project lives under `unity/v4-frostbound-reward-claim/` and contains only:

- `Assets/LNHPrism/Editor` — importer, semantic validator, deterministic binding generation;
- `Assets/LNHPrism/Generated` — manifest-owned PNGs, metadata, registry, atlas, and bindings;
- `Assets/LNHPrism/Runtime` — minimal reward state/progress driver;
- `Assets/LNHPrism/Prefabs` — panel, primary/secondary action, progress, emblem, and composed reward-claim prefabs;
- `Assets/LNHPrism/Scenes/V4FrostboundRewardClaim.unity`;
- `Assets/LNHPrism/Tests/EditMode` and `Tests/PlayMode`;
- pinned `Packages/manifest.json`, `Packages/packages-lock.json`, and `ProjectSettings`.

Prefabs and the scene reference Sprites/bindings by stable Unity GUID/fileID. A re-export test must capture all serialized references, change at least one approved source input so PNG hashes change without logical IDs changing, re-export/import, and prove the same prefab/scene references resolve. It must then repeat without source changes and prove a no-op import. Hand-editing YAML or `.meta` files invalidates the evidence.

## 9. Ordered implementation slices

| Slice | Work | Exit evidence |
|---|---|---|
| M4-S1 | Extend contracts, semantic validation, naming/GUID rules, canonical fixtures, and migration notes | Legacy manifests still pass; malformed Unity profiles, settings, collisions, and unsafe paths fail |
| M4-S2 | Produce the deterministic Frostbound Unity bundle and stable-ID registry | Required PNG/state/part matrix, hashes, metadata, collision audit, and repeat-export proof are complete |
| M4-S3 | Create the pinned bounded Unity project, importer, atlas, bindings, prefabs, and scene | Batch import and Edit Mode tests prove exact settings, slicing, IDs, atlas membership, and references |
| M4-S4 | Add the local state/progress flow, Play Mode tests, re-export test, and Android portrait build | Required states/values, reference survival, no-op import, Editor behavior, and Android readability are proven |
| M4-S5 | Assemble V4-E01–V4-E10 and conduct the human integration gate | Scorecard, blockers, defects, corrections, and append-only revalidation produce a recorded outcome |

Each slice is one coherent task. M4-S1 cannot start until the Product, Technical, and Unity leads approve this specification/rubric definition package. Later slices require the preceding exit evidence; M4-S5 remains a human-decision gate.

## 10. Automated validation

- Contract tests prove legacy `1.0` compatibility and M4 semantic requirements.
- Path, case-folding, logical-ID, GUID, registry, border-center, pivot, PPU, state, and atlas failures are negative-tested.
- Two clean exports from identical inputs match byte-for-byte except declared volatile receipt fields.
- Imported TextureImporter/Sprite data exactly match the manifest; no Inspector correction is needed.
- Sliced panel geometry is asserted at `432 × 300` and `432 × 420`.
- Prefab bindings cover every button state, emblem mapping, and independent progress frame/fill value.
- Sprite Atlas membership contains exactly the declared Frostbound assets and remains deterministic.
- Re-export preserves GUIDs and all prefab/scene object references while changed PNG hashes are observed.
- A second unchanged import reports zero created/updated assets.
- Edit Mode and Play Mode suites run by command line in the pinned Editor.
- Android build completes, launches to the bounded scene, and yields portrait `1080 × 1920` readability evidence.

## 11. V4 evidence

Prepare V4-E01 through V4-E10 exactly as defined in [the V4 rubric](../validation/V4_UNITY_INTEGRATION_RUBRIC.md). V4 cannot pass from screenshots alone. Contracts, importer receipts, serialized-reference audits, automated tests, re-export results, and Android evidence are mandatory.

## 12. Risks and controls

| Risk | Signal | Control |
|---|---|---|
| GUID churn | Re-export breaks prefab/scene references | Namespaced deterministic GUIDs, registry collision checks, serialized-reference audit |
| Inspector drift | A manual change is needed for correct rendering | Manifest-owned settings, drift test, explicit importer rerun |
| False idempotence | Only PNG equality is checked | Verify registry, GUIDs, paths, importer settings, atlas membership, refs, and no-op counts |
| Slicing damage | Corners stretch or center collapses | Border pair constraints and min/max geometry tests |
| Platform drift | Editor looks correct but Android differs | Pinned settings, Android build receipt, target-resolution review |
| Scope expansion | Runtime/product systems enter the sample | Bounded local driver and explicit exclusions |
| Locked-state ambiguity | Locked presentation is invented during implementation | Definition-review approval of the explicit additive mapping |

## 13. Definition approval outcome

On 2026-07-17, the project owner approved Option A with two clarifications: the M4 manifest extension is version `1.1` while updated validators continue accepting legacy `1.0`, and this specification's kebab-case naming forms supersede Module 06's older underscore example. The approval accepts the stable identity/GUID algorithm, locked-state mapping, importer ownership, bounded project, M4-S1 through M4-S5 ordering, V4-E01 through V4-E10, scoring thresholds, and automatic blockers. M4-S1 may begin; this definition approval does not pass M4/V4.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Drafted the M4 Unity export/import contract, stable identity rules, bounded slices, locked mapping, and validation requirements | Codex |
| 2026-07-17 | Approved Option A with explicit manifest `1.1`/legacy `1.0` compatibility and authoritative kebab-case naming; opened M4-S1 | Project owner / Codex |
| 2026-07-17 | Completed M4-S1 dual-version schema, semantic identity/GUID/registry validation, canonical fixtures, negative tests, and migration notes; opened M4-S2 | Codex |
