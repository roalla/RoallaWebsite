# Fix P1013 (Invalid Port) – Use PG* Variables Instead of DATABASE_URL

If you see **P1013: invalid port number in database URL**, the URL Railway is building is malformed. Common causes:

- **Password contains special characters** (`:`, `@`, `/`, `#`) so the URL parser gets confused.
- **PGPORT** didn’t resolve (empty or wrong), so the port segment is invalid.

The app is now set up to build the connection string **from separate PG* variables** and to **URL-encode** user and password. That avoids invalid URLs.

---

## In Railway: Use Five Variables Instead of DATABASE_URL

**Remove or leave DATABASE_URL empty**, and on your **app** service (e.g. RoallaWebsite) add these variables as **Variable References** to your Postgres service:

| Variable   | Value (Reference)           |
|-----------|-----------------------------|
| `PGUSER`  | `${{Postgres.PGUSER}}`      |
| `PGPASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `PGHOST`  | `${{Postgres.PGHOST}}`     |
| `PGPORT`  | `${{Postgres.PGPORT}}`     |
| `PGDATABASE` | `${{Postgres.PGDATABASE}}` |

For each one: **Variables** → **New Variable** → name on the left, value use the `{}` reference and select **Postgres** and the variable. Replace **Postgres** with your DB service name if different.

**Internal (private) connection:** use **PGHOST** and **PGPORT** as above (Railway’s default; no TCP proxy needed).

**Public (TCP proxy) connection:** if you get P1001 (can’t reach DB), add or use:

- `PGHOST` = `${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}`
- `PGPORT` = `${{Postgres.RAILWAY_TCP_PROXY_PORT}}`

(and keep **PGUSER**, **PGPASSWORD**, **PGDATABASE** as above).

---

## What the App Does

1. **Start script (`scripts/start.sh`)**  
   If `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` are all set, it builds `DATABASE_URL` with proper encoding and exports it before running Prisma migrations.

2. **Runtime (`src/lib/prisma.ts`)**  
   If `DATABASE_URL` is missing or not a valid `postgresql://` URL, it builds the URL from the same PG* variables with encoding and uses that for Prisma.

So you can rely on the five PG* variables only; no need to set a raw `DATABASE_URL` that might contain special characters.
