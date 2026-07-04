/**
 * Auth sync + BFF token exchange (recommended — refresh token in HttpOnly cookie).
 */
const express = require("express");
const cookieParser = require("cookie-parser");
const {
  REFRESH_COOKIE,
  ACCESS_COOKIE,
  syncHubUser,
  exchangeWithHub,
  applyAuthCookies,
  clearAuthCookies,
  fetchSiblingApps,
} = require("../core/bff");

function createAuthSyncRouter({ db, mail, requireAuth, optionalAuth } = {}) {
  if (!requireAuth || !optionalAuth) {
    ({ requireAuth, optionalAuth } = require("../middleware/platform-auth"));
  }

  const router = express.Router();
  router.use(cookieParser());

  router.post("/sync", requireAuth, async (req, res) => {
    if (!db?.configured?.()) {
      return res.status(501).json({ error: "DATABASE_URL not configured." });
    }
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
      if (token) await syncHubUser(db, mail, token);
      res.json({ ok: true, userId: req.auth.userId });
    } catch (err) {
      console.error("POST /api/auth/sync", err);
      res.status(500).json({ error: "Could not sync user." });
    }
  });

  async function exchangeAndRespond(res, payload) {
    const { ok, status, data } = await exchangeWithHub(payload);
    if (!ok) return res.status(status).json(data);
    if (data.access_token) {
      try {
        await syncHubUser(db, mail, data.access_token);
      } catch (err) {
        console.error("auto user sync", err);
      }
    }
    applyAuthCookies((name, value, opts) => res.cookie(name, value, opts), data);
    res.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      token_type: data.token_type,
    });
  }

  router.post("/token", async (req, res) => {
    if (!process.env.AUTH_URL || !process.env.AUTH_CLIENT_ID) {
      return res.status(501).json({ error: "Auth not configured." });
    }
    try {
      await exchangeAndRespond(res, {
        grant_type: "authorization_code",
        code: req.body?.code,
        code_verifier: req.body?.code_verifier,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/refresh", async (req, res) => {
    const refresh = req.cookies?.[REFRESH_COOKIE] || req.body?.refresh_token;
    if (!refresh) return res.status(401).json({ error: "No refresh token." });
    try {
      await exchangeAndRespond(res, { grant_type: "refresh_token", refresh_token: refresh });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/logout", async (req, res) => {
    const refresh = req.cookies?.[REFRESH_COOKIE];
    if (refresh && process.env.AUTH_URL) {
      try {
        const { hubFetch } = require("../core/bff");
        await hubFetch("/api/logout", { refresh_token: refresh, all_devices: !!req.body?.all_devices });
      } catch (_) {}
    }
    clearAuthCookies((name, value, opts) => res.clearCookie(name, opts));
    res.json({ ok: true });
  });

  router.get("/session", optionalAuth, (req, res) => {
    if (!req.auth?.userId) return res.json({ signedIn: false });
    res.json({
      signedIn: true,
      userId: req.auth.userId,
      email: req.auth.email,
      name: req.auth.name,
      emailVerified: req.auth.emailVerified,
    });
  });

  router.get("/sibling-apps", optionalAuth, async (req, res) => {
    if (!process.env.AUTH_URL) {
      return res.status(501).json({ error: "Auth not configured." });
    }
    try {
      const accessToken = req.cookies?.[ACCESS_COOKIE] || "";
      if (!accessToken) return res.json({ ok: true, apps: [] });
      const apps = await fetchSiblingApps(accessToken);
      res.json({ ok: true, apps });
    } catch (err) {
      res.status(502).json({ error: err.message });
    }
  });

  return router;
}

module.exports = { createAuthSyncRouter, syncHubUser, REFRESH_COOKIE, ACCESS_COOKIE };
