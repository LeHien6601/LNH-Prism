import { createHash } from "node:crypto";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { writeFrostboundUnityBundle } from "../dist/unity/frostbound-unity-bundle.js";

const evidence = resolve("docs/validation/evidence/m4-s2-frostbound-unity-bundle");
const bundle = join(evidence,"bundle");
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function inventory(root,prefix="") {
  const files=[];
  for (const entry of await readdir(join(root,prefix),{withFileTypes:true})) {
    const relative=join(prefix,entry.name);
    if(entry.isDirectory()) files.push(...await inventory(root,relative));
    else { const bytes=await readFile(join(root,relative)); files.push({path:relative.replaceAll("\\","/"),sha256:sha(bytes),bytes:bytes.length}); }
  }
  return files.sort((a,b)=>a.path.localeCompare(b.path,"en-US"));
}
const first=await mkdtemp(join(tmpdir(),"lnh-prism-m4-s2-first-"));
const second=await mkdtemp(join(tmpdir(),"lnh-prism-m4-s2-second-"));
try {
  const initial=await writeFrostboundUnityBundle(first);
  const repeat=await writeFrostboundUnityBundle(second,{previousRegistry:initial.registry});
  const a=await inventory(first), b=await inventory(second);
  if(JSON.stringify(a)!==JSON.stringify(b)) throw new Error("Clean Frostbound exports were not byte-identical.");
  await rm(evidence,{recursive:true,force:true}); await mkdir(evidence,{recursive:true}); await cp(first,bundle,{recursive:true});
  await writeFile(join(evidence,"collision-audit.json"),`${JSON.stringify(initial.collisionAudit,null,2)}\n`);
  await writeFile(join(evidence,"repeat-export-proof.json"),`${JSON.stringify({schemaVersion:"1.0",status:"pass",comparison:"byte-for-byte",fileCount:a.length,assetCount:repeat.registry.entries.length,firstInventory:a,secondInventory:b},null,2)}\n`);
} finally { await rm(first,{recursive:true,force:true}); await rm(second,{recursive:true,force:true}); }
console.log(`Prepared deterministic M4-S2 Unity bundle in ${evidence}.`);
