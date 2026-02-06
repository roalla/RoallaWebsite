#!/bin/bash
set -e

# Run migrations before starting the app
echo "Running database migrations..."
npx prisma migrate deploy || {
  echo "Migration failed, attempting to push schema directly..."
  npx prisma db push --accept-data-loss || {
    echo "Database setup failed. Please check your DATABASE_URL."
    exit 1
  }
}

# Start the Next.js app
echo "Starting Next.js application..."
exec next start
