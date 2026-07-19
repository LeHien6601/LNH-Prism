import { resolve } from "node:path";
import { validateRegisteredReviewReferenceBoundary } from "./review-reference-boundary.mjs";

export async function validateM10ReferenceBoundary({ root = resolve(".") } = {}) {
  const result = await validateRegisteredReviewReferenceBoundary({ root, referenceIds: ["m10-volcanic-forge-review-reference"] });
  return { productionFileCount: result.productionFileCount, referenceSha256: result.references[0].sha256 };
}
