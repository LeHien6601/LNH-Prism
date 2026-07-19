import assert from "node:assert/strict";
import { copyFile, readFile, rm, writeFile } from "node:fs/promises";
import test from "node:test";
import { resolve } from "node:path";
import { validateRegisteredReviewReferenceBoundary } from "../../scripts/review-reference-boundary.mjs";

const root = resolve("."), assets = resolve(root, "assets/m10-volcanic-forge");
const references = [
  { id: "m10-volcanic-forge-review-reference", file: "m10-volcanic-forge-review-reference-1080x1920.png", receipt: "m10-volcanic-forge-review-reference-1080x1920.receipt.json" },
  { id: "enchanted-forest-review-reference", file: "enchanted-forest-review-reference-1080x1920.png", receipt: "enchanted-forest-review-reference-1080x1920.receipt.json" }
];

test("registered Forge and Enchanted Forest references remain outside production assets", async () => {
  const result = await validateRegisteredReviewReferenceBoundary({ root, referenceIds: references.map(reference => reference.id) });
  assert.ok(result.productionFileCount >= 52);
  assert.deepEqual(result.references.map(reference => reference.id).sort(), references.map(reference => reference.id).sort());
});

for (const reference of references) {
  test(`rejects every ${reference.id} production leak form`, async () => {
    const receipt = JSON.parse(await readFile(resolve(root, "docs/reference-briefs/assets", reference.receipt), "utf8"));
    const paths = [
      resolve(assets, `${reference.id}-filename.svg`),
      resolve(assets, `${reference.id}-hash.svg`),
      resolve(assets, `${reference.id}-image.svg`),
      resolve(assets, `${reference.id}-identical.png`)
    ];
    await writeFile(paths[0], `<svg><!-- ${reference.file} --></svg>`);
    await writeFile(paths[1], `<svg data-reference="${receipt.sha256}"/>`);
    await writeFile(paths[2], `<svg><image href="${reference.file}"/></svg>`);
    await copyFile(resolve(root, "docs/reference-briefs/assets", reference.file), paths[3]);
    try {
      await assert.rejects(
        () => validateRegisteredReviewReferenceBoundary({ root, referenceIds: [reference.id] }),
        /Review reference leaked into production assets/u
      );
    } finally {
      await Promise.all(paths.map(path => rm(path, { force: true })));
    }
  });
}
