# Roalla platform — Login + AI

Plain-language guide to how **Roalla Auth Hub** and **Roalla AI Gateway** work together. Share this with admins, ops, and developers.

| You are… | Start here |
|----------|------------|
| **Admin (no coding)** | [AI Gateway getting started](GETTING-STARTED.md) · [Print quick start](https://ai.roalla.com/quickstart.html) · [Auth Hub guide](https://sso.roalla.com/guide.html) |
| **Developer (AI Gateway)** | [PORTING.md](../PORTING.md) · [Hub Instructions Part 11 handoff](./ROALLA-HUB_Instructions.md#handoff-to-roalla-ai-gateway-team-pitchhotshot) |
| **Developer (Auth Hub)** | [Auth Hub PORTING](https://github.com/roalla/Roalla-Auth-Hub/blob/main/PORTING.md) |

---

## Two websites, two jobs

Roalla splits **who you are** (login) from **AI usage** (OpenAI, limits, billing). Both are required for apps that use AI, but you manage them on different sites.

| Website | What it does | Who manages it |
|---------|----------------|----------------|
| **https://sso.roalla.com** | User sign-in, passwords, Google/social login, user accounts, JWT tokens, email, SMS, MFA | Auth Hub admin / your developer |
| **https://ai.roalla.com** | OpenAI & Anthropic keys, AI request routing, monthly limits, usage reports | AI Gateway admin (you, with admin password) |

**Rule of thumb**

- **Login broken?** → look at **sso.roalla.com**
- **AI broken, limits, OpenAI?** → look at **ai.roalla.com**

OpenAI keys live **only** on the AI Gateway. Product apps (TOVA, customer portals, etc.) never store `OPENAI_API_KEY`.

---

## How it fits together

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

1. User opens your app and clicks **Sign in** → redirected to **sso.roalla.com**.
2. After login, the app holds a **JWT** (a secure token proving who the user is).
3. When the user uses an AI feature, the app sends that JWT to **ai.roalla.com**.
4. AI Gateway checks the token, enforces the monthly limit, and calls OpenAI with the **central key**.

---

## Admin bookmark list

### AI Gateway (ai.roalla.com)

| Page | URL | Use for |
|------|-----|---------|
| **Add an app** | https://ai.roalla.com/onboard.html | Register apps — one form, copy text for developer |
| **Print quick start** | https://ai.roalla.com/quickstart.html | One-page PDF-style cheat sheet |
| **Help for admins** | https://ai.roalla.com/guide.html | Searchable step-by-step help |
| **Admin console** | https://ai.roalla.com/admin.html | Usage, limits, OpenAI keys |
| **Status check** | https://ai.roalla.com/status.html | Is AI Gateway healthy? |

### Auth Hub (sso.roalla.com)

| Page | URL | Use for |
|------|-----|---------|
| **Admin guide** | https://sso.roalla.com/guide.html | Register apps for login, client portal |
| **Login + AI overview** | https://sso.roalla.com/platform.html | This relationship explained on the SSO site |
| **Status** | https://sso.roalla.com/status.html | Is sign-in working? |
| **Client portal** | https://sso.roalla.com/portal.html | Customer self-service onboarding |
| **Admin console** | https://sso.roalla.com/admin.html | Users, clients, registration tokens |

---

## Adding an app — which path?

### Path A — Brand-new app (needs login **and** AI)

**Easiest:** one form on AI Gateway (if SSO sync is configured by your developer).

1. Connect OpenAI once: **ai.roalla.com/admin.html** → AI providers
2. Open **ai.roalla.com/onboard.html**
3. Fill in app details — leave **“Already on SSO” unchecked**
4. Register → copy text → send to developer

This registers the app on **both** sso.roalla.com and ai.roalla.com when `AUTH_HUB_ADMIN_API_KEY` is set on the gateway.

**Alternative:** register login first on Auth Hub ([guide](https://sso.roalla.com/guide.html)), then add AI via onboard form with **“Already on SSO” checked**.

### Path B — App already on SSO (e.g. TOVA)

Login already works. You only add AI:

1. Open **https://ai.roalla.com/onboard.html**
2. Paste AI Gateway admin password
3. Fill in:

| Field | Example (TOVA) |
|-------|----------------|
| App ID | `tova` (same ID as on SSO) |
| App name | `TOVA` |
| Website URL | `https://tova.roalla.com` |
| Monthly allowance | `50000` |
| **Already on SSO** | ✓ **Checked** |

4. Register → **Copy text for developer** → send by email or Slack
5. Developer adds `AI_GATEWAY_URL=https://ai.roalla.com` and removes `OPENAI_API_KEY` from the app

You do **not** re-register login on sso.roalla.com.

### Path C — Login only (no AI)

Use **sso.roalla.com** only — [Auth Hub guide](https://sso.roalla.com/guide.html). Skip AI Gateway until the app needs AI features.

---

## What the developer receives

After onboard, admins copy a short block like:

```env
AUTH_URL=https://sso.roalla.com
AUTH_CLIENT_ID=tova
AI_GATEWAY_URL=https://ai.roalla.com
APP_URL=https://tova.roalla.com
```

Admins do not edit this — send it to the developer. They paste it into Railway or the app’s `.env` file.

---

## Day-to-day — who does what

| Task | Where |
|------|-------|
| Add app (login + AI together) | ai.roalla.com/onboard.html |
| Add app (login only) | sso.roalla.com/guide.html or portal |
| Add AI to existing SSO app | ai.roalla.com/onboard.html + “Already on SSO” |
| Reset user password / unlock account | sso.roalla.com admin |
| Raise AI monthly limit | ai.roalla.com admin → Spending limits |
| See AI usage | ai.roalla.com admin → AI usage |
| Replace OpenAI key | ai.roalla.com admin → AI providers |
| Pause AI for one app | ai.roalla.com admin → Connected apps |
| Registration token for customer | sso.roalla.com admin |

---

## Troubleshooting

| Symptom | Fix on |
|---------|--------|
| Can’t sign in, wrong password, Google login fails | **sso.roalla.com** — status, admin, guide |
| Sign-in works, AI greyed out or errors | **ai.roalla.com** — providers, usage, re-send snippet |
| AI stopped mid-month | ai.roalla.com → AI usage (limit hit?) |
| New app needs both login and AI | ai.roalla.com/onboard.html (or SSO guide first) |
| JWKS / token errors (developer) | `AUTH_URL` must be `https://sso.roalla.com` on both app and AI Gateway |

---

## Developer reference (short)

| Variable | Set on | Purpose |
|----------|--------|---------|
| `AUTH_URL` | App + AI Gateway | `https://sso.roalla.com` |
| `AUTH_CLIENT_ID` | App | Same app ID on both hubs |
| `AI_GATEWAY_URL` | App | `https://ai.roalla.com` |
| `AUTH_HUB_ADMIN_API_KEY` | AI Gateway only (server) | Lets onboard form sync to SSO |
| `OPENAI_API_KEY` | AI Gateway only | Never on product apps |

SDK: `@roalla/gateway` in apps · `@roalla/auth` for login.

Full developer runbooks:

- AI Gateway: [PORTING.md](../PORTING.md)
- Auth Hub: [PORTING.md](https://github.com/roalla/Roalla-Auth-Hub/blob/main/PORTING.md)

---

## Glossary

| Term | Meaning |
|------|---------|
| **SSO** | Single sign-on — one login for many apps (sso.roalla.com) |
| **Auth Hub** | Roalla’s login service at sso.roalla.com |
| **AI Gateway** | Roalla’s AI proxy at ai.roalla.com |
| **App ID / client_id** | Short code for an app, e.g. `tova` — must match on both services |
| **JWT** | Token proving a user is signed in — apps pass it to AI Gateway |
| **Admin password** | Secret for ai.roalla.com admin (`ADMIN_API_KEY`) |
| **Snippet** | Env text copied after registering an app |
| **Monthly allowance** | Max AI requests per app per month on AI Gateway |

---

## Related docs

| Doc | Location |
|-----|----------|
| Getting started (admins) | [GETTING-STARTED.md](./GETTING-STARTED.md) |
| Admin cheat sheet | [ADMIN-CHEATSHEET.md](./ADMIN-CHEATSHEET.md) |
| Full admin guide | [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) |
| Auth Hub platform page | https://sso.roalla.com/platform.html |
| Auth Hub admin guide | https://sso.roalla.com/guide.html |
| Auth Hub + AI developer guide | [ROALLA-HUB_Instructions.md](./ROALLA-HUB_Instructions.md) (Part 11 = AI Gateway) |
