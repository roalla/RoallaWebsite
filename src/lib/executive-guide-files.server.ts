import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { findExecutiveGuide } from "@/lib/executive-guides";

const FILES: Record<string, string> = {
  "ai-readiness-governance": "ai-readiness-governance.pdf",
  "acquisition-readiness-value-creation": "acquisition-readiness-value-creation.pdf",
  "saas-soc-2-readiness": "saas-soc-2-readiness.pdf",
  "digital-experience-modernization": "digital-experience-modernization.pdf",
  "smart-manufacturing-warehouse-modernization": "smart-manufacturing-warehouse-modernization.pdf",
  "sales-organization-growth-evolution": "sales-organization-growth-evolution.pdf",
  "cybersecurity-digital-resilience": "cybersecurity-digital-resilience.pdf",
  "voice-unified-communications-modernization": "voice-unified-communications-modernization.pdf",
  "ai-manufacturing-warehouse-operations": "ai-manufacturing-warehouse-operations.pdf",
  "technology-due-diligence": "technology-due-diligence.pdf",
  "canadian-innovation-funding-qualification": "canadian-innovation-funding-qualification.pdf",
  "revenue-operations-forecast-confidence": "revenue-operations-forecast-confidence.pdf",
  "supply-chain-visibility-resilience": "supply-chain-visibility-resilience.pdf",
  "ai-use-case-prioritization": "ai-use-case-prioritization.pdf",
  "technology-transformation-readiness": "technology-transformation-readiness.pdf",
  "contact-centre-ai-transformation": "contact-centre-ai-transformation.pdf",
  "warehouse-automation-robotics-investment": "warehouse-automation-robotics-investment.pdf",
  "operational-technology-cybersecurity-resilience": "operational-technology-cybersecurity-resilience.pdf",
  "erp-mes-wms-integration-readiness": "erp-mes-wms-integration-readiness.pdf",
  "industrial-technology-vendor-selection": "industrial-technology-vendor-selection.pdf",
  "energy-productivity-facility-modernization": "energy-productivity-facility-modernization.pdf",
  "go-to-market-strategy-readiness": "go-to-market-strategy-readiness.pdf",
  "customer-success-revenue-retention": "customer-success-revenue-retention.pdf",
  "pricing-packaging-optimization": "pricing-packaging-optimization.pdf",
  "marketing-revenue-alignment": "marketing-revenue-alignment.pdf",
  "enterprise-sales-transformation": "enterprise-sales-transformation.pdf",
  "canadian-staff-augmentation-outlook-2027": "canadian-staff-augmentation-outlook-2027.pdf",
};

function secret() {
  return process.env.EXECUTIVE_GUIDE_SECRET?.trim() || process.env.AUTH_MAIL_SECRET?.trim() || "";
}

function signature(slug: string, expires: number) {
  const key = secret();
  if (!key) throw new Error("Executive guide downloads are not configured.");
  return createHmac("sha256", key).update(`${slug}:${expires}`).digest("hex");
}

export function createExecutiveGuideDownload(slug: string, origin: string) {
  if (!findExecutiveGuide(slug) || !FILES[slug]) throw new Error("Unknown executive guide.");
  const expires = Date.now() + 48 * 60 * 60 * 1000;
  const token = signature(slug, expires);
  const url = new URL("/api/executive-guides/download", origin);
  url.searchParams.set("guide", slug);
  url.searchParams.set("expires", String(expires));
  url.searchParams.set("token", token);
  return url.toString();
}

export function verifyExecutiveGuideDownload(slug: string, expires: number, token: string) {
  if (!findExecutiveGuide(slug) || !FILES[slug] || !Number.isFinite(expires) || expires < Date.now()) return false;
  try {
    const expected = Buffer.from(signature(slug, expires), "hex");
    const received = Buffer.from(token, "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

export function executiveGuidePath(slug: string) {
  const file = FILES[slug];
  if (!file) throw new Error("Unknown executive guide.");
  return path.join(process.cwd(), "private", "executive-guides", file);
}

export function executiveGuideDownloadName(slug: string) {
  const guide = findExecutiveGuide(slug);
  if (!guide) return "ROALLA_Executive_Guide.pdf";
  return `ROALLA_${guide.en.title.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}_2026.pdf`;
}
