# Fix P1001: Use Public TCP Proxy for DATABASE_URL

## The problem

You see:

```
Error: P1001: Can't reach database server at `Postgres.railway.internal:5432`
```

Your app is using Railway’s **private** hostname (`Postgres.railway.internal`). From your app container that hostname is sometimes not reachable (e.g. at container start or due to private networking limits). Migrations and runtime DB access then fail.

## Fix: Use the public TCP proxy URL

Connect to Postgres via Railway’s **public TCP proxy** instead of the private hostname. The app will use a URL like `something.proxy.rlwy.net:12345`, which is reachable from your app.

### Step 1: Enable TCP proxy on Postgres (if needed)

1. Open your **PostgreSQL** service in Railway.
2. Go to **Settings** → **Networking**.
3. Under **TCP Proxy**, ensure it’s enabled and note the **Proxy Domain** and **Port** (e.g. `roundhouse.proxy.rlwy.net`, `12345`).  
   If you don’t see it, add a TCP proxy and set the internal port to **5432**.

### Step 2: Set DATABASE_URL to the public URL in your app

1. Open your **RoallaWebsite** (or app) service.
2. Go to **Variables**.
3. Find **DATABASE_URL** (or add it).
4. Set the value using variable references to the **Postgres** service’s **TCP proxy** variables:

```text
postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}:${{Postgres.RAILWAY_TCP_PROXY_PORT}}/${{Postgres.PGDATABASE}}
```

- Use the `{}` (Variable Reference) and pick the **Postgres** service, then each variable:  
  `PGUSER`, `PGPASSWORD`, `RAILWAY_TCP_PROXY_DOMAIN`, `RAILWAY_TCP_PROXY_PORT`, `PGDATABASE`.
- If your database service has a different name (e.g. `PostgreSQL`), use that name instead of `Postgres` in the references.

So you’re only changing the **host** and **port** from the private ones to the public proxy:

- Before (private, can cause P1001):  
  `...@Postgres.railway.internal:5432/...`
- After (public, avoids P1001):  
  `...@${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}:${{Postgres.RAILWAY_TCP_PROXY_PORT}}/...`

### Step 3: Redeploy

Save the variable. Railway will redeploy. Migrations and app DB access should run without P1001.

## If you prefer a literal URL

1. In the **Postgres** service, open **Variables** (or **Connect**).
2. Copy the **public** connection string (the one using `*.proxy.rlwy.net` and a port, not `*.railway.internal`).
3. In your **app** service, set **DATABASE_URL** to that full string (no variable references).

## Notes

- Using the public TCP proxy uses the public internet and may incur [egress](https://docs.railway.app/pricing/plans#resource-usage-pricing); for many small apps this is acceptable.
- Private networking is not available during **build**; it’s only for runtime. Using the public URL avoids depending on private DNS at container start.
