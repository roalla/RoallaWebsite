# Setting Up Private Railway Database Connection

## Your Situation

- **Public URL**: `yamanote.proxy.rlwy.net:23043` (you don't want to use this)
- **Need**: Private/internal connection between your Next.js app and PostgreSQL (both on Railway)

## Solution: Use Railway Service Linking

### Step 1: Link Services in Railway

1. Go to your **Next.js app service** (not PostgreSQL)
2. Click **"Settings"** tab
3. Look for **"Service Connections"** or **"Dependencies"**
4. Click **"Add Service"** or **"Connect Service"**
5. Select your **PostgreSQL service** from the list
6. Save/Link

### Step 2: Railway Will Auto-Create DATABASE_URL

After linking:
1. Go to your **Next.js app** → **Variables** tab
2. Railway should have automatically created `DATABASE_URL`
3. It will use the private/internal connection (not the public proxy)
4. The connection string will use Railway's internal networking

### Step 3: Remove Any Manual DATABASE_URL

If you have a manual `DATABASE_URL` variable:
1. In your **Next.js app** → **Variables** tab
2. Find `DATABASE_URL`
3. If it has a template variable like `${{Postgres.DATABASE_URL}}...`, **delete it**
4. Railway's auto-created one will be used instead

## Alternative: Manual Private Connection String

If automatic linking doesn't work, you can construct the private connection:

### Get the Private Domain

The private domain should be visible in your PostgreSQL service. Look for:
- A variable that shows the actual private hostname (not `${{RAILWAY_PRIVATE_DOMAIN}}`)
- Or check the **"Database"** tab for connection details

### Construct Private Connection String

```
postgresql://postgres:YOUR_PASSWORD@PRIVATE_HOST:5432/railway
```

Where:
- `postgres` = user (from `POSTGRES_USER`)
- `YOUR_PASSWORD` = actual password (reveal `POSTGRES_PASSWORD`)
- `PRIVATE_HOST` = the actual private domain (not the template variable)
- `5432` = port
- `railway` = database name

## Why Private is Better

- ✅ Only accessible within Railway's internal network
- ✅ Not exposed to public internet
- ✅ Faster (no proxy)
- ✅ More secure

## Next Steps

1. **Try service linking first** (Step 1-2 above)
2. If that doesn't work, check your PostgreSQL service for the actual private domain value
3. Construct the connection string manually if needed
