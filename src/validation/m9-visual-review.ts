export type M9ReviewDistance = "source" | "target-phone" | "thumbnail";

export interface M9VisualReviewPlan {
  technicalPreflight: { role: "hard-gate-only" };
  reviewSurfaces: Array<{ distance: M9ReviewDistance; requiredChecks: string[]; evidence: string[] }>;
  visualScore: { dimensions: Array<{ id: string; weight: number; score?: number }> };
}

const REQUIRED_DISTANCES: M9ReviewDistance[] = ["source", "target-phone", "thumbnail"];

export function validateM9VisualReviewPlan(plan: M9VisualReviewPlan): string[] {
  const issues: string[] = [];
  if (plan.technicalPreflight.role !== "hard-gate-only") issues.push("Technical correctness must remain a hard gate, not a visual-score input.");
  const seen = new Set(plan.reviewSurfaces.map(({ distance }) => distance));
  for (const distance of REQUIRED_DISTANCES) if (!seen.has(distance)) issues.push(`Missing ${distance} review surface.`);
  if (seen.size !== REQUIRED_DISTANCES.length) issues.push("Review surfaces must contain each required distance exactly once.");
  for (const surface of plan.reviewSurfaces) {
    if (!surface.evidence.length) issues.push(`${surface.distance} requires evidence.`);
  }
  const totalWeight = plan.visualScore.dimensions.reduce((total, dimension) => total + dimension.weight, 0);
  if (totalWeight !== 100) issues.push(`Visual-score weights must total 100, received ${totalWeight}.`);
  for (const distance of ["target-phone", "thumbnail"] as const) {
    const surface = plan.reviewSurfaces.find((candidate) => candidate.distance === distance);
    if (!surface?.requiredChecks.includes("v8-o001-focal-over-panel-pattern")) issues.push(`${distance} must assess V8-O001.`);
  }
  return issues;
}
