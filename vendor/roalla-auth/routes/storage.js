/**
 * BFF proxy to hub storage SAS API (keeps Azure keys off customer apps).
 */
const express = require("express");
const { ACCESS_COOKIE, hubPostWithAuth } = require("../core/bff");

function createStorageRouter({ requireAuth } = {}) {
  if (!requireAuth) {
    ({ requireAuth } = require("../middleware/platform-auth"));
  }

  const router = express.Router();

  router.post("/sas", requireAuth, async (req, res) => {
    if (!process.env.AUTH_URL || !process.env.AUTH_CLIENT_ID) {
      return res.status(501).json({ error: "Auth not configured." });
    }

    const accessToken =
      req.cookies?.[ACCESS_COOKIE] ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : "");

    if (!accessToken) {
      return res.status(401).json({ error: "Authentication required." });
    }

    try {
      const upstream = await hubPostWithAuth("/api/storage/sas", accessToken, {
        client_id: process.env.AUTH_CLIENT_ID,
        ...req.body,
      });
      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch (err) {
      res.status(502).json({ error: err.message || "Hub storage request failed." });
    }
  });

  return router;
}

module.exports = { createStorageRouter };
