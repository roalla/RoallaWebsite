import { MetadataRoute } from "next";
import { INSIGHT_SLUGS } from "@/lib/insights";
import { CASE_STUDY_SLUGS } from "@/lib/portfolio-case-studies";
import { SOLUTION_PATH_IDS } from "@/lib/solutions-by-need";
import { campaignReviewIds } from "@/lib/campaign-review-content";

const baseUrl = "https://www.roalla.com";
const locales = ["en", "fr"] as const;

const paths = [
  "",
  "/solutions",
  ...SOLUTION_PATH_IDS.map((slug) => `/solutions/${slug}`),
  "/services/digital",
  "/services/ai-agents",
  "/services/search-ai-visibility",
  "/services/digital-products",
  "/services/automation",
  "/services/managed-optimization",
  "/services/security-risk-compliance",
  "/services/digital-events",
  "/services/portfolio",
  "/services/portfolio/websites",
  "/services/portfolio/digital-products",
  "/services/business-advisory",
  "/services/technology-advisory",
  "/programs/workshops",
  "/programs/workshops/focus-circle",
  "/programs/workshops/workload-conversation",
  "/programs/workshops/digital-calm",
  "/programs/workshops/decision-hour",
  "/programs/workshops/offer-page",
  "/programs/workshops/ideation",
  "/programs/workshops/first-offer",
  "/website-design",
  "/website-package",
  "/website-estimate",
  "/visibility-improvement-estimate",
  "/email-reach-estimate",
  "/website-ai-visibility-review",

  ...campaignReviewIds.map((slug) => `/${slug}`),
  "/tools/social-presence-snapshot",
  "/tools/social-profile-checklist",
  "/tools/digital-presence-snapshot",
  "/tools/digital-value-blueprint",
  "/tools/business-value-calculators",
  "/tools/digital-monitoring-dashboard",
  "/tools/advisory-value-calculators",
  "/tools/technology-decision-brief",
  "/tools/communications-value-brief",
  "/tools/email-reach-brief",
  "/tools/ninety-day-plan-brief",
  "/tools/capacity-pressure-brief",
  "/tools/execution-partner-dashboard",
  "/about",
  "/partners",
  "/partners/strategic-relationships",
  "/partners/technology-providers",
  "/partners/delivery-platforms",
  "/partners/evaluation-standard",
  "/partners/compensation",
  "/assessment",
  "/faq",
  "/use-cases",
  "/contact",
  "/terms",
  "/privacy",
  "/ai-policy",
  "/insights",
  "/executive-insights",
  ...INSIGHT_SLUGS.map((slug) => `/insights/${slug}`),
  ...CASE_STUDY_SLUGS.map((slug) => `/services/portfolio/${slug}`),
] as const;

const priorities: Record<string, number> = {
  "": 1,
  "/solutions": 0.97,
  "/services/digital": 0.95,
  "/services/ai-agents": 0.96,
  "/services/search-ai-visibility": 0.94,
  "/services/digital-products": 0.91,
  "/services/automation": 0.89,
  "/services/managed-optimization": 0.84,
  "/services/security-risk-compliance": 0.95,
  "/services/portfolio": 0.9,
  "/website-design": 0.88,
  "/website-package": 0.86,
  "/website-estimate": 0.84,
  "/visibility-improvement-estimate": 0.83,
  "/email-reach-estimate": 0.83,
  "/website-ai-visibility-review": 0.91,
  "/tools/social-presence-snapshot": 0.88,
  "/tools/social-profile-checklist": 0.87,
  "/tools/digital-presence-snapshot": 0.92,
  "/tools/digital-value-blueprint": 0.9,
  "/tools/business-value-calculators": 0.86,
  "/tools/digital-monitoring-dashboard": 0.78,
  "/tools/advisory-value-calculators": 0.86,
  "/tools/technology-decision-brief": 0.88,
  "/tools/communications-value-brief": 0.88,
  "/tools/execution-partner-dashboard": 0.78,
  "/services/digital-events": 0.85,
  "/services/business-advisory": 0.6,
  "/services/technology-advisory": 0.6,
  "/programs/workshops": 0.9,
  "/programs/workshops/focus-circle": 0.84,
  "/programs/workshops/workload-conversation": 0.84,
  "/programs/workshops/digital-calm": 0.84,
  "/programs/workshops/decision-hour": 0.84,
  "/programs/workshops/offer-page": 0.84,
  "/programs/workshops/ideation": 0.84,
  "/programs/workshops/first-offer": 0.84,
  "/about": 0.8,
  "/partners": 0.8,
  "/partners/strategic-relationships": 0.75,
  "/partners/technology-providers": 0.75,
  "/partners/delivery-platforms": 0.75,
  "/partners/evaluation-standard": 0.72,
  "/partners/compensation": 0.72,
  "/assessment": 0.7,
  "/faq": 0.7,
  "/use-cases": 0.85,
  "/contact": 0.85,
  "/terms": 0.4,
  "/privacy": 0.4,
  "/ai-policy": 0.4,
  "/insights": 0.75,
  "/executive-insights": 0.88,
};

const changeFrequency = (
  path: string,
): MetadataRoute.Sitemap[number]["changeFrequency"] => {
  if (path === "") return "weekly";
  if (path.startsWith("/programs/workshops")) return "weekly";
  if (path.startsWith("/insights") || path.startsWith("/executive-insights")) return "monthly";
  return "monthly";
};

const priority = (path: string): number => {
  if (path.startsWith("/solutions/")) return 0.9;
  if (path.startsWith("/insights/")) return 0.72;
  if (path.startsWith("/services/portfolio/")) return 0.82;
  if (campaignReviewIds.some((slug) => path === `/${slug}`)) return 0.88;
  return priorities[path] ?? 0.7;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();

  return paths.flatMap((path) =>
    locales.map((locale) => {
      const localizedPath = path ? `/${locale}${path}` : `/${locale}`;
      const languages = {
        en: `${baseUrl}/en${path}`,
        fr: `${baseUrl}/fr${path}`,
        "x-default": `${baseUrl}/en${path}`,
      } as Record<string, string>;

      return {
        url: `${baseUrl}${localizedPath}`,
        lastModified,
        changeFrequency: changeFrequency(path),
        priority: priority(path),
        alternates: { languages },
      };
    }),
  );
}
