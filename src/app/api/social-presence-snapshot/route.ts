import { NextRequest, NextResponse } from "next/server";
import { scoreAgenticReadiness } from "@/lib/agentic-readiness/score";
import { analyzeContactExposure } from "@/lib/contact-exposure/analyze";
import { lookupPublicEdgeHints } from "@/lib/domain-health/lookup";
import { analyzeSiteSetup } from "@/lib/site-setup/analyze";
import { analyzeSocialPresence } from "@/lib/social-presence/analyzer";
import {
  checkSocialClientRate,
  checkSocialHostRate,
  clientId,
  getCachedSocialSnapshot,
  setCachedSocialSnapshot,
} from "@/lib/social-presence/snapshot-guard";
import { fetchOptionalPublicText, fetchPublicHtml, WebsiteFetchError } from "@/lib/social-presence/safe-html-fetch";
import { normalizePublicTarget, PublicTargetError } from "@/lib/website-visibility/public-target";

export const dynamic = "force-dynamic";

function response(body: object, status = 200, extraHeaders: HeadersInit = {}) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(length) && length > 4096) {
    return response({ error: "Request is too large." }, 413);
  }
  const clientRate = checkSocialClientRate(clientId(request.headers));
  if (!clientRate.allowed) {
    return response({ error: "Too many snapshots. Please try again shortly." }, 429, {
      "Retry-After": String(clientRate.retryAfterSeconds),
    });
  }

  let body: { url?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return response({ error: "Submit a valid snapshot request." }, 400);
  }
  if (typeof body.website === "string" && body.website.trim()) {
    return response({ error: "Unable to process this request." }, 400);
  }

  try {
    const target = normalizePublicTarget(body.url);
    const cached = getCachedSocialSnapshot(target);
    if (cached?.siteSetup) return response({ snapshot: cached, cached: true });

    const hostRate = checkSocialHostRate(target.hostname);
    if (!hostRate.allowed) {
      return response({ error: "This website was checked recently. Please try again shortly." }, 429, {
        "Retry-After": String(hostRate.retryAfterSeconds),
      });
    }

    const page = await fetchPublicHtml(target);
    const origin = new URL(page.finalUrl);
    const [robotsTxt, llmsTxt] = await Promise.all([
      fetchOptionalPublicText(new URL("/robots.txt", origin)),
      fetchOptionalPublicText(new URL("/llms.txt", origin)),
    ]);
    const snapshot = analyzeSocialPresence(page.html, target.toString(), page.finalUrl.toString());
    snapshot.agentic = scoreAgenticReadiness({ html: page.html, robotsTxt, llmsTxt });
    snapshot.contactExposure = analyzeContactExposure(page.html);
    const hints = await lookupPublicEdgeHints(origin.hostname);
    snapshot.siteSetup = analyzeSiteSetup({
      html: page.html,
      headers: page.headers,
      nameservers: hints.nameservers,
      cname: hints.cname,
    });
    setCachedSocialSnapshot(target, snapshot);
    return response({ snapshot, cached: false });
  } catch (error) {
    if (error instanceof PublicTargetError) return response({ error: error.message }, 422);
    if (error instanceof WebsiteFetchError) return response({ error: error.message }, 422);
    return response({ error: "The social presence snapshot could not be completed." }, 500);
  }
}
