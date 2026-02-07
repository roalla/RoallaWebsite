# Fixing DATABASE_URL Variable Reference Issue

## The Problem

The error shows:
```
Invalid `prisma.accessRequest.create()` invocation:
error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

This means your `DATABASE_URL` in Railway is not resolving correctly. The Variable Reference `${{Postgres.DATABASE_URL}}` is likely not being resolved at runtime.

## Solution: Fix the DATABASE_URL in Railway

### Step 1: Check Current DATABASE_URL Value

1. Go to your **RoallaWebsite** service in Railway
2. Click **Variables** tab
3. Find `DATABASE_URL`
4. Check what the actual value is (it might show `${{Postgres.DATABASE_URL}}` as text, not resolved)

### Step 2: Get the Actual Connection String from PostgreSQL

1. Go to your **Postgres** service in Railway
2. Click **Variables** tab
3. Look for `DATABASE_URL` or construct it from individual variables:
   - `PGUSER` (usually `postgres`)
   - `PGPASSWORD` (reveal this value — Railway uses **PGPASSWORD**, not POSTGRES_PASSWORD)
   - `PGHOST` (should be the actual private domain, not `${{RAILWAY_PRIVATE_DOMAIN}}`)
   - `PGPORT` (usually `5432`)
   - `PGDATABASE` (usually `railway`)

### Step 3: Update DATABASE_URL in Your Next.js App

**Option A: Use Individual Variable References (Recommended)**

In your **RoallaWebsite** service → **Variables** tab:

1. Find `DATABASE_URL`
2. Edit it
3. Set the value to:
   ```
   postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   ```
4. Make sure each part uses Variable Reference (click the `{}` icon for each variable)
5. Save

**Option B: Use the Actual Connection String**

If Variable References aren't working:

1. Get the actual connection string from your PostgreSQL service
2. In your **RoallaWebsite** service → **Variables** tab
3. Find `DATABASE_URL`
4. Replace it with the actual connection string (not a template variable)
5. It should look like:
   ```
   postgresql://postgres:password@postgres.railway.internal:5432/railway
   ```
   OR (if using public):
   ```
   postgresql://postgres:password@yamanote.proxy.rlwy.net:23043/railway
   ```

### Step 4: Verify

After updating:
1. Railway will automatically redeploy
2. Check the deployment logs
3. You should see: `✅ Database connected successfully`
4. The API should work now

## Why This Happens

Railway Variable References (`${{Service.Variable}}`) should resolve automatically, but sometimes:
- The services aren't properly linked
- The variable name doesn't match exactly
- Railway's runtime resolution fails

Using individual variable references (Option A) is more reliable because Railway resolves each one separately.

## Quick Test

After fixing, try submitting the resources portal access request form again. It should work now!
