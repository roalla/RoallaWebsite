import { NextRequest, NextResponse } from "next/server";
import {
  analyzePageSpeed,
  PageSpeedProviderError,
  type PageSpeedStrategy,
} from "@/lib/website-visibility/pagespeed";
import {
  normalizePublicTarget,
  PublicTargetError,
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

  let body: { url?: unknown; strategy?: unknown; website?: unknown };
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
    const strategy: PageSpeedStrategy =
      body.strategy === "desktop" ? "desktop" : "mobile";
    const cached = getCachedSnapshot(target, strategy);
    if (cached) return response({ snapshot: cached, cached: true });

    const hostRate = checkHostRate(target.hostname);
    if (!hostRate.allowed) {
      return response(
        { error: "This website was checked recently. Please try again shortly." },
        429,
        { "Retry-After": String(hostRate.retryAfterSeconds) },
      );
    }

    const snapshot = await analyzePageSpeed(target, strategy);
    setCachedSnapshot(target, strategy, snapshot);
    return response({ snapshot, cached: false });
  } catch (error) {
    if (error instanceof PublicTargetError) {
      return response({ error: error.message }, 422);
    }
    if (error instanceof PageSpeedProviderError) {
      return response({ error: error.message }, 502);
    }
    return response(
      { error: "The snapshot could not be completed. Please try again." },
      500,
    );
  }
}
