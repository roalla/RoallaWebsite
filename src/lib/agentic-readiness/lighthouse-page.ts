import { scoreAgenticReadiness, type AgenticReadiness } from "@/lib/agentic-readiness/score";
import { fetchOptionalPublicText, fetchPublicHtml } from "@/lib/social-presence/safe-html-fetch";
import { normalizePublicTarget } from "@/lib/website-visibility/public-target";
import { pageSpeedUserAgent, type PageSpeedStrategy } from "@/lib/website-visibility/pagespeed";

type PageFetch = typeof fetchPublicHtml;
type TextFetch = typeof fetchOptionalPublicText;

/**
 * Score the same landing page Lighthouse measured for this strategy.
 * Mobile and desktop can be different documents, so each gets its own fetch
 * with the user agent PageSpeed uses for that strategy.
 */
export async function scoreLighthousePageAgentic(
  finalUrl: string,
  strategy: PageSpeedStrategy,
  fetchPage: PageFetch = fetchPublicHtml,
  fetchText: TextFetch = fetchOptionalPublicText,
): Promise<AgenticReadiness | undefined> {
  let target: URL;
  try {
    target = normalizePublicTarget(finalUrl);
  } catch {
    return undefined;
  }
  const userAgent = pageSpeedUserAgent(strategy);
  try {
    const page = await fetchPage(target, 0, userAgent);
    const origin = new URL(page.finalUrl);
    const [robotsTxt, llmsTxt] = await Promise.all([
      fetchText(new URL("/robots.txt", origin), 0, userAgent),
      fetchText(new URL("/llms.txt", origin), 0, userAgent),
    ]);
    return scoreAgenticReadiness({ html: page.html, robotsTxt, llmsTxt });
  } catch {
    return undefined;
  }
}
