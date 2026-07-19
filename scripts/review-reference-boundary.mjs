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

export async function validateRegisteredReviewReferenceBoundary({ root = resolve("."), referenceIds } = {}) {
  const referenceDir = resolve(root, "docs/reference-briefs/assets");
  const receiptPaths = (await filesUnder(referenceDir)).filter(path => path.endsWith(".receipt.json"));
  const references = [];
  for (const path of receiptPaths) {
    const receipt = JSON.parse(await readFile(path, "utf8"));
    if (receipt.status !== "review-only" || (referenceIds && !referenceIds.includes(receipt.referenceId))) continue;
    const referencePath = resolve(referenceDir, receipt.file);
    const referenceBytes = await readFile(referencePath);
    if (hash(referenceBytes) !== receipt.sha256 || referenceBytes.length !== receipt.bytes) throw Error(`Review reference receipt is invalid: ${receipt.referenceId}`);
    references.push({ id: receipt.referenceId, file: receipt.file, sha256: receipt.sha256 });
  }
  if (!references.length) throw Error("No registered review-only references were selected.");
  const productionFiles = (await filesUnder(resolve(root, "assets"))).filter(path => /\.(svg|png)$/iu.test(path));
  const leaks = [];
  for (const path of productionFiles) {
    const bytes = await readFile(path);
    for (const reference of references) {
      if (path.endsWith(".png") && hash(bytes) === reference.sha256) leaks.push(`${reference.id}: ${path}`);
      if (path.endsWith(".svg")) {
        const svg = bytes.toString("utf8");
        if (svg.includes(basename(reference.file)) || svg.includes(reference.sha256) || /<image\b/iu.test(svg)) leaks.push(`${reference.id}: ${path}`);
      }
    }
  }
  if (leaks.length) throw Error(`Review reference leaked into production assets: ${leaks.join(", ")}`);
  return { productionFileCount: productionFiles.length, references };
}
