import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateControlDrift } from "../../scripts/validate-control-drift.mjs";

async function fixture({ stale = false, linked = true } = {}) {
  const root = await mkdtemp(join(tmpdir(), "lnh-prism-control-drift-"));
  await mkdir(join(root, "docs/reference-briefs/assets"), { recursive: true });
  await mkdir(join(root, "docs/decisions"), { recursive: true });
  const next = stale ? "R-016c" : "R-020";
  await writeFile(join(root, "docs/PROJECT_OVERVIEW.md"), [
    "| Active milestone | ⚪ **M11 — Enchanted Forest third-style contrast** |",
    "| Next task | 🔵 **Plan bounded M11 implementation and evidence slices (" + next + ")** · 🤖 Agent |",
    "| Next agent-ready task | " + next + " — bounded work |",
    "| ⚪ | M11 | Enchanted Forest third-style contrast | 🟢 Definition approved |",
    "| P0 | Plan bounded M11 implementation and evidence slices (R-020) | 🤖 Agent | 🔵 Agent-ready | Ready |"
  ].join("\n"));
  await writeFile(join(root, "docs/ROADMAP.md"), "## ⚪ M11 — Enchanted Forest third-style contrast\nR-020 slice planning is next.\n");
  await writeFile(join(root, "docs/decisions/ADR-999.md"), "Decision\n");
  await writeFile(join(root, "docs/reference-briefs/assets/forest.png"), "png");
  await writeFile(join(root, "docs/reference-briefs/assets/forest.receipt.json"), JSON.stringify({
    status: "review-only", file: "forest.png", sourceDecision: "docs/decisions/ADR-999.md"
  }));
  if (linked) await writeFile(join(root, "docs/reference.md"), "forest.png\n");
  return root;
}

test("control-drift validator accepts aligned controls and documented references", async () => {
  assert.deepEqual(await validateControlDrift({ root: await fixture() }), { activeMilestone: "M11", nextTask: "R-020", reviewReferenceReceipts: 1 });
});

test("control-drift validator rejects stale next-task alignment", async () => {
  const root = await fixture({ stale: true });
  await assert.rejects(() => validateControlDrift({ root }), /R-016c is not an Agent-ready overview task/);
});

test("control-drift validator rejects an undocumented review reference", async () => {
  const root = await fixture({ linked: false });
  await assert.rejects(() => validateControlDrift({ root }), /forest\.png has no documentation link/);
});
