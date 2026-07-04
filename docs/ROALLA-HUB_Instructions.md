# Roalla Auth Hub — Integration Instructions

> **Audience:** Developers and AI agents wiring **other Roalla customer apps** to the centralized Auth Hub: **in-app** email sign-in/sign-up (same theme as the product), **MFA** (TOTP and SMS), **verify-email**, **passkeys (WebAuthn)**, **transactional email & SMS** from your server, and **Azure Blob Storage** (avatars, media, reports) via the hub BFF pattern.
>
> **Reference implementation:** This repo (PitchHotshot). Copy or port the files listed below.
>
> **Hub product docs:** `Roalla-Auth-Hub/docs/AI_CUSTOMER_INTEGRATION.md` (base BFF integration).
>
> **Login + AI (admin overview):** [`docs/AI-GATEWAY-RELATIONSHIP.md`](./AI-GATEWAY-RELATIONSHIP.md) · [platform page](https://sso.roalla.com/platform.html)

---

## Roalla platform — Auth Hub and AI Gateway

Roalla splits **who you are** (login) from **AI usage** (OpenAI, limits, billing). Both are required for apps that use AI, but you manage them on different sites.

| Website | What it does | Who manages it |
|---------|----------------|----------------|
| **https://sso.roalla.com** | User sign-in, passwords, Google/social login, user accounts, JWT tokens, MFA (TOTP + SMS), passkeys, email, **SMS**, Azure storage SAS | Auth Hub admin / your developer |
| **https://ai.roalla.com** | OpenAI & Anthropic keys, AI request routing, monthly limits, usage reports | AI Gateway admin |

**Rule of thumb**

- **Login broken?** → **sso.roalla.com** (this hub)
- **AI broken, limits, OpenAI?** → **ai.roalla.com**

OpenAI keys live **only** on the AI Gateway. Product apps never store `OPENAI_API_KEY`.

### How login and AI fit together

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Your app (e.g. TOVA)                     │
│  - Users sign in via Auth Hub                                    │
│  - AI features call AI Gateway (not OpenAI directly)             │
└───────────────┬─────────────────────────────┬───────────────────┘
                │                             │
                ▼                             ▼
     ┌──────────────────┐          ┌──────────────────┐
     │  sso.roalla.com  │          │  ai.roalla.com   │
     │  Auth Hub        │          │  AI Gateway      │
     │  - login page    │          │  - OpenAI key    │
     │  - user accounts │          │  - usage limits  │
     │  - JWT tokens    │──────────│  - verifies JWT  │
     └──────────────────┘  JWKS    └────────┬─────────┘
                                            ▼
                                   OpenAI / Anthropic
```

1. User opens your app and clicks **Sign in** → redirected to **sso.roalla.com** (or inline email auth via your BFF — see [Architecture](#architecture) below).
2. After login, the app holds a **JWT** (secure token proving who the user is).
3. When the user uses an AI feature, the app sends that JWT to **ai.roalla.com**.
4. AI Gateway checks the token (via Auth Hub JWKS), enforces the monthly limit, and calls OpenAI with the **central key**.

AI Gateway verifies JWTs using Auth Hub public keys: `{AUTH_URL}/.well-known/jwks.json`

### Admin bookmark list

#### Auth Hub (sso.roalla.com)

| Page | URL | Use for |
|------|-----|---------|
| **Admin guide** | https://sso.roalla.com/guide.html | Register apps for login, client portal |
| **Login + AI overview** | https://sso.roalla.com/platform.html | How Auth Hub and AI Gateway relate |
| **Status** | https://sso.roalla.com/status.html | Is sign-in working? |
| **Client portal** | https://sso.roalla.com/portal.html | Customer self-service onboarding |
| **Admin console** | https://sso.roalla.com/admin.html | Users, clients, usage, billing, registration tokens |

#### AI Gateway (ai.roalla.com)

| Page | URL | Use for |
|------|-----|---------|
| **Add an app** | https://ai.roalla.com/onboard.html | Register apps — one form, copy text for developer |
| **Print quick start** | https://ai.roalla.com/quickstart.html | One-page PDF-style cheat sheet |
| **Help for admins** | https://ai.roalla.com/guide.html | Searchable step-by-step help |
| **Admin console** | https://ai.roalla.com/admin.html | Usage, limits, OpenAI keys |
| **Status check** | https://ai.roalla.com/status.html | Is AI Gateway healthy? |

### Adding an app — which path?

#### Path A — Brand-new app (needs login **and** AI)

**Easiest:** one form on AI Gateway (if SSO sync is configured by your developer).

1. Connect OpenAI once: **ai.roalla.com/admin.html** → AI providers
2. Open **ai.roalla.com/onboard.html**
3. Fill in app details — leave **“Already on SSO” unchecked**
4. Register → copy text → send to developer

This registers the app on **both** sso.roalla.com and ai.roalla.com when `AUTH_HUB_ADMIN_API_KEY` is set on the gateway.

**Alternative:** register login first on Auth Hub ([guide](https://sso.roalla.com/guide.html) or [Part 1 — Hub setup](#part-1--hub-setup-once-per-app) below), then add AI via onboard form with **“Already on SSO” checked**.

#### Path B — App already on SSO (e.g. TOVA)

Login already works. You only add AI:

1. Open **https://ai.roalla.com/onboard.html**
2. Paste AI Gateway admin password
3. Fill in:

| Field | Example (TOVA) |
|-------|----------------|
| App ID | `tova` (same ID as on SSO — must match `AUTH_CLIENT_ID`) |
| App name | `TOVA` |
| Website URL | `https://tova.roalla.com` |
| Monthly allowance | `50000` |
| **Already on SSO** | ✓ **Checked** |

4. Register → **Copy text for developer** → send by email or Slack
5. Developer adds `AI_GATEWAY_URL=https://ai.roalla.com` and removes `OPENAI_API_KEY` from the app

You do **not** re-register login on sso.roalla.com.

#### Path C — Login only (no AI)

Use **sso.roalla.com** only — [Auth Hub guide](https://sso.roalla.com/guide.html) or [Part 1](#part-1--hub-setup-once-per-app) below. Skip AI Gateway until the app needs AI features.

### What the developer receives (login + AI)

After AI onboard, admins copy a short block like:

```env
AUTH_URL=https://sso.roalla.com
AUTH_CLIENT_ID=tova
AI_GATEWAY_URL=https://ai.roalla.com
APP_URL=https://tova.roalla.com
```

Admins do not edit this — send it to the developer. They paste it into Railway or the app’s `.env` file.

For **login-only** apps, the hub admin snippet is typically:

```env
AUTH_URL=https://sso.roalla.com
AUTH_CLIENT_ID=your-app-slug
APP_URL=https://yourapp.com
APP_NAME=Your App Display Name
```

Optional secrets (issued per app in admin or portal env snippet):

```env
AUTH_MAIL_SECRET=ams_…   # product email via POST /api/mail/send
AUTH_SMS_SECRET=ass_…    # product SMS via POST /api/sms/send
```

See [Part 10 — Hub transactional email & SMS](#part-10--hub-transactional-email--sms-product-apis).

### Day-to-day — who does what

| Task | Where |
|------|-------|
| Add app (login + AI together) | ai.roalla.com/onboard.html |
| Add app (login only) | sso.roalla.com/guide.html or portal |
| Add AI to existing SSO app | ai.roalla.com/onboard.html + “Already on SSO” |
| Reset user password / unlock account | sso.roalla.com admin |
| Email deliverability (SPF/DKIM) | sso.roalla.com admin → client deliverability check |
| Usage & billing (email, storage, SMS) | sso.roalla.com admin → Usage / Billing |
| SMS providers, caps, MFA policy | sso.roalla.com admin → Usage → SMS providers |
| Per-app SMS pause / sender override | sso.roalla.com admin → edit client → Per-app SMS |
| Disable user SMS MFA | sso.roalla.com admin → user detail |
| Raise AI monthly limit | ai.roalla.com admin → Spending limits |
| See AI usage | ai.roalla.com admin → AI usage |
| Replace OpenAI key | ai.roalla.com admin → AI providers |
| Pause AI for one app | ai.roalla.com admin → Connected apps |
| Registration token for customer | sso.roalla.com admin |

### Platform troubleshooting

| Symptom | Fix on |
|---------|--------|
| Can’t sign in, wrong password, Google login fails | **sso.roalla.com** — status, admin, guide |
| SMS MFA code not received | **sso.roalla.com** admin → Usage → SMS (providers, caps, test send) |
| Product SMS 401/403/429 | Check `AUTH_SMS_SECRET`, per-app SMS settings, hub caps |
| Sign-in works, AI greyed out or errors | **ai.roalla.com** — providers, usage, re-send snippet |
| AI stopped mid-month | ai.roalla.com → AI usage (limit hit?) |
| New app needs both login and AI | ai.roalla.com/onboard.html (or SSO guide first) |
| JWKS / token errors (developer) | `AUTH_URL` must be `https://sso.roalla.com` on both app and AI Gateway |
| “Invalid token” on AI calls | Check `AUTH_CLIENT_ID` matches SSO registration |

### Platform environment reference

| Variable | Set on | Purpose |
|----------|--------|---------|
| `AUTH_URL` | App + AI Gateway | `https://sso.roalla.com` |
| `AUTH_CLIENT_ID` | App | Same app ID on both hubs |
| `AI_GATEWAY_URL` | App (if using AI) | `https://ai.roalla.com` |
| `AUTH_MAIL_SECRET` | App (server only) | Product email via hub `POST /api/mail/send` |
| `AUTH_SMS_SECRET` | App (server only) | Product SMS via hub `POST /api/sms/send` |
| `AUTH_HUB_ADMIN_API_KEY` | AI Gateway only (server) | Lets onboard form sync to SSO |
| `OPENAI_API_KEY` | AI Gateway only | Never on product apps |

SDK: `@roalla/gateway` in apps for AI · `@roalla/auth` for login.

### Glossary

| Term | Meaning |
|------|---------|
| **SSO** | Single sign-on — one login for many apps (sso.roalla.com) |
| **Auth Hub** | Roalla’s login service at sso.roalla.com |
| **AI Gateway** | Roalla’s AI proxy at ai.roalla.com |
| **App ID / client_id** | Short code for an app, e.g. `tova` — must match on both services when using AI |
| **JWT** | Token proving a user is signed in — apps pass it to AI Gateway |
| **Admin password** | Secret for ai.roalla.com admin (`ADMIN_API_KEY`) |
| **Snippet** | Env text copied after registering an app |
| **Monthly allowance** | Max AI requests per app per month on AI Gateway |

**Source:** Full platform doc also lives in the AI Gateway repo as `docs/ROALLA-PLATFORM.md`. Auth Hub summary: [`docs/AI-GATEWAY-RELATIONSHIP.md`](./AI-GATEWAY-RELATIONSHIP.md).

---

## App developer quick reference

Use this section when wiring **your app** to an already-registered hub client.

### Environment (customer app)

| Variable | Required | Purpose |
|----------|----------|---------|
| `AUTH_URL` | Yes | Hub base URL, e.g. `https://sso.roalla.com` |
| `AUTH_CLIENT_ID` | Yes | Same as hub `client_id` slug |
| `APP_URL` | Yes | Your app’s public HTTPS origin |
| `APP_NAME` | Recommended | Display name on hub pages |
| `AUTH_MAIL_SECRET` | If sending mail | Server-only; never expose to browser |
| `AUTH_SMS_SECRET` | If sending SMS | Server-only; never expose to browser |
| `AI_GATEWAY_URL` | If using AI | `https://ai.roalla.com` |

Copy secrets from the hub admin **env snippet** or portal after registration. Rotate in admin if leaked.

### Hub capability probe

```http
GET {AUTH_URL}/api/config?client_id={AUTH_CLIENT_ID}
```

| Field | When `true` |
|-------|-------------|
| `emailAuthEnabled` | Email/password login allowed for this client |
| `passkeysEnabled` | Passkey sign-in available (hub `PASSKEYS_ENABLED`) |
| `smsEnabled` | Hub can send SMS (Brevo and/or Twilio configured + routing active) |
| `storageEnabled` | Hub Azure storage configured; use BFF `POST /api/storage/sas` |

### Server APIs your app calls (never from the browser)

| API | Auth | Use for |
|-----|------|---------|
| `POST {AUTH_URL}/api/mail/send` | Bearer `AUTH_MAIL_SECRET` | Order confirmations, invites, notifications |
| `POST {AUTH_URL}/api/sms/send` | Bearer `AUTH_SMS_SECRET` | OTP, alerts, transactional SMS |
| `POST {AUTH_URL}/api/storage/sas` | Bearer user access token | Mint Azure upload/read SAS |

Hub auth emails (verify, reset) and **SMS MFA** are sent by the hub automatically — your app does not call Brevo/Twilio.

### User-facing hub pages (link from your app)

| Flow | URL pattern |
|------|-------------|
| Forgot password | `{AUTH_URL}/forgot-password.html?client_id={AUTH_CLIENT_ID}` |
| Account settings, TOTP MFA, **SMS MFA** | `{AUTH_URL}/account.html?client_id={AUTH_CLIENT_ID}` |
| Passkey registration | `{AUTH_URL}/account.html` (signed-in hub session) |
| Passkey sign-in | `{AUTH_URL}/login.html?client_id=…&return_url=…&code_challenge=…` |

### Webhooks your app may receive

If `webhook_url` is set on your client, the hub POSTs signed events (`X-Roalla-Signature`). Relevant event types:

| Event | When |
|-------|------|
| `user.created` | New hub user linked to your client |
| `user.login` | Successful sign-in |
| `sms.delivered` / `sms.failed` | SMS delivery status (when provider callbacks are configured) |

Details: `PORTING.md` in this repo.

### Operator docs (hub team — not in your app repo)

| Topic | Doc |
|-------|-----|
| Brevo email DNS | `docs/BREVO_SETUP.md` |
| Brevo SMS credits & sender | `docs/BREVO_SMS_SETUP.md` |
| SMS admin (providers, caps, templates) | Hub admin → **Usage** tab |

---

## What this adds

| Before | After |
|--------|-------|
| Email sign-in redirects to hub `login.html` | Email + password on **your** `/login` and `/signup` pages |
| User sees Roalla/hub chrome for manual auth | User sees **your** buttons, typography, and colors |
| MFA / verify handled on hub pages | **In-app dialogs**; hub APIs called via your BFF |
| Each app holds Azure storage keys | **Hub** holds `AZURE_STORAGE_*`; apps use BFF `POST /api/storage/sas` |
| Each app holds `OPENAI_API_KEY` | **AI Gateway** holds keys; app uses `AI_GATEWAY_URL` + Auth Hub JWT |
| Each app integrates Twilio/Brevo for SMS | **Hub** sends SMS; apps use `AUTH_SMS_SECRET` + `POST /api/sms/send` |

Social login (Google, Microsoft, Apple) is unchanged — still redirects through the hub OAuth flow. **Passkey sign-in** also uses the hub (WebAuthn must run on the auth domain — see [Passkeys](#passkeys-webauthn--biometric-sign-in) below). **Forgot password**, **passkey registration**, and **email verification link clicks** still use hub-hosted pages (tokens stay on the auth domain).

---

## Architecture

```text
[Browser] User submits email/password on YOUR /login or /signup
    → generates PKCE verifier, stores in sessionStorage (key matches app-auth.js)
    → POST /api/auth/email-login  (or email-register) on YOUR app

[Your BFF] POST {AUTH_URL}/api/login  (or /api/register)
    Headers: Accept: application/json
    Body: client_id, email, password, return_url, code_challenge, code_challenge_method

[Hub] Authenticates user
    → { ok: true, redirect: "https://yourapp.com/auth/callback?return=…&code=…" }
    OR { mfaRequired: true, mfaToken: "…" }
    OR { verifyRequired: true, message: "…" }

[Browser] On redirect → /auth/callback?code=…
    → app-auth.js exchanges code via POST /api/auth/token (existing BFF)
    → POST /api/auth/sync (optional, if you persist users locally)
    → window.location → post-auth path (e.g. /app/studio)
```

**Critical:** The browser must **not** call hub `/api/login` directly — CORS is not enabled for cross-origin browser calls. Your server proxies hub APIs (BFF pattern).

**PKCE storage key** (must match `public/app-auth.js`):

```text
pa-{clientId}-code-verifier
```

---

## Part 1 — Hub setup (once per app)

Complete in the Roalla Auth Hub admin/portal **before** wiring the customer app:

| Step | Action |
|------|--------|
| 1 | Register app → obtain `client_id` slug (e.g. `acme-portal`) |
| 2 | Set `allowed_return_urls` → `https://yourapp.com/*`, `http://localhost:PORT/*` |
| 3 | Set `allowed_cors_origins` → app origin(s) |
| 4 | Set `brand_name` and `logo_url` on the client (used on hub pages: forgot-password, verify-email) |
| 5 | Enable OAuth providers (Google, Microsoft, Apple) as needed |
| 6 | Copy env snippet → `AUTH_URL`, `AUTH_CLIENT_ID`, `APP_URL`, `APP_NAME`, optional `AUTH_MAIL_SECRET` / `AUTH_SMS_SECRET` |
| 7 | Confirm email verification redirects users to `https://yourapp.com/login?verified=1` |
| 8 | **Passkeys (optional):** on the **hub** service, set `PASSKEYS_ENABLED=true` (default), `APP_URL` to the hub HTTPS origin, and optionally `WEBAUTHN_RP_ID` / `WEBAUTHN_RP_NAME` (see [Passkeys](#passkeys-webauthn--biometric-sign-in)) |
| 9 | Confirm `GET {AUTH_URL}/api/config?client_id={AUTH_CLIENT_ID}` returns `"passkeysEnabled": true` |
| 10 | **Storage (optional):** on the **hub** service, set `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_STORAGE_ACCOUNT_KEY`, `AZURE_STORAGE_CONTAINER` (see [Azure Blob Storage](#part-9--azure-blob-storage-avatars-media-reports)) |
| 11 | Confirm `GET {AUTH_URL}/api/config?client_id={AUTH_CLIENT_ID}` returns `"storageEnabled": true` when Azure vars are set |
| 12 | **SMS (optional):** hub operator configures Brevo and/or Twilio; enable providers in admin → Usage. See [Part 10](#part-10--hub-transactional-email--sms-product-apis) and `docs/BREVO_SMS_SETUP.md` |
| 13 | Confirm `GET {AUTH_URL}/api/config?client_id={AUTH_CLIENT_ID}` returns `"smsEnabled": true` when SMS is routable |
| 14 | **SMS MFA (optional):** users enable at `{AUTH_URL}/account.html`; ensure hub **Allow SMS MFA** is on in admin |

**No hub code deploy is required** for inline email auth — hub JSON APIs already exist. Passkey APIs are also built into the hub when `PASSKEYS_ENABLED` is not `false`. Storage APIs are available when `AZURE_STORAGE_*` is configured on the hub.

---

## Passkeys (WebAuthn / biometric sign-in)

The Roalla Auth Hub **already implements** passkeys. Customer apps do not need new hub APIs — only hub env configuration and app UI that redirects to the hub for the WebAuthn ceremony.

### Hub capability (already in Auth Hub)

| Piece | Location |
|-------|----------|
| Login with passkey | `{AUTH_URL}/login.html` — “Sign in with passkey” (email + passkey) |
| Register / manage passkeys | `{AUTH_URL}/account.html` (signed-in hub session) |
| APIs | `POST /api/passkeys/login/options`, `/login/verify`, `/register/options`, `/register/verify`; `GET/DELETE /api/passkeys` |
| Feature flag | `GET {AUTH_URL}/api/config?client_id=…` → `passkeysEnabled`, `webauthn.rpId`, `webauthn.rpName` |
| Database | `webauthn_credentials`, `webauthn_challenges` (`schema.sql`) |

### Hub environment (auth-api service)

```env
PASSKEYS_ENABLED=true
APP_URL=https://sso.roalla.com
# Optional — default rpId is APP_URL hostname
WEBAUTHN_RP_ID=sso.roalla.com
WEBAUTHN_RP_NAME=Roalla Authentication Services
```

Requirements:

- **HTTPS** on the hub in production (WebAuthn requires a secure context).
- `WEBAUTHN_RP_ID` must match the hub hostname (e.g. `sso.roalla.com`, not your app domain).
- Set `PASSKEYS_ENABLED=false` only to disable passkeys entirely.

Verify after deploy: `GET {AUTH_URL}/api/status` should show passkeys as **Enabled**, or call `/api/config` and check `passkeysEnabled`.

### Why passkeys are not inline on your `/login`

Passkeys are bound to the hub **Relying Party ID** (`rpId`), not your app’s origin. The browser WebAuthn ceremony (`navigator.credentials.get`) must run on the **hub origin**. You cannot call hub passkey APIs from `yourapp.com` and trigger Face ID / fingerprint there — same constraint as social OAuth, not the same as email/password (which is fully server-side via BFF).

| Auth method | Where the user acts | Pattern |
|-------------|---------------------|---------|
| Email + password | Your themed `/login` | BFF → hub `/api/login` (inline) |
| Google / Microsoft / Apple | Hub OAuth | Redirect to hub |
| **Passkey** | Hub `login.html` | **Redirect to hub** (or hub popup) |
| Add passkey | Hub `account.html` | Link after user is signed in |

Do **not** show a placeholder like “no WebAuthn support in Roalla Auth Hub” — enable passkeys on the hub and wire a redirect button when `passkeysEnabled` is true.

### App integration pattern

1. **Detect capability** — proxy or fetch hub config; read `passkeysEnabled` from `GET {AUTH_URL}/api/config?client_id={AUTH_CLIENT_ID}` (expose via your `GET /api/config` if needed).
2. **Sign in with passkey** — redirect to hub login with the same PKCE params as social login, e.g. build URL with `AppAuth.startAuthorize`-style query (`client_id`, `return_url`, `code_challenge`, `code_challenge_method`) and open `{AUTH_URL}/login.html?…`. User enters email on the hub page and taps “Sign in with passkey”. On success, hub redirects to your `/auth/callback?code=…` (existing flow).
3. **Register a passkey** — after the user has a session, link to `{AUTH_URL}/account.html` (hub cookie / bearer for account management). Inline registration on your app domain is not supported.
4. **Browser support** — only show the passkey button when `passkeysEnabled` is true; optionally hide on browsers without WebAuthn (hub login page already does this).

Example redirect (conceptual — match your existing social authorize URL builder):

```text
{AUTH_URL}/login.html?client_id={AUTH_CLIENT_ID}&return_url={encoded_callback}&code_challenge={challenge}&code_challenge_method=S256
```

User must have **already registered** a passkey on `{AUTH_URL}/account.html` for that email.

### Hub passkey API contract (reference)

Proxied by the hub’s own `login.html` / `account.html`; customer BFF proxy is **not** required for sign-in (ceremony stays on hub origin).

**Start sign-in** — `POST {AUTH_URL}/api/passkeys/login/options`

```json
{
  "email": "user@example.com",
  "client_id": "your-app-slug",
  "return_url": "https://yourapp.com/auth/callback?return=%2Fapp%2Fstudio",
  "code_challenge": "…",
  "code_challenge_method": "S256"
}
```

**Complete sign-in** — browser posts WebAuthn assertion to `POST {AUTH_URL}/api/passkeys/login/verify` → `{ "redirect": "https://…/auth/callback?code=…" }` (same as email login).

Errors: `No passkey found for this account.`, `Passkey verification failed.`, `verifyRequired` if email not verified.

### What is not in `@roalla/auth` yet

The consumer SDK (`app-auth.js`) does not ship passkey helpers. Use hub redirect + `passkeysEnabled` from hub `/api/config`. A future SDK helper may wrap the redirect URL builder.

---

## Part 2 — App prerequisites

The target app must already have standard Roalla Auth Hub BFF integration:

- [ ] `@roalla/auth` wired (`vendor/roalla-auth` or npm package)
- [ ] Environment: `AUTH_URL`, `AUTH_CLIENT_ID`, `APP_URL`, `APP_NAME`
- [ ] `public/app-auth.js` (from `vendor/roalla-auth/browser/app-auth.js`)
- [ ] `GET /api/config` → `{ authEnabled, authUrl, authClientId, appName, bffMode: true }`
- [ ] `GET/POST /api/auth/[action]` → `session`, `token`, `refresh`, `logout`, `sync`
- [ ] `/auth/callback` page → loads `app-auth.js`, `AppAuth.init()`, `POST /api/auth/sync`, redirect
- [ ] `/login` and `/signup` pages with the app's theme
- [ ] Middleware: stray `?code=` on non-callback routes → redirect to `/auth/callback`
- [ ] Optional: social buttons via `AppAuth.startProviderAuthorize(provider, "/auth/callback?return=…")`
- [ ] Optional: passkey button when hub `passkeysEnabled` → redirect to `{AUTH_URL}/login.html` with PKCE (see [Passkeys](#passkeys-webauthn--biometric-sign-in))
- [ ] Optional: `POST /api/storage/sas` BFF route for uploads (see [Azure Blob Storage](#azure-blob-storage-avatars-media-reports))

If any item is missing, implement the base integration first (`Roalla-Auth-Hub/docs/AI_CUSTOMER_INTEGRATION.md`).

---

## Part 3 — Files in PitchHotshot (copy or port)

### Server / lib

| File | Purpose |
|------|---------|
| `src/lib/roalla-auth/pkce-client.ts` | Browser PKCE helpers; sessionStorage keys match `app-auth.js` |
| `src/lib/roalla-auth/hub-email-auth-parse.ts` | Parse redirect / MFA / verify / error responses |
| `src/lib/roalla-auth/hub-email-auth-server.ts` | Server proxy to hub; builds absolute `return_url` |
| `src/lib/roalla-auth/gateway-config.ts` | `AI_GATEWAY_URL` helpers + `fetchAiGatewayEnabled()` |
| `src/lib/roalla-auth/gateway-client.ts` | OpenAI SDK → `{AI_GATEWAY_URL}/v1` with user JWT or `AUTH_MAIL_SECRET` |
| `src/lib/presentation-evaluator/openai-config.ts` | Model names + `resolveOpenAIClient()` (gateway or legacy direct key) |

### API routes (BFF)

| Route | Hub endpoint |
|-------|----------------|
| `POST /api/auth/email-login` | `POST {AUTH_URL}/api/login` |
| `POST /api/auth/email-register` | `POST {AUTH_URL}/api/register` |
| `POST /api/auth/email-mfa` | `POST {AUTH_URL}/api/mfa/challenge` |
| `POST /api/auth/resend-verification` | `POST {AUTH_URL}/api/resend-verification` |

### UI components

| File | Purpose |
|------|---------|
| `src/components/auth/HubEmailAuthForm.tsx` | Inline form + MFA dialog + verify-email dialog |
| `src/components/auth/HubAuthSection.tsx` | Social buttons + email form + `app-auth.js` bootstrap |
| `src/components/auth/RoallaHubSocialButtons.tsx` | Google / Microsoft / Apple (optional) |
| `src/components/LoginForm.tsx` | Wraps `HubAuthSection` for login |
| `src/components/RegisterForm.tsx` | Wraps `HubAuthSection` for signup |
| `src/app/(marketing)/login/page.tsx` | Passes `authHubUrl`, `authClientId`, `callbackUrl` |
| `src/app/(marketing)/signup/page.tsx` | Same + signup mode |
| `src/app/(marketing)/auth/callback/page.tsx` | OAuth callback |
| `src/components/auth/AuthCallbackClient.tsx` | Code exchange + sync + redirect |

### i18n (example keys in `messages/en.json`)

- `loginForm.mfaTitle`, `mfaHint`, `mfaCodeLabel`, `mfaVerify`, `mfaInvalid`, `mfaCodeRequired`
- `authPages.forgotPasswordLink`, `resendVerificationLink`, `checkEmailTitle`, `checkEmailBody`, `cancel`, `emailVerifiedBanner`

### Customize per app

| Setting | PitchHotshot default | Your app |
|---------|---------------------|----------|
| Post-auth path | `/app/studio` | Your dashboard / home route |
| `buildAuthCallbackReturnUrl()` | Uses `APP_URL` + `/auth/callback?return=…` | Same pattern, different default path |
| UI components | MUI 9 | Your design system (keep fetch/PKCE logic identical) |
| `AuthCallbackClient` errors | Mentions "PitchHotshot" | Your app name |

### Stays on the hub (by design)

| Flow | URL |
|------|-----|
| Forgot password | `{AUTH_URL}/forgot-password.html?client_id={AUTH_CLIENT_ID}` |
| Email verification link (user clicks in inbox) | Hub verifies token → redirect to your `/login?verified=1` |
| Passkey sign-in (WebAuthn ceremony) | `{AUTH_URL}/login.html?client_id=…&return_url=…&code_challenge=…` |
| Passkey registration / management | `{AUTH_URL}/account.html` |

---

## Part 4 — Hub API contract (JSON mode)

All proxied requests use:

```http
POST {AUTH_URL}/api/…
Content-Type: application/json
Accept: application/json
```

Body always includes `client_id: {AUTH_CLIENT_ID}`.

### Login / register request (via your BFF)

```json
{
  "client_id": "your-app-slug",
  "email": "user@example.com",
  "password": "••••••••",
  "return_url": "https://yourapp.com/auth/callback?return=%2Fapp%2Fstudio",
  "code_challenge": "…",
  "code_challenge_method": "S256"
}
```

Register also sends `name`.

### Responses your BFF should handle

| Response | Action in UI |
|----------|----------------|
| `{ "redirect": "https://…/auth/callback?code=…" }` | `window.location.assign(redirect)` |
| `{ "mfaRequired": true, "mfaToken": "…", "mfaMethod": "totp" \| "sms" \| "both" }` | Open MFA dialog → `POST /api/auth/email-mfa` with code |
| `{ "verifyRequired": true, "message": "…" }` | Open verify-email dialog; offer resend |
| `{ "error": "…" }` | Show inline error |

**MFA methods**

| `mfaMethod` | User experience |
|-------------|-----------------|
| `totp` | 6-digit code from authenticator app |
| `sms` | 6-digit code sent by SMS to verified phone |
| `both` | Either TOTP **or** SMS code accepted |

For `sms` or `both`, offer **Resend SMS** in your MFA dialog:

```http
POST {AUTH_URL}/api/mfa/sms/resend
Content-Type: application/json

{ "mfa_token": "…" }
```

Respects hub admin resend cooldown and max attempts.

---

## Part 5 — Environment variables

**Customer app** (your product):

```env
AUTH_URL="https://sso.roalla.com"
AUTH_CLIENT_ID="your-app-slug"
APP_URL="https://yourapp.com"
APP_NAME="Your App Display Name"
AUTH_MAIL_SECRET="ams_…"
AUTH_SMS_SECRET="ass_…"
# Speaking coach / AI features (production — remove OPENAI_API_KEY from app):
AI_GATEWAY_URL="https://ai.roalla.com"
# Optional model overrides (gateway forwards to OpenAI):
# OPENAI_EVAL_MODEL="gpt-4o-mini"
# OPENAI_WHISPER_MODEL="whisper-1"
```

Do **not** set `OPENAI_API_KEY` on the product app when using AI Gateway. Local dev may keep `OPENAI_API_KEY` as a fallback until gateway is wired.

See [Roalla platform — Auth Hub and AI Gateway](#roalla-platform--auth-hub-and-ai-gateway) for login-only vs login+AI onboarding paths.

**Auth Hub** (`auth-api` service — enables passkeys for all clients):

```env
PASSKEYS_ENABLED=true
APP_URL="https://sso.roalla.com"
# WEBAUTHN_RP_ID=sso.roalla.com
# WEBAUTHN_RP_NAME=Roalla Authentication Services
```

**Auth Hub** (`auth-api` service — shared Azure Blob Storage; keys stay on hub only):

```env
AZURE_STORAGE_ACCOUNT_NAME=roallaassets
AZURE_STORAGE_ACCOUNT_KEY=<key1>
AZURE_STORAGE_CONTAINER=roalla-assets
# Optional SAS lifetime (minutes)
# AZURE_STORAGE_SAS_UPLOAD_MINUTES=120
# AZURE_STORAGE_SAS_READ_MINUTES=60
```

Customer apps **must not** contain `AZURE_STORAGE_ACCOUNT_KEY`. They use the hub via BFF `POST /api/storage/sas`.

Customer apps **must not** contain `BREVO_API_KEY`, `TWILIO_*`, or other SMS provider credentials. Use `AUTH_SMS_SECRET` and hub `POST /api/sms/send` ([Part 10](#part-10--hub-transactional-email--sms-product-apis)).

See `.env.example` in each repo. Do **not** put `ADMIN_API_KEY` in customer apps.

---

## Part 6 — Cursor prompt (paste into each app repo)

Replace `{{…}}` placeholders, then paste into Cursor on the target app:

```markdown
Integrate **inline Roalla Auth Hub email sign-in/sign-up** on this app — same pattern as PitchHotshot (`c:\Users\Roalla\PitchHotshot`). Users must stay on **this app’s themed** `/login` and `/signup` pages (no redirect to hub for email/password). Include **MFA**, **verify-email**, **resend verification**, **forgot password link**, and optional **passkey sign-in** (redirect to hub when `passkeysEnabled`).

## App context
- App name: {{APP_NAME}}
- Auth client ID: {{AUTH_CLIENT_ID}}
- Hub URL: {{AUTH_URL}} (e.g. https://sso.roalla.com)
- Post-auth landing path: {{POST_AUTH_PATH}} (e.g. /app/studio or /dashboard)
- UI stack: {{UI_STACK}} (e.g. MUI, Tailwind + shadcn)
- Reference repo: PitchHotshot — see `Roalla-Auth-Hub/docs/ROALLA-HUB_Instructions.md`

## Prerequisites — verify first
1. `@roalla/auth` BFF is wired: `/api/auth/[action]` (session, token, refresh, logout, sync), `public/app-auth.js`, `GET /api/config`, `/auth/callback`.
2. Env vars set: `AUTH_URL`, `AUTH_CLIENT_ID`, `APP_URL`, `APP_NAME`.
3. `/login` and `/signup` pages exist with this app’s theme.

If prerequisites are missing, implement base hub integration from `Roalla-Auth-Hub/docs/AI_CUSTOMER_INTEGRATION.md` first, then continue.

## Implement inline email auth (port from PitchHotshot)

### Server (BFF proxy)
Create/adapt (see PitchHotshot `src/lib/roalla-auth/` and `src/app/api/auth/email-*`):
- `hub-email-auth-server.ts` — `buildAuthCallbackReturnUrl`, `proxyHubAuthApi`, `hubEmailLogin`, `hubEmailRegister`, `hubEmailMfaChallenge`
- `hub-email-auth-parse.ts`
- `POST /api/auth/email-login`, `email-register`, `email-mfa`, `resend-verification`

Default `return_path` to `{{POST_AUTH_PATH}}`.

### Client PKCE
- `pkce-client.ts` — storage key `pa-{clientId}-code-verifier` (must match `app-auth.js`)

### UI
- `HubEmailAuthForm` — login/signup, MFA modal, verify-email modal, forgot-password link to hub
- `HubAuthSection` — social + email form + `app-auth.js`
- Wire into login/signup pages; pass `authHubUrl`, `authClientId`, `callbackUrl`
- Login: banner when `?verified=1`
- Use this app’s form/button/dialog components and theme — not hub `login.html`
- **Passkeys:** if hub `/api/config` has `passkeysEnabled`, add “Sign in with passkey” that redirects to `{AUTH_URL}/login.html` with same PKCE query as social (do not call WebAuthn on your app origin). Link signed-in users to `{AUTH_URL}/account.html` to add a passkey.
- **Storage:** mount `createStorageRouter` at `/api/storage` (Express) or `app/api/storage/sas/route.js` (Next.js). Browser calls your BFF for SAS, then PUTs directly to Azure. See Part 9.
- **Product SMS (optional):** server jobs with `AUTH_SMS_SECRET` → hub `POST /api/sms/send`. See Part 10. Handle `mfaMethod` `sms`/`both` in MFA dialog.

### Do NOT
- Redirect email auth to `{AUTH_URL}/authorize` or `login.html`
- Call hub `/api/login` from the browser
- Change PKCE sessionStorage key format
- Implement inline WebAuthn on your app domain (passkeys are hub `rpId`-bound)
- Show “no WebAuthn support in Roalla Auth Hub” when hub has `passkeysEnabled: true`
- Put `AZURE_STORAGE_ACCOUNT_KEY` in the customer app

## Test plan
1. `/login` — email/password → lands on `{{POST_AUTH_PATH}}`
2. `/signup` — verify-email dialog; resend works
3. MFA account → MFA dialog
4. Social login still works (if enabled)
5. Forgot password → hub page with correct `client_id`
6. Verification email → `/login?verified=1`
7. Passkeys (if hub `PASSKEYS_ENABLED=true`): register at hub `/account.html` → “Sign in with passkey” from app redirects to hub login → callback → `{{POST_AUTH_PATH}}`
8. Storage (if hub `AZURE_STORAGE_*` set): `POST /api/storage/sas` returns `sasUrl`; PUT upload succeeds; `GET` hub avatar URL loads image

Read `Roalla-Auth-Hub/docs/ROALLA-HUB_Instructions.md` for file list and architecture (Part 9 for storage).
```

---

## Part 7 — Per-app placeholder cheat sheet

| Placeholder | PitchHotshot example |
|-------------|---------------------|
| `{{APP_NAME}}` | Pitch Hotshot |
| `{{AUTH_CLIENT_ID}}` | `pitchhotshot` |
| `{{AUTH_URL}}` | `https://sso.roalla.com` |
| `{{POST_AUTH_PATH}}` | `/app/studio` |
| `{{UI_STACK}}` | MUI 9 |

---

## Part 8 — Manual test checklist (after deploy)

1. **Email login** — no hub login page; ends on post-auth path
2. **Signup** — verify-email dialog; resend sends email
3. **Unverified login** — verify dialog (hub returns 403 + `verifyRequired`)
4. **MFA** — 6-digit TOTP and/or SMS dialog → success; SMS resend works when `mfaMethod` is `sms` or `both`
5. **Social** — Google/Microsoft/Apple still work (if enabled)
6. **Forgot password** — hub page opens with your `client_id`; branding from hub client config
7. **Verify link** — click inbox link → `/login?verified=1` success banner
8. **Passkeys** (hub `PASSKEYS_ENABLED=true`) — `GET {AUTH_URL}/api/config?client_id=…` → `passkeysEnabled: true`; register on hub `/account.html`; app passkey button redirects to hub login; sign-in completes via `/auth/callback`
9. **Storage** (hub `AZURE_STORAGE_*` set) — `storageEnabled: true` on hub `/api/config`; app BFF mints SAS; browser uploads directly to Azure; avatar via hub `/api/account/avatar`
10. **SMS** (hub SMS configured) — `smsEnabled: true` on hub `/api/config`; server job with `AUTH_SMS_SECRET` sends test SMS; optional `sms.delivered` webhook
11. **SMS MFA** — user registers phone on hub `/account.html`; login returns `mfaMethod: "sms"` or `"both"`; code arrives by SMS
12. **AI** (gateway onboard for `pitchhotshot`) — analyze upload (Whisper + eval), video gaze, AI coach, audience Q&A score; usage visible on ai.roalla.com admin

---

## Part 9 — Azure Blob Storage (avatars, media, reports)

The Roalla Auth Hub can centralize **one shared Azure Storage account** for all Roalla apps. Customer apps never receive storage account keys — they call the hub through their BFF (same pattern as email auth).

### What lives where

| Content | Stored in Azure | Who mints SAS / uploads |
|---------|-----------------|-------------------------|
| **Avatars** | `{client_id}/avatars/{user_id}.{ext}` | Hub `POST /api/account/avatar` (updates `users.avatar_url`) |
| **Images** | `{client_id}/images/{org_id}/{asset_id}/{file}` | App BFF → hub `POST /api/storage/sas` → browser PUT to Azure |
| **Video / audio** | `{client_id}/media/{org_id}/{asset_id}/{file}` | Same SAS flow (large files — never proxy through hub) |
| **Reports** | `{client_id}/reports/{org_id}/{report_id}/{file}` | Same SAS flow; use `operation: "read"` for private downloads |

Blob path prefix `{client_id}` matches `AUTH_CLIENT_ID` (e.g. `pitchhotshot`).

### Hub setup (operator)

1. Create Azure Storage account + private container (e.g. `roalla-assets`).
2. Set on **auth-api** only:

```env
AZURE_STORAGE_ACCOUNT_NAME=roallaassets
AZURE_STORAGE_ACCOUNT_KEY=<key1>
AZURE_STORAGE_CONTAINER=roalla-assets
```

3. Configure **CORS** on the storage account for browser direct upload (Blob service → Resource sharing (CORS)):
   - Allowed origins: your app origins (`https://pitchhotshot.com`, `http://localhost:3000`, etc.)
   - Allowed methods: `GET`, `PUT`, `OPTIONS`, `HEAD`
   - Allowed headers: `*` (or `content-type,x-ms-*`)

4. Verify: `GET {AUTH_URL}/api/status` → Azure Blob Storage **pass**; `GET {AUTH_URL}/api/config?client_id=…` → `"storageEnabled": true`.

### Hub APIs

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST {AUTH_URL}/api/storage/sas` | Bearer access token + `client_id` | Mint upload or read SAS URL |
| `GET {AUTH_URL}/api/storage/avatars/{userId}?client_id=…` | Public redirect | Short-lived read SAS for `<img src>` |
| `POST {AUTH_URL}/api/account/avatar` | Session cookie or Bearer | Upload avatar (JSON base64) |
| `DELETE {AUTH_URL}/api/account/avatar?client_id=…` | Session cookie or Bearer | Remove custom avatar |

### SAS mint request (via your BFF)

Your browser calls **your app**, not the hub directly:

```http
POST /api/storage/sas
Cookie: roalla_access=…
Content-Type: application/json

{
  "purpose": "media",
  "operation": "upload",
  "filename": "clip.mp4",
  "content_type": "video/mp4",
  "byte_length": 52428800,
  "org_id": "org_abc",
  "asset_id": "asset_xyz"
}
```

Your BFF forwards to the hub with the user's access token and `client_id: AUTH_CLIENT_ID`.

**Response:**

```json
{
  "ok": true,
  "sasUrl": "https://roallaassets.blob.core.windows.net/roalla-assets/pitchhotshot/media/…?sv=…",
  "blobUrl": "https://roallaassets.blob.core.windows.net/roalla-assets/pitchhotshot/media/…",
  "blobPath": "pitchhotshot/media/org_abc/asset_xyz/clip.mp4",
  "expiresAt": "2026-06-29T15:00:00.000Z"
}
```

**Browser upload** (direct to Azure — do not send file bytes to hub or app):

```javascript
await fetch(sasUrl, {
  method: "PUT",
  headers: {
    "x-ms-blob-type": "BlockBlob",
    "Content-Type": contentType,
  },
  body: file,
});
```

Store `blobPath` in your app database for later read SAS or lifecycle rules.

**Read / download** (private reports):

```json
{
  "purpose": "report",
  "operation": "read",
  "blob_path": "pitchhotshot/reports/org_abc/report_123/summary.pdf"
}
```

### `purpose` values and limits

| `purpose` | Max size | Allowed extensions |
|-----------|----------|------------------|
| `avatar` | 5 MB | jpg, jpeg, png, webp, gif |
| `image` | 25 MB | jpg, jpeg, png, webp, gif, heic, heif |
| `media` | 2 GB | mp4, mov, webm, mp3, wav, m4a, aac, ogg |
| `report` | 50 MB | pdf, csv, xlsx, json |

### Avatar upload (hub account API)

Proxied from your BFF or called on hub `account.html` when user is signed in:

```http
POST {AUTH_URL}/api/account/avatar
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "client_id": "pitchhotshot",
  "content_type": "image/jpeg",
  "data": "<base64-encoded image bytes>"
}
```

Response sets `users.avatar_url` to a stable hub URL:

```text
https://sso.roalla.com/api/storage/avatars/{userId}?client_id=pitchhotshot
```

Use that URL in `<img src>` — the hub redirects to a short-lived Azure SAS.

OAuth social avatars remain external URLs until the user uploads a custom avatar.

### App integration (`@roalla/auth`)

**Express** — mount storage BFF (included in hub starter):

```js
const { createStorageRouter, requireAuth } = require("@roalla/auth");
app.use("/api/storage", createStorageRouter({ requireAuth }));
```

**Next.js App Router** — add `app/api/storage/sas/route.js`:

```js
const { createStorageHandlers } = require("@roalla/auth/next");
const handlers = createStorageHandlers({ db, mail });
module.exports = { POST: (req) => handlers.sas(req) };
```

Expose `storageEnabled: true` on your `GET /api/config` when auth is configured (hub handles actual Azure credentials).

### Architecture

```text
[Browser] needs to upload video
    → POST /api/storage/sas on YOUR app (session cookie)

[Your BFF] POST {AUTH_URL}/api/storage/sas
    Authorization: Bearer {access_token}
    Body: { client_id, purpose, operation, filename, … }

[Hub] validates JWT + client_id → returns sasUrl + blobPath

[Browser] PUT file directly to sasUrl (Azure Blob)

[Your app DB] save blobPath, metadata, owner org_id
```

```text
[Browser] display user avatar
    → <img src="{AUTH_URL}/api/storage/avatars/{userId}?client_id=pitchhotshot">
    → hub 302 → short-lived Azure SAS
```

### Do NOT

- Put `AZURE_STORAGE_ACCOUNT_KEY` in customer app env or repos
- Proxy large video/audio through hub Express (timeouts, memory)
- Call hub `/api/storage/sas` from the browser (use your BFF; CORS on hub is not required for SAS minting)
- Use public blob containers — all access via SAS or hub avatar redirect

---

## Part 10 — Hub transactional email & SMS (product APIs)

The hub centralizes **Brevo** (email + SMS) and/or **Twilio** (SMS). Customer apps never receive provider API keys. Your **server** calls hub APIs with per-app secrets (`AUTH_MAIL_SECRET`, `AUTH_SMS_SECRET`).

### What the hub sends vs what your app sends

| Message type | Who sends | Your app code |
|--------------|-----------|---------------|
| Email verify / password reset | Hub (automatic) | Link to hub forgot-password; no API call |
| SMS MFA login codes | Hub (automatic) | Handle `mfaMethod` in login flow; optional resend API |
| Phone verify for SMS MFA | Hub (`/account.html`) | Link users to hub account page |
| Product email (notifications, invites) | Hub on your behalf | `POST /api/mail/send` + `AUTH_MAIL_SECRET` |
| Product SMS (alerts, OTP, updates) | Hub on your behalf | `POST /api/sms/send` + `AUTH_SMS_SECRET` |

### Per-app secrets

Issued at client registration (in admin env snippet or portal). **Server-side only** — same security model as `AUTH_MAIL_SECRET`.

| Secret | Prefix | Rotate via |
|--------|--------|------------|
| `AUTH_MAIL_SECRET` | `ams_` | Admin → client → **Rotate mail secret** |
| `AUTH_SMS_SECRET` | `ass_` | Admin → client → **Rotate SMS secret** |

### Hub auth email (verify / reset)

The hub sends account emails using per-app `auth@{sender_domain}` when the domain is authenticated in Brevo.

| Field | Example |
|-------|---------|
| From display name | Your `brand_name` |
| From address | `auth@yourdomain.com` (hub client `sender_email`) |
| Fallback | Hub `EMAIL_FROM` if domain not in Brevo |

**Operator setup:** `docs/BREVO_SETUP.md` (DNS, `BREVO_API_KEY` on hub only).

Forgot-password and resend-verification should pass `client_id` in the login redirect query when available so branding matches your app.

### Product email API

```http
POST {AUTH_URL}/api/mail/send
Authorization: Bearer {AUTH_MAIL_SECRET}
Content-Type: application/json

{
  "client_id": "{AUTH_CLIENT_ID}",
  "to": "user@example.com",
  "subject": "Your order shipped",
  "html": "<p>…</p>",
  "text": "…"
}
```

Optional per-client **product From**: `product_sender_email` (default `noreply@{sender_domain}`).

### Product SMS API

```http
POST {AUTH_URL}/api/sms/send
Authorization: Bearer {AUTH_SMS_SECRET}
Content-Type: application/json

{
  "client_id": "{AUTH_CLIENT_ID}",
  "to": "+15551234567",
  "body": "Your order #1234 shipped."
}
```

| Field | Rules |
|-------|--------|
| `to` | E.164 (`+1…`) or local digits (uses hub default country code, usually `1`) |
| `body` | Plain text; max 1600 chars; may be wrapped by hub **product template** (`{{brand}}`, `{{body}}`) |
| Recipients | One request: up to **10** numbers in `to` array |

**Node.js example (server route or job):**

```javascript
async function sendOrderSms({ to, message }) {
  const res = await fetch(`${process.env.AUTH_URL}/api/sms/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AUTH_SMS_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.AUTH_CLIENT_ID,
      to,
      body: message,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `SMS failed (${res.status})`);
  return data;
}
```

### HTTP status codes (product SMS)

| Status | Meaning |
|--------|---------|
| `200` | Sent (check `results[].sid` per recipient) |
| `400` | Bad request (missing fields, invalid phone) |
| `401` | Wrong or missing `AUTH_SMS_SECRET` |
| `403` | App SMS disabled/paused, or country blocked |
| `429` | Hub or per-app SMS cap reached |
| `503` | Hub SMS not configured or product SMS disabled globally |

### SMS MFA (end users)

Users manage SMS MFA on the **hub account page** (not in your app DB):

1. Open `{AUTH_URL}/account.html?client_id={AUTH_CLIENT_ID}` (after sign-in or hub session).
2. Verify phone → receive SMS code → enable SMS MFA.
3. TOTP and SMS MFA can both be enabled.

Your app only needs to handle login-time MFA (see [Part 4](#part-4--hub-api-contract-json-mode)).

**Hub APIs** (called from hub `account.html` or your BFF if you proxy — typically hub-hosted):

| Endpoint | Purpose |
|----------|---------|
| `POST /api/mfa/sms/request-phone` | Send verify code to new phone |
| `POST /api/mfa/sms/confirm-phone` | Confirm phone with code |
| `POST /api/mfa/sms/enable` | Turn on SMS MFA |
| `POST /api/mfa/sms/send-disable-code` | Code to disable SMS MFA |
| `POST /api/mfa/sms/disable` | Disable with code |
| `POST /api/mfa/sms/resend` | Resend login MFA SMS (`mfa_token`) |

Login MFA verification (after email/password):

```http
POST {AUTH_URL}/api/mfa/challenge
Content-Type: application/json

{
  "mfa_token": "…",
  "code": "123456"
}
```

On success → same `redirect` with `code` as password-only login.

### Per-app SMS overrides (admin)

Hub admin can set per client (**Edit client → Per-app SMS**):

| Setting | Effect |
|---------|--------|
| Product SMS enabled | When off, `POST /api/sms/send` returns 403 for this app |
| Pause SMS | Blocks all SMS for this app (product + metered auth SMS tagged with client) |
| Brevo sender name | Overrides `BREVO_SMS_SENDER` for this app’s messages |
| Country allowlist | Restrict destinations (comma-separated dial codes, e.g. `1,44`) |

### Delivery webhooks (optional)

If your client has `webhook_url` set:

| Event | Source |
|-------|--------|
| `sms.delivered` | Twilio status callback or Brevo webhook |
| `sms.failed` | Provider failure |

Configure Brevo to POST to `{AUTH_URL}/webhooks/brevo/sms`. Twilio callbacks are set automatically when hub `APP_URL` is set.

### What your app must NOT do

- Put `BREVO_API_KEY`, `TWILIO_ACCOUNT_SID`, or SMS provider SDKs in the **customer app**
- Call `/api/sms/send` from the browser (secret exposure)
- Store users’ SMS MFA secrets or phone OTPs locally — hub owns MFA state
- Implement a second SMS provider alongside the hub for the same product flows (splits billing and deliverability)

### Operator checklist (hub team)

1. Configure Brevo SMS and/or Twilio on hub env — see `docs/BREVO_SMS_SETUP.md`
2. Admin → **Usage** → enable providers, set primary/failover, **Send test**
3. Set caps / templates / country allowlist as needed
4. Copy `AUTH_SMS_SECRET` into app Railway env with `AUTH_CLIENT_ID`
5. Usage tab shows per-app SMS counts and Brevo/Twilio breakdown

---

## Part 10b — Security (operators & app developers)

Recent hub hardening affects how you configure production and call certain APIs.

### Operator env (required in production)

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | **Required** in production — signs SSO session cookies (64+ random chars) |
| `TOTP_ENCRYPTION_KEY` | Encrypts TOTP secrets at rest (32+ chars; falls back to `SESSION_SECRET` with a startup warning) |
| `BREVO_WEBHOOK_SECRET` | Validates inbound Brevo SMS delivery webhooks (`X-Brevo-Webhook-Secret` or `?secret=`) |
| `SESSION_MFA_TTL_MS` | How long an MFA-verified SSO session stays trusted (default 12 hours) |
| `WEBAUTHN_REQUIRE_UV=true` | Passkey sign-in requires user verification in production (default) |

Use distinct RS256 `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` for access tokens — session cookies do not fall back to JWT keys in production.

### MFA step-up on SSO

When a user has MFA enabled (TOTP and/or SMS), a cross-app SSO cookie alone is not enough for `/authorize`: the hub re-prompts for MFA if `mfa_verified_at` is missing or older than `SESSION_MFA_TTL_MS`. Password, passkey, and MFA challenge flows set `mfa_verified_at` after a successful second factor.

### Token introspection (breaking change)

`POST /oauth/introspect` now **requires** `client_id` in the JSON body. The hub validates the token audience matches that client and rate-limits the endpoint. Apps that introspect tokens must send their registered `client_id`.

```http
POST {AUTH_URL}/oauth/introspect
Content-Type: application/json

{ "token": "<access_token>", "client_id": "your-app-slug" }
```

### Token revocation (RFC 7009)

Refresh tokens can be revoked via OIDC discovery `revocation_endpoint` (`POST /oauth/revoke`). Access tokens are short-lived JWTs and cannot be centrally revoked — use introspection or wait for expiry.

```http
POST {AUTH_URL}/oauth/revoke
Content-Type: application/x-www-form-urlencoded

token=<refresh_token>&token_type_hint=refresh_token&client_id=your-app-slug
```

`POST /api/logout` remains for browser/BFF sign-out (session cookie + optional refresh token).

### Registration tokens

One-time registration tokens are validated at the start of `/api/register` and portal onboard, but **consumed only after** the client row is created successfully — failed attempts do not burn the token.

### CORS on client lookup

`GET /api/clients/:id` (and related lookup) uses the same origin rules as the token endpoint (`allowed_cors_origins` on the client).

### App developer checklist

- [ ] Never put `BREVO_*`, `TWILIO_*`, `ADMIN_API_KEY`, or `AUTH_*_SECRET` in the browser
- [ ] Introspect with `client_id` if your BFF validates tokens server-side
- [ ] Handle MFA `sms` / `both` in login UI when hub returns those methods (`@roalla/auth` exports `isMfaLoginResponse`, `submitMfaChallenge`, `resendMfaSms`; browser: `packages/auth/browser/hub-mfa.js`)
- [ ] Sensitive account actions (password change, revoke sessions, passkeys) require recent MFA when enabled — use `POST /api/account/step-up/send` for SMS codes
- [ ] Use HTTPS return URLs only (except `localhost` for dev)

### Portal secret rotation

Client portal (`/portal.html`) can rotate `AUTH_MAIL_SECRET` and `AUTH_SMS_SECRET` without admin access:

```http
POST /api/portal/clients/{client_id}/mail-secret
POST /api/portal/clients/{client_id}/sms-secret
Authorization: Bearer {portal_token}
```

---

## Part 11 — Roalla AI Gateway (developer integration)

The Roalla AI Gateway centralizes **OpenAI API keys**, **monthly usage limits**, and **JWT verification** (via Auth Hub JWKS). Customer apps never store `OPENAI_API_KEY` in production — they call the gateway from **server-side** code with the user's Auth Hub access token (same BFF pattern as storage SAS).

**For the AI Gateway team:** see [Handoff to Roalla AI Gateway team (PitchHotshot)](#handoff-to-roalla-ai-gateway-team-pitchhotshot) — copy-paste onboarding spec.

See also: [`docs/AI-GATEWAY-RELATIONSHIP.md`](./AI-GATEWAY-RELATIONSHIP.md) · admin [`docs/ROALLA-PLATFORM.md`](./ROALLA-PLATFORM.md).

### What lives where

| Concern | Auth Hub (sso) | AI Gateway (ai) | Product app |
|---------|----------------|-----------------|-------------|
| User login / JWT | ✓ issuer | verifies JWT | BFF session + `resolveHubAccessToken()` |
| OpenAI / Whisper keys | — | ✓ | **never** |
| Monthly AI limits | — | ✓ per `client_id` | app rate limits optional |
| Transcripts, scores, coach | — | — | app DB |

### Operator setup (PitchHotshot)

1. Login already registered: `AUTH_CLIENT_ID=pitchhotshot` on sso.roalla.com.
2. Open **https://ai.roalla.com/onboard.html** → check **Already on SSO** → App ID `pitchhotshot`.
3. Set monthly allowance (one practice run ≈ 2–5 requests: Whisper + eval + optional vision + coach turns).
4. Connect OpenAI on **ai.roalla.com/admin.html** → AI providers.
5. Developer env: `AI_GATEWAY_URL=https://ai.roalla.com`, remove `OPENAI_API_KEY` from Railway.

Verify: `GET /api/config` on your app returns `aiEnabled: true` (when gateway is reachable).

### App environment

```env
AI_GATEWAY_URL="https://ai.roalla.com"
AUTH_URL="https://sso.roalla.com"
AUTH_CLIENT_ID="pitchhotshot"
AUTH_MAIL_SECRET="ams_…"
OPENAI_EVAL_MODEL="gpt-4o-mini"
OPENAI_WHISPER_MODEL="whisper-1"
```

`AUTH_MAIL_SECRET` is required for **server-side** AI when no user session exists (e.g. human-feedback synthesis after guest submit) — same pattern as hub storage SAS.

### Client pattern (PitchHotshot reference)

PitchHotshot uses the **OpenAI Node SDK** pointed at the gateway (OpenAI-compatible `/v1`):

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "roalla-gateway",
  baseURL: `${process.env.AI_GATEWAY_URL}/v1`,
  defaultHeaders: {
    Authorization: `Bearer ${accessToken}`,
    "X-Client-Id": process.env.AUTH_CLIENT_ID,
  },
});
```

Use `resolveOpenAIClient()` from `src/lib/presentation-evaluator/openai-config.ts` — it selects gateway vs legacy `OPENAI_API_KEY` and resolves the token.

**Do not** call `ai.roalla.com` from the browser. All AI runs on your server (API routes / server actions).

### Auth for AI calls

| Flow | Token |
|------|-------|
| Signed-in user (analyze, coach, audience score) | `await resolveHubAccessToken()` from session |
| Background / guest-triggered (feedback synthesis) | `AUTH_MAIL_SECRET` as Bearer when `accessToken: null` |

### OpenAI surfaces used by PitchHotshot

| Feature | OpenAI API | File |
|---------|------------|------|
| Transcription | `audio.transcriptions.create` (Whisper) | `whisper.ts` |
| Evaluation scoring | `chat.completions` + JSON | `openai-evaluate.ts` |
| AI coach | `chat.completions` | `openai-coach.ts` |
| Video gaze / presence | `responses.create` + images | `visual-gaze-analysis.ts` |
| Human feedback summary | `chat.completions` + JSON | `human-feedback-ai-synthesis.ts` |
| Audience Q&A score | `chat.completions` + JSON | `audience-challenges/score/route.ts` |

Confirm with gateway ops that **`/v1/audio/transcriptions`** and **`/v1/responses`** (vision) are enabled. If vision is unavailable, gaze analysis returns `ai_unavailable` and scores fall back to heuristics.

### PitchHotshot call-site summary

| Route / job | Passes `hubAccessToken` |
|-------------|-------------------------|
| `POST …/analyze-upload` | Yes — Whisper, gaze, `runEvaluation` |
| `POST …/analyze-transcript` | Yes — `runEvaluation` |
| `POST …/ai-coach` | Yes — per message |
| `POST …/audience-challenges/score` | Yes |
| Human feedback submit (async) | `accessToken: null` → `AUTH_MAIL_SECRET` |

### Architecture

```text
[Browser] starts practice analysis
    → POST /api/evaluations/…/analyze-upload (session cookie)

[Your BFF] resolveHubAccessToken()
    → OpenAI SDK baseURL = {AI_GATEWAY_URL}/v1
    → Authorization: Bearer {access_token}
    → X-Client-Id: pitchhotshot

[AI Gateway] verifies JWT (Auth Hub JWKS), checks monthly limit
    → calls OpenAI (Whisper, gpt-4o-mini, vision)

[Your app DB] stores scores, transcript, coach history
```

### Fallback behavior

If the gateway is down or returns an error, PitchHotshot **falls back to heuristic scoring** (`computeEvaluation`) for transcript analysis. Whisper failures surface as upload errors. UI can read `aiEnabled` from `GET /api/config`.

### Monthly allowance sizing (rule of thumb)

| User action | Approx. gateway requests |
|-------------|---------------------------|
| Upload + auto-transcribe + eval | 2 |
| Video upload + gaze analysis | +1 |
| AI coach message | +1 each |
| Guest feedback synthesis | +1 |

Start with **50,000/month** for active studio apps; adjust in ai.roalla.com admin.

### Do NOT

- Put `OPENAI_API_KEY` in product app env or repos (production)
- Call AI Gateway from the browser (expose keys / bypass limits)
- Use different `client_id` on AI Gateway vs Auth Hub
- Skip `AUTH_MAIL_SECRET` if you use server-side AI without a user session

### Test checklist

1. Register `pitchhotshot` on ai.roalla.com (Already on SSO)
2. Railway: `AI_GATEWAY_URL` set, `OPENAI_API_KEY` removed
3. Upload practice clip → transcript + scores returned
4. Video clip → gaze metrics or graceful `ai_unavailable`
5. AI coach → reply persisted
6. Guest feedback submit → `ai_synthesis` on payload (when `AUTH_MAIL_SECRET` set)
7. ai.roalla.com admin → usage increments

---

### Handoff to Roalla AI Gateway team (PitchHotshot)

> **Purpose:** Copy this subsection to the AI Gateway team when onboarding **PitchHotshot** (`client_id` / App ID: `pitchhotshot`). It describes exactly how the product app calls the gateway today.

#### App registration

| Field | Value |
|-------|-------|
| **App ID / `client_id`** | `pitchhotshot` (must match Auth Hub `AUTH_CLIENT_ID`) |
| **Auth Hub** | Already registered on sso.roalla.com |
| **Onboard form** | https://ai.roalla.com/onboard.html — check **Already on SSO** |
| **Production app URL** | `https://www.pitchhotshot.com` (or current `APP_URL`) |
| **Suggested monthly allowance** | **50,000** requests/month to start (see usage table below) |
| **OpenAI provider** | Must be connected on ai.roalla.com admin → AI providers |

#### How PitchHotshot calls the gateway

| Item | Detail |
|------|--------|
| **Caller** | PitchHotshot **server only** (Next.js API routes / server actions). Browser never calls the gateway. |
| **SDK** | OpenAI Node SDK (`openai` npm package) |
| **Base URL** | `{AI_GATEWAY_URL}/v1` (e.g. `https://ai.roalla.com/v1`) |
| **Placeholder API key** | `roalla-gateway` (SDK requires a string; gateway must ignore and use `Authorization` Bearer) |
| **Client identification header** | `X-Client-Id: pitchhotshot` on every request |
| **Product repo** | `src/lib/roalla-auth/gateway-client.ts` |

#### Authentication (two Bearer types)

The gateway must accept **either** token type and attribute usage to `client_id=pitchhotshot`.

| Bearer type | When used | How gateway should validate |
|-------------|-----------|----------------------------|
| **User access token** | Signed-in flows: analyze upload, transcript eval, AI coach, audience Q&A, video gaze | Verify JWT via Auth Hub JWKS: `GET {AUTH_URL}/.well-known/jwks.json` (`AUTH_URL=https://sso.roalla.com`). Same tokens used for hub storage SAS. |
| **`AUTH_MAIL_SECRET`** (`ams_…`) | Server-side jobs with no user session: human-feedback AI synthesis after guest/member submit | Same validation as Auth Hub `POST /api/mail/send` and `POST /api/storage/sas` service Bearer. Issued per app from hub portal. |

**Required env on gateway service:** `AUTH_URL=https://sso.roalla.com` (for JWKS). App ID in JWT claims or `X-Client-Id` header must match registered `pitchhotshot`.

#### OpenAI-compatible endpoints required

| Priority | OpenAI surface | HTTP path (typical) | Used for |
|----------|----------------|-------------------|----------|
| **P0** | Chat Completions | `POST /v1/chat/completions` | Evaluation scoring, AI coach, feedback synthesis, audience Q&A |
| **P0** | Audio transcriptions | `POST /v1/audio/transcriptions` | Whisper — practice audio/video → transcript |
| **P1** | Responses API (vision) | `POST /v1/responses` | Video gaze / presence analysis (multi-image input) |

If **Responses API** is not proxied, PitchHotshot still works: gaze returns `ai_unavailable` and visual scores use heuristics only.

#### Models (app-configurable via env)

| Env var | Default | Used on |
|---------|---------|---------|
| `OPENAI_EVAL_MODEL` | `gpt-4o-mini` | Chat completions + Responses (vision) |
| `OPENAI_WHISPER_MODEL` | `whisper-1` | Audio transcriptions |

Gateway should **forward** the `model` field from requests (not hardcode). PitchHotshot does not call Anthropic today.

#### Per-feature request specification

**1. Whisper transcription** (`whisper.ts`)

- **Trigger:** `POST /api/evaluations/presentation-evaluation/analyze-upload` when user does not paste a transcript
- **API:** `client.audio.transcriptions.create({ model, file, prompt })`
- **File size:** ≤ **25 MB** (`WHISPER_MAX_BYTES`)
- **Typical clip:** 60–120 s WebM/MP4 from browser record or upload
- **Auth:** User access token
- **Notes:** Multipart upload; gateway timeout should allow ≥ **120 s** for large files

**2. Evaluation scoring** (`openai-evaluate.ts`)

- **Trigger:** Same analyze flow + `analyze-transcript` route
- **API:** `chat.completions.create` with `response_format: { type: "json_object" }`
- **Model:** `gpt-4o-mini` (default)
- **Temperature:** `0.35`
- **Input size:** Transcript capped at **48,000 characters** in prompt
- **Output:** Large JSON object (scores, recommendations, drills, narrative fields)
- **Auth:** User access token (passed as `hubAccessToken` through `runEvaluation`)

**3. Video gaze / presence** (`visual-gaze-analysis.ts`)

- **Trigger:** Video analyze-upload only (skipped for audio-only)
- **API:** `responses.create` with **up to ~32 JPEG frames** (`fps=1`, max 32 frames, 640px wide) as `input_image` + `detail: "low"`
- **Model:** `gpt-4o-mini` (default)
- **Payload:** Large — base64 images in JSON body; allow **≥ 60 s** timeout
- **Auth:** User access token
- **Fallback:** `ai_unavailable` if gateway/OpenAI errors

**4. AI coach chat** (`openai-coach/route.ts`)

- **Trigger:** `POST …/presentation-evaluation/{id}/ai-coach`
- **API:** `chat.completions.create`
- **Model:** `gpt-4o-mini`
- **Temperature:** `0.5`, **max_tokens:** `700`
- **Context:** Transcript excerpt up to **6,000** chars + scores + optional human reviewer feedback
- **Auth:** User access token per message

**5. Human feedback synthesis** (`human-feedback-ai-synthesis.ts`)

- **Trigger:** Async after guest/member submits feedback (no presenter session)
- **API:** `chat.completions.create` with `response_format: { type: "json_object" }`
- **Model:** `gpt-4o-mini`
- **Temperature:** `0.3`, **max_tokens:** `300`
- **Auth:** **`AUTH_MAIL_SECRET` as Bearer** (`accessToken: null` in app code)

**6. Audience challenge scoring** (`audience-challenges/score/route.ts`)

- **Trigger:** User scores a Dragon's Den–style Q&A answer
- **API:** `chat.completions.create` with `response_format: { type: "json_object" }`
- **Model:** `gpt-4o-mini`
- **Temperature:** `0.2`
- **Auth:** User access token

#### Request volume per user action

| User action | Gateway requests (approx.) | APIs |
|-------------|---------------------------|------|
| Practice upload (no pasted transcript) | **2–3** | Whisper + chat completion (+ responses if video) |
| Practice upload (pasted transcript) | **1–2** | Chat completion (+ responses if video) |
| Transcript-only analyze | **1** | Chat completion |
| AI coach message | **1** | Chat completion |
| Guest feedback submit | **1** | Chat completion (service Bearer) |
| Audience Q&A score (per question) | **1** | Chat completion |

**App-side rate limits** (in addition to gateway monthly cap): max **40** new evaluations/user/hour, **4** concurrent processing jobs/user.

#### Health / config endpoints (app probes)

PitchHotshot `GET /api/config` exposes `aiEnabled` by probing the gateway:

| Probe | URL | Expected |
|-------|-----|----------|
| Preferred | `GET {AI_GATEWAY_URL}/api/config?client_id=pitchhotshot` | JSON with `aiEnabled: true` or `enabled: true` |
| Fallback | `GET {AI_GATEWAY_URL}/api/health` | Non-error status |

Please confirm the canonical config URL and response shape so the app can detect misconfiguration.

#### Gateway team checklist

- [ ] Register **`pitchhotshot`** on ai.roalla.com (Already on SSO)
- [ ] Set monthly allowance (suggest **50,000** to start)
- [ ] Connect **OpenAI** provider with Whisper + chat + vision-capable model access
- [ ] Proxy **`POST /v1/chat/completions`** with `response_format` JSON mode
- [ ] Proxy **`POST /v1/audio/transcriptions`** (multipart, ≤ 25 MB)
- [ ] Proxy **`POST /v1/responses`** with multi-image input (or confirm P1 deferral)
- [ ] Verify JWT via **`https://sso.roalla.com/.well-known/jwks.json`**
- [ ] Accept **`AUTH_MAIL_SECRET`** Bearer for server-side calls (same as Auth Hub mail/storage)
- [ ] Honor **`X-Client-Id: pitchhotshot`** (confirm header name if different in gateway)
- [ ] Timeouts: ≥ **120 s** for Whisper; ≥ **60 s** for vision responses
- [ ] Return standard OpenAI error JSON on failure (app falls back to heuristics for chat; Whisper errors fail the upload)

#### Product app env (for gateway team reference)

```env
AI_GATEWAY_URL=https://ai.roalla.com
AUTH_URL=https://sso.roalla.com
AUTH_CLIENT_ID=pitchhotshot
AUTH_MAIL_SECRET=ams_…
OPENAI_EVAL_MODEL=gpt-4o-mini
OPENAI_WHISPER_MODEL=whisper-1
# OPENAI_API_KEY — must NOT be set in production
```

#### Open questions for gateway team

1. Is **`X-Client-Id`** the correct header name, or should PitchHotshot send `client_id` another way?
2. Is **`POST /v1/responses`** supported today? If not, ETA for vision / multi-image?
3. Should **`AUTH_MAIL_SECRET`** map to the same service-token validator as Auth Hub storage SAS?
4. Preferred **`/api/config?client_id=`** response schema for `aiEnabled`?
5. Per-request vs per-token metering — does one Whisper upload count as 1 toward monthly allowance?

#### Reference implementation (PitchHotshot)

| File | Role |
|------|------|
| `src/lib/roalla-auth/gateway-config.ts` | `AI_GATEWAY_URL`, `isAiEvaluationConfigured()` |
| `src/lib/roalla-auth/gateway-client.ts` | OpenAI SDK client + headers |
| `src/lib/presentation-evaluator/openai-config.ts` | `resolveOpenAIClient()` |
| `src/lib/presentation-evaluator/whisper.ts` | Whisper |
| `src/lib/presentation-evaluator/openai-evaluate.ts` | Scoring |
| `src/lib/presentation-evaluator/visual-gaze-analysis.ts` | Vision |
| `src/lib/presentation-evaluator/openai-coach.ts` | Coach |
| `src/lib/human-feedback-ai-synthesis.ts` | Feedback synthesis |
| `src/app/api/evaluations/presentation-evaluation/analyze-upload/route.ts` | Main analyze entry |

---

## Part 12 — Faster path for Next.js + MUI apps

If the target app uses Next.js App Router and MUI like PitchHotshot, add to the Cursor prompt:

> Copy the PitchHotshot files listed in Part 3 verbatim. Only change: default `return_path`, i18n keys, MUI `color` props, and app name strings in `AuthCallbackClient`.

---

## Related docs

- Base hub integration: `Roalla-Auth-Hub/docs/AI_CUSTOMER_INTEGRATION.md` (mail + SMS API summary in §8)
- **This doc — app reference:** [App developer quick reference](#app-developer-quick-reference) · [Part 10 SMS/mail](#part-10--hub-transactional-email--sms-product-apis)
- Login + AI platform (Auth Hub view): [`docs/AI-GATEWAY-RELATIONSHIP.md`](./AI-GATEWAY-RELATIONSHIP.md) · [platform page](https://sso.roalla.com/platform.html)
- AI Gateway developer integration: [Part 11](#part-11--roalla-ai-gateway-developer-integration) in this doc
- **Gateway team handoff (PitchHotshot):** [Part 11 — Handoff subsection](#handoff-to-roalla-ai-gateway-team-pitchhotshot)
- Full platform doc (AI Gateway repo): `docs/ROALLA-PLATFORM.md` in Roalla-AI-Gateway
- Brevo / email DNS: `Roalla-Auth-Hub/docs/BREVO_SETUP.md`
- Brevo SMS credits & sender: `Roalla-Auth-Hub/docs/BREVO_SMS_SETUP.md`
- PitchHotshot deploy env: `docs/RAILWAY-DEPLOY.md`
- Hub discovery: `{AUTH_URL}/.well-known/openid-configuration`
- Threat model: `Roalla-Auth-Hub/docs/THREAT-MODEL.md`
