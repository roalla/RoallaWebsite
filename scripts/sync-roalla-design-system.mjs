#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rcos = path.resolve(process.argv[2] || path.join(root, "..", "rcos"));
const exporter = path.join(rcos, "scripts", "export-design-system.mjs");
if (!fs.existsSync(exporter)) {
  console.error(`RCOS export script not found: ${exporter}`);
  process.exit(1);
}
const result = spawnSync(process.execPath, [exporter, root], { stdio: "inherit" });
process.exit(result.status ?? 1);
