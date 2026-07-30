import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  atomicReplaceDirectory,
  auditProjectDrafts,
  componentSvg,
  createApprovalReceipt,
  createProjectManifest,
  familyStateSvg,
  resolveComponentState,
  reviewScreenSvg,
  safeJobId,
  screenSvg,
  slicingPreviewSvg,
  stateSheetSvg,
  validateApprovalFreshness,
  validateDraft,
  validateProjectManifest,
  withFileLock
} from "../src/lib.mjs";
import { pngAlphaStats, renderPng } from "../src/raster.mjs";

function fixture() {
  return {
    schemaVersion: 1,
    jobId: "sample-job",
    canvas: { width: 540, height: 960 },
    tokens: { background: "#10131c" },
    unresolved: [],
    components: [
      {
        id: "primary-action",
        role: "button",
        bounds: { x: 110, y: 780, width: 320, height: 68 },
        layers: [
          {
            id: "base",
            kind: "rect",
            x: 0,
            y: 0,
            width: 320,
            height: 68,
            radius: 16,
            fill: "#315be8"
          }
        ]
      }
    ]
  };
}

test("job IDs cannot escape the lab workspace", () => {
  assert.throws(() => safeJobId("../outside"), /Job ID/);
  assert.equal(safeJobId("reward-popup"), "reward-popup");
});

test("approved drafts reject unresolved decisions", () => {
  const draft = fixture();
  draft.unresolved.push({ id: "question" });
  assert.throws(() => validateDraft(draft, { requireResolved: true }), /unresolved/);
});

test("drafts reject reference pixel layers", () => {
  const draft = fixture();
  draft.components[0].layers[0].sourceImage = "input/reference.png";
  assert.throws(() => validateDraft(draft), /Reference pixels/);
});

test("component and screen output preserve stable editable IDs", () => {
  const draft = fixture();
  assert.match(componentSvg(draft.components[0]), /id="base"/);
  assert.match(screenSvg(draft), /id="primary-action"/);
  assert.doesNotMatch(screenSvg(draft), /<image/);
});

test("named gradients and glow filters render as editable deterministic defs", () => {
  const draft = fixture();
  draft.materials = [
    {
      id: "button-face",
      kind: "linear-gradient",
      x1: "0%",
      y1: "0%",
      x2: "0%",
      y2: "100%",
      stops: [
        { offset: 0, color: "#164a91" },
        { offset: 1, color: "#06152f" }
      ]
    },
    {
      id: "cyan-bloom",
      kind: "glow",
      color: "#29ddff",
      blur: 5,
      opacity: 0.7
    }
  ];
  draft.components[0].layers[0].fillMaterial = "button-face";
  draft.components[0].layers[0].filter = "cyan-bloom";
  validateDraft(draft);
  const first = screenSvg(draft);
  const second = screenSvg(draft);
  assert.equal(first, second);
  assert.match(first, /<linearGradient id="button-face"/);
  assert.match(first, /<filter id="cyan-bloom"/);
  assert.match(first, /fill="url\(#button-face\)"/);
  assert.match(first, /filter="url\(#cyan-bloom\)"/);
  assert.match(componentSvg(draft.components[0], draft.materials), /<defs>/);
});

test("material references and definitions are validated", () => {
  const unknown = fixture();
  unknown.components[0].layers[0].fillMaterial = "missing";
  assert.throws(() => validateDraft(unknown), /Unknown material/);

  const unsafe = fixture();
  unsafe.materials = [{
    id: "bad-gradient",
    kind: "linear-gradient",
    stops: [
      { offset: 0.8, color: "#fff" },
      { offset: 0.2, color: "#000" }
    ]
  }];
  assert.throws(() => validateDraft(unsafe), /offsets must be ordered/);
});

test("controlled blend modes are supported without arbitrary styles", () => {
  const draft = fixture();
  draft.components[0].layers[0].blendMode = "screen";
  validateDraft(draft);
  assert.match(screenSvg(draft), /mix-blend-mode:screen/);
  draft.components[0].layers[0].blendMode = "difference";
  assert.throws(() => validateDraft(draft), /Unsupported blend mode/);
});

test("generic project manifests expose the supported intake contract", () => {
  const project = createProjectManifest({ projectId: "block-forge", displayName: "Block Forge" });
  assert.equal(validateProjectManifest(project), project);
  assert.equal(project.support.status, "supported-private-package");
  assert.deepEqual(project.outputFormats, ["svg", "png"]);
  assert.ok(Array.isArray(project.geometryConstraints));
  assert.ok(Array.isArray(project.stateRequirements));
});

test("project manifests validate multi-reference authority and history", () => {
  const project = createProjectManifest({ projectId: "block-forge", displayName: "Block Forge" });
  project.references.push(
    {
      id: "puzzle-approved",
      path: "references/puzzle-approved/source.png",
      sha256: "a".repeat(64),
      width: 1080,
      height: 1920,
      mediaType: "image/png",
      status: "superseded",
      supersededBy: "puzzle-v2",
      authorityRole: "primary-geometry",
      permittedUse: "analysis-and-comparison-only",
      version: "1.0.0",
      provenanceNote: "Approved puzzle geometry."
    },
    {
      id: "puzzle-v2",
      path: "references/puzzle-v2/source.png",
      sha256: "b".repeat(64),
      width: 1080,
      height: 1920,
      mediaType: "image/png",
      status: "approved",
      authorityRole: "primary-geometry",
      permittedUse: "analysis-and-comparison-only",
      version: "2.0.0",
      provenanceNote: "Replacement approved by the art lead."
    },
    {
      id: "ui-style",
      path: "references/ui-style/source.png",
      sha256: "c".repeat(64),
      width: 1080,
      height: 1920,
      mediaType: "image/png",
      status: "approved",
      authorityRole: "style-authority",
      permittedUse: "analysis-and-comparison-only",
      version: "1.0.0",
      provenanceNote: "Approved UI style authority."
    }
  );
  project.jobs.push({ id: "puzzle-board", referenceIds: ["puzzle-v2", "ui-style"], status: "draft" });
  validateProjectManifest(project);

  const invalid = structuredClone(project);
  invalid.jobs[0].referenceIds.push("unregistered");
  assert.throws(() => validateProjectManifest(invalid), /unregistered reference/);
});

async function blockForgeFixture() {
  return JSON.parse(await readFile(
    new URL("../examples/block-forge-state-constraints.json", import.meta.url),
    "utf8"
  ));
}

test("Block Forge fixture validates exact puzzle geometry, bridge footprints, slots, and slicing", async () => {
  const draft = await blockForgeFixture();
  assert.equal(validateDraft(draft), draft);
  const bridge = draft.componentFamilies.find((family) => family.id === "bridge");
  const repaired = resolveComponentState(bridge, "repaired");
  assert.deepEqual(repaired.bounds, bridge.bounds);
  assert.equal(repaired.layers.find((layer) => layer.id === "condition-mark").stroke, "#d9b35f");
});

test("Block Forge rejects non-square or non-8x8 puzzle declarations", async () => {
  const wrongGrid = await blockForgeFixture();
  wrongGrid.geometryConstraints.find((constraint) => constraint.kind === "square-grid").columns = 7;
  assert.throws(() => validateDraft(wrongGrid), /8x8 grid/);

  const wrongBounds = await blockForgeFixture();
  wrongBounds.componentFamilies.find((family) => family.id === "puzzle-board").bounds.width = 639;
  assert.throws(() => validateDraft(wrongBounds), /exact square cells/);
});

test("state families reject footprint drift and invalid inheritance", async () => {
  const footprintDrift = await blockForgeFixture();
  const bridge = footprintDrift.componentFamilies.find((family) => family.id === "bridge");
  bridge.states[0].bounds = { ...bridge.bounds, width: bridge.bounds.width - 1 };
  assert.throws(() => validateDraft(footprintDrift), /shared footprint/);

  const unknownLayer = await blockForgeFixture();
  unknownLayer.componentFamilies.find((family) => family.id === "bridge")
    .states[0].layerOverrides[0].layerId = "missing-layer";
  assert.throws(() => validateDraft(unknownLayer), /Unknown layer/);

  const anchorDrift = await blockForgeFixture();
  anchorDrift.componentFamilies.find((family) => family.id === "bridge").states[0].anchor = { x: 0, y: 0 };
  assert.throws(() => validateDraft(anchorDrift), /shared anchor/);
});

test("families reject unsafe geometry, clipped effects, and invalid scalable regions", async () => {
  const outsideCanvas = await blockForgeFixture();
  outsideCanvas.componentFamilies[0].bounds.x = 900;
  assert.throws(() => validateDraft(outsideCanvas), /contained within/);

  const negativePadding = await blockForgeFixture();
  negativePadding.componentFamilies.find((family) => family.id === "bridge").effectPadding.bottom = -1;
  assert.throws(() => validateDraft(negativePadding), /non-negative/);

  const invalidSlicing = await blockForgeFixture();
  invalidSlicing.componentFamilies.find((family) => family.id === "primary-action").slicing.fixedBorders.left = 390;
  assert.throws(() => validateDraft(invalidSlicing), /consume the component/);
});

test("replaceable text slots enforce mobile and localization declarations", async () => {
  const draft = await blockForgeFixture();
  const label = draft.componentFamilies.find((family) => family.id === "primary-action").textSlots[0];
  label.localizationExpansion = 0.9;
  assert.throws(() => validateDraft(draft), /localizationExpansion/);
});

test("isolated family PNG output is deterministic, transparent, and padding-safe", async () => {
  const draft = await blockForgeFixture();
  const family = draft.componentFamilies.find((candidate) => candidate.id === "primary-action");
  const svg = familyStateSvg(family, "normal", draft.materials);
  const first = renderPng(svg);
  const second = renderPng(svg);
  assert.deepEqual(first, second);
  assert.doesNotMatch(svg, /<image|screen-background/);
  const alpha = pngAlphaStats(first);
  assert.equal(alpha.width, 420);
  assert.equal(alpha.height, 120);
  assert.equal(alpha.minimumAlpha, 0);
  assert.ok(alpha.transparentPixels > 0);
  assert.equal(alpha.edgeOpaquePixels, 0);
});

test("review surfaces expose states, slicing guides, and geometry overlays", async () => {
  const draft = await blockForgeFixture();
  const family = draft.componentFamilies.find((candidate) => candidate.id === "primary-action");
  assert.match(stateSheetSvg(family), /data-review-surface="state-comparison"/);
  assert.match(stateSheetSvg(family), /primary-action-disabled/);
  assert.match(slicingPreviewSvg(family), /id="slicing-guides"/);
  assert.match(reviewScreenSvg(draft, { overlays: true }), /data-review-overlays="true"/);
  assert.match(reviewScreenSvg(draft, { overlays: true }), /canvas-safe-area/);
  assert.match(reviewScreenSvg(draft, { overlays: true }), /puzzle-board-constraint-guides/);
  assert.match(reviewScreenSvg(draft, { overlays: true }), /bridge-constraint-guides/);
});

test("approval receipts are immutable inputs and reject stale sources", async () => {
  const draft = await blockForgeFixture();
  const references = [{ id: "puzzle", sha256: "a".repeat(64), version: "1.0.0" }];
  const receipt = createApprovalReceipt({
    draft,
    draftSha256: "b".repeat(64),
    job: { schemaVersion: 2, projectId: "block-forge", jobId: draft.jobId },
    reviewer: "Art Lead",
    referenceHashes: references,
    reviewManifestSha256: "c".repeat(64),
    approvedAt: "2026-07-30T00:00:00.000Z"
  });
  assert.equal(receipt.policy.autonomousApproval, false);
  assert.equal(validateApprovalFreshness({
    receipt,
    draftSha256: "b".repeat(64),
    referenceHashes: references,
    reviewManifestSha256: "c".repeat(64)
  }), receipt);
  assert.throws(() => validateApprovalFreshness({
    receipt,
    draftSha256: "d".repeat(64),
    referenceHashes: references,
    reviewManifestSha256: "c".repeat(64)
  }), /draft hash changed/);
  assert.throws(() => validateApprovalFreshness({
    receipt,
    draftSha256: "b".repeat(64),
    referenceHashes: [{ ...references[0], sha256: "e".repeat(64) }],
    reviewManifestSha256: "c".repeat(64)
  }), /reference hash changed/);
});

test("project audit classifies blocking, recommended, intentional, and human findings", async () => {
  const base = await blockForgeFixture();
  const project = createProjectManifest({ projectId: "block-forge", displayName: "Block Forge" });
  project.visualTokens.background = "#18120d";
  project.componentInventory.push({ id: "shared-clock", version: "1.0.0", status: "approved" });
  project.jobs.push(
    { id: "block-forge-puzzle-board", referenceIds: ["puzzle"], status: "draft" },
    { id: "block-forge-town", referenceIds: ["town"], status: "draft" },
    { id: "block-forge-workshop", referenceIds: ["workshop"], status: "draft" }
  );
  const drift = structuredClone(base);
  drift.jobId = "block-forge-town";
  drift.tokens.background = "#000000";
  drift.componentFamilies.find((family) => family.id === "bridge").baseLayers[0].fill = "#ffffff";
  const intentional = structuredClone(base);
  intentional.jobId = "block-forge-workshop";
  intentional.tokens.background = "#302010";
  intentional.intentionalVariations = [{ token: "background", note: "Workshop heat treatment." }];
  intentional.unresolved = [{ id: "clock-symbol", componentId: "shared-clock", question: "Confirm clock symbol weight." }];
  const report = auditProjectDrafts(project, [base, drift, intentional]);
  const classes = new Set(report.findings.map((finding) => finding.classification));
  assert.ok(classes.has("blocking-inconsistency"));
  assert.ok(classes.has("recommended-correction"));
  assert.ok(classes.has("acceptable-intentional-variation"));
  assert.ok(classes.has("unresolved-human-decision"));
  assert.ok(report.findings.every((finding) => "projectId" in finding && "jobId" in finding && "supportingReference" in finding));
});

test("file locks refuse simultaneous edits and release after completion", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "lnh-prism-lock-"));
  const lock = path.join(root, "job.lock");
  try {
    await withFileLock(lock, async () => {
      await assert.rejects(withFileLock(lock, async () => {}), /Concurrent operation refused/);
    });
    await withFileLock(lock, async () => {});
    await writeFile(lock, `${JSON.stringify({ pid: 2147483647, acquiredAt: "2000-01-01T00:00:00.000Z" })}\n`);
    await withFileLock(lock, async () => {});
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("interrupted directory replacement preserves the prior complete build", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "lnh-prism-build-"));
  const target = path.join(root, "build-output");
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "manifest.json"), "old\n");
  try {
    await assert.rejects(atomicReplaceDirectory(target, async (staging) => {
      await writeFile(path.join(staging, "manifest.json"), "partial\n");
      throw new Error("simulated interruption");
    }), /simulated interruption/);
    assert.equal(await readFile(path.join(target, "manifest.json"), "utf8"), "old\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
