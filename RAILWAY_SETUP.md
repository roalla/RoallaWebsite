# Railway PostgreSQL Setup Guide

## What is Prisma?

**Prisma** is a modern database toolkit that makes working with databases easier and safer. Think of it as a smart translator between your Next.js code and your PostgreSQL database.

**Simple Explanation:**
- Instead of writing complex SQL queries, you write simple TypeScript code
- Prisma automatically generates TypeScript types based on your database structure
- It provides type safety, so you catch errors before they happen
- It handles database migrations (updating your database structure safely)

**Example:**
```typescript
// Old way (raw SQL):
// SELECT * FROM access_requests WHERE email = 'user@example.com'

// Prisma way (simple TypeScript):
const request = await prisma.accessRequest.findFirst({
  where: { email: 'user@example.com' }
})
```

## Your Current Setup ✅

You've already completed:
1. ✅ Created PostgreSQL database on Railway
2. ✅ Added `DATABASE_URL` environment variable in Railway
3. ✅ Database is linked to your project

## Next Steps for Railway

Since Railway is your production environment, here's what to do:

### Step 1: Run the Initial Migration on Railway

You need to create the database table. Choose one method:

#### Method A: Railway CLI (Recommended)

1. **Install Railway CLI** (if not installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and link to your project**:
   ```bash
   railway login
   railway link
   ```

3. **Run the migration**:
   ```bash
   railway run npx prisma migrate deploy
   ```

This will create the `AccessRequest` table in your Railway PostgreSQL database.

#### Method B: Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your web service (not the PostgreSQL service)
3. Go to the "Settings" tab
4. Find "Deploy" section
5. Click "Redeploy" - this will trigger a new build
6. The migration will run automatically during build (because of the build script)

**Note:** The first deployment might show migration errors if the table doesn't exist yet. That's okay - we'll run it manually first.

### Step 2: Verify Migration Worked

After running the migration, check:

1. **Railway Logs**: Look for success message like:
   ```
   ✔ Applied migration: 20250106_init
   ```

2. **Or check your database** in Railway:
   - Go to PostgreSQL service
   - Click "Data" or "Query" tab
   - You should see an `AccessRequest` table

### Step 3: Test the System

1. Go to your live Railway site: `https://your-app.railway.app`
2. Navigate to the Resources section
3. Click "Request Access to read full articles"
4. Fill out and submit the form
5. Check Railway logs to confirm it saved successfully

### Step 4: View Your Data

**Option 1: Railway Dashboard**
- Go to PostgreSQL service → "Data" tab
- You'll see all access requests

**Option 2: Prisma Studio (Local)**
If you want to view locally, first add `DATABASE_URL` to your local `.env` file (copy from Railway), then:
```bash
npm run db:studio
```
Opens at http://localhost:5555

## How Railway Build Works

Your `package.json` is configured with:
- `postinstall`: Runs `prisma generate` after npm install
- `build`: Generates Prisma client and builds Next.js

**Railway automatically:**
1. Installs dependencies (`npm install` → triggers `postinstall` → generates Prisma client)
2. Runs build (`npm run build` → generates client again + builds Next.js)
3. Starts your app (`npm start`)

**For migrations:** Run them manually via Railway CLI or they'll run on first deployment.

## What Changed

**Before (In-Memory Storage):**
- ❌ Data lost on server restart
- ❌ No permanent record
- ❌ Not production-ready

**After (PostgreSQL on Railway):**
- ✅ Data stored permanently
- ✅ Survives deployments
- ✅ Can query and manage requests
- ✅ Production-ready
- ✅ Scales to handle many requests

## Troubleshooting

**"Can't reach database server" during migration:**
- Verify `DATABASE_URL` is correctly set in Railway environment variables
- Check that PostgreSQL service is running in Railway
- Ensure database service is linked to your app service

**"Migration already applied":**
- This is normal! It means the table already exists
- Railway will skip already-applied migrations safely

**"Table doesn't exist" errors:**
- Run the migration manually: `railway run npx prisma migrate deploy`
- Or trigger a new deployment in Railway dashboard

## Next Steps After Setup

Once migrations are complete:
1. ✅ All access requests will be stored in Railway PostgreSQL
2. ✅ Data persists across deployments
3. ✅ You can view requests in Railway's database interface
4. ✅ System is production-ready

The access request flow will work exactly the same, but now all data is permanently stored!
