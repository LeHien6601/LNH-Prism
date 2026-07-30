# Production Lab readiness plan

## Gap assessment — 2026-07-30

The existing lab already provides bounded jobs, Codex task preparation,
editable SVG layers, named deterministic materials, preview, explicit human
approval, build receipts, comparison, stable IDs, path-safe job IDs, and a
reference-pixel prohibition.

The Block Forge target is not yet end-to-end ready. Before this change the lab
had no owned support status, generic project manifest, multi-reference registry,
authority hierarchy, project audit, component-family/state inheritance, strict
geometry constraints, transparent PNG output, scalable-region metadata,
mobile-readability record, stale-approval invalidation, promotion, or delivery
package.

## Focused milestone sequence

1. **Project and reference registry (implemented):** supported package boundary,
   generic project intake, managed multi-reference provenance, bounded job
   creation, reproducible Codex authority packet, status, audit, atomic
   manifests, and focused tests.
2. **State and constraint schema (implemented):** component families, state inheritance,
   shared footprints, text/icon slots, square/grid/aspect/anchor/safe-area
   constraints, slicing metadata, and Block Forge puzzle fixtures.
3. **Preview and transparent output (implemented):** deterministic PNG, alpha/effect-padding
   validation, richer comparison surfaces, state sheets, slicing previews, and
   mobile-readability evidence.
4. **Audit and approval hardening (next):** cross-job shared registries and drift
   classifications, immutable approval evidence, stale-source invalidation,
   concurrency protection, and interrupted-build recovery.
5. **Promotion and packaging:** dry-run/execute promotion receipts, versioned
   component library, complete engine-neutral package, and package validation.
6. **Block Forge pilot:** nine bounded jobs, visual inspection, explicit human
   approvals, consistency audit, controlled promotion, and package review.

## Current milestone limits

The intake and state/constraint commands make bounded Block Forge reconstruction
safe to exercise with exact 8x8 square-cell, identical puzzle-unit, shared
bridge-footprint, anchor, safe-area, touch-target, slot, effect-padding, and
scalable-region requirements expressed as data. Reconstruction outputs are not
yet ready for approval, promotion, or delivery. Deterministic transparent PNGs,
slicing/state sheets, geometry overlays, and native/phone/thumbnail inspection
are now available. The next milestone must harden cross-job drift, immutable
approval evidence, stale-source invalidation, and interrupted-build recovery.
