import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { PANEL_HEIGHTS_LOGICAL, PANEL_WIDTH_LOGICAL, renderPrimaryPanel, renderPrimaryPanelSvg, writePrimaryPanelProof } from "../../dist/renderer/primary-panel.js";

const hash = (content) => createHash("sha256").update(content).digest("hex");
const schema = JSON.parse(await readFile(new URL("../../specs/schemas/export-manifest.schema.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: true });
addFormats(ajv);
const validateManifest = ajv.compile(schema);

test("Primary Panel SVG keeps all V1 effects as independent named layers", () => {
  const svg = renderPrimaryPanelSvg({ logicalHeight: 240 });
  for (const layer of ["shadow", "fill", "grain", "border", "highlight", "content-slot"]) {
    assert.match(svg, new RegExp(`id=\\"layer-${layer}\\"`));
  }
  assert.match(svg, /patternUnits="userSpaceOnUse"/);
  assert.match(svg, /data-slot="editable-content"/);
  assert.doesNotMatch(svg, /<filter/);
});

test("Primary Panel preserves fixed corners and highlight depth at both heights", () => {
  const baseline = renderPrimaryPanelSvg({ logicalHeight: 240 });
  const tall = renderPrimaryPanelSvg({ logicalHeight: 360 });
  for (const svg of [baseline, tall]) {
    assert.match(svg, /width="864"/);
    assert.match(svg, /rx="23"/);
    assert.match(svg, /height="44" rx="21"/);
  }
  assert.match(baseline, /data-height="184"/);
  assert.match(tall, /data-height="304"/);
});

test("Primary Panel PNG output is deterministic for pinned inputs", () => {
  const first = renderPrimaryPanel({ logicalHeight: 240 });
  const second = renderPrimaryPanel({ logicalHeight: 240 });
  assert.deepEqual(first.png, second.png);
  assert.equal(hash(first.png), hash(second.png));
});

test("Primary Panel proof emits both sizes with valid traceable manifests", async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), "lnh-prism-primary-panel-"));
  try {
    const manifests = await writePrimaryPanelProof(outputRoot);
    assert.equal(manifests.length, PANEL_HEIGHTS_LOGICAL.length);
    for (const manifest of manifests) {
      assert.equal(validateManifest(manifest), true, JSON.stringify(validateManifest.errors));
      assert.equal(manifest.outputs.length, 2);
      const png = manifest.outputs.find((output) => output.format === "png");
      const svg = manifest.outputs.find((output) => output.format === "svg");
      assert.ok(png);
      assert.ok(svg);
      assert.equal(png.width, PANEL_WIDTH_LOGICAL * 2);
      assert.equal(png.height, svg.height);
      assert.equal(png.unity.border.top, 48);
      assert.equal(hash(await readFile(join(outputRoot, png.path))), png.sha256);
    }
  } finally {
    await rm(outputRoot, { recursive: true, force: true });
  }
});
