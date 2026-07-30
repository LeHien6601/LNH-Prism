# Module 06 — Modular Asset Delivery

## Goal

Deliver each approved UI asset as an independently extractable, engine-neutral module.

**Status:** M4-A1 complete; M5-A2 production-hardening validation is the next agent-ready task.

## Scope

Each module contains:

- an immutable stable asset ID and semantic part/state identity;
- editable deterministic SVG source where applicable;
- approved PNG derivatives where raster delivery is useful;
- dimensions and 9-slice guidance where relevant;
- source, material, renderer, and output-hash receipts; and
- concise extraction/use guidance that does not rely on any particular engine or project.

## Acceptance criteria

- Every asset module can be found, identified, traced, and copied from the delivery package alone.
- Independent parts, including Progress Bar frame and fill, remain separately usable.
- Unchanged source inputs produce byte-stable derivatives and receipts.
- The package has no engine-project, importer, atlas, prefab, scene, or build dependency.

## Validation task

M4-A: inspect the delivery package outside any engine project and confirm that normal, pressed, disabled, and selected/locked modules, the panel, reward emblem, and independent progress frame/fill can each be extracted and traced.

## Risks

- Package coupling: keep module metadata and usage guidance next to its asset files.
- Asset path churn: resolve modules through stable IDs and manifests, not filenames alone.

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Replaced engine-specific export scope with engine-neutral modular asset delivery under ADR-014 | Project owner / Codex |
| 2026-07-17 | Assembled and validated the Frostbound package with 62 independently extractable SVG/PNG modules, unique IDs, and output receipts | Codex |
| 2026-07-30 | Added Production Lab dry-run/execute promotion, immutable semantic component versions, promotion receipts, and reference-free engine-neutral package validation | Codex |
| 2026-07-17 | Aligned the active handoff status with the M5-A2 next-task assignment | Codex |
