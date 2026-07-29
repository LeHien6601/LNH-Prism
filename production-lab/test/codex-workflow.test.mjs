import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Codex workflow skill is discoverable and forbids model API adapters", async () => {
  const skill = await readFile(
    new URL("../.agents/skills/reconstruct-game-ui/SKILL.md", import.meta.url),
    "utf8"
  );
  assert.match(skill, /^---\r?\nname: reconstruct-game-ui\r?\ndescription: .+\r?\n---/);
  assert.match(skill, /Inspect the screenshot/);
  assert.match(skill, /Do not call a model API/);
});

test("lab contains no direct model API integration", async () => {
  const cli = await readFile(new URL("../src/cli.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(cli, /OPENAI_API_KEY|api\.openai|analyzeWithOpenAI/);
  assert.match(cli, /Prepared Codex-native analysis task/);
});
