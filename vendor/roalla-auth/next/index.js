/**
 * Next.js App Router auth helpers (BFF mode).
 */
const { createRemoteJWKSet, jwtVerify } = require("jose");
const {
  REFRESH_COOKIE,
  ACCESS_COOKIE,
  syncHubUser,
  exchangeWithHub,
  applyAuthCookies,
  clearAuthCookies,
  fetchSiblingApps,
  hubFetch,
  hubPostWithAuth,
} = require("../core/bff");

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

function readCookie(request, name) {
  return request.cookies.get(name)?.value || "";
}

function setCookieHeader(name, value, opts) {
  const parts = [`${name}=${value || ""}`];
  parts.push(`Path=${opts.path || "/"}`);
  if (opts.maxAge === 0) parts.push("Max-Age=0");
  else if (opts.maxAge) parts.push(`Max-Age=${Math.floor(opts.maxAge / 1000)}`);
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

function applyCookiesToResponse(response, setCookieFn) {
  const headers = new Headers(response.headers);
  const cookies = [];
  setCookieFn((name, value, opts) => {
    cookies.push(setCookieHeader(name, value, opts));
  });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(response.body, { status: response.status, headers });
}

let jwks = null;

function getJwks() {
  if (!jwks) {
    const base = (process.env.AUTH_HUB_URL || process.env.AUTH_URL || "").replace(/\/$/, "");
    jwks = createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`));
  }
  return jwks;
}

function getIssuer() {
  return (process.env.AUTH_ISSUER || process.env.AUTH_URL || "").replace(/\/$/, "");
}

async function verifyAccessToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: getIssuer(),
      audience: process.env.AUTH_CLIENT_ID,
    });
    return {
      userId: payload.sub || null,
      email: payload.email || "",
      name: payload.name || "",
      emailVerified: !!payload.email_verified,
    };
  } catch (_) {
    return null;
  }
}

async function getServerSession(request) {
  const access = readCookie(request, ACCESS_COOKIE);
  let auth = await verifyAccessToken(access);
  if (auth?.userId) return auth;

  const refresh = readCookie(request, REFRESH_COOKIE);
  if (!refresh) return null;

  const { ok, data } = await exchangeWithHub({ grant_type: "refresh_token", refresh_token: refresh });
  if (!ok || !data.access_token) return null;
  return verifyAccessToken(data.access_token);
}

function createAuthHandlers({ db, mail } = {}) {
  async function exchangeAndRespond(request, payload) {
    const { ok, status, data } = await exchangeWithHub(payload);
    if (!ok) return jsonResponse(data, status);

    if (data.access_token) {
      try {
        await syncHubUser(db, mail, data.access_token);
      } catch (err) {
        console.error("auto user sync", err);
      }
    }

    let response = jsonResponse({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    });

    return applyCookiesToResponse(response, (setCookie) => applyAuthCookies(setCookie, data));
  }

  return {
    async token(request) {
      if (!process.env.AUTH_URL || !process.env.AUTH_CLIENT_ID) {
        return jsonResponse({ error: "Auth not configured." }, 501);
      }
      const body = await request.json().catch(() => ({}));
      return exchangeAndRespond(request, {
        grant_type: "authorization_code",
        code: body.code,
        code_verifier: body.code_verifier,
      });
    },

    async refresh(request) {
      const refresh = readCookie(request, REFRESH_COOKIE);
      if (!refresh) return jsonResponse({ error: "No refresh token." }, 401);
      return exchangeAndRespond(request, { grant_type: "refresh_token", refresh_token: refresh });
    },

    async logout(request) {
      const refresh = readCookie(request, REFRESH_COOKIE);
      if (refresh && process.env.AUTH_URL) {
        try {
          await hubFetch("/api/logout", { refresh_token: refresh });
        } catch (_) {}
      }
      let response = jsonResponse({ ok: true });
      return applyCookiesToResponse(response, (setCookie) => clearAuthCookies(setCookie));
    },

    async session(request) {
      const auth = await getServerSession(request);
      if (!auth?.userId) return jsonResponse({ signedIn: false });
      return jsonResponse({
        signedIn: true,
        userId: auth.userId,
        email: auth.email,
        name: auth.name,
        emailVerified: auth.emailVerified,
      });
    },

    async sync(request) {
      const auth = await getServerSession(request);
      if (!auth?.userId) return jsonResponse({ error: "Authentication required." }, 401);
      if (!db?.configured?.()) return jsonResponse({ error: "DATABASE_URL not configured." }, 501);

      const access = readCookie(request, ACCESS_COOKIE);
      try {
        if (access) await syncHubUser(db, mail, access);
        return jsonResponse({ ok: true, userId: auth.userId });
      } catch (err) {
        console.error("POST /api/auth/sync", err);
        return jsonResponse({ error: "Could not sync user." }, 500);
      }
    },

    async siblingApps(request) {
      if (!process.env.AUTH_URL) return jsonResponse({ error: "Auth not configured." }, 501);
      try {
        const accessToken = readCookie(request, ACCESS_COOKIE);
        if (!accessToken) return jsonResponse({ ok: true, apps: [] });
        const apps = await fetchSiblingApps(accessToken);
        return jsonResponse({ ok: true, apps });
      } catch (err) {
        return jsonResponse({ error: err.message }, 502);
      }
    },

    async storageSas(request) {
      if (!process.env.AUTH_URL || !process.env.AUTH_CLIENT_ID) {
        return jsonResponse({ error: "Auth not configured." }, 501);
      }
      const auth = await getServerSession(request);
      if (!auth?.userId) return jsonResponse({ error: "Authentication required." }, 401);
      const access = readCookie(request, ACCESS_COOKIE);
      if (!access) return jsonResponse({ error: "Authentication required." }, 401);
      const body = await request.json().catch(() => ({}));
      try {
        const upstream = await hubPostWithAuth("/api/storage/sas", access, {
          client_id: process.env.AUTH_CLIENT_ID,
          ...body,
        });
        const data = await upstream.json();
        return jsonResponse(data, upstream.status);
      } catch (err) {
        return jsonResponse({ error: err.message || "Hub storage request failed." }, 502);
      }
    },
  };
}

function createAuthRouteHandlers(options) {
  const handlers = createAuthHandlers(options);
  return {
    GET: async (request) => {
      const path = new URL(request.url).pathname;
      if (path.endsWith("/session")) return handlers.session(request);
      if (path.endsWith("/sibling-apps")) return handlers.siblingApps(request);
      return jsonResponse({ error: "Not found." }, 404);
    },
    POST: async (request) => {
      const path = new URL(request.url).pathname;
      if (path.endsWith("/token")) return handlers.token(request);
      if (path.endsWith("/refresh")) return handlers.refresh(request);
      if (path.endsWith("/logout")) return handlers.logout(request);
      if (path.endsWith("/sync")) return handlers.sync(request);
      return jsonResponse({ error: "Not found." }, 404);
    },
  };
}

function createAuthMiddleware({ publicPaths = ["/", "/login", "/api/auth"] } = {}) {
  return async function authMiddleware(request) {
    const { NextResponse } = await import("next/server");
    const { pathname } = request.nextUrl;
    if (publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      return NextResponse.next();
    }
    const hasSession =
      request.cookies.get(REFRESH_COOKIE)?.value || request.cookies.get(ACCESS_COOKIE)?.value;
    if (hasSession) return NextResponse.next();
    const login = new URL("/login", request.url);
    login.searchParams.set("return", pathname);
    return NextResponse.redirect(login);
  };
}

function createStorageHandlers(options) {
  const handlers = createAuthHandlers(options);
  return {
    sas: handlers.storageSas,
  };
}

module.exports = {
  createAuthHandlers,
  createAuthRouteHandlers,
  createAuthMiddleware,
  createStorageHandlers,
  getServerSession,
  verifyAccessToken,
  REFRESH_COOKIE,
  ACCESS_COOKIE,
};
