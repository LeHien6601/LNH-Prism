# ADR-013 — Use a bounded Frostbound reward-claim flow for V4

| Field | Value |
|---|---|
| Status | 🟢 Accepted |
| Date | 2026-07-17 |
| Decision owner | 🧭 Project owner |
| Scope | M4 / Practical Validation V4 target and Unity baseline |

## Context

M4 must prove dependable Unity handoff: manifest-driven sprite import, 9-slice borders, pivots, PPU, state discovery, atlas grouping, stable asset IDs, and re-export without broken prefab or scene references. The repository has no existing Unity project or version constraint, so the first integration target must pin a bounded greenfield baseline without expanding into gameplay architecture or general-purpose importer tooling.

Unity identifies Unity 6.3 as the current LTS family, supported through December 2027. The selected patch, [`6000.3.18f1`](https://unity.com/releases/editor/whats-new/6000.3.18f1), was released on 2026-06-17. The release-family support policy is recorded on [Unity's official support page](https://unity.com/releases/unity-6/support).

## Decision

Practical Validation V4 will use one self-contained **Frostbound Reward Claim** sample project with this pinned baseline:

| Field | Decision |
|---|---|
| Unity Editor | `6000.3.18f1` |
| UI system | uGUI |
| Render pipeline | Built-in Render Pipeline; no Scriptable Render Pipeline asset |
| Validation targets | Windows Editor and Android portrait |
| Reference scale | `540 × 960` logical / `1080 × 1920` presentation |
| Source family | Approved Frostbound Reward V3 assets and manifests |

The bounded flow must exercise:

- one 9-sliced reward panel at minimum and maximum approved sizes;
- primary claim and secondary later actions with normal, pressed, and disabled behavior;
- reward progress at the approved `10/50/75/90` values with independent frame and fill;
- normal, selected, and locked reward-emblem behavior, with any additive locked mapping explicitly specified and reviewed before implementation;
- manifest-driven Sprite import settings, stable collision-safe IDs/names, atlas grouping, prefab/scene references, and idempotent re-export;
- Editor Play Mode and an Android portrait build/readability check.

## Acceptance boundary

The sample proves asset handoff, not a reusable game framework. It excludes backend calls, inventory/economy systems, save data, animation systems, localization, navigation architecture, URP compatibility, UI Toolkit compatibility, and a general Unity editor product. Source SVG/JSON remains authoritative; Unity-imported PNG and metadata are deterministic derivatives.

## Consequences

### Benefits

- Continues directly from the passed Frostbound V3 family and preserves end-to-end provenance.
- Exercises the exact M4 risks—slicing, pivots, PPU, states, IDs, atlasing, and reference-safe re-export—with minimal unrelated configuration.
- uGUI and the Built-in pipeline keep the first gate focused on sprite/importer correctness.

### Trade-offs and controls

| Trade-off | Control |
|---|---|
| Does not prove URP integration | Defer until a production target requires it; M4 validates pipeline-neutral source/export contracts first |
| Does not prove UI Toolkit integration | Keep uGUI as the single V4 runtime consumer; require a reviewed later task before adding a second UI system |
| The existing V3 family has no approved locked output | Define and review the smallest deterministic locked-state mapping in the M4 specification before implementation |
| Android tooling can add environment variability | Pin Editor/modules/packages, record build settings, and separate environment blockers from asset/importer defects |

## Links

- [Unity export module](../modules/06-unity-export.md)
- [Project roadmap](../ROADMAP.md)
- [V3 validation record](../validation/records/v3-frostbound-reward.md)

## Change history

| Date | Change | Author |
|---|---|---|
| 2026-07-17 | Approved Option A: Frostbound reward claim, Unity `6000.3.18f1`, uGUI, Built-in pipeline, Editor and Android portrait | Project owner |
