# V1-D004 Traceability and Reproducibility Audit

**Status:** 🟢 Accepted — re-scored `5/5`; V1 gate passed at `93/100`.

| Field | Value |
|---|---|
| Audit date | 2026-07-16 |
| Pre-correction baseline | `847d30b` |
| Runtime used | Node.js `24.11.0`; npm `11.6.1` |
| Dependency lock | `package-lock.json` SHA-256 `9e111c4ae81fa2d761b2cc291f628a19c7e27d4ca5ebd492b2ad0484aedd742c` |
| Scope | V1-E02 source provenance, manifest bindings, output hashes, and reproduction path |

## Audit result

The original package had deterministic output hashes and version labels, but it did not provide a complete reviewer-visible proof chain. The audit found three concrete gaps:

1. V1 source specs were still marked `draft` despite their approved M0/V1 decisions.
2. `neon-core-materials@0.1.0` referenced a missing procedural grain file with a placeholder hash.
3. Generated manifests named source IDs and versions but did not bind those identities, renderer source, or dependency lock to repository paths and hashes.

All three gaps are corrected. No SVG visual behavior was intentionally changed by V1-D004.

## Corrective evidence

| Check | Corrected behavior | Automated enforcement |
|---|---|---|
| Approved source state | Style, three component specs, and material pack are `approved` | Provenance loading rejects non-approved documents |
| Material provenance | `materials/neon-core/blue-grain.json` exists and its SHA-256 matches the material pack | Generation rejects a missing or mismatched material source |
| Manifest source binding | Style/component/material references include ID, version, repository path, and SHA-256; provenance is mandatory at the manifest root | Export-manifest schema, explicit missing-provenance rejection test, and renderer tests |
| Executable recipe binding | Each manifest hashes its component renderer source and shared renderer-version source | V1 source-tree receipt and provenance test |
| Dependency binding | Each manifest hashes `package-lock.json`; resvg remains pinned in renderer version metadata | V1 source-tree receipt and provenance test |
| Output integrity | Every generated SVG/PNG path and SHA-256 is verified against disk | Component renderer tests and V1 evidence validator |
| Cross-platform text integrity | Source text is normalized to LF before hashing so Git CRLF conversion does not invalidate provenance | Provenance test verifies every canonical source hash |
| Reviewer visibility | The evidence page links source specs, material input, representative manifests, registry, audit, and commands | V1 evidence validator checks the traceability section and links |

## Reproduction procedure

From the repository root:

```text
npm ci
npm run validate
```

The validation flow rebuilds the renderer, generates all V1 SVG/PNG derivatives and manifests, verifies schemas and source hashes, validates every output hash, and checks the reviewer-visible evidence page.

## Revalidation boundary

Only **Traceability and reproducibility** requires re-scoring for V1-D004. The original `4/5` remains in the validation record. The project owner should append a new score after reviewing this audit, the traceability section in `showcase/v1-evidence.html`, and representative generated manifests.

V1-D003 remains a separate visual renderer correction and is not evidence that V1-D004 failed.

## Re-score outcome

The project owner approved Traceability and reproducibility at `5/5` with no blockers on 2026-07-16. The original V1 total of `91/100` is retained; the appended revalidation recomputes the current total to `93/100` and the current gate outcome to 🟢 Pass.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-16 | Audited the original evidence chain, recorded three provenance gaps, and documented the bounded correction and revalidation procedure | Codex |
| 2026-07-16 | Accepted the corrected evidence at `5/5` with no blockers and approved the V1 Pass | Project owner |
| 2026-07-16 | Closed the post-review contract loophole by requiring provenance in every schema-valid export manifest | Project owner / Codex |
