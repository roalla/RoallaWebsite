#!/usr/bin/env node
/**
 * Website brand packaging validation (Phase 3).
 * Manifest (`roalla.app.json`) is optional until the marketing site is registered
 * in the product-experience registry; token + logo digests are required.
 */
import fs from "node:fs";
import { resolve } from "node:path";
import { validateBrandAdapters } from "./validate-brand-adapters.mjs";

const root = resolve(import.meta.dirname, "..");

validateBrandAdapters(root, [
  { path: "public/logo.svg", key: "logo.svg" },
  { path: "vendor/roalla-design-system/tokens.css", key: "tokens.css" },
]);

const manifestPath = resolve(root, "roalla.app.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const field of ["schemaVersion", "id", "name", "category", "url", "healthUrl", "brand", "capabilities", "admin", "automation"]) {
    if (!(field in manifest)) throw new Error(`roalla.app.json is missing ${field}`);
  }
  console.log(`Validated product manifest: ${manifest.id}`);
} else {
  console.log("Brand adapters validated (no roalla.app.json yet).");
}
