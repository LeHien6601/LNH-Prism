# ADR-014 — Engine-neutral modular asset delivery

**Status:** Accepted
**Date:** 2026-07-17

## Decision

The final product is an engine-neutral package of modular UI assets. Unity import, importer automation, atlases, prefabs, scenes, Play Mode tests, and Android builds are not delivery requirements and will not gate the roadmap.

Each final asset module must remain independently extractable and usable. It includes its stable asset ID, editable deterministic source, approved SVG and/or PNG derivative as appropriate, dimensions and slice guidance where relevant, and source/material/output provenance receipts. The package must not depend on a Unity project to be understood or consumed.

## Consequences

- Existing M4 Unity work is retained as historical, non-gating evidence only.
- The M4-S5/V4 human integration gate is superseded.
- Follow-on work concentrates on module boundaries, portable handoff structure, and clear extraction/use guidance.
- No additional Unity-specific implementation or validation is scheduled unless the project owner explicitly restores it through change control.

## Rationale

The project owner clarified that the usable outcome is the assets themselves. A tightly coupled Unity flow does not make those assets easier to extract into smaller modules, so it does not serve the delivery goal.
