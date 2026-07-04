# Roalla Auth Hub — AI Integration Spec (Customer Apps)

> **Audience:** AI coding agents, customer dev teams, and integrators wiring a website or app to the centralized Roalla Auth Hub.
>
> **Hub role:** Single sign-on (SSO) provider. Users sign in on the hub; apps receive OAuth2 authorization codes (PKCE) and JWT access tokens.
>
> **Default integration mode:** **BFF (Backend-for-Frontend)** — browser never stores refresh tokens; app backend exchanges codes with the hub and sets HttpOnly cookies.

---

## Document metadata (machine-readable)

```yaml
spec_version: "1.0"
hub_product: "Roalla Auth Hub"
consumer_sdk: "@roalla/auth"
cli: "roalla-auth-cli"
node_min: "20"
auth_flow: "oauth2_authorization_code_pkce"
token_format: "jwt"
recommended_mode: "bff"
hub_discovery: "/.well-known/openid-configuration"
customer_portal: "/portal.html"
human_guide: "/guide.html"
api_reference: "/docs.html"
status_page: "/status.html"
```

---

## 1. What the customer receives (prerequisites)

Before coding, the customer must have **from Roalla / admin**:

| Item | Format | Purpose |
|------|--------|---------|
| Hub URL | `https://…` | `AUTH_URL` — same for all apps on this hub |
| Client ID | slug e.g. `acme-portal` | `AUTH_CLIENT_ID` — registered app identifier |
| App production URL | `https://portal.acme.com` | `APP_URL` — must match hub registration |
| Env snippet | multi-line `.env` | Copy into app local + production env |
| Portal token (optional) | `cpt_…` | Self-service at `/portal.html` (webhooks, health, env copy) |
| Registration token (optional) | `reg_…` | One-time onboarding if app not yet registered |

**The customer app must NOT contain `ADMIN_API_KEY`.** Admin keys are operator-only.

**Hub pre-registers for each app:**

- `allowed_return_urls` — e.g. `https://portal.acme.com/*`, `http://localhost:3000/*`
- `allowed_cors_origins` — e.g. `https://portal.acme.com`, `http://localhost:3000`
- Display name shown on hub login (“Continue to …”)

If registration used URL inference (admin or portal), these are auto-derived from the website domain.

---

## 2. Customer responsibilities (human checklist)

Use this order. An AI agent implementing the app should treat each step as a gate.

1. **Save credentials** — Store `cpt_…` portal token and env snippet securely (password manager / secrets vault).
2. **Configure environment** — Paste env snippet into `.env` (local) and hosting provider (Railway, Vercel, etc.).
3. **Install / wire SDK** — Use `@roalla/auth` (Express) or `@roalla/auth/next` (Next.js App Router), or copy `reference/consumer/` files.
4. **Expose auth routes** — App must serve BFF routes under `/api/auth/*` (token, refresh, logout, session, sync).
5. **Add sign-in UI** — Browser uses `app-auth.js` (PKCE) → redirects to hub login → callback exchanges code via app backend.
6. **Protect routes** — Server middleware checks JWT or session before serving protected pages/APIs.
7. **Sync user locally (optional)** — If app has Postgres, call `/api/auth/sync` after login to upsert user profile.
8. **Test locally** — Sign in at `http://localhost:PORT`, confirm return URL and app name on hub login.
9. **Deploy production** — Set same env vars with production `APP_URL`; test sign-in on live domain.
10. **Verify** — Run `roalla-auth doctor` or portal “Verify health”; confirm sign-out works.

---

## 3. Environment contract (required variables)

```json
{
  "required": {
    "AUTH_URL": "Base URL of Roalla Auth Hub (no trailing slash)",
    "AUTH_CLIENT_ID": "Registered client_id slug",
    "APP_URL": "Public URL of this app (production domain in prod env)"
  },
  "recommended": {
    "APP_NAME": "Display name inside the app",
    "LOCAL_DEV_URL": "http://localhost:3000 for local registration/dev",
    "DATABASE_URL": "App Postgres (not hub DB) if persisting users",
    "AUTH_MAIL_SECRET": "ams_… from hub registration / portal env snippet (product mail)"
  },
  "registration_only": {
    "AUTH_HUB_URL": "Same as AUTH_URL during CLI register/onboard",
    "REGISTRATION_TOKEN": "reg_… scoped token — never commit"
  },
  "forbidden_in_app_repos": [
    "ADMIN_API_KEY"
  ]
}
```

**Example snippet (shape only):**

```env
AUTH_URL=https://sso.roalla.com
AUTH_CLIENT_ID=acme-portal
APP_NAME=Acme Portal
APP_URL=https://portal.acme.com
LOCAL_DEV_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

---

## 4. Auth flow (what the AI must implement)

```text
[Browser] User clicks "Sign in"
    → app-auth.js builds PKCE verifier + challenge
    → redirect to: {AUTH_URL}/login.html?client_id={AUTH_CLIENT_ID}&return_url={APP}/callback&code_challenge=…&code_challenge_method=S256

[Hub] User authenticates (email, Google, Microsoft, etc.)

[Hub] Redirect back to app with ?code=…

[Browser] app-auth.js reads code, POSTs to app backend:
    POST /api/auth/token  { code, code_verifier }

[App backend] @roalla/auth exchanges with hub:
    POST {AUTH_URL}/oauth/token  (authorization_code + PKCE)

[App backend] Sets HttpOnly refresh cookie + returns access_token to browser (BFF mode)

[Browser] Stores access_token (session), calls /api/me or /api/auth/session

[Optional] POST /api/auth/sync — upsert user in app DATABASE_URL
```

**Sign out:** `POST /api/auth/logout` (clears cookies, revokes hub session).

**Token refresh:** `POST /api/auth/refresh` (uses HttpOnly cookie in BFF mode).

---

## 5. Integration paths (choose one)

### Path A — New Express app (fastest)

**When:** Greenfield Node/Express product or client portal.

**Actions for AI:**

1. Scaffold from hub: `npm run scaffold:app -- ../my-app --id my-app --name "My App"`
2. `npm install` in app directory
3. Copy `.env.example` → `.env`, fill values from admin snippet
4. If not pre-registered: `npm run register:auth` (needs `REGISTRATION_TOKEN`)
5. Wire server (usually already in starter):

```js
const express = require("express");
const { wireRoallaAuth, requireAuth } = require("@roalla/auth");

const app = express();
wireRoallaAuth(app, { db, mail }); // mounts /api/auth/*

app.get("/api/me", requireAuth, (req, res) => {
  res.json(req.auth);
});
```

6. Serve browser client: `public/app-auth.js` from `@roalla/auth/browser`
7. HTML: load `app-auth.js`, call `AppAuth.init()` then wire Sign in button to `AppAuth.signIn()`

**Starter reference:** `starter/` in hub repo.

---

### Path B — New Next.js app (App Router)

**When:** Greenfield Next.js 14+ app.

**Actions for AI:**

1. Scaffold: `npm run scaffold:next -- ../my-next-app --id my-next-app --name "My Next App"`
2. Env + register as Path A
3. Ensure routes exist:
   - `app/api/auth/[action]/route.js` — token, refresh, logout, session, sync
   - `app/auth/callback/page.js` — PKCE callback
   - `middleware.js` — protect `/dashboard` (or chosen routes)
4. Server session: `getServerSession()` from `@roalla/auth/next`
5. Client: `public/app-auth.js` + `AppAuth.init()`

**Starter reference:** `starter-next/` in hub repo.

---

### Path C — Existing app (manual integration)

**When:** App already deployed; add auth without full scaffold.

**Actions for AI:**

1. Add dependency: `@roalla/auth` (or copy `reference/consumer/*` into project)
2. Set all required env vars
3. Mount BFF router at `/api/auth` (Express) or Next handlers (App Router)
4. Add `/api/config` endpoint returning `{ authEnabled, authUrl, authClientId, bffMode: true }` (starter includes this pattern)
5. Copy `packages/auth/browser/app-auth.js` → `public/app-auth.js`
6. Add callback route/page that calls `AppAuth.handleAuthCallback()` on load
7. Replace local login with hub redirect; protect APIs with `requireAuth`

**Do not** reimplement PKCE or JWT verification by hand — use SDK middleware (`requireAuth` verifies against hub JWKS).

---

## 6. SDK surface (what to call)

### Express (`@roalla/auth`)

| Export | Use |
|--------|-----|
| `wireRoallaAuth(app, { db, mail })` | One-line mount of `/api/auth/*` |
| `createAuthSyncRouter({ db, mail })` | Manual mount if custom prefix needed |
| `requireAuth` | Middleware — populates `req.auth` from Bearer JWT |
| `optionalAuth` | Same, but allows anonymous |

### Next.js (`@roalla/auth/next`)

| Export | Use |
|--------|-----|
| `createAuthHandlers({ db, mail })` | `{ token, refresh, logout, session, sync }` route handlers |
| `createAuthMiddleware()` | Edge middleware for protected paths |
| `getServerSession()` | Server Components / RSC |

### Browser (`app-auth.js` / `AppAuth`)

| Method | Use |
|--------|-----|
| `AppAuth.init()` | Load config, restore session |
| `AppAuth.signIn(returnPath?)` | Start PKCE redirect to hub |
| `AppAuth.handleAuthCallback()` | On callback URL page |
| `AppAuth.signOut()` | Logout |
| `AppAuth.isSignedIn()` | UI state |
| `AppAuth.getToken()` | Bearer for API calls |
| `AppAuth.mountAppsSwitcher(el)` | Internal products — cross-app nav |

---

## 7. App backend routes the customer must expose

| Route | Method | Required | Description |
|-------|--------|----------|-------------|
| `/api/auth/token` | POST | Yes | Exchange auth code (BFF) |
| `/api/auth/refresh` | POST | Yes | Refresh access token |
| `/api/auth/logout` | POST | Yes | Sign out |
| `/api/auth/session` | GET | Recommended | `{ signedIn, userId, email, name }` |
| `/api/auth/sync` | POST | If DB | Upsert hub user into app database |
| `/api/me` | GET | Recommended | Protected profile from JWT claims |
| `/api/config` | GET | Yes for browser | Auth URLs for `app-auth.js` |

Hub endpoints (called by SDK, not browser directly for tokens in BFF mode):

| Hub route | Purpose |
|-----------|---------|
| `{AUTH_URL}/login.html` | Login UI |
| `{AUTH_URL}/oauth/token` | Token endpoint |
| `{AUTH_URL}/oauth/authorize` | Authorization (via login redirect) |
| `{AUTH_URL}/.well-known/openid-configuration` | OIDC discovery |
| `{AUTH_URL}/.well-known/jwks.json` | JWT verification keys |

---

## 8. Customer portal (self-service, no admin key)

URL: `{AUTH_URL}/portal.html`

| Token | When |
|-------|------|
| `reg_…` | First-time onboarding (automated register + portal token) |
| `cpt_…` | Ongoing management after registration |

Portal capabilities: copy env snippet, verify app health, manage webhook URL, retry webhook deliveries.

**AI agents should not automate portal token storage in repo files.** Store in secrets manager only.

### 8.1 Hub auth emails (verify / password reset)

The hub sends account emails (email verification, password reset) using per-app `auth@{sender_domain}` when the domain is authenticated in Brevo.

| Field | Example (Pitch Hotshot) |
|-------|-------------------------|
| From display name | `Pitch Hotshot` |
| From address | `auth@pitchhotshot.com` |
| Subject (verify) | `Verify your email for Pitch Hotshot` |
| Subject (reset) | `Reset your Pitch Hotshot password` |

If the app domain is not yet in Brevo, the hub falls back to `EMAIL_FROM` (e.g. `Pitch Hotshot powered by Roalla <auth@preflight.ca>`).

Per-client fields (auto-inferred from `APP_URL` at registration):

- `sender_domain` — e.g. `pitchhotshot.com`
- `sender_email` — e.g. `auth@pitchhotshot.com` (default: `auth@{sender_domain}`)

**Hub operator env (auth-api service only):**

```env
EMAIL_PROVIDER=brevo
BREVO_API_KEY=xkeysib-…
EMAIL_FROM=Roalla Auth <auth@preflight.ca>
AUTH_EMAIL_POWERED_BY=Roalla
```

Resend is still supported (`EMAIL_PROVIDER=resend`, `RESEND_API_KEY`). **Customer apps must not** contain `BREVO_API_KEY` or `RESEND_API_KEY`.

Full Brevo DNS + domain setup: `docs/BREVO_SETUP.md`.

Forgot-password and resend-verification pass `client_id` from the login redirect query string when available.

### 8.2 Hub product mail (invites, notifications)

Product transactional mail uses the **same** hub Brevo key. Apps call the hub — no per-app SMTP.

| Field | Example |
|-------|---------|
| `AUTH_MAIL_SECRET` | `ams_…` (in portal env snippet) |
| Product From | `noreply@pitchhotshot.com` (default `noreply@{sender_domain}`) |

```http
POST {AUTH_URL}/api/mail/send
Authorization: Bearer {AUTH_MAIL_SECRET}

{
  "client_id": "{AUTH_CLIENT_ID}",
  "to": "user@example.com",
  "subject": "…",
  "html": "…",
  "text": "…"
}
```

Rotate a leaked secret: `POST /api/admin/clients/{client_id}/mail-secret` (admin key) or re-copy env from portal after rotation.

### 8.3 Hub product SMS (alerts, OTP, notifications)

Product transactional SMS uses the **same** hub Brevo/Twilio configuration as SMS MFA. Apps call the hub — no per-app Twilio/Brevo accounts.

| Field | Example |
|-------|---------|
| `AUTH_SMS_SECRET` | `ass_…` (in portal env snippet) |
| Per-app sender (optional) | Set in admin → edit client → **Per-app SMS** → Brevo sender name |

```http
POST {AUTH_URL}/api/sms/send
Authorization: Bearer {AUTH_SMS_SECRET}

{
  "client_id": "{AUTH_CLIENT_ID}",
  "to": "+15551234567",
  "body": "Your verification code is 482910."
}
```

Multiple recipients: `"to": ["+1…", "+1…"]` (max 10).

| HTTP | Meaning |
|------|---------|
| 401 | Invalid `AUTH_SMS_SECRET` |
| 403 | SMS paused/disabled for this app, or country not allowed |
| 429 | SMS usage cap reached |
| 503 | Hub SMS not configured or product SMS disabled |

**SMS MFA at login** is hub-managed — login JSON may include `"mfaMethod": "sms"` or `"both"`. Resend: `POST /api/mfa/sms/resend` with `mfa_token`. Users enable SMS MFA at `{AUTH_URL}/account.html`.

Rotate a leaked secret: admin → client → **Rotate SMS secret**, or `POST /api/admin/clients/{client_id}/sms-secret`.

Full reference (templates, webhooks, caps, inline MFA): `docs/ROALLA-HUB_Instructions.md` — [Part 10](ROALLA-HUB_Instructions.md#part-10--hub-transactional-email--sms-product-apis).

Operator setup: `docs/BREVO_SMS_SETUP.md`.

---

## 9. CLI verification (for AI / CI)

From app directory (with env set):

```bash
npm run roalla-auth -- doctor --hub "$AUTH_URL" --url "$APP_URL"
```

JSON mode for pipelines:

```bash
npm run roalla-auth -- doctor --hub "$AUTH_URL" --url "$APP_URL" --json
```

**Pass criteria:**

- Hub health OK
- OIDC discovery OK
- Client lookup shows app registered and active
- App health reachable (if deployed)

---

## 10. Decision tree for AI agents

```text
Is the app already registered on the hub (customer has AUTH_CLIENT_ID + env snippet)?
├─ NO → Customer needs reg_… token → portal onboard OR roalla-auth quickstart
└─ YES → Continue

Is this greenfield or existing codebase?
├─ Greenfield Express → scaffold:app + wireRoallaAuth
├─ Greenfield Next.js → scaffold:next + auth route handlers
└─ Existing → add @roalla/auth + BFF routes + app-auth.js

Does the app need local user records?
├─ YES → DATABASE_URL + POST /api/auth/sync after login
└─ NO → JWT/session only; optional skip sync

Environment?
├─ Local → APP_URL/LOCAL_DEV_URL localhost; return URLs must include localhost/*
└─ Production → APP_URL = live domain; must match registered return URLs
```

---

## 11. Validation checklist (definition of done)

An AI agent should verify all before marking integration complete:

- [ ] `AUTH_URL`, `AUTH_CLIENT_ID`, `APP_URL` set in local and production env
- [ ] No secrets committed to git (`.env` in `.gitignore`)
- [ ] Sign-in redirects to hub with correct app name
- [ ] Callback URL receives `code` and completes without error
- [ ] `/api/auth/session` returns `signedIn: true` after login
- [ ] Protected route returns 401 when signed out
- [ ] Sign-out clears session and blocks protected access
- [ ] Production sign-in tested on registered domain (not localhost only)
- [ ] `roalla-auth doctor` passes (or portal health check passes)

---

## 12. Common failures (symptoms → fix)

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Invalid return_url` after hub login | App URL not in hub `allowed_return_urls` | Re-register with `https://domain/*` and localhost wildcard |
| Login shows wrong app name | `AUTH_CLIENT_ID` mismatch | Must exactly match hub `client_id` |
| CORS error on token exchange | Origin not in `allowed_cors_origins` | Add exact origin (no path) in hub registration |
| 401 on `/api/me` | Missing/expired token | Ensure callback ran; check `/api/auth/refresh` |
| Token exchange 501 | `AUTH_URL` / `AUTH_CLIENT_ID` unset | Fix env vars in app process |
| Works locally, fails in prod | Prod domain not registered or wrong `APP_URL` | Align env + hub return URLs with live domain |

---

## 13. Security rules for AI implementers

1. **Never** commit `REGISTRATION_TOKEN`, `cpt_…`, `ADMIN_API_KEY`, or `.env` files.
2. **Prefer BFF mode** — refresh tokens in HttpOnly cookies, not localStorage.
3. **Use SDK `requireAuth`** — do not parse JWT without JWKS verification.
4. **HTTPS only** in production for `APP_URL` and return URLs.
5. **Hub handles passwords/MFA/social login** — app must not implement duplicate credential stores for hub users.
6. **Never** put `BREVO_API_KEY`, `TWILIO_*`, or SMS provider SDKs in customer apps — use `AUTH_SMS_SECRET` and hub `POST /api/sms/send`.

---

## 14. Minimal HTML + JS example (browser)

```html
<button id="signIn">Sign in</button>
<script src="/app-auth.js"></script>
<script>
  AppAuth.init().then(() => {
    document.getElementById("signIn").onclick = () => AppAuth.signIn();
    if (location.search.includes("code=")) {
      AppAuth.handleAuthCallback().then(() => location.replace("/dashboard"));
    }
  });
</script>
```

Callback path must match a registered return URL pattern (e.g. `https://app.com/auth/callback` registered as `https://app.com/*`).

---

## 15. Related hub documentation

| Resource | URL path |
|----------|----------|
| Human admin + customer guide | `/guide.html` |
| AI integration spec (guide section) | `/guide.html#ai-integration` |
| AI integration spec (download) | `/downloads/AI_CUSTOMER_INTEGRATION.md` |
| Customer quick steps (5-step) | `/guide.html#customer-stepper` |
| Client portal | `/portal.html` |
| OpenAPI | `/docs.html` |
| Hub status | `/status.html` |
| Brevo email setup (operator) | `docs/BREVO_SETUP.md` |
| Brevo SMS setup (operator) | `docs/BREVO_SMS_SETUP.md` |
| Email, SMS, storage, MFA (app developers) | `docs/ROALLA-HUB_Instructions.md` |
| Express starter | `starter/README.md` (hub repo) |
| Next starter | `starter-next/README.md` (hub repo) |
| Consumer file reference | `reference/consumer/` (hub repo) |

---

## 16. Summary for AI (one paragraph)

To connect a customer app to Roalla Auth Hub: register the app (admin or portal) so `client_id`, return URLs, and CORS origins exist; configure `AUTH_URL`, `AUTH_CLIENT_ID`, and `APP_URL` in the app environment; install `@roalla/auth` and mount BFF routes at `/api/auth/*`; serve `app-auth.js` for PKCE sign-in and callback handling; protect server routes with `requireAuth`; optionally sync users to the app database; for product email/SMS use server-only `AUTH_MAIL_SECRET` / `AUTH_SMS_SECRET` with hub `/api/mail/send` and `/api/sms/send`; test locally then production; validate with `roalla-auth doctor`. Use portal token `cpt_…` for ongoing self-service. Never embed admin credentials in the customer codebase.
