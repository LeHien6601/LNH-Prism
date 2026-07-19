import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderStyledComponentSvg, renderStyledProgressSvg } from "../dist/renderer/style-composition.js";
import { M10_VOLCANIC_FORGE_BINDING } from "../dist/styles/m10-volcanic-forge-binding.js";

const root = resolve("."), evidence = resolve(root, "docs/validation/evidence/m10-volcanic-forge"), matrix = resolve(evidence, "matrix"), packageDir = resolve(root, "assets/m10-volcanic-forge");
const hash = value => createHash("sha256").update(value).digest("hex");
const write = (path, value) => writeFile(path, typeof value === "string" ? value : `${JSON.stringify(value, null, 2)}\n`);
const seeded = request => ({ ...request, variationSeed: 39211 });
const requests = [...[[488,660],[488,760]].map(([width,height])=>seeded({component:"panel",width,height,state:"normal"})),...[320,260].flatMap((width,index)=>["normal","pressed","disabled"].map(state=>seeded({component:"primary-hex-button",width,height:index?62:68,state}))),...[232,188].flatMap((width,index)=>["normal","pressed","disabled"].map(state=>seeded({component:"secondary-hex-button",width,height:index?52:56,state}))),...[[148,"normal"],[184,"selected"]].map(([width,state])=>seeded({component:"tab",width,height:52,state})),...[[164,"normal"],[212,"highlighted"]].map(([width,state])=>seeded({component:"badge",width,height:48,state})),...[[92,"normal"],[116,"selected"]].map(([width,state])=>seeded({component:"icon-container",width,height:width,state})),...[344,420].flatMap(width=>[10,50,90].map(percent=>seeded({component:"progress",width,height:28,percent})))];
const render = request => (request.component === "progress" ? renderStyledProgressSvg : renderStyledComponentSvg)(request, M10_VOLCANIC_FORGE_BINDING);
await rm(evidence,{recursive:true,force:true}); await rm(packageDir,{recursive:true,force:true}); await mkdir(matrix,{recursive:true});
const entries=[];
for(const request of requests){const name=`${request.component}-${request.width}x${request.height}-${request.percent??request.state}`,svg=render({...request,instanceId:`m10-${name}`}),png=new Resvg(svg).render().asPng();await write(resolve(matrix,`${name}.svg`),svg);await writeFile(resolve(matrix,`${name}.png`),png);entries.push({...request,name,svgSha256:hash(`${svg}\n`),pngSha256:hash(png)});}
await mkdir(resolve(packageDir,"modules"),{recursive:true});const modules=[];
for(const entry of entries)for(const format of["svg","png"]){const path=`assets/m10-volcanic-forge/modules/${entry.component}/${entry.name}.${format}`;await mkdir(resolve(packageDir,"modules",entry.component),{recursive:true});await cp(resolve(matrix,`${entry.name}.${format}`),resolve(root,path));const bytes=await readFile(resolve(root,path));modules.push({assetId:`lnh-prism:asset:m10-volcanic-forge:${entry.name}:${format}`,component:entry.component,source:`docs/validation/evidence/m10-volcanic-forge/matrix/${entry.name}.${format}`,path,format,bytes:bytes.length,sha256:hash(bytes)});}
await write(resolve(evidence,"matrix.json"),{schemaVersion:"1.0",id:"m10-volcanic-forge-matrix",count:entries.length,entries});
await write(resolve(packageDir,"manifest.json"),{schemaVersion:"1.0",packageId:"m10-volcanic-forge-assets",packageVersion:"0.2.0",styleId:"m10-volcanic-forge",styleVersion:"0.2.0",components:["panel","primary-hex-button","secondary-hex-button","progress","tab","badge","icon-container"],modules,provenance:{style:"specs/examples/style-m10-volcanic-forge.json",bindings:"src/styles/m10-volcanic-forge-binding.ts",renderer:"src/renderer/style-composition.ts"}});
console.log(`Prepared ${entries.length} M10 matrix entries and ${modules.length} modules through style-composition.`);
