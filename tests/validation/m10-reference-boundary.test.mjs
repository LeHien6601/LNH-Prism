import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import test from "node:test";
import { resolve } from "node:path";
import { validateM10ReferenceBoundary } from "../../scripts/m10-reference-boundary.mjs";

test("M10 review reference remains outside production SVG and PNG assets", async () => {
  const root = resolve("."), leak = resolve(root, "assets/m10-volcanic-forge/reference-boundary-leak.svg");
  const receipt = JSON.parse(await readFile(resolve(root, "docs/reference-briefs/assets/m10-volcanic-forge-review-reference-1080x1920.receipt.json"), "utf8"));
  const result = await validateM10ReferenceBoundary({ root });
  assert.ok(result.productionFileCount >= 52);
  await writeFile(leak, `<svg><image href="m10-volcanic-forge-review-reference-1080x1920.png" data-reference="${receipt.sha256}"/></svg>`);
  try {
    await assert.rejects(validateM10ReferenceBoundary({ root }), /leaked into production assets/u);
  } finally {
    await rm(leak, { force: true });
  }
});
