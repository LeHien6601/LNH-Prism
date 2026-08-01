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

async function editPolicy(root, edit) {
  const path = join(root, "packages", "prism-v2-boundaries.json");
  const policy = JSON.parse(await readFile(path, "utf8"));
  edit(policy);
  await writeFile(path, `${JSON.stringify(policy, null, 2)}\n`);
}

async function writePackageSource(root, directory, name, source) {
  await writeFile(join(root, "packages", directory, "src", name), source);
}

test("V2 packages follow the declared clean dependency graph", async () => {
  assert.deepEqual(await validateV2Boundaries({ root: repositoryRoot }), { packages: 5, sourceFiles: 5 });
});

test("V2 syntax scanning ignores import-like text and semicolonless non-module exports", async () => {
  const root = await fixture();
  await writePackageSource(root, "prism-schema", "syntax.mjs", [
    "// require('../../../src/renderer/version.js')",
    "export const example = \"import '../../../src/renderer/version.js'\"",
    "const from = 'not-a-module-specifier'"
  ].join("\n"));
  assert.deepEqual(await validateV2Boundaries({ root }), { packages: 5, sourceFiles: 6 });
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

test("V2 boundary rejects CommonJS requires that escape a package", async () => {
  const root = await fixture();
  await writePackageSource(root, "prism-schema", "escape.cjs", 'require("../../../src/renderer/version.js");\n');
  await assert.rejects(() => validateV2Boundaries({ root }), /imports outside prism-schema/u);
});

test("V2 boundary rejects TypeScript import assignments that escape a package", async () => {
  const root = await fixture();
  await writePackageSource(root, "prism-schema", "escape.cts", 'import legacy = require("../../../src/renderer/version.js");\n');
  await assert.rejects(() => validateV2Boundaries({ root }), /imports outside prism-schema/u);
});

test("V2 boundary rejects forbidden legacy package subpaths", async () => {
  const root = await fixture();
  await writePackageSource(root, "prism-schema", "legacy.mjs", 'import "lnh-prism/src/renderer/version.js";\n');
  await assert.rejects(() => validateV2Boundaries({ root }), /imports forbidden legacy package lnh-prism\/src\/renderer/u);
});

test("V2 boundary rejects npm aliases to forbidden legacy packages", async () => {
  const root = await fixture();
  await editManifest(root, "prism-core", manifest => {
    manifest.dependencies["legacy-alias"] = "npm:lnh-prism@0.1.0";
  });
  await assert.rejects(() => validateV2Boundaries({ root }), /aliases legacy-alias to forbidden package lnh-prism/u);
});

test("V2 boundary rejects repository-local dependency specifications", async () => {
  const root = await fixture();
  await editManifest(root, "prism-core", manifest => {
    manifest.dependencies["legacy-local"] = "file:../../src";
  });
  await assert.rejects(() => validateV2Boundaries({ root }), /uses forbidden local dependency legacy-local@file:/u);
});

test("V2 boundary rejects package entry points that escape the package root", async () => {
  const root = await fixture();
  await editManifest(root, "prism-core", manifest => {
    manifest.main = "../../../src/renderer/version.js";
  });
  await assert.rejects(() => validateV2Boundaries({ root }), /core main escapes its package root/u);
});

test("V2 boundary rejects non-literal dynamic module edges", async () => {
  const root = await fixture();
  await writePackageSource(root, "prism-schema", "dynamic.mjs", "const target = './local.mjs';\nawait import(target);\n");
  await assert.rejects(() => validateV2Boundaries({ root }), /uses non-literal dynamic import/u);
});

test("V2 boundary rejects a policy-consistent internal dependency cycle", async () => {
  const root = await fixture();
  await editPolicy(root, policy => {
    policy.packages["@lnh-prism/schema"] = ["@lnh-prism/core"];
  });
  await editManifest(root, "prism-schema", manifest => {
    manifest.dependencies = { "@lnh-prism/core": "0.1.0" };
  });
  await writePackageSource(root, "prism-schema", "index.mjs", 'import "@lnh-prism/core";\n');
  await assert.rejects(() => validateV2Boundaries({ root }), /dependency cycle .*@lnh-prism\/core -> @lnh-prism\/schema -> @lnh-prism\/core/u);
});
