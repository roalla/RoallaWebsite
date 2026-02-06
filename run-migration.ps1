# Railway Migration Script
# Run this after: railway login && railway link

Write-Host "Running Prisma migration on Railway..." -ForegroundColor Cyan
railway run npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration completed successfully!" -ForegroundColor Green
    Write-Host "Your AccessRequest table has been created in Railway PostgreSQL." -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed. Check the error above." -ForegroundColor Red
    Write-Host "Make sure you're logged in: railway login" -ForegroundColor Yellow
    Write-Host "And linked to your project: railway link" -ForegroundColor Yellow
}
