import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const evidence = resolve(root, "docs/validation/evidence/m11-enchanted-forest");
const packageDir = resolve(root, "assets/m11-enchanted-forest");
const matrix = JSON.parse(await readFile(resolve(evidence, "matrix.json"), "utf8"));
const hash = value => createHash("sha256").update(value).digest("hex");
const write = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);

if (matrix.count !== 26 || matrix.entries.length !== 26) throw new Error("M11 package requires the complete 26-entry rendered matrix.");
await rm(packageDir, { recursive: true, force: true });
await mkdir(resolve(packageDir, "modules"), { recursive: true });
const modules = [];
for (const entry of matrix.entries) for (const format of ["svg", "png"]) {
  const name = `${entry.name}.${format}`;
  const source = `docs/validation/evidence/m11-enchanted-forest/matrix/${name}`;
  const path = `assets/m11-enchanted-forest/modules/${entry.component}/${name}`;
  await mkdir(resolve(packageDir, "modules", entry.component), { recursive: true });
  await cp(resolve(root, source), resolve(root, path));
  const bytes = await readFile(resolve(root, path));
  modules.push({ assetId: `lnh-prism:asset:m11-enchanted-forest:${entry.name}:${format}`, component: entry.component, source, path, format, bytes: bytes.length, sha256: hash(bytes) });
}
await write(resolve(packageDir, "manifest.json"), {
  schemaVersion: "1.0", packageId: "m11-enchanted-forest-assets", packageVersion: "0.1.0", styleId: "m11-enchanted-forest", styleVersion: "0.1.0",
  components: ["panel", "primary-hex-button", "secondary-hex-button", "progress", "tab", "badge", "icon-container"], modules,
  provenance: {
    style: "specs/examples/style-m11-enchanted-forest.json",
    materials: "specs/examples/m11-enchanted-forest-materials.json",
    edgeStacks: "specs/examples/m11-enchanted-forest-edge-stacks.json",
    materialResponses: "specs/examples/m11-enchanted-forest-material-responses.json",
    variation: "specs/examples/m11-enchanted-forest-variation.json",
    ornaments: "specs/examples/m11-enchanted-forest-ornament-anchors.json",
    focal: "specs/examples/m11-enchanted-forest-focal-objects.json",
    bindings: "src/styles/m11-enchanted-forest-binding.ts",
    renderer: "src/renderer/style-composition.ts"
  }
});
console.log(`Prepared ${modules.length} M11 Enchanted Forest modules.`);
