# Railway Database Setup Guide

## Issue: Database Connection Failed

If you're seeing errors like:
```
Error: P1001: Can't reach database server at `Postgres.railway.internal:5432`
```

This means Railway can't connect to your PostgreSQL database. Here's how to fix it:

## Step 1: Verify PostgreSQL Service is Running

1. Go to your Railway dashboard
2. Check that your PostgreSQL service shows as "Running" (green status)
3. If it's not running, click on it and start it

## Step 2: Link PostgreSQL to Your App

1. In your Railway project, make sure you have:
   - A PostgreSQL service
   - Your Next.js app service

2. **Link the services:**
   - Click on your **Next.js app service**
   - Go to the **"Variables"** tab
   - Look for `DATABASE_URL` - it should be automatically set if PostgreSQL is linked
   - If `DATABASE_URL` is missing, the services aren't linked

3. **To link services:**
   - In your Next.js app service, go to **"Settings"**
   - Under **"Service Connections"** or **"Dependencies"**, add your PostgreSQL service
   - Railway will automatically set `DATABASE_URL`

## Step 3: Verify DATABASE_URL Format

The `DATABASE_URL` should look like:
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**NOT** like:
```
postgresql://postgres:password@Postgres.railway.internal:5432/railway
```

If you see `railway.internal`, it means Railway is trying to use an internal service name that isn't accessible.

## Step 4: Manual DATABASE_URL Setup (if needed)

If automatic linking doesn't work:

1. Go to your **PostgreSQL service** in Railway
2. Click on the **"Connect"** or **"Data"** tab
3. Copy the connection string (it should show the external URL)
4. Go to your **Next.js app service** → **Variables** tab
5. Add or update `DATABASE_URL` with the connection string from step 3

## Step 5: Redeploy

After fixing the DATABASE_URL:
1. Railway will automatically redeploy when you change environment variables
2. Or manually trigger a redeploy from the Deployments tab
3. Check the logs to verify migrations run successfully

## Testing the Connection

Once deployed, you can test if the database is working:
1. Visit your site
2. Try to submit a resources portal access request
3. Check Railway logs for any database errors

## Still Having Issues?

If the database still doesn't connect:
1. Check Railway status page for any outages
2. Verify your PostgreSQL service has enough resources
3. Check that your Railway plan supports PostgreSQL connections
4. Try creating a new PostgreSQL service and linking it fresh
