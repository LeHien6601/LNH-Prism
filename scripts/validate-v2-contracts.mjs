import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateSemanticProject } from "@lnh-prism/core";

const fixture = "tests/fixtures/semantic-v1/minimal-project.json";
const document = JSON.parse(await readFile(resolve(fixture), "utf8"));
const result = validateSemanticProject(document, { source: fixture });
console.log(JSON.stringify(result));
if (!result.valid) process.exitCode = 1;
