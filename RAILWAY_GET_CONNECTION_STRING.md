# Getting the Actual PostgreSQL Connection String from Railway

## The Problem

Your `PGHOST` is set to `${{RAILWAY_PRIVATE_DOMAIN}}` which resolves to an internal address that doesn't work. You need the **external** Railway domain.

## Solution: Get the External Connection String

### Option 1: Check DATABASE_PUBLIC_URL (Easiest)

In your PostgreSQL service Variables tab, you should see:
- `DATABASE_PUBLIC_URL` - This is the **external** connection string!

1. Click on `DATABASE_PUBLIC_URL` to reveal/unmask it
2. Copy that value - it's your actual connection string
3. Use that in your Next.js app's `DATABASE_URL` variable

### Option 2: Get from Database/Connect Tab

1. In your PostgreSQL service, click on the **"Database"** tab (or **"Connect"** tab if available)
2. Look for:
   - **"Connection String"**
   - **"Postgres Connection URL"**
   - **"Public Connection URL"**
3. Copy the full connection string
4. It should look like: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`

### Option 3: Construct from Actual Values

If you can see the actual (non-template) values:

1. Look for variables that have **actual values** (not template variables like `${{...}}`)
2. You need:
   - **Host**: Should be something like `containers-us-west-xxx.railway.app` (NOT `${{RAILWAY_PRIVATE_DOMAIN}}`)
   - **Port**: `5432` (you can see this)
   - **User**: `postgres` (you can see this being edited)
   - **Password**: `POSTGRES_PASSWORD` (click to reveal)
   - **Database**: `railway` (from `POSTGRES_DB`)

3. Construct the connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@EXTERNAL_HOST:5432/railway
   ```

## What to Look For

✅ **Good connection string:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```
- Has `containers-xxx.railway.app` (external domain)

❌ **Bad connection string:**
```
postgresql://postgres:password@Postgres.railway.internal:5432/railway
```
- Has `railway.internal` (internal domain - won't work)

## Next Steps

1. **Get the actual connection string** using one of the options above
2. **Go to your Next.js app service** → Variables tab
3. **Find `DATABASE_URL`**
4. **Replace it** with the actual connection string (not a template variable)
5. **Save** - Railway will redeploy automatically
