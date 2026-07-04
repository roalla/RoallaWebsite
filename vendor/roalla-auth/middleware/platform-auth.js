/**
 * Platform Auth — JWT verification middleware for product apps.
 */
const { createRemoteJWKSet, jwtVerify } = require("jose");

let jwks = null;
let issuer = null;

function authConfigured() {
  return !!(process.env.AUTH_URL && process.env.AUTH_CLIENT_ID);
}

function getIssuer() {
  if (!issuer) {
    issuer = (process.env.AUTH_ISSUER || process.env.AUTH_URL || "").replace(/\/$/, "");
  }
  return issuer;
}

function getJwks() {
  if (!jwks) {
    const base = (process.env.AUTH_HUB_URL || process.env.AUTH_URL || "").replace(/\/$/, "");
    jwks = createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`));
  }
  return jwks;
}

async function verifyBearerToken(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: getIssuer(),
      audience: process.env.AUTH_CLIENT_ID,
    });
    const headerOrg = req.headers["x-organization-id"];
    return {
      userId: payload.sub || null,
      email: payload.email || "",
      name: payload.name || "",
      emailVerified: !!payload.email_verified,
      orgId: headerOrg || null,
    };
  } catch (_) {
    return null;
  }
}

function attachAuth(req, _res, next) {
  if (!authConfigured()) {
    req.auth = null;
    return next();
  }
  verifyBearerToken(req)
    .then((auth) => {
      req.auth = auth;
      next();
    })
    .catch(() => {
      req.auth = null;
      next();
    });
}

function requireAuth(req, res, next) {
  if (!authConfigured()) {
    return res.status(501).json({ error: "Auth not configured." });
  }
  attachAuth(req, res, () => {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: "Authentication required." });
    }
    next();
  });
}

function optionalAuth(req, res, next) {
  attachAuth(req, res, next);
}

module.exports = {
  attachAuth,
  requireAuth,
  optionalAuth,
  optionalClerk: optionalAuth,
  authConfigured,
  verifyBearerToken,
};
