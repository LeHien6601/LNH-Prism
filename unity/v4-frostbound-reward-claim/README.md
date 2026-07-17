# V4 Frostbound Reward Claim Unity Project

This bounded Unity `6000.3.18f1` project consumes the committed M4-S2 bundle from `docs/validation/evidence/m4-s2-frostbound-unity-bundle/bundle`. It owns only manifest-driven import, one Sprite Atlas, deterministic bindings, uGUI prefabs, the validation scene, and integration tests.

Run from the repository root:

```powershell
npm run prepare:m4-s3-unity
npm run validate:m4-s3-unity
```

The importer rejects a different Editor/profile, unsafe paths, hash drift, registry drift, case-folded collisions, collapsed borders, or an existing mismatched `.meta` GUID before updating declared PNGs. It never deletes stale assets; it records them as diagnostics. Importer-owned TextureImporter settings, atlas membership, bindings, prefabs, and scene content are generated through Unity APIs rather than hand-edited serialized assets.

M4-S3 does not add gameplay, persistence, animation, localization, UI Toolkit, URP, or Android build logic. The local state/progress driver, re-export reference-survival proof, Play Mode coverage, and Android portrait build belong to M4-S4.
