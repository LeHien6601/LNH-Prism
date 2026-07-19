# ADR-022: Reopen M5 for Volcanic Forge cross-style hardening

## Status

Accepted on 2026-07-19 by project owner decision (Option 1).

## Context

ADR-016 accepted Frostbound-only hardening because a credible second production style did not yet exist. Volcanic Forge now passed V10 at `86/100` with a deterministic, engine-neutral package and clean-workspace receipts. The residual multi-style reliability risk is therefore actionable.

## Decision

Reopen M5 for one bounded Agent-ready cross-style batch, `M5-B1`. It must validate the existing Volcanic Forge package without changing approved package bytes or expanding into third-style testing, engine integration, or authoring tooling.

## Required evidence

- Clean-workspace reproduction and strict manifest/module byte receipts for all 52 Volcanic Forge modules.
- Five-run timing, package-size, and complete state/part matrix receipt.
- Manifest migration/rollback and package backup/recovery drills for the Volcanic Forge package.
- Target-phone readability receipt using the approved V10 surfaces.

## Consequences

M5's Frostbound-only scope is superseded for cross-style production-hardening claims. Completion of M5-B1 provides two-style hardening evidence; it does not authorize a third style.
