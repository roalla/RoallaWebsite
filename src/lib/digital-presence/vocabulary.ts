/**
 * On-page visibility vocabulary (V1).
 * Extracts language SEO and agentic systems can latch onto from public HTML only.
 */

export const VOCABULARY_PHRASE_SOURCES = [
  "title",
  "h1",
  "h2",
  "h3",
  "metaDescription",
  "metaKeywords",
  "ogTitle",
  "ogDescription",
  "jsonLd",
  "nav",
  "faq",
] as const;

export type VocabularyPhraseSource = (typeof VOCABULARY_PHRASE_SOURCES)[number];

export type VocabularyPhrase = {
  text: string;
  sources: VocabularyPhraseSource[];
};

export type AgenticEntityKind = "organization" | "service" | "location" | "differentiator";

export type AgenticEntity = {
  kind: AgenticEntityKind;
  text: string;
};

export const VOCABULARY_GAP_IDS = [
  "missingOrganization",
  "vagueServices",
  "missingLocation",
  "thinIdentity",
  "missingDescription",
] as const;

export type VocabularyGapId = (typeof VOCABULARY_GAP_IDS)[number];

export const VOCABULARY_OPPORTUNITY_IDS = [
  "clarifyOrganization",
  "nameServices",
  "addLocation",
  "strengthenTitleH1",
  "expandMetaDescription",
  "addFaqLanguage",
  "publishNavTopics",
  "addJsonLdIdentity",
  "surfaceDifferentiators",
  "alignPrimaryTopics",
] as const;

export type VocabularyOpportunityId = (typeof VOCABULARY_OPPORTUNITY_IDS)[number];

export type VocabularyGap = {
  id: VocabularyGapId;
  severity: "high" | "medium" | "low";
};

export type VocabularyOpportunity = {
  id: VocabularyOpportunityId;
  severity: "high" | "medium" | "low";
};

export type VisibilityVocabulary = {
  phrases: VocabularyPhrase[];
  search: {
    primary: string[];
    supporting: string[];
  };
  agentic: {
    entities: AgenticEntity[];
    gaps: VocabularyGap[];
  };
  opportunities: VocabularyOpportunity[];
};

type Attributes = Record<string, string>;

const STOP = new Set([
  "a",
  "an",
  "and",
  "or",
  "the",
  "to",
  "of",
  "for",
  "in",
  "on",
  "at",
  "by",
  "with",
  "from",
  "your",
  "our",
  "we",
  "you",
  "us",
  "is",
  "are",
  "be",
  "as",
  "this",
  "that",
  "it",
  "home",
  "page",
  "accueil",
  "et",
  "le",
  "la",
  "les",
  "des",
  "un",
  "une",
  "du",
  "de",
  "pour",
  "sur",
  "avec",
  "nos",
  "votre",
  "vos",
]);

const GENERIC_SERVICE = /^(services?|products?|solutions?|about|contact|blog|news|home|accueil|produits?|à propos|apropos)$/i;
const GENERIC_ORG = /^(home|accueil|welcome|bienvenue|website|site|page|untitled)$/i;

function decode(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
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

function visibleText(html: string) {
  return decode(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function elementTexts(html: string, tag: string) {
  return Array.from(html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi")))
    .map((match) => visibleText(match[1] ?? ""))
    .filter((value) => value.length >= 2 && value.length <= 160);
}

function normalizePhrase(value: string) {
  return value.replace(/\s+/g, " ").trim().replace(/^[-–—|:·•]+|[-–—|:·•]+$/g, "").trim();
}

function phraseKey(value: string) {
  return normalizePhrase(value).toLowerCase();
}

function splitList(value: string | undefined) {
  if (!value) return [];
  return value
    .split(/[,;|•·]/)
    .map(normalizePhrase)
    .filter((part) => part.length >= 2 && part.length <= 80);
}

function addPhrase(
  map: Map<string, { text: string; sources: Set<VocabularyPhraseSource> }>,
  text: string | undefined,
  source: VocabularyPhraseSource,
) {
  const normalized = text ? normalizePhrase(text) : "";
  if (!normalized || normalized.length < 2 || normalized.length > 160) return;
  if (GENERIC_SERVICE.test(normalized) && source === "nav") return;
  const key = phraseKey(normalized);
  const entry = map.get(key) ?? { text: normalized, sources: new Set<VocabularyPhraseSource>() };
  entry.sources.add(source);
  map.set(key, entry);
}

function collectJsonLd(html: string) {
  const names: string[] = [];
  const descriptions: string[] = [];
  const abouts: string[] = [];
  const keywords: string[] = [];
  const services: string[] = [];
  const locations: string[] = [];
  const faqs: string[] = [];
  let organizationName: string | undefined;

  function typeList(item: Record<string, unknown>) {
    const raw = item["@type"];
    return (Array.isArray(raw) ? raw : [raw]).filter((value): value is string => typeof value === "string");
  }

  function pushString(target: string[], value: unknown) {
    if (typeof value === "string") {
      const normalized = normalizePhrase(value);
      if (normalized) target.push(normalized);
    }
  }

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    const item = value as Record<string, unknown>;
    const types = typeList(item).map((type) => type.toLowerCase());

    pushString(names, item.name);
    pushString(descriptions, item.description);
    if (typeof item.keywords === "string") {
      splitList(item.keywords).forEach((part) => keywords.push(part));
    } else if (Array.isArray(item.keywords)) {
      item.keywords.forEach((part) => pushString(keywords, part));
    }
    if (typeof item.about === "string") pushString(abouts, item.about);
    else if (item.about && typeof item.about === "object") {
      const about = item.about as Record<string, unknown>;
      pushString(abouts, about.name);
      pushString(abouts, about.description);
    }

    const isOrg = types.some((type) =>
      /^(organization|corporation|localbusiness|professionalservice|store)$/.test(type),
    );
    if (isOrg) {
      if (typeof item.name === "string") organizationName ??= normalizePhrase(item.name);
      const address = item.address;
      if (typeof address === "string") pushString(locations, address);
      if (address && typeof address === "object") {
        const addr = address as Record<string, unknown>;
        const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry]
          .filter((part): part is string => typeof part === "string")
          .map(normalizePhrase)
          .filter(Boolean);
        if (parts.length) locations.push(parts.join(", "));
      }
      if (typeof item.areaServed === "string") pushString(locations, item.areaServed);
      if (Array.isArray(item.areaServed)) item.areaServed.forEach((part) => {
        if (typeof part === "string") pushString(locations, part);
        else if (part && typeof part === "object") pushString(locations, (part as Record<string, unknown>).name);
      });
    }

    const isService = types.some((type) => /^(service|product|offer)$/.test(type));
    if (isService) {
      pushString(services, item.name);
      pushString(services, item.serviceType);
    }

    if (types.includes("question") || types.includes("faqpage")) {
      pushString(faqs, item.name);
      const accepted = item.acceptedAnswer;
      if (accepted && typeof accepted === "object") {
        pushString(faqs, (accepted as Record<string, unknown>).name);
      }
    }
    if (typeof item.mainEntity === "object") visit(item.mainEntity);

    Object.values(item).forEach(visit);
  }

  const scriptPattern =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = scriptPattern.exec(html))) {
    try {
      visit(JSON.parse(match[1].trim()));
    } catch {
      // Invalid JSON-LD is skipped; vocabulary still builds from visible markup.
    }
  }

  return { names, descriptions, abouts, keywords, services, locations, faqs, organizationName };
}

function collectNavLabels(html: string) {
  const labels: string[] = [];
  const navBlocks = Array.from(html.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gi)).map((match) => match[1] ?? "");
  const headerBlocks = Array.from(html.matchAll(/<header\b[^>]*>([\s\S]*?)<\/header>/gi)).map((match) => match[1] ?? "");
  const scopes = navBlocks.length ? navBlocks : headerBlocks;
  for (const scope of scopes) {
    for (const tag of scope.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []) {
      const label = visibleText(tag);
      if (label && label.length <= 48) labels.push(label);
    }
  }
  return labels;
}

function collectFaqQuestions(html: string) {
  const questions: string[] = [];
  for (const match of Array.from(html.matchAll(/<(?:summary|h2|h3)\b[^>]*>([\s\S]*?)<\/(?:summary|h2|h3)>/gi))) {
    const text = visibleText(match[1] ?? "");
    if (/\?|qui |comment |what |how |why |quand |où |when |where /i.test(text) && text.length <= 140) {
      questions.push(text);
    }
  }
  for (const details of Array.from(html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi))) {
    const summary = details[1]?.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1];
    const text = summary ? visibleText(summary) : "";
    if (text) questions.push(text);
  }
  return questions;
}

function significantTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9àâäéèêëïîôùûüçœæ\s-]/gi, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP.has(token));
}

function overlapScore(a: string, b: string) {
  const left = new Set(significantTokens(a));
  const right = new Set(significantTokens(b));
  if (!left.size || !right.size) return 0;
  let shared = 0;
  Array.from(left).forEach((token) => {
    if (right.has(token)) shared += 1;
  });
  return shared / Math.max(left.size, right.size);
}

function uniqueTexts(values: string[], limit: number) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const key = phraseKey(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(normalizePhrase(value));
    if (result.length >= limit) break;
  }
  return result;
}

function buildSearchLens(phrases: VocabularyPhrase[], title?: string, h1?: string) {
  const primarySources = new Set<VocabularyPhraseSource>(["title", "h1"]);
  const supportingSources = new Set<VocabularyPhraseSource>(["h2", "h3", "nav", "faq", "metaKeywords", "jsonLd"]);

  const primaryFromSignals = uniqueTexts(
    [
      ...(h1 ? [h1] : []),
      ...(title ? [title] : []),
      ...phrases.filter((phrase) => phrase.sources.some((source) => primarySources.has(source))).map((phrase) => phrase.text),
    ],
    4,
  );

  const supporting = uniqueTexts(
    phrases
      .filter((phrase) => phrase.sources.some((source) => supportingSources.has(source)))
      .filter((phrase) => !primaryFromSignals.some((primary) => phraseKey(primary) === phraseKey(phrase.text)))
      .map((phrase) => phrase.text),
    12,
  );

  // Prefer short topical phrases over full title strings when both exist.
  const primary = uniqueTexts(
    primaryFromSignals.flatMap((value) => {
      if (value.length <= 72) return [value];
      const shortened = value.split(/[|–—:-]/).map(normalizePhrase).filter((part) => part.length >= 4);
      return shortened.length ? shortened.slice(0, 2) : [value];
    }),
    5,
  );

  return { primary, supporting };
}

function buildAgenticLens(
  schema: ReturnType<typeof collectJsonLd>,
  phrases: VocabularyPhrase[],
  title?: string,
  description?: string,
) {
  const entities: AgenticEntity[] = [];
  const pushEntity = (kind: AgenticEntityKind, text: string | undefined) => {
    const normalized = text ? normalizePhrase(text) : "";
    if (!normalized) return;
    if (entities.some((entity) => entity.kind === kind && phraseKey(entity.text) === phraseKey(normalized))) return;
    entities.push({ kind, text: normalized });
  };

  pushEntity("organization", schema.organizationName);
  if (!schema.organizationName) {
    const ogSite = phrases.find((phrase) => phrase.sources.includes("ogTitle"))?.text;
    const fallback = normalizePhrase(ogSite || title?.split(/[|–—:-]/)[0] || "");
    if (fallback && !GENERIC_ORG.test(fallback) && fallback.length >= 3) {
      pushEntity("organization", fallback);
    }
  }

  for (const service of schema.services) pushEntity("service", service);
  for (const phrase of phrases) {
    if (phrase.sources.includes("nav") || phrase.sources.includes("h2") || phrase.sources.includes("h3")) {
      if (!GENERIC_SERVICE.test(phrase.text) && significantTokens(phrase.text).length >= 1) {
        pushEntity("service", phrase.text);
      }
    }
  }

  for (const location of schema.locations) pushEntity("location", location);

  const differentiatorSources = phrases.filter(
    (phrase) =>
      phrase.sources.includes("metaDescription") ||
      phrase.sources.includes("ogDescription") ||
      phrase.sources.includes("h1"),
  );
  for (const phrase of differentiatorSources.slice(0, 4)) {
    if (phrase.text.length >= 24) pushEntity("differentiator", phrase.text);
  }

  const gaps: VocabularyGap[] = [];
  const hasOrg = entities.some((entity) => entity.kind === "organization");
  const services = entities.filter((entity) => entity.kind === "service");
  const locations = entities.filter((entity) => entity.kind === "location");
  const differentiators = entities.filter((entity) => entity.kind === "differentiator");
  const hasIdentity = Boolean(title && description && description.length >= 40);

  if (!hasOrg) gaps.push({ id: "missingOrganization", severity: "high" });
  if (services.length === 0 || services.every((service) => GENERIC_SERVICE.test(service.text))) {
    gaps.push({ id: "vagueServices", severity: "high" });
  }
  if (locations.length === 0) gaps.push({ id: "missingLocation", severity: "medium" });
  if (!hasIdentity) gaps.push({ id: "thinIdentity", severity: "medium" });
  if (!description || description.length < 40) gaps.push({ id: "missingDescription", severity: "low" });
  if (!differentiators.length && !gaps.some((gap) => gap.id === "thinIdentity")) {
    // covered via opportunities instead when identity exists but is generic
  }

  return {
    entities: entities.slice(0, 16),
    gaps,
  };
}

function buildOpportunities(input: {
  phrases: VocabularyPhrase[];
  search: { primary: string[]; supporting: string[] };
  agentic: { entities: AgenticEntity[]; gaps: VocabularyGap[] };
  title?: string;
  h1?: string;
  description?: string;
  hasJsonLd: boolean;
  faqCount: number;
  navCount: number;
}): VocabularyOpportunity[] {
  const opportunities: VocabularyOpportunity[] = [];
  const push = (id: VocabularyOpportunityId, severity: VocabularyOpportunity["severity"]) => {
    if (opportunities.some((item) => item.id === id)) return;
    opportunities.push({ id, severity });
  };

  for (const gap of input.agentic.gaps) {
    if (gap.id === "missingOrganization") push("clarifyOrganization", "high");
    if (gap.id === "vagueServices") push("nameServices", "high");
    if (gap.id === "missingLocation") push("addLocation", "medium");
    if (gap.id === "thinIdentity") push("strengthenTitleH1", "high");
    if (gap.id === "missingDescription") push("expandMetaDescription", "medium");
  }

  if (!input.description || input.description.length < 70) push("expandMetaDescription", "medium");
  if (!input.title || !input.h1) push("strengthenTitleH1", "high");
  else if (overlapScore(input.title, input.h1) < 0.2) push("alignPrimaryTopics", "medium");
  if (input.faqCount === 0) push("addFaqLanguage", "medium");
  if (input.navCount < 2) push("publishNavTopics", "low");
  if (!input.hasJsonLd) push("addJsonLdIdentity", "high");
  if (!input.agentic.entities.some((entity) => entity.kind === "differentiator")) {
    push("surfaceDifferentiators", "medium");
  }
  if (input.search.primary.length === 0) push("strengthenTitleH1", "high");
  if (input.search.supporting.length < 3) push("nameServices", "medium");

  return opportunities.slice(0, 10);
}

export function extractVisibilityVocabulary(html: string): VisibilityVocabulary {
  const phraseMap = new Map<string, { text: string; sources: Set<VocabularyPhraseSource> }>();
  const title = normalizePhrase(decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "")) || undefined;
  const h1s = elementTexts(html, "h1");
  const h2s = elementTexts(html, "h2");
  const h3s = elementTexts(html, "h3");
  const description = firstMeta(html, "description");
  const keywords = firstMeta(html, "keywords");
  const ogTitle = firstMeta(html, "og:title");
  const ogDescription = firstMeta(html, "og:description");
  const schema = collectJsonLd(html);
  const navLabels = collectNavLabels(html);
  const faqQuestions = [...collectFaqQuestions(html), ...schema.faqs];

  addPhrase(phraseMap, title, "title");
  h1s.forEach((value) => addPhrase(phraseMap, value, "h1"));
  h2s.slice(0, 12).forEach((value) => addPhrase(phraseMap, value, "h2"));
  h3s.slice(0, 12).forEach((value) => addPhrase(phraseMap, value, "h3"));
  addPhrase(phraseMap, description, "metaDescription");
  splitList(keywords).forEach((value) => addPhrase(phraseMap, value, "metaKeywords"));
  addPhrase(phraseMap, ogTitle, "ogTitle");
  addPhrase(phraseMap, ogDescription, "ogDescription");
  [...schema.names, ...schema.descriptions, ...schema.abouts, ...schema.keywords, ...schema.services].forEach((value) =>
    addPhrase(phraseMap, value, "jsonLd"),
  );
  navLabels.slice(0, 20).forEach((value) => addPhrase(phraseMap, value, "nav"));
  faqQuestions.slice(0, 12).forEach((value) => addPhrase(phraseMap, value, "faq"));

  const phrases: VocabularyPhrase[] = Array.from(phraseMap.values()).map((entry) => ({
    text: entry.text,
    sources: Array.from(entry.sources),
  }));

  const search = buildSearchLens(phrases, title, h1s[0]);
  const agentic = buildAgenticLens(schema, phrases, title, description || ogDescription);
  const opportunities = buildOpportunities({
    phrases,
    search,
    agentic,
    title,
    h1: h1s[0],
    description: description || ogDescription,
    hasJsonLd: Boolean(schema.organizationName || schema.services.length || schema.names.length),
    faqCount: faqQuestions.length,
    navCount: navLabels.length,
  });

  return {
    phrases: phrases.slice(0, 40),
    search,
    agentic,
    opportunities,
  };
}
