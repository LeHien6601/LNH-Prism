# Agent workflow measurement

Measure whether scoped routing lowers context/tool overhead without weakening deterministic asset delivery.

## Success gate

After five comparable baseline and five post-rollout tasks, post-rollout median tool/output overhead must be at least 30% lower. Validation, provenance, review-reference isolation, task status, and asset-boundary compliance must not regress. Record unavailable Codex telemetry as `n/a`; do not estimate credits.

| Phase | Task ID/type | Tool calls | Bulk-output incidents | Elapsed minutes | Validation | Codex tokens/credits | Notes |
|---|---|---:|---:|---:|---|---|---|
| Baseline | Pending sample 1–5 |  |  |  |  | n/a |  |
| Post-rollout | Pending sample 1–5 |  |  |  |  | n/a |  |

Count an incident when a raw file, manifest, SVG, test log, or evidence package is loaded despite a summary/query being sufficient. Compare like task types; any quality regression fails the rollout.
