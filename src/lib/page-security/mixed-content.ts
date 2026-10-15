export type MixedContentSignal = "none" | "found" | "unknown";

const RESOURCE_TAGS = new Set([
  "img",
  "script",
  "iframe",
  "embed",
  "object",
  "video",
  "audio",
  "source",
  "track",
  "link",
  "input",
  "form",
]);

const RESOURCE_ATTRS = new Set([
  "src",
  "href",
  "poster",
  "data",
  "srcset",
  "formaction",
  "action",
  "background",
  "xlink:href",
]);

/**
 * Detect whether an HTTPS landing page’s HTML references insecure (http://) assets.
 * Scans resource-loading tags and CSS url() only — not ordinary <a href> navigation.
 */
export function detectMixedContent(html: string, pageIsHttps: boolean): MixedContentSignal {
  if (!pageIsHttps) return "none";
  if (!html.trim()) return "unknown";

  const cleaned = html.replace(/<!--[\s\S]*?-->/g, "");

  if (hasInsecureCssUrl(cleaned)) return "found";

  const tagPattern = /<([a-zA-Z][\w:-]*)\b([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(cleaned))) {
    const name = match[1].toLowerCase();
    if (!RESOURCE_TAGS.has(name)) continue;
    const attrs = match[2] ?? "";
    if (name === "link" && !linkLoadsResource(attrs)) continue;
    if (attributesHaveInsecureUrl(attrs)) return "found";
  }

  return "none";
}

function linkLoadsResource(raw: string) {
  const rel = /(?:^|\s)rel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(raw);
  const value = (rel?.[1] ?? rel?.[2] ?? rel?.[3] ?? "").toLowerCase();
  return /\b(stylesheet|preload|modulepreload|icon|manifest|apple-touch-icon)\b/.test(value);
}

function hasInsecureCssUrl(html: string) {
  return /url\(\s*['"]?http:\/\//i.test(html);
}

function attributesHaveInsecureUrl(raw: string) {
  if (/style\s*=\s*(?:"[^"]*"|'[^']*')/i.test(raw) && hasInsecureCssUrl(raw)) return true;

  const pattern = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw))) {
    const name = match[1].toLowerCase();
    if (!RESOURCE_ATTRS.has(name)) continue;
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (name === "srcset") {
      if (srcsetHasInsecureUrl(value)) return true;
      continue;
    }
    if (isInsecureHttpUrl(value)) return true;
  }
  return false;
}

function srcsetHasInsecureUrl(value: string) {
  return value.split(",").some((part) => isInsecureHttpUrl(part.trim().split(/\s+/)[0] ?? ""));
}

function isInsecureHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^http:\/\//i.test(trimmed);
}
