import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertM7FacetedReuse, m7FacetedReusePlan, preflightM7FacetedSource, renderM7FacetedIsolationSvg } from "../../dist/materials/m7-faceted.js";

const root = new URL("../../", import.meta.url);
const pack = JSON.parse(await readFile(new URL("specs/examples/m7-faceted-materials.json", root), "utf8"));

test("M7 faceted sources pass preflight, hashes, and reference-pixel boundary", async () => {
  for (const declaration of pack.sources) {
    const content = await readFile(new URL(declaration.path, root), "utf8");
    const source = JSON.parse(content);
    preflightM7FacetedSource(source);
    assert.equal(createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex"), declaration.sha256);
    assert.equal(source.containsReferencePixels, false);
    assert.equal(source.containsComponentGeometry, false);
    assert.equal(source.containsComponentEffects, false);
  }
});

test("M7 preflight rejects leakage, baked effects, and tile seams", () => {
  const source = { schemaVersion: "1.0", id: "m7-faceted-grain", version: "0.1.0", sourceType: "procedural", kind: "procedural-tile", generationSettings: "fixed", colorSpace: "sRGB", resolution: { width: 32, height: 32, units: "logical-pixels" }, alpha: { minimum: 0, maximum: 0.1 }, contrast: 1, transparentBackground: true, edgeSignature: { top: "a", bottom: "a", left: "b", right: "b" }, containsReferencePixels: false, containsComponentGeometry: false, containsComponentEffects: false, rights: "internal" };
  preflightM7FacetedSource(source);
  assert.throws(() => preflightM7FacetedSource({ ...source, containsReferencePixels: true }), /reference pixels/);
  assert.throws(() => preflightM7FacetedSource({ ...source, containsComponentEffects: true }), /component geometry/);
  assert.throws(() => preflightM7FacetedSource({ ...source, edgeSignature: { ...source.edgeSignature, bottom: "x" } }), /tile-safe/);
});

test("M7 isolation views and seven-component reuse are deterministic", () => {
  for (const id of ["m7-faceted-grain", "m7-angular-plate-pattern", "m7-energy-edge-accent", "m7-ornament-marks"]) {
    const view = renderM7FacetedIsolationSvg(id);
    assert.equal(view, renderM7FacetedIsolationSvg(id));
    assert.match(view, new RegExp(`data-material-source="${id}"`));
    assert.match(view, /clip-path="url\(#m7-mask\)"/);
  }
  assertM7FacetedReuse(m7FacetedReusePlan);
  assert.equal(m7FacetedReusePlan.length, 7);
  assert.throws(() => assertM7FacetedReuse(m7FacetedReusePlan.slice(0, 6)), /icon-container/);
});
