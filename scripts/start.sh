#!/bin/bash
# Don't exit on errors - we want the app to start even if migrations fail
set +e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠ WARNING: DATABASE_URL is not set."
  echo "Starting Next.js application without database..."
  exec next start
fi

# Give private network a moment to be ready (avoids P1001 at container start)
echo "Waiting for network..."
sleep 5

# Run migrations with retries (private DNS can be slow to resolve)
echo "Running database migrations..."
MAX_TRIES=3
for i in $(seq 1 $MAX_TRIES); do
  if npx prisma migrate deploy 2>&1; then
    echo "✓ Migrations completed successfully"
    break
  fi
  if [ "$i" -lt "$MAX_TRIES" ]; then
    echo "⚠ Attempt $i failed. Retrying in 5s..."
    sleep 5
  else
    echo "⚠ Migration failed. Attempting to push schema directly..."
    if npx prisma db push --accept-data-loss 2>&1; then
      echo "✓ Schema pushed successfully"
    else
      echo "⚠⚠⚠ Database connection failed (P1001) ⚠⚠⚠"
      echo ""
      echo "Private host (Postgres.railway.internal) is not reachable from this container."
      echo "Use the PUBLIC connection string instead. See: RAILWAY_USE_PUBLIC_DATABASE_URL.md"
      echo ""
      echo "In Railway: RoallaWebsite → Variables → DATABASE_URL"
      echo "Set to (use TCP Proxy - replace Postgres with your DB service name):"
      echo "  postgresql://\${{Postgres.PGUSER}}:\${{Postgres.PGPASSWORD}}@\${{Postgres.RAILWAY_TCP_PROXY_DOMAIN}}:\${{Postgres.RAILWAY_TCP_PROXY_PORT}}/\${{Postgres.PGDATABASE}}"
      echo ""
    fi
  fi
done

# Start the Next.js app (even if migrations failed)
echo ""
echo "Starting Next.js application..."
exec next start
