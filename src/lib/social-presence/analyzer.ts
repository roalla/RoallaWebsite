export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "x"
  | "pinterest"
  | "threads"
  | "bluesky";

export type SocialPresenceCheckId =
  | "profileLinks"
  | "structuredProfiles"
  | "openGraph"
  | "socialCards"
  | "organizationSchema"
  | "pageIdentity";

export type SocialPresenceSnapshot = {
  requestedUrl: string;
  finalUrl: string;
  analyzedAt: string;
  score: number;
  checks: Array<{
    id: SocialPresenceCheckId;
    status: "pass" | "partial" | "fail";
    points: number;
    maxPoints: number;
    evidence: string[];
  }>;
  agentic?: {
    score: number;
  };
  profiles: Array<{
    platform: SocialPlatform;
    url: string;
    foundIn: Array<"link" | "schema">;
  }>;
  preview: {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
  };
};

type Attributes = Record<string, string>;

const PLATFORM_HOSTS: Array<[SocialPlatform, RegExp]> = [
  ["facebook", /(^|\.)facebook\.com$/],
  ["instagram", /(^|\.)instagram\.com$/],
  ["linkedin", /(^|\.)linkedin\.com$/],
  ["youtube", /(^|\.)(youtube\.com|youtu\.be)$/],
  ["tiktok", /(^|\.)tiktok\.com$/],
  ["x", /(^|\.)(x\.com|twitter\.com)$/],
  ["pinterest", /(^|\.)(pinterest\.[a-z.]+|pin\.it)$/],
  ["threads", /(^|\.)threads\.net$/],
  ["bluesky", /(^|\.)bsky\.app$/],
];

function decode(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function attributes(tag: string): Attributes {
  const result: Attributes = {};
  const pattern = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(tag))) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function firstMeta(html: string, key: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if ((attrs.property || attrs.name)?.toLowerCase() === key.toLowerCase()) {
      return attrs.content?.trim() || undefined;
    }
  }
  return undefined;
}

function firstLink(html: string, rel: string) {
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const attrs = attributes(tag);
    if (attrs.rel?.toLowerCase().split(/\s+/).includes(rel)) return attrs.href?.trim();
  }
  return undefined;
}

function platformFor(rawUrl: string, baseUrl: string) {
  try {
    const url = new URL(rawUrl, baseUrl);
    if (url.protocol !== "https:") return undefined;
    const match = PLATFORM_HOSTS.find(([, pattern]) => pattern.test(url.hostname.toLowerCase()));
    if (!match) return undefined;
    const path = url.pathname.toLowerCase();
    const looksLikeProfile = (() => {
      switch (match[0]) {
        case "facebook":
          return path !== "/" && !/^\/(sharer|share\.php|dialog|plugins)(\/|$)/.test(path);
        case "instagram":
          return path !== "/" && !/^\/(p|reel|reels|stories|explore)(\/|$)/.test(path);
        case "linkedin":
          return path !== "/" && !/^\/(sharing|feed|posts)(\/|$)/.test(path);
        case "youtube":
          return /^\/(?:@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)\/?$/.test(path);
        case "tiktok":
        case "threads":
          return /^\/@[^/]+\/?$/.test(path);
        case "x":
          return !/^\/(intent|share|home|search)(\/|$)/.test(path) && path !== "/";
        case "pinterest":
          return !/^\/pin(\/|$)/.test(path) && path !== "/";
        case "bluesky":
          return /^\/profile\/[^/]+\/?$/.test(path);
      }
    })();
    if (!looksLikeProfile) return undefined;
    url.hash = "";
    url.search = "";
    return { platform: match[0], url: url.toString().replace(/\/$/, "") };
  } catch {
    return undefined;
  }
}

function collectSchema(html: string) {
  const sameAs: string[] = [];
  let organizationName: string | undefined;
  let organizationLogo: string | undefined;

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    const item = value as Record<string, unknown>;
    const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
    const isOrganization = types.some(
      (type) =>
        typeof type === "string" &&
        /^(Organization|Corporation|LocalBusiness|ProfessionalService)$/i.test(type),
    );
    if (isOrganization) {
      if (typeof item.name === "string") organizationName ??= item.name;
      if (typeof item.logo === "string") organizationLogo ??= item.logo;
      if (item.logo && typeof item.logo === "object") {
        const logo = item.logo as Record<string, unknown>;
        if (typeof logo.url === "string") organizationLogo ??= logo.url;
      }
      const values = Array.isArray(item.sameAs) ? item.sameAs : [item.sameAs];
      for (const entry of values) if (typeof entry === "string") sameAs.push(entry);
    }
    Object.values(item).forEach(visit);
  }

  const scriptPattern =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptPattern.exec(html))) {
    try {
      visit(JSON.parse(match[1].trim()));
    } catch {
      // Invalid JSON-LD is treated as absent rather than failing the full snapshot.
    }
  }
  return { sameAs, organizationName, organizationLogo };
}

function status(points: number, maxPoints: number) {
  return points === maxPoints ? "pass" : points > 0 ? "partial" : "fail";
}

export function analyzeSocialPresence(
  html: string,
  requestedUrl: string,
  finalUrl = requestedUrl,
): SocialPresenceSnapshot {
  const schema = collectSchema(html);
  const sources = new Map<string, { platform: SocialPlatform; url: string; foundIn: Set<"link" | "schema"> }>();

  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const profile = platformFor(attributes(tag).href ?? "", finalUrl);
    if (!profile) continue;
    const key = `${profile.platform}:${profile.url.toLowerCase()}`;
    const entry = sources.get(key) ?? { ...profile, foundIn: new Set<"link" | "schema">() };
    entry.foundIn.add("link");
    sources.set(key, entry);
  }
  for (const rawUrl of schema.sameAs) {
    const profile = platformFor(rawUrl, finalUrl);
    if (!profile) continue;
    const key = `${profile.platform}:${profile.url.toLowerCase()}`;
    const entry = sources.get(key) ?? { ...profile, foundIn: new Set<"link" | "schema">() };
    entry.foundIn.add("schema");
    sources.set(key, entry);
  }

  const profiles = Array.from(sources.values()).map((profile) => ({
    platform: profile.platform,
    url: profile.url,
    foundIn: Array.from(profile.foundIn),
  }));
  const linkedProfiles = profiles.filter((profile) => profile.foundIn.includes("link"));
  const schemaProfiles = profiles.filter((profile) => profile.foundIn.includes("schema"));
  const linkedPlatforms = new Set(linkedProfiles.map((profile) => profile.platform));
  const schemaPlatforms = new Set(schemaProfiles.map((profile) => profile.platform));

  const og = {
    title: firstMeta(html, "og:title"),
    description: firstMeta(html, "og:description"),
    image: firstMeta(html, "og:image"),
    url: firstMeta(html, "og:url"),
    type: firstMeta(html, "og:type"),
    siteName: firstMeta(html, "og:site_name"),
  };
  const cards = {
    card: firstMeta(html, "twitter:card"),
    title: firstMeta(html, "twitter:title"),
    description: firstMeta(html, "twitter:description"),
    image: firstMeta(html, "twitter:image"),
  };
  const title = decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
  const description = firstMeta(html, "description");
  const canonical = firstLink(html, "canonical");

  const checks: SocialPresenceSnapshot["checks"] = [];
  const profilePoints = linkedPlatforms.size >= 2 ? 20 : linkedPlatforms.size ? 10 : 0;
  checks.push({
    id: "profileLinks",
    status: status(profilePoints, 20),
    points: profilePoints,
    maxPoints: 20,
    evidence: Array.from(linkedPlatforms),
  });

  const schemaPoints = schemaPlatforms.size >= 2 ? 15 : schemaPlatforms.size ? 8 : 0;
  checks.push({
    id: "structuredProfiles",
    status: status(schemaPoints, 15),
    points: schemaPoints,
    maxPoints: 15,
    evidence: Array.from(schemaPlatforms),
  });

  const ogFields = Object.entries(og).filter(([, value]) => Boolean(value));
  const ogPoints = Math.round((ogFields.length / 6) * 25);
  checks.push({
    id: "openGraph",
    status: status(ogPoints, 25),
    points: ogPoints,
    maxPoints: 25,
    evidence: ogFields.map(([key]) => key),
  });

  const cardFields = Object.entries(cards).filter(([, value]) => Boolean(value));
  const cardPoints = Math.round((cardFields.length / 4) * 15);
  checks.push({
    id: "socialCards",
    status: status(cardPoints, 15),
    points: cardPoints,
    maxPoints: 15,
    evidence: cardFields.map(([key]) => key),
  });

  const organizationEvidence = [
    schema.organizationName ? "name" : undefined,
    schema.organizationLogo ? "logo" : undefined,
  ].filter((value): value is string => Boolean(value));
  const organizationPoints = organizationEvidence.length * 5;
  checks.push({
    id: "organizationSchema",
    status: status(organizationPoints, 10),
    points: organizationPoints,
    maxPoints: 10,
    evidence: organizationEvidence,
  });

  const identityEvidence = [title ? "title" : undefined, description ? "description" : undefined, canonical ? "canonical" : undefined].filter(
    (value): value is string => Boolean(value),
  );
  const identityPoints = identityEvidence.length * 5;
  checks.push({
    id: "pageIdentity",
    status: status(identityPoints, 15),
    points: identityPoints,
    maxPoints: 15,
    evidence: identityEvidence,
  });

  return {
    requestedUrl,
    finalUrl,
    analyzedAt: new Date().toISOString(),
    score: checks.reduce((total, check) => total + check.points, 0),
    checks,
    profiles,
    preview: {
      title: og.title || cards.title || title || undefined,
      description: og.description || cards.description || description,
      image: og.image || cards.image,
      siteName: og.siteName || schema.organizationName,
    },
  };
}
