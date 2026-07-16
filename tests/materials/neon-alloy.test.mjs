import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { preflightNeonAlloySource, renderMaskedNeonAlloyLayer, renderNeonAlloyIsolationSvg, validateMaterialNormalization } from "../../dist/materials/neon-alloy.js";

const root = new URL("../../", import.meta.url);
const sourcePaths = ["materials/neon-alloy/alloy-grain.json", "materials/neon-alloy/alloy-circuit-pattern.json", "materials/neon-alloy/alloy-holo-accent.json"];
const pack = JSON.parse(await readFile(new URL("specs/examples/neon-alloy-materials.json", root), "utf8"));

test("Neon Alloy sources pass deterministic preflight and match their declared hashes", async () => {
  for (const path of sourcePaths) {
    const content = await readFile(new URL(path, root), "utf8");
    const source = JSON.parse(content);
    preflightNeonAlloySource(source);
    const declared = pack.sources.find(({ id }) => id === source.id);
    assert.ok(declared, `missing source declaration for ${source.id}`);
    assert.equal(createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex"), declared.sha256);
  }
});

test("Neon Alloy preflight rejects seams, component geometry, bad alpha, and non-sRGB sources", () => {
  const tile = { id: "test-tile", kind: "procedural-tile", colorSpace: "sRGB", alpha: { minimum: 0, maximum: 0.1 }, contrast: 1, rights: "test", containsComponentGeometry: false, tile: { width: 32, height: 32, units: "logical-pixels" }, edgeSignature: { top: "a", bottom: "a", left: "b", right: "b" } };
  preflightNeonAlloySource(tile);
  assert.throws(() => preflightNeonAlloySource({ ...tile, edgeSignature: { ...tile.edgeSignature, bottom: "mismatch" } }), /tile-safe/);
  assert.throws(() => preflightNeonAlloySource({ ...tile, containsComponentGeometry: true }), /component geometry/);
  assert.throws(() => preflightNeonAlloySource({ ...tile, alpha: { minimum: 0, maximum: 0.31 } }), /alpha/);
  assert.throws(() => preflightNeonAlloySource({ ...tile, colorSpace: "Display-P3" }), /sRGB/);
});

test("normalization is bounded and isolated/masked SVGs remain deterministic", () => {
  validateMaterialNormalization({ scale: 0.5, offsetX: 1, offsetY: 0, contrast: 1.5, saturation: 1.5 });
  assert.throws(() => validateMaterialNormalization({ scale: 4.1 }), /scale/);
  assert.throws(() => validateMaterialNormalization({ saturation: -0.01 }), /saturation/);
  const isolation = renderNeonAlloyIsolationSvg("alloy-circuit-pattern", { scale: 1, offsetX: 0, offsetY: 0 });
  assert.equal(isolation, renderNeonAlloyIsolationSvg("alloy-circuit-pattern", { scale: 1, offsetX: 0, offsetY: 0 }));
  assert.match(isolation, /id="material-alloy-circuit-pattern-isolation"/);
  assert.match(isolation, /clip-path="url\(#material-isolation-mask\)"/);
  const masked = renderMaskedNeonAlloyLayer("alloy-grain", "surface-mask", 160, 56);
  assert.match(masked, /id="layer-alloy-grain"/);
  assert.match(masked, /clip-path="url\(#surface-mask\)"/);
});
