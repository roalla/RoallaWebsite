/**
 * Hub MFA helpers for BFF / server-side login proxies.
 */
const { hubBaseUrl } = require("./bff");

function isMfaLoginResponse(payload) {
  return !!(payload && payload.mfaRequired && payload.mfaToken);
}

function mfaMethodFromResponse(payload) {
  if (!isMfaLoginResponse(payload)) return null;
  return payload.mfaMethod || "totp";
}

async function submitMfaChallenge({ mfaToken, code, fetchImpl = fetch }) {
  const authUrl = hubBaseUrl();
  if (!authUrl) throw new Error("AUTH_URL not configured.");
  const res = await fetchImpl(`${authUrl}/api/mfa/challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({ mfa_token: mfaToken, code: String(code || "").trim() }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data, redirected: res.redirected, url: res.url };
}

async function resendMfaSms({ mfaToken, fetchImpl = fetch }) {
  const authUrl = hubBaseUrl();
  if (!authUrl) throw new Error("AUTH_URL not configured.");
  const res = await fetchImpl(`${authUrl}/api/mfa/sms/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ mfa_token: mfaToken }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

module.exports = {
  isMfaLoginResponse,
  mfaMethodFromResponse,
  submitMfaChallenge,
  resendMfaSms,
};
