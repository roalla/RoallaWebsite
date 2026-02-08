# Railway Database Connection (PG* Variables)

## "Please make sure your database server is running at Postgres.railway.internal:5432"

That means the **private** host isn’t reachable from your app. Use the **TCP proxy** (public) host/port instead.

**On your app (RoallaWebsite) → Variables, set:**

| Variable | Change to this reference |
|----------|--------------------------|
| **PGHOST** | `${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}` |
| **PGPORT** | `${{Postgres.RAILWAY_TCP_PROXY_PORT}}` |

Keep **PGUSER**, **PGPASSWORD**, and **PGDATABASE** as they are. Redeploy. The app will connect via the proxy (e.g. `yamanote.proxy.rlwy.net:23043`) and migrations should succeed.

---

## P1013 (Invalid Port) – Use PG* Variables Instead of DATABASE_URL

If you see **P1013: invalid port number in database URL**, the URL Railway is building is malformed. Common causes:

- **Password contains special characters** (`:`, `@`, `/`, `#`) so the URL parser gets confused.
- **PGPORT** didn’t resolve (empty or wrong), so the port segment is invalid.

The app is now set up to build the connection string **from separate PG* variables** and to **URL-encode** user and password. That avoids invalid URLs.

---

## In Railway: Use These Variables on the **App** (RoallaWebsite)

**Remove `DATABASE_URL`** from the app so it doesn’t override the PG* build. Then add these as **Variable References** (click `{}` → choose your **Postgres** service → choose the variable):

| Variable    | Reference value           | Required |
|------------|----------------------------|----------|
| `PGUSER`   | `${{Postgres.PGUSER}}`     | Yes      |
| `PGPASSWORD` | `${{Postgres.PGPASSWORD}}` | Yes    |
| `PGHOST`   | `${{Postgres.PGHOST}}`    | Yes      |
| `PGPORT`   | `${{Postgres.PGPORT}}`    | No (defaults to 5432) |
| `PGDATABASE` | `${{Postgres.PGDATABASE}}` | Yes   |

Replace **Postgres** with your database service name if it’s different (e.g. `PostgreSQL` → `${{PostgreSQL.PGUSER}}` etc.).

**Internal (private) connection:** use **PGHOST** and **PGPORT** as above (Railway’s default; no TCP proxy needed).

**Public (TCP proxy) connection:** if you get P1001 (can’t reach DB), add or use:

- `PGHOST` = `${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}`
- `PGPORT` = `${{Postgres.RAILWAY_TCP_PROXY_PORT}}`

(and keep **PGUSER**, **PGPASSWORD**, **PGDATABASE** as above).

---

## What the App Does

1. **Start script (`scripts/start.sh`)**  
   If `PGUSER`, `PGPASSWORD`, `PGHOST`, and `PGDATABASE` are set (PGPORT optional, defaults to 5432), it builds `DATABASE_URL` with proper encoding and runs Prisma migrations.

2. **Runtime (`src/lib/prisma.ts`)**  
   Prefers building the URL from PG* variables when all required ones are set; otherwise uses `DATABASE_URL`. So PG* overrides a broken or old `DATABASE_URL`.

**If it still doesn’t work:** Check the **deploy logs** in Railway. At container start you’ll see a line like:
`PG* vars: PGUSER=set PGPASSWORD=set PGHOST=set PGPORT=set PGDATABASE=set`
Any `MISSING` means that variable isn’t reaching the app—fix the reference (service name, or add the variable on the Postgres service).
