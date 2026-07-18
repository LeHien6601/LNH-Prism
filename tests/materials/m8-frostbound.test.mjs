import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertM8FrostboundReuse, m8FrostboundReusePlan, preflightM8FrostboundSource, renderM8FrostboundIsolationSvg } from "../../dist/materials/m8-frostbound.js";
const root = new URL("../../", import.meta.url), pack = JSON.parse(await readFile(new URL("specs/examples/m8-frostbound-materials.json", root), "utf8"));
test("M8 cold sources retain hash, reuse, and no-reference boundary", async () => { for (const item of pack.sources) { const content = await readFile(new URL(item.path, root), "utf8"), source = JSON.parse(content); preflightM8FrostboundSource(source); assert.equal(createHash("sha256").update(content.replaceAll("\r\n", "\n")).digest("hex"), item.sha256); assert.match(renderM8FrostboundIsolationSvg(item.id), new RegExp(`data-material-source="${item.id}"`)); } assertM8FrostboundReuse(); assert.equal(m8FrostboundReusePlan.length, 7); });
test("M8 preflight rejects leakage", () => { const source = {id:"m8-ice-grain",colorSpace:"sRGB",transparentBackground:true,alpha:{maximum:.1},kind:"procedural-tile",edgeSignature:{top:"a",bottom:"a",left:"b",right:"b"},containsReferencePixels:false,containsComponentGeometry:false,containsComponentEffects:false}; preflightM8FrostboundSource(source); assert.throws(()=>preflightM8FrostboundSource({...source,containsReferencePixels:true}),/source-neutral/); });
