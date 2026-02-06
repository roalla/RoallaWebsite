# Fixing Railway DATABASE_URL - Use Actual Connection String

## The Problem

The template variable `${{Postgres.DATABASE_URL}}` isn't working, and the complex template with `RAILWAY_PRIVATE_DOMAIN` resolves to an inaccessible internal address.

## Solution: Use the Actual Connection String

### Step 1: Get the Connection String from PostgreSQL Service

1. Go to your **Railway dashboard**
2. Click on your **PostgreSQL service** (not your Next.js app)
3. Look for one of these tabs:
   - **"Connect"** tab
   - **"Data"** tab  
   - **"Variables"** tab
4. Look for:
   - **"Connection String"**
   - **"Postgres Connection URL"**
   - **"DATABASE_URL"** (in the Variables tab)
5. Copy the **full connection string**

The connection string should look like:
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**Important:** Make sure it has:
- ✅ `containers-xxx.railway.app` (external Railway domain)
- ❌ NOT `Postgres.railway.internal` (internal domain that doesn't work)

### Step 2: Set It in Your Next.js App

1. Go to your **Next.js app service** in Railway
2. Click on **"Variables"** tab
3. Find `DATABASE_URL`
4. **Delete the entire current value** (the template variable)
5. **Paste the actual connection string** you copied from Step 1
6. Click **Save**

### Step 3: Verify

After saving:
1. Railway will automatically redeploy
2. Check the deployment logs
3. You should see: `✓ Migrations completed successfully`
4. If you still see connection errors, double-check the connection string format

## Alternative: Get Connection String from PostgreSQL Variables

If you can't find it in the Connect/Data tab:

1. Go to your **PostgreSQL service** → **Variables** tab
2. Look for these variables:
   - `PGHOST` (should be something like `containers-us-west-xxx.railway.app`)
   - `PGPORT` (usually `5432`)
   - `PGUSER` (usually `postgres`)
   - `POSTGRES_PASSWORD` (the password)
   - `PGDATABASE` (the database name, usually `railway`)

3. Construct the connection string manually:
   ```
   postgresql://PGUSER:POSTGRES_PASSWORD@PGHOST:PGPORT/PGDATABASE
   ```

   Example:
   ```
   postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:5432/railway
   ```

## What the Connection String Should Look Like

✅ **Correct format:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

❌ **Wrong formats:**
```
${{Postgres.DATABASE_URL}}  (template variable - not resolving)
postgresql://...@Postgres.railway.internal:5432/...  (internal domain - not accessible)
${{Postgres.DATABASE_URL}}postgresql://...  (malformed template)
```

## After Fixing

1. Railway will automatically redeploy
2. Check logs for: `✓ Migrations completed successfully`
3. Your database connection should work!
4. Test by submitting a resources portal access request
