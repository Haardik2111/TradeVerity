#!/bin/sh
set -e

PORT_TO_USE="${PORT:-80}"
JVM_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT_TO_USE}"

# Detect Vercel Marketplace Neon / PostgreSQL variables automatically
DB_H="${PGHOST:-${POSTGRES_HOST:-${DB_HOST:-}}}"
DB_N="${PGDATABASE:-${POSTGRES_DATABASE:-${DB_NAME:-neondb}}}"
DB_U="${PGUSER:-${POSTGRES_USER:-${DB_USER:-}}}"
DB_P="${PGPASSWORD:-${POSTGRES_PASSWORD:-${DB_PASSWORD:-}}}"
DB_PT="${PGPORT:-${POSTGRES_PORT:-${DB_PORT:-5432}}}"

if [ -n "$DB_H" ] && [ -n "$DB_U" ]; then
  echo "[TradeVerity] Starting Spring Boot on port ${PORT_TO_USE} with PostgreSQL (${DB_H}:${DB_PT}/${DB_N})"
  exec java $JVM_OPTS \
    -Dspring.profiles.active=postgres \
    -Dspring.datasource.url="jdbc:postgresql://${DB_H}:${DB_PT}/${DB_N}?sslmode=require" \
    -Dspring.datasource.username="${DB_U}" \
    -Dspring.datasource.password="${DB_P}" \
    -jar /app/app.jar
else
  echo "[TradeVerity] No external Postgres env vars detected. Starting Spring Boot on port ${PORT_TO_USE} with embedded H2 (PostgreSQL mode)"
  exec java $JVM_OPTS \
    -Dspring.profiles.active=dev \
    -jar /app/app.jar
fi
