import assert from "node:assert/strict";
import test from "node:test";
import { validateM9VisualReviewPlan } from "../../dist/validation/m9-visual-review.js";

const plan = {
  technicalPreflight: { role: "hard-gate-only" },
  reviewSurfaces: [
    { distance: "source", requiredChecks: ["layers"], evidence: ["source"] },
    { distance: "target-phone", requiredChecks: ["v8-o001-focal-over-panel-pattern"], evidence: ["phone"] },
    { distance: "thumbnail", requiredChecks: ["v8-o001-focal-over-panel-pattern"], evidence: ["thumbnail"] }
  ],
  visualScore: { dimensions: [{ id: "visual", weight: 100 }] }
};

test("M9 visual review keeps technical checks outside the score and covers all distances", () => {
  assert.deepEqual(validateM9VisualReviewPlan(plan), []);
});

test("M9 visual review rejects inflated weights and missing V8-O001 coverage", () => {
  const invalid = structuredClone(plan);
  invalid.visualScore.dimensions[0].weight = 101;
  invalid.reviewSurfaces[2].requiredChecks = [];
  assert.deepEqual(validateM9VisualReviewPlan(invalid), [
    "Visual-score weights must total 100, received 101.",
    "thumbnail must assess V8-O001."
  ]);
});
