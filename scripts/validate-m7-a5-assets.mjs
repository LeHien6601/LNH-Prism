import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const evidence = resolve(root, "docs/validation/evidence/m7-a5-reference-fidelity");
const packageDir = resolve(root, "assets/m7-reference-fidelity");
const matrix = JSON.parse(await readFile(resolve(evidence, "matrix.json"), "utf8"));
const manifest = JSON.parse(await readFile(resolve(packageDir, "manifest.json"), "utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
if (matrix.count !== 26 || matrix.entries.length !== 26) throw new Error("M7 matrix must contain 26 required state/size/value renders.");
for (const entry of matrix.entries) {
  const svg = await readFile(resolve(evidence, "matrix", `${entry.name}.svg`));
  const png = await readFile(resolve(evidence, "matrix", `${entry.name}.png`));
  if (sha256(svg) !== entry.svgSha256 || sha256(png) !== entry.pngSha256) throw new Error(`M7 matrix receipt drift: ${entry.name}`);
  if (svg.includes("<image") || /unity|engine/i.test(svg.toString())) throw new Error(`M7 production SVG boundary failure: ${entry.name}`);
}
for (const width of [344, 420]) {
  await access(resolve(evidence, "matrix", `progress-frame-${width}.svg`));
  for (const percent of [10, 50, 90]) await access(resolve(evidence, "matrix", `progress-fill-${width}-${percent}.svg`));
}
await access(resolve(evidence, "m7-angular-reward-composition.svg"));
await access(resolve(evidence, "m7-angular-reward-composition.png"));
const showroom = await readFile(resolve(root, "showcase/m7-reference-fidelity.html"), "utf8");
for (const required of ["M7 Angular Reference-Fidelity Showroom", "m7-angular-reward-composition.png", "primary-hex-button-320x68-normal.png", "progress-420x28-90.png", "assets/m7-reference-fidelity"]) if (!showroom.includes(required)) throw new Error(`M7 showroom is missing ${required}.`);
if (manifest.styleId !== "m7-reference-fidelity" || manifest.components.length !== 7 || manifest.modules.length !== 68) throw new Error("M7 modular package manifest is incomplete.");
const ids = new Set();
for (const module of manifest.modules) {
  if (!/^lnh-prism:asset:m7-reference-fidelity:[a-z0-9-]+:(svg|png)$/.test(module.assetId) || ids.has(module.assetId)) throw new Error(`Invalid or duplicate M7 asset ID: ${module.assetId}`);
  ids.add(module.assetId);
  const bytes = await readFile(resolve(root, module.path));
  if (bytes.length !== module.bytes || sha256(bytes) !== module.sha256) throw new Error(`M7 package receipt mismatch: ${module.path}`);
}
console.log(`validated ${matrix.count} M7 matrix entries, portrait/showroom views, and ${manifest.modules.length} modular assets`);
