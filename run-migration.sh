#!/bin/bash
# Railway Migration Script
# Run this after: railway login && railway link

echo "Running Prisma migration on Railway..."
railway run npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo "Your AccessRequest table has been created in Railway PostgreSQL."
else
    echo "❌ Migration failed. Check the error above."
    echo "Make sure you're logged in: railway login"
    echo "And linked to your project: railway link"
fi
