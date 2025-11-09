# Multi-stage build for Laravel on Render
FROM php:8.3-fpm-alpine AS base

# Install system dependencies
RUN apk update && apk add --no-cache \
    curl \
    zip \
    unzip \
    git \
    mysql-client \
    libzip \
    libpng \
    libjpeg-turbo \
    freetype \
    oniguruma

# Install build dependencies (needed for compiling PHP extensions)
RUN apk add --no-cache --virtual .build-deps \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    zip \
    gd \
    fileinfo

# Remove build dependencies to reduce image size
RUN apk del .build-deps

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first (for layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Copy application code
COPY . .

# Create required directories
RUN mkdir -p \
    bootstrap/cache \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    && chmod -R 775 storage bootstrap/cache

# Run Laravel optimization commands
RUN php artisan package:discover --ansi

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Use entrypoint to run migrations before starting server
ENTRYPOINT ["docker-entrypoint.sh"]
