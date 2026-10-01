import { NextRequest, NextResponse } from "next/server";
import { inspectDomain } from "@/lib/domain-health/lookup";
import { mailDomain, type DomainHealthSnapshot } from "@/lib/domain-health/evaluate";
import { checkClientRate, getClientId } from "@/lib/website-visibility/snapshot-guard";
import { normalizePublicTarget, PublicTargetError } from "@/lib/website-visibility/public-target";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; value: DomainHealthSnapshot }>();

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

function cachedSnapshot(domain: string) {
  const entry = cache.get(domain);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(domain);
    return undefined;
  }
  return entry.value;
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
    const domain = mailDomain(target.hostname);
    const cached = cachedSnapshot(domain);
    if (cached) return response({ snapshot: cached, cached: true });

    const snapshot = await inspectDomain(domain);
    cache.set(domain, { expiresAt: Date.now() + CACHE_TTL_MS, value: snapshot });
    return response({ snapshot, cached: false });
  } catch (error) {
    if (error instanceof PublicTargetError) return response({ error: error.message }, 422);
    return response({ error: "The domain health check could not be completed." }, 500);
  }
}
