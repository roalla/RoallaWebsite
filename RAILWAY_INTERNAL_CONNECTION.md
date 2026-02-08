# Use Internal (Private) Connection on Railway

You want to connect to Postgres via **internal** (`Postgres.railway.internal:5432`), not the external TCP proxy. Railway’s private network can work; it often fails when the app uses the **Legacy** runtime.

---

## 1. Switch your **app** (RoallaWebsite) to V2 runtime

Private networking from app to Postgres is much more reliable with **Runtime V2** on the **app** service (not the Postgres service).

1. In Railway, open your **app** service (e.g. RoallaWebsite).
2. Go to **Settings**.
3. Find **Runtime** (or **Builder** / deployment settings).
4. If you see **Legacy** vs **V2**, select **V2**.
5. Save and **redeploy** the app.

V2 improves private network init so the app can reach `Postgres.railway.internal` at startup.

---

## 2. Keep internal host and port

On your **app** service → **Variables**, use the **private** references (not the TCP proxy):

| Variable    | Use this (internal)              |
|------------|-----------------------------------|
| **PGHOST** | `${{Postgres.PGHOST}}`          |
| **PGPORT** | `${{Postgres.PGPORT}}`          |

So **PGHOST** and **PGPORT** should point to **PGHOST** and **PGPORT** from the Postgres service (which are the private host and 5432). Do **not** use `RAILWAY_TCP_PROXY_DOMAIN` or `RAILWAY_TCP_PROXY_PORT` if you want internal-only.

---

## 3. Same project and environment

- App and Postgres must be in the **same project**.
- They must be in the **same environment** (e.g. both **production**). Private networking is per environment.

---

## 4. Retries and delay

Your `scripts/start.sh` already waits a few seconds and retries migrations so the private network is up before connecting. With V2, that is usually enough.

---

## If it still fails

If you still see “Can’t reach database server at Postgres.railway.internal:5432” after switching to V2 and redeploying:

- Try one more **redeploy** (sometimes the new runtime needs a clean deploy).
- In Railway, confirm there are no warnings or errors on the Postgres service.
- If P1001 continues, use the **TCP proxy**: set **PGHOST** = `${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}` and **PGPORT** = `${{Postgres.RAILWAY_TCP_PROXY_PORT}}` (e.g. yamanote.proxy.rlwy.net:23043). Traffic still goes to your DB; only the host/port change.

Summary: **Use internal by keeping PGHOST/PGPORT as `${{Postgres.PGHOST}}` and `${{Postgres.PGPORT}}`, and switch the app to Runtime V2. If P1001 persists, switch to the TCP proxy variables above.**
