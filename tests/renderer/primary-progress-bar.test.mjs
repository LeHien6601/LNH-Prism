import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  PROGRESS_HEIGHT_LOGICAL,
  FRAME_EXTRUSION_DEPTH_LOGICAL,
  PROGRESS_PERCENTAGES,
  PROGRESS_WIDTHS_LOGICAL,
  getProgressFillGeometry,
  renderPrimaryProgressBarPng,
  renderPrimaryProgressBarSvg,
  renderProgressFillSvg,
  renderProgressFrameSvg,
  writePrimaryProgressBarProof
} from "../../dist/renderer/primary-progress-bar.js";

const hash = (content) => createHash("sha256").update(content).digest("hex");
const schema = JSON.parse(await readFile(new URL("../../specs/schemas/export-manifest.schema.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: true });
addFormats(ajv);
const validateManifest = ajv.compile(schema);

test("Progress Bar frame and fill remain separate renderable SVG parts", () => {
  const frame = renderProgressFrameSvg(320);
  const fill = renderProgressFillSvg({ logicalWidth: 320, percent: 50 });
  const preview = renderPrimaryProgressBarSvg({ logicalWidth: 320, percent: 50 });
  assert.match(frame, /id="part-frame"/);
  assert.doesNotMatch(frame, /id="layer-progress-fill"/);
  assert.match(fill, /id="part-fill"/);
  assert.doesNotMatch(fill, /id="layer-frame-border"/);
  assert.match(preview, /id="part-frame"/);
  assert.match(preview, /id="part-fill"/);
  assert.match(fill, /clip-path="url\(#progress-inner-clip\)"/);
});

test("Progress frame uses a connected extrusion body rather than an offset frame silhouette", () => {
  for (const logicalWidth of PROGRESS_WIDTHS_LOGICAL) {
    const frame = renderProgressFrameSvg(logicalWidth);
    assert.match(frame, new RegExp(`id="layer-frame-shadow" data-layer="shadow" data-effect="connected-extrusion" data-depth="${FRAME_EXTRUSION_DEPTH_LOGICAL}"`));
    assert.match(frame, new RegExp(`data-role="extrusion-body" x="1" y="1" width="${logicalWidth - 2}" height="22" rx="10"`));
    assert.match(frame, new RegExp(`id="layer-frame-fill" data-layer="fill">\\s*<rect x="1" y="1" width="${logicalWidth - 2}" height="20" rx="10"`));
  }
});

test("Progress Bar fill geometry is readable and bounded at all V1 percentages", () => {
  for (const logicalWidth of PROGRESS_WIDTHS_LOGICAL) {
    const innerWidth = logicalWidth - 10;
    for (const percent of PROGRESS_PERCENTAGES) {
      const geometry = getProgressFillGeometry({ logicalWidth, percent });
      assert.equal(geometry.width, (innerWidth * percent) / 100);
      assert.ok(geometry.width >= geometry.height, "10% fill must remain visually readable");
      assert.ok(geometry.x + geometry.width <= logicalWidth - 5, "fill must stay within the inner frame");
    }
  }
});

test("Progress Bar highlight is clipped to the rounded fill silhouette", () => {
  for (const logicalWidth of PROGRESS_WIDTHS_LOGICAL) {
    for (const percent of PROGRESS_PERCENTAGES) {
      const fill = renderProgressFillSvg({ logicalWidth, percent });
      const geometry = getProgressFillGeometry({ logicalWidth, percent });
      assert.match(fill, new RegExp(`<clipPath id="progress-fill-shape-clip">\\s*<rect x="${geometry.x}" y="${geometry.y}" width="${geometry.width}" height="${geometry.height}" rx="${geometry.radius}"/>`));
      assert.match(fill, /id="layer-progress-highlight" data-layer="highlight" clip-path="url\(#progress-fill-shape-clip\)"/);
    }
  }
});

test("Progress Bar PNG output is deterministic for pinned inputs", () => {
  const request = { logicalWidth: 320, percent: 50 };
  const first = renderPrimaryProgressBarPng(request);
  const second = renderPrimaryProgressBarPng(request);
  assert.deepEqual(first, second);
  assert.equal(hash(first), hash(second));
});

test("Progress Bar proof emits two widths and all inspection outputs with valid manifests", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "lnh-prism-primary-progress-bar-"));
  try {
    const manifests = await writePrimaryProgressBarProof(outputRoot);
    assert.equal(manifests.length, PROGRESS_WIDTHS_LOGICAL.length);
    for (const manifest of manifests) {
      assert.equal(validateManifest(manifest), true, JSON.stringify(validateManifest.errors));
      assert.equal(manifest.outputs.length, 14);
      assert.equal(new Set(manifest.outputs.map((output) => output.path)).size, 14);
      for (const output of manifest.outputs) {
        assert.equal(output.height, PROGRESS_HEIGHT_LOGICAL * 2);
        assert.equal(hash(await readFile(join(outputRoot, output.path))), output.sha256);
      }
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
