/**
 * Platform Auth — browser client (BFF mode: tokens via app backend).
 */
(function (global) {
  const BFF = true;

  function storageKey(suffix) {
    const id = config.authClientId || "default";
    return `pa-${id}-${suffix}`;
  }

  let config = { authEnabled: false, authUrl: "", authClientId: "", bffMode: BFF };
  let user = null;
  let ready = false;
  let tokenExpiresAt = 0;
  let refreshTimer = null;
  const listeners = [];

  function emit() {
    listeners.forEach((fn) => {
      try { fn(); } catch (_) {}
    });
  }

  function onChange(fn) {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function storageGet(key) {
    try { return sessionStorage.getItem(key) || localStorage.getItem(key); } catch (_) { return ""; }
  }

  function storageSet(key, value, persistent) {
    try {
      const store = persistent ? localStorage : sessionStorage;
      if (value == null) store.removeItem(key);
      else store.setItem(key, value);
    } catch (_) {}
  }

  function base64Url(buf) {
    const bytes = new Uint8Array(buf);
    let str = "";
    bytes.forEach((b) => { str += String.fromCharCode(b); });
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  async function sha256(input) {
    const data = new TextEncoder().encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return base64Url(hash);
  }

  function randomVerifier() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return base64Url(bytes);
  }

  function parseJwtExp(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.exp ? payload.exp * 1000 : 0;
    } catch (_) {
      return 0;
    }
  }

  async function loadConfig() {
    try {
      const res = await fetch("/api/config");
      if (res.ok) config = { ...config, ...(await res.json()) };
    } catch (_) {}
    return config;
  }

  function isAuthConfigured() {
    return !!(config.authEnabled && config.authUrl && config.authClientId);
  }

  function isSignedIn() {
    return !!user && !!storageGet(storageKey("access-token"));
  }

  function userId() { return user?.userId || ""; }
  function userEmail() { return user?.email || ""; }
  function userLabel() { return user?.name || user?.email || "Account"; }
  function userImageUrl() { return ""; }

  async function getToken() {
    await ensureFreshToken();
    return storageGet(storageKey("access-token")) || null;
  }

  async function authHeaders(extra) {
    const headers = { ...(extra || {}) };
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const orgId = activeOrgId();
    if (orgId) headers["X-Organization-Id"] = orgId;
    return headers;
  }

  function activeOrgId() {
    try { return localStorage.getItem("cb-active-org-id") || ""; } catch (_) { return ""; }
  }

  function setActiveOrgId(id) {
    try {
      if (id) localStorage.setItem("cb-active-org-id", id);
      else localStorage.removeItem("cb-active-org-id");
      emit();
    } catch (_) {}
  }

  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    const token = storageGet(storageKey("access-token"));
    if (!token) return;
    tokenExpiresAt = parseJwtExp(token) || tokenExpiresAt;
    const ms = tokenExpiresAt - Date.now() - 60000;
    if (ms <= 0) {
      refreshAccessToken().catch(() => signOut());
      return;
    }
    refreshTimer = setTimeout(() => {
      refreshAccessToken().catch(() => signOut());
    }, ms);
  }

  async function refreshAccessToken() {
    const url = BFF ? "/api/auth/refresh" : `${config.authUrl}/oauth/token`;
    const body = BFF
      ? {}
      : {
          grant_type: "refresh_token",
          client_id: config.authClientId,
          refresh_token: storageGet(storageKey("refresh-token")),
        };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: BFF ? "include" : "omit",
      body: BFF ? undefined : JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || "Refresh failed.");
    storageSet(storageKey("access-token"), payload.access_token, false);
    if (!BFF && payload.refresh_token) {
      storageSet(storageKey("refresh-token"), payload.refresh_token, true);
    }
    tokenExpiresAt = Date.now() + (payload.expires_in || 900) * 1000;
    scheduleRefresh();
    return payload.access_token;
  }

  async function ensureFreshToken() {
    const token = storageGet(storageKey("access-token"));
    if (!token) return null;
    const exp = parseJwtExp(token);
    if (exp && exp - Date.now() < 60000) {
      return refreshAccessToken();
    }
    return token;
  }

  async function fetchMe() {
    const token = await getToken();
    if (!token) { user = null; return null; }
    try {
      const res = await fetch("/api/me", { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
      if (!res.ok) { user = null; return null; }
      const data = await res.json();
      user = { userId: data.userId || data.sub, email: data.email, name: data.name };
      return user;
    } catch (_) {
      user = null;
      return null;
    }
  }

  async function exchangeCode(code, verifier) {
    const url = BFF ? "/api/auth/token" : `${config.authUrl}/oauth/token`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: BFF ? "include" : "omit",
      body: JSON.stringify(
        BFF
          ? { code, code_verifier: verifier }
          : {
              grant_type: "authorization_code",
              client_id: config.authClientId,
              code,
              code_verifier: verifier,
            }
      ),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || "Token exchange failed.");
    storageSet(storageKey("access-token"), payload.access_token, false);
    if (!BFF && payload.refresh_token) {
      storageSet(storageKey("refresh-token"), payload.refresh_token, true);
    }
    tokenExpiresAt = Date.now() + (payload.expires_in || 900) * 1000;
    scheduleRefresh();
    return payload;
  }

  async function handleAuthCallback() {
    const params = new URLSearchParams(global.location.search);
    const code = params.get("code");
    if (!code) return false;
    const verifier = storageGet(storageKey("code-verifier"));
    if (!verifier) return false;
    await exchangeCode(code, verifier);
    storageSet(storageKey("code-verifier"), null, false);
    params.delete("code");
    const clean = params.toString();
    const path = global.location.pathname + (clean ? `?${clean}` : "") + global.location.hash;
    global.history.replaceState({}, "", path);
    return true;
  }

  function signInUrl(returnTo, opts) {
    const url = new URL("login.html", global.location.href);
    if (returnTo) url.searchParams.set("return", returnTo);
    if (opts?.invite) url.searchParams.set("invite", opts.invite);
    return url.pathname + url.search;
  }

  async function startAuthorize(returnTo) {
    const verifier = randomVerifier();
    const challenge = await sha256(verifier);
    storageSet(storageKey("code-verifier"), verifier, false);
    const returnUrl = returnTo
      ? new URL(returnTo, global.location.href).toString()
      : global.location.href;
    const q = new URLSearchParams({
      client_id: config.authClientId,
      return_url: returnUrl,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    global.location.href = `${config.authUrl}/authorize?${q}`;
  }

  async function signOut() {
    if (BFF) {
      try {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      } catch (_) {}
    } else {
      const refresh = storageGet(storageKey("refresh-token"));
      if (refresh && config.authUrl) {
        try {
          await fetch(`${config.authUrl}/api/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: config.authClientId, refresh_token: refresh }),
            credentials: "include",
          });
        } catch (_) {}
      }
      storageSet(storageKey("refresh-token"), null, true);
    }
    if (refreshTimer) clearTimeout(refreshTimer);
    storageSet(storageKey("access-token"), null, false);
    user = null;
    emit();
  }

  async function init() {
    if (ready) return isAuthConfigured() && isSignedIn();
    await loadConfig();
    if (!isAuthConfigured()) {
      ready = true;
      emit();
      return false;
    }
    try {
      await handleAuthCallback();
      await fetchMe();
      scheduleRefresh();
      ready = true;
      emit();
      return isSignedIn();
    } catch (err) {
      console.warn("Platform auth init failed:", err?.message || err);
      ready = true;
      emit();
      return false;
    }
  }

  async function mountSignIn(container, options) {
    if (!container) return false;
    const ok = await init();
    if (!ok && !isAuthConfigured()) return false;
    const params = new URLSearchParams(global.location.search);
    const returnTo = options?.returnTo || params.get("return") || "/dashboard";
    if (isSignedIn()) {
      global.location.href = returnTo;
      return true;
    }
    container.innerHTML = "<p>Redirecting to sign in…</p>";
    await startAuthorize(returnTo);
    return true;
  }

  async function fetchSiblingApps() {
    await loadConfig();
    if (!isAuthConfigured()) return [];
    try {
      const res = await fetch("/api/auth/sibling-apps", { credentials: "include", headers: { Accept: "application/json" } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.apps || [];
    } catch (_) {
      return [];
    }
  }

  async function mountAppsSwitcher(container, options) {
    if (!container) return [];
    const apps = await fetchSiblingApps();
    if (!apps.length) {
      container.innerHTML = "";
      return apps;
    }
    const label = options?.label || "Roalla apps";
    const links = apps
      .map((app) => {
        const name = app.brand_name || app.name || app.client_id;
        const href = app.app_url || "#";
        const logo = app.logo_url
          ? `<img src="${app.logo_url}" alt="" width="18" height="18" style="border-radius:4px" />`
          : "";
        return `<a href="${href}" class="roalla-app-link" data-client-id="${app.client_id}">${logo}<span>${name}</span></a>`;
      })
      .join("");
    container.innerHTML = `<nav class="roalla-apps-switcher" aria-label="${label}">${links}</nav>`;
    if (!document.getElementById("roalla-apps-switcher-style")) {
      const style = document.createElement("style");
      style.id = "roalla-apps-switcher-style";
      style.textContent = `
        .roalla-apps-switcher { display:flex; flex-wrap:wrap; gap:.5rem; align-items:center; }
        .roalla-app-link { display:inline-flex; align-items:center; gap:.4rem; padding:.35rem .65rem;
          border:1px solid rgba(127,127,127,.25); border-radius:8px; text-decoration:none; font-size:.875rem; }
        .roalla-app-link:hover { background:rgba(127,127,127,.08); }
      `;
      document.head.appendChild(style);
    }
    return apps;
  }

  global.AppAuth = {
    init,
    onChange,
    isAuthConfigured,
    isSignedIn,
    userId,
    userEmail,
    userLabel,
    userImageUrl,
    getToken,
    authHeaders,
    signInUrl,
    signUpUrl: signInUrl,
    mountSignIn,
    fetchSiblingApps,
    mountAppsSwitcher,
    signOut,
    startAuthorize,
    activeOrgId,
    setActiveOrgId,
    getOrgs: () => [],
    fetchOrgs: async () => [],
    activeOrgRole: () => "",
    activeOrgName: () => "",
    canAccessAdmin: () => false,
    isReady: () => ready,
    config: () => ({ ...config }),
  };
})(window);
