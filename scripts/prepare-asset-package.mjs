import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const sourceDir = path.join(root, "docs", "validation", "evidence", "m3-s4-frostbound-reconstruction", "matrix");
const packageDir = path.join(root, "assets", "frostbound-reward");
const modulesDir = path.join(packageDir, "modules");

const componentFor = (stem) => {
  if (stem.startsWith("primary-button-")) return "primary-button";
  if (stem.startsWith("secondary-button-")) return "secondary-button";
  if (stem.startsWith("progress-") || stem.startsWith("progress-")) return "progress";
  if (stem.startsWith("panel-")) return "panel";
  if (stem.startsWith("emblem-")) return "emblem";
  throw new Error(`Unrecognized asset stem: ${stem}`);
};

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

const sourceFiles = (await fs.readdir(sourceDir))
  .filter((file) => /\.(svg|png)$/i.test(file))
  .sort((a, b) => a.localeCompare(b));

await fs.rm(packageDir, { recursive: true, force: true });
await fs.mkdir(modulesDir, { recursive: true });

const files = [];
for (const file of sourceFiles) {
  const stem = path.basename(file, path.extname(file));
  const component = componentFor(stem);
  const destinationDir = path.join(modulesDir, component);
  await fs.mkdir(destinationDir, { recursive: true });
  const bytes = await fs.readFile(path.join(sourceDir, file));
  await fs.writeFile(path.join(destinationDir, file), bytes);
  files.push({
    assetId: `lnh-prism:asset:frostbound-reward:${stem}:${path.extname(file).slice(1)}`,
    component,
    source: `docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix/${file}`,
    path: `assets/frostbound-reward/modules/${component}/${file}`,
    format: path.extname(file).slice(1),
    bytes: bytes.length,
    sha256: sha256(bytes)
  });
}

const manifest = {
  schemaVersion: "1.0",
  packageId: "frostbound-reward-assets",
  packageVersion: "1.0.0",
  styleId: "frostbound-reward",
  sourceEvidence: "m3-s4-frostbound-reconstruction",
  components: ["panel", "primary-button", "secondary-button", "progress", "emblem"],
  modules: files,
  usage: {
    svg: "Use SVG files when editable layers and content slots are required.",
    png: "Use matching PNG files as deterministic raster derivatives.",
    progress: "Progress frame and fill are separate modules; compose them at the target width and value.",
    extraction: "Copy any component directory independently; each file is self-describing through this manifest."
  }
};

await fs.writeFile(path.join(packageDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const readme = [
  "# Frostbound Reward Asset Package",
  "",
  "Engine-neutral modular handoff for the approved Frostbound component family.",
  "",
  "- Read [manifest.json](manifest.json) for stable IDs, source receipts, and hashes.",
  "- Copy any directory under [modules](modules) independently.",
  "- SVG is the editable deterministic source; PNG is the matching raster derivative.",
  "- Progress frame and fill are intentionally separate modules.",
  "",
  "Source evidence: `docs/validation/evidence/m3-s4-frostbound-reconstruction/matrix`."
].join("\\n") + "\\n";
await fs.writeFile(path.join(packageDir, "README.md"), readme);

console.log(`prepared ${files.length} modular asset files in ${path.relative(root, packageDir)}`);
