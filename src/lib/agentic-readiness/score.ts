export type AgenticReadiness = {
  score: number;
};

const ORG_TYPES = ["organization", "localbusiness", "professionalservice", "corporation", "store"];
const OFFER_TYPES = ["faqpage", "service", "product", "offer"];
const RETRIEVAL_AGENTS = ["oai-searchbot", "chatgpt-user", "perplexitybot", "claude-searchbot", "googlebot"];

export function scoreAgenticReadiness(input: {
  html: string;
  robotsTxt?: string | null;
  llmsTxt?: string | null;
}): AgenticReadiness {
  const text = visibleText(input.html);
  const readable = text.length >= 400 ? 20 : text.length >= 160 ? 10 : 0;
  const answer = hasDirectAnswer(input.html) ? 20 : 0;
  const types = schemaTypes(input.html);
  const facts = hasBusinessFacts(input.html, types) ? 20 : types.some((type) => ORG_TYPES.includes(type)) ? 8 : 0;
  const liftable = types.some((type) => OFFER_TYPES.includes(type)) ? 15 : 0;
  const guide = agentGuidePoints(input.html, input.llmsTxt);
  const retrieval = retrievalPoints(input.robotsTxt);
  return { score: readable + answer + facts + liftable + guide + retrieval };
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

function decode(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");
}

function elementText(html: string, tag: string) {
  return Array.from(html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))).map((match) =>
    visibleText(match[1] ?? ""),
  );
}

function hasDirectAnswer(html: string) {
  const heading = elementText(html, "h1").some((value) => value.length >= 8);
  const paragraph = elementText(html, "p").some((value) => value.length >= 80);
  return heading && paragraph;
}

function schemaTypes(html: string) {
  const types: string[] = [];
  for (const match of Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  )) {
    collectTypes(parseJson(match[1] ?? ""), types);
  }
  return types;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function collectTypes(value: unknown, types: string[]) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectTypes(item, types));
    return;
  }
  const record = value as Record<string, unknown>;
  const type = record["@type"];
  const names = Array.isArray(type) ? type : type ? [type] : [];
  names.forEach((name) => {
    if (typeof name === "string") types.push(name.toLowerCase());
  });
  if (Array.isArray(record["@graph"])) collectTypes(record["@graph"], types);
}

function hasBusinessFacts(html: string, types: string[]) {
  if (!types.some((type) => ORG_TYPES.includes(type))) return false;
  for (const match of Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  )) {
    if (recordHasFacts(parseJson(match[1] ?? ""))) return true;
  }
  return false;
}

function recordHasFacts(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some((item) => recordHasFacts(item));
  const record = value as Record<string, unknown>;
  const type = record["@type"];
  const names = (Array.isArray(type) ? type : [type]).filter((name): name is string => typeof name === "string").map((name) => name.toLowerCase());
  const described = names.some((name) => ORG_TYPES.includes(name))
    && typeof record.name === "string"
    && record.name.trim().length > 1
    && (typeof record.description === "string" && record.description.trim().length >= 40
      || (record.address && typeof record.address === "object"));
  if (described) return true;
  if (Array.isArray(record["@graph"])) return recordHasFacts(record["@graph"]);
  return false;
}

function agentGuidePoints(html: string, llmsTxt?: string | null) {
  if (llmsTxt && llmsTxt.trim().length >= 40) return 15;
  if (/llms\.txt/i.test(html)) return 8;
  return 0;
}

function retrievalPoints(robotsTxt?: string | null) {
  if (!robotsTxt?.trim()) return 6;
  const groups = robotGroups(robotsTxt);
  const everyone = groups.find((group) => group.agents.includes("*"));
  if (everyone && blocksRoot(everyone.rules)) return 0;
  const retrievalBlocked = groups.some((group) =>
    group.agents.some((agent) => RETRIEVAL_AGENTS.includes(agent)) && blocksRoot(group.rules),
  );
  return retrievalBlocked ? 4 : 10;
}

function robotGroups(robotsTxt: string) {
  const groups: Array<{ agents: string[]; rules: string[] }> = [];
  let agents: string[] = [];
  let rules: string[] = [];
  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
  };
  for (const rawLine of robotsTxt.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) {
      flush();
      continue;
    }
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim().toLowerCase();
    if (field === "user-agent") {
      if (rules.length) flush();
      agents.push(value);
    } else if (field === "allow" || field === "disallow") {
      rules.push(`${field}:${value}`);
    }
  }
  flush();
  return groups;
}

function blocksRoot(rules: string[]) {
  const disallows = rules.filter((rule) => rule.startsWith("disallow:")).map((rule) => rule.slice("disallow:".length));
  const allows = rules.filter((rule) => rule.startsWith("allow:")).map((rule) => rule.slice("allow:".length));
  if (!disallows.includes("/")) return false;
  return !allows.includes("/") && !allows.includes("");
}
