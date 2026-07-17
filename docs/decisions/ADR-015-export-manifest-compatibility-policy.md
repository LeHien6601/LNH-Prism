# ADR-015 - Export manifest compatibility policy

**Status:** Accepted
**Date:** 2026-07-17

## Decision

Legacy export-manifest versions `1.0` and `1.1` remain available only for archival validation of historical evidence. They are not the live target for new asset-package work.

New live output work must introduce and use a versioned engine-neutral export-manifest successor. The successor must preserve deterministic asset IDs, dimensions, state and part identity, source/material/output provenance, output hashes, and portable extraction/use metadata without requiring engine import metadata.

The migration must document which legacy fixtures remain archived, which live examples/tests move to the new version, and how validation distinguishes archival compatibility from current production output.

## Consequences

- Historical receipts and validation evidence remain auditable.
- New renderer/package work no longer treats engine-specific fields as current contract requirements.
- The next implementation task may update schemas, examples, renderer manifest types, tests, and documentation to separate archival legacy validation from engine-neutral production manifests.
- Removing or breaking historical validation requires a separate reviewed change.

## Rationale

ADR-014 made the final deliverable an engine-neutral modular asset package. Keeping Unity-shaped fields as the live manifest target would preserve retired assumptions in the production contract. Archiving the legacy versions while introducing an engine-neutral successor keeps compatibility history intact and gives future asset work a clean contract surface.
