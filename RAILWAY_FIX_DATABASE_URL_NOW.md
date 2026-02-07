# URGENT: Fix DATABASE_URL in Railway

## The Problem

Your `DATABASE_URL` is not resolving correctly. Railway Variable Reference `${{Postgres.DATABASE_URL}}` is not working.

## Immediate Fix - Use Individual Variable References

### Step 1: Go to Railway Dashboard

1. Open your **RoallaWebsite** service
2. Click **Variables** tab
3. Find `DATABASE_URL`

### Step 2: Replace the Value

**Current (NOT WORKING):**
```
${{Postgres.DATABASE_URL}}
```

**Replace with (WORKING):**
```
postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
```

### Step 3: Use Variable References

For each part (`PGUSER`, `PGPASSWORD`, etc.):
1. Click the `{}` icon (Variable Reference button)
2. Select **Postgres** service
3. Select the variable (e.g., `PGUSER`)
4. Repeat for each variable

### Step 4: Save and Deploy

1. Click **Save**
2. Railway will automatically redeploy
3. Check logs - you should see: `✅ Database connected successfully`

## Alternative: Use Actual Connection String

If Variable References still don't work:

1. Go to **Postgres** service → **Variables** tab
2. Get these actual values:
   - `PGUSER`: `postgres`
   - `PGPASSWORD`: (reveal and copy — Railway uses PGPASSWORD, not POSTGRES_PASSWORD)
   - `PGHOST`: (should be actual domain, not template)
   - `PGPORT`: `5432`
   - `PGDATABASE`: `railway`

3. In **RoallaWebsite** → **Variables** → `DATABASE_URL`
4. Set to:
   ```
   postgresql://postgres:YOUR_ACTUAL_PASSWORD@ACTUAL_HOST:5432/railway
   ```

## Why This Happens

Railway Variable References sometimes don't resolve correctly when:
- The reference is nested (like `${{Postgres.DATABASE_URL}}` which itself contains templates)
- Services aren't properly linked
- Railway's runtime resolution fails

**Solution:** Use individual variable references - Railway resolves these more reliably.

## After Fixing

1. Try the form again
2. Check Railway logs for the DATABASE_URL preview
3. Should see successful database connection
