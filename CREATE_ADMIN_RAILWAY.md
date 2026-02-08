# Create admin when the database is on Railway

The `create-admin` script runs **on your PC** but the database lives **on Railway**. Railway’s default connection uses an internal host that only works from inside Railway, so the script gets “fetch failed” (P5010) unless you use a **public** connection.

## Option 1: Use Railway’s public database URL (recommended)

1. **Open Railway** → your project → click your **Postgres** service (the database).

2. **Get the public connection URL:**
   - Open the **Variables** or **Connect** tab.
   - Look for **`RAILWAY_TCP_PROXY_DOMAIN`** and **`RAILWAY_TCP_PROXY_PORT`** (or a “Public URL” / “Connect from outside” section).
   - You also need: **`PGUSER`**, **`PGPASSWORD`**, **`PGDATABASE`** (often `railway`).

3. **Build the URL** (replace with the real values from step 2):
   ```text
   postgresql://USER:PASSWORD@TCP_PROXY_DOMAIN:TCP_PROXY_PORT/PGDATABASE
   ```
   Example (values are fake):
   ```text
   postgresql://postgres:abc123@yamanote.proxy.rlwy.net:23043/railway
   ```
   If your password has special characters (e.g. `@`, `#`, `:`), they must be **URL-encoded** (e.g. `@` → `%40`). Or use the PG* variables in `.env.local` instead (see Option 2).

4. **Put it in `.env.local`** in your project root (same folder as `package.json`):
   ```env
   ADMIN_EMAIL=your@email.com
   ADMIN_PASSWORD=YourSecurePassword
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_TCP_PROXY_DOMAIN:YOUR_TCP_PROXY_PORT/railway
   ```
   Use your real email, password, and the URL from step 3.

5. **Run the script** in Cursor’s terminal:
   ```bash
   node scripts/create-admin.js
   ```

## Option 2: Use PG* variables in .env.local

If you prefer not to put the full URL in one line (e.g. password has special characters), put the **public** connection details in `.env.local`:

```env
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=YourSecurePassword
PGUSER=postgres
PGPASSWORD=your_db_password
PGHOST=your-tcp-proxy.rlwy.net
PGPORT=12345
PGDATABASE=railway
```

Get `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` from the Postgres service in Railway. **Important:** use the **public** host/port (`RAILWAY_TCP_PROXY_DOMAIN` / `RAILWAY_TCP_PROXY_PORT`), not the internal ones, so the script can reach the DB from your PC.

Then run:

```bash
node scripts/create-admin.js
```

## Option 3: Run the script on Railway (no public DB URL needed)

If you don’t want to put any DB credentials on your PC:

1. In **Railway** → your **app** service (not Postgres) → **Variables**, add:
   - `ADMIN_EMAIL` = your@email.com  
   - `ADMIN_PASSWORD` = your chosen password (at least 8 characters)

2. Use Railway’s **one-off run** (if your plan supports it):
   - Railway dashboard → your app service → **Settings** or **Deploy**.
   - Look for “Run command”, “One-off command”, or “Shell”.
   - Run: `node scripts/create-admin.js`
   - The app’s env (including `DATABASE_URL` or PG* from Railway) will be used, so no public URL is needed.

3. If your plan doesn’t have one-off run, use Option 1 or 2 and run the script from your PC with the public URL.

---

After the script succeeds, log in at **https://www.roalla.com/login** (or your site’s `/login`) with the same `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
