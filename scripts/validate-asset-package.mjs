import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const packageDir = path.join(root, "assets", "frostbound-reward");
const manifest = JSON.parse(await fs.readFile(path.join(packageDir, "manifest.json"), "utf8"));
if (manifest.schemaVersion !== "1.0") throw new Error("unsupported asset package schema");
if (manifest.modules.length !== 62) throw new Error(`expected 62 modules, found ${manifest.modules.length}`);

const counts = new Map();
const ids = new Set();
for (const entry of manifest.modules) {
  if (!/^lnh-prism:asset:frostbound-reward:[a-z0-9-]+:(svg|png)$/.test(entry.assetId)) throw new Error(`invalid stable ID: ${entry.assetId}`);
  if (ids.has(entry.assetId)) throw new Error(`duplicate stable ID: ${entry.assetId}`);
  ids.add(entry.assetId);
  const fullPath = path.join(root, entry.path);
  const bytes = await fs.readFile(fullPath);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (bytes.length !== entry.bytes || hash !== entry.sha256) throw new Error(`receipt mismatch: ${entry.path}`);
  counts.set(entry.component, (counts.get(entry.component) ?? 0) + 1);
}
for (const component of manifest.components) if (!counts.has(component)) throw new Error(`missing component: ${component}`);
if (!counts.has("progress") || manifest.modules.filter((entry) => entry.component === "progress").length !== 26) throw new Error("progress frame/fill matrix is incomplete");
console.log(`validated ${manifest.modules.length} modular asset files across ${counts.size} components`);
