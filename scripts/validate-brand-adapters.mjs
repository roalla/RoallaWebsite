import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export function validateBrandAdapters(root, adapters) {
  const checksumsPath = path.join(root, "vendor", "roalla-design-system", "checksums.json");
  if (!fs.existsSync(checksumsPath)) {
    throw new Error("missing vendor/roalla-design-system/checksums.json — run RCOS design-system:export");
  }
  const checksums = JSON.parse(fs.readFileSync(checksumsPath, "utf8"));
  const errors = [];

  for (const adapter of adapters) {
    const file = path.join(root, adapter.path);
    if (!fs.existsSync(file)) {
      errors.push(`missing ${adapter.path}`);
      continue;
    }
    const expected = checksums.files[adapter.key];
    const actual = sha256(file);
    if (actual !== expected) {
      errors.push(`${adapter.path}: digest ${actual} != ${adapter.key} ${expected}`);
    }
  }

  const vendorTokens = path.join(root, "vendor", "roalla-design-system", "tokens.css");
  const vendorLogo = path.join(root, "vendor", "roalla-design-system", "logo.svg");
  if (sha256(vendorTokens) !== checksums.files["tokens.css"]) {
    errors.push("vendor/roalla-design-system/tokens.css digest mismatch");
  }
  if (sha256(vendorLogo) !== checksums.files["logo.svg"]) {
    errors.push("vendor/roalla-design-system/logo.svg digest mismatch");
  }

  if (errors.length) {
    throw new Error(errors.map((e) => `- ${e}`).join("\n"));
  }
}
