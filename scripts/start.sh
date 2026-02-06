#!/bin/bash
# Don't exit on errors - we want the app to start even if migrations fail
set +e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠ WARNING: DATABASE_URL is not set."
  echo "Starting Next.js application without database..."
  exec next start
fi

# Run migrations before starting the app
echo "Running database migrations..."
if npx prisma migrate deploy 2>&1; then
  echo "✓ Migrations completed successfully"
else
  echo "⚠ Migration failed. Attempting to push schema directly..."
  if npx prisma db push --accept-data-loss 2>&1; then
    echo "✓ Schema pushed successfully"
  else
    echo "⚠⚠⚠ Database connection failed ⚠⚠⚠"
    echo ""
    echo "The app will start, but database features will not work."
    echo ""
    echo "To fix this, please verify in Railway:"
    echo "1. Your PostgreSQL service is running"
    echo "2. The PostgreSQL service is linked to your app"
    echo "3. The DATABASE_URL environment variable is set correctly"
    echo ""
    echo "You can check your DATABASE_URL in Railway:"
    echo "  - Go to your app's Variables tab"
    echo "  - Look for DATABASE_URL (it should be auto-set when you link PostgreSQL)"
    echo ""
    echo "If DATABASE_URL is missing or incorrect, you can:"
    echo "  - Re-link your PostgreSQL service to the app"
    echo "  - Or manually set DATABASE_URL to: postgresql://user:password@host:port/database"
    echo ""
  fi
fi

# Start the Next.js app (even if migrations failed)
echo ""
echo "Starting Next.js application..."
exec next start
