export const CONTACT_EXPOSURE_SIGNALS = [
  "plainEmail",
  "mailto",
  "schemaEmail",
  "plainPhone",
  "telLink",
  "schemaPhone",
  "cloudflareObfuscation",
  "emailLeftReadable",
  "contactForm",
] as const;

export type ContactExposureSignal = (typeof CONTACT_EXPOSURE_SIGNALS)[number];

export type ContactExposure = {
  mailboxInSource: boolean;
  phoneInSource: boolean;
  contactForm: boolean;
  cloudflareObfuscated: boolean;
  emailLeftReadable: boolean;
  signals: ContactExposureSignal[];
};

const FILE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "svg",
  "avif",
  "ico",
  "css",
  "js",
  "mjs",
  "map",
  "woff",
  "woff2",
  "ttf",
  "mp4",
  "webm",
  "pdf",
]);

const MAILBOX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{3}\)[\s.-]?|\d{3}[\s.-])\d{3}[\s.-]\d{4}|\+\d{1,3}(?:[\s.-]\d{2,4}){2,5}/g;

type Attributes = Record<string, string>;

function attributes(tag: string): Attributes {
  const result: Attributes = {};
  const pattern = /([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(tag))) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return result;
}

function decodeBasicEntities(value: string) {
  return value
    .replace(/&#x0*40;/gi, "@")
    .replace(/&#0*64;/g, "@")
    .replace(/&commat;/gi, "@");
}

function normalizeWrittenObfuscation(value: string) {
  return value
    .replace(/\s*\[\s*(?:at|arobase)\s*\]\s*/gi, "@")
    .replace(/\s*\(\s*(?:at|arobase)\s*\)\s*/gi, "@")
    .replace(/\s*\{\s*(?:at|arobase)\s*\}\s*/gi, "@")
    .replace(/\s*\[\s*dot\s*\]\s*/gi, ".")
    .replace(/\s*\(\s*dot\s*\)\s*/gi, ".")
    .replace(/\s*\{\s*dot\s*\}\s*/gi, ".");
}

function stripScriptsAndStyles(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
}

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function isMailbox(value: string) {
  const candidate = value.trim();
  const match = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.([A-Z]{2,})$/i.exec(candidate);
  if (!match) return false;
  if (candidate.toLowerCase() === "email@protected.com") return false;
  return !FILE_EXTENSIONS.has(match[1].toLowerCase());
}

function collectMatches(value: string, pattern: RegExp) {
  const expression = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
  const found: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  while ((match = expression.exec(value))) {
    found.push(match);
    if (match[0] === "") expression.lastIndex += 1;
  }
  return found;
}

function hasMailbox(value: string) {
  return collectMatches(value, MAILBOX).some((match) => isMailbox(match[0]));
}

function digitCount(value: string) {
  return value.replace(/\D/g, "").length;
}

function hasPhone(value: string) {
  return collectMatches(value, PHONE).some((match) => {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const before = value[start - 1] ?? "";
    const after = value[end] ?? "";
    if (/\d/.test(before) || /\d/.test(after)) return false;
    const digits = digitCount(match[0]);
    return digits >= 10 && digits <= 15;
  });
}

function readSchema(html: string) {
  let email = false;
  let phone = false;

  function visit(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (/^email$/i.test(key) && typeof nested === "string" && isMailbox(nested)) email = true;
      if (/^telephone$/i.test(key) && typeof nested === "string" && digitCount(nested) >= 10 && digitCount(nested) <= 15) {
        phone = true;
      }
      visit(nested);
    }
  }

  const scripts = collectMatches(html, /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const script of scripts) {
    try {
      visit(JSON.parse(script[1].trim()));
    } catch {
      // Invalid JSON-LD is ignored. The rest of the page can still be checked.
    }
  }

  const microdata = collectMatches(html, /<([a-z0-9]+)\b[^>]*itemprop\s*=\s*["'](email|telephone)["'][^>]*>([\s\S]*?)(?:<\/\1>|(?=<))/gi);
  for (const item of microdata) {
    const tag = attributes(item[0]);
    const prop = item[2].toLowerCase();
    const sample = `${tag.content ?? ""} ${tag.href ?? ""} ${stripTags(item[3] ?? "")}`;
    if (prop === "email" && hasMailbox(decodeBasicEntities(sample))) email = true;
    if (prop === "telephone" && (hasPhone(sample) || (digitCount(sample) >= 10 && digitCount(sample) <= 15))) phone = true;
  }

  return { email, phone };
}

function formBlocks(html: string) {
  const blocks: string[] = [];
  const starts = collectMatches(html, /<form\b[^>]*>/gi);
  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index].index ?? 0;
    const next = starts[index + 1]?.index ?? html.length;
    const region = html.slice(start, next);
    const close = region.search(/<\/form>/i);
    blocks.push(close === -1 ? region : html.slice(start, start + close + "</form>".length));
  }
  return blocks;
}

function isSearchForm(formHtml: string) {
  const open = formHtml.match(/<form\b[^>]*>/i)?.[0] ?? "";
  const attrs = attributes(open);
  if ((attrs.role ?? "").toLowerCase() === "search") return true;
  if (/<textarea\b/i.test(formHtml)) return false;
  const inputs = collectMatches(formHtml, /<input\b[^>]*>/gi).map((match) => attributes(match[0]));
  const visible = inputs.filter((input) => {
    const type = (input.type ?? "text").toLowerCase();
    return !["hidden", "submit", "button", "image", "reset", "checkbox", "radio"].includes(type);
  });
  if (visible.length !== 1) return false;
  const field = visible[0];
  const type = (field.type ?? "text").toLowerCase();
  const name = `${field.name ?? ""} ${field.id ?? ""}`.toLowerCase();
  return type === "search" || /^(q|s|query|search)$/.test(name.trim());
}

function isContactForm(formHtml: string) {
  if (isSearchForm(formHtml)) return false;
  if (/<textarea\b/i.test(formHtml)) return true;
  const inputs = collectMatches(formHtml, /<input\b[^>]*>/gi).map((match) => attributes(match[0]));
  return inputs.some((input) => {
    const type = (input.type ?? "text").toLowerCase();
    if (["hidden", "submit", "button", "image", "reset"].includes(type)) return false;
    const name = `${input.name ?? ""} ${input.id ?? ""} ${input.placeholder ?? ""}`.toLowerCase();
    return type === "email" || type === "tel" || /\b(e-?mail|phone|tel|mobile|message|comment)\b/.test(name);
  });
}

export function analyzeContactExposure(html: string): ContactExposure {
  const decoded = decodeBasicEntities(html);
  const withoutCode = stripScriptsAndStyles(decoded);
  const visible = stripTags(withoutCode);
  const schema = readSchema(html);
  const mailto = /href\s*=\s*["']\s*mailto:/i.test(decoded);
  const telLink = /href\s*=\s*["']\s*tel:/i.test(decoded);
  const plainEmail = hasMailbox(withoutCode) || hasMailbox(normalizeWrittenObfuscation(visible));
  const plainPhone = hasPhone(visible);
  const contactForm = formBlocks(html).some(isContactForm);
  const cloudflareObfuscated = /data-cfemail\s*=|\/cdn-cgi\/l\/email-protection|__cf_email__/i.test(html);
  const mailboxInSource = plainEmail || mailto || schema.email;
  const phoneInSource = plainPhone || telLink || schema.phone;
  const emailLeftReadable = /<!--\s*email_off\s*-->/i.test(html) && mailboxInSource;

  const present: Record<ContactExposureSignal, boolean> = {
    plainEmail,
    mailto,
    schemaEmail: schema.email,
    plainPhone,
    telLink,
    schemaPhone: schema.phone,
    cloudflareObfuscation: cloudflareObfuscated,
    emailLeftReadable,
    contactForm,
  };

  return {
    mailboxInSource,
    phoneInSource,
    contactForm,
    cloudflareObfuscated,
    emailLeftReadable,
    signals: CONTACT_EXPOSURE_SIGNALS.filter((signal) => present[signal]),
  };
}
