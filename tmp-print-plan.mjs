import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const pdfPath = "C:/Users/Roalla/AppData/Local/Temp/roalla-action-plan.pdf";
const analyzedAt = new Date().toISOString();

function technicalSnapshot(strategy) {
  const mobile = strategy === "mobile";
  return {
    provider: "Google PageSpeed Insights",
    strategy,
    requestedUrl: "https://www.harbourandco.example",
    finalUrl: "https://www.harbourandco.example/",
    analyzedAt,
    lighthouseVersion: "12.6.1",
    scores: {
      performance: mobile ? 42 : 78,
      accessibility: mobile ? 81 : 91,
      bestPractices: mobile ? 88 : 96,
      seo: mobile ? 64 : 71,
    },
    labMetrics: [
      { key: "fcp", label: "First Contentful Paint", displayValue: mobile ? "2.8 s" : "1.1 s" },
      { key: "lcp", label: "Largest Contentful Paint", displayValue: mobile ? "5.4 s" : "2.2 s" },
      { key: "cls", label: "Cumulative Layout Shift", displayValue: mobile ? "0.14" : "0.02" },
      { key: "tbt", label: "Total Blocking Time", displayValue: mobile ? "640 ms" : "80 ms" },
      { key: "si", label: "Speed Index", displayValue: mobile ? "6.1 s" : "1.8 s" },
    ],
    fieldMetrics: [
      { key: "lcp", label: "Largest Contentful Paint", displayValue: "3.4 s" },
      { key: "inp", label: "Interaction to Next Paint", displayValue: "210 ms" },
      { key: "cls", label: "Cumulative Layout Shift", displayValue: "0.09" },
    ],
    fieldScope: "origin",
    opportunities: [
      { id: "unused-js", title: "Reduce unused JavaScript", displayValue: mobile ? "1.4 s" : "0.6 s", savingsMs: 1400 },
      { id: "images", title: "Properly size images", displayValue: mobile ? "0.9 s" : "0.3 s", savingsMs: 900 },
      { id: "cache", title: "Serve static assets with an efficient cache policy", displayValue: "0.4 s", savingsMs: 400 },
    ],
    warnings: [],
  };
}

const social = {
  snapshot: {
    requestedUrl: "https://www.harbourandco.example",
    finalUrl: "https://www.harbourandco.example/",
    analyzedAt,
    score: 46,
    checks: [
      { id: "profileLinks", status: "fail", points: 0, maxPoints: 20, evidence: [] },
      { id: "structuredProfiles", status: "partial", points: 6, maxPoints: 15, evidence: [] },
      { id: "openGraph", status: "partial", points: 8, maxPoints: 20, evidence: [] },
      { id: "socialCards", status: "fail", points: 0, maxPoints: 15, evidence: [] },
      { id: "organizationSchema", status: "pass", points: 15, maxPoints: 15, evidence: [] },
      { id: "pageIdentity", status: "partial", points: 8, maxPoints: 15, evidence: [] },
    ],
    agentic: {
      score: 38,
      signals: [
        { id: "readable", points: 20, maxPoints: 20 },
        { id: "answer", points: 0, maxPoints: 20 },
        { id: "facts", points: 8, maxPoints: 20 },
        { id: "liftable", points: 0, maxPoints: 15 },
        { id: "guide", points: 0, maxPoints: 15 },
        { id: "retrieval", points: 10, maxPoints: 10 },
      ],
    },
    profiles: [],
    preview: { title: "Harbour & Co." },
  },
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.route("**/api/website-visibility-snapshot", (route) => route.fulfill({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({
    mobile: { snapshot: technicalSnapshot("mobile"), cached: false },
    desktop: { snapshot: technicalSnapshot("desktop"), cached: false },
  }),
}));
await page.route("**/api/social-presence-snapshot", (route) => route.fulfill({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify(social),
}));
await page.goto("http://localhost:3000/en/tools/digital-presence-snapshot", { waitUntil: "networkidle" });
await page.getByLabel("Your website address").fill("https://www.harbourandco.example");
await page.getByRole("button", { name: "Check my website" }).click();
await page.waitForFunction(() => {
  const button = [...document.querySelectorAll("button")].find((item) => item.textContent?.includes("Save my branded action plan"));
  return Boolean(button && !button.disabled && document.body.innerText.includes("What to improve first"));
});
await page.pdf({ path: pdfPath, printBackground: true, preferCSSPageSize: true });

const pdf = readFileSync(pdfPath);
const viewer = await browser.newPage({ viewport: { width: 980, height: 1400 } });
const pdfBase64 = pdf.toString("base64");
await viewer.setContent(`<!doctype html>
<meta charset="utf-8">
<style>body{margin:0;background:#ddd} canvas{display:block;margin:0 auto 12px;background:#fff}</style>
<div id="pages"></div>
<script type="module">
import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.mjs";
pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";
const bytes = Uint8Array.from(atob(${JSON.stringify(pdfBase64)}), (char) => char.charCodeAt(0));
const pdf = await pdfjs.getDocument({ data: bytes }).promise;
const root = document.querySelector("#pages");
for (let number = 1; number <= pdf.numPages; number++) {
  const pdfPage = await pdf.getPage(number);
  const viewport = pdfPage.getViewport({ scale: 1.35 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.dataset.page = String(number);
  root.append(canvas);
  await pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
}
document.body.dataset.ready = String(pdf.numPages);
</script>`, { waitUntil: "domcontentloaded" });
await viewer.waitForFunction(() => document.body.dataset.ready, { timeout: 30000 });
const count = Number(await viewer.locator("body").getAttribute("data-ready"));
for (let number = 1; number <= count; number++) {
  await viewer.locator(`canvas[data-page="${number}"]`).screenshot({
    path: `C:/Users/Roalla/AppData/Local/Temp/roalla-plan-page-${number}.png`,
  });
}
writeFileSync("C:/Users/Roalla/AppData/Local/Temp/roalla-plan-pages.txt", String(count));
await browser.close();
console.log("pages", count);
