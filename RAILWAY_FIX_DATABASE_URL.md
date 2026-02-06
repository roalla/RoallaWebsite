# Fixing the Database Connection - Railway Variable Reference

## Current Situation

✅ **Your Next.js app** has `DATABASE_URL` set to: `${{Postgres.DATABASE_URL}}` (Variable Reference - correct!)

❌ **But your app is crashed** - likely because the PostgreSQL service's `DATABASE_URL` has the problematic template variable.

## The Problem

Your PostgreSQL service's `DATABASE_URL` probably has:
```
${{Postgres.DATABASE_URL}}postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:5432/${{PGDATABASE}}
```

The `${{RAILWAY_PRIVATE_DOMAIN}}` part resolves to `Postgres.railway.internal` which isn't accessible.

## Solution: Fix PostgreSQL Service's DATABASE_URL

### Option 1: Use Individual Variable References (Recommended)

In your **Next.js app** (RoallaWebsite), update `DATABASE_URL` to construct it from individual PostgreSQL variables:

1. Go to **RoallaWebsite** → **Variables** tab
2. Find `DATABASE_URL` (currently `${{Postgres.DATABASE_URL}}`)
3. Click to edit it
4. Replace the value with:
   ```
   postgresql://${{Postgres.PGUSER}}:${{Postgres.POSTGRES_PASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   ```
5. Use Variable References for each part:
   - `${{Postgres.PGUSER}}` → should resolve to `postgres`
   - `${{Postgres.POSTGRES_PASSWORD}}` → the actual password
   - `${{Postgres.PGHOST}}` → this will resolve `${{RAILWAY_PRIVATE_DOMAIN}}` to the actual private domain
   - `${{Postgres.PGPORT}}` → should be `5432`
   - `${{Postgres.PGDATABASE}}` → should be `railway`
6. Save

### Option 2: Fix PostgreSQL Service's DATABASE_URL

Alternatively, fix it at the source:

1. Go to your **Postgres service** → **Variables** tab
2. Find `DATABASE_URL`
3. Replace it with a properly constructed value using individual variables:
   ```
   postgresql://${{PGUSER}}:${{POSTGRES_PASSWORD}}@${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}
   ```
4. This way, when your Next.js app references `${{Postgres.DATABASE_URL}}`, it will get the correct value

## Why This Works

- Railway resolves `${{RAILWAY_PRIVATE_DOMAIN}}` in `PGHOST` to the actual private domain at runtime
- Using individual variable references gives Railway more control over resolution
- The connection will use Railway's internal private networking

## After Fixing

1. Railway will automatically redeploy your app
2. Check the deployment logs
3. You should see: `✓ Migrations completed successfully`
4. Your app should start successfully

## Quick Check

After updating, verify:
- ✅ App status changes from "Crashed" to "Online"
- ✅ Logs show successful database connection
- ✅ Migrations complete successfully
