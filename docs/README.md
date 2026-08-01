# LNH Prism Semantic UI V2 documentation

**Core principle:** Game-owned typed specifications are authoritative; Prism
deterministically validates, previews, and packages UI structure without
creating production artwork.

Legacy asset-generation records remain available for auditability and existing
package support, but they are not V2 dependencies.

## Project snapshot

| Field | Current value |
|---|---|
| Status | In progress — M13 Semantic UI V2 foundation |
| Active mission | `semantic-ui-v2` |
| Active milestone | M13: Semantic UI V2 vertical slice |
| Next task | M13-A4: deterministic primitive wireframes and multi-size evidence |
| North-star outcome | Safely regenerate engine UI from game-owned semantic specifications |
| First production validation | External Tic-Tac-Toe semantic UI fixture and Unity workflow |

## Active navigation

| Document | Purpose |
|---|---|
| [Project overview](PROJECT_OVERVIEW.md) | Current state, tasks, risks, decisions, and governance |
| [Roadmap](ROADMAP.md) | Phased delivery plan and quality gates |
| [System architecture](modules/01-system-architecture.md) | Active V2 boundaries, ownership, dependencies, and sequence |
| [ADR-026](decisions/ADR-026-semantic-ui-v2-boundary.md) | Semantic UI V2 mission, ownership, versioning, and compatibility policy |
| [CR-003](change-requests/CR-003-semantic-ui-v2-boundary.md) | Approved strategic change and acceptance criteria |
| [Change control](CHANGE_CONTROL.md) | Governance, review, and traceability rules |
| [Agent instructions](../AGENTS.md) | Repository routing and safety rules |

## Legacy documentation

The module, reference, acceptance, implementation, validation, decision, and
evidence records for M0–M12 remain in their existing folders. They document the
asset renderer and Production Lab history; they are not active V2 contracts.

## Conventions

- `Next:` executes one authorized agent-ready task.
- `Guide:` prepares a pending human decision.
- `Review:` performs a read-only project assessment.
- M0–M12 are legacy asset-pipeline milestones; M13+ are semantic UI V2
  milestones.
- A gate requires recorded evidence; file existence alone is not completion.
- Generated output never authorizes overwriting game-authored files.
