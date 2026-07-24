---
name: release-delivery
description: Commit and publish validated LNH Prism work when the user requests Push or release delivery, while preserving unrelated working-tree changes.
---
# Release delivery
Inspect branch, upstream, status, and unpushed commits. Stage only the cohesive validated task, use a Conventional Commit, and push without force, rebase, or branch switching.
For `Push:`, create no commit. Preserve and report uncommitted changes separately. Report the exact publication result or blocker.