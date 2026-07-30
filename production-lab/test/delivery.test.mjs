import assert from "node:assert/strict";
import test from "node:test";
import {
  createPackageManifest,
  createPromotionReceipt,
  planPromotion
} from "../src/delivery.mjs";

const approvalId = "a".repeat(64);
const moduleHash = "b".repeat(64);

function fixture(overrides = {}) {
  return {
    project: {
      projectId: "block-forge",
      componentInventory: [],
      visualTokens: { color: { accent: "#00ffff" } },
      materials: [{ id: "neon-glass" }]
    },
    job: { jobId: "pilot-job", status: "built" },
    approvalReceipt: { approvalId, jobId: "pilot-job" },
    buildManifest: {
      jobId: "pilot-job",
      approvalId,
      modules: [
        {
          id: "bridge",
          stateId: "broken",
          format: "svg",
          path: "components/bridge/broken.svg",
          sha256: moduleHash
        },
        {
          id: "bridge",
          stateId: "broken",
          format: "png",
          path: "components/bridge/broken.png",
          sha256: moduleHash
        }
      ]
    },
    componentVersion: "1.0.0",
    ...overrides
  };
}

test("plans a deterministic versioned promotion and produces dry-run and execution receipts", () => {
  const plan = planPromotion(fixture());
  assert.equal(plan.components.length, 1);
  assert.deepEqual(plan.components[0].states, ["broken"]);
  assert.match(plan.planSha256, /^[a-f0-9]{64}$/u);

  const dryRun = createPromotionReceipt({
    plan,
    promotedFiles: [],
    executedAt: "2026-07-30T00:00:00.000Z",
    dryRun: true
  });
  assert.equal(dryRun.status, "validated-dry-run");
  assert.equal(dryRun.dryRun, true);

  const executed = createPromotionReceipt({
    plan,
    promotedFiles: [{ path: "library/bridge/1.0.0/broken.svg", sha256: moduleHash }],
    executedAt: "2026-07-30T00:00:00.000Z",
    dryRun: false
  });
  assert.equal(executed.status, "promoted");
  assert.equal(executed.components[0].version, "1.0.0");
});

test("rejects promotion without a built job or with stale identity and unsafe modules", () => {
  assert.throws(() => planPromotion(fixture({ job: { jobId: "pilot-job", status: "approved" } })), /built job/u);
  assert.throws(() => planPromotion(fixture({
    approvalReceipt: { approvalId: "c".repeat(64), jobId: "pilot-job" }
  })), /approval IDs/u);
  const unsafe = fixture();
  unsafe.buildManifest.modules[0].path = "../reference.png";
  assert.throws(() => planPromotion(unsafe), /Unsafe module path/u);
});

test("rejects duplicate immutable component versions", () => {
  const duplicate = fixture();
  duplicate.project.componentInventory.push({ id: "bridge", version: "1.0.0" });
  assert.throws(() => planPromotion(duplicate), /Duplicate component version/u);
});

test("creates a complete engine-neutral package manifest and excludes reference evidence", () => {
  const inputs = {
    project: fixture().project,
    packageVersion: "1.0.0",
    componentEntries: [{ id: "bridge", version: "1.0.0" }],
    files: [{ path: "components/bridge/1.0.0/broken.svg", sha256: moduleHash, bytes: 42 }],
    approvalReceipts: [{ approvalId }],
    promotionReceipts: [{ receiptId: "pilot" }],
    validationReport: { status: "valid" },
    knownLimitations: ["Unity integration is intentionally excluded."]
  };
  const manifest = createPackageManifest(inputs);
  assert.equal(manifest.engineNeutral, true);
  assert.equal(manifest.unityIntegration, false);
  assert.deepEqual(manifest.tokens, inputs.project.visualTokens);
  assert.deepEqual(manifest.materials, inputs.project.materials);

  assert.throws(() => createPackageManifest({
    ...inputs,
    files: [{ path: "references/source-screen.png", sha256: moduleHash, bytes: 42 }]
  }), /Reference or comparison evidence/u);
});
