const { requireAuth, optionalAuth, authConfigured, verifyBearerToken } = require("./middleware/platform-auth");
const { createAuthSyncRouter, syncHubUser, REFRESH_COOKIE, ACCESS_COOKIE } = require("./routes/auth-sync");
const { createStorageRouter } = require("./routes/storage");
const hubMfa = require("./core/hub-mfa");

function wireRoallaAuth(app, { db, mail, prefix = "/api/auth" } = {}) {
  app.use(prefix, createAuthSyncRouter({ db, mail, requireAuth, optionalAuth }));
  return { requireAuth, optionalAuth, createAuthSyncRouter, createStorageRouter };
}

module.exports = {
  requireAuth,
  optionalAuth,
  authConfigured,
  verifyBearerToken,
  createAuthSyncRouter,
  createStorageRouter,
  syncHubUser,
  wireRoallaAuth,
  REFRESH_COOKIE,
  ACCESS_COOKIE,
  ...hubMfa,
};
