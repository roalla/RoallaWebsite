#!/bin/bash
# Don't exit on errors - we want the app to start even if migrations fail
set +e

# Build DATABASE_URL from PG* vars if set (fixes P1013 when password has : @ / etc.)
if [ -n "$PGUSER" ] && [ -n "$PGPASSWORD" ] && [ -n "$PGHOST" ] && [ -n "$PGPORT" ] && [ -n "$PGDATABASE" ]; then
  echo "Building DATABASE_URL from PG* variables (safe encoding)..."
  export DATABASE_URL=$(node -e "
    const u = encodeURIComponent(process.env.PGUSER || '');
    const p = encodeURIComponent(process.env.PGPASSWORD || '');
    const h = process.env.PGHOST || '';
    const port = String(process.env.PGPORT || '5432').trim();
    const d = process.env.PGDATABASE || 'railway';
    console.log('postgresql://' + u + ':' + p + '@' + h + ':' + port + '/' + d);
  ")
fi

if [ -z "$DATABASE_URL" ]; then
  echo "⚠ WARNING: DATABASE_URL is not set (and PGUSER/PGPASSWORD/PGHOST/PGPORT/PGDATABASE not all set)."
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
      echo "⚠⚠⚠ Database connection failed ⚠⚠⚠"
      echo ""
      echo "If you see P1001: use TCP Proxy (RAILWAY_USE_PUBLIC_DATABASE_URL.md)."
      echo "If you see P1013 (invalid port): use PG* variables instead of DATABASE_URL (see RAILWAY_PG_VARS_SETUP.md)."
      echo ""
    fi
  fi
done

# Start the Next.js app (even if migrations failed)
echo ""
echo "Starting Next.js application..."
exec next start
