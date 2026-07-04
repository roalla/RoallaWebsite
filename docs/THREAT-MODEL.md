# Roalla Auth Hub — threat model (summary)

This document states what the hub **guarantees** versus what **product apps must enforce**. It is aimed at operators and app developers integrating via `@roalla/auth` or the BFF pattern.

## Trust boundaries

```text
┌─────────────────────────────────────────────────────────────┐
│  Browser (untrusted)                                        │
│  — never holds BREVO/TWILIO/ADMIN_API_KEY/AUTH_*_SECRET     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│  Product app BFF (trusted by app)                           │
│  — holds AUTH_MAIL_SECRET, AUTH_SMS_SECRET, session cookies │
│  — verifies hub JWT via JWKS                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Auth Hub (sso) — this repo                                   │
│  — identity, MFA, OAuth/OIDC, per-client policy               │
│  — provider keys (Brevo, Twilio, Azure) never leave hub       │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Postgres — users, tokens, audit, clients                   │
└─────────────────────────────────────────────────────────────┘
```

## Hub guarantees

| Area | Guarantee |
|------|-----------|
| **Passwords** | Argon2 hashed; never returned in APIs |
| **OAuth** | PKCE S256 required; per-client `return_url` allowlist |
| **Refresh tokens** | Rotated on use; reuse revokes all refresh tokens for user |
| **Access tokens** | Short-lived RS256 JWT; audience = `client_id` |
| **MFA** | TOTP encrypted at rest; SSO sessions re-prompt MFA when stale |
| **Step-up** | Password change, revoke sessions, passkey add/remove require recent MFA |
| **Admin** | `ADMIN_API_KEY` timing-safe compare; rate limits on auth endpoints |
| **Introspect** | Requires `client_id`; validates JWT audience |
| **Revocation** | RFC 7009 `POST /oauth/revoke` for refresh tokens |
| **Secrets** | Per-app mail/SMS secrets; rotatable via admin or portal |
| **Audit** | Security events logged (`login_failed`, `mfa_failed`, `refresh_token_reuse`, etc.) |

## Out of scope — apps must enforce

| Risk | App responsibility |
|------|-------------------|
| **Authorization (who can do what in the app)** | Hub authenticates identity only. Apps check roles/tenants in their DB. |
| **IDOR on app resources** | BFF must scope data to `sub` / org from JWT. |
| **CSRF on app routes** | Use SameSite cookies + CSRF tokens on mutating app endpoints. |
| **XSS in product UI** | Sanitize output; CSP on app pages. Hub CSP still allows `unsafe-inline` on legacy public pages. |
| **Token storage in browser** | Prefer BFF httpOnly cookies; avoid localStorage for access tokens in production. |
| **Machine-to-machine** | Use `AUTH_MAIL_SECRET` / `AUTH_SMS_SECRET` only server-side. |
| **Phishing** | Educate users; passkeys + MFA reduce but do not eliminate credential theft. |

## Known limitations

- **Access token revocation:** JWTs are valid until expiry. Use short TTL + refresh rotation, or introspect for high-risk APIs.
- **Silent SSO:** Hub session cookie enables cross-app SSO; MFA step-up applies when MFA is enabled and session MFA is stale.
- **Operator seed password:** Remove `SEED_ADMIN_PASSWORD` from Railway after bootstrap.
- **PGSSL:** Railway Postgres may use `rejectUnauthorized: false` — document tradeoff for your compliance needs.

## Monitoring

- Admin **Dashboard → 7-day trends** — failed logins, MFA failures, refresh reuse, SMS failover
- Admin **Audit** tab — filter/export CSV (`sms.failover`, `token_cors_denied`, etc.)
- `GET /api/admin/metrics` — in-process counters (resets on deploy)

## Related docs

- [ROALLA-HUB_Instructions.md](./ROALLA-HUB_Instructions.md) — Part 10b Security
- [PORTING.md](../PORTING.md) — operator setup
- [AI_CUSTOMER_INTEGRATION.md](./AI_CUSTOMER_INTEGRATION.md) — §13 Security rules
