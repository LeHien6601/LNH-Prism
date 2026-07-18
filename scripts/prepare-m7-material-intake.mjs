import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { m7FacetedReusePlan, preflightM7FacetedSource, renderM7FacetedIsolationSvg } from "../dist/materials/m7-faceted.js";

const output = resolve("docs/validation/evidence/m7-a4-faceted-material-intake");
const packPath = resolve("specs/examples/m7-faceted-materials.json");
const pack = JSON.parse(await readFile(packPath, "utf8"));
const sha256 = (content) => createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex");
await mkdir(output, { recursive: true });

const sources = [];
for (const declaration of pack.sources) {
  const content = await readFile(resolve(declaration.path), "utf8");
  const source = JSON.parse(content);
  preflightM7FacetedSource(source);
  const hash = sha256(content);
  if (hash !== declaration.sha256) throw new Error(`${declaration.id} hash mismatch.`);
  sources.push({ sourceId: declaration.id, path: declaration.path, sha256: hash, sourceType: source.sourceType, status: "pass", boundaries: { containsReferencePixels: source.containsReferencePixels, containsComponentGeometry: source.containsComponentGeometry, containsComponentEffects: source.containsComponentEffects } });
  await writeFile(resolve(output, `${declaration.id}-isolation.svg`), renderM7FacetedIsolationSvg(declaration.id), "utf8");
}
await writeFile(resolve(output, "preflight.json"), `${JSON.stringify({ schemaVersion: "1.0", id: "m7-faceted-source-preflight", version: "0.1.0", status: "pass", materialPack: "m7-faceted-materials@0.1.0", sources }, null, 2)}\n`);
await writeFile(resolve(output, "reuse-plan.json"), `${JSON.stringify({ schemaVersion: "1.0", id: "m7-seven-component-reuse-plan", version: "0.1.0", status: "approved", componentTypeCount: m7FacetedReusePlan.length, bindings: m7FacetedReusePlan }, null, 2)}\n`);
await writeFile(resolve(output, "evidence-index.json"), `${JSON.stringify({ schemaVersion: "1.0", id: "m7-a4-faceted-material-intake", version: "0.1.0", status: "approved-for-m7-a5", files: ["preflight.json", "reuse-plan.json", ...pack.sources.map(({ id }) => `${id}-isolation.svg`)], boundary: "No reference pixels, component geometry, or component-specific effects are permitted in M7 material sources." }, null, 2)}\n`);
