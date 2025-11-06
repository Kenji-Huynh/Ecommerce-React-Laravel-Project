@echo off
setlocal

REM Seed 5 Kids, 5 Men, 5 Women demo products
cd /d "%~dp0backend"

REM Ensure database is migrated
php artisan migrate --force

REM Optionally ensure storage symlink (not required for external image URLs)
REM php artisan storage:link

php artisan demo:seed-products --kids=5 --men=5 --women=5

if %errorlevel% neq 0 (
  echo Seed failed with error code %errorlevel%.
  pause
  exit /b %errorlevel%
)

echo Done. Open the storefront at http://localhost:5173/home to see new products.
pause
