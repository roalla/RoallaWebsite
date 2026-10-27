/**
 * Shared BFF token exchange logic (Express + Next.js).
 */
const { decodeJwt } = require("jose");

const REFRESH_COOKIE = "roalla_refresh";
const ACCESS_COOKIE = "roalla_access";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
const REFRESH_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/** Server-side hub API base (use when AUTH_URL is public-only and DNS differs on the host). */
function hubBaseUrl() {
  return (process.env.AUTH_HUB_URL || process.env.AUTH_URL || "").replace(/\/$/, "");
}

function hubFetch(path, body) {
  const authUrl = hubBaseUrl();
  return fetch(`${authUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: process.env.AUTH_CLIENT_ID, ...body }),
  });
}

async function hubGet(path, extraHeaders = {}) {
  const authUrl = hubBaseUrl();
  return fetch(`${authUrl}${path}`, {
    headers: { Accept: "application/json", ...extraHeaders },
  });
}

async function syncHubUser(db, mail, accessToken) {
  if (!db?.configured?.() || !accessToken) return;

  let payload;
  try {
    payload = decodeJwt(accessToken);
  } catch (_) {
    return;
  }

  const userId = payload.sub;
  if (!userId) return;

  const email = payload.email || "";
  const name = payload.name || "";

  const isNew = await db.query(`SELECT 1 FROM users WHERE id = $1`, [userId]);
  await db.query(
    `INSERT INTO users (id, email, name) VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET
       email = COALESCE(NULLIF(EXCLUDED.email,''), users.email),
       name = COALESCE(NULLIF(EXCLUDED.name,''), users.name),
       updated_at = NOW()`,
    [userId, email, name]
  );

  if (!isNew.rowCount && mail?.sendWelcome) {
    mail.sendWelcome({ email, name }).catch(() => {});
  }
}

async function exchangeWithHub(payload) {
  const upstream = await hubFetch("/oauth/token", payload);
  const data = await upstream.json();
  return { ok: upstream.ok, status: upstream.status, data };
}

function accessCookieMaxAge(expiresInSeconds) {
  const sec = Number(expiresInSeconds) || 900;
  return Math.max(60, Math.min(sec, 3600)) * 1000;
}

function authCookieOptions(maxAgeMs) {
  return { ...COOKIE_OPTS, maxAge: maxAgeMs };
}

function safeRelativePath(nextRaw, fallback = "/") {
  const raw = String(nextRaw || "").trim() || fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}

function escapeHtmlText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function withQueryParam(relativePath, key, value) {
  const path = safeRelativePath(relativePath, "/");
  try {
    const url = new URL(path, "https://bff.invalid");
    url.searchParams.set(key, value);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (_) {
    return path;
  }
}

function htmlBridgeRedirect(relativePath, message = "Signing you in…") {
  const target = safeRelativePath(relativePath, "/");
  const attr = target
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const json = JSON.stringify(target);
  return {
    status: 200,
    target,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Referrer-Policy": "no-referrer",
      Pragma: "no-cache",
    },
    body:
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>` +
      `<meta name="referrer" content="no-referrer"/>` +
      `<meta http-equiv="refresh" content="0;url=${attr}"/>` +
      `<title>Signing in</title></head><body><p>${escapeHtmlText(message)}</p>` +
      `<script>location.replace(${json});</script></body></html>`,
  };
}

function isSpeculativePrefetch(getHeader) {
  if (typeof getHeader !== "function") return false;
  const purpose = String(getHeader("purpose") || "").toLowerCase();
  const secPurpose = String(getHeader("sec-purpose") || "").toLowerCase();
  return purpose === "prefetch" || secPurpose.includes("prefetch");
}

async function exchangeSsoHandoff({ token, db, mail, getHeader } = {}) {
  if (isSpeculativePrefetch(getHeader)) return { prefetch: true, ok: false, data: null };
  const upstream = await hubFetch("/api/session/sso-handoff/exchange", { token });
  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok || !data.access_token) return { prefetch: false, ok: false, data };
  try {
    await syncHubUser(db, mail, data.access_token);
  } catch (err) {
    console.error("sso handoff user sync", err);
  }
  return { prefetch: false, ok: true, data };
}

function clearAuthCookies(setCookie) {
  setCookie(REFRESH_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  setCookie(ACCESS_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
}

function applyAuthCookies(setCookie, data) {
  if (data.refresh_token) {
    setCookie(REFRESH_COOKIE, data.refresh_token, authCookieOptions(REFRESH_MAX_AGE_MS));
  }
  if (data.access_token) {
    setCookie(ACCESS_COOKIE, data.access_token, authCookieOptions(accessCookieMaxAge(data.expires_in)));
  }
}

async function fetchSiblingApps(accessToken) {
  const clientId = process.env.AUTH_CLIENT_ID || "";
  const q = clientId ? `?exclude=${encodeURIComponent(clientId)}` : "";
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await hubGet(`/api/internal-apps${q}`, headers);
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) return [];
  if (!res.ok) throw new Error(body.error || "Could not load internal apps.");
  return body.apps || [];
}

async function hubPostWithAuth(path, accessToken, body) {
  const authUrl = hubBaseUrl();
  if (!authUrl) throw new Error("AUTH_URL not configured.");
  return fetch(`${authUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}

module.exports = {
  REFRESH_COOKIE,
  ACCESS_COOKIE,
  COOKIE_OPTS,
  hubBaseUrl,
  hubFetch,
  hubGet,
  syncHubUser,
  safeRelativePath,
  withQueryParam,
  htmlBridgeRedirect,
  exchangeSsoHandoff,
  exchangeWithHub,
  applyAuthCookies,
  clearAuthCookies,
  accessCookieMaxAge,
  fetchSiblingApps,
  hubPostWithAuth,
};
