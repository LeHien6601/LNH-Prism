import { readdir, readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const git = (root, args) => { const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8" }); return result.status === 0 ? result.stdout.replace(/\s+$/u, "") : ""; };
const nextId = text => text.match(/^\| Next task \|.*?\(([^)]+)\)/mu)?.[1] ?? "unavailable";
const milestone = text => text.match(/^\| Active milestone \|.*?\b(M\d+)\b.*$/mu)?.[1] ?? "unavailable";
const mission = text => text.match(/^\| Active mission \|\s*`([^`]+)`/mu)?.[1] ?? "unavailable";
async function files(path) { const entries = await readdir(path, { withFileTypes: true }); return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(resolve(path, entry.name)) : [resolve(path, entry.name)]))).flat(); }
function validations(id) {
  if (id.startsWith("M13")) return ["npm run validate:v2-contracts", "npm run test:semantic-contracts", "npm run validate:v2-boundaries", "npm run validate:control-drift"];
  return id.startsWith("M11") ? ["npm run build:renderer", "npm run test:renderer", "npm run validate:m11-a4-package", "npm run validate:contracts", "npm run test:review-reference-boundary", "npm run validate:control-drift"] : ["npm run validate:contracts", "npm run test:renderer"];
}
export async function createAgentBrief({ root = resolve(".") } = {}) {
  const overview = await readFile(resolve(root, "docs/PROJECT_OVERVIEW.md"), "utf8"); const id = nextId(overview);
  const module = (await files(resolve(root, "docs/implementation"))).find(path => path.endsWith(".md") && path.includes(id.split("-")[0])) ?? "";
  const changedPaths = git(root, ["status", "--short"]).split(/\r?\n/u).filter(Boolean).map(line => line.slice(3));
  const branch = git(root, ["branch", "--show-current"]) || "detached"; const upstream = git(root, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  return { activeMission: mission(overview), activeMilestone: milestone(overview), nextTask: id, branch, upstream: upstream || null, worktree: changedPaths.length ? "dirty" : "clean", changedPaths, module: relative(root, module).replaceAll("\\", "/"), validations: validations(id) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) { const brief = await createAgentBrief(); console.log(process.argv.includes("--json") ? JSON.stringify(brief) : `mission: ${brief.activeMission}; milestone: ${brief.activeMilestone}; next: ${brief.nextTask}; branch: ${brief.branch}; worktree: ${brief.worktree}\nmodule: ${brief.module}\nvalidate: ${brief.validations.join(" | ")}`); }
