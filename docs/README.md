# AI-Assisted Mobile Game UI Asset Generation System

**Core principle:** AI creates concepts and reusable materials; deterministic tools create structure and final assets.

This documentation package defines the plan for a production-oriented system that turns a game UI style direction into consistent, editable, Unity-ready UI assets. It deliberately treats AI-generated screens as references—not as final assets to cut apart.

## Project snapshot

| Field | Current value |
|---|---|
| Status | 🟡 In progress — M1/V1 passed; M2 definition gate approved |
| Active milestone | 🟡 M2: Design system and reusable materials |
| Next task | 🟣 Conduct and record the V2 visual review |
| North-star outcome | Generate consistent UI components, states, and size variants from reusable styles/materials |
| First production validation | Build a real Primary Button, Panel, and Progress Bar in one selected style |

## Navigation

| Document | Purpose |
|---|---|
| [Project overview](PROJECT_OVERVIEW.md) | Current state, roadmap, tasks, risks, decisions, and governance |
| [Roadmap](ROADMAP.md) | Phased delivery plan and quality gates |
| [System architecture](modules/01-system-architecture.md) | System boundaries, data flow, contracts, and repository shape |
| [Design analysis](modules/02-design-analysis.md) | Concept/screenshot analysis into a controlled style specification |
| [Component renderer](modules/03-component-renderer.md) | Deterministic structure, layers, states, and size variants |
| [Materials & textures](modules/04-materials-textures.md) | Reusable procedural and AI-sourced materials |
| [Validation lab](modules/05-validation-lab.md) | Real-asset validation milestones and review loops |
| [V1 visual-review rubric](validation/V1_VISUAL_REVIEW_RUBRIC.md) | Approved scorecard and evidence requirements for the completed first validation |
| [V1 Neon Core reference brief](reference-briefs/V1_NEON_CORE.md) | Selected style direction, palette, scale, and V1 constraints |
| [V1 core-component acceptance briefs](acceptance-briefs/V1_CORE_COMPONENTS.md) | Approved dimensions, states, layers, and evidence for the first three assets |
| [V2 Neon Market reference brief](reference-briefs/V2_NEON_MARKET.md) | Approved shop-popup family and Neon Alloy direction |
| [M2 Neon Market implementation specification](implementation/M2_NEON_MARKET_IMPLEMENTATION_SPEC.md) | Approved versioned requirements, bounded controls, implementation slices, and validation obligations |
| [V2 visual-review rubric](validation/V2_VISUAL_REVIEW_RUBRIC.md) | Approved evidence package, scoring thresholds, blockers, and scorecard for M2 |
| [ADR-009: V1 render/export stack](decisions/ADR-009-v1-render-export-stack.md) | Approved TypeScript, SVG, resvg, and JSON-manifest architecture |
| [Unity export](modules/06-unity-export.md) | Assets, metadata, slicing, naming, and importer integration |
| [Production hardening](modules/07-production-hardening.md) | Reliability, regression testing, performance, and operations |
| [Change control](CHANGE_CONTROL.md) | Rules for new ideas, reviews, traceability, and scope protection |
| [Component showcase plan](DASHBOARD_PLAN.md) | Local preview of generated components, states, and real UI scenarios |
| [CR-001: Component showcase](change-requests/CR-001-component-showcase.md) | Approved scope change from status dashboard to renderer-backed showcase |
| [Skill capability assessment](SKILL_CAPABILITY_ASSESSMENT.md) | Installed skills, roadmap coverage, and deferred integrations |

## Document conventions

- **Status key:** 🟢 complete/approved · 🔵 agent-ready · 🟡 active/draft/proposed · 🟣 human decision/review · 🔴 blocked · ⚪ deferred/not started.
- **Role key:** 🤖 agent · 🧭 product · 🛠️ technical · 🎨 art · ✦ UI · 🎮 Unity.
- **Quick commands:** `Next:` starts one 🔵 agent-ready task; `Guide:` prepares the current 🟣 human decision; `Review:` performs a read-only health review.
- **M0–M6** means a delivery milestone in `ROADMAP.md`.
- **Validation task** means a real deliverable, not a synthetic demo.
- **Gate** means a required review before work proceeds.
- **Decision ID** is permanent, for example `ADR-003`.
- **Change ID** is permanent, for example `CR-012`.

All documents have a change history. Update the overview first whenever project status, the active milestone, next task, key risk, or decision changes.
