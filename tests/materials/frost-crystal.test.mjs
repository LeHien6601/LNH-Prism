import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  assertFourComponentReuse,
  frostCrystalReusePlan,
  preflightFrostCrystalSource,
  renderFrostCrystalIsolationSvg,
  validateFrostCrystalNormalization
} from "../../dist/materials/frost-crystal.js";

const root = new URL("../../", import.meta.url);
const conceptHash = "19d55d8ed0d1a2b8949bcd135ecd95ad2d0b5920846a843b652949eb02712383";
const pack = JSON.parse(await readFile(new URL("specs/examples/frost-crystal-materials.draft.json", root), "utf8"));

test("Frost Crystal sources pass preflight, match hashes, and contain no concept pixels", async () => {
  for (const declaration of pack.sources) {
    const content = await readFile(new URL(declaration.path, root), "utf8");
    const source = JSON.parse(content);
    preflightFrostCrystalSource(source);
    assert.equal(createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex"), declaration.sha256);
    assert.equal(source.containsConceptPixels, false);
    assert.equal(source.containsComponentGeometry, false);
    assert.equal(source.containsComponentEffects, false);
    assert.doesNotMatch(content, new RegExp(conceptHash));
    assert.doesNotMatch(content, /v3-frostbound-reward-concept\.png/);
  }
});

test("Frost Crystal preflight rejects pixel leakage, component effects, seams, and incomplete provenance", () => {
  const tile = {
    schemaVersion: "1.0", id: "frost-grain", version: "0.1.0", sourceType: "procedural", kind: "procedural-tile",
    generationSettings: "fixed recipe", colorSpace: "sRGB", resolution: { width: 32, height: 32, units: "logical-pixels" },
    alpha: { minimum: 0, maximum: 0.12 }, contrast: 0.85, transparentBackground: true,
    edgeSignature: { top: "a", bottom: "a", left: "b", right: "b" }, containsConceptPixels: false,
    containsComponentGeometry: false, containsComponentEffects: false, rights: "internal"
  };
  preflightFrostCrystalSource(tile);
  assert.throws(() => preflightFrostCrystalSource({ ...tile, containsConceptPixels: true }), /concept pixels/);
  assert.throws(() => preflightFrostCrystalSource({ ...tile, containsComponentEffects: true }), /component geometry or component-specific effects/);
  assert.throws(() => preflightFrostCrystalSource({ ...tile, edgeSignature: { ...tile.edgeSignature, bottom: "x" } }), /tile-safe/);
  assert.throws(() => preflightFrostCrystalSource({ ...tile, generationSettings: "" }), /generation settings/);
  assert.throws(() => preflightFrostCrystalSource({ ...tile, sourceType: "ai-generated", generationSettings: undefined }), /prompt\/settings/);
});

test("Frost Crystal normalization, previews, and four-type reuse are deterministic and bounded", () => {
  validateFrostCrystalNormalization({ scale: 0.5, offsetX: 1, offsetY: 0, contrast: 1.5, saturation: 1.5, opacity: 0.3 });
  assert.throws(() => validateFrostCrystalNormalization({ opacity: 0.31 }), /opacity/);
  assert.throws(() => validateFrostCrystalNormalization({ scale: Number.NaN }), /scale/);
  for (const sourceId of ["frost-grain", "crystal-facet-pattern", "rune-ornament"]) {
    const preview = renderFrostCrystalIsolationSvg(sourceId);
    assert.equal(preview, renderFrostCrystalIsolationSvg(sourceId));
    assert.match(preview, new RegExp(`data-material-source="${sourceId}"`));
    assert.match(preview, /clip-path="url\(#frost-isolation-mask\)"/);
  }
  assertFourComponentReuse(frostCrystalReusePlan);
  assert.equal(new Set(frostCrystalReusePlan.map(({ componentType }) => componentType)).size, 4);
  assert.throws(() => assertFourComponentReuse(frostCrystalReusePlan.slice(0, 3)), /reward-emblem-container/);
});
