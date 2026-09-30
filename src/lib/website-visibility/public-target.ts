import { isIP } from "node:net";

const BLOCKED_HOST_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".test",
  ".invalid",
  ".example",
  ".onion",
] as const;

export class PublicTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PublicTargetError";
  }
}

/** Normalize a public page URL without retaining query parameters or credentials. */
export function normalizePublicTarget(input: unknown): URL {
  if (typeof input !== "string" || !input.trim()) {
    throw new PublicTargetError("Enter a website URL to continue.");
  }

  const trimmed = input.trim();
  if (trimmed.length > 2048) {
    throw new PublicTargetError("The website URL is too long.");
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let target: URL;
  try {
    target = new URL(candidate);
  } catch {
    throw new PublicTargetError("Enter a valid public website URL.");
  }

  if (target.protocol !== "https:") {
    throw new PublicTargetError("Use an HTTPS website URL.");
  }
  if (target.username || target.password) {
    throw new PublicTargetError("Website URLs cannot include credentials.");
  }
  if (target.port && target.port !== "443") {
    throw new PublicTargetError("Website URLs cannot use a custom port.");
  }

  const hostname = target.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const blockedHostname =
    hostname === "localhost" ||
    !hostname.includes(".") ||
    isIP(hostname) !== 0 ||
    BLOCKED_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix),
    );

  if (blockedHostname) {
    throw new PublicTargetError("Enter a public website domain.");
  }

  target.hostname = hostname;
  target.port = "";
  target.username = "";
  target.password = "";
  target.search = "";
  target.hash = "";

  return target;
}
