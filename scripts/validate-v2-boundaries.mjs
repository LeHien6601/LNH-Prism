import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createScanner, LanguageVariant, SyntaxKind } from "typescript/unstable/ast";

const SOURCE_EXTENSIONS = new Set([".cjs", ".cts", ".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);
const DEPENDENCY_GROUPS = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"];
const LOCAL_DEPENDENCY_PREFIXES = ["file:", "link:", "workspace:"];

async function filesUnder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesUnder(resolve(path, entry.name))
    : [resolve(path, entry.name)]))).flat();
}

function moduleSpecifiers(source, path) {
  const variant = [".jsx", ".tsx"].includes(extname(path)) ? LanguageVariant.JSX : LanguageVariant.Standard;
  const scanner = createScanner(true, variant, source);
  const tokens = [];
  for (let kind = scanner.scan(); kind !== SyntaxKind.EndOfFile; kind = scanner.scan()) {
    tokens.push({ kind, text: scanner.getTokenText(), value: scanner.getTokenValue() });
  }
  const specifiers = [];
  function addLiteral(token, kind) {
    if (!token || token.kind !== SyntaxKind.StringLiteral) {
      throw Error(`V2 boundary: ${path} uses non-literal ${kind}; module edges must be statically inspectable.`);
    }
    specifiers.push(token.value);
  }
  function statementSpecifier(start, keyword) {
    if (keyword === "export") {
      let first = start + 1;
      if (tokens[first]?.kind === SyntaxKind.TypeKeyword) first += 1;
      if (![SyntaxKind.AsteriskToken, SyntaxKind.OpenBraceToken].includes(tokens[first]?.kind)) return;
      if (tokens[first].kind === SyntaxKind.OpenBraceToken) {
        let depth = 1;
        for (let index = first + 1; index < tokens.length; index += 1) {
          if (tokens[index].kind === SyntaxKind.OpenBraceToken) depth += 1;
          if (tokens[index].kind === SyntaxKind.CloseBraceToken) depth -= 1;
          if (depth === 0) {
            if (tokens[index + 1]?.kind === SyntaxKind.FromKeyword) addLiteral(tokens[index + 2], "module specifier");
            return;
          }
        }
      }
    }
    for (let index = start + 1; index < tokens.length && tokens[index].kind !== SyntaxKind.SemicolonToken; index += 1) {
      if (keyword === "import" && index === start + 1 && tokens[index].kind === SyntaxKind.StringLiteral) {
        addLiteral(tokens[index], "module specifier");
        return;
      }
      if (tokens[index].kind === SyntaxKind.FromKeyword) {
        addLiteral(tokens[index + 1], "module specifier");
        return;
      }
      if (keyword === "import" && tokens[index].kind === SyntaxKind.EqualsToken
        && [SyntaxKind.Identifier, SyntaxKind.RequireKeyword].includes(tokens[index + 1]?.kind)
        && tokens[index + 1].text === "require"
        && tokens[index + 2]?.kind === SyntaxKind.OpenParenToken) {
        addLiteral(tokens[index + 3], "TypeScript import assignment");
        return;
      }
    }
  }
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.kind === SyntaxKind.ImportKeyword) {
      if (tokens[index + 1]?.kind === SyntaxKind.OpenParenToken) addLiteral(tokens[index + 2], "dynamic import");
      else statementSpecifier(index, "import");
    } else if (token.kind === SyntaxKind.ExportKeyword) {
      statementSpecifier(index, "export");
    } else if ([SyntaxKind.Identifier, SyntaxKind.RequireKeyword].includes(token.kind)
      && token.text === "require"
      && tokens[index - 1]?.kind !== SyntaxKind.DotToken) {
      if (tokens[index + 1]?.kind === SyntaxKind.OpenParenToken) {
        addLiteral(tokens[index + 2], "require call");
      } else if (tokens[index + 1]?.kind === SyntaxKind.DotToken
        && tokens[index + 2]?.kind === SyntaxKind.Identifier
        && tokens[index + 2].text === "resolve"
        && tokens[index + 3]?.kind === SyntaxKind.OpenParenToken) {
        addLiteral(tokens[index + 4], "require.resolve call");
      }
    }
  }
  return specifiers;
}

function declaredDependencies(manifest) {
  const declared = new Map();
  for (const group of DEPENDENCY_GROUPS) {
    for (const [name, specification] of Object.entries(manifest[group] ?? {})) {
      if (declared.has(name) && declared.get(name).specification !== specification) {
        throw Error(`V2 boundary: ${manifest.name} declares conflicting versions of ${name}.`);
      }
      declared.set(name, { group, specification });
    }
  }
  return declared;
}

function packageName(specifier) {
  if (specifier.startsWith("@")) return specifier.split("/").slice(0, 2).join("/");
  return specifier.split("/")[0];
}

function npmAliasTarget(specification) {
  if (!specification.startsWith("npm:")) return null;
  const target = specification.slice(4);
  if (target.startsWith("@")) {
    const slash = target.indexOf("/");
    const version = slash === -1 ? -1 : target.indexOf("@", slash);
    return version === -1 ? target : target.slice(0, version);
  }
  const version = target.indexOf("@");
  return version === -1 ? target : target.slice(0, version);
}

function isLocalDependency(specification) {
  return LOCAL_DEPENDENCY_PREFIXES.some(prefix => specification.startsWith(prefix))
    || specification.startsWith(".")
    || specification.startsWith("/")
    || /^[A-Za-z]:[\\/]/u.test(specification);
}

function assertInsidePackage(packageRoot, target, label) {
  if (isAbsolute(target)) throw Error(`V2 boundary: ${label} uses absolute path ${target}.`);
  const resolved = resolve(packageRoot, target);
  if (resolved !== packageRoot && !resolved.startsWith(`${packageRoot}${sep}`)) {
    throw Error(`V2 boundary: ${label} escapes its package root: ${target}.`);
  }
}

function targetStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(targetStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(targetStrings);
  return [];
}

function validateImportSpecifier({ specifier, file, packageRoot, packageDirectory, declared, internal, forbidden }) {
  if (specifier.startsWith(".")) {
    const target = resolve(dirname(file), specifier);
    if (target !== packageRoot && !target.startsWith(`${packageRoot}${sep}`)) {
      throw Error(`V2 boundary: ${relative(packageRoot, file)} imports outside ${packageDirectory}: ${specifier}.`);
    }
    return;
  }
  if (isAbsolute(specifier)) throw Error(`V2 boundary: ${relative(packageRoot, file)} uses absolute import ${specifier}.`);
  if (specifier.startsWith("node:")) return;
  if (specifier.startsWith("#")) {
    throw Error(`V2 boundary: ${relative(packageRoot, file)} uses unsupported private import alias ${specifier}.`);
  }

  const dependency = packageName(specifier);
  if (forbidden.has(dependency)) {
    throw Error(`V2 boundary: ${relative(packageRoot, file)} imports forbidden legacy package ${specifier}.`);
  }
  if (dependency.startsWith("@lnh-prism/")) {
    if (!internal.has(dependency)) {
      throw Error(`V2 boundary: ${relative(packageRoot, file)} imports undeclared or disallowed package ${specifier}.`);
    }
    return;
  }
  if (!declared.has(dependency)) {
    throw Error(`V2 boundary: ${relative(packageRoot, file)} imports undeclared dependency ${specifier}; declare it in ${packageDirectory}/package.json.`);
  }
}

function validateManifestTargets({ manifest, packageRoot, declared, internal, forbidden }) {
  for (const field of ["main", "module", "types", "typings", "bin", "exports"]) {
    for (const target of targetStrings(manifest[field])) {
      assertInsidePackage(packageRoot, target, `${manifest.name} ${field}`);
    }
  }
  for (const target of targetStrings(manifest.imports)) {
    if (target.startsWith(".")) {
      assertInsidePackage(packageRoot, target, `${manifest.name} imports target`);
    } else if (!target.startsWith("node:")) {
      const dependency = packageName(target);
      if (forbidden.has(dependency)) throw Error(`V2 boundary: ${manifest.name} imports map targets forbidden legacy package ${target}.`);
      if (dependency.startsWith("@lnh-prism/") ? !internal.has(dependency) : !declared.has(dependency)) {
        throw Error(`V2 boundary: ${manifest.name} imports map targets undeclared dependency ${target}.`);
      }
    }
  }
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
    const declared = declaredDependencies(manifest);
    for (const [dependency, { specification }] of declared) {
      if (forbidden.has(dependency)) throw Error(`V2 boundary: ${name} depends on forbidden legacy package ${dependency}.`);
      if (typeof specification !== "string") throw Error(`V2 boundary: ${name} has invalid dependency specification for ${dependency}.`);
      if (isLocalDependency(specification)) {
        throw Error(`V2 boundary: ${name} uses forbidden local dependency ${dependency}@${specification}.`);
      }
      const aliasTarget = npmAliasTarget(specification);
      if (aliasTarget && (forbidden.has(aliasTarget) || aliasTarget.startsWith("@lnh-prism/"))) {
        throw Error(`V2 boundary: ${name} aliases ${dependency} to forbidden package ${aliasTarget}.`);
      }
    }

    const internal = new Map([...declared].filter(([dependency]) => dependency.startsWith("@lnh-prism/")));
    const allowed = [...policy.packages[name]].sort();
    const actual = [...internal.keys()].sort();
    if (JSON.stringify(actual) !== JSON.stringify(allowed)) {
      throw Error(`V2 boundary: ${name} internal dependencies must be ${allowed.join(", ") || "none"}; received ${actual.join(", ") || "none"}.`);
    }
    for (const dependency of actual) {
      const target = packages.get(dependency);
      if (!target) throw Error(`V2 boundary: ${name} references unknown internal package ${dependency}.`);
      if (internal.get(dependency).specification !== target.manifest.version) {
        throw Error(`V2 boundary: ${name} must pin ${dependency} to ${target.manifest.version}.`);
      }
    }
    graph.set(name, actual);
    validateManifestTargets({ manifest, packageRoot, declared, internal, forbidden });

    const files = (await filesUnder(packageRoot)).filter(path => SOURCE_EXTENSIONS.has(extname(path)));
    sourceFiles += files.length;
    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const specifier of moduleSpecifiers(source, relative(root, file))) {
        validateImportSpecifier({ specifier, file, packageRoot, packageDirectory: directory, declared, internal, forbidden });
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
