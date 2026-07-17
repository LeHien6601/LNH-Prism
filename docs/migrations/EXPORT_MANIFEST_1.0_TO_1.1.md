# Export Manifest Migration — 1.0 to 1.1

## Purpose

Export manifest `1.1` adds the deterministic Unity integration contract approved for M4. It is opt-in: existing `1.0` manifests remain valid and require no rewrite. Renderer outputs stay on `1.0` until they intentionally emit the complete Unity handoff fields.

## Compatibility contract

- Updated validators accept both `schemaVersion: "1.0"` and `schemaVersion: "1.1"`.
- Version `1.0` retains its exact field set; adding a `1.1`-only field to a `1.0` manifest fails validation.
- Version `1.1` requires `unityIntegration`, PNG-only outputs, complete source paths/hashes, complete Unity import settings, and safe canonical Unity paths.
- There is no automatic in-place migration. Generate a new `1.1` manifest from approved sources and preserve the old manifest as evidence when needed.

## Field mapping

| `1.0` source | `1.1` requirement |
|---|---|
| `schemaVersion: "1.0"` | Change to `"1.1"` only after every requirement below is available |
| Existing root fields | Preserve `assetId`, renderer, sources, provenance, and hashes |
| Optional source `path`/`sha256` | Required for style, component, and material-pack references |
| No target profile | Add the pinned `unityIntegration` profile from the M4 specification |
| PNG or SVG output | Unity `1.1` output is PNG only |
| Repository-relative output path | Use `Assets/LNHPrism/Generated/{style-id}/{component-id}/{file-stem}.png` |
| Optional Unity PPU/pivot/border/atlas | Supply the full approved Unity settings object |
| No stable Unity identity | Add `unity.assetId` and the derived `unity.metaGuid` |
| No registry | Generate a sorted Unity asset registry and compare it with the previous registry before accepting path/GUID changes |

## Identity procedure

1. Build the lowercase kebab-case stem `{style-id}-{component-id}-{part}-{variant}-{state}-{width}x{height}`, omitting inapplicable segments.
2. Set `unity.assetId` to `lnh-prism:{file-stem}`.
3. Derive `unity.metaGuid` as the first 128 bits of SHA-256 over UTF-8 `lnh-prism-unity-guid-v1\n{unity.assetId}`.
4. Reject exact or case-folded ID/path collisions, GUID collisions, unsafe paths, or a stable ID moving to another path/GUID without a reviewed migration.

Use `deriveUnityMetaGuid`, `assertUnityManifestSemantics`, `createUnityAssetRegistry`, and `assertUnityAssetRegistrySemantics` from `src/unity/export-manifest-contract.ts`; do not reproduce the algorithm ad hoc.

## Validation

Run:

```text
npm run validate:contracts
npm run test:unity-contracts
```

The canonical pair is:

- `specs/examples/frostbound-reward-panel.unity.manifest.json`
- `specs/examples/frostbound-reward-panel.unity.registry.json`

Migration is complete only when JSON Schema and semantic validation both pass. Schema success alone does not prove border-center safety, canonical name/path agreement, deterministic GUID derivation, collision freedom, registry ordering, or identity stability.
