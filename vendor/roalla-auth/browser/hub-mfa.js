/**
 * Browser helpers for hub MFA login challenges (totp / sms / both).
 */
(function (global) {
  function isMfaLoginResponse(payload) {
    return !!(payload && payload.mfaRequired && payload.mfaToken);
  }

  function mfaMethodFromResponse(payload) {
    if (!isMfaLoginResponse(payload)) return null;
    return payload.mfaMethod || "totp";
  }

  function mfaLeadText(method) {
    if (method === "sms") return "Enter the 6-digit code we sent by SMS.";
    if (method === "both") return "Enter a code from your authenticator app or SMS.";
    return "Enter the 6-digit code from your authenticator app.";
  }

  function smsResendSupported(method) {
    return method === "sms" || method === "both";
  }

  async function submitMfaChallenge({ authUrl, mfaToken, code }) {
    const base = String(authUrl || "").replace(/\/$/, "");
    const res = await fetch(`${base}/api/mfa/challenge`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({ mfa_token: mfaToken, code: String(code || "").trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.redirected) {
      global.location.href = res.url;
      return { redirected: true, data };
    }
    if (data.redirect) {
      global.location.href = data.redirect;
      return { redirected: true, data };
    }
    if (!res.ok) throw new Error(data.error || "MFA verification failed.");
    return { ok: true, data };
  }

  async function resendMfaSms({ authUrl, mfaToken }) {
    const base = String(authUrl || "").replace(/\/$/, "");
    const res = await fetch(`${base}/api/mfa/sms/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ mfa_token: mfaToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not resend SMS code.");
    return data;
  }

  global.RoallaHubMfa = {
    isMfaLoginResponse,
    mfaMethodFromResponse,
    mfaLeadText,
    smsResendSupported,
    submitMfaChallenge,
    resendMfaSms,
  };
})(typeof window !== "undefined" ? window : globalThis);
