import assert from "node:assert/strict";
import test from "node:test";
import { cp, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateV2Boundaries } from "../../scripts/validate-v2-boundaries.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "lnh-prism-v2-boundaries-"));
  await cp(join(repositoryRoot, "packages"), join(root, "packages"), { recursive: true });
  return root;
}

async function editManifest(root, directory, edit) {
  const path = join(root, "packages", directory, "package.json");
  const manifest = JSON.parse(await readFile(path, "utf8"));
  edit(manifest);
  await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
}

test("V2 packages follow the declared clean dependency graph", async () => {
  assert.deepEqual(await validateV2Boundaries({ root: repositoryRoot }), { packages: 5, sourceFiles: 5 });
});

test("V2 package entry points resolve through the workspace graph", async () => {
  const { prismCliPackage } = await import("@lnh-prism/cli");
  assert.deepEqual(prismCliPackage, {
    name: "@lnh-prism/cli",
    version: "0.1.0",
    status: "boundary-only",
    dependencies: [
      "@lnh-prism/core",
      "@lnh-prism/schema",
      "@lnh-prism/unity-contract",
      "@lnh-prism/wireframe"
    ]
  });
});

test("V2 boundary rejects a dependency on the legacy root package", async () => {
  const root = await fixture();
  await editManifest(root, "prism-core", manifest => {
    manifest.dependencies["lnh-prism"] = "0.1.0";
  });
  await assert.rejects(() => validateV2Boundaries({ root }), /forbidden legacy package lnh-prism/u);
});

test("V2 boundary rejects source imports that escape a package", async () => {
  const root = await fixture();
  const source = join(root, "packages", "prism-schema", "src", "index.mjs");
  await writeFile(source, 'import "../../../src/renderer/version.js";\n');
  await assert.rejects(() => validateV2Boundaries({ root }), /imports outside prism-schema/u);
});

test("V2 boundary rejects undeclared internal dependency edges", async () => {
  const root = await fixture();
  await editManifest(root, "prism-schema", manifest => {
    manifest.dependencies = { "@lnh-prism/core": "0.1.0" };
  });
  await assert.rejects(() => validateV2Boundaries({ root }), /schema internal dependencies must be none/u);
});
