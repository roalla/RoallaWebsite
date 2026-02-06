# Setting Up Railway Variable Reference for Database Connection

## The Solution: Use Variable Reference

Railway uses **Variable References** to link services, not service dependencies. Here's how to set it up:

## Step 1: In Your Next.js App - Add Variable Reference

1. Go to your **Next.js app service** (not PostgreSQL)
2. Click on **"Variables"** tab
3. Click **"+ New Variable"** button
4. For the variable name, enter: `DATABASE_URL`
5. For the value, click the **"Variable Reference"** option (or use the `{}` icon)
6. Select your **PostgreSQL service** from the dropdown
7. Select the variable: `DATABASE_URL` (from PostgreSQL service)
8. Save

This creates a reference like: `${{Postgres.DATABASE_URL}}` but Railway will resolve it to the actual private connection string.

## Step 2: Verify the Reference

After creating the Variable Reference:
1. In your Next.js app → Variables tab
2. You should see `DATABASE_URL` with a reference icon
3. It should show it's referencing your PostgreSQL service's `DATABASE_URL`
4. Railway will automatically resolve this to the private connection string at runtime

## Step 3: Check PostgreSQL Service Variables

Make sure your PostgreSQL service has `DATABASE_URL` set correctly:

1. Go to your **PostgreSQL service** → **Variables** tab
2. Check that `DATABASE_URL` exists
3. It should be set to use the private/internal connection
4. If it's using `${{RAILWAY_PRIVATE_DOMAIN}}`, that's fine - Railway will resolve it

## Alternative: Reference Individual Variables

If `DATABASE_URL` in PostgreSQL isn't set correctly, you can reference individual variables:

1. In your **Next.js app** → Variables → **"+ New Variable"**
2. Create `DATABASE_URL` using Variable Reference
3. Or construct it by referencing individual PostgreSQL variables:
   - `PGHOST` → `${{Postgres.PGHOST}}`
   - `PGPORT` → `${{Postgres.PGPORT}}`
   - `PGUSER` → `${{Postgres.PGUSER}}`
   - `POSTGRES_PASSWORD` → `${{Postgres.POSTGRES_PASSWORD}}`
   - `PGDATABASE` → `${{Postgres.PGDATABASE}}`

4. Then construct `DATABASE_URL` as:
   ```
   postgresql://${{Postgres.PGUSER}}:${{Postgres.POSTGRES_PASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
   ```

## Important Notes

- ✅ Variable References use Railway's internal networking (private)
- ✅ Railway resolves the references at runtime
- ✅ The connection will be private/internal, not public
- ✅ Make sure both services are in the same Railway project

## Troubleshooting

If the reference isn't working:
1. Make sure both services are in the same Railway project
2. Verify the PostgreSQL service name matches (e.g., "Postgres" vs "PostgreSQL")
3. Check that the referenced variable exists in the PostgreSQL service
4. Railway will resolve `${{RAILWAY_PRIVATE_DOMAIN}}` to the actual private domain at runtime
