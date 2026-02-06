# Setting Up Private Railway-to-Railway Database Connection

## The Problem

You want to use a private connection between your Next.js app and PostgreSQL (both on Railway), but the template variables aren't resolving correctly.

## Solution: Use Railway's Service Linking (Recommended)

Railway can automatically set up the private connection when services are linked:

### Step 1: Link the Services

1. Go to your **Next.js app service** (not PostgreSQL)
2. Click on **"Settings"** tab
3. Look for **"Service Connections"** or **"Dependencies"** section
4. Click **"Add Service"** or **"Connect Service"**
5. Select your **PostgreSQL service**
6. Railway will automatically create a `DATABASE_URL` variable with the correct private connection

### Step 2: Verify the Auto-Created Variable

1. Go to your **Next.js app service** → **Variables** tab
2. Look for `DATABASE_URL` - Railway should have automatically created it
3. It should show the actual connection string (not a template variable)
4. The connection string will use Railway's internal networking (private and secure)

## Alternative: Manual Private Connection String

If automatic linking doesn't work, you can construct the private connection manually:

### Get the Actual Private Domain

1. In your **PostgreSQL service** → **Variables** tab
2. Look for variables that show the **actual private domain** (not `${{RAILWAY_PRIVATE_DOMAIN}}`)
3. Or check the **"Database"** tab for connection info
4. The private domain should be something like: `postgres.railway.internal` or a specific internal hostname

### Construct the Connection String

Once you have the actual private domain, construct:
```
postgresql://postgres:POSTGRES_PASSWORD@PRIVATE_DOMAIN:5432/railway
```

Where:
- `postgres` = the user (from `POSTGRES_USER`)
- `POSTGRES_PASSWORD` = the actual password value (reveal it)
- `PRIVATE_DOMAIN` = the actual private domain (not the template variable)
- `5432` = the port
- `railway` = the database name (from `POSTGRES_DB`)

## Why Private Connections Are Secure

Even though it's "private" or "internal", Railway's internal networking is:
- ✅ Only accessible within your Railway project
- ✅ Not exposed to the public internet
- ✅ Encrypted and secure
- ✅ Faster than external connections

## Recommended Approach

**Use Railway's automatic service linking** (Step 1 above). This is the cleanest solution and Railway will handle all the connection details automatically.
