import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const exts = [".tsx", ".ts", ".jsx", ".js"];
const entries = [
  "src/app/layout.tsx",
  "src/app/[locale]/layout.tsx",
  "src/app/[locale]/page.tsx",
];

const seen = new Set();

function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(root, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  const candidates = [...exts.map((e) => base + e), base, ...exts.map((e) => path.join(base, "index" + e))];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) || null;
}

function walk(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (seen.has(rel)) return;
  seen.add(rel);
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g)) {
    const spec = m[1] || m[2];
    const next = resolveImport(file, spec);
    if (next) walk(next);
  }
}

for (const entry of entries) walk(path.join(root, entry));
const list = [...seen].sort();
console.log(list.join("\n"));
console.log("\ncount", list.length);
