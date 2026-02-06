#!/bin/bash
set -e

# Run migrations before starting the app
echo "Running database migrations..."
npx prisma migrate deploy

# Start the Next.js app
echo "Starting Next.js application..."
exec next start
