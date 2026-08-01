import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateControlDrift } from "../../scripts/validate-control-drift.mjs";

async function fixture({ stale = false, linked = true, mission = "semantic-ui-v2", legacyScope = false, extraActive = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), "lnh-prism-control-drift-"));
  await mkdir(join(root, "docs/reference-briefs/assets"), { recursive: true });
  await mkdir(join(root, "docs/decisions"), { recursive: true });
  const next = stale ? "R-M13-002" : "M13-A2";
  const boundaries = legacyScope ? [
    "### In scope",
    "- AI-supported concept generation and reusable material packs."
  ] : [
    "### In scope",
    "- Specifications owned by game repositories.",
    "- Stable semantic IDs.",
    "- Deterministic multi-size wireframe evidence.",
    "- Explicit generated-versus-authored ownership."
  ];
  await writeFile(join(root, "docs/PROJECT_OVERVIEW.md"), [
    "| Active mission | `" + mission + "` — game-owned semantic UI compiler |",
    "| Active milestone | 🔵 **M13 — Semantic UI V2 vertical slice** |",
    "| Next task | 🔵 **Implement versioned semantic schemas and stable-ID validation (" + next + ")** · 🤖 Agent |",
    "| Next agent-ready task | " + next + " — bounded work |",
    "| Active | M13 | Semantic UI V2 vertical slice | Schema slice next |",
    ...(extraActive ? ["| Active | M12 | Legacy delivery | Human decision pending |"] : []),
    "| P0 | Implement versioned semantic schemas and stable-ID validation (M13-A2) | 🤖 Agent | 🔵 Agent-ready | Ready |",
    "## 3. Objective boundaries",
    ...boundaries,
    "## 4. Roadmap at a glance"
  ].join("\n"));
  await writeFile(join(root, "docs/ROADMAP.md"), "## 🔵 M13 — Semantic UI V2 vertical slice\nM13-A2 schema implementation is next.\n");
  await writeFile(join(root, "docs/decisions/ADR-999.md"), "Decision\n");
  await writeFile(join(root, "docs/reference-briefs/assets/forest.png"), "png");
  await writeFile(join(root, "docs/reference-briefs/assets/forest.receipt.json"), JSON.stringify({
    status: "review-only", file: "forest.png", sourceDecision: "docs/decisions/ADR-999.md"
  }));
  if (linked) await writeFile(join(root, "docs/reference.md"), "forest.png\n");
  return root;
}

test("control-drift validator accepts aligned controls and documented references", async () => {
  assert.deepEqual(await validateControlDrift({ root: await fixture() }), { activeMission: "semantic-ui-v2", activeMilestone: "M13", nextTask: "M13-A2", reviewReferenceReceipts: 1 });
});

test("control-drift validator rejects stale next-task alignment", async () => {
  const root = await fixture({ stale: true });
  await assert.rejects(() => validateControlDrift({ root }), /R-M13-002 is not an authorized overview task/);
});

test("control-drift validator accepts an aligned human decision", async () => {
  const root = await fixture();
  await writeFile(join(root, "docs/PROJECT_OVERVIEW.md"), [
    "| Active mission | `semantic-ui-v2` — game-owned semantic UI compiler |",
    "| Active milestone | 🔵 **M13 — Semantic UI V2 vertical slice** |",
    "| Next task | 🟣 **Review semantic contracts (M13-A5)** · 🧭 Product |",
    "| Next agent-ready task | No unblocked agent-ready task — M13-A5 review decision is required |",
    "| Active | M13 | Semantic UI V2 vertical slice | Human review |",
    "| P0 | Review semantic contracts (M13-A5) | 🧭 Product | 🟣 Human decision | Ready |",
    "## 3. Objective boundaries",
    "### In scope",
    "- Specifications owned by game repositories.",
    "- Stable semantic IDs.",
    "- Deterministic multi-size wireframe evidence.",
    "- Explicit generated-versus-authored ownership.",
    "## 4. Roadmap at a glance"
  ].join("\n"));
  await writeFile(join(root, "docs/ROADMAP.md"), "## 🔵 M13 — Semantic UI V2 vertical slice\nM13-A5 review is next.\n");
  assert.deepEqual(await validateControlDrift({ root }), { activeMission: "semantic-ui-v2", activeMilestone: "M13", nextTask: "M13-A5", reviewReferenceReceipts: 1 });
});

test("control-drift validator rejects a stale active mission", async () => {
  const root = await fixture({ mission: "asset-generation" });
  await assert.rejects(() => validateControlDrift({ root }), /active mission must be semantic-ui-v2/);
});

test("control-drift validator rejects legacy asset work in active objective boundaries", async () => {
  const root = await fixture({ legacyScope: true });
  await assert.rejects(() => validateControlDrift({ root }), /legacy asset-pipeline scope is still active/);
});

test("control-drift validator rejects multiple active milestone markers", async () => {
  const root = await fixture({ extraActive: true });
  await assert.rejects(() => validateControlDrift({ root }), /must mark only M13 active/);
});

test("control-drift validator rejects an undocumented review reference", async () => {
  const root = await fixture({ linked: false });
  await assert.rejects(() => validateControlDrift({ root }), /forest\.png has no documentation link/);
});
