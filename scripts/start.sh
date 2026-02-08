#!/bin/bash
# Don't exit on errors - we want the app to start even if migrations fail
set +e

# Debug: show which PG* vars are set (no values). PGPORT optional (default 5432).
echo "PG* vars: PGUSER=$([ -n "$PGUSER" ] && echo set || echo MISSING) PGPASSWORD=$([ -n "$PGPASSWORD" ] && echo set || echo MISSING) PGHOST=$([ -n "$PGHOST" ] && echo set || echo MISSING) PGPORT=$([ -n "$PGPORT" ] && echo set || echo MISSING) PGDATABASE=$([ -n "$PGDATABASE" ] && echo set || echo MISSING)"

# Build DATABASE_URL from PG* vars if set (fixes P1013 when password has : @ / etc.). PGPORT defaults to 5432.
if [ -n "$PGUSER" ] && [ -n "$PGPASSWORD" ] && [ -n "$PGHOST" ] && [ -n "$PGDATABASE" ]; then
  echo "Building DATABASE_URL from PG* variables (safe encoding)..."
  export DATABASE_URL=$(node -e "
    const u = encodeURIComponent(process.env.PGUSER || '');
    const p = encodeURIComponent(process.env.PGPASSWORD || '');
    const h = process.env.PGHOST || '';
    const port = String(process.env.PGPORT || '5432').trim().replace(/[^0-9]/g, '') || '5432';
    const d = process.env.PGDATABASE || 'railway';
    console.log('postgresql://' + u + ':' + p + '@' + h + ':' + port + '/' + d);
  ")
fi

if [ -z "$DATABASE_URL" ]; then
  echo "⚠ WARNING: DATABASE_URL is not set (and PGUSER/PGPASSWORD/PGHOST/PGPORT/PGDATABASE not all set)."
  echo "Starting Next.js application without database..."
  exec next start
fi

# Give private network time to be ready (avoids P1001 at container start)
echo "Waiting for private network (15s)..."
sleep 15

# Run migrations with retries (private DNS/connectivity can be slow)
echo "Running database migrations..."
MAX_TRIES=5
for i in $(seq 1 $MAX_TRIES); do
  if npx prisma migrate deploy 2>&1; then
    echo "✓ Migrations completed successfully"
    break
  fi
  if [ "$i" -lt "$MAX_TRIES" ]; then
    echo "⚠ Attempt $i failed. Retrying in 10s..."
    sleep 10
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
