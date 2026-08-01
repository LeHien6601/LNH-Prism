import { readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const ACTIVE_MISSION = "semantic-ui-v2";

async function filesUnder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesUnder(resolve(path, entry.name))
    : [resolve(path, entry.name)]))).flat();
}

function nextTaskId(overview) {
  const match = overview.match(/^\| Next task \|.*?\(([^)]+)\).*$/mu);
  if (!match) throw Error("Control drift: overview next task is missing an ID.");
  return match[1];
}

function activeMilestoneId(overview) {
  const match = overview.match(/^\| Active milestone \|.*?\b(M\d+)\b.*$/mu);
  if (!match) throw Error("Control drift: overview active milestone is missing an ID.");
  return match[1];
}

function activeMissionId(overview) {
  const match = overview.match(/^\| Active mission \|\s*`([^`]+)`/mu);
  if (!match) throw Error("Control drift: overview active mission is missing a machine-readable ID.");
  return match[1];
}

function objectiveBoundaries(overview) {
  const match = overview.match(/^## 3\. Objective boundaries\s*$([\s\S]*?)(?=^##\s)/mu);
  if (!match) throw Error("Control drift: overview objective boundaries are missing.");
  return match[1];
}

export async function validateControlDrift({ root = resolve(".") } = {}) {
  const docs = resolve(root, "docs");
  const overview = await readFile(resolve(docs, "PROJECT_OVERVIEW.md"), "utf8");
  const roadmap = await readFile(resolve(docs, "ROADMAP.md"), "utf8");
  const next = nextTaskId(overview);
  const milestone = activeMilestoneId(overview);
  const mission = activeMissionId(overview);
  if (mission !== ACTIVE_MISSION) throw Error(`Control drift: active mission must be ${ACTIVE_MISSION}, found ${mission}.`);
  const boundaries = objectiveBoundaries(overview);
  const legacyScope = ["Layer-based components", "reusable material packs", "AI-supported concept generation", "real game UI assets"]
    .find(term => boundaries.includes(term));
  if (legacyScope) throw Error(`Control drift: legacy asset-pipeline scope is still active: ${legacyScope}.`);
  for (const required of ["game repositories", "Stable semantic IDs", "Deterministic multi-size wireframe", "generated-versus-authored ownership"]) {
    if (!boundaries.includes(required)) throw Error(`Control drift: semantic UI objective boundary is missing: ${required}.`);
  }
  const activeRows = [...overview.matchAll(/^\|\s*Active\s*\|\s*(M\d+)\s*\|/gmu)].map(match => match[1]);
  if (activeRows.length !== 1 || activeRows[0] !== milestone) {
    throw Error(`Control drift: roadmap-at-a-glance must mark only ${milestone} active; found ${activeRows.join(", ") || "none"}.`);
  }
  const taskRow = overview.split(/\r?\n/u).find(line => /^\| P\d+ \|/u.test(line) && line.includes(`(${next})`));
  const agentReady = taskRow?.includes("Agent-ready");
  const humanDecision = taskRow?.includes("Human decision");
  if (!taskRow || (!agentReady && !humanDecision)) throw Error(`Control drift: ${next} is not an authorized overview task.`);
  if (agentReady && !overview.includes(`| Next agent-ready task | ${next} `)) throw Error(`Control drift: overview next-agent-ready text does not match ${next}.`);
  if (humanDecision && !overview.includes(next)) throw Error(`Control drift: overview must record that ${next} is awaiting a human decision.`);
  const milestoneRow = overview.split(/\r?\n/u).find(line => line.includes(`| ${milestone} |`));
  if (!milestoneRow || /review pending|human decision pending/iu.test(milestoneRow)) throw Error(`Control drift: active milestone ${milestone} has stale pending status.`);
  if (!new RegExp(`^##\\s+\\S+\\s+${milestone}\\b`, "mu").test(roadmap)) {
    throw Error(`Control drift: roadmap does not contain active milestone ${milestone}.`);
  }
  if (!roadmap.includes(next)) throw Error(`Control drift: roadmap does not reference active task ${next}.`);

  const referenceAssets = resolve(docs, "reference-briefs/assets");
  const receipts = (await filesUnder(referenceAssets)).filter(path => path.endsWith(".receipt.json"));
  const documentation = await Promise.all((await filesUnder(docs))
    .filter(path => path.endsWith(".md"))
    .map(path => readFile(path, "utf8")));
  for (const path of receipts) {
    const receipt = JSON.parse(await readFile(path, "utf8"));
    if (receipt.status !== "review-only") continue;
    const raster = resolve(referenceAssets, receipt.file);
    const decision = resolve(root, receipt.sourceDecision);
    await stat(raster);
    await stat(decision);
    if (!documentation.some(text => text.includes(receipt.file))) throw Error(`Control drift: review-only reference ${receipt.file} has no documentation link.`);
  }
  return { activeMission: mission, activeMilestone: milestone, nextTask: next, reviewReferenceReceipts: receipts.length };
}

const result = await validateControlDrift();
console.log(`control drift check passed: ${result.nextTask}; ${result.reviewReferenceReceipts} review-reference receipts verified.`);
