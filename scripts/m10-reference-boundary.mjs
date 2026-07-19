import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const hash = value => createHash("sha256").update(value).digest("hex");

async function filesUnder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesUnder(resolve(path, entry.name))
    : [resolve(path, entry.name)]))).flat();
}

export async function validateM10ReferenceBoundary({ root = resolve(".") } = {}) {
  const referenceDir = resolve(root, "docs/reference-briefs/assets");
  const receipt = JSON.parse(await readFile(resolve(referenceDir, "m10-volcanic-forge-review-reference-1080x1920.receipt.json"), "utf8"));
  const referencePath = resolve(referenceDir, receipt.file);
  const referenceBytes = await readFile(referencePath);
  if (hash(referenceBytes) !== receipt.sha256 || referenceBytes.length !== receipt.bytes || receipt.status !== "review-only") throw Error("M10 review reference receipt is invalid");
  const productionFiles = (await filesUnder(resolve(root, "assets"))).filter(path => /\.(svg|png)$/iu.test(path));
  const leaks = [];
  for (const path of productionFiles) {
    const bytes = await readFile(path);
    if (path.endsWith(".png") && hash(bytes) === receipt.sha256) leaks.push(path);
    if (path.endsWith(".svg")) {
      const svg = bytes.toString("utf8");
      if (svg.includes(basename(referencePath)) || svg.includes(receipt.sha256) || /<image\b/iu.test(svg)) leaks.push(path);
    }
  }
  if (leaks.length) throw Error(`M10 review reference leaked into production assets: ${leaks.join(", ")}`);
  return { productionFileCount: productionFiles.length, referenceSha256: receipt.sha256 };
}
