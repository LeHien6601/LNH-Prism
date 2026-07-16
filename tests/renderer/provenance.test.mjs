import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { loadV1ManifestProvenance } from "../../dist/renderer/provenance.js";

const hash = (content) => createHash("sha256").update(content).digest("hex");
const componentIds = ["primary-button", "primary-panel", "primary-progress-bar"];

test("V1 provenance binds approved specs, material sources, renderer code, and dependency lock by SHA-256", async () => {
  for (const componentId of componentIds) {
    const { sources, provenance } = await loadV1ManifestProvenance(componentId);
    assert.equal(sources.style.id, "neon-core");
    assert.equal(sources.component.id, componentId);
    assert.equal(sources.materialPacks[0].id, "neon-core-materials");
    assert.match(provenance.sourceTreeSha256, /^[a-f0-9]{64}$/);

    const roles = new Set(provenance.sourceFiles.map(({ role }) => role));
    for (const role of ["style-spec", "component-spec", "material-pack", "material-source", "renderer-source", "renderer-version", "provenance-engine", "dependency-lock"]) {
      assert.equal(roles.has(role), true, `${componentId} is missing ${role}`);
    }

    for (const sourceFile of provenance.sourceFiles) {
      const content = await readFile(resolve(sourceFile.path), "utf8");
      assert.equal(hash(content.replaceAll("\r\n", "\n")), sourceFile.sha256, `${sourceFile.path} hash drifted`);
    }

    const aggregate = hash(provenance.sourceFiles.map(({ role, path, sha256 }) => `${role}:${path}:${sha256}`).join("\n"));
    assert.equal(aggregate, provenance.sourceTreeSha256);
  }
});
