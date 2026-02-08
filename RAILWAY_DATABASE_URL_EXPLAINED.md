# Why ${{Postgres.DATABASE_URL}} Can Still Fail (Password / P1001)

You're doing the right thing: using Railway's variable reference **${{Postgres.DATABASE_URL}}** to connect your app to Postgres internally. Sometimes it still leads to:

- **P1001** – Can't reach database (private host not reachable from app)
- **Password authentication failed** – Postgres accepts connections but rejects the password

Here’s why that can happen and how to fix it.

---

## How ${{Postgres.DATABASE_URL}} Works

1. Your **app** has `DATABASE_URL = ${{Postgres.DATABASE_URL}}`.
2. Railway resolves that by reading the **Postgres** service’s **DATABASE_URL** variable.
3. Your app gets **whatever value the Postgres service has** for `DATABASE_URL`.

So the problem is never “I didn’t use the Railway feature.” The problem is **what value the Postgres service is actually providing** (and whether your app can reach that URL).

---

## Why the Password Can Be Wrong

The **Postgres** service has its own variables (e.g. `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE`). Railway’s Postgres template usually **builds** `DATABASE_URL` from those. But:

1. **DATABASE_URL on Postgres was edited**  
   If someone (or a template) set `DATABASE_URL` on the **Postgres** service to a **template** that uses the wrong variable name (e.g. `POSTGRES_PASSWORD` instead of `PGPASSWORD`), the password part can resolve to **empty or wrong**. Then when your app uses `${{Postgres.DATABASE_URL}}`, it gets that broken URL → “password authentication failed”.

2. **Different environment or service**  
   If your app is in a different **environment** than the Postgres you expect, or if the service name doesn’t match (e.g. you have “PostgreSQL” but use `Postgres` in the reference), the reference might point to another service or an old/stale value.

So: **the app is “connecting internally” correctly; the URL it receives from Postgres is wrong or unreachable.**

---

## What to Check in Railway

### 1. Postgres service – Variables tab

- Open the **Postgres** service (the one your app talks to).
- Check **DATABASE_URL**:
  - If it’s a **literal string** like `postgresql://postgres:somepassword@...`, that’s the URL your app gets. If Postgres later changed its password, this can be stale (only if it was set by hand).
  - If it’s a **template** (e.g. contains `${{...}}`), that template is resolved **on the Postgres service**. Make sure the password part uses the variable that actually exists on Postgres (Railway’s Postgres uses **PGPASSWORD**, not `POSTGRES_PASSWORD`). If the template is wrong, the resolved `DATABASE_URL` can have an empty/wrong password → your app then gets that via `${{Postgres.DATABASE_URL}}`.

### 2. App and Postgres – same project and environment

- **Project**: App and Postgres must be in the **same project**.
- **Environment**: They should be in the **same environment** (e.g. both “production”). Otherwise `${{Postgres.DATABASE_URL}}` might not point to the Postgres you think.

### 3. Service name

- The reference is **${{Postgres.DATABASE_URL}}** → the service name is **Postgres** (case-sensitive). If your database service is named differently (e.g. “PostgreSQL”), use that exact name: **${{PostgreSQL.DATABASE_URL}}**.

---

## Reliable Fix: Build the URL Yourself (Still “Internal”)

You keep using Railway’s variables (still “connecting internally”), but you **don’t** use `${{Postgres.DATABASE_URL}}`. You build the URL from the **individual** variables. That way:

- The **password** always comes from **PGPASSWORD** (no wrong or empty password from a bad template on Postgres).
- You can choose the **host**: private (for same-network) or **TCP proxy** (avoids P1001 when the private host isn’t reachable from your app).

**In your app service** (e.g. RoallaWebsite) → **Variables** → set:

**Option A – Private host (if it works in your setup):**

```text
postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
```

**Option B – Public TCP proxy (use if you get P1001 with the private host):**

```text
postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}:${{Postgres.RAILWAY_TCP_PROXY_PORT}}/${{Postgres.PGDATABASE}}
```

Use the `{}` variable reference and select the **Postgres** service, then each variable:  
`PGUSER`, `PGPASSWORD`, `PGHOST`/`PGPORT`/`PGDATABASE` **or** `RAILWAY_TCP_PROXY_DOMAIN`/`RAILWAY_TCP_PROXY_PORT`/`PGDATABASE`.

Replace **Postgres** with your actual database service name if it’s different.

---

## Summary

- **${{Postgres.DATABASE_URL}}** is the correct Railway feature for “connect internally.”
- The 500 / password errors happen because **the value of DATABASE_URL on the Postgres service** is wrong (bad template, wrong env, or wrong service name) **or** because the URL uses a host your app can’t reach (P1001).
- Fix by either: (1) correcting **Postgres**’s own `DATABASE_URL` (and env/service name), or (2) **not** using `${{Postgres.DATABASE_URL}}` and building the URL from **Postgres.PGUSER**, **Postgres.PGPASSWORD**, and host/port (private or TCP proxy) as above.
