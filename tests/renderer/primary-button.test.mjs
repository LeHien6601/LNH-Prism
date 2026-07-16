import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { BUTTON_STATES, BUTTON_WIDTH_BOUNDS, BUTTON_WIDTHS_LOGICAL, RENDERER_VERSION, renderPrimaryButton, renderPrimaryButtonSvg, writePrimaryButtonProof } from "../../dist/renderer/primary-button.js";

const hash = (content) => createHash("sha256").update(content).digest("hex");
const exportManifestSchema = JSON.parse(await readFile(new URL("../../specs/schemas/export-manifest.schema.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: true });
addFormats(ajv);
const validateManifest = ajv.compile(exportManifestSchema);

test("Primary Button SVG keeps V1 visual effects as independent named layers", () => {
  const svg = renderPrimaryButtonSvg({ logicalWidth: 160, state: "normal" });
  for (const layer of ["shadow", "fill", "border", "highlight", "content-slot"]) {
    assert.match(svg, new RegExp(`id=\\"layer-${layer}\\"`));
  }
  assert.match(svg, /data-slot="editable-label"/);
  assert.doesNotMatch(svg, /<filter/);
});

test("Primary Button uses a connected state-aware extrusion instead of a shifted duplicate silhouette", () => {
  for (const [state, surfaceY, depth] of [["normal", 1, 4], ["pressed", 3, 2], ["disabled", 1, 4]]) {
    const svg = renderPrimaryButtonSvg({ logicalWidth: 160, state });
    assert.match(svg, new RegExp(`id="layer-shadow" data-layer="shadow" data-effect="connected-extrusion" data-depth="${depth}"`));
    assert.match(svg, new RegExp(`data-role="extrusion-body" x="1" y="${surfaceY}" width="158" height="${50 + depth}" rx="23"`));
    assert.match(svg, new RegExp(`id="layer-fill" data-layer="fill">\\s*<rect x="1" y="${surfaceY}" width="158" height="50" rx="23"`));
  }
});

test("Primary Button shared SVG recipe supports only bounded integer widths", () => {
  for (const logicalWidth of [BUTTON_WIDTH_BOUNDS.min, 200, BUTTON_WIDTH_BOUNDS.max]) {
    assert.match(renderPrimaryButtonSvg({ logicalWidth, state: "normal" }), new RegExp(`viewBox="0 0 ${logicalWidth} 56"`));
  }
  for (const logicalWidth of [159, 200.5, 241]) {
    assert.throws(() => renderPrimaryButtonSvg({ logicalWidth, state: "normal" }), RangeError);
  }
});

test("Primary Button PNG output is deterministic for pinned inputs", () => {
  const first = renderPrimaryButton({ logicalWidth: 160, state: "normal" });
  const second = renderPrimaryButton({ logicalWidth: 160, state: "normal" });
  assert.deepEqual(first.png, second.png);
  assert.equal(hash(first.png), hash(second.png));
});

test("Primary Button proof emits both V1 sizes, states, and traceable manifests", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "lnh-prism-primary-button-"));
  try {
    const manifests = await writePrimaryButtonProof(outputRoot);
    assert.equal(manifests.length, BUTTON_WIDTHS_LOGICAL.length * BUTTON_STATES.length);

    for (const manifest of manifests) {
      assert.equal(validateManifest(manifest), true, JSON.stringify(validateManifest.errors));
      assert.equal(manifest.renderer.version, RENDERER_VERSION);
      assert.equal(manifest.outputs.length, 2);
      const png = manifest.outputs.find((output) => output.format === "png");
      const svg = manifest.outputs.find((output) => output.format === "svg");
      assert.ok(png);
      assert.ok(svg);
      assert.equal(png.width, svg.width);
      assert.equal(png.height, svg.height);
      assert.equal(png.unity.border.left, 48);
      const pngContent = await readFile(join(outputRoot, png.path));
      assert.equal(hash(pngContent), png.sha256);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
