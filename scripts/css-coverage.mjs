import { chromium } from "playwright";

const url = process.argv[2] || "https://www.roalla.com/en";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 823 },
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
});
const client = await page.context().newCDPSession(page);
await client.send("DOM.enable");
await client.send("CSS.enable");
await client.send("CSS.startRuleUsageTracking");
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
const { ruleUsage } = await client.send("CSS.stopRuleUsageTracking");

const sheets = new Map();
for (const usage of ruleUsage) {
  if (!sheets.has(usage.styleSheetId)) {
    const { text } = await client.send("CSS.getStyleSheetText", {
      styleSheetId: usage.styleSheetId,
    });
    sheets.set(usage.styleSheetId, { text, ranges: [] });
  }
  sheets.get(usage.styleSheetId).ranges.push(usage);
}

function categorize(css, start, end) {
  const slice = css.slice(Math.max(0, start - 80), end);
  const rule = css.slice(start, end);
  if (/@media[^{]*min-width/.test(slice) && !/@media[^{]*max-width:\s*768px/.test(rule.slice(0, 40))) {
    const before = css.slice(0, start);
    const lastMedia = before.lastIndexOf("@media");
    const lastClose = Math.max(before.lastIndexOf("}"), -1);
    if (lastMedia > lastClose) {
      const header = css.slice(lastMedia, start);
      if (/min-width/.test(header)) return "min-width-media";
    }
  }
  if (/:hover|:focus|:focus-visible|:focus-within/.test(rule.split("{")[0] || "")) return "interactive-pseudo";
  if (/\.(about-|workshop-|rich-text|insight-card|animate-skeleton|marquee-)/.test(rule)) return "route-specific";
  if (/prefers-reduced-motion/.test(rule) || /prefers-reduced-motion/.test(css.slice(Math.max(0, start - 120), start)))
    return "reduced-motion";
  return "other";
}

const homeHtml = await page.content();
const homeClasses = new Set();
for (const m of homeHtml.matchAll(/class="([^"]*)"/g)) {
  for (const c of m[1].split(/\s+/)) if (c) homeClasses.add(c);
}

function splitTopLevel(css) {
  const parts = [];
  let i = 0;
  while (i < css.length) {
    const start = i;
    if (css.startsWith("/*", i)) {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? css.length : end + 2;
      parts.push({ kind: "comment", text: css.slice(start, i) });
      continue;
    }
    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    let depth = 0;
    let j = brace;
    for (; j < css.length; j++) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const header = css.slice(start, brace).trim();
    parts.push({ kind: header.startsWith("@") ? "at" : "rule", header, text: css.slice(start, j) });
    i = j;
  }
  return parts;
}

function classesInSelector(selector) {
  const names = [];
  for (const m of selector.matchAll(/\.((?:\\.|[^\s.#:[>+~])+)/g)) {
    names.push(m[1].replace(/\\/g, ""));
  }
  return names;
}

let grandUsed = 0;
let grandUnused = 0;

function bucketFor(css, start) {
  const before = css.slice(0, start);
  const lastMedia = before.lastIndexOf("@media");
  if (lastMedia !== -1) {
    const afterMedia = before.slice(lastMedia);
    const depth = (afterMedia.match(/\{/g) || []).length - (afterMedia.match(/\}/g) || []).length;
    if (depth > 0) {
      const header = afterMedia.slice(0, afterMedia.indexOf("{"));
      if (/min-width/.test(header)) return "min-width-media";
      if (/max-width/.test(header)) return "max-width-media";
      if (/hover:\s*hover/.test(header)) return "hover-media";
      if (/prefers-reduced-motion/.test(header)) return "reduced-motion";
      return "other-media:" + header.slice(0, 80);
    }
  }
  return "uncovered-base";
}

for (const [id, sheet] of sheets) {
  const css = sheet.text;
  const head = css.slice(0, 120).replace(/\s+/g, " ");
  let used = 0;
  let unused = 0;
  const buckets = {};
  const covered = new Uint8Array(css.length);
  const samples = [];
  for (const range of sheet.ranges) {
    const len = range.endOffset - range.startOffset;
    if (range.used) used += len;
    else unused += len;
    for (let i = range.startOffset; i < range.endOffset; i++) covered[i] = 1;
  }
  let gapStart = -1;
  const gapBuckets = {};
  for (let i = 0; i <= css.length; i++) {
    const inGap = i < css.length && !covered[i];
    if (inGap && gapStart < 0) gapStart = i;
    if (!inGap && gapStart >= 0) {
      const cat = bucketFor(css, gapStart);
      const len = i - gapStart;
      gapBuckets[cat] = (gapBuckets[cat] || 0) + len;
      if (samples.length < 20 && len > 40 && cat === "uncovered-base") {
        samples.push(css.slice(gapStart, Math.min(i, gapStart + 160)).replace(/\s+/g, " "));
      }
      gapStart = -1;
    }
  }
  const uncovered = Object.values(gapBuckets).reduce((a, b) => a + b, 0);
  grandUsed += used;
  grandUnused += unused;
  console.log("\n=== sheet bytes", css.length, "tracked-used", used, "tracked-unused", unused, "uncovered", uncovered);
  console.log("head:", head);
  console.log("tracked unused buckets", buckets);
  console.log("uncovered buckets", gapBuckets);
  if (samples.length) {
    console.log("--- uncovered base samples ---");
    for (const s of samples) console.log(s);
  }
}

console.log("\nTOTAL used", grandUsed, "unused", grandUnused);
console.log("homepage classes", homeClasses.size);

function mediaBucket(header) {
  if (/min-width/.test(header)) return "min-width";
  if (/max-width/.test(header)) return "max-width";
  if (/hover:\s*hover/.test(header)) return "hover-media";
  if (/prefers-reduced-motion/.test(header)) return "reduced-motion";
  return "media-other";
}

function walk(css, inherited, stats) {
  const add = (key, n) => {
    stats[key] = (stats[key] || 0) + n;
  };
  for (const part of splitTopLevel(css)) {
    const n = part.text.length;
    if (part.kind === "comment") {
      add("comment", n);
      continue;
    }
    const header = part.header || "";
    if (header.startsWith("@media")) {
      const body = part.text.slice(part.text.indexOf("{") + 1, part.text.lastIndexOf("}"));
      const before = statsTotal(stats);
      walk(body, mediaBucket(header), stats);
      const inner = statsTotal(stats) - before;
      add(`${mediaBucket(header)}:wrapper`, n - inner);
      continue;
    }
    if (header.startsWith("@keyframes") || header.startsWith("@-webkit-keyframes")) {
      add("keyframes", n);
      continue;
    }
    if (header.startsWith("@")) {
      add("at-other", n);
      continue;
    }
    let bucket = inherited || "base";
    if (!inherited && /:hover|:focus|:focus-visible|:focus-within/.test(header)) bucket = "pseudo";
    const names = classesInSelector(header);
    const onHome = names.length === 0 || names.some((c) => homeClasses.has(c));
    add(`${bucket}:${onHome ? "on-home" : "not-on-home"}`, n);
  }
}

function statsTotal(stats) {
  return Object.values(stats).reduce((a, b) => a + b, 0);
}

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

function walkFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "playwright-report") continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, acc);
    else if (/\.(tsx|ts|jsx|js|css)$/.test(name)) acc.push(full);
  }
  return acc;
}

const tailwind = [...sheets.values()].find((s) => s.text.includes("tailwindcss"));
if (tailwind) {
  const stats = {};
  walk(tailwind.text, null, stats);
  const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  console.log("tailwind split bytes");
  for (const [k, v] of sorted) console.log(String(v).padStart(7), k);

  const missing = new Map();
  function collect(css) {
    for (const part of splitTopLevel(css)) {
      const header = part.header || "";
      if (header.startsWith("@media")) {
        const body = part.text.slice(part.text.indexOf("{") + 1, part.text.lastIndexOf("}"));
        collect(body);
        continue;
      }
      if (header.startsWith("@")) continue;
      const names = classesInSelector(header);
      if (names.length === 0 || names.some((c) => homeClasses.has(c))) continue;
      for (const c of names) {
        if (!missing.has(c)) missing.set(c, 0);
        missing.set(c, missing.get(c) + part.text.length / names.length);
      }
    }
  }
  collect(tailwind.text);

  const files = walkFiles(path.resolve("src"));
  const fileText = files.map((f) => ({ f, text: readFileSync(f, "utf8") }));
  const groups = {};
  for (const [cls, bytes] of missing) {
    const needle = cls;
    const hits = fileText.filter(({ text }) => text.includes(needle));
    let group = "unmatched";
    if (hits.length) {
      const rels = hits.map(({ f }) => path.relative("src", f).replace(/\\/g, "/"));
      if (rels.every((r) => r.startsWith("components/hub/") || r.startsWith("app/[locale]/hub/"))) group = "hub";
      else if (rels.every((r) => r.includes("/about") || r.endsWith("About.tsx"))) group = "about";
      else if (rels.every((r) => r.includes("workshop") || r.includes("Workshop"))) group = "workshops";
      else if (rels.every((r) => r.includes("insight") || r.includes("Insight"))) group = "insights";
      else if (rels.some((r) => r.startsWith("components/hub/") || r.startsWith("app/[locale]/hub/"))) group = "hub+shared";
      else group = "other-pages";
    }
    groups[group] = groups[group] || { bytes: 0, classes: 0 };
    groups[group].bytes += bytes;
    groups[group].classes += 1;
  }
  console.log("missing class attribution", groups);
}

await browser.close();
