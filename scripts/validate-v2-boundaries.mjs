import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_EXTENSIONS = new Set([".cjs", ".js", ".mjs", ".mts", ".ts"]);
const IMPORT_PATTERNS = [
  /(?:import|export)\s+(?:[^'"\n]*?\s+from\s+)?["']([^"']+)["']/gu,
  /import\s*\(\s*["']([^"']+)["']\s*\)/gu
];

async function filesUnder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesUnder(resolve(path, entry.name))
    : [resolve(path, entry.name)]))).flat();
}

function internalDependencies(manifest) {
  const groups = [
    manifest.dependencies,
    manifest.devDependencies,
    manifest.optionalDependencies,
    manifest.peerDependencies
  ];
  return Object.fromEntries(groups.flatMap(group => Object.entries(group ?? {}))
    .filter(([name]) => name.startsWith("@lnh-prism/")));
}

function importedSpecifiers(source) {
  return IMPORT_PATTERNS.flatMap(pattern => [...source.matchAll(pattern)].map(match => match[1]));
}

function assertAcyclic(graph) {
  const complete = new Set();
  const visiting = new Set();
  function visit(name, path = []) {
    if (visiting.has(name)) throw Error(`V2 boundary: dependency cycle ${[...path, name].join(" -> ")}.`);
    if (complete.has(name)) return;
    visiting.add(name);
    for (const dependency of graph.get(name) ?? []) visit(dependency, [...path, name]);
    visiting.delete(name);
    complete.add(name);
  }
  for (const name of graph.keys()) visit(name);
}

export async function validateV2Boundaries({ root = resolve(".") } = {}) {
  const packagesRoot = resolve(root, "packages");
  const policy = JSON.parse(await readFile(resolve(packagesRoot, "prism-v2-boundaries.json"), "utf8"));
  if (policy.schemaVersion !== 1) throw Error(`V2 boundary: unsupported policy schema ${policy.schemaVersion}.`);

  const directories = (await readdir(packagesRoot, { withFileTypes: true })).filter(entry => entry.isDirectory());
  const packages = new Map();
  for (const directory of directories) {
    const packageRoot = resolve(packagesRoot, directory.name);
    const manifest = JSON.parse(await readFile(resolve(packageRoot, "package.json"), "utf8"));
    if (packages.has(manifest.name)) throw Error(`V2 boundary: duplicate package ${manifest.name}.`);
    packages.set(manifest.name, { directory: directory.name, manifest, packageRoot });
  }

  const expectedNames = Object.keys(policy.packages).sort();
  const actualNames = [...packages.keys()].sort();
  if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
    throw Error(`V2 boundary: package inventory differs; expected ${expectedNames.join(", ")}, received ${actualNames.join(", ")}.`);
  }

  const forbidden = new Set(policy.forbiddenDependencies ?? []);
  const graph = new Map();
  let sourceFiles = 0;
  for (const [name, details] of packages) {
    const { directory, manifest, packageRoot } = details;
    if (manifest.private !== true) throw Error(`V2 boundary: ${name} must remain private before release policy exists.`);
    const declared = {
      ...(manifest.dependencies ?? {}),
      ...(manifest.devDependencies ?? {}),
      ...(manifest.optionalDependencies ?? {}),
      ...(manifest.peerDependencies ?? {})
    };
    for (const dependency of Object.keys(declared)) {
      if (forbidden.has(dependency)) throw Error(`V2 boundary: ${name} depends on forbidden legacy package ${dependency}.`);
    }

    const internal = internalDependencies(manifest);
    const allowed = [...policy.packages[name]].sort();
    const actual = Object.keys(internal).sort();
    if (JSON.stringify(actual) !== JSON.stringify(allowed)) {
      throw Error(`V2 boundary: ${name} internal dependencies must be ${allowed.join(", ") || "none"}; received ${actual.join(", ") || "none"}.`);
    }
    for (const dependency of actual) {
      const target = packages.get(dependency);
      if (!target) throw Error(`V2 boundary: ${name} references unknown internal package ${dependency}.`);
      if (internal[dependency] !== target.manifest.version) {
        throw Error(`V2 boundary: ${name} must pin ${dependency} to ${target.manifest.version}.`);
      }
    }
    graph.set(name, actual);

    const files = (await filesUnder(packageRoot)).filter(path => SOURCE_EXTENSIONS.has(extname(path)));
    sourceFiles += files.length;
    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const specifier of importedSpecifiers(source)) {
        if (specifier.startsWith(".")) {
          const target = resolve(dirname(file), specifier);
          if (target !== packageRoot && !target.startsWith(`${packageRoot}${sep}`)) {
            throw Error(`V2 boundary: ${relative(root, file)} imports outside ${directory}: ${specifier}.`);
          }
        } else if (isAbsolute(specifier)) {
          throw Error(`V2 boundary: ${relative(root, file)} uses absolute import ${specifier}.`);
        } else if (forbidden.has(specifier)) {
          throw Error(`V2 boundary: ${relative(root, file)} imports forbidden legacy package ${specifier}.`);
        } else if (specifier.startsWith("@lnh-prism/") && !actual.includes(specifier)) {
          throw Error(`V2 boundary: ${relative(root, file)} imports undeclared or disallowed package ${specifier}.`);
        }
      }
    }
  }

  assertAcyclic(graph);
  return { packages: packages.size, sourceFiles };
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  const result = await validateV2Boundaries();
  console.log(`V2 boundary validation passed: ${result.packages} packages and ${result.sourceFiles} source files.`);
}
