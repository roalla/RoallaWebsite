# PostgreSQL Database Setup Guide for Railway

## What is Prisma?

**Prisma** is a modern database toolkit that makes working with databases easier and safer. Think of it as a bridge between your Next.js application and your PostgreSQL database.

**Key Benefits:**
- **Type Safety**: Automatically generates TypeScript types based on your database schema
- **Easy Queries**: Write database queries using simple JavaScript/TypeScript instead of raw SQL
- **Migrations**: Safely update your database structure over time
- **Developer Experience**: Great tooling and error messages

**How it works:**
1. You define your database structure in `prisma/schema.prisma` (like a blueprint)
2. Prisma generates a client library (`@prisma/client`) that you use in your code
3. When you need to change the database, you create migrations that Prisma applies safely

## Railway Setup (Your Current Setup)

Since you're using Railway with PostgreSQL already connected:

### ✅ What You've Already Done:
1. Created PostgreSQL database on Railway
2. Added `DATABASE_URL` environment variable in Railway
3. Database is linked to your project

### Next Steps:

#### Step 1: Generate Prisma Client

This creates the TypeScript code that lets your app talk to the database:

```bash
npm run db:generate
```

#### Step 2: Create Database Tables (Migration)

This creates the `AccessRequest` table in your Railway PostgreSQL database:

```bash
npm run db:migrate
```

When prompted, give it a name like `init` or `add_access_requests_table`

#### Step 3: Verify It Works

Test that the database connection works:

```bash
# Open Prisma Studio (optional - web interface to view your database)
npm run db:studio
```

This will open a web interface at http://localhost:5555 where you can see your database tables and data.

#### Step 4: Deploy to Railway

Since Railway is your production environment:

1. **Push your code** to your connected Git repository
2. Railway will automatically:
   - Install dependencies (including Prisma)
   - Run `npm run build` which includes Prisma client generation
   - Deploy your app

3. **For the first deployment**, you may need to run migrations on Railway:
   - Option A: Add a build script in Railway to run migrations
   - Option B: Run migrations manually via Railway's console/CLI

### Railway-Specific Configuration

**For Production Migrations on Railway:**

You can add this to your `package.json` build script, or create a Railway build command:

```json
"scripts": {
  "postinstall": "prisma generate",
  "build": "prisma generate && prisma migrate deploy && next build"
}
```

Or set a Railway build command:
```
prisma generate && prisma migrate deploy && next build
```

**Note:** `prisma migrate deploy` is safe for production - it only applies pending migrations without prompting.

### Environment Variables on Railway

Make sure these are set in Railway:
- ✅ `DATABASE_URL` - Your PostgreSQL connection string (already set)
- ✅ `RESEND_API_KEY` - For email notifications (if not already set)

### Testing the Setup

1. **Submit a test access request** from your live site
2. **Check Railway logs** to see if it's working
3. **View in Prisma Studio** (if running locally) or use Railway's database interface

### Troubleshooting

**"Can't reach database server":**
- Check that `DATABASE_URL` is correctly set in Railway
- Verify the PostgreSQL service is running in Railway
- Check Railway logs for connection errors

**"Migration failed":**
- Check Railway logs for specific error
- Verify database permissions
- Try running `npx prisma migrate reset` (⚠️ deletes all data) if needed

**"Prisma Client not generated":**
- Run `npm run db:generate` locally
- Or ensure Railway runs `prisma generate` during build

### What Happens Now

Once migrations are run:
- ✅ All access requests are stored permanently in PostgreSQL
- ✅ Data persists across deployments
- ✅ You can query requests via Prisma Studio or Railway's database tools
- ✅ System is production-ready
