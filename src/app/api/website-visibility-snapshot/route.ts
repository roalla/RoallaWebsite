import { NextRequest, NextResponse } from "next/server";
import {
  pageSpeedUserAgent,
  PageSpeedProviderError,
  scorePublicPage,
  type PageSpeedStrategy,
} from "@/lib/website-visibility/pagespeed";
import {
  normalizePublicTarget,
  PublicTargetError,
  resolvePublicFinalUrl,
} from "@/lib/website-visibility/public-target";
import {
  checkClientRate,
  checkHostRate,
  getCachedSnapshot,
  getClientId,
  setCachedSnapshot,
} from "@/lib/website-visibility/snapshot-guard";

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

  const clientRate = checkClientRate(getClientId(request.headers));
  if (!clientRate.allowed) {
    return response(
      { error: "Too many snapshots. Please try again shortly." },
      429,
      { "Retry-After": String(clientRate.retryAfterSeconds) },
    );
  }

  let body: { url?: unknown; website?: unknown; fresh?: unknown };
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
    const forceFresh = body.fresh === true;
    const strategies: PageSpeedStrategy[] = ["mobile", "desktop"];
    const ready = await Promise.all(
      strategies.map(async (strategy) => {
        let analyzedTarget = target;
        try {
          analyzedTarget = await resolvePublicFinalUrl(target, {
            userAgent: pageSpeedUserAgent(strategy),
          });
        } catch {
          analyzedTarget = target;
        }
        return {
          strategy,
          analyzedTarget,
          snapshot: forceFresh ? undefined : getCachedSnapshot(analyzedTarget, strategy),
        };
      }),
    );

    if (ready.some((item) => !item.snapshot)) {
      const hostRate = checkHostRate(target.hostname);
      if (!hostRate.allowed) {
        return response(
          { error: "This website was checked recently. Please try again shortly." },
          429,
          { "Retry-After": String(hostRate.retryAfterSeconds) },
        );
      }
    }

    const settled = await Promise.allSettled(
      ready.map(async (item) => {
        const requestedUrl = target.toString();
        if (item.snapshot) {
          return {
            strategy: item.strategy,
            snapshot: { ...item.snapshot, requestedUrl },
            cached: true,
          };
        }
        const scored = await scorePublicPage(item.analyzedTarget, item.strategy);
        setCachedSnapshot(scored.cacheUrl, item.strategy, scored.snapshot);
        if (scored.cacheUrl.toString() !== item.analyzedTarget.toString()) {
          setCachedSnapshot(item.analyzedTarget, item.strategy, scored.snapshot);
        }
        return {
          strategy: item.strategy,
          snapshot: { ...scored.snapshot, requestedUrl },
          cached: false,
        };
      }),
    );

    const reports: Record<string, { snapshot?: unknown; cached?: boolean; error?: string }> = {};
    for (const result of settled) {
      if (result.status === "fulfilled") {
        reports[result.value.strategy] = {
          snapshot: result.value.snapshot,
          cached: result.value.cached,
        };
        continue;
      }
      const reason = result.reason;
      const message =
        reason instanceof PageSpeedProviderError
          ? reason.message
          : "The snapshot could not be completed. Please try again.";
      const strategy = strategies[settled.indexOf(result)];
      reports[strategy] = { error: message };
    }

    const completed = strategies.filter((strategy) => reports[strategy]?.snapshot);
    if (!completed.length) {
      const message =
        reports.mobile?.error ||
        reports.desktop?.error ||
        "The snapshot could not be completed. Please try again.";
      return response({ error: message, mobile: reports.mobile, desktop: reports.desktop }, 503);
    }

    return response({
      mobile: reports.mobile,
      desktop: reports.desktop,
      freshRequested: forceFresh,
    });
  } catch (error) {
    if (error instanceof PublicTargetError) {
      return response({ error: error.message }, 422);
    }
    if (error instanceof PageSpeedProviderError) {
      // 503 keeps the JSON body. Cloudflare replaces an origin 502 with plain text "error code: 502".
      return response({ error: error.message }, 503);
    }
    return response(
      { error: "The snapshot could not be completed. Please try again." },
      500,
    );
  }
}
