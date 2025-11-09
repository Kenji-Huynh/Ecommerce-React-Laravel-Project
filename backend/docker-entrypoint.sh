#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Run migrations
echo "📦 Running database migrations..."
php artisan migrate --force

# Seed database (optional - comment out if you don't want to reseed every time)
if [ "$APP_ENV" = "production" ] && [ ! -f /app/storage/.seeded ]; then
    echo "🌱 Seeding database..."
    php artisan db:seed --force
    touch /app/storage/.seeded
fi

# Start Laravel server
echo "✅ Starting server..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
